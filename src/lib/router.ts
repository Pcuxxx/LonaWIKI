import { useEffect, useState } from "react";

export type SectionId =
  | "home"
  | "beginners"
  | "quests"
  | "mechanics"
  | "builds"
  | "traits"
  | "equipment"
  | "items"
  | "locations"
  | "characters"
  | "bestiary"
  | "endings"
  | "achievements"
  | "secrets"
  | "sources"
  | "map"
  | "tracker"
  | "tools"
  | "mods"
  | "community"
  | "stats";

export interface Route {
  section: SectionId;
  id?: string;
}

export const knownSections: SectionId[] = [
  "home",
  "beginners",
  "quests",
  "mechanics",
  "builds",
  "traits",
  "equipment",
  "items",
  "locations",
  "characters",
  "bestiary",
  "endings",
  "achievements",
  "secrets",
  "sources",
  "map",
  "tracker",
  "tools",
  "mods",
  "community",
  "stats",
];

const BASE = import.meta.env.BASE_URL || "/";

/** Старые ссылки вида #/items/id — читаем и переводим на новые URL. */
export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!raw) return { section: "home" };
  const [first, second] = raw.split("/");
  const section = (knownSections.includes(first as SectionId) ? first : "home") as SectionId;
  return { section, id: second ? decodeURIComponent(second) : undefined };
}

function pathSections(pathname: string): string {
  let path = pathname;
  if (BASE !== "/" && path.startsWith(BASE)) path = path.slice(BASE.length - 1);
  return path.replace(/^\/+/, "").replace(/\/+$/, "");
}

/** Текущий маршрут: чистый URL + необязательный якорь сущности. */
export function parseLocation(pathname = window.location.pathname, hash = window.location.hash): Route {
  if (hash.startsWith("#/")) return parseHash(hash);
  const raw = pathSections(pathname);
  const first = raw.split("/")[0];
  const section = (knownSections.includes(first as SectionId) ? first : "home") as SectionId;
  const id = hash && hash.length > 1 ? decodeURIComponent(hash.slice(1)) : undefined;
  return { section, id };
}

export function href(section: SectionId, id?: string): string {
  const path = section === "home" ? "" : section;
  return `${BASE}${path}${id ? `#${encodeURIComponent(id)}` : ""}`;
}

function emitRouteChange() {
  window.dispatchEvent(new Event("routechange"));
}

export function navigate(section: SectionId, id?: string) {
  const url = href(section, id);
  const current = `${window.location.pathname}${window.location.hash}`;
  if (current === url) {
    if (id) {
      emitRouteChange();
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.history.pushState({ section, id }, "", url);
  emitRouteChange();
}

/** Поставить URL без записи в историю (для старых hash-ссылок). */
export function replaceRoute(section: SectionId, id?: string) {
  window.history.replaceState({ section, id }, "", href(section, id));
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseLocation());

  useEffect(() => {
    const sync = () => setRoute(parseLocation());
    window.addEventListener("popstate", sync);
    window.addEventListener("routechange", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("routechange", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  return route;
}
