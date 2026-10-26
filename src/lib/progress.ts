import { useSyncExternalStore } from "react";
import { quests } from "../data/quests";
import { achievements } from "../data/achievements";
import { secrets } from "../data/secrets";
import { locations } from "../data/locations";
import { endings } from "../data/endings";

/**
 * Локальный трекер прогресса. Никакой регистрации и облака:
 * всё лежит в localStorage, экспортируется в JSON и импортируется обратно.
 * Формат версионирован, чтобы старые сохранения не ломали сайт.
 */
export type TrackKind = "quests" | "achievements" | "secrets" | "locations" | "endings";

export interface ProgressState {
  version: 1;
  updated: string | null;
  checked: Record<TrackKind, string[]>;
}

const STORAGE_KEY = "lonawiki:progress:v1";

const emptyChecked = (): Record<TrackKind, string[]> => ({
  quests: [],
  achievements: [],
  secrets: [],
  locations: [],
  endings: [],
});

function emptyState(): ProgressState {
  return { version: 1, updated: null, checked: emptyChecked() };
}

function sanitize(raw: unknown): ProgressState {
  if (!raw || typeof raw !== "object") return emptyState();
  const source = raw as Partial<ProgressState> & { checked?: Record<string, unknown> };
  const checked = emptyChecked();
  if (source.checked && typeof source.checked === "object") {
    for (const kind of Object.keys(checked) as TrackKind[]) {
      const list = source.checked[kind];
      if (Array.isArray(list)) {
        checked[kind] = [...new Set(list.filter((v): v is string => typeof v === "string"))];
      }
    }
  }
  return {
    version: 1,
    updated: typeof source.updated === "string" ? source.updated : null,
    checked,
  };
}

function load(): ProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : emptyState();
  } catch {
    return emptyState();
  }
}

let state: ProgressState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* приватный режим или переполнение — трекер продолжает работать в памяти */
  }
}

function commit(next: ProgressState) {
  state = next;
  persist();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return state;
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export function isDone(kind: TrackKind, id: string | number): boolean {
  return state.checked[kind].includes(String(id));
}

export function toggle(kind: TrackKind, id: string | number) {
  const key = String(id);
  const list = state.checked[kind];
  const next = list.includes(key) ? list.filter((v) => v !== key) : [...list, key];
  commit({
    ...state,
    updated: new Date().toISOString(),
    checked: { ...state.checked, [kind]: next },
  });
}

export function setDone(kind: TrackKind, id: string | number, done: boolean) {
  const key = String(id);
  const list = state.checked[kind];
  if (done === list.includes(key)) return;
  const next = done ? [...list, key] : list.filter((v) => v !== key);
  commit({
    ...state,
    updated: new Date().toISOString(),
    checked: { ...state.checked, [kind]: next },
  });
}

export function markMany(kind: TrackKind, ids: (string | number)[], done: boolean) {
  const set = new Set(state.checked[kind]);
  for (const id of ids) {
    if (done) set.add(String(id));
    else set.delete(String(id));
  }
  commit({
    ...state,
    updated: new Date().toISOString(),
    checked: { ...state.checked, [kind]: [...set] },
  });
}

export function resetAll() {
  commit(emptyState());
}

export function exportProgress(): string {
  return JSON.stringify(
    {
      site: "LonaRPG: Архив Ноэра",
      version: 1,
      exported: new Date().toISOString(),
      checked: state.checked,
    },
    null,
    2,
  );
}

export function importProgress(text: string): { ok: boolean; error?: string; count?: number } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "Файл не похож на JSON. Проверьте, что это экспорт трекера." };
  }
  const next = sanitize(parsed);
  const total = (Object.keys(next.checked) as TrackKind[]).reduce((sum, kind) => sum + next.checked[kind].length, 0);
  if (total === 0 && !(parsed as { checked?: unknown })?.checked) {
    return { ok: false, error: "В файле нет отметок трекера." };
  }
  commit({ ...next, updated: new Date().toISOString() });
  return { ok: true, count: total };
}

export const TRACK_TOTALS: Record<TrackKind, number> = {
  quests: quests.length,
  achievements: achievements.length,
  secrets: secrets.length,
  locations: locations.length,
  endings: endings.length,
};

export const TRACK_LABELS: Record<TrackKind, string> = {
  quests: "Квесты",
  achievements: "Достижения",
  secrets: "Секреты",
  locations: "Локации",
  endings: "Концовки",
};

export function progressSummary(progress: ProgressState) {
  const counts = (Object.keys(TRACK_TOTALS) as TrackKind[]).map((kind) => {
    const done = progress.checked[kind].filter((id) => idSet(kind).has(id)).length;
    const total = TRACK_TOTALS[kind];
    return { kind, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  });
  const done = counts.reduce((sum, c) => sum + c.done, 0);
  const total = counts.reduce((sum, c) => sum + c.total, 0);
  return { counts, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

const idsByKind: Partial<Record<TrackKind, Set<string>>> = {};

function idSet(kind: TrackKind): Set<string> {
  let set = idsByKind[kind];
  if (set) return set;
  if (kind === "quests") set = new Set(quests.map((q) => q.id));
  else if (kind === "achievements") set = new Set(achievements.map((a) => String(a.id)));
  else if (kind === "secrets") set = new Set(secrets.map((s) => s.id));
  else if (kind === "locations") set = new Set(locations.map((l) => l.id));
  else set = new Set(endings.map((e) => e.id));
  idsByKind[kind] = set;
  return set;
}

/** Синхронизация между вкладками. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      state = sanitize(JSON.parse(event.newValue));
      for (const listener of listeners) listener();
    } catch {
      /* игнорируем повреждённое значение */
    }
  });
}
