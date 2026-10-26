#!/usr/bin/env node
/**
 * Проверка собранного сайта и выгрузок данных.
 *
 * Запускается после `npm run build`:
 *   node scripts/validate-dist.mjs
 *
 * Проверяет:
 *   • JSON-выгрузки читаются и не содержат дублей id;
 *   • у локаций корректные координаты и допустимые границы;
 *   • у служебных карт корректные номера MapInfos;
 *   • для каждой страницы из progress.json существует HTML;
 *   • sitemap.xml содержит все индексируемые страницы;
 *   • ключевые статические файлы на месте.
 */
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const DATA = path.join(DIST, "data");
const errors = [];
const warnings = [];

async function readJson(name) {
  try {
    return JSON.parse(await readFile(path.join(DATA, name), "utf8"));
  } catch (error) {
    errors.push(`${name}: не читается (${error.message})`);
    return null;
  }
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function uniqueIds(list, label) {
  if (!Array.isArray(list)) {
    errors.push(`${label}: ожидался массив`);
    return;
  }
  const seen = new Set();
  for (const item of list) {
    const id = item?.id;
    if (typeof id !== "string" || !id.trim()) {
      errors.push(`${label}: запись без строкового id`);
      continue;
    }
    if (seen.has(id)) errors.push(`${label}: дубль id "${id}"`);
    seen.add(id);
  }
}

const locations = await readJson("locations.json");
const quests = await readJson("quests.json");
const equipment = await readJson("equipment.json");
const items = await readJson("items.json");
const craft = await readJson("craft.json");
const bestiary = await readJson("bestiary.json");
const debug = await readJson("debug.json");
const progress = await readJson("progress.json");

if (locations) {
  uniqueIds(locations.locations, "locations");
  if (locations.count !== locations.locations?.length) {
    errors.push(`locations.json: count=${locations.count}, записей=${locations.locations?.length}`);
  }
  for (const loc of locations.locations ?? []) {
    const m = /^X\s*(\d+)\s*Y\s*(\d+)$/i.exec(loc.coords ?? "");
    if (!m) {
      warnings.push(`locations: у "${loc.id}" нет координат вида X### Y###`);
      continue;
    }
    const x = Number(m[1]);
    const y = Number(m[2]);
    if (x > 170 || y > 150) errors.push(`locations: "${loc.id}" вне сетки мира (${x}, ${y})`);
  }
}

if (quests) {
  uniqueIds(quests.quests, "quests");
  if (quests.count !== quests.quests?.length) errors.push("quests.json: count не совпадает с числом записей");
}

if (equipment) {
  uniqueIds(equipment.equipment, "equipment");
  if (equipment.count !== equipment.equipment?.length) errors.push("equipment.json: count не совпадает с числом записей");
}

if (items) {
  uniqueIds(items.consumables, "items.consumables");
  uniqueIds(items.questItems, "items.questItems");
}

if (craft) {
  // У рецептов нет собственных id: их ключ — набор продуктов. Проверяем
  // структуру и отсутствие полных дублей, а не поле id.
  if (!Array.isArray(craft.recipes)) {
    errors.push("craft.recipes: ожидался массив");
  } else {
    const seen = new Set();
    for (const [index, recipe] of craft.recipes.entries()) {
      const products = recipe?.product;
      const ingredients = recipe?.ingredients;
      if (!Array.isArray(products) || products.length === 0) {
        errors.push(`craft.recipes[${index}]: нет продукта`);
        continue;
      }
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        errors.push(`craft.recipes[${index}]: нет ингредиентов`);
      }
      const key = products.map((p) => `${p?.name ?? "?"} ${p?.qty ?? "?"}`).join(" + ");
      if (seen.has(key)) errors.push(`craft.recipes: дубль рецепта "${key}"`);
      seen.add(key);
    }
  }
}

if (bestiary) {
  uniqueIds(bestiary.enemies, "bestiary.enemies");
}

if (debug) {
  uniqueIds(debug.zones, "debug.zones");
  uniqueIds(debug.placeholders, "debug.placeholders");
  for (const zone of debug.zones ?? []) {
    if (!/^\d+(?:\s*,\s*\d+)*$/.test(String(zone.mapIds ?? ""))) {
      errors.push(`debug: у "${zone.id}" некорректные mapIds "${zone.mapIds}"`);
    }
  }
}

if (progress?.pages) {
  for (const page of progress.pages) {
    const relative = page.path ? `${page.path}/index.html` : "index.html";
    if (!(await exists(path.join(DIST, relative)))) {
      errors.push(`progress.pages: нет файла dist/${relative} для "${page.id}"`);
    }
  }
}

for (const file of ["index.html", "404.html", "sitemap.xml", "robots.txt", "sw.js", "manifest.webmanifest"]) {
  if (!(await exists(path.join(DIST, file)))) errors.push(`нет dist/${file}`);
}

if (await exists(path.join(DIST, "sitemap.xml"))) {
  const sitemap = await readFile(path.join(DIST, "sitemap.xml"), "utf8");
  for (const page of progress?.pages ?? []) {
    if (page.noindex) continue;
    if (!sitemap.includes(`/${page.path}`)) {
      warnings.push(`sitemap: нет ссылки на "${page.id}" (${page.path || "/"})`);
    }
  }
}

const summary = [
  `локаций: ${locations?.locations?.length ?? "—"}`,
  `квестов: ${quests?.quests?.length ?? "—"}`,
  `снаряжения: ${equipment?.equipment?.length ?? "—"}`,
  `служебных карт: ${debug?.zones?.length ?? "—"}`,
  `страниц: ${progress?.pages?.length ?? "—"}`,
];

for (const warning of warnings) console.warn(`warning: ${warning}`);

if (errors.length > 0) {
  console.error(`\nvalidate-dist: ${errors.length} ошибок`);
  for (const error of errors) console.error(`  • ${error}`);
  process.exit(1);
}

console.log(`validate-dist: ok — ${summary.join(", ")}`);
