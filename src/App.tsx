import { lazy, Suspense, useEffect, useState, type ComponentType, type LazyExoticComponent } from "react";
import { Layout, SearchPalette } from "./components/Layout";
import { knownSections, parseLocation, useRoute, type SectionId } from "./lib/router";
import { usePageMeta } from "./lib/seo";
import { trackPage } from "./lib/analytics";

const FOCUS_PREFIXES = [
  "eq-",
  "item-",
  "qi-",
  "char-",
  "enemy-",
  "trait-",
  "build-",
  "loc-",
  "ach-",
  "ending-",
  "secret-",
  "painting-",
  "egg-",
  "cut-",
  "mech-",
  "quest-detail",
];

type SectionComponent = LazyExoticComponent<ComponentType<{ focusId?: string }>>;

const VIEWS: Record<SectionId, SectionComponent> = {
  home: lazy(() => import("./sections/Home").then((m) => ({ default: m.Home }))),
  beginners: lazy(() => import("./sections/Beginners").then((m) => ({ default: m.Beginners }))),
  quests: lazy(() => import("./sections/Quests").then((m) => ({ default: m.Quests }))),
  mechanics: lazy(() => import("./sections/Mechanics").then((m) => ({ default: m.Mechanics }))),
  equipment: lazy(() => import("./sections/Equipment").then((m) => ({ default: m.EquipmentView }))),
  items: lazy(() => import("./sections/Items").then((m) => ({ default: m.ItemsView }))),
  characters: lazy(() => import("./sections/Characters").then((m) => ({ default: m.CharactersView }))),
  bestiary: lazy(() => import("./sections/Bestiary").then((m) => ({ default: m.BestiaryView }))),
  traits: lazy(() => import("./sections/Traits").then((m) => ({ default: m.TraitsView }))),
  builds: lazy(() => import("./sections/Builds").then((m) => ({ default: m.BuildsView }))),
  locations: lazy(() => import("./sections/Locations").then((m) => ({ default: m.LocationsView }))),
  achievements: lazy(() => import("./sections/Achievements").then((m) => ({ default: m.AchievementsView }))),
  endings: lazy(() => import("./sections/Endings").then((m) => ({ default: m.EndingsView }))),
  secrets: lazy(() => import("./sections/Secrets").then((m) => ({ default: m.SecretsView }))),
  sources: lazy(() => import("./sections/Sources").then((m) => ({ default: m.SourcesView }))),
  map: lazy(() => import("./sections/Map").then((m) => ({ default: m.MapView }))),
  tracker: lazy(() => import("./sections/Tracker").then((m) => ({ default: m.TrackerView }))),
  tools: lazy(() => import("./sections/Tools").then((m) => ({ default: m.ToolsView }))),
  mods: lazy(() => import("./sections/Mods").then((m) => ({ default: m.ModsView }))),
};

function scrollToFocus(id?: string) {
  if (!id) return;
  window.setTimeout(() => {
    for (const prefix of FOCUS_PREFIXES) {
      const el = document.getElementById(`${prefix}${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
  }, 90);
}

function SectionFallback() {
  return (
    <div className="animate-pulse space-y-4 py-10" aria-label="Загрузка раздела">
      <div className="h-3 w-24 bg-line/70" />
      <div className="h-10 w-2/3 bg-line/50" />
      <div className="h-3 w-full max-w-xl bg-line/40" />
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <div className="h-28 border border-line/60 bg-white/[0.015]" />
        <div className="h-28 border border-line/60 bg-white/[0.015]" />
      </div>
    </div>
  );
}

export default function App() {
  const route = useRoute();
  const [searchOpen, setSearchOpen] = useState(false);
  usePageMeta(route);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    scrollToFocus(route.id);
    if (!route.id) window.scrollTo({ top: 0, behavior: "auto" });
    trackPage(`${window.location.pathname}${window.location.hash}`, document.title);
  }, [route.section, route.id]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const base = import.meta.env.BASE_URL || "/";
      let path = url.pathname;
      if (base !== "/" && path.startsWith(base)) path = path.slice(base.length - 1);
      const segment = path.replace(/^\/+/, "").replace(/\/+$/, "").split("/")[0];
      if (segment && !knownSections.includes(segment as SectionId)) return;

      const next = parseLocation(url.pathname, url.hash);
      event.preventDefault();
      window.history.pushState({ section: next.section, id: next.id }, "", url.href);
      window.dispatchEvent(new Event("routechange"));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const View = VIEWS[route.section] ?? VIEWS.home;

  return (
    <Layout route={route} onSearch={() => setSearchOpen(true)}>
      <Suspense fallback={<SectionFallback />}>
        <View focusId={route.id} />
      </Suspense>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Layout>
  );
}
