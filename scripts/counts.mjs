import { build } from "esbuild";
import { pathToFileURL } from "node:url";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const tmp = join(tmpdir(), "lonawiki-counts.mjs");
await build({
  stdin: {
    contents: `
      import { quests } from "./src/data/quests";
      import { mechanics } from "./src/data/mechanics";
      import { builds } from "./src/data/builds";
      import { traits } from "./src/data/traits";
      import { equipment } from "./src/data/equipment";
      import { consumables, questItems } from "./src/data/items";
      import { locations } from "./src/data/locations";
      import { characters } from "./src/data/characters";
      import { enemies } from "./src/data/bestiary";
      import { endings } from "./src/data/endings";
      import { achievements } from "./src/data/achievements";
      import { secrets, cutContent, paintings, easterEggs } from "./src/data/secrets";
      export const counts = {
        quests: quests.length, mechanics: mechanics.length, builds: builds.length,
        traits: traits.length, equipment: equipment.length,
        items: consumables.length + questItems.length, locations: locations.length,
        characters: characters.length, bestiary: enemies.length, endings: endings.length,
        achievements: achievements.length,
        secrets: secrets.length + cutContent.length + paintings.length + easterEggs.length,
      };
    `,
    resolveDir: process.cwd(),
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmp,
  logLevel: "silent",
});
const mod = await import(pathToFileURL(tmp).href);
console.log(JSON.stringify(mod.counts, null, 2));
rmSync(tmp, { force: true });
