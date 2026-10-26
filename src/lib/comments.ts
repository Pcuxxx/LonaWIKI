import { supabaseClient } from "./supabase";

/** Строка таблицы public.comments. client_id наружу не отдаём. */
export interface CommentRow {
  id: string;
  page_id: string;
  author: string;
  body: string;
  created_at: string;
  reply_to: string | null;
}

export interface NewComment {
  pageId: string;
  author: string;
  body: string;
  clientId: string;
  replyTo: string | null;
}

const FIELDS = "id, page_id, author, body, created_at, reply_to";
const PAGE_LIMIT = 300;

/** Строка с сервера должна иметь все поля, иначе рендер упадёт. */
function isCommentRow(value: unknown): value is CommentRow {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<CommentRow>;
  return (
    typeof row.id === "string" &&
    typeof row.page_id === "string" &&
    typeof row.body === "string" &&
    typeof row.created_at === "string"
  );
}

export function commentErrorMessage(reason: unknown): string {
  const error = reason as { message?: string; code?: string } | null;
  const message = error?.message ?? "";

  if (error?.code === "42P01" || /relation .* does not exist/i.test(message)) {
    return "Сервер комментариев ещё не настроен: не создана таблица comments.";
  }
  if (/rate limit/i.test(message)) {
    return "Слишком часто. Подождите несколько минут перед следующим комментарием.";
  }
  if (/nested reply/i.test(message)) {
    return "Ответить можно только на основной комментарий, а не на ответ.";
  }
  if (/invalid reply/i.test(message)) {
    return "Ветка уже удалена. Обновите список.";
  }
  if (/row-level security|permission denied|violates row-level/i.test(message)) {
    return "Сервер отклонил запись. Проверьте настройки доступа к таблице comments.";
  }
  if (/not-owner/i.test(message)) {
    return "Не удалось удалить: комментарий создан в другом браузере или уже удалён.";
  }
  if (/Failed to fetch|NetworkError|Load failed|fetch/i.test(message)) {
    return "Нет связи с сервером комментариев. Проверьте сеть и попробуйте снова.";
  }
  return "Не удалось выполнить действие. Попробуйте ещё раз.";
}

export async function fetchComments(pageId: string): Promise<CommentRow[]> {
  const client = await supabaseClient();
  const { data, error } = await client
    .from("comments")
    .select(FIELDS)
    .eq("page_id", pageId)
    .order("created_at", { ascending: true })
    .limit(PAGE_LIMIT);

  if (error) {
    console.warn("comments:list", error);
    throw error;
  }
  return ((data ?? []) as unknown[]).filter(isCommentRow).map((row) => ({
    ...row,
    author: typeof row.author === "string" && row.author.trim() ? row.author : "Гость",
    reply_to: typeof row.reply_to === "string" ? row.reply_to : null,
  }));
}

export async function createComment(input: NewComment): Promise<CommentRow> {
  const client = await supabaseClient();
  const { data, error } = await client
    .from("comments")
    .insert({
      page_id: input.pageId,
      author: input.author,
      body: input.body,
      client_id: input.clientId,
      reply_to: input.replyTo,
    })
    .select(FIELDS)
    .single();

  if (error) {
    console.warn("comments:create", error);
    throw error;
  }
  // PostgREST может вернуть массив, если single() не применился.
  const candidate = Array.isArray(data) ? data[0] : data;
  if (!isCommentRow(candidate)) throw new Error("unexpected comment shape");
  return {
    ...candidate,
    author: typeof candidate.author === "string" && candidate.author.trim() ? candidate.author : "Гость",
    reply_to: typeof candidate.reply_to === "string" ? candidate.reply_to : null,
  };
}

export async function deleteComment(id: string, token: string): Promise<boolean> {
  const client = await supabaseClient();
  const { data, error } = await client.rpc("delete_own_comment", {
    comment_id: id,
    client_token: token,
  });

  if (error) {
    console.warn("comments:delete", error);
    throw error;
  }
  return data === true;
}
