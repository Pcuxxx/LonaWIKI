import { useMemo, useState } from "react";
import { Compass, MapPin, Search, Skull, Sparkles } from "lucide-react";
import { locations, regions } from "../data/locations";
import type { Location } from "../data/types";
import { Badge, Chips, DangerDots, EmptyState, SectionHeader } from "../components/ui";

export function LocationsView({ focusId }: { focusId?: string }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");

  const list = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return locations.filter((l) => {
      if (region !== "all" && l.region !== region) return false;
      if (!q) return true;
      return [l.ru, l.name, l.region, l.coords ?? "", l.summary, l.loot, l.tips, ...l.points, ...l.quests]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(q);
    });
  }, [query, region]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: locations.length };
    for (const l of locations) map[l.region] = (map[l.region] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div>
      <SectionHeader
        eyebrow="Прохождение"
        title="Локации острова"
        description="Карта Ноэра и окрестностей: координаты, опасность, точки интереса, связанные квесты и лут. Координаты — по мировой карте; после захвата локации часть меток меняется."
        meta={
          <>
            <Badge tone="gold">{locations.length} локаций</Badge>
            <Badge tone="neutral">{regions.length} регионов</Badge>
            <Badge tone="blood">Опасность 1–5</Badge>
          </>
        }
      />

      <div className="mb-4 border border-line bg-white/[0.015] p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название, координаты, лут…"
            className="w-full border border-line bg-void/60 py-2 pl-9 pr-3 text-sm text-parchment placeholder:text-muted/40 focus:border-ember/50 focus:outline-none"
          />
        </div>
        <div className="mt-2">
          <Chips
            options={[
              { id: "all", label: "Все", count: counts.all },
              ...regions.map((r) => ({ id: r, label: r, count: counts[r] ?? 0 })),
            ]}
            value={region}
            onChange={setRegion}
          />
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState text="Локации не найдены." />
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {list.map((l) => (
            <LocationCard key={l.id} loc={l} focused={focusId === l.id} />
          ))}
        </div>
      )}

      <section className="mt-10">
        <h2 className="mb-3 border-b border-line/70 pb-2 font-display text-2xl text-parchment">
          Порядок исследования
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1–5 ур.", "Ноэр, канализация, кладбище, фермы"],
            ["6–12 ур.", "Пиковый лес, шахта, побережье, ферма соли"],
            ["13–20 ур.", "Восточные аванпосты, болото, храмы"],
            ["20+ ур.", "Doom Fortress, гробницы, глубина аберраций"],
          ].map(([lvl, place]) => (
            <div key={lvl} className="card p-3">
              <div className="font-display text-base text-ember">{lvl}</div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{place}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LocationCard({ loc, focused }: { loc: Location; focused: boolean }) {
  return (
    <article
      id={`loc-${loc.id}`}
      className={`card scroll-mt-24 p-4 ${focused ? "border-ember/60 ring-1 ring-ember/20" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <Badge tone="neutral">{loc.region}</Badge>
            <DangerDots value={loc.danger} />
          </div>
          <h2 className="font-display text-lg leading-tight text-parchment">{loc.ru}</h2>
          <p className="text-[10px] italic text-muted/45">{loc.name}</p>
        </div>
        <div className="shrink-0 text-right">
          <Compass className="ml-auto h-4 w-4 text-ember/40" />
          {loc.coords && <div className="mt-1 font-mono text-[10px] text-frost/70">{loc.coords}</div>}
        </div>
      </div>

      <p className="mt-2 text-[13px] leading-relaxed text-parchment/85">{loc.summary}</p>

      <div className="mt-3">
        <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted/45">
          Точки интереса
        </div>
        <div className="flex flex-wrap gap-1">
          {loc.points.map((p) => (
            <span key={p} className="border border-line/70 px-1.5 py-0.5 text-[10px] text-muted/75">
              {p}
            </span>
          ))}
        </div>
      </div>

      {loc.quests.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px]">
          <Sparkles className="h-3 w-3 text-violet-300/60" />
          {loc.quests.map((q) => (
            <span key={q} className="text-violet-200/65">
              {q}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 grid gap-1.5 border-t border-line/60 pt-2 text-[11px]">
        <div className="flex gap-1.5">
          <Skull className="mt-0.5 h-3 w-3 shrink-0 text-gold/50" />
          <span className="text-muted/75">{loc.loot}</span>
        </div>
        <div className="flex gap-1.5">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-ember/50" />
          <span className="text-muted/65">{loc.tips}</span>
        </div>
      </div>
    </article>
  );
}
