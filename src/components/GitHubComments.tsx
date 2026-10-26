import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Github,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { SITE } from "../lib/meta";

/**
 * Комментарии на GitHub Issues.
 *
 * Почему не Giscus: встроенный виджет требует установки GitHub App на
 * репозиторий. Пока приложение не установлено, любой посетитель видел бы
 * пустой блок. Issues работают сразу: публичный API отдаёт ветки без токена,
 * а форма создания открывается на GitHub с уже заполненным текстом.
 *
 * Ответы в ветке пишутся на GitHub — там же, где живут правки и баги.
 */

const REPO = "Pcuxxx/LonaWIKI";
const GITHUB = `https://github.com/${REPO}`;
const API = `https://api.github.com/repos/${REPO}`;
const CACHE_TTL = 5 * 60 * 1000;

interface CommentIssue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  created_at: string;
  comments: number;
  user: { login: string; avatar_url: string; html_url: string } | null;
  labels: { name: string; color?: string }[];
}

type Status = "idle" | "loading" | "ready" | "error";

function cacheKey(pageId: string) {
  return `lonawiki:comments:${pageId}:v1`;
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

function isCommentIssue(value: unknown, prefix: string): value is CommentIssue {
  if (!value || typeof value !== "object") return false;
  const issue = value as Partial<CommentIssue> & { pull_request?: unknown };
  return (
    typeof issue.number === "number" &&
    typeof issue.title === "string" &&
    issue.title.startsWith(prefix) &&
    !issue.pull_request
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Убрать служебную шапку из тела комментария, оставив текст автора. */
function messageFromBody(body: string | null): string {
  const raw = (body ?? "").trim();
  if (!raw) return "";
  if (!raw.startsWith("**Страница:**")) return raw;
  const firstGap = raw.indexOf("\n\n");
  if (firstGap === -1) return raw;
  const footer = raw.lastIndexOf("\n\n---");
  const message = raw.slice(firstGap + 2, footer > firstGap ? footer : undefined).trim();
  return message || raw;
}

function issueSearchUrl(prefix: string): string {
  return `${GITHUB}/issues?q=${encodeURIComponent(`is:issue ${prefix}`)}`;
}

export function PageComments({
  pageId,
  pageTitle,
  pageUrl,
}: {
  pageId: string;
  pageTitle: string;
  pageUrl: string;
}) {
  const prefix = `[Комментарий] ${pageId}:`;
  const [items, setItems] = useState<CommentIssue[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);
  const controller = useRef<AbortController | null>(null);

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
      setStatus("loading");
      setError(null);
      const timer = window.setTimeout(() => abort.abort("timeout"), 10_000);

      try {
        const response = await fetch(
          `${API}/issues?state=all&per_page=100&sort=created&direction=desc`,
          {
            signal: abort.signal,
            headers: { Accept: "application/vnd.github+json" },
          },
        );

        if (response.status === 403 || response.status === 429) {
          throw new Error("rate");
        }
        if (!response.ok) throw new Error(`http-${response.status}`);

        const payload: unknown = await response.json();
        if (!Array.isArray(payload)) throw new Error("shape");

        const next = payload
          .filter((entry) => isCommentIssue(entry, prefix))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setItems(next);
        setStatus("ready");
        writeCache(pageId, next);
      } catch (reason) {
        if (controller.current !== abort) return;
        const messageText =
          abort.signal.reason === "timeout"
            ? "GitHub не ответил за 10 секунд. Ветки доступны по ссылке ниже, а форму можно отправить напрямую."
            : reason instanceof Error && reason.message === "rate"
              ? "GitHub временно ограничил анонимные запросы. Ветки всё равно доступны по ссылке ниже."
              : "Не удалось загрузить комментарии. Проверьте сеть или откройте ветки на GitHub.";
        setError(messageText);
        setStatus("error");
      } finally {
        window.clearTimeout(timer);
      }
    },
    [pageId, prefix],
  );

  useEffect(() => {
    void load();
    return () => {
      controller.current?.abort();
      controller.current = null;
    };
  }, [load]);

  const issueUrl = useMemo(() => {
    const text = message.trim();
    const firstLine = text.split(/\r?\n/)[0]?.slice(0, 72) || pageTitle;
    const title = `${prefix} ${firstLine}`;
    const body = [
      `**Страница:** ${pageUrl}`,
      `**Раздел:** ${pageTitle}`,
      "",
      text,
      "",
      "---",
      `Отправлено из архива LonaRPG · ${SITE.version}`,
    ].join("\n");
    return `${GITHUB}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  }, [message, pageTitle, pageUrl, prefix]);

  const openComposer = () => {
    trackEvent("comments-open", pageId);
    setOpened(true);
    window.open(issueUrl, "_blank", "noopener,noreferrer");
  };

  const refresh = () => {
    trackEvent("comments-refresh", pageId);
    void load(true);
  };

  const totalReplies = items.reduce((sum, issue) => sum + issue.comments, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10px] text-muted/45">
          <Github className="h-3.5 w-3.5 text-gold/60" />
          Ветки страницы на GitHub
          {status === "ready" && (
            <span className="border border-line/60 px-1.5 py-0.5 text-[9px] tabular-nums">
              {items.length} · ответов {totalReplies}
            </span>
          )}
        </div>
        <button
          onClick={refresh}
          disabled={status === "loading"}
          className="flex items-center gap-1.5 border border-line px-2 py-1 text-[9.5px] text-muted/60 transition hover:border-gold/35 hover:text-parchment disabled:opacity-40"
        >
          <RefreshCw className={`h-3 w-3 ${status === "loading" ? "animate-spin" : ""}`} />
          Обновить
        </button>
      </div>

      <div className="mt-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          maxLength={4000}
          placeholder="Что думаете о разделе? Уточнение, вопрос или находка…"
          className="w-full resize-y border border-line bg-void px-3 py-2 text-[12px] leading-relaxed text-parchment placeholder:text-muted/35 outline-none focus:border-ember/50"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[9.5px] text-muted/35">
            Публикация — через GitHub Issues. Нужен аккаунт, ответы приходят в ветку.
          </span>
          <button
            onClick={openComposer}
            disabled={!message.trim()}
            className="flex items-center gap-1.5 border border-gold/40 bg-gold/[0.08] px-3 py-1.5 text-[10.5px] text-gold transition hover:bg-gold/[0.14] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
            Написать на GitHub
          </button>
        </div>
        {opened && (
          <div className="mt-2 flex items-start gap-2 border border-moss/25 bg-moss/[0.05] px-2.5 py-2 text-[9.5px] leading-relaxed text-moss/80">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            <span>
              Форма открыта в новой вкладке. После публикации вернитесь сюда и нажмите
              «Обновить», чтобы увидеть свою ветку.
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 border-t border-line/60 pt-3">
        {status === "loading" && items.length === 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[9.5px] text-muted/40">
              <Loader2 className="h-3 w-3 animate-spin" />
              Загружаю ветки с GitHub…
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
              href={issueSearchUrl(prefix)}
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
            <p className="mt-1.5 text-[11px] text-muted/55">Пока тихо. Начните первую ветку — она появится здесь.</p>
          </div>
        )}

        {items.length > 0 && (
          <div className="space-y-2">
            {items.slice(0, 8).map((issue) => {
              const text = messageFromBody(issue.body);
              const login = issue.user?.login ?? "удалённый аккаунт";
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
                      className="ml-auto inline-flex items-center gap-1 text-[9.5px] text-ember/70 transition hover:text-gold"
                    >
                      Открыть <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  {text && (
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-[11px] leading-relaxed text-muted/70 line-clamp-6">
                      {text}
                    </p>
                  )}

                  <div className="mt-1.5 flex items-center gap-3 text-[9px] text-muted/35">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 hover:text-parchment/70"
                    >
                      <MessageSquare className="h-3 w-3" /> {issue.comments} ответов
                    </a>
                    <span>#{issue.number}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {items.length > 8 && (
          <a
            href={issueSearchUrl(prefix)}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-flex items-center gap-1 text-[10px] text-ember/70 hover:text-gold"
          >
            Ещё {items.length - 8} веток на GitHub <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>

      <div className="mt-2 flex items-start gap-1.5 text-[9px] leading-relaxed text-muted/30">
        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
        Комментарии — публичные задачи GitHub. Не публикуйте пиратские сборки, персональные данные и
        материалы без согласия авторов. Возрастной рейтинг архива — 18+.
      </div>
    </div>
  );
}
