import { build } from "esbuild";
import { pathToFileURL } from "node:url";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tmp = join(tmpdir(), "lonawiki-locs.mjs");
await build({
  stdin: {
    contents: `export { locations, regions } from "./src/data/locations";`,
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
const rows = mod.locations.map((l) => ({
  id: l.id,
  ru: l.ru,
  region: l.region,
  coords: l.coords,
  danger: l.danger,
  quests: l.quests.length,
}));
writeFileSync(join(tmpdir(), "lonawiki-locs.json"), JSON.stringify({ regions: mod.regions, rows }, null, 2));
console.log("ok", rows.length);
