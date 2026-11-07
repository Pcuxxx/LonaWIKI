import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { PageComments } from "./Comments";
import { NATIVE_COMMENTS } from "../lib/supabase";
import { trackEvent } from "../lib/analytics";

/**
 * Свёрнутое обсуждение раздела внизу страницы.
 *
 * По умолчанию закрыто и ничего не запрашивает: комментарии грузятся только
 * после раскрытия, поэтому страница не платит за запрос к серверу. Отдельный
 * развёрнутый блок остаётся на странице «Сообщество».
 */
export function PageDiscussion({ pageId, pageTitle }: { pageId: string; pageTitle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="mt-10 border border-line/70 bg-white/[0.012]"
      aria-label="Обсуждение раздела"
      id="discussion"
    >
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) trackEvent("discussion-open", pageId);
        }}
        aria-expanded={open}
        aria-controls="discussion-body"
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition hover:bg-white/[0.02]"
      >
        <MessageSquare className="h-4 w-4 shrink-0 text-gold/60" />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] text-parchment/90">Обсуждение раздела</span>
          <span className="block text-[10px] text-muted/45">
            {NATIVE_COMMENTS
              ? "Вопросы, уточнения и находки. Без регистрации, имя необязательно."
              : "Вопросы, уточнения и находки к разделу."}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted/45 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div id="discussion-body" className="border-t border-line/70 px-4 py-4">
          <PageComments pageId={pageId} pageTitle={pageTitle} />
        </div>
      )}
    </section>
  );
}
