import { useEffect, useState } from "react";
import { Layout, SearchPalette } from "./components/Layout";
import { useRoute } from "./lib/router";
import { Home } from "./sections/Home";
import { Beginners } from "./sections/Beginners";
import { Quests } from "./sections/Quests";
import { Mechanics } from "./sections/Mechanics";
import { EquipmentView } from "./sections/Equipment";
import { ItemsView } from "./sections/Items";
import { CharactersView } from "./sections/Characters";
import { BestiaryView } from "./sections/Bestiary";
import { TraitsView } from "./sections/Traits";
import { BuildsView } from "./sections/Builds";
import { LocationsView } from "./sections/Locations";
import { AchievementsView } from "./sections/Achievements";
import { EndingsView } from "./sections/Endings";
import { SecretsView } from "./sections/Secrets";
import { SourcesView } from "./sections/Sources";

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

export default function App() {
  const route = useRoute();
  const [searchOpen, setSearchOpen] = useState(false);

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
  }, [route.section, route.id]);

  const render = () => {
    switch (route.section) {
      case "home":
        return <Home />;
      case "beginners":
        return <Beginners />;
      case "quests":
        return <Quests focusId={route.id} />;
      case "mechanics":
        return <Mechanics focusId={route.id} />;
      case "equipment":
        return <EquipmentView focusId={route.id} />;
      case "items":
        return <ItemsView focusId={route.id} />;
      case "characters":
        return <CharactersView focusId={route.id} />;
      case "bestiary":
        return <BestiaryView focusId={route.id} />;
      case "traits":
        return <TraitsView focusId={route.id} />;
      case "builds":
        return <BuildsView focusId={route.id} />;
      case "locations":
        return <LocationsView focusId={route.id} />;
      case "achievements":
        return <AchievementsView focusId={route.id} />;
      case "endings":
        return <EndingsView focusId={route.id} />;
      case "secrets":
        return <SecretsView focusId={route.id} />;
      case "sources":
        return <SourcesView />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout route={route} onSearch={() => setSearchOpen(true)}>
      {render()}
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Layout>
  );
}
