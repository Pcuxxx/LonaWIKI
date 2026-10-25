import { useState } from "react";
import { Anchor, ArrowRight, Skull, Sparkles } from "lucide-react";
import { endings } from "../data/endings";
import type { Ending } from "../data/types";
import { Badge, Callout, SectionHeader, Spoiler } from "../components/ui";
import { href } from "../lib/router";

const typeLabels: Record<Ending["type"], string> = {
  good: "Основная",
  bad: "Плохая",
  neutral: "Нейтральная",
  secret: "Секретная",
};

const typeTones: Record<Ending["type"], "gold" | "blood" | "frost" | "violet"> = {
  good: "gold",
  bad: "blood",
  neutral: "frost",
  secret: "violet",
};

export function EndingsView({ focusId }: { focusId?: string }) {
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <SectionHeader
        eyebrow="Прохождение"
        title="Концовки"
        description="Семь финалов: побег, смерть, рабство, отказ и секретная ядерная погибель. Условия и шаги спрятаны за спойлерами — откройте, только если готовы."
        meta={
          <>
            <Badge tone="gold">20–30 GC</Badge>
            <Badge tone="violet">Секретная концовка</Badge>
            <Badge tone="blood">Спойлеры</Badge>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowAll((v) => !v)}
          className="border border-line bg-white/[0.02] px-3 py-2 text-xs text-muted transition hover:border-ember/40 hover:text-parchment"
        >
          {showAll ? "Скрыть все спойлеры" : "Показать все спойлеры"}
        </button>
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted/40">
          по умолчанию условия скрыты
        </span>
      </div>

      <div className="space-y-3">
        {endings.map((e) => (
          <article
            key={e.id}
            id={`ending-${e.id}`}
            className={`card scroll-mt-24 p-5 ${focusId === e.id ? "border-ember/60 ring-1 ring-ember/20" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge tone={typeTones[e.type]}>{typeLabels[e.type]}</Badge>
                  {e.type === "good" && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold/70">
                      <Anchor className="h-3 w-3" /> побег
                    </span>
                  )}
                  {e.type === "secret" && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-violet-300/70">
                      <Sparkles className="h-3 w-3" /> секрет
                    </span>
                  )}
                </div>
                <h2 className="font-display text-2xl leading-tight text-parchment">{e.ru}</h2>
                <p className="text-[11px] italic text-muted/45">{e.name}</p>
              </div>
              <Skull className="h-5 w-5 shrink-0 text-blood/30" />
            </div>

            <div className="mt-3">
              <div className="mb-1 text-[9px] uppercase tracking-[0.18em] text-muted/45">Условие</div>
              <p className="border-l-2 border-ember/30 pl-3 text-[13px] leading-relaxed text-parchment/85">
                {e.condition}
              </p>
            </div>

            <Spoiler className="mt-3" label="Спойлер: что происходит и как получить">
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-parchment/85">{e.summary}</p>
                <ol className="space-y-2">
                  {e.steps.map((s, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-ember/20 bg-ember/[0.06] font-display text-[10px] text-ember">
                        {i + 1}
                      </span>
                      <span className="text-[13px] leading-relaxed text-parchment/80">{s}</span>
                    </li>
                  ))}
                </ol>
                {e.note && (
                  <div className="border border-line bg-white/[0.02] p-3 text-[12px] leading-relaxed text-muted">
                    {e.note}
                  </div>
                )}
              </div>
            </Spoiler>

            {showAll && (
              <div className="mt-3 border-t border-line/60 pt-3">
                <p className="mb-2 text-[13px] leading-relaxed text-parchment/80">{e.summary}</p>
                <ol className="space-y-1.5">
                  {e.steps.map((s, i) => (
                    <li key={i} className="flex gap-2 text-[12px] text-muted">
                      <span className="text-ember/60">{i + 1}.</span> {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </article>
        ))}
      </div>

      <section className="mt-8 grid gap-3 md:grid-cols-2">
        <Callout tone="warn" title="Перед покупкой билета">
          Завершите линии Раррана, Томми, Лизы и Коко-ны, оставьте ценности в банке и сохранитесь.
          После отплытия вернуться на остров нельзя — только через Rebirth или новую игру.
        </Callout>
        <Callout tone="danger" title="Не убивайте Гадалку случайно">
          Если вы убьёте Гадалку до отплытия, включится секретная ядерная концовка. Это не «лучший»
          финал, а альтернатива. Решайте осознанно.
        </Callout>
      </section>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <a href={href("quests")} className="text-ember/70 hover:text-ember">
          Все квесты →
        </a>
        <a href={href("mechanics", "rebirth")} className="text-ember/70 hover:text-ember">
          Rebirth после финала →
        </a>
        <a href={href("secrets")} className="text-ember/70 hover:text-ember">
          Секреты и вырезанное →
        </a>
      </div>
    </div>
  );
}
