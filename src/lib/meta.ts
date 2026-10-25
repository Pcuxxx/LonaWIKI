import {
  BookOpen,
  Compass,
  FlaskConical,
  Footprints,
  Heart,
  Home,
  MapPin,
  ScrollText,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { quests } from "../data/quests";
import { equipment } from "../data/equipment";
import { consumables, questItems } from "../data/items";
import { characters } from "../data/characters";
import { enemies } from "../data/bestiary";
import { locations } from "../data/locations";
import { achievements } from "../data/achievements";
import { traits } from "../data/traits";
import { builds } from "../data/builds";
import { endings } from "../data/endings";
import { mechanics } from "../data/mechanics";
import { cutContent, easterEggs, paintings, secrets } from "../data/secrets";
import type { SectionId } from "./router";

export const SITE = {
  title: "LonaRPG: Архив Ноэра",
  short: "Архив Ноэра",
  subtitle: "Русский путеводитель по острову",
  version: "B.0.10.8.31",
  devDate: "8 октября 2026",
  previous: "B.0.10.7.5.18",
  github: "https://github.com/Pcuxxx/LonaWIKI",
  source: "https://lonarpg.miraheze.org",
};

export interface NavItem {
  id: SectionId;
  label: string;
  desc: string;
  icon: LucideIcon;
  count?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const counts = {
  quests: quests.length,
  mechanics: mechanics.length,
  builds: builds.length,
  traits: traits.length,
  equipment: equipment.length,
  items: consumables.length + questItems.length,
  locations: locations.length,
  characters: characters.length,
  bestiary: enemies.length,
  endings: endings.length,
  achievements: achievements.length,
  secrets: secrets.length + cutContent.length + paintings.length + easterEggs.length,
};

export const navGroups: NavGroup[] = [
  {
    label: "Начало пути",
    items: [
      { id: "home", label: "Главная", desc: "Обзор архива", icon: Home },
      { id: "beginners", label: "Первые шаги", desc: "Старт и выживание", icon: Footprints },
    ],
  },
  {
    label: "Прохождение",
    items: [
      { id: "quests", label: "Квесты", desc: "Сюжет и побочные", icon: ScrollText, count: counts.quests },
      { id: "locations", label: "Локации", desc: "Карта острова", icon: MapPin, count: counts.locations },
      { id: "endings", label: "Концовки", desc: "Все финалы", icon: Sparkles, count: counts.endings },
      { id: "secrets", label: "Секреты", desc: "Тайны и вырезанное", icon: Compass, count: counts.secrets },
    ],
  },
  {
    label: "Персонаж",
    items: [
      { id: "builds", label: "Билды", desc: "Сборки персонажа", icon: Swords, count: counts.builds },
      { id: "traits", label: "Черты", desc: "Древо развития", icon: Heart, count: counts.traits },
      { id: "equipment", label: "Снаряжение", desc: "Оружие и броня", icon: Shield, count: counts.equipment },
      { id: "items", label: "Предметы", desc: "Расходники и лут", icon: FlaskConical, count: counts.items },
    ],
  },
  {
    label: "Мир",
    items: [
      { id: "characters", label: "Персонажи", desc: "NPC и компаньоны", icon: Users, count: counts.characters },
      { id: "bestiary", label: "Бестиарий", desc: "Враги и боссы", icon: Skull, count: counts.bestiary },
      { id: "mechanics", label: "Механики", desc: "Системы игры", icon: BookOpen, count: counts.mechanics },
    ],
  },
  {
    label: "Архив",
    items: [
      { id: "achievements", label: "Достижения", desc: "Все достижения", icon: Trophy, count: counts.achievements },
      { id: "sources", label: "Источники", desc: "Версии и ссылки", icon: BookOpen },
    ],
  },
];

export const allSections = navGroups.flatMap((g) => g.items);

export function sectionLabel(id: SectionId) {
  return allSections.find((s) => s.id === id)?.label ?? "Главная";
}
