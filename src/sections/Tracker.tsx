import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Compass,
  Download,
  Flag,
  MapPin,
  RotateCcw,
  ScrollText,
  Sparkles,
  Trophy,
  Upload,
} from "lucide-react";
import { quests } from "../data/quests";
import { achievements, achievementCategories } from "../data/achievements";
import { secrets } from "../data/secrets";
import { locations, regions } from "../data/locations";
import { endings } from "../data/endings";
import { href } from "../lib/router";
import type { SectionId } from "../lib/router";
import { Badge, Chips, SectionHeader, SearchField } from "../components/ui";
import { trackEvent } from "../lib/analytics";
import {
  TRACK_LABELS,
  TRACK_TOTALS,
  exportProgress,
  importProgress,
  markMany,
  progressSummary,
  resetAll,
  toggle,
  useProgress,
  type TrackKind,
} from "../lib/progress";

/* ------------------------------------------------------------------ */
/*  Плоские списки для трекера                                         */
/* ------------------------------------------------------------------ */

interface TrackItem {
  id: string;
  title: string;
  subtitle: string;
  group: string;
  section: SectionId;
  tag?: string;
  missable?: boolean;
  adult?: boolean;
}

const QUEST_KIND: Record<string, string> = {
  main: "Сюжет",
  side: "Побочный",
  repeatable: "Повторяемый",
  companion: "Компаньон",
  dlc: "DLC",
  secret: "Секрет",
};

const SECRET_KIND: Record<string, string> = {
  location: "Место",
  quest: "Квест",
  easter: "Пасхалка",
  adult: "18+",
  ending: "Концовка",
  cut: "Вырезанное",
};

const ENDING_KIND: Record<string, string> = {
  good: "Хорошая",
  bad: "Плохая",
  neutral: "Нейтральная",
  secret: "Секретная",
  doom: "Погибель",
};

const ACHIEVEMENT_KIND = Object.fromEntries(achievementCategories.map((c) => [c.id, c.ru]));

const ITEMS: Record<TrackKind, TrackItem[]> = {
  quests: quests.map((q) => ({
    id: q.id,
    title: q.title,
    subtitle: `${q.region} · уровень ${q.level}`,
    group: QUEST_KIND[q.kind] ?? "Прочее",
    section: "quests",
    tag: q.original,
    missable: Boolean(q.missable),
  })),
  achievements: achievements.map((a) => ({
    id: String(a.id),
    title: a.ru,
    subtitle: a.condition,
    group: ACHIEVEMENT_KIND[a.category] ?? "Прочее",
    section: "achievements",
    tag: a.name,
    missable: Boolean(a.missable),
  })),
  secrets: secrets.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.place,
    group: SECRET_KIND[s.category] ?? "Прочее",
    section: "secrets",
    tag: s.original,
    missable: Boolean(s.missable),
    adult: Boolean(s.adult) || s.category === "adult",
  })),
  locations: locations.map((l) => ({
    id: l.id,
    title: l.ru,
    subtitle: `${l.region}${l.coords ? ` · ${l.coords}` : ""}`,
    group: l.region,
    section: "locations",
    tag: l.name,
  })),
  endings: endings.map((e) => ({
    id: e.id,
    title: e.ru,
    subtitle: e.condition,
    group: ENDING_KIND[e.type] ?? "Прочее",
    section: "endings",
    tag: e.name,
  })),
};

const TABS: { id: TrackKind; icon: typeof ScrollText }[] = [
  { id: "quests", icon: ScrollText },
  { id: "achievements", icon: Trophy },
  { id: "secrets", icon: Sparkles },
  { id: "locations", icon: MapPin },
  { id: "endings", icon: Flag },
];

/* ------------------------------------------------------------------ */
/*  Компонент                                                          */
/* ------------------------------------------------------------------ */

export function TrackerView() {
  const progress = useProgress();
  const [kind, setKind] = useState<TrackKind>("quests");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [importMessage, setImportMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const summary = useMemo(() => progressSummary(progress), [progress]);
  const items = ITEMS[kind];

  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.group, (counts.get(item.group) ?? 0) + 1);
    const order = kind === "locations" ? regions : [...counts.keys()];
    return [
      { id: "all", label: "Все", count: items.length },
      ...order.filter((g) => counts.has(g)).map((g) => ({ id: g, label: g, count: counts.get(g) ?? 0 })),
    ];
  }, [items, kind]);

  useEffect(() => {
    setGroup("all");
  }, [kind]);

  useEffect(() => {
    if (!importMessage) return;
    const t = window.setTimeout(() => setImportMessage(null), 6000);
    return () => window.clearTimeout(t);
  }, [importMessage]);

  const checked = useMemo(() => new Set(progress.checked[kind]), [progress, kind]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return items.filter((item) => {
      if (group !== "all" && item.group !== group) return false;
      if (!q) return true;
      return [item.title, item.subtitle, item.group, item.tag ?? ""].join(" ").toLocaleLowerCase("ru").includes(q);
    });
  }, [items, group, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, TrackItem[]>();
    for (const item of filtered) {
      const list = map.get(item.group);
      if (list) list.push(item);
      else map.set(item.group, [item]);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "ru"));
  }, [filtered]);

  const doneCount = filtered.filter((item) => checked.has(item.id)).length;
  const percent = filtered.length ? Math.round((doneCount / filtered.length) * 100) : 0;

  const doExport = () => {
    trackEvent("tracker-export");
    const blob = new Blob([exportProgress()], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lonawiki-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const doImport = async (file: File) => {
    const text = await file.text();
    const result = importProgress(text);
    if (result.ok) {
      trackEvent("tracker-import", result.count);
      setImportMessage({ tone: "ok", text: `Импортировано отметок: ${result.count}. Прогресс обновлён.` });
    } else setImportMessage({ tone: "error", text: result.error ?? "Не удалось прочитать файл." });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Личный архив"
        title="Трекер прохождения"
        description="Отмечайте квесты, достижения, секреты, локации и концовки. Всё хранится локально в браузере: без аккаунта, без отправки данных. Экспортируйте JSON, чтобы перенести прогресс на другое устройство."
        meta={
          <>
            <Badge tone="gold">{summary.done} из {summary.total}</Badge>
            <Badge tone="moss">{summary.percent}% архива</Badge>
            <Badge tone="neutral">localStorage</Badge>
          </>
        }
      />

      {/* сводка */}
      <div className="mb-6 grid gap-3 lg:grid-cols-[repeat(5,minmax(0,1fr))]">
        {summary.counts.map((c) => {
          const Icon = TABS.find((t) => t.id === c.kind)?.icon ?? ScrollText;
          return (
            <button
              key={c.kind}
              onClick={() => setKind(c.kind)}
              className={`group border px-3.5 py-3 text-left transition ${
                kind === c.kind
                  ? "border-gold/45 bg-gradient-to-b from-ember/[0.13] to-ember/[0.02]"
                  : "border-line/80 bg-white/[0.012] hover:border-ember/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[8.5px] uppercase tracking-[0.18em] ${kind === c.kind ? "text-gold/85" : "text-muted/45"}`}>
                  {TRACK_LABELS[c.kind]}
                </span>
                <Icon className={`h-3.5 w-3.5 ${kind === c.kind ? "text-gold/75" : "text-muted/30"}`} />
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-display text-[1.65rem] leading-none text-parchment">{c.done}</span>
                <span className="text-[10px] text-muted/45">/ {c.total}</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden bg-line/50">
                <div
                  className="h-full bg-gradient-to-r from-ember/60 to-gold/80 transition-[width] duration-500"
                  style={{ width: `${c.percent}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* действия */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={doExport}
          className="inline-flex items-center gap-1.5 border border-line bg-white/[0.015] px-3 py-2 text-[10.5px] uppercase tracking-[0.12em] text-muted transition hover:border-gold/40 hover:text-parchment"
        >
          <Download className="h-3.5 w-3.5" /> Экспорт
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 border border-line bg-white/[0.015] px-3 py-2 text-[10.5px] uppercase tracking-[0.12em] text-muted transition hover:border-frost/40 hover:text-parchment"
        >
          <Upload className="h-3.5 w-3.5" /> Импорт
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void doImport(file);
          }}
        />
        {confirmReset ? (
          <span className="inline-flex items-center gap-2 border border-blood/40 bg-blood/[0.07] px-2 py-1.5">
            <span className="px-1 text-[10px] text-parchment/80">Сбросить всё?</span>
            <button
              onClick={() => {
                resetAll();
                setConfirmReset(false);
              }}
              className="border border-blood/50 bg-blood/15 px-2 py-1 text-[9.5px] uppercase tracking-[0.1em] text-[#e8a5a5]"
            >
              Да
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="border border-line px-2 py-1 text-[9.5px] uppercase tracking-[0.1em] text-muted"
            >
              Нет
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 border border-line bg-white/[0.015] px-3 py-2 text-[10.5px] uppercase tracking-[0.12em] text-muted transition hover:border-blood/45 hover:text-[#e0a0a0]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Сброс
          </button>
        )}
        <span className="text-[10px] text-muted/35">
          {progress.updated ? `обновлено ${new Date(progress.updated).toLocaleString("ru")}` : "пока пусто"}
        </span>
      </div>

      {importMessage && (
        <div
          className={`mb-4 border-l-2 px-3 py-2 text-[11.5px] ${
            importMessage.tone === "ok"
              ? "border-moss/60 bg-moss/[0.07] text-[#b6d2aa]"
              : "border-blood/60 bg-blood/[0.08] text-[#e3a7a7]"
          }`}
        >
          {importMessage.text}
        </div>
      )}

      {/* вкладки */}
      <div className="flex overflow-x-auto border-b border-line/80">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const total = TRACK_TOTALS[tab.id];
          const done = progress.checked[tab.id].length;
          return (
            <button
              key={tab.id}
              onClick={() => setKind(tab.id)}
              className={`relative flex shrink-0 items-center gap-2 px-3.5 py-2.5 text-[11.5px] transition ${
                kind === tab.id ? "text-parchment" : "text-muted/55 hover:text-parchment/85"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${kind === tab.id ? "text-gold/80" : "text-muted/35"}`} />
              {TRACK_LABELS[tab.id]}
              <span className="text-[9.5px] tabular-nums text-muted/40">
                {done}/{total}
              </span>
              {kind === tab.id && <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />}
            </button>
          );
        })}
      </div>

      {/* фильтры */}
      <div className="mt-3 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <SearchField value={query} onChange={setQuery} placeholder={`Поиск: ${TRACK_LABELS[kind].toLowerCase()}…`} className="w-full sm:w-80" />
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-muted/40">
            <span className="h-px w-5 bg-line" />
            {doneCount} из {filtered.length} · {percent}%
          </div>
        </div>
        <Chips options={groups} value={group} onChange={setGroup} label="Группа" />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => markMany(kind, filtered.map((i) => i.id), true)}
            className="inline-flex items-center gap-1.5 border border-moss/30 bg-moss/[0.06] px-2.5 py-1.5 text-[10px] uppercase tracking-[0.1em] text-moss/90 transition hover:border-moss/55"
          >
            <Check className="h-3 w-3" /> отметить видимые
          </button>
          <button
            onClick={() => markMany(kind, filtered.map((i) => i.id), false)}
            className="inline-flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-[10px] uppercase tracking-[0.1em] text-muted/70 transition hover:border-ember/40 hover:text-parchment"
          >
            снять видимые
          </button>
        </div>
      </div>

      {/* список */}
      <div className="mt-4 border border-line/80">
        {filtered.length === 0 ? (
          <div className="px-4 py-14 text-center text-sm text-muted/60">Ничего не найдено. Измените фильтр или запрос.</div>
        ) : (
          grouped.map(([label, list]) => (
            <section key={label}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-y border-line/60 bg-abyss/95 px-3.5 py-1.5 backdrop-blur-sm first:border-t-0">
                <span className="text-[8.5px] uppercase tracking-[0.22em] text-ember/75">{label}</span>
                <span className="text-[9px] tabular-nums text-muted/35">
                  {list.filter((i) => checked.has(i.id)).length}/{list.length}
                </span>
              </div>
              {list.map((item) => {
                const done = checked.has(item.id);
                return (
                  <div
                    key={item.id}
                    role="checkbox"
                    aria-checked={done}
                    tabIndex={0}
                    onClick={() => toggle(kind, item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggle(kind, item.id);
                      }
                    }}
                    className={`group flex cursor-pointer items-start gap-3 border-b border-line/35 px-3.5 py-2.5 transition last:border-b-0 ${
                      done ? "bg-moss/[0.035]" : "hover:bg-white/[0.025]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition ${
                        done ? "border-moss/70 bg-moss/20 text-moss" : "border-line text-transparent group-hover:border-ember/45"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className={`text-[12.5px] leading-snug ${done ? "text-parchment/55 line-through decoration-moss/40" : "text-parchment/90"}`}>
                          {item.title}
                        </span>
                        {item.missable && (
                          <span className="border border-blood/35 bg-blood/[0.06] px-1 py-px text-[8px] uppercase tracking-[0.1em] text-[#d99a9a]">
                            пропускаемое
                          </span>
                        )}
                        {item.adult && (
                          <span className="border border-[#7f6aa8]/40 bg-[#7f6aa8]/[0.08] px-1 py-px text-[8px] uppercase tracking-[0.1em] text-[#b7a6d8]">
                            18+
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted/50">{item.subtitle}</span>
                    </span>
                    <a
                      href={href(item.section, item.id)}
                      onClick={(event) => event.stopPropagation()}
                      title="Открыть в разделе"
                      className="mt-0.5 shrink-0 p-1 text-muted/25 transition hover:text-gold"
                      aria-label={`Открыть «${item.title}»`}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                );
              })}
            </section>
          ))
        )}
      </div>

      <p className="mt-4 text-[10.5px] leading-relaxed text-muted/40">
        Трекер не синхронизируется с игрой автоматически: это чек-лист. Отметки живут в localStorage текущего браузера; очистка данных сайта
        удалит их. Для переноса используйте экспорт и импорт JSON.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={href("map")}
          className="inline-flex items-center gap-2 border border-gold/30 bg-gold/[0.06] px-3.5 py-2 text-[10.5px] uppercase tracking-[0.14em] text-gold/90 transition hover:border-gold/55"
        >
          <Compass className="h-3.5 w-3.5" /> Открыть карту
        </a>
        <a
          href={href("quests")}
          className="inline-flex items-center gap-2 border border-line px-3.5 py-2 text-[10.5px] uppercase tracking-[0.14em] text-muted/70 transition hover:border-ember/40 hover:text-parchment"
        >
          <ScrollText className="h-3.5 w-3.5" /> К прохождениям
        </a>
      </div>
    </div>
  );
}
