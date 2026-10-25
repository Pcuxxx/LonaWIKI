import { useMemo, useState } from "react";
import { AlertTriangle, Compass, Eye, Image, Search, Sparkles, Trash2 } from "lucide-react";
import { cutContent, easterEggs, paintings, secrets } from "../data/secrets";
import type { CutContent, SecretCategory } from "../data/secrets";
import { Badge, EmptyState, SectionHeader, Spoiler } from "../components/ui";

type Tab = "secrets" | "paintings" | "eggs" | "cut";

const statusLabels: Record<CutContent["status"], string> = {
  removed: "Удалено",
  unused: "Не используется",
  future: "Будущее",
  debug: "Отладка",
};

const categoryLabels: Record<SecretCategory, string> = {
  location: "Локация",
  quest: "Квест",
  easter: "Пасхалка",
  adult: "18+",
  ending: "Концовка",
  cut: "Вырезанное",
};

const categoryTones: Record<SecretCategory, "violet" | "moss" | "gold" | "blood" | "frost" | "neutral"> = {
  location: "frost",
  quest: "moss",
  easter: "gold",
  adult: "blood",
  ending: "violet",
  cut: "neutral",
};

export function SecretsView({ focusId }: { focusId?: string }) {
  const [tab, setTab] = useState<Tab>("secrets");
  const [query, setQuery] = useState("");

  const q = query.trim().toLocaleLowerCase("ru");

  const filteredSecrets = useMemo(
    () =>
      secrets.filter((s) =>
        q
          ? [s.title, s.original ?? "", s.place, s.summary, ...s.steps, s.reward]
              .join(" ")
              .toLocaleLowerCase("ru")
              .includes(q)
          : true,
      ),
    [q],
  );

  const filteredPaintings = useMemo(
    () =>
      paintings.filter((p) =>
        q ? [p.title, p.place, p.note, p.achievement].join(" ").toLocaleLowerCase("ru").includes(q) : true,
      ),
    [q],
  );

  const filteredEggs = useMemo(
    () =>
      easterEggs.filter((e) =>
        q ? [e.name, e.reference, e.place, e.note].join(" ").toLocaleLowerCase("ru").includes(q) : true,
      ),
    [q],
  );

  const filteredCut = useMemo(
    () =>
      cutContent.filter((c) =>
        q ? [c.name, c.ru, c.description, c.status, c.type].join(" ").toLocaleLowerCase("ru").includes(q) : true,
      ),
    [q],
  );

  const tabs: { id: Tab; label: string; count: number; icon: typeof Compass }[] = [
    { id: "secrets", label: "Секреты", count: secrets.length, icon: Compass },
    { id: "paintings", label: "Картины", count: paintings.length, icon: Image },
    { id: "eggs", label: "Пасхалки", count: easterEggs.length, icon: Sparkles },
    { id: "cut", label: "Вырезанное", count: cutContent.length, icon: Trash2 },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Прохождение"
        title="Секреты и вырезанное"
        description="Скрытые комнаты, картины, пасхалки и контент, который не попал в игру. Вырезанные предметы не выдаются за рабочие: у каждого указан статус."
        meta={
          <>
            <Badge tone="violet">{secrets.length} секретов</Badge>
            <Badge tone="gold">{paintings.length} картин</Badge>
            <Badge tone="neutral">{easterEggs.length} пасхалок</Badge>
            <Badge tone="blood">{cutContent.length} вырезано</Badge>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1 border border-line bg-white/[0.015] p-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-wider transition ${
              tab === t.id
                ? "bg-ember/15 text-ember"
                : "text-muted hover:bg-white/[0.03] hover:text-parchment"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            <span className="opacity-50">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Название, место, отсылка…"
          className="w-full border border-line bg-void/60 py-2 pl-9 pr-3 text-sm text-parchment placeholder:text-muted/40 focus:border-ember/50 focus:outline-none"
        />
      </div>

      {tab === "secrets" &&
        (filteredSecrets.length === 0 ? (
          <EmptyState text="Секреты не найдены." />
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {filteredSecrets.map((s) => (
              <article
                key={s.id}
                id={`secret-${s.id}`}
                className={`card scroll-mt-24 p-4 ${focusId === s.id ? "border-ember/60 ring-1 ring-ember/20" : ""}`}
              >
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  <Badge tone={categoryTones[s.category]}>{categoryLabels[s.category]}</Badge>
                  {s.missable && <Badge tone="blood">Пропускаемое</Badge>}
                  {s.adult && <Badge tone="blood">18+</Badge>}
                </div>
                <h2 className="font-display text-lg leading-tight text-parchment">{s.title}</h2>
                {s.original && <p className="text-[10px] italic text-muted/45">{s.original}</p>}
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted/65">
                  <Compass className="h-3 w-3 text-ember/50" /> {s.place}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-parchment/85">{s.summary}</p>
                <Spoiler className="mt-3" label="Как найти">
                  <ol className="space-y-1.5">
                    {s.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-parchment/80">
                        <span className="text-ember/60">{i + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 border-t border-line/60 pt-2 text-[11px] text-gold/75">
                    Награда: {s.reward}
                  </p>
                </Spoiler>
              </article>
            ))}
          </div>
        ))}

      {tab === "paintings" &&
        (filteredPaintings.length === 0 ? (
          <EmptyState text="Картины не найдены." />
        ) : (
          <div className="overflow-x-auto border border-line">
            <table className="wiki-table min-w-[640px]">
              <thead>
                <tr>
                  <th>Картина</th>
                  <th>Достижение</th>
                  <th>Где</th>
                  <th>Координаты</th>
                  <th>Заметка</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaintings.map((p) => (
                  <tr key={p.id} id={`painting-${p.id}`} className="scroll-mt-24">
                    <td className="font-medium text-parchment">{p.title}</td>
                    <td className="text-[11px] text-gold/80">{p.achievement}</td>
                    <td className="text-[12px]">{p.place}</td>
                    <td className="font-mono text-[11px] text-frost/70">{p.coords ?? "—"}</td>
                    <td className="text-[11px] text-muted">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {tab === "eggs" &&
        (filteredEggs.length === 0 ? (
          <EmptyState text="Пасхалки не найдены." />
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEggs.map((e) => (
              <article key={e.id} id={`egg-${e.id}`} className="card scroll-mt-24 p-4">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-frost/70">
                  <Eye className="h-3 w-3" /> {e.reference}
                </div>
                <h3 className="font-display text-base text-parchment">{e.name}</h3>
                <p className="mt-1 text-[11px] text-muted/60">{e.place}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{e.note}</p>
              </article>
            ))}
          </div>
        ))}

      {tab === "cut" &&
        (filteredCut.length === 0 ? (
          <EmptyState text="Записи не найдены." />
        ) : (
          <>
            <div className="mb-3 border border-blood/25 bg-blood/[0.05] p-3">
              <div className="flex items-start gap-2 text-[12px] leading-relaxed text-parchment/80">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#d98a8a]" />
                <p>
                  Эти предметы и механики нельзя получить в обычной игре. Часть осталась в файлах как
                  отладочные заглушки, часть — будущий контент. Не ищите их в луте.
                </p>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {filteredCut.map((c) => (
                <article key={c.id} id={`cut-${c.id}`} className="card scroll-mt-24 border-dashed p-4">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={c.status === "debug" ? "neutral" : "blood"}>{statusLabels[c.status]}</Badge>
                    <span className="text-[10px] uppercase tracking-wider text-muted/45">{c.type}</span>
                  </div>
                  <h3 className="font-display text-base text-parchment">{c.ru}</h3>
                  <p className="text-[10px] italic text-muted/45">{c.name}</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-parchment/75">{c.description}</p>
                </article>
              ))}
            </div>
          </>
        ))}
    </div>
  );
}
