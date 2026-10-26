#!/usr/bin/env node
/**
 * Постобработка dist/ после vite build.
 *
 *   • HTML для каждого маршрута с собственными title/description/canonical/OG;
 *   • dist/404.html — оболочка SPA для глубоких ссылок на GitHub Pages;
 *   • sitemap.xml, robots.txt;
 *   • машиночитаемые выгрузки данных в dist/data/;
 *   • версия кэша в service worker;
 *   • проверка размера бандла.
 *
 * Запускается автоматически через `npm run build`.
 */
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const ENTRY_BUDGET_KB = 240;

if (!existsSync(path.join(DIST, "index.html"))) {
  console.error("postbuild: dist/index.html не найден — сначала запустите vite build");
  process.exit(1);
}

// Повторный запуск поверх уже обработанного dist испортил бы <head>:
// вставляемые теги не должны применяться дважды.
if (existsSync(path.join(DIST, ".postbuild.json"))) {
  console.log("postbuild: dist уже обработан, пропускаю (нужен полный vite build)");
  process.exit(0);
}

/* ------------------------------------------------------------------ */
/*  Загрузка данных и метаданных страниц                              */
/* ------------------------------------------------------------------ */

async function loadSiteData() {
  const { build } = await import("esbuild");
  const result = await build({
    entryPoints: [path.join(ROOT, "scripts", "build-data.ts")],
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    target: "node18",
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

const { PAGES, SITE_BASE, SITE_ORIGIN, datasets } = await loadSiteData();

/* ------------------------------------------------------------------ */
/*  HTML                                                              */
/* ------------------------------------------------------------------ */

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const absolute = (page) => `${SITE_ORIGIN}${SITE_BASE}${page.path}`;
const ogImage = `${SITE_ORIGIN}${SITE_BASE}og.png`;

function insertBeforeHeadEnd(html, tag) {
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function setMeta(html, attribute, tag) {
  const re = new RegExp(`<meta\\s+[^>]*${attribute}[^>]*>`, "i");
  if (re.test(html)) return html.replace(re, tag);
  return insertBeforeHeadEnd(html, tag);
}

function setLink(html, rel, tag) {
  const re = new RegExp(`<link\\s+[^>]*rel="${rel}"[^>]*>`, "i");
  if (re.test(html)) return html.replace(re, tag);
  return insertBeforeHeadEnd(html, tag);
}

function headFor(page, { noindex = false } = {}) {
  const url = absolute(page);
  const title = esc(page.title);
  const description = esc(page.description);
  const robots = noindex || page.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large";
  return { url, title, description, robots };
}

function applyHead(html, page, options = {}) {
  const { url, title, description, robots } = headFor(page, options);

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  const meta = (attribute, tag) => {
    out = setMeta(out, attribute, tag);
  };

  meta(
    'name="description"',
    `<meta name="description" content="${description}" />`,
  );
  meta("name=\"robots\"", `<meta name="robots" content="${robots}" />`);
  meta('property="og:title"', `<meta property="og:title" content="${title}" />`);
  meta(
    'property="og:description"',
    `<meta property="og:description" content="${description}" />`,
  );
  meta('property="og:url"', `<meta property="og:url" content="${esc(url)}" />`);
  meta('property="og:image"', `<meta property="og:image" content="${esc(ogImage)}" />`);
  meta('name="twitter:title"', `<meta name="twitter:title" content="${title}" />`);
  meta(
    'name="twitter:description"',
    `<meta name="twitter:description" content="${description}" />`,
  );
  meta('name="twitter:image"', `<meta name="twitter:image" content="${esc(ogImage)}" />`);

  out = setLink(out, "canonical", `<link rel="canonical" href="${esc(url)}" />`);

  return out;
}

const shell = await readFile(path.join(DIST, "index.html"), "utf8");
const written = [];

for (const page of PAGES) {
  const html = applyHead(shell, page);
  const target = page.path ? path.join(DIST, page.path, "index.html") : path.join(DIST, "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
  written.push(page.path ? `/${page.path}` : "/");
}

// 404.html получает оболочку с noindex: GitHub Pages отдаёт его на любой
// неизвестный путь, а маршрутизатор уже решает, что показать.
await writeFile(path.join(DIST, "404.html"), applyHead(shell, PAGES[0], { noindex: true }), "utf8");

/* ------------------------------------------------------------------ */
/*  robots.txt и sitemap.xml                                          */
/* ------------------------------------------------------------------ */

const baseRoot = `${SITE_ORIGIN}${SITE_BASE}`;
const buildDate = new Date().toISOString().slice(0, 10);

const robots = `# LonaRPG: Архив Ноэра — неофициальный русский путеводитель
User-agent: *
Allow: /

# Служебные и неиндексируемые страницы
Disallow: /LonaWIKI/404.html

Sitemap: ${baseRoot}sitemap.xml
`;
await writeFile(path.join(DIST, "robots.txt"), robots, "utf8");

const canonicalPages = PAGES.filter((page) => !page.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${canonicalPages
  .map((page) => {
    const loc = absolute(page).replace(/&/g, "&amp;");
    const priority = page.id === "home" ? "1.0" : ["map", "quests", "items", "equipment"].includes(page.id) ? "0.8" : "0.6";
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;
await writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");

await writeFile(path.join(DIST, ".nojekyll"), "", "utf8");

/* ------------------------------------------------------------------ */
/*  Выгрузки данных                                                   */
/* ------------------------------------------------------------------ */

const dataDir = path.join(DIST, "data");
await mkdir(dataDir, { recursive: true });

const files = {
  "locations.json": {
    generated: new Date().toISOString(),
    source: "LonaRPG: Архив Ноэра",
    count: datasets.locations.length,
    regions: datasets.regions,
    locations: datasets.locations,
  },
  "quests.json": {
    generated: new Date().toISOString(),
    count: datasets.quests.length,
    quests: datasets.quests,
  },
  "equipment.json": {
    generated: new Date().toISOString(),
    count: datasets.equipment.length,
    sets: datasets.equipmentSets,
    equipment: datasets.equipment,
  },
  "items.json": {
    generated: new Date().toISOString(),
    count: datasets.items.consumables.length + datasets.items.questItems.length,
    consumables: datasets.items.consumables,
    questItems: datasets.items.questItems,
  },
  "craft.json": {
    generated: new Date().toISOString(),
    count: datasets.recipes.length,
    recipes: datasets.recipes,
  },
  "bestiary.json": {
    generated: new Date().toISOString(),
    count: datasets.enemies.length,
    enemies: datasets.enemies,
  },
  "progress.json": {
    generated: new Date().toISOString(),
    counts: {
      quests: datasets.quests.length,
      locations: datasets.locations.length,
      equipment: datasets.equipment.length,
      items: datasets.items.consumables.length + datasets.items.questItems.length,
      traits: datasets.traits.length,
      enemies: datasets.enemies.length,
      endings: datasets.endings.length,
      achievements: datasets.achievements.length,
      characters: datasets.characters.length,
      recipes: datasets.recipes.length,
    },
    pages: PAGES.map((page) => ({ id: page.id, path: page.path, title: page.title, url: absolute(page) })),
  },
};

for (const [name, payload] of Object.entries(files)) {
  await writeFile(path.join(dataDir, name), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

/* ------------------------------------------------------------------ */
/*  Версия service worker                                             */
/* ------------------------------------------------------------------ */

const assetDir = path.join(DIST, "assets");
let assetNames = [];
if (existsSync(assetDir)) assetNames = (await readdir(assetDir)).sort();

const buildHash = createHash("sha1")
  .update(assetNames.join("|"))
  .update(buildDate)
  .digest("hex")
  .slice(0, 10);

const swPath = path.join(DIST, "sw.js");
if (existsSync(swPath)) {
  const sw = await readFile(swPath, "utf8");
  await writeFile(swPath, sw.replaceAll("__BUILD__", buildHash), "utf8");
}

await writeFile(
  path.join(dataDir, "build.json"),
  `${JSON.stringify({ version: buildHash, built: new Date().toISOString(), assets: assetNames.length }, null, 2)}\n`,
  "utf8",
);

await writeFile(
  path.join(DIST, ".postbuild.json"),
  `${JSON.stringify({ version: buildHash, built: new Date().toISOString() }, null, 2)}\n`,
  "utf8",
);

/* ------------------------------------------------------------------ */
/*  Размер бандла                                                     */
/* ------------------------------------------------------------------ */

async function gzipSizes(dir) {
  const rows = [];
  const walk = async (current) => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "data" || entry.name === "mods" || entry.name === "icons") continue;
        await walk(full);
      } else if (/\.(?:js|css)$/.test(entry.name)) {
        const buf = await readFile(full);
        rows.push({
          file: path.relative(DIST, full).replace(/\\/g, "/"),
          raw: buf.length,
          gzip: gzipSync(buf, { level: 9 }).length,
        });
      }
    }
  };
  await walk(dir);
  return rows.sort((a, b) => b.gzip - a.gzip);
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const sizes = await gzipSizes(DIST);
const entry = sizes.find((row) => /^assets\/index-[^/]+\.js$/.test(row.file));

console.log("\n  Постобработка завершена");
console.log(`  HTML: ${written.length} маршрутов + 404.html`);
console.log(`  Данные: ${Object.keys(files).length + 1} JSON в /data`);
console.log(`  Версия кэша: ${buildHash}`);

if (sizes.length) {
  console.log("\n  Крупнейшие файлы (gzip):");
  for (const row of sizes.slice(0, 6)) {
    console.log(`   ${row.file.padEnd(46)} ${kb(row.gzip).padStart(9)}  (raw ${kb(row.raw)})`);
  }
}

const totalGzip = sizes.reduce((sum, row) => sum + row.gzip, 0);
console.log(`\n  JS+CSS всего: ${kb(totalGzip)}`);

if (entry && entry.gzip / 1024 > ENTRY_BUDGET_KB) {
  console.error(
    `\n  ОШИБКА: входной бандл ${kb(entry.gzip)} превышает бюджет ${ENTRY_BUDGET_KB} KB.`,
  );
  process.exit(1);
}
if (entry) console.log(`  Входной бандл: ${kb(entry.gzip)} из ${ENTRY_BUDGET_KB} KB\n`);
