import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Backpack,
  Check,
  Coins,
  Copy,
  FlaskConical,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBasket,
  Sparkles,
  Swords,
  Trash2,
  Weight,
} from "lucide-react";
import { recipes, type Recipe } from "../data/original";
import { equipment } from "../data/equipment";
import { consumables } from "../data/items";
import { Badge, Chips, SectionHeader, SectionSubhead, SearchField } from "../components/ui";
import { trackEvent } from "../lib/analytics";

/* ------------------------------------------------------------------ */
/*  Крафт                                                              */
/* ------------------------------------------------------------------ */

const INGREDIENTS = [...new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.name)))].sort((a, b) =>
  a.localeCompare(b, "ru"),
);

const INGREDIENT_USAGE = (() => {
  const map = new Map<string, number>();
  for (const recipe of recipes) for (const ing of recipe.ingredients) map.set(ing.name, (map.get(ing.name) ?? 0) + 1);
  return map;
})();

function missingFor(recipe: Recipe, selected: Set<string>) {
  return recipe.ingredients.filter((ing) => !selected.has(ing.name));
}

/* ------------------------------------------------------------------ */
/*  Сравнение снаряжения                                               */
/* ------------------------------------------------------------------ */

const SLOT_LABELS: Record<string, string> = {
  "Main Hand": "Основная рука",
  "Right Hand": "Правая рука",
  "Left Hand": "Левая рука",
  "Off-hand": "Левая рука / щит",
  "Two Handed": "Двуручное",
  Head: "Голова",
  Hair: "Волосы",
  Top: "Верх",
  TopExtra: "Верх (доп. слой)",
  Mid: "Средний слой",
  MidExtra: "Средний слой (доп.)",
  Bot: "Низ",
  Acc: "Аксессуар",
  Quest: "Квестовое",
};

function parseStats(raw: string): Map<string, number> {
  const map = new Map<string, number>();
  for (const chunk of raw.split(";")) {
    const text = chunk.trim();
    if (!text) continue;
    const m = /([+\-−–]?\s*\d+(?:[.,]\d+)?)/.exec(text);
    if (!m) continue;
    const value = Number(m[1].replace(/[−–]/g, "-").replace(/\s/g, "").replace(",", "."));
    const name = text
      .slice(0, m.index)
      .replace(/[:+]$/, "")
      .trim();
    if (!name) continue;
    map.set(name, (map.get(name) ?? 0) + value);
  }
  return map;
}

const STAT_ORDER = [
  "Atk",
  "M.Atk",
  "Matk",
  "Def",
  "M.Def",
  "Mdef",
  "Hit",
  "Eva",
  "Cri",
  "Block",
  "Dodge",
  "Speed",
  "HP",
  "STA",
  "SAT",
  "Mood",
  "Sexy",
  "Weak",
  "STR",
  "DEX",
  "INT",
  "CON",
  "WIS",
  "SUR",
  "SCU",
  "Morale",
  "Karma",
];

function sortStats(names: string[]) {
  return names.slice().sort((a, b) => {
    const ia = STAT_ORDER.indexOf(a);
    const ib = STAT_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, "ru");
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

function signed(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n > 0 ? `+${n}` : `${n}`;
}

/* ------------------------------------------------------------------ */
/*  Список покупок                                                     */
/* ------------------------------------------------------------------ */

interface ShoppingItem {
  key: string;
  label: string;
  price: number;
  qty: number;
  kind: "equipment" | "consumable";
}

const CATALOG = [
  ...equipment
    .filter((e) => typeof e.price === "number" && e.price > 0)
    .map((e) => ({ key: `eq:${e.id}`, label: `${e.ru} (${e.name})`, price: e.price as number, kind: "equipment" as const })),
  ...consumables
    .filter((c) => typeof c.price === "number" && c.price > 0)
    .map((c) => ({ key: `item:${c.id}`, label: `${c.ru} (${c.name})`, price: c.price as number, kind: "consumable" as const })),
].sort((a, b) => a.label.localeCompare(b.label, "ru"));

const SHOPPING_KEY = "lonawiki:shopping:v1";

function loadShopping(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(SHOPPING_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is ShoppingItem =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as ShoppingItem).key === "string" &&
          typeof (item as ShoppingItem).label === "string" &&
          typeof (item as ShoppingItem).price === "number" &&
          typeof (item as ShoppingItem).qty === "number",
      )
      .map((item) => ({ ...item, qty: Math.max(1, Math.min(99, Math.round(item.qty))) }));
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Компонент                                                          */
/* ------------------------------------------------------------------ */

type ToolTab = "craft" | "compare" | "shopping" | "loadout";

const TABS: { id: ToolTab; label: string; icon: typeof FlaskConical }[] = [
  { id: "craft", label: "Котёл", icon: FlaskConical },
  { id: "compare", label: "Снаряжение", icon: Swords },
  { id: "shopping", label: "Список покупок", icon: ShoppingBasket },
  { id: "loadout", label: "Комплект", icon: Backpack },
];

export function ToolsView() {
  const [tab, setTab] = useState<ToolTab>("craft");

  return (
    <div>
      <SectionHeader
        eyebrow="Практика"
        title="Инструменты"
        description="Четыре вещи, которые чаще всего нужны в игре: понять, что можно сварить из имеющихся ингредиентов, сравнить две единицы снаряжения по статам, посчитать закупку в TP и собрать комплект с общим весом."
        meta={
          <>
            <Badge tone="gold">{recipes.length} рецептов</Badge>
            <Badge tone="neutral">{equipment.length} предметов снаряжения</Badge>
            <Badge tone="frost">{CATALOG.length} позиций с ценой</Badge>
          </>
        }
      />

      <div className="mb-5 flex overflow-x-auto border-b border-line/80">
        {TABS.map((entry) => {
          const Icon = entry.icon;
          return (
            <button
              key={entry.id}
              onClick={() => {
                setTab(entry.id);
                trackEvent("tools-tab", entry.id);
              }}
              className={`relative flex shrink-0 items-center gap-2 px-4 py-2.5 text-[12px] transition ${
                tab === entry.id ? "text-parchment" : "text-muted/55 hover:text-parchment/85"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${tab === entry.id ? "text-gold/80" : "text-muted/35"}`} />
              {entry.label}
              {tab === entry.id && <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />}
            </button>
          );
        })}
      </div>

      {tab === "craft" && <CraftTool />}
      {tab === "compare" && <CompareTool />}
      {tab === "shopping" && <ShoppingTool />}
      {tab === "loadout" && <LoadoutTool />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Котёл                                                              */
/* ------------------------------------------------------------------ */

function CraftTool() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [recipeQuery, setRecipeQuery] = useState("");
  const [mode, setMode] = useState<"all" | "ready">("all");

  const toggleIngredient = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const visibleIngredients = useMemo(() => {
    const q = ingredientQuery.trim().toLocaleLowerCase("ru");
    return q ? INGREDIENTS.filter((name) => name.toLocaleLowerCase("ru").includes(q)) : INGREDIENTS;
  }, [ingredientQuery]);

  const list = useMemo(() => {
    const q = recipeQuery.trim().toLocaleLowerCase("ru");
    const rows = recipes
      .map((recipe) => ({ recipe, missing: missingFor(recipe, selected) }))
      .filter(({ recipe, missing }) => {
        if (mode === "ready" && selected.size > 0 && missing.length > 0) return false;
        if (mode === "ready" && selected.size === 0) return false;
        if (!q) return true;
        return [
          ...recipe.product.map((p) => p.name),
          ...recipe.ingredients.map((i) => i.name),
          recipe.note ?? "",
        ]
          .join(" ")
          .toLocaleLowerCase("ru")
          .includes(q);
      });
    rows.sort((a, b) => a.missing.length - b.missing.length || a.recipe.product[0].name.localeCompare(b.recipe.product[0].name, "ru"));
    return rows;
  }, [recipeQuery, selected, mode]);

  return (
    <div>
      <SectionSubhead
        title="Калькулятор рецептов"
        aside={`${recipes.length} рецептов · ${INGREDIENTS.length} ингредиентов`}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="border border-line/80 bg-white/[0.012] p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.2em] text-ember/80">Что у вас есть</span>
            <span className="text-[10px] tabular-nums text-muted/45">
              {selected.size} / {INGREDIENTS.length}
            </span>
          </div>
          <SearchField value={ingredientQuery} onChange={setIngredientQuery} placeholder="Ингредиент…" />
          <div className="mt-2.5 flex max-h-72 flex-wrap gap-1.5 overflow-y-auto pr-1">
            {visibleIngredients.map((name) => {
              const active = selected.has(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleIngredient(name)}
                  className={`inline-flex items-center gap-1 border px-2 py-1 text-[10.5px] transition ${
                    active
                      ? "border-moss/55 bg-moss/[0.12] text-[#b9d3ad]"
                      : "border-line/80 text-muted/65 hover:border-ember/35 hover:text-parchment"
                  }`}
                  title={`Используется в ${INGREDIENT_USAGE.get(name) ?? 0} рецептах`}
                >
                  {active && <Check className="h-2.5 w-2.5" />}
                  {name}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelected(new Set())}
              className="border border-line px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.12em] text-muted/70 transition hover:border-blood/40 hover:text-[#dda0a0]"
            >
              очистить
            </button>
            <button
              onClick={() => setSelected(new Set(INGREDIENTS))}
              className="border border-line px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.12em] text-muted/70 transition hover:border-moss/40 hover:text-parchment"
            >
              всё есть
            </button>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted/40">
            Калькулятор проверяет только наличие типов ингредиентов. Количество в стопке и требуемый SUR указаны в карточке рецепта.
          </p>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <SearchField value={recipeQuery} onChange={setRecipeQuery} placeholder="Блюдо или ингредиент…" className="w-full sm:w-72" />
            <Chips
              options={[
                { id: "all", label: "Все рецепты", count: recipes.length },
                { id: "ready", label: "Можно сварить", count: selected.size ? recipes.filter((r) => missingFor(r, selected).length === 0).length : 0 },
              ]}
              value={mode}
              onChange={setMode}
              label="Режим"
            />
          </div>

          {mode === "ready" && selected.size === 0 ? (
            <div className="border border-dashed border-line/70 px-4 py-12 text-center text-[12px] text-muted/55">
              Отметьте ингредиенты слева — и здесь останутся только те рецепты, которые можно сварить.
            </div>
          ) : list.length === 0 ? (
            <div className="border border-dashed border-line/70 px-4 py-12 text-center text-[12px] text-muted/55">
              Ничего не нашлось. Попробуйте другое название или снимите фильтр.
            </div>
          ) : (
            <div className="grid gap-2.5 md:grid-cols-2">
              {list.map(({ recipe, missing }) => {
                const ready = missing.length === 0;
                return (
                  <article
                    key={`${recipe.product.map((p) => p.name).join("|")}-${recipe.ingredients.map((i) => i.name).join("|")}`}
                    className={`border p-3 transition ${ready && selected.size > 0 ? "border-moss/40 bg-moss/[0.04]" : "border-line/80 bg-white/[0.012]"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.05rem] leading-tight text-parchment">
                          {recipe.product.map((p) => `${p.name} ${p.qty}`).join(", ")}
                        </h3>
                        {recipe.sur && (
                          <span className="mt-1 inline-flex items-center gap-1 border border-frost/25 bg-frost/[0.06] px-1.5 py-0.5 text-[8.5px] uppercase tracking-[0.1em] text-frost/85">
                            SUR {recipe.sur}
                          </span>
                        )}
                      </div>
                      {selected.size > 0 && (
                        <span
                          className={`shrink-0 border px-1.5 py-0.5 text-[8.5px] uppercase tracking-[0.1em] ${
                            ready ? "border-moss/45 bg-moss/[0.1] text-moss" : "border-blood/35 bg-blood/[0.06] text-[#d99a9a]"
                          }`}
                        >
                          {ready ? "готово" : `−${missing.length}`}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {recipe.ingredients.map((ing) => {
                        const have = selected.has(ing.name);
                        return (
                          <button
                            key={`${ing.name}-${ing.qty}`}
                            onClick={() => toggleIngredient(ing.name)}
                            className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[10px] transition ${
                              have
                                ? "border-moss/40 bg-moss/[0.08] text-[#b9d3ad]"
                                : missing.some((m) => m.name === ing.name)
                                  ? "border-blood/30 text-[#d7a0a0]/85 hover:border-blood/50"
                                  : "border-line text-muted/70 hover:border-ember/35"
                            }`}
                          >
                            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                            {ing.name} <span className="text-muted/45">{ing.qty}</span>
                          </button>
                        );
                      })}
                    </div>

                    {recipe.note && <p className="mt-2 text-[10.5px] leading-relaxed text-muted/50">{recipe.note}</p>}

                    {!ready && selected.size > 0 && (
                      <button
                        onClick={() => setSelected((prev) => new Set([...prev, ...recipe.ingredients.map((i) => i.name)]))}
                        className="mt-2 inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[0.12em] text-ember/75 transition hover:text-gold"
                      >
                        <Plus className="h-2.5 w-2.5" /> добавить недостающее
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Сравнение                                                          */
/* ------------------------------------------------------------------ */

function CompareTool() {
  const slots = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of equipment) {
      if (item.removed) continue;
      map.set(item.slot, (map.get(item.slot) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1] || (SLOT_LABELS[a[0]] ?? a[0]).localeCompare(SLOT_LABELS[b[0]] ?? b[0], "ru"));
  }, []);

  const [slot, setSlot] = useState(slots[0]?.[0] ?? "Main Hand");
  const pool = useMemo(() => equipment.filter((e) => e.slot === slot && !e.removed), [slot]);
  const [leftId, setLeftId] = useState<string>("");
  const [rightId, setRightId] = useState<string>("");

  useEffect(() => {
    setLeftId(pool[0]?.id ?? "");
    setRightId(pool[1]?.id ?? pool[0]?.id ?? "");
  }, [pool]);

  const left = pool.find((e) => e.id === leftId) ?? pool[0];
  const right = pool.find((e) => e.id === rightId) ?? pool[1] ?? pool[0];

  const statsLeft = useMemo(() => (left ? parseStats(left.stats) : new Map<string, number>()), [left]);
  const statsRight = useMemo(() => (right ? parseStats(right.stats) : new Map<string, number>()), [right]);
  const statNames = useMemo(
    () => sortStats([...new Set([...statsLeft.keys(), ...statsRight.keys()])]),
    [statsLeft, statsRight],
  );

  return (
    <div>
      <SectionSubhead title="Сравнение экипировки" aside={`${equipment.length} предметов`} />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[8.5px] uppercase tracking-[0.18em] text-muted/45">Слот</span>
          <select
            value={slot}
            onChange={(event) => setSlot(event.target.value)}
            className="min-w-[220px] border border-line bg-void px-3 py-2 text-[12px] text-parchment outline-none focus:border-ember/50"
          >
            {slots.map(([id, count]) => (
              <option key={id} value={id}>
                {SLOT_LABELS[id] ?? id} · {count}
              </option>
            ))}
          </select>
        </label>
      </div>

      {pool.length === 0 ? (
        <div className="border border-dashed border-line/70 px-4 py-12 text-center text-[12px] text-muted/55">В этом слоте пока нет предметов.</div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { item: left, value: leftId, set: setLeftId, side: "Слева" },
              { item: right, value: rightId, set: setRightId, side: "Справа" },
            ].map(({ item, value, set, side }) => (
              <div key={side} className="border border-line/80 bg-white/[0.012] p-3.5">
                <span className="mb-1 block text-[8.5px] uppercase tracking-[0.2em] text-muted/40">{side}</span>
                <select
                  value={value}
                  onChange={(event) => set(event.target.value)}
                  className="w-full border border-line bg-void px-2.5 py-2 text-[12px] text-parchment outline-none focus:border-ember/50"
                >
                  {pool.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.ru} — {entry.name}
                    </option>
                  ))}
                </select>
                {item && (
                  <div className="mt-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-[1.15rem] leading-tight text-parchment">{item.ru}</h3>
                      <span className="shrink-0 font-mono text-[10px] text-muted/45">{item.price ? `${item.price.toLocaleString("ru")} TP` : "—"}</span>
                    </div>
                    <p className="text-[10px] italic text-muted/40">{item.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10.5px]">
                      <span className="text-muted/45">Вес</span>
                      <span className="text-parchment/75">{item.weight ?? "—"}</span>
                      <span className="text-muted/45">Требования</span>
                      <span className="text-parchment/75">{item.requirements || "нет"}</span>
                      <span className="text-muted/45">Где взять</span>
                      <span className="text-parchment/75">{item.where}</span>
                    </div>
                    {item.note && <p className="mt-2 text-[10.5px] leading-relaxed text-muted/50">{item.note}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto border border-line/80">
            <table className="w-full min-w-[420px] border-collapse text-[11.5px]">
              <thead>
                <tr className="border-b border-line/70 bg-white/[0.02] text-[8.5px] uppercase tracking-[0.16em] text-muted/45">
                  <th className="px-3 py-2 text-left font-medium">Стат</th>
                  <th className="px-3 py-2 text-right font-medium">Слева</th>
                  <th className="px-3 py-2 text-right font-medium">Справа</th>
                  <th className="px-3 py-2 text-right font-medium">Δ</th>
                </tr>
              </thead>
              <tbody>
                {statNames.map((name) => {
                  const a = statsLeft.get(name);
                  const b = statsRight.get(name);
                  const diff = typeof a === "number" && typeof b === "number" ? b - a : undefined;
                  return (
                    <tr key={name} className="border-b border-line/30 last:border-b-0">
                      <td className="px-3 py-1.5 text-muted/70">{name}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-parchment/80">{typeof a === "number" ? signed(a) : "—"}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-parchment/80">{typeof b === "number" ? signed(b) : "—"}</td>
                      <td
                        className={`px-3 py-1.5 text-right tabular-nums ${
                          diff === undefined ? "text-muted/35" : diff > 0 ? "text-frost" : diff < 0 ? "text-[#d98a8a]" : "text-muted/45"
                        }`}
                      >
                        {diff === undefined ? "—" : diff === 0 ? "=" : signed(diff)}
                      </td>
                    </tr>
                  );
                })}
                {statNames.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-muted/50">
                      У этих предметов нет числовых статов.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-muted/40">
            Δ — разница «справа минус слева». Для «Weak» и «Sexy» меньше обычно лучше, поэтому оценивайте знак с учётом смысла стата.
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Список покупок                                                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Комплект                                                           */
/* ------------------------------------------------------------------ */

const LOADOUT_SLOTS = [
  "Two Handed",
  "Main Hand",
  "Right Hand",
  "Left Hand",
  "Off-hand",
  "Head",
  "Hair",
  "Top",
  "TopExtra",
  "Mid",
  "MidExtra",
  "Bot",
  "Acc",
] as const;

const HAND_SLOTS = new Set<string>(["Main Hand", "Right Hand", "Left Hand", "Off-hand"]);

function LoadoutTool() {
  const [picked, setPicked] = useState<Record<string, string>>({});

  const poolBySlot = useMemo(() => {
    const map = new Map<string, typeof equipment>();
    for (const slot of LOADOUT_SLOTS) {
      const pool = equipment
        .filter((item) => item.slot === slot && !item.removed)
        .sort((a, b) => (a.price ?? 0) - (b.price ?? 0) || a.ru.localeCompare(b.ru, "ru"));
      if (pool.length > 0) map.set(slot, pool);
    }
    return map;
  }, []);

  const choose = (slot: string, id: string) => {
    setPicked((prev) => {
      const next = { ...prev };
      if (!id) {
        delete next[slot];
        return next;
      }
      if (slot === "Two Handed") for (const hand of HAND_SLOTS) delete next[hand];
      if (HAND_SLOTS.has(slot)) delete next["Two Handed"];
      next[slot] = id;
      return next;
    });
  };

  const chosen = useMemo(
    () =>
      LOADOUT_SLOTS.flatMap((slot) => {
        const item = equipment.find((entry) => entry.id === picked[slot]);
        return item ? [{ slot, item }] : [];
      }),
    [picked],
  );

  const totalPrice = chosen.reduce((sum, entry) => sum + (entry.item.price ?? 0), 0);
  const totalWeight = chosen.reduce((sum, entry) => sum + (entry.item.weight ?? 0), 0);
  const requirements = useMemo(
    () => [...new Set(chosen.map((entry) => entry.item.requirements).filter(Boolean))] as string[],
    [chosen],
  );
  const twoHanded = Boolean(picked["Two Handed"]);

  return (
    <div>
      <SectionSubhead title="Сборка комплекта" aside="Цена, вес и требования" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="border border-line/80 bg-white/[0.012] p-3.5">
          <p className="mb-3 text-[11px] leading-relaxed text-muted/60">
            Выберите по одному предмету на слот. Двуручное оружие несовместимо с предметами в руках —
            при выборе оно снимает их автоматически. Цены и вес взяты из таблицы снаряжения.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {LOADOUT_SLOTS.map((slot) => {
              const pool = poolBySlot.get(slot);
              if (!pool) return null;
              const item = equipment.find((entry) => entry.id === picked[slot]);
              const disabled = twoHanded && HAND_SLOTS.has(slot) && slot !== "Two Handed";
              return (
                <label key={slot} className="flex flex-col gap-1">
                  <span className="flex items-baseline justify-between gap-2 text-[8.5px] uppercase tracking-[0.16em] text-muted/45">
                    {SLOT_LABELS[slot] ?? slot}
                    {item && (
                      <span className="font-mono text-[9px] normal-case tracking-normal text-muted/35">
                        {item.price ? `${item.price.toLocaleString("ru")} TP` : "—"} · {item.weight ?? "—"} кг
                      </span>
                    )}
                  </span>
                  <select
                    value={picked[slot] ?? ""}
                    onChange={(event) => choose(slot, event.target.value)}
                    disabled={disabled}
                    className="w-full border border-line bg-void px-2.5 py-2 text-[11.5px] text-parchment outline-none transition focus:border-ember/50 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <option value="">— не выбрано —</option>
                    {pool.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.ru} — {entry.name}
                      </option>
                    ))}
                  </select>
                  {disabled && (
                    <span className="text-[9px] text-muted/30">Недоступно с двуручным оружием.</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <aside className="h-fit border border-line/80 bg-white/[0.012] p-3.5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.2em] text-ember/80">Итого</span>
            <button
              onClick={() => setPicked({})}
              disabled={chosen.length === 0}
              className="flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-muted/45 transition hover:text-parchment disabled:opacity-30"
            >
              <RotateCcw className="h-3 w-3" />
              Сброс
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between gap-2 border-b border-line/50 pb-2">
              <span className="flex items-center gap-1.5 text-[10.5px] text-muted/55">
                <Coins className="h-3.5 w-3.5 text-gold/55" />
                Стоимость
              </span>
              <span className="font-display text-[19px] text-gold">{totalPrice.toLocaleString("ru")} TP</span>
            </div>
            <div className="flex items-baseline justify-between gap-2 border-b border-line/50 pb-2">
              <span className="flex items-center gap-1.5 text-[10.5px] text-muted/55">
                <Weight className="h-3.5 w-3.5 text-frost/55" />
                Вес
              </span>
              <span className="font-mono text-[14px] text-parchment/85">{totalWeight.toFixed(1)} кг</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[10.5px] text-muted/55">
                <Backpack className="h-3.5 w-3.5 text-moss/55" />
                Предметов
              </span>
              <span className="font-mono text-[14px] text-parchment/85">{chosen.length}</span>
            </div>
          </div>

          <div className="mt-3 border-t border-line/60 pt-3">
            <div className="text-[8.5px] uppercase tracking-[0.18em] text-muted/40">Требования</div>
            {requirements.length === 0 ? (
              <p className="mt-1 text-[10.5px] text-muted/45">Нет — комплект можно собрать сразу.</p>
            ) : (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {requirements.map((req) => (
                  <span key={req} className="border border-gold/25 bg-gold/[0.06] px-1.5 py-0.5 text-[9.5px] text-gold/80">
                    {req}
                  </span>
                ))}
              </div>
            )}
          </div>

          {chosen.length > 0 && (
            <div className="mt-3 border-t border-line/60 pt-2">
              <div className="mb-1 text-[8.5px] uppercase tracking-[0.18em] text-muted/40">Состав</div>
              <ul className="space-y-0.5 text-[10px] text-muted/55">
                {chosen.map(({ slot, item }) => (
                  <li key={slot} className="flex justify-between gap-2">
                    <span className="truncate">{item.ru}</span>
                    <span className="shrink-0 font-mono text-[9px] text-muted/30">{SLOT_LABELS[slot] ?? slot}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3 flex items-start gap-2 border-t border-line/60 pt-2 text-[9.5px] leading-relaxed text-muted/40">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-ember/50" />
            Вес указан по таблице предметов и может отличаться от фактического с учётом содержимого
            рюкзака и лошади.
          </div>
        </aside>
      </div>
    </div>
  );
}

function ShoppingTool() {
  const [list, setList] = useState<ShoppingItem[]>(loadShopping);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SHOPPING_KEY, JSON.stringify(list));
    } catch {
      /* список продолжает работать в памяти */
    }
  }, [list]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    if (!q) return [];
    return CATALOG.filter((entry) => entry.label.toLocaleLowerCase("ru").includes(q)).slice(0, 10);
  }, [query]);

  const add = (entry: (typeof CATALOG)[number]) => {
    setList((prev) => {
      const existing = prev.find((item) => item.key === entry.key);
      if (existing) return prev.map((item) => (item.key === entry.key ? { ...item, qty: Math.min(99, item.qty + 1) } : item));
      return [...prev, { ...entry, qty: 1 }];
    });
    setQuery("");
  };

  const changeQty = (key: string, delta: number) => {
    setList((prev) =>
      prev.flatMap((item) => {
        if (item.key !== key) return [item];
        const qty = item.qty + delta;
        return qty <= 0 ? [] : [{ ...item, qty: Math.min(99, qty) }];
      }),
    );
  };

  const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gold = Math.floor(total / 20000);
  const copper = Math.floor((total % 20000) / 200);
  const tp = total % 200;

  const copyList = async () => {
    const text = [
      "Список покупок — LonaRPG: Архив Ноэра",
      ...list.map((item) => `• ${item.label} ×${item.qty} — ${(item.price * item.qty).toLocaleString("ru")} TP`),
      `Итого: ${total.toLocaleString("ru")} TP`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <SectionSubhead title="Список покупок" aside={`${list.length} позиций`} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <SearchField value={query} onChange={setQuery} placeholder="Найти предмет или снаряжение для покупки…" />
          {results.length > 0 && (
            <div className="mt-1.5 border border-line/80 bg-panel/80">
              {results.map((entry) => (
                <button
                  key={entry.key}
                  onClick={() => add(entry)}
                  className="flex w-full items-center justify-between gap-3 border-b border-line/40 px-3 py-2 text-left transition last:border-b-0 hover:bg-ember/[0.05]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[11.5px] text-parchment/90">{entry.label}</span>
                    <span className="text-[9px] uppercase tracking-[0.1em] text-muted/40">
                      {entry.kind === "equipment" ? "снаряжение" : "предмет"}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 font-mono text-[10.5px] text-gold/80">
                    {entry.price.toLocaleString("ru")} TP
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 border border-line/80">
            {list.length === 0 ? (
              <div className="px-4 py-14 text-center">
                <ShoppingBasket className="mx-auto mb-2 h-6 w-6 text-muted/25" />
                <p className="text-[12px] text-muted/50">Список пуст. Найдите предмет выше и добавьте его.</p>
              </div>
            ) : (
              list.map((item) => (
                <div key={item.key} className="flex items-center gap-3 border-b border-line/35 px-3 py-2.5 last:border-b-0">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] text-parchment/85">{item.label}</span>
                    <span className="text-[9.5px] text-muted/40">{item.price.toLocaleString("ru")} TP за штуку</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => changeQty(item.key, -1)}
                      aria-label="Уменьшить количество"
                      className="flex h-6 w-6 items-center justify-center border border-line text-muted/60 hover:border-ember/40 hover:text-parchment"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center tabular-nums text-[11px] text-parchment">{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.key, 1)}
                      aria-label="Увеличить количество"
                      className="flex h-6 w-6 items-center justify-center border border-line text-muted/60 hover:border-ember/40 hover:text-parchment"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </span>
                  <span className="w-24 shrink-0 text-right font-mono text-[10.5px] text-gold/80">
                    {(item.price * item.qty).toLocaleString("ru")}
                  </span>
                  <button
                    onClick={() => setList((prev) => prev.filter((entry) => entry.key !== item.key))}
                    aria-label="Удалить"
                    className="shrink-0 p-1 text-muted/30 transition hover:text-[#d98a8a]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="border border-gold/20 bg-gradient-to-b from-gold/[0.05] to-transparent p-4">
          <div className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gold/75">
            <Coins className="h-3.5 w-3.5" /> Итого
          </div>
          <div className="font-display text-[2rem] leading-none text-parchment">
            {total.toLocaleString("ru")} <span className="text-[0.9rem] text-muted/50">TP</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-muted/60">
            {gold > 0 && <span className="border border-gold/25 px-1.5 py-0.5">{gold} GC</span>}
            {copper > 0 && <span className="border border-line px-1.5 py-0.5">{copper} CC</span>}
            {tp > 0 && <span className="border border-line px-1.5 py-0.5">{tp} TP</span>}
            {total === 0 && <span>—</span>}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted/40">
            1 Gold Coin = 20 000 TP, 1 Copper Coin = 200 TP. Цены взяты из таблиц предметов и снаряжения и могут отличаться в игре.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={copyList}
              disabled={list.length === 0}
              className="inline-flex items-center justify-center gap-1.5 border border-line px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-muted/75 transition hover:border-gold/40 hover:text-parchment disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? <Check className="h-3 w-3 text-moss" /> : <Copy className="h-3 w-3" />}
              {copied ? "скопировано" : "скопировать список"}
            </button>
            <button
              onClick={() => setList([])}
              disabled={list.length === 0}
              className="inline-flex items-center justify-center gap-1.5 border border-line px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-muted/60 transition hover:border-blood/40 hover:text-[#dda0a0] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-3 w-3" /> очистить
            </button>
          </div>
          <div className="mt-4 flex items-start gap-2 border-t border-line/60 pt-3 text-[10px] leading-relaxed text-muted/40">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-ember/50" />
            Список хранится в браузере. Перед Rebirth проверьте, что покупки всё ещё актуальны.
          </div>
          <div className="mt-3 flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-muted/30">
            <Sparkles className="h-3 w-3" /> без аккаунта
          </div>
        </aside>
      </div>
    </div>
  );
}
