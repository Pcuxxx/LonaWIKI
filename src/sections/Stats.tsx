import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  Download,
  Eye,
  ExternalLink,
  FileJson,
  Lock,
  MousePointerClick,
  Power,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Badge, EmptyState, SectionHeader, SectionSubhead, StatPill } from "../components/ui";
import { SITE } from "../lib/meta";
import { PAGES, SITE_BASE } from "../lib/pages";
import {
  clearAnalytics,
  exportAnalytics,
  setAnalyticsEnabled,
  trackEvent,
  useAnalytics,
  type AnalyticsEvent,
} from "../lib/analytics";

type Range = "7" | "14" | "30";

const RANGE_OPTIONS: { id: Range; label: string }[] = [
  { id: "7", label: "7 дней" },
  { id: "14", label: "14 дней" },
  { id: "30", label: "30 дней" },
];

const EVENT_LABELS: Record<string, string> = {
  "search-open": "Поиск: открытие",
  "search-empty": "Поиск: без результатов",
  "search-select": "Поиск: переход к разделу",
  "map-open": "Карта: открытие",
  "map-location": "Карта: выбрана локация",
  "map-region": "Карта: фильтр региона",
  "map-danger": "Карта: фильтр опасности",
  "map-scope": "Карта: фильтр статуса",
  "tools-tab": "Инструменты: вкладка",
  "tracker-export": "Трекер: экспорт",
  "tracker-import": "Трекер: импорт",
  "community-edit": "Сообщество: форма правки",
  "community-copy": "Сообщество: копирование ссылки",
  "community-discussions": "Сообщество: обсуждения",
  "community-issues": "Сообщество: задачи",
  "community-contributing": "Сообщество: правила",
  "community-export": "Сообщество: JSON-выгрузка",
  "comments-refresh": "Комментарии: обновление",
  "comments-open": "Комментарии: переход в GitHub",
  "stats-export": "Статистика: экспорт",
  "stats-clear": "Статистика: очистка",
  "stats-toggle": "Статистика: переключатель",
};

const DETAIL_LABELS: Record<string, string> = {
  quests: "Квесты",
  mechanics: "Механики",
  builds: "Билды",
  traits: "Черты",
  equipment: "Снаряжение",
  items: "Предметы",
  locations: "Локации",
  characters: "Персонажи",
  bestiary: "Бестиарий",
  endings: "Концовки",
  achievements: "Достижения",
  secrets: "Секреты",
  sources: "Источники",
  map: "Карта",
  tracker: "Прогресс",
  tools: "Инструменты",
  mods: "Моды",
  community: "Сообщество",
  stats: "Статистика",
  beginners: "Первые шаги",
  home: "Главная",
  craft: "Крафт",
  compare: "Сравнение",
  shopping: "Покупки",
  loadout: "Комплект",
  "true": "включена",
  "false": "выключена",
};

function dateKey(value: number | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function dayStartOffset(daysAgo: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function pathLabel(path: string): string {
  const base = SITE_BASE.replace(/\/$/, "");
  let value = path;
  if (base && value.startsWith(base)) value = value.slice(base.length);
  const [rawPath, hash] = value.split("#");
  const segment = rawPath.replace(/^\/+|\/+$/g, "");
  const page = PAGES.find((entry) => entry.path === segment);
  const label = page?.label ?? (segment || "Главная");
  return hash ? `${label} · #${decodeURIComponent(hash)}` : label;
}

function eventLabel(event: AnalyticsEvent): string {
  const base = EVENT_LABELS[event.name] ?? event.name;
  if (!event.detail) return base;
  const detail = DETAIL_LABELS[event.detail] ?? event.detail;
  return `${base}: ${detail}`;
}

function eventIcon(event: AnalyticsEvent) {
  if (event.kind === "page") return Eye;
  if (event.name.startsWith("search")) return Activity;
  return MousePointerClick;
}

interface DayBucket {
  key: string;
  label: string;
  pages: number;
  events: number;
}

function buildDaily(events: AnalyticsEvent[], range: Range): DayBucket[] {
  const count = Number(range);
  const buckets: DayBucket[] = [];
  const index = new Map<string, DayBucket>();

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const day = dayStartOffset(offset);
    const key = dateKey(day);
    const bucket: DayBucket = {
      key,
      label: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(day),
      pages: 0,
      events: 0,
    };
    buckets.push(bucket);
    index.set(key, bucket);
  }

  const first = dayStartOffset(count - 1).getTime();
  for (const event of events) {
    if (event.t < first) continue;
    const bucket = index.get(dateKey(event.t));
    if (!bucket) continue;
    if (event.kind === "page") bucket.pages += 1;
    else bucket.events += 1;
  }

  return buckets;
}

export function StatsView() {
  const store = useAnalytics();
  const [range, setRange] = useState<Range>("14");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const count = Number(range);
    const first = dayStartOffset(count - 1).getTime();
    const events = store.events.filter((event) => event.t >= first);

    const daily = buildDaily(store.events, range);

    const pageCounts = new Map<string, number>();
    const eventCounts = new Map<string, { count: number; details: Map<string, number> }>();
    const activeDays = new Set<string>();
    let pageViews = 0;
    let actions = 0;
    let last: AnalyticsEvent | null = null;

    for (const event of events) {
      activeDays.add(dateKey(event.t));
      last = event;
      if (event.kind === "page") {
        pageViews += 1;
        pageCounts.set(event.name, (pageCounts.get(event.name) ?? 0) + 1);
      } else {
        actions += 1;
        const row = eventCounts.get(event.name) ?? { count: 0, details: new Map<string, number>() };
        row.count += 1;
        if (event.detail) row.details.set(event.detail, (row.details.get(event.detail) ?? 0) + 1);
        eventCounts.set(event.name, row);
      }
    }

    const topPages = [...pageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, value]) => ({ path, value, label: pathLabel(path) }));

    const topEvents = [...eventCounts.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([name, row]) => ({
        name,
        value: row.count,
        label: EVENT_LABELS[name] ?? name,
        details: [...row.details.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
      }));

    const uniquePages = new Set(events.filter((event) => event.kind === "page").map((event) => event.name))
      .size;

    const recent = [...store.events].reverse().slice(0, 12);

    const rangeDays = new Set(daily.map((bucket) => bucket.key)).size;
    const avg = rangeDays > 0 ? pageViews / rangeDays : 0;

    return {
      daily,
      pageViews,
      actions,
      activeDays: activeDays.size,
      uniquePages,
      topPages,
      topEvents,
      recent,
      last,
      avg,
      maxDay: Math.max(1, ...daily.map((bucket) => bucket.pages + bucket.events)),
    };
  }, [store.events, range]);

  const goatCode = import.meta.env.VITE_GOATCOUNTER;
  const lastSeen = stats.last
    ? new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(stats.last.t)
    : null;

  const download = () => {
    trackEvent("stats-export");
    const blob = new Blob([exportAnalytics()], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lonawiki-stats-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const copySummary = async () => {
    const lines = [
      `LonaRPG: Архив Ноэра — локальная статистика (${range} дней)`,
      `Просмотры: ${stats.pageViews}`,
      `События: ${stats.actions}`,
      `Активных дней: ${stats.activeDays}`,
      `Уникальных страниц: ${stats.uniquePages}`,
      "",
      "Топ страниц:",
      ...stats.topPages.map((row) => `  ${row.label} — ${row.value}`),
      "",
      "Топ событий:",
      ...stats.topEvents.map((row) => `  ${row.label} — ${row.value}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const toggle = () => {
    const next = !store.enabled;
    trackEvent("stats-toggle", next ? "true" : "false");
    setAnalyticsEnabled(next);
  };

  const clear = () => {
    if (!window.confirm("Удалить локальный журнал событий? Это действие нельзя отменить.")) return;
    trackEvent("stats-clear");
    clearAnalytics();
  };

  const chartTotal = stats.pageViews + stats.actions;

  return (
    <div>
      <SectionHeader
        eyebrow="Аналитика"
        title="Статистика архива"
        description="Приватный журнал этого браузера: какие разделы открывают, чем пользуются и что ищут. Данные не уходят на сервер и не требуют регистрации."
        meta={
          <>
            <Badge tone="moss">
              <ShieldCheck className="h-3 w-3" /> Только этот браузер
            </Badge>
            <Badge tone="gold">Без cookie</Badge>
            <Badge tone="neutral">
              <Lock className="h-3 w-3" /> localStorage
            </Badge>
          </>
        }
      />

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Просмотры страниц" value={stats.pageViews} />
        <StatPill label="Действия" value={stats.actions} />
        <StatPill label="Активных дней" value={stats.activeDays} />
        <StatPill label="Уникальных страниц" value={stats.uniquePages} />
      </div>

      <section className="card mt-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gold/70" />
              <h2 className="font-display text-[1.35rem] leading-none text-parchment">Активность</h2>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted/55">
              Просмотры и события по дням. Наведите на столбец, чтобы увидеть точные числа.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setRange(option.id)}
                className={`border px-2.5 py-1.5 text-[10.5px] tracking-wide transition ${
                  range === option.id
                    ? "border-gold/50 bg-gold/[0.1] text-gold"
                    : "border-line bg-white/[0.015] text-muted/70 hover:border-ember/35 hover:text-parchment"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-[9.5px] uppercase tracking-[0.14em] text-muted/45">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-gold/75" /> страницы
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-ember/70" /> события
          </span>
          <span className="ml-auto normal-case tracking-normal text-muted/35">
            {chartTotal} за {range} дней · ~{stats.avg.toFixed(1)} просмотра в день
          </span>
        </div>

        <div className="mt-4 flex h-36 items-end gap-[2px] overflow-hidden sm:gap-[3px]">
          {stats.daily.map((bucket) => {
            const total = bucket.pages + bucket.events;
            const pageHeight = (bucket.pages / stats.maxDay) * 100;
            const eventHeight = (bucket.events / stats.maxDay) * 100;
            return (
              <div
                key={bucket.key}
                className="group relative flex h-full min-w-0 flex-1 flex-col justify-end"
                title={`${bucket.label}: ${bucket.pages} просмотров, ${bucket.events} событий`}
              >
                <div className="flex h-full w-full flex-col justify-end">
                  <div
                    className="w-full bg-ember/55 transition group-hover:bg-ember/80"
                    style={{ height: `${eventHeight}%` }}
                  />
                  <div
                    className="w-full bg-gold/65 transition group-hover:bg-gold/90"
                    style={{ height: `${pageHeight}%` }}
                  />
                </div>
                {total > 0 && (
                  <span className="pointer-events-none absolute inset-x-0 -top-1 flex justify-center text-[8px] tabular-nums text-muted/0 transition group-hover:text-gold/80">
                    {total}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-1.5 flex gap-[2px] sm:gap-[3px]">
          {stats.daily.map((bucket, index) => {
            const step = Number(range) > 20 ? 5 : Number(range) > 10 ? 3 : 2;
            const show = index === stats.daily.length - 1 || index % step === 0;
            return (
              <span
                key={bucket.key}
                className="min-w-0 flex-1 truncate text-center text-[8.5px] text-muted/35"
              >
                {show ? bucket.label.replace(".", "") : ""}
              </span>
            );
          })}
        </div>

        {chartTotal === 0 && (
          <div className="mt-3 border border-dashed border-line/70 bg-void/25 px-3 py-2.5 text-[11px] text-muted/50">
            За выбранный период событий нет. Откройте карту, поиск или инструменты — записи появятся здесь.
          </div>
        )}
      </section>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <section className="card p-4">
          <SectionSubhead title="Топ страниц" aside={`${range} дней`} className="mb-3" />
          {stats.topPages.length === 0 ? (
            <EmptyState text="Просмотров пока нет." />
          ) : (
            <div className="space-y-2.5">
              {stats.topPages.map((row, index) => (
                <div key={row.path} className="flex items-center gap-2.5">
                  <span className="w-4 shrink-0 text-right text-[10px] tabular-nums text-muted/35">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-parchment/85" title={row.path}>
                    {row.label}
                  </span>
                  <span className="hidden h-1 w-20 shrink-0 bg-void/80 sm:block">
                    <span
                      className="block h-full bg-gradient-to-r from-ember/70 to-gold/70"
                      style={{ width: `${Math.max(4, (row.value / stats.topPages[0].value) * 100)}%` }}
                    />
                  </span>
                  <span className="w-7 shrink-0 text-right text-[11px] tabular-nums text-gold/75">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card p-4">
          <SectionSubhead title="Топ событий" aside={`${range} дней`} className="mb-3" />
          {stats.topEvents.length === 0 ? (
            <EmptyState text="Событий пока нет." />
          ) : (
            <div className="space-y-3">
              {stats.topEvents.map((row, index) => (
                <div key={row.name}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 shrink-0 text-right text-[10px] tabular-nums text-muted/35">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12px] text-parchment/85">
                      {row.label}
                    </span>
                    <span className="w-7 shrink-0 text-right text-[11px] tabular-nums text-gold/75">
                      {row.value}
                    </span>
                  </div>
                  {row.details.length > 0 && (
                    <div className="ml-[26px] mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-muted/35">
                      {row.details.map(([detail, count]) => (
                        <span key={detail}>
                          {DETAIL_LABELS[detail] ?? detail} · {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="card p-4">
          <SectionSubhead title="Последние записи" aside={lastSeen ? `до ${lastSeen}` : "пусто"} className="mb-3" />
          {stats.recent.length === 0 ? (
            <EmptyState text="Журнал пуст. Первая запись появится при переходе по разделам." />
          ) : (
            <div className="divide-y divide-line/50">
              {stats.recent.map((event, index) => {
                const Icon = eventIcon(event);
                return (
                  <div key={`${event.t}-${index}`} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-ember/55" />
                    <span className="min-w-0 flex-1 truncate text-[11.5px] text-parchment/80">
                      {event.kind === "page" ? pathLabel(event.name) : eventLabel(event)}
                    </span>
                    <span className="shrink-0 text-[9px] tabular-nums text-muted/35">
                      {new Intl.DateTimeFormat("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(event.t)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card p-4">
          <SectionSubhead title="Управление" aside="Приватность" className="mb-3" />
          <div className="flex items-center justify-between gap-3 border border-line/60 bg-void/30 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Power className={`h-4 w-4 ${store.enabled ? "text-moss" : "text-muted/40"}`} />
              <div>
                <div className="text-[12px] text-parchment/85">Запись событий</div>
                <div className="text-[9.5px] text-muted/45">
                  {store.enabled ? "включена" : "выключена"} · {store.events.length} записей в журнале
                </div>
              </div>
            </div>
            <button
              onClick={toggle}
              role="switch"
              aria-checked={store.enabled}
              aria-label="Записывать события"
              className={`relative h-5 w-9 shrink-0 border transition ${
                store.enabled ? "border-moss/50 bg-moss/20" : "border-line bg-void"
              }`}
            >
              <span
                className={`absolute top-0.5 h-3.5 w-3.5 transition ${
                  store.enabled ? "left-[18px] bg-moss" : "left-0.5 bg-muted/40"
                }`}
              />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={download}
              className="flex items-center justify-center gap-1.5 border border-gold/35 bg-gold/[0.07] px-2 py-2 text-[10.5px] text-gold transition hover:bg-gold/[0.13]"
            >
              <Download className="h-3.5 w-3.5" />
              Скачать JSON
            </button>
            <button
              onClick={copySummary}
              className="flex items-center justify-center gap-1.5 border border-line px-2 py-2 text-[10.5px] text-muted/70 transition hover:border-gold/35 hover:text-parchment"
            >
              <FileJson className="h-3.5 w-3.5" />
              {copied ? "Скопировано" : "Копировать сводку"}
            </button>
          </div>

          <button
            onClick={clear}
            className="mt-2 flex w-full items-center justify-center gap-1.5 border border-blood/30 px-2 py-2 text-[10.5px] text-[#d98a8a]/85 transition hover:bg-blood/[0.08]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Очистить журнал
          </button>

          <p className="mt-3 border-l-2 border-line pl-2.5 text-[9.5px] leading-relaxed text-muted/40">
            Не сохраняются поисковые запросы, тексты правок, IP-адреса и идентификаторы устройства.
            Очистка удаляет только этот журнал и не затрагивает прогресс трекера.
          </p>
        </section>
      </div>

      <section className="mt-4 border border-line/70 bg-white/[0.012] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2.5">
            {goatCode ? (
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss/70" />
            ) : (
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted/45" />
            )}
            <div>
              <h3 className="font-display text-[15px] text-parchment">
                {goatCode ? "Агрегированный счётчик подключён" : "Агрегированный счётчик не подключён"}
              </h3>
              <p className="mt-1 max-w-2xl text-[10.5px] leading-relaxed text-muted/50">
                {goatCode
                  ? "GoatCounter получает только обезличенные просмотры и события. Панель владельца открывается на отдельном домене; этот журнал остаётся локальным."
                  : "Локальная статистика уже работает. Для общих цифр по всем посетителям владелец сайта может задать код GoatCounter при сборке (VITE_GOATCOUNTER) — регистрация и внешний сервис не нужны для этой страницы."}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {goatCode && (
              <a
                href={`https://${goatCode}.goatcounter.com`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 border border-gold/35 px-2.5 py-1.5 text-[10px] text-gold transition hover:bg-gold/[0.08]"
              >
                Панель GoatCounter <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <span className="flex items-center gap-1.5 border border-line/70 px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.12em] text-muted/45">
              <CalendarDays className="h-3 w-3" />
              с {SITE.version}
            </span>
          </div>
        </div>
      </section>

      <p className="mt-4 flex items-center gap-1.5 text-[9.5px] text-muted/30">
        <RefreshCw className="h-3 w-3" />
        Журнал обновляется сразу после действий и синхронизируется между вкладками.
      </p>
    </div>
  );
}
