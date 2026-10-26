/**
 * Точка входа для scripts/postbuild.mjs: esbuild собирает этот файл в один
 * модуль, чтобы Node мог прочитать данные и метаданные страниц без
 * дублирования контента в JSON-исходниках.
 */
import { PAGES, SITE_BASE, SITE_ORIGIN } from "../src/lib/pages";
import { locations, regions } from "../src/data/locations";
import { quests } from "../src/data/quests";
import { equipment, equipmentSets } from "../src/data/equipment";
import { consumables, questItems } from "../src/data/items";
import { recipes } from "../src/data/original";
import { traits } from "../src/data/traits";
import { enemies } from "../src/data/bestiary";
import { endings } from "../src/data/endings";
import { achievements } from "../src/data/achievements";
import { characters } from "../src/data/characters";

export { PAGES, SITE_BASE, SITE_ORIGIN };

export const datasets = {
  locations,
  regions,
  quests,
  equipment,
  equipmentSets,
  items: { consumables, questItems },
  recipes,
  traits,
  enemies,
  endings,
  achievements,
  characters,
};
