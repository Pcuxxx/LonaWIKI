import { useMemo, useState } from "react";
import { AlertTriangle, Filter, Hammer, Search, Shield, Sparkles } from "lucide-react";
import { equipment, equipmentSets } from "../data/equipment";
import type { Equipment } from "../data/types";
import { Badge, Chips, EmptyState, SearchField, SectionHeader, StatPill } from "../components/ui";
import { href } from "../lib/router";

const kindLabels: Record<Equipment["kind"], string> = {
  weapon: "Оружие",
  armor: "Броня",
  clothing: "Одежда",
  accessory: "Аксессуар",
  shield: "Щит",
  book: "Книга / реликвия",
};

const kindTones: Record<Equipment["kind"], "ember" | "frost" | "gold" | "violet" | "moss" | "blood"> = {
  weapon: "ember",
  armor: "frost",
  clothing: "moss",
  accessory: "gold",
  shield: "violet",
  book: "blood",
};

type SortKey = "default" | "price" | "name";

export function EquipmentView({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | Equipment["kind"]>("all");
  const [sort, setSort] = useState<SortKey>("default");
  const [hideRemoved, setHideRemoved] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    const list = equipment.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (hideRemoved && item.removed) return false;
      if (!q) return true;
      return [item.ru, item.name, item.stats, item.where, item.note, item.set ?? "", item.weaponClass ?? ""]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(q);
    });
    if (sort === "price") list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "name") list.sort((a, b) => a.ru.localeCompare(b.ru, "ru"));
    return list;
  }, [query, kind, sort, hideRemoved]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: equipment.length };
    for (const item of equipment) map[item.kind] = (map[item.kind] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Персонаж"
        title="Снаряжение"
        description="Оружие, броня, одежда и аксессуары с реальными статами. Цены указаны в TP (1 Copper Coin = 200 TP, 1 Gold Coin = 20 000 TP). Вырезанные и отладочные предметы помечены отдельно."
        meta={
          <>
            <Badge tone="gold">{equipment.length} предметов</Badge>
            <Badge tone="violet">{equipmentSets.length} сетов</Badge>
            <Badge tone="neutral">Данные B.0.10.8.31</Badge>
          </>
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <StatPill label="Слотов" value="10" />
        <StatPill label="HQ-оружие" value="Weapons Expert" />
        <StatPill label="Магия" value="Mana Knowledge" />
      </div>

      <div className="sticky top-16 z-20 -mx-1 mb-4 border border-line bg-abyss/95 px-3 py-3 backdrop-blur">
        <SearchField value={query} onChange={setQuery} placeholder="Название, стат, сет, где найти…" />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chips
            options={[
              { id: "all", label: "Все", count: counts.all },
              ...(Object.keys(kindLabels) as Equipment["kind"][]).map((k) => ({
                id: k,
                label: kindLabels[k],
                count: counts[k] ?? 0,
              })),
            ]}
            value={kind}
            onChange={setKind}
          />
          <div className="ml-auto flex items-center gap-1">
            {(
              [
                ["default", "По умолчанию"],
                ["price", "Дороже"],
                ["name", "А-Я"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSort(id)}
                className={`border px-2 py-1 text-[10px] transition ${
                  sort === id ? "border-gold/50 text-gold" : "border-line text-muted hover:text-parchment"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setHideRemoved((v) => !v)}
              className={`border px-2 py-1 text-[10px] transition ${
                hideRemoved ? "border-line text-muted hover:text-parchment" : "border-blood/50 text-[#d98a8a]"
              }`}
            >
              {hideRemoved ? "Показать вырезанное" : "Скрыть вырезанное"}
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="Ничего не найдено. Сбросьте фильтры или измените запрос." />
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {filtered.map((item) => (
            <article
              key={item.id}
              id={`eq-${item.id}`}
              className={`card scroll-mt-24 p-4 transition ${
                focusId === item.id ? "border-ember/60 ring-1 ring-ember/25" : ""
              } ${item.removed ? "border-dashed opacity-80" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={kindTones[item.kind]}>{kindLabels[item.kind]}</Badge>
                    <span className="text-[10px] uppercase tracking-wider text-muted/45">{item.slot}</span>
                    {item.removed && <Badge tone="blood">Вырезано</Badge>}
                  </div>
                  <h3 className="font-display text-lg leading-tight text-parchment">{item.ru}</h3>
                  <p className="text-[11px] italic text-muted/50">{item.name}</p>
                </div>
                <div className="shrink-0 text-right">
                  {typeof item.price === "number" && item.price > 0 ? (
                    <div className="font-display text-sm text-gold">{item.price.toLocaleString("ru-RU")} TP</div>
                  ) : (
                    <div className="text-[10px] uppercase tracking-wider text-muted/40">Без цены</div>
                  )}
                  {typeof item.weight === "number" && (
                    <div className="text-[10px] text-muted/45">{item.weight} кг</div>
                  )}
                </div>
              </div>

              <div className="mt-3 border-l-2 border-ember/30 pl-2.5">
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted/45">Статы</div>
                <p className="text-[13px] leading-relaxed text-parchment/85">{item.stats}</p>
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-muted">{item.note}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line/60 pt-2 text-[11px] text-muted/70">
                <span className="inline-flex items-center gap-1">
                  <Search className="h-3 w-3 text-ember/50" /> {item.where}
                </span>
                {item.set && (
                  <span className="inline-flex items-center gap-1 text-violet-300/70">
                    <Sparkles className="h-3 w-3" /> Сет: {item.set}
                  </span>
                )}
                {item.requirements && (
                  <span className="inline-flex items-center gap-1 text-gold/70">
                    <Shield className="h-3 w-3" /> {item.requirements}
                  </span>
                )}
              </div>
              {item.weaponClass && (
                <div className="mt-1.5 inline-flex items-center gap-1 border border-line/70 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted/50">
                  <Hammer className="h-2.5 w-2.5" /> {item.weaponClass}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3 border-b border-line/70 pb-2">
          <h2 className="font-display text-2xl text-parchment">Комплекты</h2>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted/45">{equipmentSets.length} сетов</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {equipmentSets.map((set) => (
            <div key={set.name} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-base text-parchment">{set.ru}</h3>
                  <p className="text-[10px] uppercase tracking-wider text-muted/45">{set.name}</p>
                </div>
                <Badge tone={set.rating === "топ" ? "gold" : "neutral"}>{set.rating}</Badge>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{set.pieces}</p>
              <p className="mt-2 border-t border-line/60 pt-2 text-[12px] leading-relaxed text-parchment/80">
                {set.bonus}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 border border-gold/20 bg-gold/[0.04] p-4">
        <div className="flex items-start gap-2 text-[13px] leading-relaxed text-parchment/80">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
          <p>
            HQ-оружие и магические книги бесполезны без соответствующих черт. Купили саблю, не взяв
            Weapons Expert, — выбросили деньги. Проверяйте требования до покупки.
          </p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <a href={href("builds")} className="text-xs uppercase tracking-[0.16em] text-ember/70 hover:text-ember">
          Подобрать билд под снаряжение →
        </a>
      </div>
    </div>
  );
}

export { kindLabels };
