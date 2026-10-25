import { useMemo, useState } from "react";
import { Search, Skull } from "lucide-react";
import { enemies } from "../data/bestiary";
import type { Enemy } from "../data/types";
import { Badge, Chips, DangerDots, EmptyState, SectionHeader } from "../components/ui";

const factionLabels: Record<Enemy["faction"], string> = {
  animal: "Животные",
  orkind: "Оркинды",
  undead: "Нежить",
  abomination: "Аберрации",
  fishkind: "Рыболюды",
  human: "Люди",
  boss: "Боссы",
};

const factionTones: Record<Enemy["faction"], "moss" | "ember" | "violet" | "blood" | "frost" | "neutral" | "gold"> = {
  animal: "moss",
  orkind: "ember",
  undead: "violet",
  abomination: "blood",
  fishkind: "frost",
  human: "neutral",
  boss: "gold",
};

export function BestiaryView({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState("");
  const [faction, setFaction] = useState<"all" | Enemy["faction"]>("all");
  const [minDanger, setMinDanger] = useState(0);

  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return enemies.filter((e) => {
      if (faction !== "all" && e.faction !== faction) return false;
      if (e.danger < minDanger) return false;
      if (!q) return true;
      return [e.ru, e.name, e.locations, e.attacks, e.weakness, e.drops, e.note ?? ""]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(q);
    });
  }, [query, faction, minDanger]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: enemies.length };
    for (const e of enemies) map[e.faction] = (map[e.faction] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Мир"
        title="Бестиарий"
        description="Враги острова: от крыс до Тёмного Берсерка. HP и атаки ориентировочные — на Hell и Doom они выше, а поведение меняется. Слабости важнее цифр."
        meta={
          <>
            <Badge tone="gold">{enemies.length} записей</Badge>
            <Badge tone="blood">DoS: не подходите без STA</Badge>
          </>
        }
      />

      <div className="mb-4 border border-line bg-white/[0.015] p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название, локация, слабость, дроп…"
            className="w-full border border-line bg-void/60 py-2 pl-9 pr-3 text-sm text-parchment placeholder:text-muted/40 focus:border-ember/50 focus:outline-none"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chips
            options={[
              { id: "all", label: "Все", count: counts.all },
              ...(Object.keys(factionLabels) as Enemy["faction"][]).map((f) => ({
                id: f,
                label: factionLabels[f],
                count: counts[f] ?? 0,
              })),
            ]}
            value={faction}
            onChange={setFaction}
          />
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted/45">Мин. опасность</span>
            {[0, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMinDanger(n)}
                className={`border px-2 py-1 text-[10px] transition ${
                  minDanger === n ? "border-ember/50 text-ember" : "border-line text-muted hover:text-parchment"
                }`}
              >
                {n === 0 ? "Все" : n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState text="Враги не найдены." />
      ) : (
        <div className="grid gap-2 lg:grid-cols-2">
          {list.map((e) => (
            <article
              key={e.id}
              id={`enemy-${e.id}`}
              className={`card scroll-mt-24 p-4 ${focusId === e.id ? "border-ember/60 ring-1 ring-ember/20" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={factionTones[e.faction]}>{factionLabels[e.faction]}</Badge>
                    <DangerDots value={e.danger} />
                  </div>
                  <h2 className="font-display text-lg leading-tight text-parchment">{e.ru}</h2>
                  <p className="text-[10px] italic text-muted/45">{e.name}</p>
                </div>
                <Skull className="h-5 w-5 shrink-0 text-blood/40" />
              </div>

              <div className="mt-2 inline-flex flex-wrap items-center gap-1 border border-line/70 bg-void/40 px-2 py-1 font-mono text-[10px] text-frost/80">
                {e.hp}
              </div>

              <dl className="mt-3 grid gap-x-3 gap-y-1.5 text-[12px]">
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-muted/50">Локации</dt>
                  <dd className="text-parchment/80">{e.locations}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-muted/50">Атаки</dt>
                  <dd className="text-parchment/80">{e.attacks}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-muted/50">Слабость</dt>
                  <dd className="text-moss/90">{e.weakness}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-muted/50">Дроп</dt>
                  <dd className="text-gold/80">{e.drops}</dd>
                </div>
              </dl>

              {e.note && (
                <p className="mt-2 border-t border-line/60 pt-2 text-[11px] leading-relaxed text-muted/70">
                  {e.note}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <section className="mt-10 grid gap-3 md:grid-cols-3">
        <div className="card p-4">
          <h3 className="mb-1 font-display text-base text-parchment">Правило трёх ударов</h3>
          <p className="text-[13px] leading-relaxed text-muted">
            Если враг не умирает за 2–3 размена, проверьте слабость и оружие. Против скелетов — дробящее,
            против аберраций — огонь, против брони — магия или мушкет.
          </p>
        </div>
        <div className="card p-4">
          <h3 className="mb-1 font-display text-base text-parchment">Не геройствуйте</h3>
          <p className="text-[13px] leading-relaxed text-muted">
            Опыт за убийства не дают. Если бой стоит больше зелий, чем даёт лута, — обойдите. Стелс и
            камень дешевле реванша.
          </p>
        </div>
        <div className="card p-4">
          <h3 className="mb-1 font-display text-base text-parchment">Боссы меняют правила</h3>
          <p className="text-[13px] leading-relaxed text-muted">
            У боссов есть фазы, рывки и AoE. Сохраняйтесь перед входом, ставьте ловушки заранее и
            оставляйте путь отхода.
          </p>
        </div>
      </section>
    </div>
  );
}
