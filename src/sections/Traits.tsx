import { useMemo, useState } from "react";
import { AlertTriangle, Heart, Search, Sparkles } from "lucide-react";
import { traits, traitGroups } from "../data/traits";
import type { Trait } from "../data/types";
import { Badge, Chips, EmptyState, SectionHeader, StatPill } from "../components/ui";

const groupTones: Record<Trait["group"], "gold" | "ember" | "moss" | "frost" | "violet" | "blood"> = {
  personality: "gold",
  combat: "ember",
  scout: "moss",
  survival: "frost",
  faith: "violet",
  adult: "blood",
};

export function TraitsView({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"all" | Trait["group"]>("all");
  const [showRemoved, setShowRemoved] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return traits.filter((t) => {
      if (group !== "all" && t.group !== group) return false;
      if (!showRemoved && t.removed) return false;
      if (!q) return true;
      return [t.ru, t.name, t.effect, t.requirement, t.note, t.exclusive ?? ""]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(q);
    });
  }, [query, group, showRemoved]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: traits.length };
    for (const t of traits) map[t.group] = (map[t.group] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Персонаж"
        title="Черты"
        description="25 доступных черт: 3 врождённые и 22 обычные, плюс вырезанная Alchemy для сравнения. Очко даётся за каждый уровень, максимум — 99. Часть черт взаимоисключающие, часть открывает целые стили игры."
        meta={
          <>
            <Badge tone="gold">{traits.length} записей</Badge>
            <Badge tone="neutral">1 очко / уровень</Badge>
            <Badge tone="blood">Вырезанное помечено</Badge>
          </>
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <StatPill label="Всего очков к 99 ур." value="99" />
        <StatPill label="Врождённых" value="3" />
        <StatPill label="Обычных" value="22" />
      </div>

      <div className="mb-4 border border-line bg-white/[0.015] p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название, эффект, требование…"
            className="w-full border border-line bg-void/60 py-2 pl-9 pr-3 text-sm text-parchment placeholder:text-muted/40 focus:border-ember/50 focus:outline-none"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chips
            options={[
              { id: "all", label: "Все", count: counts.all },
              ...traitGroups.map((g) => ({
                id: g.id,
                label: g.ru,
                count: counts[g.id] ?? 0,
              })),
            ]}
            value={group}
            onChange={setGroup}
          />
          <button
            onClick={() => setShowRemoved((v) => !v)}
            className={`ml-auto border px-2 py-1 text-[10px] transition ${
              showRemoved ? "border-blood/50 text-[#d98a8a]" : "border-line text-muted hover:text-parchment"
            }`}
          >
            {showRemoved ? "Скрыть вырезанное" : "Показать вырезанное"}
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState text="Черты не найдены." />
      ) : (
        <div className="space-y-4">
          {traitGroups
            .filter((g) => group === "all" || g.id === group)
            .map((g) => {
              const groupTraits = list.filter((t) => t.group === g.id);
              if (groupTraits.length === 0) return null;
              return (
                <section key={g.id}>
                  <div className="mb-2 flex items-center gap-2 border-b border-line/60 pb-1.5">
                    <h2 className="font-display text-lg text-parchment">{g.ru}</h2>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-muted/45">
                      {groupTraits.length}
                    </span>
                    <p className="ml-2 hidden text-[11px] text-muted/55 sm:block">{g.description}</p>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {groupTraits.map((t) => (
                      <article
                        key={t.id}
                        id={`trait-${t.id}`}
                        className={`card scroll-mt-24 p-4 ${
                          focusId === t.id ? "border-ember/60 ring-1 ring-ember/20" : ""
                        } ${t.removed ? "border-dashed opacity-80" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-1.5">
                              <Badge tone={groupTones[t.group]}>{g.ru}</Badge>
                              {t.level > 0 && (
                                <span className="text-[10px] uppercase tracking-wider text-muted/45">
                                  ур. {t.level}
                                </span>
                              )}
                              {t.removed && <Badge tone="blood">Удалено</Badge>}
                            </div>
                            <h3 className="font-display text-base leading-tight text-parchment">{t.ru}</h3>
                            <p className="text-[10px] italic text-muted/45">{t.name}</p>
                          </div>
                          <Heart className="h-4 w-4 shrink-0 text-ember/35" />
                        </div>

                        <p className="mt-2 text-[13px] leading-relaxed text-parchment/85">{t.effect}</p>

                        <div className="mt-2 flex items-start gap-1.5 text-[11px] text-muted/60">
                          <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-gold/60" />
                          <span>Требование: {t.requirement}</span>
                        </div>

                        {t.exclusive && (
                          <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-blood/70">
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>Несовместимо: {t.exclusive}</span>
                          </div>
                        )}

                        <p className="mt-2 border-t border-line/60 pt-2 text-[11px] leading-relaxed text-muted/65">
                          {t.note}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}

      <section className="mt-10 border border-gold/20 bg-gold/[0.04] p-4">
        <h2 className="mb-2 font-display text-lg text-parchment">Как не испортить билд</h2>
        <ul className="space-y-1.5 text-[13px] leading-relaxed text-parchment/80">
          <li>• Не берите HQ-оружие без Weapons Expert: вы не сможете использовать его навыки.</li>
          <li>• Не смешивайте Succubus и Acolyte: это разные крайности, и часть реплик конфликтует.</li>
          <li>• Improved Traps и Create Trap окупаются на Hell/Doom, даже если вы не «ловчий».</li>
          <li>• Очки черт сохраняются при Rebirth, но распределять их придётся заново.</li>
        </ul>
      </section>
    </div>
  );
}
