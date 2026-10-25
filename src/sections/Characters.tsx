import { useMemo, useState } from "react";
import { MapPin, Search, Shield, Sparkles, User, Users } from "lucide-react";
import { characters } from "../data/characters";
import { Badge, EmptyState, SectionHeader, Spoiler, StatPill } from "../components/ui";
import { href } from "../lib/router";

const factionTones: Record<string, "gold" | "frost" | "moss" | "violet" | "blood" | "neutral"> = {
  "Дружелюбные по умолчанию": "moss",
  "Нейтральные": "neutral",
  "Враждебные": "blood",
  "Компаньоны": "violet",
  "Торговцы": "gold",
  "Культ": "blood",
};

export function CharactersView({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState("");
  const [onlyCompanions, setOnlyCompanions] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return characters.filter((c) => {
      if (onlyCompanions && !c.companion) return false;
      if (!q) return true;
      return [c.ru, c.name, c.role, c.faction, c.location, c.summary, c.spoiler ?? ""]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(q);
    });
  }, [query, onlyCompanions]);

  const companions = characters.filter((c) => c.companion).length;

  return (
    <div>
      <SectionHeader
        eyebrow="Мир"
        title="Персонажи и компаньоны"
        description="Кто помогает Лоне, кто использует её и кого можно забрать на корабль. Условия вербовки, роли в бою и слабости — без романтизации."
        meta={
          <>
            <Badge tone="violet">{companions} компаньонов</Badge>
            <Badge tone="neutral">{characters.length} карточек</Badge>
            <Badge tone="blood">Спойлеры скрыты</Badge>
          </>
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <StatPill label="Спутников на корабль" value="4" />
        <StatPill label="Наёмников" value="2" />
        <StatPill label="Смерть спутника" value="навсегда" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 border border-line bg-white/[0.015] p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Имя, роль, локация…"
            className="w-full border border-line bg-void/60 py-2 pl-9 pr-3 text-sm text-parchment placeholder:text-muted/40 focus:border-ember/50 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setOnlyCompanions((v) => !v)}
          className={`border px-3 py-2 text-[11px] uppercase tracking-wider transition ${
            onlyCompanions
              ? "border-violet-400/50 bg-violet-400/10 text-violet-200"
              : "border-line text-muted hover:text-parchment"
          }`}
        >
          Только компаньоны
        </button>
      </div>

      {list.length === 0 ? (
        <EmptyState text="Персонажи не найдены." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((c) => (
            <article
              key={c.id}
              id={`char-${c.id}`}
              className={`card scroll-mt-24 p-5 ${focusId === c.id ? "border-ember/60 ring-1 ring-ember/20" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={factionTones[c.faction] ?? "neutral"}>{c.faction}</Badge>
                    {c.companion && (
                      <Badge tone="violet">
                        <Users className="h-2.5 w-2.5" /> Компаньон
                      </Badge>
                    )}
                  </div>
                  <h2 className="font-display text-xl leading-tight text-parchment">{c.ru}</h2>
                  <p className="text-[11px] italic text-muted/50">{c.name}</p>
                </div>
                <User className="h-5 w-5 shrink-0 text-ember/40" />
              </div>

              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted/70">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-gold/60" /> {c.role}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-ember/60" /> {c.location}
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-parchment/85">{c.summary}</p>

              {c.quests.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.quests.map((q) => (
                    <span key={q} className="border border-line px-1.5 py-0.5 text-[10px] text-muted/70">
                      {q}
                    </span>
                  ))}
                </div>
              )}

              {c.companion && (
                <div className="mt-4 border border-violet-400/20 bg-violet-400/[0.04] p-3">
                  <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                    Как наёмник
                  </div>
                  <dl className="grid gap-x-3 gap-y-1.5 text-[12px] sm:grid-cols-2">
                    <div>
                      <dt className="text-muted/50">Позиция</dt>
                      <dd className="text-parchment/85">{c.companion.position}</dd>
                    </div>
                    <div>
                      <dt className="text-muted/50">Стиль</dt>
                      <dd className="text-parchment/85">{c.companion.style}</dd>
                    </div>
                    <div>
                      <dt className="text-muted/50">Цена</dt>
                      <dd className="text-parchment/85">{c.companion.cost}</dd>
                    </div>
                    <div>
                      <dt className="text-muted/50">Срок</dt>
                      <dd className="text-parchment/85">{c.companion.duration}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-muted/50">Сильные стороны</dt>
                      <dd className="text-parchment/85">{c.companion.strengths}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-muted/50">Слабости</dt>
                      <dd className="text-parchment/85">{c.companion.weaknesses}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-muted/50">Вербовка</dt>
                      <dd className="text-parchment/85">{c.companion.recruit}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {c.spoiler && (
                <Spoiler className="mt-3" label="Спойлер: судьба персонажа">
                  <p className="border-l-2 border-blood/40 bg-blood/[0.04] p-3 text-[13px] leading-relaxed text-parchment/80">
                    {c.spoiler}
                  </p>
                </Spoiler>
              )}
            </article>
          ))}
        </div>
      )}

      <section className="mt-10 border border-line bg-white/[0.015] p-5">
        <h2 className="mb-3 font-display text-xl text-parchment">Кого брать на корабль</h2>
        <p className="text-sm leading-relaxed text-muted">
          Для финальной сцены важны завершённые линии <strong className="text-parchment">Раррана</strong>,{" "}
          <strong className="text-parchment">Томми</strong>, <strong className="text-parchment">Лизы</strong> и{" "}
          <strong className="text-parchment">Коко-ны</strong>. Если линия не закрыта, персонаж остаётся на
          острове. Проверяйте их до покупки билета, а не после.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <a href={href("quests")} className="inline-flex items-center gap-1 text-ember/70 hover:text-ember">
            <Shield className="h-3.5 w-3.5" /> Квесты компаньонов
          </a>
          <a href={href("endings")} className="text-ember/70 hover:text-ember">
            Условия концовок →
          </a>
        </div>
      </section>
    </div>
  );
}
