import {
  BarChart3,
  BookOpen,
  Calculator,
  Compass,
  FlaskConical,
  Footprints,
  Heart,
  Home,
  ListChecks,
  Map,
  MapPin,
  MessagesSquare,
  Puzzle,
  ScrollText,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { SectionId } from "./router";

export const SITE = {
  title: "LonaRPG: Архив Ноэра",
  short: "Русская вики LonaRPG",
  subtitle: "Квесты, карта, предметы и механики",
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
  quests: 53,
  mechanics: 17,
  builds: 10,
  traits: 26,
  equipment: 90,
  items: 130,
  locations: 45,
  characters: 18,
  bestiary: 49,
  endings: 7,
  achievements: 74,
  secrets: 51,
};

export const navGroups: NavGroup[] = [
  {
    label: "Начало игры",
    items: [
      { id: "home", label: "Главная", desc: "Обзор сайта", icon: Home },
      { id: "beginners", label: "Первые шаги", desc: "Как начать играть", icon: Footprints },
    ],
  },
  {
    label: "Прохождение",
    items: [
      { id: "quests", label: "Квесты", desc: "Список всех заданий", icon: ScrollText, count: counts.quests },
      { id: "map", label: "Карта", desc: "Карта острова", icon: Map, count: counts.locations },
      { id: "locations", label: "Локации", desc: "Список и координаты", icon: MapPin, count: counts.locations },
      { id: "endings", label: "Концовки", desc: "Все финалы игры", icon: Sparkles, count: counts.endings },
      { id: "secrets", label: "Секреты", desc: "Тайны и вырезанное", icon: Compass, count: counts.secrets },
    ],
  },
  {
    label: "Персонаж",
    items: [
      { id: "builds", label: "Билды", desc: "Готовые сборки", icon: Swords, count: counts.builds },
      { id: "traits", label: "Черты", desc: "Способности и развитие", icon: Heart, count: counts.traits },
      { id: "equipment", label: "Снаряжение", desc: "Оружие и броня", icon: Shield, count: counts.equipment },
      { id: "items", label: "Предметы", desc: "Еда, лут и материалы", icon: FlaskConical, count: counts.items },
    ],
  },
  {
    label: "Мир",
    items: [
      { id: "characters", label: "Персонажи", desc: "NPC и спутники", icon: Users, count: counts.characters },
      { id: "bestiary", label: "Бестиарий", desc: "Враги и боссы", icon: Skull, count: counts.bestiary },
      { id: "mechanics", label: "Механики", desc: "Как устроена игра", icon: BookOpen, count: counts.mechanics },
    ],
  },
  {
    label: "Инструменты",
    items: [
      { id: "tracker", label: "Прогресс", desc: "Список пройденного", icon: ListChecks },
      { id: "tools", label: "Инструменты", desc: "Калькуляторы и сравнение", icon: Calculator },
      { id: "mods", label: "Моды", desc: "Установка и вики-мод", icon: Puzzle },
    ],
  },
  {
    label: "Архив",
    items: [
      { id: "achievements", label: "Достижения", desc: "Список и условия", icon: Trophy, count: counts.achievements },
      { id: "community", label: "Сообщество", desc: "Правки и обсуждения", icon: MessagesSquare },
      { id: "stats", label: "Статистика", desc: "Данные этого браузера", icon: BarChart3 },
      { id: "sources", label: "Источники", desc: "Версии и ссылки", icon: BookOpen },
    ],
  },
];

export const allSections = navGroups.flatMap((g) => g.items);

export function sectionLabel(id: SectionId) {
  return allSections.find((s) => s.id === id)?.label ?? "Главная";
}
