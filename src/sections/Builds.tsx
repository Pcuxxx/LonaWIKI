import { useMemo, useState } from "react";
import { ArrowRight, Check, Sparkles, Swords, X } from "lucide-react";
import { builds } from "../data/builds";
import { Badge, EmptyState, SectionHeader } from "../components/ui";
import { href } from "../lib/router";

const statLabels: Record<string, string> = {
  COM: "COM",
  CON: "CON",
  SUR: "SUR",
  SCU: "SCU",
  WIS: "WIS",
};

export function BuildsView({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(builds[0]?.id ?? "");

  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    if (!q) return builds;
    return builds.filter((b) =>
      [b.ru, b.name, b.role, b.difficulty, ...b.traits, ...b.gear, ...b.skills, ...b.pros, ...b.cons]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(q),
    );
  }, [query]);

  const active = builds.find((b) => b.id === (focusId ?? selected)) ?? list[0] ?? builds[0];

  return (
    <div>
      <SectionHeader
        eyebrow="Персонаж"
        title="Билды"
        description="10 рабочих сборок с распределением статов, чертами, снаряжением и ротацией. Цифры — ориентир для 20–30 уровня, а не догма. Каждый билд имеет честные минусы."
        meta={
          <>
            <Badge tone="gold">{builds.length} сборок</Badge>
            <Badge tone="neutral">Hard → Doom</Badge>
            <Badge tone="violet">С ротациями</Badge>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Оружие, роль, черта…"
          className="min-w-[220px] flex-1 border border-line bg-void/60 px-3 py-2 text-sm text-parchment placeholder:text-muted/40 focus:border-ember/50 focus:outline-none"
        />
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted/45">
          {list.length} из {builds.length}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="max-h-[75vh] space-y-1 overflow-y-auto border border-line bg-void/30 p-1">
          {list.length === 0 ? (
            <EmptyState text="Сборки не найдены." />
          ) : (
            list.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelected(b.id);
                  window.history.replaceState(null, "", href("builds", b.id));
                }}
                className={`w-full border-l-2 px-3 py-2.5 text-left transition ${
                  active?.id === b.id
                    ? "border-ember bg-ember/[0.08]"
                    : "border-transparent hover:bg-white/[0.025]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-medium text-parchment">{b.ru}</span>
                  <ChevronMark />
                </div>
                <div className="truncate text-[10px] uppercase tracking-wider text-muted/50">
                  {b.name} · {b.difficulty}
                </div>
              </button>
            ))
          )}
        </div>

        {active && (
          <article id={`build-${active.id}`} className="card min-w-0 scroll-mt-24 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone="gold">{active.difficulty}</Badge>
                  <Badge tone="neutral">Личность: {active.personality}</Badge>
                </div>
                <h2 className="font-display text-2xl leading-tight text-parchment">{active.ru}</h2>
                <p className="text-xs italic text-muted/50">{active.name}</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted/45">Оценка</div>
                <div className="max-w-[180px] font-display text-sm text-gold/90">{active.rating}</div>
              </div>
            </div>

            <p className="mt-3 border-l-2 border-ember/30 pl-3 text-sm text-muted">{active.role}</p>

            <div className="mt-5">
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
                Приоритет статов
              </h3>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                {Object.entries(active.stats).map(([key, value]) => (
                  <div key={key} className="border border-line bg-white/[0.02] p-2">
                    <div className="text-[9px] uppercase tracking-wider text-muted/45">
                      {statLabels[key] ?? key}
                    </div>
                    <div className="font-display text-lg text-parchment">{value}</div>
                    <div className="mt-1 h-0.5 w-full bg-line">
                      <div
                        className="h-0.5 bg-ember/70"
                        style={{ width: `${Math.min(100, (value / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
                  <Sparkles className="h-3 w-3 text-gold/60" /> Черты
                </h3>
                <ul className="space-y-1">
                  {active.traits.map((t) => (
                    <li key={t} className="flex gap-2 text-[13px] text-parchment/85">
                      <span className="mt-[7px] h-1 w-1 shrink-0 bg-gold/70" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
                  <Swords className="h-3 w-3 text-ember/60" /> Снаряжение
                </h3>
                <ul className="space-y-1">
                  {active.gear.map((g) => (
                    <li key={g} className="flex gap-2 text-[13px] text-parchment/85">
                      <span className="mt-[7px] h-1 w-1 shrink-0 bg-ember/70" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
                Навыки
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {active.skills.map((s) => (
                  <span key={s} className="border border-line bg-white/[0.02] px-2 py-1 text-[11px] text-parchment/80">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/55">
                Ротация и тактика
              </h3>
              <ol className="space-y-2">
                {active.rotation.map((r, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-ember/20 bg-ember/[0.06] font-display text-[10px] text-ember">
                      {i + 1}
                    </span>
                    <span className="text-[13px] leading-relaxed text-parchment/85">{r}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="border border-moss/20 bg-moss/[0.04] p-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-moss">
                  <Check className="h-3 w-3" /> Плюсы
                </div>
                <ul className="space-y-1">
                  {active.pros.map((p) => (
                    <li key={p} className="text-[12px] leading-relaxed text-parchment/80">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-blood/25 bg-blood/[0.05] p-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d98a8a]">
                  <X className="h-3 w-3" /> Минусы
                </div>
                <ul className="space-y-1">
                  {active.cons.map((c) => (
                    <li key={c} className="text-[12px] leading-relaxed text-parchment/80">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-3 text-[10px] text-muted/45">
              <span>Сборка: {active.name}</span>
              <a href={href("traits")} className="inline-flex items-center gap-1 text-ember/60 hover:text-ember">
                Все черты <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

function ChevronMark() {
  return <ArrowRight className="h-3 w-3 shrink-0 text-muted/25" />;
}
