import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Анонимные комментарии на Supabase.
 *
 * URL и anon key публичны по своей природе: ключ ограничен RLS-политиками
 * таблицы `comments` (см. supabase/schema.sql). Клиент создаётся лениво,
 * поэтому без настроенного проекта сайт работает в резервном режиме.
 */

const url = (import.meta.env.VITE_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

export const NATIVE_COMMENTS = Boolean(url && anonKey);

let client: Promise<SupabaseClient> | null = null;

export function supabaseClient() {
  if (!NATIVE_COMMENTS) throw new Error("supabase-not-configured");
  if (!client) {
    client = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { "x-application-name": "lonawiki" } },
      }),
    );
  }
  return client;
}
