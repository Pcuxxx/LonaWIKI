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
  | "sources";

export interface Route {
  section: SectionId;
  id?: string;
}

const known: SectionId[] = [
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
];

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!raw) return { section: "home" };
  const [first, second] = raw.split("/");
  const section = (known.includes(first as SectionId) ? first : "home") as SectionId;
  return { section, id: second ? decodeURIComponent(second) : undefined };
}

export function href(section: SectionId, id?: string): string {
  return id ? `#/${section}/${encodeURIComponent(id)}` : `#/${section}`;
}

export function navigate(section: SectionId, id?: string) {
  window.location.hash = href(section, id).slice(1);
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
