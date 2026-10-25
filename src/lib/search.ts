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

export interface SearchEntry {
  key: string;
  section: SectionId;
  targetId?: string;
  kind: string;
  title: string;
  subtitle: string;
  haystack: string;
}

function make(
  key: string,
  section: SectionId,
  targetId: string | undefined,
  kind: string,
  title: string,
  subtitle: string,
  extra: string[],
): SearchEntry {
  return {
    key,
    section,
    targetId,
    kind,
    title,
    subtitle,
    haystack: [title, subtitle, ...extra].join(" ").toLocaleLowerCase("ru"),
  };
}

export const searchIndex: SearchEntry[] = [
  ...quests.map((q) =>
    make(
      `quest-${q.id}`,
      "quests",
      q.id,
      "Квест",
      q.title,
      `${q.region} · ${q.kind === "main" ? "сюжет" : q.kind === "companion" ? "компаньон" : q.kind}`,
      [q.original, q.summary, q.giver, ...q.steps, ...q.tips],
    ),
  ),
  ...equipment.map((e) =>
    make(
      `equip-${e.id}`,
      "equipment",
      e.id,
      e.removed ? "Снаряжение · вырезано" : "Снаряжение",
      e.ru,
      `${e.name} · ${e.slot}`,
      [e.stats, e.where, e.note, e.set ?? "", e.weaponClass ?? ""],
    ),
  ),
  ...consumables.map((c) =>
    make(
      `item-${c.id}`,
      "items",
      c.id,
      c.removed ? "Предмет · вырезано" : "Предмет",
      c.ru,
      `${c.name} · ${c.category}`,
      [c.effect, c.source, c.note ?? ""],
    ),
  ),
  ...questItems.map((q) =>
    make(`questitem-${q.id}`, "items", q.id, "Квестовый предмет", q.ru, q.name, [
      q.quest,
      q.use,
    ]),
  ),
  ...characters.map((c) =>
    make(`char-${c.id}`, "characters", c.id, c.companion ? "Компаньон" : "Персонаж", c.ru, c.name, [
      c.role,
      c.faction,
      c.location,
      c.summary,
      c.spoiler ?? "",
      c.companion?.recruit ?? "",
    ]),
  ),
  ...enemies.map((e) =>
    make(`enemy-${e.id}`, "bestiary", e.id, "Бестиарий", e.ru, e.name, [
      e.locations,
      e.attacks,
      e.weakness,
      e.drops,
      e.note ?? "",
    ]),
  ),
  ...locations.map((l) =>
    make(`loc-${l.id}`, "locations", l.id, "Локация", l.ru, l.name, [
      l.region,
      l.coords ?? "",
      l.summary,
      l.loot,
      l.tips,
      ...l.points,
    ]),
  ),
  ...achievements.map((a) =>
    make(`ach-${a.id}`, "achievements", String(a.id), "Достижение", a.ru, a.name, [
      a.condition,
      a.category,
      a.missable ? "пропускаемое" : "",
    ]),
  ),
  ...traits.map((t) =>
    make(`trait-${t.id}`, "traits", t.id, t.removed ? "Черта · вырезано" : "Черта", t.ru, t.name, [
      t.effect,
      t.requirement,
      t.note,
      t.exclusive ?? "",
    ]),
  ),
  ...builds.map((b) =>
    make(`build-${b.id}`, "builds", b.id, "Билд", b.ru, b.name, [
      b.role,
      b.difficulty,
      ...b.traits,
      ...b.gear,
      ...b.skills,
      ...b.pros,
      ...b.cons,
    ]),
  ),
  ...endings.map((e) =>
    make(`ending-${e.id}`, "endings", e.id, "Концовка", e.ru, e.name, [
      e.condition,
      e.summary,
      ...e.steps,
    ]),
  ),
  ...mechanics.map((m) =>
    make(`mech-${m.id}`, "mechanics", m.id, "Механика", m.title, "Системы игры", [
      m.lead,
      ...m.blocks.flatMap((b) => [b.title, ...b.body]),
    ]),
  ),
  ...secrets.map((s) =>
    make(`secret-${s.id}`, "secrets", s.id, "Секрет", s.title, s.place, [
      s.original ?? "",
      s.summary,
      ...s.steps,
      s.reward,
    ]),
  ),
  ...paintings.map((p) =>
    make(`painting-${p.id}`, "secrets", p.id, "Картина", p.title, p.place, [
      p.achievement,
      p.note,
      p.coords ?? "",
    ]),
  ),
  ...easterEggs.map((e) =>
    make(`egg-${e.id}`, "secrets", e.id, "Пасхалка", e.name, e.reference, [
      e.place,
      e.note,
    ]),
  ),
  ...cutContent.map((c) =>
    make(`cut-${c.id}`, "secrets", c.id, "Вырезанное", c.ru, c.name, [
      c.description,
      c.status,
      c.type,
    ]),
  ),
];

export function searchAll(query: string, limit = 40): SearchEntry[] {
  const q = query.trim().toLocaleLowerCase("ru");
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return searchIndex
    .map((entry) => {
      let score = 0;
      const title = entry.title.toLocaleLowerCase("ru");
      if (title === q) score += 120;
      else if (title.startsWith(q)) score += 80;
      else if (title.includes(q)) score += 45;
      if (entry.haystack.includes(q)) score += 20;
      for (const token of tokens) {
        if (title.includes(token)) score += 12;
        else if (entry.haystack.includes(token)) score += 4;
        else return { entry, score: 0 };
      }
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, "ru"))
    .slice(0, limit)
    .map((r) => r.entry);
}
