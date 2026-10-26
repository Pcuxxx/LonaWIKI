import type { SectionId } from "./router";

export const SITE_ORIGIN = "https://pcuxxx.github.io";
export const SITE_BASE = "/LonaWIKI/";

export interface PageMeta {
  id: SectionId;
  /** Путь без базового префикса. Пустая строка — главная. */
  path: string;
  /** Короткое название для навигации. */
  label: string;
  /** Заголовок страницы без суффикса сайта. */
  title: string;
  /** Описание для meta description и OG. */
  description: string;
  /** Не индексировать (служебные страницы). */
  noindex?: boolean;
}

export const PAGES: PageMeta[] = [
  {
    id: "home",
    path: "",
    label: "Главная",
    title: "LonaRPG: Архив Ноэра — русский путеводитель",
    description:
      "Русский путеводитель по LonaRPG: 53 квеста, билды, снаряжение, персонажи, бестиарий, механики, секреты и все концовки. Сборка B.0.10.8.31.",
  },
  {
    id: "beginners",
    path: "beginners",
    label: "Первые шаги",
    title: "Первые шаги в LonaRPG — старт, выживание и первые деньги",
    description:
      "С чего начать LonaRPG: создание персонажа, обучение, голод, сон, первые квесты, деньги и безопасный маршрут по Ноэру.",
  },
  {
    id: "quests",
    path: "quests",
    label: "Квесты",
    title: "Квесты LonaRPG — прохождение, награды и пропускаемые задания",
    description:
      "Полный список квестов LonaRPG: сюжетные и побочные задания, требования, награды, пошаговое прохождение и предупреждения о пропускаемых событиях.",
  },
  {
    id: "mechanics",
    path: "mechanics",
    label: "Механики",
    title: "Механики LonaRPG — голод, крафт, навыки, рабство и мир",
    description:
      "Разбор систем LonaRPG: SAT и усталость, Dark Cauldron, сбор ресурсов, работы, навыки, состояния, рабство, репутация и устройство мира.",
  },
  {
    id: "builds",
    path: "builds",
    label: "Билды",
    title: "Билды LonaRPG — воин, танк, маг, стелс и выживание",
    description:
      "Рабочие сборки персонажа LonaRPG: распределение статов, черты, снаряжение, навыки и ротация для разных стилей игры.",
  },
  {
    id: "traits",
    path: "traits",
    label: "Черты",
    title: "Черты LonaRPG — требования, эффекты и совместимость",
    description:
      "Все черты LonaRPG: как получить, что дают, какие исключают друг друга и какие стоит брать под конкретный билд.",
  },
  {
    id: "equipment",
    path: "equipment",
    label: "Снаряжение",
    title: "Снаряжение LonaRPG — оружие, броня и аксессуары",
    description:
      "Каталог снаряжения LonaRPG: характеристики, цена, вес, требования, где купить или найти, сравнение оружия и брони.",
  },
  {
    id: "items",
    path: "items",
    label: "Предметы",
    title: "Предметы LonaRPG — еда, лекарства, материалы и рецепты",
    description:
      "Все предметы LonaRPG с оригинальными описаниями: еда, медикаменты, наркотики, материалы, инструменты, цены и рецепты Dark Cauldron.",
  },
  {
    id: "locations",
    path: "locations",
    label: "Локации",
    title: "Локации LonaRPG — координаты, опасность, лут и квесты",
    description:
      "Локации острова Ноэр: координаты X/Y, уровень опасности, точки интереса, торговцы, лут и связанные квесты.",
  },
  {
    id: "characters",
    path: "characters",
    label: "Персонажи",
    title: "Персонажи LonaRPG — NPC, компаньоны и фракции",
    description:
      "Кто есть кто в LonaRPG: NPC, компаньоны, наставники и торговцы, условия вербовки, сильные и слабые стороны.",
  },
  {
    id: "bestiary",
    path: "bestiary",
    label: "Бестиарий",
    title: "Бестиарий LonaRPG — враги, боссы, слабости и дроп",
    description:
      "Бестиарий LonaRPG: HP, опасность, атаки, слабости и добыча обычных врагов, элиты и боссов.",
  },
  {
    id: "endings",
    path: "endings",
    label: "Концовки",
    title: "Концовки LonaRPG — условия, шаги и последствия",
    description:
      "Все концовки LonaRPG: хорошие, плохие, нейтральные и секретные финалы, условия получения и пошаговые инструкции.",
  },
  {
    id: "achievements",
    path: "achievements",
    label: "Достижения",
    title: "Достижения LonaRPG — список, условия и пропускаемые",
    description:
      "Полный список достижений LonaRPG с условиями получения, категориями и отметками о пропускаемых наградах.",
  },
  {
    id: "secrets",
    path: "secrets",
    label: "Секреты",
    title: "Секреты LonaRPG — пасхалки, картины и вырезанный контент",
    description:
      "Секреты LonaRPG: скрытые места, пасхалки, коллекция картин, неочевидные взаимодействия и вырезанные из игры элементы.",
  },
  {
    id: "sources",
    path: "sources",
    label: "Источники",
    title: "Источники и версии — LonaRPG: Архив Ноэра",
    description:
      "Источники русского архива LonaRPG, список версий, официальные ссылки и сведения о неофициальном статусе проекта.",
  },
  {
    id: "map",
    path: "map",
    label: "Карта",
    title: "Интерактивная карта LonaRPG — остров Ноэр, координаты и метки",
    description:
      "Интерактивная карта острова Ноэр: 45 локаций, регионы, опасность, торговцы, квесты и точные координаты X/Y. Фильтры, поиск и отметки прогресса.",
  },
  {
    id: "tracker",
    path: "tracker",
    label: "Прогресс",
    title: "Трекер прогресса LonaRPG — квесты, достижения и секреты",
    description:
      "Личный трекер прохождения LonaRPG: отмечайте квесты, достижения, секреты и локации. Данные хранятся в браузере, есть экспорт и импорт.",
  },
  {
    id: "tools",
    path: "tools",
    label: "Инструменты",
    title: "Инструменты LonaRPG — калькулятор крафта и сравнение снаряжения",
    description:
      "Практические инструменты LonaRPG: калькулятор рецептов Dark Cauldron, сравнение экипировки по статам и список покупок с ценами в TP.",
  },
  {
    id: "mods",
    path: "mods",
    label: "Моды",
    title: "Моды LonaRPG — установка, UMM и вики-мод",
    description:
      "Как устанавливать моды LonaRPG через встроенный UMM, где лежат ModScripts и GameMods.ini, и что умеет вики-мод.",
    noindex: false,
  },
];

export const PAGE_BY_ID = Object.fromEntries(PAGES.map((p) => [p.id, p])) as Record<SectionId, PageMeta>;

export function pagePath(id: SectionId): string {
  const page = PAGE_BY_ID[id] ?? PAGE_BY_ID.home;
  return page.path ? `/${page.path}` : "/";
}

export function absoluteUrl(id: SectionId): string {
  return `${SITE_ORIGIN}${SITE_BASE.replace(/\/$/, "")}${pagePath(id)}`;
}

export const OG_IMAGE = `${SITE_ORIGIN}${SITE_BASE}og.png`;
