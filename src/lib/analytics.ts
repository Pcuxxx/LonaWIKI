/**
 * Аналитика архива в двух слоях.
 *
 * 1. Локальный журнал событий: работает всегда и без регистрации, лежит только
 *    в localStorage этого браузера. По нему строится страница «Статистика».
 * 2. GoatCounter: необязательный агрегированный счётчик. Включается только
 *    если при сборке задан VITE_GOATCOUNTER (код сайта, например "lonawiki").
 *
 * Мы не записываем поисковые запросы, тексты, IP и идентификаторы устройства.
 * Запись можно выключить на странице статистики.
 */

import { useSyncExternalStore } from "react";

declare global {
  interface Window {
    goatcounter?: {
      count?: (vars: { path: string; title?: string; event?: boolean }) => void;
      no_onload?: boolean;
    };
  }
}

export interface AnalyticsEvent {
  /** Unix-время в миллисекундах. */
  t: number;
  kind: "page" | "event";
  /** Путь страницы или имя события. */
  name: string;
  detail?: string;
}

export interface AnalyticsStore {
  version: 1;
  enabled: boolean;
  events: AnalyticsEvent[];
}

const STORAGE_KEY = "lonawiki:analytics:v1";
const MAX_EVENTS = 1000;
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const PAGE_DEDUPE_MS = 1500;

function prefersNoTracking(): boolean {
  if (typeof navigator === "undefined") return false;
  const dnt = navigator.doNotTrack ?? (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack;
  return dnt === "1" || dnt === "yes";
}

function emptyStore(): AnalyticsStore {
  return { version: 1, enabled: !prefersNoTracking(), events: [] };
}

function sanitize(raw: unknown): AnalyticsStore {
  if (!raw || typeof raw !== "object") return emptyStore();
  const source = raw as Partial<AnalyticsStore>;
  const cutoff = Date.now() - MAX_AGE_MS;
  const events: AnalyticsEvent[] = [];
  if (Array.isArray(source.events)) {
    for (const entry of source.events) {
      if (!entry || typeof entry !== "object") continue;
      const item = entry as Partial<AnalyticsEvent>;
      if (item.kind !== "page" && item.kind !== "event") continue;
      if (typeof item.name !== "string" || !item.name) continue;
      const t = typeof item.t === "number" && Number.isFinite(item.t) ? item.t : 0;
      if (!t || t < cutoff) continue;
      events.push({
        t,
        kind: item.kind,
        name: item.name.slice(0, 180),
        detail: typeof item.detail === "string" ? item.detail.slice(0, 180) : undefined,
      });
    }
  }
  events.sort((a, b) => a.t - b.t);
  return {
    version: 1,
    enabled: typeof source.enabled === "boolean" ? source.enabled : !prefersNoTracking(),
    events: events.slice(-MAX_EVENTS),
  };
}

function load(): AnalyticsStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : emptyStore();
  } catch {
    return emptyStore();
  }
}

let store: AnalyticsStore = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* приватный режим или переполнение — журнал продолжает жить в памяти */
  }
}

function commit(next: AnalyticsStore) {
  store = next;
  persist();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return store;
}

/** Живой снимок локального журнала для страницы статистики. */
export function useAnalytics(): AnalyticsStore {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

function record(kind: AnalyticsEvent["kind"], name: string, detail?: string | number) {
  if (!store.enabled || !name) return;
  const now = Date.now();
  const last = store.events[store.events.length - 1];

  const normalizedDetail = detail === undefined ? undefined : String(detail).slice(0, 180);

  // Повторный вызов из StrictMode или два обработчика подряд не должен
  // раздувать счётчик. Для просмотров окно шире, для действий — уже.
  const dedupeMs = kind === "page" ? PAGE_DEDUPE_MS : 400;
  if (
    last &&
    last.kind === kind &&
    last.name === name &&
    last.detail === normalizedDetail &&
    now - last.t < dedupeMs
  ) {
    return;
  }

  const event: AnalyticsEvent = {
    t: now,
    kind,
    name: name.slice(0, 180),
    detail: normalizedDetail,
  };
  const cutoff = now - MAX_AGE_MS;
  const events = store.events.filter((entry) => entry.t >= cutoff);
  events.push(event);
  commit({ ...store, events: events.slice(-MAX_EVENTS) });
}

/** Привести URL к виду /LonaWIKI/items#id → /items#id. */
export function normalizePagePath(path: string): string {
  let value = path;
  try {
    const url = new URL(path, window.location.origin);
    value = `${url.pathname}${url.hash}`;
  } catch {
    /* оставляем строку как есть */
  }
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  if (base && base !== "/" && value.startsWith(base)) value = value.slice(base.length);
  return value.replace(/\/{2,}/g, "/") || "/";
}

/* ------------------------------------------------------------------ */
/*  GoatCounter (необязательный агрегированный слой)                   */
/* ------------------------------------------------------------------ */

let goatEnabled = false;
let pendingPage: { path: string; title: string } | null = null;

export function initAnalytics() {
  if (!store.enabled) return;
  const code = import.meta.env.VITE_GOATCOUNTER as string | undefined;
  if (!code || import.meta.env.DEV || typeof document === "undefined") return;
  if (document.querySelector("script[data-goatcounter]")) return;

  window.goatcounter = window.goatcounter || {};
  window.goatcounter.no_onload = true;

  const script = document.createElement("script");
  script.async = true;
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  script.src = "https://gc.zgo.at/count.js";
  script.addEventListener("load", () => {
    goatEnabled = true;
    // Первый просмотр мог случиться до загрузки скрипта — отправляем его сейчас.
    if (pendingPage) {
      window.goatcounter?.count?.(pendingPage);
      pendingPage = null;
    }
  });
  document.head.appendChild(script);
}

/** Просмотр страницы при клиентской навигации. */
export function trackPage(path: string, title: string) {
  const normalized = normalizePagePath(path);
  record("page", normalized);
  if (!store.enabled) return;
  if (!goatEnabled) {
    pendingPage = { path: normalized, title };
    return;
  }
  window.goatcounter?.count?.({ path: normalized, title });
}

/** Событие: поиск, фильтр, экспорт, открытие карты и т. п. */
export function trackEvent(name: string, detail?: string | number) {
  record("event", name, detail);
  if (!goatEnabled || !store.enabled) return;
  window.goatcounter?.count?.({
    path: detail === undefined ? `event/${name}` : `event/${name}/${detail}`,
    title: detail === undefined ? name : `${name}: ${detail}`,
    event: true,
  });
}

export function setAnalyticsEnabled(enabled: boolean) {
  if (store.enabled === enabled) return;
  commit({ ...store, enabled });
}

export function clearAnalytics() {
  commit({ ...store, events: [] });
}

export function exportAnalytics(): string {
  return JSON.stringify(
    {
      site: "LonaRPG: Архив Ноэра",
      version: 1,
      exported: new Date().toISOString(),
      enabled: store.enabled,
      note: "Локальный журнал событий этого браузера. Поисковые запросы и персональные данные не сохраняются.",
      events: store.events,
    },
    null,
    2,
  );
}

/** Синхронизация между вкладками. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      store = sanitize(JSON.parse(event.newValue));
      for (const listener of listeners) listener();
    } catch {
      /* игнорируем повреждённое значение */
    }
  });
}
