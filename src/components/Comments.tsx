import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Github,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { openGitHubPopup } from "../lib/popup";

/**
 * Комментарии раздела.
 *
 * Основной режим — Giscus: обсуждение живёт на GitHub Discussions, но читается
 * и пишется прямо на странице, без перехода на github.com. Виджет включается
 * сам, как только на репозиторий установлено приложение giscus. Проверка идёт
 * через публичный API giscus (403 «not installed» — приложения нет).
 *
 * Пока приложения нет, работает резервный режим на GitHub Issues: список и
 * ответы читаются здесь, а публикация открывает компактное окно GitHub с уже
 * заполненным текстом. В теле остаётся только авторский текст — служебная
 * шапка и подпись не добавляются, маркер страницы скрыт в HTML-комментарии.
 */

const REPO = "Pcuxxx/LonaWIKI";
const GITHUB = `https://github.com/${REPO}`;
const API = `https://api.github.com/repos/${REPO}`;
const GISCUS_API = "https://giscus.app/api/discussions";
const CACHE_TTL = 5 * 60 * 1000;
const MARKER = "lonawiki:comment";

const GISCUS_REPO_ID = import.meta.env.VITE_GISCUS_REPO_ID ?? "R_kgDOVWzL7Q";
const GISCUS_CATEGORY = "General";
const GISCUS_CATEGORY_ID = import.meta.env.VITE_GISCUS_CATEGORY_ID ?? "DIC_kwDOVWzL7c4DJseC";

interface IssueUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

interface CommentIssue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  created_at: string;
  comments: number;
  user: IssueUser | null;
}

interface IssueReply {
  id: number;
  body: string | null;
  created_at: string;
  html_url: string;
  user: IssueUser | null;
}

type Status = "idle" | "loading" | "ready" | "error";
type GiscusState = "checking" | "ready" | "off";
type ThreadState = { open: boolean; loading?: boolean; error?: boolean; items?: IssueReply[] };

function cacheKey(pageId: string) {
  return `lonawiki:comments:${pageId}:v2`;
}

function draftKey(pageId: string) {
  return `lonawiki:comment-draft:${pageId}`;
}

function readCache(pageId: string): CommentIssue[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(cacheKey(pageId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at?: number; items?: unknown };
    if (!parsed.at || Date.now() - parsed.at > CACHE_TTL || !Array.isArray(parsed.items)) return null;
    return parsed.items as CommentIssue[];
  } catch {
    return null;
  }
}

function writeCache(pageId: string, items: CommentIssue[]) {
  try {
    window.sessionStorage.setItem(cacheKey(pageId), JSON.stringify({ at: Date.now(), items }));
  } catch {
    /* приватный режим — просто не кэшируем */
  }
}

function readDraft(pageId: string) {
  try {
    return window.localStorage.getItem(draftKey(pageId)) ?? "";
  } catch {
    return "";
  }
}

function writeDraft(pageId: string, value: string) {
  try {
    if (value) window.localStorage.setItem(draftKey(pageId), value);
    else window.localStorage.removeItem(draftKey(pageId));
  } catch {
    /* приватный режим — черновик не сохраняем */
  }
}

function markerFor(pageId: string) {
  return `<!-- ${MARKER} ${pageId} -->`;
}

function isCommentIssue(value: unknown, pageId: string): value is CommentIssue {
  if (!value || typeof value !== "object") return false;
  const issue = value as Partial<CommentIssue> & { pull_request?: unknown };
  if (typeof issue.number !== "number" || typeof issue.title !== "string" || issue.pull_request) {
    return false;
  }
  return (
    (issue.body ?? "").includes(markerFor(pageId)) ||
    issue.title.startsWith(`[Комментарий] ${pageId}:`)
  );
}

function isReply(value: unknown): value is IssueReply {
  if (!value || typeof value !== "object") return false;
  const reply = value as Partial<IssueReply>;
  return typeof reply.id === "number" && typeof reply.created_at === "string";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}

/** Убрать скрытый маркер и старую служебную шапку, оставив текст автора. */
function visibleText(body: string | null): string {
  let raw = (body ?? "").replace(/<!--\s*lonawiki:[\s\S]*?-->/gi, "").trim();
  if (raw.startsWith("**Страница:**")) {
    const firstGap = raw.indexOf("\n\n");
    if (firstGap !== -1) {
      const footer = raw.lastIndexOf("\n\n---");
      raw = raw.slice(firstGap + 2, footer > firstGap ? footer : undefined).trim();
    }
  }
  return raw;
}

function issueTitle(text: string, pageTitle: string) {
  const firstLine = text
    .split(/\r?\n/)
    .find((line) => line.trim().length > 0)
    ?.replace(/^[#>*_`\s-]+/, "")
    .trim();
  if (!firstLine) return `Комментарий к разделу «${pageTitle}»`;
  return firstLine.length > 90 ? `${firstLine.slice(0, 89)}…` : firstLine;
}

/** Проверить, установлено ли приложение giscus на репозиторий. */
function useGiscus(pageId: string): GiscusState {
  const [state, setState] = useState<GiscusState>("checking");

  useEffect(() => {
    const key = "lonawiki:giscus:v2";
    try {
      const cached = window.sessionStorage.getItem(key);
      if (cached === "ready" || cached === "off") {
        setState(cached);
        return;
      }
    } catch {
      /* без кэша */
    }

    let alive = true;
    const abort = new AbortController();
    const timer = window.setTimeout(() => abort.abort(), 3500);
    const url =
      `${GISCUS_API}?repo=${encodeURIComponent(REPO)}` +
      `&term=${encodeURIComponent(`lonawiki:${pageId}`)}` +
      `&category_id=${encodeURIComponent(GISCUS_CATEGORY_ID)}`;

    fetch(url, {
      signal: abort.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        // 403 — приложение не установлено; 404 — установлено, но ветки ещё нет.
        if (response.status === 403) return "off" as const;
        return response.ok || response.status === 404 ? ("ready" as const) : ("off" as const);
      })
      .catch(() => null)
      .then((next) => {
        if (!alive) return;
        // Сетевую ошибку не кэшируем: при следующем визите проверим снова.
        setState(next ?? "off");
        if (!next) return;
        try {
          window.sessionStorage.setItem(key, next);
        } catch {
          /* без кэша */
        }
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      alive = false;
      window.clearTimeout(timer);
      abort.abort();
    };
  }, [pageId]);

  return state;
}

function GiscusThread({ pageId }: { pageId: string }) {
  const host = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    node.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    const attributes: Record<string, string> = {
      "data-repo": REPO,
      "data-repo-id": GISCUS_REPO_ID,
      "data-category": GISCUS_CATEGORY,
      "data-category-id": GISCUS_CATEGORY_ID,
      "data-mapping": "specific",
      "data-term": `lonawiki:${pageId}`,
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": "transparent_dark",
      "data-lang": "ru",
      "data-loading": "lazy",
    };
    for (const [name, value] of Object.entries(attributes)) script.setAttribute(name, value);
    node.appendChild(script);

    return () => node.replaceChildren();
  }, [pageId]);

  return (
    <div className="mt-3" style={{ colorScheme: "dark" }}>
      <div ref={host} className="giscus min-h-[220px]" />
    </div>
  );
}

export function PageComments({
  pageId,
  pageTitle,
}: {
  pageId: string;
  pageTitle: string;
}) {
  const giscus = useGiscus(pageId);
  const [items, setItems] = useState<CommentIssue[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState(() => (typeof window === "undefined" ? "" : readDraft(pageId)));
  const [opened, setOpened] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [published, setPublished] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [threads, setThreads] = useState<Record<number, ThreadState>>({});
  const controller = useRef<AbortController | null>(null);
  const poll = useRef<number | undefined>(undefined);
  const pending = useRef<string | null>(null);

  useEffect(() => {
    writeDraft(pageId, message);
  }, [message, pageId]);

  const load = useCallback(
    async (force = false) => {
      if (!force) {
        const cached = readCache(pageId);
        if (cached) {
          setItems(cached);
          setStatus("ready");
          return;
        }
      }

      controller.current?.abort();
      const abort = new AbortController();
      controller.current = abort;
      setRefreshing(true);
      setStatus((current) => (current === "ready" ? current : "loading"));
      setError(null);
      const timer = window.setTimeout(() => abort.abort("timeout"), 10_000);

      try {
        const response = await fetch(
          // t= обходит кэш CDN GitHub: свежая ветка появляется сразу после публикации.
          `${API}/issues?state=all&per_page=100&sort=created&direction=desc&t=${Date.now()}`,
          {
            signal: abort.signal,
            cache: "no-store",
            headers: { Accept: "application/vnd.github+json" },
          },
        );

        if (response.status === 403 || response.status === 429) throw new Error("rate");
        if (!response.ok) throw new Error(`http-${response.status}`);

        const payload: unknown = await response.json();
        if (!Array.isArray(payload)) throw new Error("shape");

        const next = payload
          .filter((entry) => isCommentIssue(entry, pageId))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setItems(next);
        setStatus("ready");
        writeCache(pageId, next);

        // Черновик можно очищать, только когда текст уже виден в списке.
        if (pending.current) {
          const sent = pending.current.trim();
          const found = next.some((issue) => visibleText(issue.body).includes(sent.slice(0, 80)));
          if (found) {
            pending.current = null;
            setMessage("");
            setPublished(true);
          }
        }
      } catch (reason) {
        if (controller.current !== abort) return;
        const text =
          abort.signal.reason === "timeout"
            ? "GitHub не ответил за 10 секунд. Попробуйте обновить или открыть ветки по ссылке ниже."
            : reason instanceof Error && reason.message === "rate"
              ? "GitHub временно ограничил анонимные запросы. Ветки всё равно доступны по ссылке ниже."
              : "Не удалось загрузить комментарии. Проверьте сеть или откройте ветки на GitHub.";
        setError(text);
        setStatus("error");
      } finally {
        window.clearTimeout(timer);
        if (controller.current === abort) setRefreshing(false);
      }
    },
    [pageId],
  );

  useEffect(() => {
    void load();
    return () => {
      controller.current?.abort();
      controller.current = null;
      window.clearInterval(poll.current);
    };
  }, [load]);

  // После публикации возвращаемся на вкладку — список обновляется сам.
  useEffect(() => {
    if (!opened) return;
    const refresh = () => {
      if (document.visibilityState === "visible") void load(true);
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [opened, load]);

  const issueUrl = useMemo(() => {
    const body = `${message.trim()}\n\n${markerFor(pageId)}`;
    return `${GITHUB}/issues/new?title=${encodeURIComponent(issueTitle(message, pageTitle))}&body=${encodeURIComponent(body)}`;
  }, [message, pageId, pageTitle]);

  const publish = () => {
    if (!message.trim()) return;
    trackEvent("comments-publish", pageId);
    setPublished(false);
    setBlocked(false);
    pending.current = message.trim();
    const popup = openGitHubPopup(issueUrl, `lonawiki-comment-${pageId}`);
    if (!popup) {
      setBlocked(true);
      return;
    }
    setOpened(true);
    window.clearInterval(poll.current);
    poll.current = window.setInterval(() => {
      if (!popup.closed) return;
      window.clearInterval(poll.current);
      setOpened(false);
      // GitHub иногда дорисовывает issue пару секунд после закрытия окна.
      window.setTimeout(() => void load(true), 1200);
    }, 900);
  };

  const refresh = () => {
    trackEvent("comments-refresh", pageId);
    void load(true);
  };

  const toggleThread = async (issue: CommentIssue) => {
    const current = threads[issue.number];
    if (current?.open) {
      setThreads((prev) => ({ ...prev, [issue.number]: { ...current, open: false } }));
      return;
    }
    if (current?.items || current?.loading) {
      setThreads((prev) => ({ ...prev, [issue.number]: { ...current, open: true } }));
      return;
    }

    trackEvent("comments-replies", pageId);
    setThreads((prev) => ({ ...prev, [issue.number]: { open: true, loading: true } }));
    try {
      const response = await fetch(`${API}/issues/${issue.number}/comments?per_page=50&t=${Date.now()}`, {
        cache: "no-store",
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!response.ok) throw new Error(`http-${response.status}`);
      const payload: unknown = await response.json();
      const list = Array.isArray(payload) ? payload.filter(isReply) : [];
      setThreads((prev) => ({ ...prev, [issue.number]: { open: true, items: list } }));
    } catch {
      setThreads((prev) => ({ ...prev, [issue.number]: { open: true, error: true } }));
    }
  };

  const totalReplies = items.reduce((sum, issue) => sum + issue.comments, 0);
  const visible = showAll ? items : items.slice(0, 6);
  const publishedNote = published && message.trim().length === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10px] text-muted/45">
          <MessageSquare className="h-3.5 w-3.5 text-gold/60" />
          {giscus === "ready" ? "Обсуждение раздела" : "Комментарии раздела"}
          {giscus !== "ready" && status === "ready" && (
            <span className="border border-line/60 px-1.5 py-0.5 text-[9px] tabular-nums">
              {items.length} · ответов {totalReplies}
            </span>
          )}
        </div>
        {giscus !== "ready" && (
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 border border-line px-2 py-1 text-[9.5px] text-muted/60 transition hover:border-gold/35 hover:text-parchment disabled:opacity-40"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            Обновить
          </button>
        )}
      </div>

      {giscus === "ready" && (
        <>
          <GiscusThread pageId={pageId} />
          <p className="mt-2 text-[9px] leading-relaxed text-muted/30">
            Вход через GitHub. Ветка хранится в Discussions репозитория архива.
          </p>
        </>
      )}

      {giscus !== "ready" && (
        <>
          <div className="mt-3">
            <label className="flex flex-col gap-1">
              <span className="flex items-center justify-between gap-2 text-[8.5px] uppercase tracking-[0.18em] text-muted/45">
                Ваш комментарий
                <span className="normal-case tracking-normal text-muted/25 tabular-nums">
                  {message.length}/4000
                </span>
              </span>
              <textarea
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (pending.current) pending.current = null;
                  if (published) setPublished(false);
                }}
                rows={4}
                maxLength={4000}
                placeholder="Что думаете о разделе? Уточнение, вопрос или находка…"
                className="w-full resize-y border border-line bg-void px-3 py-2 text-[12px] leading-relaxed text-parchment placeholder:text-muted/35 outline-none transition focus:border-ember/50"
              />
            </label>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[9.5px] leading-relaxed text-muted/35">
                Нужен аккаунт GitHub — один раз. В публикацию попадёт только ваш текст.
              </span>
              <button
                onClick={publish}
                disabled={!message.trim()}
                className="flex items-center gap-1.5 border border-gold/40 bg-gold/[0.08] px-3.5 py-1.5 text-[10.5px] text-gold transition hover:bg-gold/[0.14] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
                Опубликовать
              </button>
            </div>

            {publishedNote && (
              <div className="mt-2 border border-moss/25 bg-moss/[0.05] px-2.5 py-2 text-[9.5px] leading-relaxed text-moss/80">
                Комментарий опубликован и уже есть в списке ниже.
              </div>
            )}

            {opened && (
              <div className="mt-2 border border-gold/25 bg-gold/[0.04] px-2.5 py-2 text-[9.5px] leading-relaxed text-muted/60">
                Окно GitHub открыто. Нажмите там «Submit new issue» — вернувшись сюда, вы увидите
                комментарий автоматически.
              </div>
            )}

            {blocked && (
              <div className="mt-2 flex flex-wrap items-center gap-2 border border-gold/25 bg-gold/[0.04] px-2.5 py-2 text-[9.5px] leading-relaxed text-muted/60">
                <AlertTriangle className="h-3 w-3 shrink-0 text-gold/70" />
                Браузер заблокировал окно.
                <a
                  href={issueUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-gold/80 hover:text-gold"
                >
                  Открыть форму <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          <div className="mt-3 border-t border-line/60 pt-3">
            {status === "loading" && items.length === 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[9.5px] text-muted/40">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Загружаю комментарии…
                </div>
                {[0, 1].map((row) => (
                  <div key={row} className="animate-pulse border border-line/50 bg-white/[0.015] p-3">
                    <div className="h-2.5 w-28 bg-line/60" />
                    <div className="mt-2 h-2 w-full bg-line/40" />
                    <div className="mt-1.5 h-2 w-2/3 bg-line/30" />
                  </div>
                ))}
              </div>
            )}

            {status === "error" && (
              <div className="border border-gold/25 bg-gold/[0.04] px-3 py-2.5">
                <div className="flex items-start gap-2 text-[10.5px] leading-relaxed text-muted/65">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
                  <span>{error}</span>
                </div>
                <a
                  href={`${GITHUB}/issues`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] text-gold/80 hover:text-gold"
                >
                  Открыть ветки на GitHub <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            )}

            {status === "ready" && items.length === 0 && (
              <div className="border border-dashed border-line/70 bg-void/25 px-3 py-5 text-center">
                <MessageSquare className="mx-auto h-4 w-4 text-muted/35" />
                <p className="mt-1.5 text-[11px] text-muted/55">
                  Пока тихо. Начните обсуждение — комментарий появится здесь.
                </p>
              </div>
            )}

            {items.length > 0 && (
              <div className="space-y-2">
                {visible.map((issue) => {
                  const text = visibleText(issue.body);
                  const login = issue.user?.login ?? "удалённый аккаунт";
                  const thread = threads[issue.number];
                  return (
                    <article key={issue.number} className="border border-line/60 bg-void/30 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {issue.user?.avatar_url ? (
                          <img
                            src={issue.user.avatar_url}
                            alt=""
                            loading="lazy"
                            className="h-5 w-5 rounded-full border border-line/80"
                          />
                        ) : (
                          <Github className="h-4 w-4 text-muted/40" />
                        )}
                        <a
                          href={issue.user?.html_url ?? GITHUB}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[11px] text-parchment/80 hover:text-gold"
                        >
                          {login}
                        </a>
                        <span className="text-[9px] text-muted/35">{formatDate(issue.created_at)}</span>
                        {issue.state === "closed" && (
                          <span className="border border-line/70 px-1.5 py-0.5 text-[8.5px] uppercase tracking-[0.1em] text-muted/40">
                            закрыто
                          </span>
                        )}
                        <a
                          href={issue.html_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          onClick={() => trackEvent("comments-open", `issue-${issue.number}`)}
                          className="ml-auto inline-flex items-center gap-1 text-[9.5px] text-muted/35 transition hover:text-gold"
                          aria-label="Открыть ветку на GitHub"
                        >
                          #{issue.number} <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>

                      {text && (
                        <p className="mt-1.5 whitespace-pre-wrap break-words text-[11.5px] leading-relaxed text-muted/75">
                          {text}
                        </p>
                      )}

                      {issue.comments > 0 && (
                        <button
                          onClick={() => void toggleThread(issue)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[9.5px] text-ember/70 transition hover:text-gold"
                        >
                          <MessageSquare className="h-3 w-3" />
                          {thread?.open ? "Скрыть ответы" : `Ответы · ${issue.comments}`}
                          {thread?.open ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </button>
                      )}

                      {thread?.open && (
                        <div className="mt-2 space-y-2 border-l border-line/70 pl-3">
                          {thread.loading && (
                            <div className="flex items-center gap-1.5 text-[9.5px] text-muted/40">
                              <Loader2 className="h-3 w-3 animate-spin" /> Загружаю ответы…
                            </div>
                          )}
                          {thread.error && (
                            <div className="text-[9.5px] text-muted/45">
                              Не удалось загрузить ответы.{" "}
                              <a
                                href={issue.html_url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-gold/75 hover:text-gold"
                              >
                                Открыть на GitHub
                              </a>
                            </div>
                          )}
                          {thread.items?.length === 0 && (
                            <div className="text-[9.5px] text-muted/40">Ответов пока нет.</div>
                          )}
                          {thread.items?.map((reply) => {
                            const replyText = visibleText(reply.body);
                            if (!replyText) return null;
                            return (
                              <div key={reply.id} className="border border-line/40 bg-white/[0.012] px-2.5 py-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {reply.user?.avatar_url ? (
                                    <img
                                      src={reply.user.avatar_url}
                                      alt=""
                                      loading="lazy"
                                      className="h-3.5 w-3.5 rounded-full border border-line/80"
                                    />
                                  ) : null}
                                  <span className="text-[10px] text-parchment/70">
                                    {reply.user?.login ?? "удалённый аккаунт"}
                                  </span>
                                  <span className="text-[8.5px] text-muted/35">
                                    {formatDate(reply.created_at)}
                                  </span>
                                  <a
                                    href={reply.html_url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="ml-auto text-muted/30 transition hover:text-gold"
                                    aria-label="Открыть ответ на GitHub"
                                  >
                                    <ArrowUpRight className="h-3 w-3" />
                                  </a>
                                </div>
                                <p className="mt-1 whitespace-pre-wrap break-words text-[10.5px] leading-relaxed text-muted/65">
                                  {replyText}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {!showAll && items.length > 6 && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-2 inline-flex items-center gap-1 text-[10px] text-ember/70 hover:text-gold"
              >
                Показать ещё {items.length - 6} <ChevronDown className="h-3 w-3" />
              </button>
            )}
            {showAll && items.length > 6 && (
              <button
                onClick={() => setShowAll(false)}
                className="mt-2 inline-flex items-center gap-1 text-[10px] text-ember/70 hover:text-gold"
              >
                Свернуть <ChevronUp className="h-3 w-3" />
              </button>
            )}
          </div>
        </>
      )}

      <div className="mt-3 flex items-start gap-1.5 text-[9px] leading-relaxed text-muted/30">
        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          Комментарии публичные. Не публикуйте пиратские сборки, персональные данные и материалы без
          согласия авторов. Возрастной рейтинг архива — 18+.
        </span>
      </div>
    </div>
  );
}
