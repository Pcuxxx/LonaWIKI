import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Check,
  CornerDownRight,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import { trackEvent } from "../lib/analytics";
import {
  commentErrorMessage,
  createComment,
  deleteComment,
  fetchComments,
  type CommentRow,
} from "../lib/comments";

const PROFILE_KEY = "lonawiki:comment-profile:v1";
const OWN_KEY = "lonawiki:comment-own:v1";
const MAX_BODY = 4000;
const MAX_NAME = 40;

interface Profile {
  name: string;
  token: string;
}

function randomToken() {
  try {
    return crypto.randomUUID();
  } catch {
    return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

function readProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Profile>;
      if (typeof parsed.token === "string" && parsed.token.length >= 8) {
        return {
          name: typeof parsed.name === "string" ? parsed.name.slice(0, MAX_NAME) : "",
          token: parsed.token,
        };
      }
    }
  } catch {
    /* приватный режим */
  }
  return { name: "", token: randomToken() };
}

function saveProfile(profile: Profile) {
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* приватный режим */
  }
}

function readOwn(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(OWN_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(-300);
  } catch {
    return [];
  }
}

function saveOwn(ids: string[]) {
  try {
    window.localStorage.setItem(OWN_KEY, JSON.stringify(ids.slice(-300)));
  } catch {
    /* приватный режим */
  }
}

function relativeTime(value: string) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return value;
  const diff = Date.now() - time;
  if (diff < 45_000) return "только что";
  if (diff < 3_600_000) return `${Math.max(1, Math.floor(diff / 60_000))} мин назад`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} ч назад`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} дн назад`;
  const date = new Date(time);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}

const AVATAR_TONES = [
  "border-gold/25 bg-gold/[0.08] text-gold/80",
  "border-ember/25 bg-ember/[0.08] text-ember/80",
  "border-moss/25 bg-moss/[0.08] text-moss/80",
  "border-frost/25 bg-frost/[0.08] text-frost/80",
];

function avatarTone(name: string) {
  let hash = 0;
  for (const char of String(name ?? "")) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

function initial(name: string) {
  return (String(name ?? "").trim()[0] ?? "Г").toUpperCase();
}

function fullDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function cleanText(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim();
}

export function SupabaseComments({ pageId }: { pageId: string }) {
  const [profile, setProfile] = useState<Profile>(() => readProfile());
  const [owned, setOwned] = useState<string[]>(() => readOwn());
  const [rows, setRows] = useState<CommentRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [trap, setTrap] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveOwn(owned);
  }, [owned]);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setStatus("loading");
      try {
        const next = await fetchComments(pageId);
        if (!alive.current) return;
        setRows(next);
        setStatus("ready");
        setError(null);
      } catch (reason) {
        if (!alive.current) return;
        setError(commentErrorMessage(reason));
        setStatus("error");
      }
    },
    [pageId],
  );

  useEffect(() => {
    alive.current = true;
    void load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(true);
    }, 60_000);
    const refresh = () => {
      if (document.visibilityState === "visible") void load(true);
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      alive.current = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [load]);

  const displayName = profile.name.trim().slice(0, MAX_NAME) || "Гость";
  const ownedSet = useMemo(() => new Set(owned), [owned]);

  const replies = useMemo(() => {
    const map = new Map<string, CommentRow[]>();
    for (const row of rows) {
      if (!row.reply_to) continue;
      const list = map.get(row.reply_to) ?? [];
      list.push(row);
      map.set(row.reply_to, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.created_at.localeCompare(b.created_at));
    }
    return map;
  }, [rows]);

  const roots = useMemo(
    () =>
      rows
        .filter((row) => !row.reply_to)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [rows],
  );

  const remember = (row: CommentRow) => {
    setRows((prev) => [...prev, row]);
    setOwned((prev) => [...prev, row.id]);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const body = cleanText(text);
    if (!body || sending) return;
    if (trap) {
      // Ловушка для ботов: подтверждаем «успех», но ничего не пишем.
      setText("");
      setNotice({ tone: "ok", text: "Комментарий опубликован." });
      return;
    }

    setSending(true);
    setNotice(null);
    try {
      const row = await createComment({
        pageId,
        author: displayName,
        body,
        clientId: profile.token,
        replyTo: null,
      });
      remember(row);
      setText("");
      setNotice({ tone: "ok", text: "Комментарий опубликован." });
      trackEvent("comments-post", pageId);
    } catch (reason) {
      setNotice({ tone: "err", text: commentErrorMessage(reason) });
    } finally {
      setSending(false);
    }
  };

  const submitReply = async (rootId: string) => {
    const body = cleanText(replyText);
    if (!body || replySending) return;
    setReplySending(true);
    setNotice(null);
    try {
      const row = await createComment({
        pageId,
        author: displayName,
        body,
        clientId: profile.token,
        replyTo: rootId,
      });
      remember(row);
      setReplyText("");
      setReplyTo(null);
      setNotice({ tone: "ok", text: "Ответ опубликован." });
      trackEvent("comments-reply", pageId);
    } catch (reason) {
      setNotice({ tone: "err", text: commentErrorMessage(reason) });
    } finally {
      setReplySending(false);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    setNotice(null);
    try {
      const ok = await deleteComment(id, profile.token);
      if (!ok) throw new Error("not-owner");
      setRows((prev) => prev.filter((row) => row.id !== id && row.reply_to !== id));
      setOwned((prev) => prev.filter((item) => item !== id));
      setConfirmDelete(null);
      setNotice({ tone: "ok", text: "Комментарий удалён." });
      trackEvent("comments-delete", pageId);
    } catch (reason) {
      setNotice({ tone: "err", text: commentErrorMessage(reason) });
    } finally {
      setBusyId(null);
    }
  };

  const refresh = () => {
    trackEvent("comments-refresh", pageId);
    void load(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10px] text-muted/45">
          <MessageSquare className="h-3.5 w-3.5 text-gold/60" />
          Обсуждение раздела
          {status !== "loading" && (
            <span className="border border-line/60 px-1.5 py-0.5 text-[9px] tabular-nums">
              {rows.length}
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

      <form onSubmit={submit} className="mt-3">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="flex flex-col gap-1">
            <span className="text-[8.5px] uppercase tracking-[0.18em] text-muted/45">
              Имя <span className="normal-case tracking-normal text-muted/25">— необязательно</span>
            </span>
            <input
              value={profile.name}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, name: event.target.value.slice(0, MAX_NAME) }))
              }
              maxLength={MAX_NAME}
              autoComplete="nickname"
              placeholder="Гость"
              className="w-full border border-line bg-void px-3 py-2 text-[12px] text-parchment placeholder:text-muted/35 outline-none transition focus:border-ember/50"
            />
          </label>
          <span className="hidden items-end pb-2 text-[9px] text-muted/35 sm:flex">
            Без регистрации
          </span>
        </div>

        <label className="mt-2 flex flex-col gap-1">
          <span className="flex items-center justify-between gap-2 text-[8.5px] uppercase tracking-[0.18em] text-muted/45">
            Комментарий
            <span className="normal-case tracking-normal text-muted/25 tabular-nums">
              {text.length}/{MAX_BODY}
            </span>
          </span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value.slice(0, MAX_BODY))}
            rows={4}
            maxLength={MAX_BODY}
            placeholder="Что думаете о разделе? Уточнение, вопрос или находка…"
            className="w-full resize-y border border-line bg-void px-3 py-2 text-[12px] leading-relaxed text-parchment placeholder:text-muted/35 outline-none transition focus:border-ember/50"
          />
        </label>

        <input
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          name="website"
          className="sr-only"
        />

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[9.5px] leading-relaxed text-muted/35">
            Публикуется сразу, без регистрации и GitHub. Имя можно не указывать.
          </span>
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="flex items-center gap-1.5 border border-gold/40 bg-gold/[0.08] px-3.5 py-1.5 text-[10.5px] text-gold transition hover:bg-gold/[0.14] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {sending ? "Отправляю…" : "Отправить"}
          </button>
        </div>

        {notice && (
          <div
            className={`mt-2 flex items-start gap-1.5 border px-2.5 py-2 text-[9.5px] leading-relaxed ${
              notice.tone === "ok"
                ? "border-moss/30 bg-moss/[0.05] text-moss/80"
                : "border-gold/25 bg-gold/[0.04] text-muted/65"
            }`}
          >
            {notice.tone === "ok" ? (
              <Check className="mt-0.5 h-3 w-3 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" />
            )}
            <span>{notice.text}</span>
          </div>
        )}
      </form>

      <div className="mt-4 border-t border-line/60 pt-3">
        {status === "loading" && rows.length === 0 && (
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
            <button
              onClick={refresh}
              className="mt-2 inline-flex items-center gap-1 text-[10px] text-gold/80 hover:text-gold"
            >
              Попробовать снова <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        )}

        {status === "ready" && rows.length === 0 && (
          <div className="border border-dashed border-line/70 bg-void/25 px-3 py-5 text-center">
            <MessageSquare className="mx-auto h-4 w-4 text-muted/35" />
            <p className="mt-1.5 text-[11px] text-muted/55">
              Пока тихо. Напишите первым — без регистрации.
            </p>
          </div>
        )}

        {roots.length > 0 && (
          <div className="space-y-2">
            {roots.map((root) => {
              const list = replies.get(root.id) ?? [];
              const mine = ownedSet.has(root.id);
              const openReply = replyTo === root.id;
              return (
                <article key={root.id} className="border border-line/60 bg-void/30 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-medium ${avatarTone(root.author)}`}
                      aria-hidden="true"
                    >
                      {initial(root.author)}
                    </span>
                    <span className="text-[11px] text-parchment/80">{root.author}</span>
                    {mine && (
                      <span className="border border-gold/25 bg-gold/[0.05] px-1.5 py-0.5 text-[8px] uppercase tracking-[0.1em] text-gold/60">
                        вы
                      </span>
                    )}
                    <span className="text-[9px] text-muted/35" title={fullDate(root.created_at)}>
                      {relativeTime(root.created_at)}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReplyTo(openReply ? null : root.id);
                          setReplyText("");
                          setNotice(null);
                        }}
                        className="text-[9.5px] text-muted/40 transition hover:text-gold"
                      >
                        {openReply ? "Отмена" : "Ответить"}
                      </button>
                      {mine &&
                        (confirmDelete === root.id ? (
                          <span className="flex items-center gap-1.5 text-[9px]">
                            <span className="text-muted/45">Удалить?</span>
                            <button
                              onClick={() => void remove(root.id)}
                              disabled={busyId === root.id}
                              className="text-gold/80 hover:text-gold disabled:opacity-40"
                            >
                              {busyId === root.id ? "…" : "Да"}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-muted/45 hover:text-parchment/70"
                            >
                              Нет
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(root.id)}
                            aria-label="Удалить комментарий"
                            className="text-muted/25 transition hover:text-blood/80"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        ))}
                    </div>
                  </div>

                  <p className="mt-1.5 whitespace-pre-wrap break-words text-[11.5px] leading-relaxed text-muted/75">
                    {root.body}
                  </p>

                  {list.length > 0 && (
                    <div className="mt-2 space-y-2 border-l border-line/70 pl-3">
                      {list.map((reply) => {
                        const replyMine = ownedSet.has(reply.id);
                        return (
                          <div key={reply.id} className="flex gap-2">
                            <CornerDownRight className="mt-1 h-3 w-3 shrink-0 text-muted/25" />
                            <div className="min-w-0 flex-1 border border-line/40 bg-white/[0.012] px-2.5 py-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[7.5px] font-medium ${avatarTone(reply.author)}`}
                                  aria-hidden="true"
                                >
                                  {initial(reply.author)}
                                </span>
                                <span className="text-[10px] text-parchment/70">{reply.author}</span>
                                {replyMine && (
                                  <span className="text-[8px] uppercase tracking-[0.1em] text-gold/50">
                                    вы
                                  </span>
                                )}
                                <span
                                  className="text-[8.5px] text-muted/35"
                                  title={fullDate(reply.created_at)}
                                >
                                  {relativeTime(reply.created_at)}
                                </span>
                                {replyMine &&
                                  (confirmDelete === reply.id ? (
                                    <span className="ml-auto flex items-center gap-1.5 text-[8.5px]">
                                      <button
                                        onClick={() => void remove(reply.id)}
                                        disabled={busyId === reply.id}
                                        className="text-gold/80 hover:text-gold disabled:opacity-40"
                                      >
                                        {busyId === reply.id ? "…" : "Удалить"}
                                      </button>
                                      <button
                                        onClick={() => setConfirmDelete(null)}
                                        className="text-muted/45 hover:text-parchment/70"
                                      >
                                        Отмена
                                      </button>
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => setConfirmDelete(reply.id)}
                                      aria-label="Удалить ответ"
                                      className="ml-auto text-muted/25 transition hover:text-blood/80"
                                    >
                                      <Trash2 className="h-2.5 w-2.5" />
                                    </button>
                                  ))}
                              </div>
                              <p className="mt-1 whitespace-pre-wrap break-words text-[10.5px] leading-relaxed text-muted/65">
                                {reply.body}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {openReply && (
                    <div className="mt-2 border border-line/60 bg-white/[0.015] p-2">
                      <textarea
                        value={replyText}
                        onChange={(event) => setReplyText(event.target.value.slice(0, MAX_BODY))}
                        rows={2}
                        maxLength={MAX_BODY}
                        placeholder={`Ответ ${root.author}…`}
                        className="w-full resize-y border border-line bg-void px-2.5 py-1.5 text-[11px] leading-relaxed text-parchment placeholder:text-muted/30 outline-none focus:border-ember/50"
                      />
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-[8.5px] text-muted/30">{displayName}</span>
                        <button
                          onClick={() => void submitReply(root.id)}
                          disabled={!replyText.trim() || replySending}
                          className="flex items-center gap-1 border border-gold/35 bg-gold/[0.07] px-2.5 py-1 text-[9.5px] text-gold transition hover:bg-gold/[0.13] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {replySending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                          Ответить
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-[9px] leading-relaxed text-muted/30">
        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          Комментарии публичные и анонимные. Не публикуйте персональные данные, пиратские сборки и
          материалы без согласия авторов. Возрастной рейтинг архива — 18+. Нарушения скрываются
          модерацией.
        </span>
      </div>
    </div>
  );
}
