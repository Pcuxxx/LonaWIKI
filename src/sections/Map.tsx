import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  Compass,
  Crosshair,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  RotateCcw,
  ScrollText,
  Skull,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { locations, regions } from "../data/locations";
import type { Location } from "../data/types";
import { ISLAND_PATHS, LAND_PATH, MAP_H, MAP_W, project } from "../data/map-geometry";
import { Badge, Chips, DangerDots, SectionHeader, SearchField } from "../components/ui";
import { href } from "../lib/router";
import { toggle, useProgress } from "../lib/progress";

/* ------------------------------------------------------------------ */
/*  Данные                                                             */
/* ------------------------------------------------------------------ */

interface GeoPoint {
  x: number;
  y: number;
}

function coordsOf(loc: Location): GeoPoint | null {
  const m = /X\s*(\d+)\s*Y\s*(\d+)/i.exec(loc.coords ?? "");
  if (!m) return null;
  return { x: Number(m[1]), y: Number(m[2]) };
}

interface MapPoint extends GeoPoint {
  loc: Location;
  game: GeoPoint;
}

const MAP_POINTS: MapPoint[] = locations.flatMap((loc) => {
  const game = coordsOf(loc);
  if (!game) return [];
  const p = project(game.x, game.y);
  return [{ loc, game, x: p.x, y: p.y }];
});

const POINT_BY_ID = new Map(MAP_POINTS.map((p) => [p.loc.id, p]));

const DANGER_FILL: Record<number, string> = {
  1: "#5d7f4f",
  2: "#a58a3a",
  3: "#c07a32",
  4: "#b25538",
  5: "#993333",
};

const DANGER_LABEL: Record<number, string> = {
  1: "спокойно",
  2: "осторожно",
  3: "опасно",
  4: "очень опасно",
  5: "смертельно",
};

const MAJOR = new Set([
  "doom-fortress",
  "cloud-village",
  "tide-castle",
  "south-gate",
  "fishtopia",
  "sunrise-village",
  "pirates-bane",
  "wetland-camp",
  "monastery",
]);

/* Дороги и морские пути — overlay, который можно выключить. */
type RoutePoint = string | [number, number];

const ROUTE_SPECS: { kind: "road" | "sea"; via: RoutePoint[] }[] = [
  { kind: "road", via: ["burning-keg", [197, 545], "north-gate-tower", "monastery"] },
  { kind: "road", via: ["north-gate-tower", [235, 470], "cloud-village"] },
  { kind: "road", via: ["cloud-village", "abandoned-copper-mine", "mountain-monastery"] },
  { kind: "road", via: ["cloud-village", "bandits-hideout"] },
  { kind: "road", via: ["cloud-village", [300, 350], [291, 280], "doom-fortress"] },
  { kind: "road", via: ["doom-fortress", "armory"] },
  { kind: "road", via: ["armory", [355, 265], "spiral-forest", "nine-inch"] },
  { kind: "road", via: ["nine-inch", [401, 365], "tomb-berserker", "sunrise-village"] },
  { kind: "road", via: ["burning-keg", [255, 555], "crystal-mine", "east-sentry", "sunrise-village"] },
  { kind: "road", via: ["sunrise-village", "twin-peaks", "pirates-bane", "wetland-camp"] },
  { kind: "road", via: ["pirates-bane", [655, 430], "south-gate"] },
  { kind: "road", via: ["south-gate", "sybaris-gate"] },
  { kind: "road", via: ["sybaris-gate", [615, 225], "mercenary-camp"] },
  { kind: "road", via: ["mercenary-camp", "tide-castle"] },
  { kind: "road", via: ["mercenary-camp", "fallen-fortress"] },
  { kind: "road", via: ["refugee-camp", "monastery"] },
  { kind: "road", via: ["wetland-camp", [610, 590], [560, 640], "sunrise-village"] },
  { kind: "sea", via: ["port-noer", [250, 700], [400, 790], [585, 815], "broken-shell", "fishtopia"] },
];

function routePoints(via: RoutePoint[]): GeoPoint[] {
  return via.flatMap((item) => {
    if (Array.isArray(item)) return [{ x: item[0], y: item[1] }];
    const p = POINT_BY_ID.get(item);
    return p ? [{ x: p.x, y: p.y }] : [];
  });
}

function smoothPath(points: GeoPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const cur = points[i];
    const next = points[i + 1];
    const mx = (cur.x + next.x) / 2;
    const my = (cur.y + next.y) / 2;
    d += ` Q${cur.x.toFixed(1)},${cur.y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += ` L${last.x.toFixed(1)},${last.y.toFixed(1)}`;
  return d;
}

const ROUTES = ROUTE_SPECS.map((spec) => ({ kind: spec.kind, d: smoothPath(routePoints(spec.via)) }));

const REGION_LABELS: { text: string; x: number; y: number; rotate?: number; sea?: boolean; size?: number }[] = [
  { text: "НОЭР", x: 196, y: 654, size: 17 },
  { text: "СЕВЕРНЫЕ ЗЕМЛИ", x: 236, y: 374, rotate: -7, size: 13 },
  { text: "ЗЕМЛИ РОКА", x: 338, y: 203, rotate: -7, size: 14 },
  { text: "ПИКОВЫЙ ЛЕС", x: 411, y: 330, rotate: -5, size: 12 },
  { text: "ЗАМОК ПРИЛИВА", x: 521, y: 121, sea: true, size: 12 },
  { text: "ПОБЕРЕЖЬЕ", x: 606, y: 200, rotate: 22, sea: true, size: 12 },
  { text: "ВОСТОЧНЫЙ ПРЕДЕЛ", x: 604, y: 430, rotate: -9, size: 13 },
  { text: "БОЛОТА", x: 648, y: 585, rotate: -4, size: 12 },
  { text: "ЮЖНЫЕ ВОРОТА", x: 738, y: 286, rotate: -62, size: 12 },
  { text: "ФИШТОПИЯ", x: 700, y: 806, sea: true, size: 13 },
];

const PARCHMENT_LABELS = REGION_LABELS.filter((l) => !l.sea);
const SEA_LABELS = REGION_LABELS.filter((l) => l.sea);

/* ------------------------------------------------------------------ */
/*  Геометрия видов                                                    */
/* ------------------------------------------------------------------ */

interface View {
  x: number;
  y: number;
  k: number;
}

const MIN_K = 1;
const MAX_K = 7;

function clampView(v: View): View {
  const k = Math.min(MAX_K, Math.max(MIN_K, v.k));
  const x = Math.min(0, Math.max(MAP_W - MAP_W * k, v.x));
  const y = Math.min(0, Math.max(MAP_H - MAP_H * k, v.y));
  return { k, x, y };
}

function shortName(loc: Location): string {
  const text = loc.ru
    .replace(/[«»]/g, "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 21 ? `${text.slice(0, 20).trimEnd()}…` : text;
}

interface Cluster extends GeoPoint {
  items: MapPoint[];
}

function buildClusters(points: MapPoint[], k: number): Cluster[] {
  const radius = 46 / Math.max(k, 1);
  const clusters: Cluster[] = [];
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  for (const point of sorted) {
    let best: Cluster | null = null;
    let bestDistance = Infinity;
    for (const cluster of clusters) {
      const d = Math.hypot(cluster.x - point.x, cluster.y - point.y);
      if (d <= radius && d < bestDistance) {
        best = cluster;
        bestDistance = d;
      }
    }
    if (best) {
      const n = best.items.length;
      best.x = (best.x * n + point.x) / (n + 1);
      best.y = (best.y * n + point.y) / (n + 1);
      best.items.push(point);
    } else {
      clusters.push({ x: point.x, y: point.y, items: [point] });
    }
  }
  return clusters;
}

function clusterTitle(cluster: Cluster): string {
  if (cluster.items.length === 1) return shortName(cluster.items[0].loc);
  const first = cluster.items[0].loc.region;
  const same = cluster.items.every((p) => p.loc.region === first);
  return same ? first : `${cluster.items.length} локации`;
}

/* ------------------------------------------------------------------ */
/*  Статическая художественная часть                                   */
/* ------------------------------------------------------------------ */

const MAP_ART = `${import.meta.env.BASE_URL}map/world-3360.webp`;
const MAP_ART_SMALL = `${import.meta.env.BASE_URL}map/world-960.webp`;
const MAP_LQIP =
  "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAABQBQCdASooACMAPtlcokyoJSMiMdmcAQAbCWUAxNgPe5qahpJ7QgaQJyPzu0A9g1P2W0AA55yKDnpba7eZobsjALv970tcgFgmmwcTrx9p7NmHRIzlgFwdbMx5dR1eE03mHvUqLpe/LTFooQ7lpM3rfEF8HMzYRyW/XLT/oYSqfE76Sq540xYk/fe5hM45a5wNgPoHgxYbG30d4vaAAA==";

const WorldArt = memo(function WorldArt({ showRoutes, k }: { showRoutes: boolean; k: number }) {
  const labelScale = 1 / Math.max(1, k);

  return (
    <>
      <defs>
        <radialGradient id="mapBurn" cx="50%" cy="48%" r="72%">
          <stop offset="52%" stopColor="#2a1a0d" stopOpacity="0" />
          <stop offset="100%" stopColor="#2a1a0d" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="mapGlow" cx="46%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fff6dd" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#fff6dd" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* настоящая карта мира LonaRPG: тайловый дамп, тонированный под пергамент */}
      <rect width={MAP_W} height={MAP_H} fill="#8d7253" />
      <image href={MAP_LQIP} width={MAP_W} height={MAP_H} preserveAspectRatio="none" style={{ filter: "blur(2px)" }} />
      <image href={MAP_ART_SMALL} width={MAP_W} height={MAP_H} preserveAspectRatio="none" />
      <image href={MAP_ART} width={MAP_W} height={MAP_H} preserveAspectRatio="none" />

      {/* берег обведён тушью поверх растровой основы */}
      <g fill="none" strokeLinejoin="round" strokeLinecap="round" pointerEvents="none">
        <path d={LAND_PATH} stroke="#f2e5c7" strokeWidth="9" strokeOpacity="0.2" />
        <path d={LAND_PATH} stroke="#43301d" strokeWidth="2.6" strokeOpacity="0.5" />
        <path d={LAND_PATH} stroke="#241708" strokeWidth="0.95" strokeOpacity="0.72" />
        {ISLAND_PATHS.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="#f2e5c7" strokeWidth="6" strokeOpacity="0.18" />
            <path d={d} stroke="#43301d" strokeWidth="1.7" strokeOpacity="0.45" />
            <path d={d} stroke="#241708" strokeWidth="0.7" strokeOpacity="0.65" />
          </g>
        ))}
      </g>

      {showRoutes && (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
          {ROUTES.filter((r) => r.kind === "road").map((r, i) => (
            <g key={`road-${i}`}>
              <path d={r.d} stroke="#f6ecd2" strokeWidth="4.4" strokeOpacity="0.22" />
              <path d={r.d} stroke="#4a341f" strokeWidth="1.15" strokeOpacity="0.5" strokeDasharray="5 4" />
            </g>
          ))}
          {ROUTES.filter((r) => r.kind === "sea").map((r, i) => (
            <path
              key={`sea-${i}`}
              d={r.d}
              stroke="#3c5a5c"
              strokeWidth="1.1"
              strokeOpacity="0.45"
              strokeDasharray="1.5 5"
            />
          ))}
        </g>
      )}

      {/* подписи регионов */}
      <g pointerEvents="none" className="font-display">
        {PARCHMENT_LABELS.map((l) => (
          <g key={l.text} transform={`translate(${l.x} ${l.y})${l.rotate ? ` rotate(${l.rotate})` : ""} scale(${labelScale})`}>
            <text
              textAnchor="middle"
              fontSize={l.size ?? 13}
              letterSpacing={3.2}
              fill="#3a2918"
              fillOpacity="0.46"
              stroke="#f4e8cc"
              strokeOpacity="0.3"
              strokeWidth="2"
              paintOrder="stroke"
            >
              {l.text}
            </text>
          </g>
        ))}
        {SEA_LABELS.map((l) => (
          <g key={l.text} transform={`translate(${l.x} ${l.y})${l.rotate ? ` rotate(${l.rotate})` : ""} scale(${labelScale})`}>
            <text
              textAnchor="middle"
              fontSize={l.size ?? 12}
              letterSpacing={2.6}
              fill="#33433f"
              fillOpacity="0.62"
              fontStyle="italic"
            >
              {l.text}
            </text>
          </g>
        ))}
      </g>

      {/* картуш */}
      <g transform={`translate(34 28) scale(${labelScale})`} pointerEvents="none">
        <rect width="258" height="66" fill="#22160d" fillOpacity="0.9" stroke="#d8b56b" strokeOpacity="0.45" />
        <path
          d="M8 8 h10 M8 8 v10 M250 8 h-10 M250 8 v10 M8 58 h10 M8 58 v-10 M250 58 h-10 M250 58 v-10"
          fill="none"
          stroke="#d8b56b"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <text x="129" y="28" textAnchor="middle" className="font-display" fontSize="17" letterSpacing="5" fill="#f2e4c4">
          ОСТРОВ НОЭР
        </text>
        <text x="129" y="46" textAnchor="middle" fontSize="7.2" letterSpacing="2.4" fill="#b9a179">
          ИГРОВАЯ КАРТА · КООРДИНАТЫ X/Y
        </text>
        <path d="M30 54 H228" stroke="#d8b56b" strokeOpacity="0.22" strokeWidth="0.8" />
      </g>

      {/* компас */}
      <g transform={`translate(70 792) scale(${labelScale})`} pointerEvents="none">
        <circle r="31" fill="#efe2c3" fillOpacity="0.3" stroke="#3a2a18" strokeOpacity="0.5" strokeWidth="0.9" />
        <circle r="24" fill="none" stroke="#3a2a18" strokeOpacity="0.28" strokeWidth="0.7" />
        <g fill="#2c1d10" fillOpacity="0.72">
          <path d="M0,-22 L4,0 L0,22 L-4,0 Z" />
          <path d="M-22,0 L0,-3.4 L22,0 L0,3.4 Z" fillOpacity="0.35" />
        </g>
        <circle r="2.4" fill="#efe2c3" />
        <text y="-36" textAnchor="middle" fontSize="9" letterSpacing="1.4" fill="#2c1d10" fillOpacity="0.7">
          N
        </text>
      </g>

      {/* рамка и выцветание по краям */}
      <g pointerEvents="none" fill="none" stroke="#3a2a18">
        <rect x="5" y="5" width={MAP_W - 10} height={MAP_H - 10} strokeOpacity="0.45" strokeWidth="2" />
        <rect x="11" y="11" width={MAP_W - 22} height={MAP_H - 22} strokeOpacity="0.22" strokeWidth="0.8" />
      </g>
      <rect width={MAP_W} height={MAP_H} fill="url(#mapGlow)" pointerEvents="none" />
      <rect width={MAP_W} height={MAP_H} fill="url(#mapBurn)" pointerEvents="none" />
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  Основной компонент                                                 */
/* ------------------------------------------------------------------ */

type DangerBand = "all" | "low" | "mid" | "high";
type Scope = "all" | "quests" | "unvisited" | "visited";

const DANGER_OPTIONS: { id: DangerBand; label: string }[] = [
  { id: "all", label: "Любая" },
  { id: "low", label: "1–2" },
  { id: "mid", label: "3" },
  { id: "high", label: "4–5" },
];

const SCOPE_OPTIONS: { id: Scope; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "quests", label: "С квестами" },
  { id: "unvisited", label: "Не отмечены" },
  { id: "visited", label: "Пройдены" },
];

export function MapView({ focusId }: { focusId?: string }) {
  const progress = useProgress();
  const visited = useMemo(() => new Set(progress.checked.locations), [progress]);

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [danger, setDanger] = useState<DangerBand>("all");
  const [scope, setScope] = useState<Scope>("all");
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number; title: string; sub: string } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const selected = selectedId ? POINT_BY_ID.get(selectedId) ?? null : null;

  const shellRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<View>({ x: 0, y: 0, k: 1 });
  const [view, setView] = useState<View>(viewRef.current);
  const frameRef = useRef(0);
  const animationRef = useRef(0);
  const dragRef = useRef<{ ux: number; uy: number; view: View } | null>(null);
  const movedRef = useRef(false);
  const touchesRef = useRef(new Map<number, { cx: number; cy: number }>());
  const pinchRef = useRef<{ dist: number; mid: GeoPoint; view: View } | null>(null);

  const commitView = useCallback((next: View) => {
    viewRef.current = clampView(next);
    if (frameRef.current) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;
      setView(viewRef.current);
    });
    // Страховка: в фоновой или свёрнутой вкладке браузер может не вызывать
    // rAF, и тогда карта «залипнет» на первом кадре. Пробуем применить вид
    // напрямую, если кадр так и не наступил.
    window.setTimeout(() => {
      if (!frameRef.current) return;
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      setView(viewRef.current);
    }, 180);
  }, []);

  const animateTo = useCallback(
    (target: View) => {
      window.cancelAnimationFrame(animationRef.current);
      const start = viewRef.current;
      const end = clampView(target);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        commitView(end);
        return;
      }
      const started = performance.now();
      const duration = 320;
      let finished = false;
      let watchdog = 0;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(watchdog);
        commitView(end);
      };
      const step = (now: number) => {
        if (finished) return;
        const t = Math.min(1, (now - started) / duration);
        const e = 1 - Math.pow(1 - t, 3);
        commitView({
          x: start.x + (end.x - start.x) * e,
          y: start.y + (end.y - start.y) * e,
          k: start.k + (end.k - start.k) * e,
        });
        if (t < 1) animationRef.current = window.requestAnimationFrame(step);
        else finish();
      };
      watchdog = window.setTimeout(finish, duration + 420);
      animationRef.current = window.requestAnimationFrame(step);
    },
    [commitView],
  );

  const toUser = useCallback((clientX: number, clientY: number): GeoPoint | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const result = point.matrixTransform(ctm.inverse());
    return { x: result.x, y: result.y };
  }, []);

  const zoomAt = useCallback(
    (anchor: GeoPoint, factor: number) => {
      const current = viewRef.current;
      const k = Math.min(MAX_K, Math.max(MIN_K, current.k * factor));
      const mapX = (anchor.x - current.x) / current.k;
      const mapY = (anchor.y - current.y) / current.k;
      commitView({ k, x: anchor.x - mapX * k, y: anchor.y - mapY * k });
    },
    [commitView],
  );

  const focusPoint = useCallback(
    (point: GeoPoint, k = 3.2) => {
      const targetK = Math.min(Math.max(k, 2.4), 4.2);
      animateTo({ k: targetK, x: MAP_W / 2 - point.x * targetK, y: MAP_H / 2 - point.y * targetK });
    },
    [animateTo],
  );

  const focusLocation = useCallback(
    (id: string) => {
      const point = POINT_BY_ID.get(id);
      if (!point) return;
      setSelectedId(id);
      focusPoint(point);
    },
    [focusPoint],
  );

  /* deep link /map#location-id */
  useEffect(() => {
    if (!focusId) return;
    const point = POINT_BY_ID.get(focusId);
    if (!point) return;
    setSelectedId(focusId);
    focusPoint(point);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId]);

  /* wheel zoom (native, чтобы preventDefault работал) */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const anchor = toUser(event.clientX, event.clientY);
      if (!anchor) return;
      const factor = Math.exp(-event.deltaY * 0.0016);
      zoomAt(anchor, factor);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [toUser, zoomAt]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(frameRef.current);
      window.cancelAnimationFrame(animationRef.current);
    },
    [],
  );

  /* фильтры */
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("ru");
    return MAP_POINTS.filter(({ loc }) => {
      if (region !== "all" && loc.region !== region) return false;
      if (danger === "low" && loc.danger > 2) return false;
      if (danger === "mid" && loc.danger !== 3) return false;
      if (danger === "high" && loc.danger < 4) return false;
      if (scope === "quests" && loc.quests.length === 0) return false;
      if (scope === "unvisited" && visited.has(loc.id)) return false;
      if (scope === "visited" && !visited.has(loc.id)) return false;
      if (!q) return true;
      const haystack = [loc.ru, loc.name, loc.region, loc.coords ?? "", loc.summary, loc.points.join(" "), loc.quests.join(" "), loc.loot]
        .join(" ")
        .toLocaleLowerCase("ru");
      return haystack.includes(q);
    });
  }, [query, region, danger, scope, visited]);

  const clusters = useMemo(() => buildClusters(filtered, view.k), [filtered, view.k]);

  const regionCounts = useMemo(() => {
    const map: Record<string, number> = { all: MAP_POINTS.length };
    for (const p of MAP_POINTS) map[p.loc.region] = (map[p.loc.region] ?? 0) + 1;
    return map;
  }, []);

  const regionOptions = useMemo(
    () => [
      { id: "all", label: "Весь остров", count: regionCounts.all },
      ...regions.map((r) => ({ id: r, label: r, count: regionCounts[r] ?? 0 })),
    ],
    [regionCounts],
  );

  /* указатели */
  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    if ((event.target as Element).closest("[data-marker]")) return;
    movedRef.current = false;

    if (event.pointerType === "touch") {
      touchesRef.current.set(event.pointerId, { cx: event.clientX, cy: event.clientY });
      if (touchesRef.current.size === 2) {
        const [a, b] = [...touchesRef.current.values()];
        const midA = toUser((a.cx + b.cx) / 2, (a.cy + b.cy) / 2);
        if (midA) {
          pinchRef.current = {
            dist: Math.max(1, Math.hypot(a.cx - b.cx, a.cy - b.cy)),
            mid: midA,
            view: viewRef.current,
          };
          dragRef.current = null;
          return;
        }
      }
    }

    const user = toUser(event.clientX, event.clientY);
    if (!user) return;
    dragRef.current = { ux: user.x, uy: user.y, view: viewRef.current };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch" && touchesRef.current.has(event.pointerId)) {
      touchesRef.current.set(event.pointerId, { cx: event.clientX, cy: event.clientY });
    }

    if (pinchRef.current && touchesRef.current.size >= 2) {
      const [a, b] = [...touchesRef.current.values()];
      const start = pinchRef.current;
      const dist = Math.max(1, Math.hypot(a.cx - b.cx, a.cy - b.cy));
      const mid = toUser((a.cx + b.cx) / 2, (a.cy + b.cy) / 2);
      if (!mid) return;
      const k = Math.min(MAX_K, Math.max(MIN_K, start.view.k * (dist / start.dist)));
      const mapX = (start.mid.x - start.view.x) / start.view.k;
      const mapY = (start.mid.y - start.view.y) / start.view.k;
      commitView({ k, x: mid.x - mapX * k, y: mid.y - mapY * k });
      movedRef.current = true;
      return;
    }

    if (!dragRef.current) return;
    const user = toUser(event.clientX, event.clientY);
    if (!user) return;
    const dx = user.x - dragRef.current.ux;
    const dy = user.y - dragRef.current.uy;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    commitView({ ...dragRef.current.view, x: dragRef.current.view.x + dx, y: dragRef.current.view.y + dy });
  };

  const endPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") touchesRef.current.delete(event.pointerId);
    if (touchesRef.current.size < 2) pinchRef.current = null;
    if (dragRef.current) {
      dragRef.current = null;
      setDragging(false);
    }
  };

  const onDoubleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const anchor = toUser(event.clientX, event.clientY);
    if (!anchor) return;
    animateTo({
      k: Math.min(MAX_K, viewRef.current.k * 1.9),
      x: anchor.x - ((anchor.x - viewRef.current.x) / viewRef.current.k) * Math.min(MAX_K, viewRef.current.k * 1.9),
      y: anchor.y - ((anchor.y - viewRef.current.y) / viewRef.current.k) * Math.min(MAX_K, viewRef.current.k * 1.9),
    });
  };

  const zoomCenter = (factor: number) => zoomAt({ x: MAP_W / 2, y: MAP_H / 2 }, factor);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shellRef.current?.requestFullscreen?.();
    } catch {
      /* браузер может запретить полноэкранный режим */
    }
  };

  const selectedVisited = selected ? visited.has(selected.loc.id) : false;

  return (
    <div className="animate-[fadeIn_.35s_ease-out]">
      <SectionHeader
        eyebrow="Атлас острова"
        title="Карта Ноэра"
        description="Основа карты — настоящий мир LonaRPG: та же география, что вы видите в игре, только тонированная под пергамент. Все 45 меток стоят по игровым координатам X/Y из вики. Наводите курсор, приближайте колесом, отмечайте посещённые места — прогресс сохранится в браузере."
        meta={
          <>
            <Badge tone="gold">{MAP_POINTS.length} локаций</Badge>
            <Badge tone="neutral">{regions.length} регионов</Badge>
            <Badge tone="frost">
              <Layers className="h-3 w-3" /> карта из игры
            </Badge>
            <a
              href={href("tracker")}
              className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-[0.16em] text-ember/85 transition hover:text-gold"
            >
              Трекер <ArrowUpRight className="h-3 w-3" />
            </a>
          </>
        }
      />

      <div className="mb-3 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Найти локацию, квест или добычу…"
            className="w-full sm:w-80"
          />
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-muted/45">
            <span className="h-px w-6 bg-line" />
            найдено {filtered.length} из {MAP_POINTS.length}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chips options={regionOptions} value={region} onChange={setRegion} label="Регион" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chips options={DANGER_OPTIONS} value={danger} onChange={setDanger} label="Опасность" />
          <span className="mx-1 hidden h-4 w-px bg-line/70 sm:block" />
          <Chips options={SCOPE_OPTIONS} value={scope} onChange={setScope} label="Статус" />
          <button
            onClick={() => setShowRoutes((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-[2px] border px-2.5 py-1.5 text-[11px] transition ${
              showRoutes
                ? "border-frost/35 bg-frost/[0.08] text-frost"
                : "border-line bg-white/[0.015] text-muted hover:border-frost/30 hover:text-parchment"
            }`}
          >
            <Compass className="h-3.5 w-3.5" /> Маршруты
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0">
          <div
            ref={shellRef}
            className={`relative overflow-hidden border border-line/90 bg-[#150e08] ${
              fullscreen ? "flex h-full w-full flex-col bg-[#0d0805]" : ""
            }`}
          >
            <div className={`relative w-full ${fullscreen ? "min-h-0 flex-1" : "aspect-[1000/886] max-h-[76vh]"}`}>
              <svg
                ref={svgRef}
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className={`block h-full w-full select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                role="application"
                aria-label="Интерактивная карта острова Ноэр"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
                onDoubleClick={onDoubleClick}
                onPointerLeave={() => setHover(null)}
                style={{ touchAction: "none" }}
              >
                <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
                  <WorldArt showRoutes={showRoutes} k={view.k} />

                  {/* маршруты поверх суши уже в WorldArt; метки — здесь */}
                  <g>
                    {clusters.map((cluster) => {
                      const single = cluster.items.length === 1;
                      const point = single ? cluster.items[0] : null;
                      const loc = point?.loc;
                      const isSelected = Boolean(loc && selectedId === loc.id);
                      const isVisited = Boolean(loc && visited.has(loc.id));
                      const color = loc ? DANGER_FILL[loc.danger] : "#d8b56b";
                      const title = clusterTitle(cluster);
                      const sub = single && loc ? `${loc.coords ?? ""} · ${DANGER_LABEL[loc.danger]}` : `${cluster.items.length} локаций рядом`;

                      const showLabel =
                        !single ||
                        isSelected ||
                        view.k >= 2.05 ||
                        Boolean(loc && MAJOR.has(loc.id));

                      return (
                        <g
                          key={single ? point!.loc.id : `cluster-${cluster.x.toFixed(1)}-${cluster.y.toFixed(1)}`}
                          data-marker="1"
                          transform={`translate(${cluster.x.toFixed(2)} ${cluster.y.toFixed(2)}) scale(${(1 / view.k).toFixed(4)})`}
                          className="cursor-pointer outline-none"
                          role="button"
                          tabIndex={0}
                          aria-label={single ? `${loc!.ru}, ${loc!.region}, ${loc!.coords}` : `${title}, ${cluster.items.length} локаций`}
                          onPointerEnter={(event) => {
                            if (dragging) return;
                            event.stopPropagation();
                            setHover({ x: cluster.x, y: cluster.y, title, sub });
                          }}
                          onPointerLeave={() => setHover(null)}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (movedRef.current) return;
                            if (single) {
                              setSelectedId(point!.loc.id);
                            } else {
                              const xs = cluster.items.map((p) => p.x);
                              const ys = cluster.items.map((p) => p.y);
                              const w = Math.max(...xs) - Math.min(...xs);
                              const h = Math.max(...ys) - Math.min(...ys);
                              const k = Math.min(6, Math.max(2.6, 0.82 * Math.min(MAP_W / (w + 220), MAP_H / (h + 220))));
                              const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
                              const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
                              animateTo({ k, x: MAP_W / 2 - cx * k, y: MAP_H / 2 - cy * k });
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.key !== "Enter" && event.key !== " ") return;
                            event.preventDefault();
                            if (single) setSelectedId(point!.loc.id);
                            else focusPoint(cluster, 3);
                          }}
                        >
                          {single ? (
                            <>
                              {isVisited && (
                                <circle r="9" fill="none" stroke="#3f6b3c" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.95" />
                              )}
                              {isSelected && (
                                <>
                                  <circle r="13" fill="none" stroke="#7a5a22" strokeWidth="0.7" strokeOpacity="0.5" />
                                  <circle r="10" fill="none" stroke="#7a5a22" strokeWidth="1.3" />
                                </>
                              )}
                              <circle r="6" fill="#f7edd4" stroke="#2a1b10" strokeWidth="1.5" />
                              <circle r="2.2" fill={color} stroke="#2a1b10" strokeWidth="0.4" />
                              <circle r="14" fill="transparent" />
                            </>
                          ) : (
                            <>
                              <circle r="13" fill="#241811" fillOpacity="0.94" stroke="#f3e6c8" strokeWidth="1.1" />
                              <circle r="13" fill={color} fillOpacity="0.22" />
                              <circle r="9.4" fill="none" stroke={color} strokeWidth="0.7" strokeOpacity="0.7" />
                              <text y="3.4" textAnchor="middle" fontSize="9.5" fill="#f5ead2" fontWeight="600">
                                {cluster.items.length}
                              </text>
                              <circle r="16" fill="transparent" />
                            </>
                          )}

                          {showLabel && (
                            <text
                              y={single ? -13 : 27}
                              textAnchor="middle"
                              fontSize="9.2"
                              letterSpacing="0.5"
                              fill={isSelected ? "#1d1208" : "#33220f"}
                              fillOpacity={isSelected ? 1 : 0.92}
                              stroke="#f7edd4"
                              strokeOpacity="0.9"
                              strokeWidth="3"
                              paintOrder="stroke"
                              pointerEvents="none"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {title}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </g>

                {/* подсказка в экранных координатах */}
                {hover && !dragging && (
                  <g pointerEvents="none">
                    {(() => {
                      const width = Math.min(270, Math.max(96, hover.title.length * 6 + 26));
                      const x = Math.max(8, Math.min(MAP_W - width - 8, hover.x * view.k + view.x - width / 2));
                      const y = Math.max(8, hover.y * view.k + view.y - 42);
                      return (
                        <g transform={`translate(${x} ${y})`}>
                          <rect width={width} height={31} rx="2" fill="#f6ecd3" fillOpacity="0.97" stroke="#3a2a18" strokeOpacity="0.7" />
                          <text x={width / 2} y="12.5" textAnchor="middle" fontSize="8.6" fill="#241708">
                            {hover.title}
                          </text>
                          <text x={width / 2} y="24" textAnchor="middle" fontSize="7.4" fill="#6a543c">
                            {hover.sub}
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                )}
              </svg>

              {/* управление */}
              <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
                <MapButton label="Приблизить" onClick={() => zoomCenter(1.45)}>
                  <ZoomIn className="h-4 w-4" />
                </MapButton>
                <MapButton label="Отдалить" onClick={() => zoomCenter(1 / 1.45)}>
                  <ZoomOut className="h-4 w-4" />
                </MapButton>
                <MapButton label="Сбросить вид" onClick={() => animateTo({ x: 0, y: 0, k: 1 })}>
                  <RotateCcw className="h-4 w-4" />
                </MapButton>
                <MapButton label={fullscreen ? "Выйти из полноэкранного режима" : "Во весь экран"} onClick={toggleFullscreen}>
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </MapButton>
              </div>

              {/* масштаб */}
              <div className="pointer-events-none absolute bottom-2.5 right-2.5 flex items-center gap-2 border border-line/60 bg-void/70 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-muted/60 backdrop-blur-sm">
                <Crosshair className="h-3 w-3 text-gold/60" />
                {view.k.toFixed(1)}×
              </div>
            </div>

            {/* нижняя панель карты */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line/70 bg-panel/40 px-3 py-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[8.5px] uppercase tracking-[0.2em] text-muted/45">Опасность</span>
                {[1, 2, 3, 4, 5].map((value) => (
                  <span key={value} className="inline-flex items-center gap-1 text-[10px] text-muted/70">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: DANGER_FILL[value] }} />
                    {value}
                  </span>
                ))}
                <span className="hidden items-center gap-1 text-[10px] text-muted/60 sm:inline-flex">
                  <span className="h-2 w-2 rounded-full border border-dashed border-moss" /> посещено
                </span>
              </div>
              <span className="text-[9px] text-muted/40">
                колесо — зум · перетаскивание — панорама · двойной клик — приблизить
              </span>
            </div>
          </div>

          <p className="mt-2 text-[10.5px] leading-relaxed text-muted/40">
            Основа — официальная карта мира из LonaRPG (дамп игровых тайлов). Тонирование, подписи, маршруты и метки — LonaWIKI.
            Фанатский проект: права на исходную карту принадлежат Eccma417.
          </p>

          {/* точка привязки для deep-link /map#id */}
          {selected && <span id={`loc-${selected.loc.id}`} className="block h-0 scroll-mt-24" aria-hidden="true" />}
        </div>

        {/* панель */}
        <aside className="min-w-0">
          <div className="border border-line/90 bg-panel/35">
            {selected ? (
              <LocationPanel
                point={selected}
                visited={selectedVisited}
                onBack={() => setSelectedId(null)}
                onMark={() => toggle("locations", selected.loc.id)}
              />
            ) : (
              <div className="flex max-h-[560px] flex-col xl:max-h-[calc(76vh+52px)]">
                <div className="flex items-center justify-between border-b border-line/70 px-3.5 py-2.5">
                  <span className="text-[9px] uppercase tracking-[0.22em] text-ember/80">На карте</span>
                  <span className="text-[10px] tabular-nums text-muted/50">
                    {filtered.length} / {MAP_POINTS.length}
                  </span>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-muted/70">Под фильтры ничего не подошло.</p>
                  ) : (
                    filtered
                      .slice()
                      .sort((a, b) => a.loc.region.localeCompare(b.loc.region, "ru") || a.loc.ru.localeCompare(b.loc.ru, "ru"))
                      .map((point) => (
                        <button
                          key={point.loc.id}
                          onClick={() => focusLocation(point.loc.id)}
                          className="group flex w-full items-center gap-2.5 border-b border-line/40 px-3.5 py-2 text-left transition hover:bg-white/[0.035]"
                        >
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: DANGER_FILL[point.loc.danger] }} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12.5px] text-parchment/90 group-hover:text-parchment">{point.loc.ru}</span>
                            <span className="block truncate text-[10px] text-muted/50">
                              {point.loc.region} · {point.loc.coords}
                            </span>
                          </span>
                          {visited.has(point.loc.id) ? (
                            <Check className="h-3.5 w-3.5 shrink-0 text-moss" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted/25 group-hover:text-ember/60" />
                          )}
                        </button>
                      ))
                  )}
                </div>
                <div className="border-t border-line/70 px-3.5 py-2 text-[10px] leading-relaxed text-muted/45">
                  Нажмите на строку или метку, чтобы открыть описание, лут и советы.
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <InfoCard title="Как читать карту" icon={<Compass className="h-3.5 w-3.5" />}>
          Пунктирное кольцо — посещённая локация. Тёмный кружок с числом — скопление меток: щёлкните, чтобы приблизиться.
        </InfoCard>
        <InfoCard title="Координаты" icon={<Crosshair className="h-3.5 w-3.5" />}>
          Каждая метка выведена из игровых X/Y. Их можно вводить в игре через карту или искать в разделе локаций.
        </InfoCard>
        <InfoCard title="Свой прогресс" icon={<Sparkles className="h-3.5 w-3.5" />}>
          Отметки хранятся только в этом браузере. Экспорт и импорт — на странице трекера.
        </InfoCard>
      </div>
    </div>
  );
}

function MapButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center border border-line/80 bg-void/80 text-muted/75 backdrop-blur-sm transition hover:border-gold/45 hover:text-gold"
    >
      {children}
    </button>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border border-line/70 bg-white/[0.012] px-4 py-3">
      <div className="mb-1.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-ember/80">
        {icon}
        {title}
      </div>
      <p className="text-[11.5px] leading-relaxed text-muted/65">{children}</p>
    </div>
  );
}

function LocationPanel({
  point,
  visited,
  onBack,
  onMark,
}: {
  point: MapPoint;
  visited: boolean;
  onBack: () => void;
  onMark: () => void;
}) {
  const loc = point.loc;
  const color = DANGER_FILL[loc.danger];

  return (
    <div className="max-h-[560px] overflow-y-auto xl:max-h-[calc(76vh+52px)]">
      <div className="flex items-center justify-between border-b border-line/70 px-3 py-2">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[0.16em] text-muted/60 transition hover:text-parchment">
          <ChevronLeft className="h-3 w-3" /> к списку
        </button>
        <span className="font-mono text-[9.5px] tracking-wider text-muted/45">{loc.coords}</span>
      </div>

      <div className="px-4 pb-4 pt-3.5">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} />
          <span className="text-[9px] uppercase tracking-[0.18em] text-muted/55">{loc.region}</span>
        </div>
        <h2 className="font-display text-[1.45rem] leading-tight text-parchment">{loc.ru}</h2>
        <p className="mt-0.5 text-[10.5px] italic tracking-wide text-muted/45">{loc.name}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 border border-line/70 px-2 py-1 text-[9.5px] text-muted/70">
            <Skull className="h-3 w-3" style={{ color }} />
            {DANGER_LABEL[loc.danger]}
            <DangerDots value={loc.danger} />
          </span>
          <button
            onClick={onMark}
            className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[9.5px] uppercase tracking-[0.1em] transition ${
              visited
                ? "border-moss/45 bg-moss/[0.1] text-moss"
                : "border-line/80 text-muted/65 hover:border-moss/35 hover:text-parchment"
            }`}
          >
            <Check className="h-3 w-3" /> {visited ? "посещено" : "отметить"}
          </button>
        </div>

        <p className="mt-3.5 text-[12.5px] leading-relaxed text-parchment/80">{loc.summary}</p>

        {loc.points.length > 0 && (
          <section className="mt-4">
            <PanelHead icon={<MapPin className="h-3 w-3" />} text="Точки интереса" />
            <ul className="mt-1.5 grid gap-1">
              {loc.points.map((p) => (
                <li key={p} className="flex gap-2 text-[11.5px] leading-snug text-muted/80">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-ember/60" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}

        {loc.quests.length > 0 && (
          <section className="mt-4">
            <PanelHead icon={<ScrollText className="h-3 w-3" />} text="Связанные квесты" />
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {loc.quests.map((q) => (
                <span key={q} className="border border-gold/25 bg-gold/[0.05] px-1.5 py-0.5 text-[10px] text-gold/85">
                  {q}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-4">
          <PanelHead icon={<Sparkles className="h-3 w-3" />} text="Добыча" />
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted/75">{loc.loot}</p>
        </section>

        <section className="mt-3 border-l-2 border-ember/40 bg-ember/[0.035] px-3 py-2">
          <div className="mb-1 text-[8.5px] uppercase tracking-[0.2em] text-ember/75">Совет</div>
          <p className="text-[11.5px] leading-relaxed text-parchment/70">{loc.tips}</p>
        </section>

        <a
          href={href("locations", loc.id)}
          className="mt-4 inline-flex w-full items-center justify-between border border-line px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-muted/70 transition hover:border-ember/40 hover:text-parchment"
        >
          Полное описание в локациях
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function PanelHead({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <h3 className="flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.2em] text-muted/45">
      <span className="text-ember/70">{icon}</span>
      {text}
    </h3>
  );
}
