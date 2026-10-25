import { useMemo, useState } from "react";
import { AlertTriangle, Package, ScrollText, Search } from "lucide-react";
import { consumables, questItems } from "../data/items";
import type { Consumable } from "../data/types";
import { Badge, Chips, EmptyState, SectionHeader } from "../components/ui";
import { href } from "../lib/router";

const categoryLabels: Record<Consumable["category"], string> = {
  food: "Еда",
  medicine: "Медицина",
  drug: "Наркотики",
  material: "Материалы",
  tool: "Инструменты",
  valuable: "Ценности",
  service: "Услуги",
};

const categoryTones: Record<Consumable["category"], "moss" | "frost" | "blood" | "neutral" | "gold" | "violet" | "ember"> = {
  food: "moss",
  medicine: "frost",
  drug: "blood",
  material: "neutral",
  tool: "ember",
  valuable: "gold",
  service: "violet",
};

export function ItemsView({ focusId }: { focusId?: string }) {
  const [tab, setTab] = useState<"consumables" | "quest">("consumables");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Consumable["category"]>("all");
  const [hideRemoved, setHideRemoved] = useState(true);

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return consumables.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (hideRemoved && item.removed) return false;
      if (!q) return true;
      return [item.ru, item.name, item.effect, item.source, item.note ?? ""]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(q);
    });
  }, [query, category, hideRemoved]);

  const quests = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    if (!q) return questItems;
    return questItems.filter((item) =>
      [item.ru, item.name, item.quest, item.use].join(" ").toLocaleLowerCase("ru").includes(q),
    );
  }, [query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: consumables.length };
    for (const item of consumables) map[item.category] = (map[item.category] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Персонаж"
        title="Предметы и лут"
        description="Расходники, еда, лекарства, материалы и квестовые вещи. Цены — базовые, у торговцев отличаются. Квестовые предметы нельзя продавать: потеряете прогресс."
        meta={
          <>
            <Badge tone="gold">{consumables.length} обычных</Badge>
            <Badge tone="violet">{questItems.length} квестовых</Badge>
            <Badge tone="blood">18+ в категории «Услуги»</Badge>
          </>
        }
      />

      <div className="mb-4 inline-flex border border-line">
        <button
          onClick={() => setTab("consumables")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider transition ${
            tab === "consumables" ? "bg-ember/15 text-ember" : "text-muted hover:text-parchment"
          }`}
        >
          <Package className="h-3.5 w-3.5" /> Расходники
        </button>
        <button
          onClick={() => setTab("quest")}
          className={`inline-flex items-center gap-2 border-l border-line px-4 py-2 text-xs uppercase tracking-wider transition ${
            tab === "quest" ? "bg-ember/15 text-ember" : "text-muted hover:text-parchment"
          }`}
        >
          <ScrollText className="h-3.5 w-3.5" /> Квестовые
        </button>
      </div>

      <div className="mb-4 border border-line bg-white/[0.015] p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "consumables" ? "Название, эффект, источник…" : "Предмет, квест, применение…"}
            className="w-full border border-line bg-void/60 py-2 pl-9 pr-3 text-sm text-parchment placeholder:text-muted/40 focus:border-ember/50 focus:outline-none"
          />
        </div>
        {tab === "consumables" && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Chips
              options={[
                { id: "all", label: "Все", count: counts.all },
                ...(Object.keys(categoryLabels) as Consumable["category"][]).map((c) => ({
                  id: c,
                  label: categoryLabels[c],
                  count: counts[c] ?? 0,
                })),
              ]}
              value={category}
              onChange={setCategory}
            />
            <button
              onClick={() => setHideRemoved((v) => !v)}
              className={`ml-auto border px-2 py-1 text-[10px] transition ${
                hideRemoved ? "border-line text-muted hover:text-parchment" : "border-blood/50 text-[#d98a8a]"
              }`}
            >
              {hideRemoved ? "Показать вырезанное" : "Скрыть вырезанное"}
            </button>
          </div>
        )}
      </div>

      {tab === "consumables" ? (
        items.length === 0 ? (
          <EmptyState text="Предметы не найдены." />
        ) : (
          <div className="overflow-x-auto border border-line">
            <table className="wiki-table min-w-[720px]">
              <thead>
                <tr>
                  <th>Предмет</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Эффект</th>
                  <th>Где взять</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} id={`item-${item.id}`} className="scroll-mt-24">
                    <td>
                      <div className="font-medium text-parchment">{item.ru}</div>
                      <div className="text-[10px] italic text-muted/45">{item.name}</div>
                      {item.removed && <Badge tone="blood">Вырезано</Badge>}
                    </td>
                    <td>
                      <Badge tone={categoryTones[item.category]}>{categoryLabels[item.category]}</Badge>
                    </td>
                    <td className="whitespace-nowrap text-gold/85">
                      {typeof item.price === "number" ? `${item.price.toLocaleString("ru-RU")} TP` : "—"}
                    </td>
                    <td className="max-w-[340px] text-[12px]">{item.effect}</td>
                    <td className="text-[12px] text-muted">
                      {item.source}
                      {item.note && <div className="mt-1 text-[11px] text-muted/55">{item.note}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : quests.length === 0 ? (
        <EmptyState text="Квестовые предметы не найдены." />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {quests.map((item) => (
            <article
              key={item.id}
              id={`qi-${item.id}`}
              className={`card scroll-mt-24 p-4 ${focusId === item.id ? "border-ember/60" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display text-base text-parchment">{item.ru}</h3>
                  <p className="text-[10px] italic text-muted/45">{item.name}</p>
                </div>
                {item.missable && <Badge tone="blood">Пропускаемое</Badge>}
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-parchment/80">{item.use}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted/60">
                <ScrollText className="h-3 w-3 text-ember/50" /> {item.quest}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8 border border-blood/25 bg-blood/[0.05] p-4">
        <div className="flex items-start gap-2 text-[13px] leading-relaxed text-parchment/80">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#d98a8a]" />
          <p>
            Не выбрасывайте «бесполезные» квестовые предметы. Головы, документы и детали часто нужны
            через несколько часов или в другой сюжетной ветке. Если сомневаетесь — оставьте в банке.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <a href={href("equipment")} className="text-ember/70 hover:text-ember">
          Снаряжение →
        </a>
        <a href={href("mechanics", "economy")} className="text-ember/70 hover:text-ember">
          Экономика и цены →
        </a>
      </div>
    </div>
  );
}
