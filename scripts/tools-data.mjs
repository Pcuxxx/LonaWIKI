import { build } from "esbuild";
import { pathToFileURL } from "node:url";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tmp = join(tmpdir(), "lonawiki-tools.mjs");
await build({
  stdin: {
    contents: `import { recipes } from "./src/data/original"; import { equipment } from "./src/data/equipment"; import { consumables } from "./src/data/items"; export const out = { recipes, equipment, consumables };`,
    resolveDir: process.cwd(),
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmp,
  logLevel: "silent",
});
const mod = await import(pathToFileURL(tmp).href + "?t=" + Date.now());
const slots = [...new Set(mod.out.equipment.map((e) => e.slot))];
const prices = mod.out.equipment.filter((e) => e.price).length;
const cons = mod.out.consumables.filter((c) => c.price).length;
writeFileSync(
  join(tmpdir(), "lonawiki-tools.json"),
  JSON.stringify({ recipes: mod.out.recipes.length, slots, equipment: mod.out.equipment.length, prices, consumables: mod.out.consumables.length, cons }, null, 2),
);
console.log("ok");
