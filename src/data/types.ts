export type QuestKind =
  | "main"
  | "side"
  | "repeatable"
  | "companion"
  | "dlc"
  | "secret";

export interface Quest {
  id: string;
  title: string;
  original: string;
  kind: QuestKind;
  region: string;
  giver: string;
  level: string;
  summary: string;
  requirements: string[];
  rewards: string[];
  steps: string[];
  tips: string[];
  missable?: string;
  related?: string[];
  version?: string;
}

export interface ItemStat {
  label: string;
  value: string;
  good?: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  ru: string;
  slot: string;
  kind: "weapon" | "armor" | "clothing" | "accessory" | "shield" | "book";
  weaponClass?: string;
  set?: string;
  price?: number;
  weight?: number;
  stats: string;
  where: string;
  note: string;
  requirements?: string;
  removed?: boolean;
}

export interface Consumable {
  id: string;
  name: string;
  ru: string;
  category: "food" | "medicine" | "drug" | "material" | "tool" | "valuable" | "service";
  price?: number;
  weight?: number;
  effect: string;
  source: string;
  note?: string;
  removed?: boolean;
}

export interface QuestItem {
  id: string;
  name: string;
  ru: string;
  quest: string;
  use: string;
  missable?: boolean;
}

export interface Character {
  id: string;
  name: string;
  ru: string;
  role: string;
  faction: string;
  location: string;
  summary: string;
  quests: string[];
  companion?: {
    position: string;
    style: string;
    cost: string;
    duration: string;
    strengths: string;
    weaknesses: string;
    recruit: string;
  };
  spoiler?: string;
}

export interface Enemy {
  id: string;
  name: string;
  ru: string;
  faction: "orkind" | "undead" | "abomination" | "fishkind" | "human" | "animal" | "boss";
  locations: string;
  hp: string;
  danger: 1 | 2 | 3 | 4 | 5;
  attacks: string;
  weakness: string;
  drops: string;
  note?: string;
}

export interface Trait {
  id: string;
  name: string;
  ru: string;
  group: "personality" | "combat" | "scout" | "faith" | "adult" | "survival";
  level: number;
  requirement: string;
  effect: string;
  note: string;
  exclusive?: string;
  removed?: boolean;
}

export interface Location {
  id: string;
  name: string;
  ru: string;
  region: string;
  coords?: string;
  danger: 1 | 2 | 3 | 4 | 5;
  summary: string;
  points: string[];
  quests: string[];
  loot: string;
  tips: string;
}

export interface Build {
  id: string;
  name: string;
  ru: string;
  difficulty: string;
  role: string;
  stats: Record<string, number>;
  personality: string;
  traits: string[];
  gear: string[];
  skills: string[];
  rotation: string[];
  pros: string[];
  cons: string[];
  rating: string;
}

export interface Achievement {
  id: number;
  name: string;
  ru: string;
  condition: string;
  category: "story" | "quest" | "combat" | "collection" | "adult" | "challenge" | "secret";
  missable?: boolean;
}

export interface Ending {
  id: string;
  name: string;
  ru: string;
  type: "good" | "bad" | "neutral" | "secret";
  condition: string;
  summary: string;
  steps: string[];
  note?: string;
}

export interface MechanicSection {
  id: string;
  title: string;
  lead: string;
  blocks: { title: string; body: string[]; table?: { head: string[]; rows: string[][] } }[];
}
