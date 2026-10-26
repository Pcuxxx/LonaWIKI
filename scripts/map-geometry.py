from PIL import Image
import numpy as np
from scipy import ndimage as ndi
from skimage import measure
import json, re, math, random, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("LONA_WORLD_MAP", os.path.join(ROOT, "world.png"))
OUT = os.path.join(ROOT, "src", "data", "map-geometry.ts")
LOC = os.path.join(ROOT, "src", "data", "locations.ts")
W, H = 1360, 1200

im = Image.open(SRC).convert("RGB").resize((W, H), Image.LANCZOS)
a = np.asarray(im).astype(np.float32) / 255.0
mx = a.max(axis=2)
mn = a.min(axis=2)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
d = np.maximum(mx - mn, 1e-6)
hue = np.zeros_like(mx)
m = mx == r
hue[m] = ((g[m] - b[m]) / d[m]) % 6
m = (mx == g) & (mx != r)
hue[m] = ((b[m] - r[m]) / d[m]) + 2
m = (mx == b) & (mx != r) & (mx != g)
hue[m] = ((r[m] - g[m]) / d[m]) + 4
hue *= 60
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)

land = (hue > 23.5) & (sat > 0.14) & (mx > 0.2)
land = ndi.median_filter(land, size=11)
land = ndi.binary_closing(land, np.ones((25, 25)))
land = ndi.binary_opening(land, np.ones((9, 9)))
land = ndi.binary_fill_holes(land)
lab, n = ndi.label(land)
sizes = ndi.sum(land, lab, range(1, n + 1))
keep = np.zeros_like(land)
for i, s in enumerate(sizes, 1):
    if s > 2500:
        keep |= lab == i
land = keep

contours = measure.find_contours(land.astype(float), 0.5)
polys = []
for c in contours:
    if len(c) < 40:
        continue
    ap = measure.approximate_polygon(c, tolerance=2.4)
    ys = ap[:, 0] * (886 / H)
    xs = ap[:, 1] * (1000 / W)
    area = 0.5 * abs(np.dot(xs[:-1], ys[1:]) - np.dot(xs[1:], ys[:-1]))
    if area < 500:
        continue
    pts = list(zip(xs, ys))
    for _ in range(2):
        out = []
        for i in range(len(pts)):
            p0 = pts[i]
            p1 = pts[(i + 1) % len(pts)]
            out.append((0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]))
            out.append((0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]))
        pts = out
    polys.append({"area": float(area), "pts": [(round(x, 1), round(y, 1)) for x, y in pts]})
polys.sort(key=lambda p: -p["area"])

AX, BX0 = 4.958665651668512, 2.6182022007927364
AY, BY0 = 4.97511313484921, 3.71748378695201
KX, KY = 1000 / 843, 886 / 747

def proj(X, Y):
    return ((AX * X + BX0) * KX, (AY * Y + BY0) * KY)

# все локации — чтобы не ставить декор прямо на метку
text = open(LOC, encoding="utf-8").read()
loc_pts = []
for m in re.finditer(r'id: "([^"]+)",[\s\S]{0,400}?coords: "X(\d+) Y(\d+)"', text):
    loc_pts.append(proj(int(m.group(2)), int(m.group(3))))
print("locations parsed", len(loc_pts))

def inside(pt, poly):
    x, y = pt
    ins = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
            ins = not ins
        j = i
    return ins

main = polys[0]["pts"]
def free(x, y, r=17):
    if not (5 < x < 995 and 5 < y < 880):
        return False
    if not inside((x, y), main):
        # острова Фиштопии — тоже суша
        for isl in polys[1:]:
            if inside((x, y), isl["pts"]):
                return True
        return False
    for lx, ly in loc_pts:
        if (lx - x) ** 2 + (ly - y) ** 2 < r * r:
            return False
    return True

random.seed(41)
terrain = []
occupied = []
def add(x, y, t, s):
    for ox, oy in occupied:
        if (ox - x) ** 2 + (oy - y) ** 2 < 9.5 * 9.5:
            return False
    occupied.append((x, y))
    terrain.append({"t": t, "x": round(x, 1), "y": round(y, 1), "s": round(s, 2)})
    return True

forests = [
    (300, 430, 62, 40, 64),   # лес у Деревни Облаков
    (397, 300, 52, 38, 46),   # Пиковый лес
    (225, 350, 60, 46, 52),   # северные леса
    (545, 500, 60, 42, 40),   # восточные леса
    (420, 560, 48, 30, 26),   # лес у Восхода
    (700, 640, 68, 50, 42),   # южные леса
    (170, 520, 38, 34, 20),   # западные заросли
    (250, 610, 40, 26, 18),   # рощи у Ноэра
    (500, 640, 48, 34, 26),   # юго-восточные заросли
    (610, 260, 34, 26, 18),   # лес у побережья
]
for cx, cy, rx, ry, count in forests:
    made = 0
    for _ in range(count * 16):
        if made >= count:
            break
        ang = random.random() * math.tau
        rad = math.sqrt(random.random())
        x = cx + math.cos(ang) * rx * rad
        y = cy + math.sin(ang) * ry * rad
        if free(x, y, 17) and add(x, y, "tree", random.uniform(0.72, 1.35)):
            made += 1

ridges = [
    ([(268, 243), (312, 258), (352, 246), (395, 272), (428, 300)], 30),
    ([(150, 435), (190, 418), (232, 428), (270, 445)], 18),
    ([(600, 175), (640, 188), (674, 212)], 14),
    ([(686, 706), (726, 684), (766, 716)], 14),
    ([(438, 508), (456, 498), (474, 512)], 9),
    ([(486, 218), (520, 240), (548, 262)], 14),
    ([(560, 640), (600, 670), (648, 690)], 16),
]
for pts, count in ridges:
    segs = []
    total = 0
    for i in range(len(pts) - 1):
        d = math.dist(pts[i], pts[i + 1])
        segs.append((pts[i], pts[i + 1], d))
        total += d
    for k in range(count):
        t = (k + 0.5) / count * total
        for (x0, y0), (x1, y1), d in segs:
            if t <= d:
                x = x0 + (x1 - x0) * t / d + random.uniform(-9, 9)
                y = y0 + (y1 - y0) * t / d + random.uniform(-9, 9)
                if free(x, y, 15):
                    add(x, y, "mountain", random.uniform(0.8, 1.45))
                break
            t -= d

# болота
for _ in range(40):
    x = random.uniform(575, 705)
    y = random.uniform(495, 600)
    if free(x, y, 14):
        add(x, y, "swamp", random.uniform(0.7, 1.2))

# холмы и фермы у Ноэра
for _ in range(34):
    x = random.uniform(155, 300)
    y = random.uniform(575, 675)
    if free(x, y, 13):
        add(x, y, "hill", random.uniform(0.7, 1.15))

print("terrain", len(terrain), {t: sum(1 for x in terrain if x["t"] == t) for t in ["tree", "mountain", "swamp", "hill"]})

def path_d(pts):
    return "M" + " ".join(f"{x},{y}" for x, y in pts) + "Z"

land_d = path_d(main)
islands = [path_d(p["pts"]) for p in polys[1:6]]
terrain_ts = ",\n  ".join(
    f'{{ t: "{t["t"]}", x: {t["x"]}, y: {t["y"]}, s: {t["s"]} }}' for t in terrain
)

ts = f'''// Автогенерировано из официальной мировой карты LonaRPG (scripts/map-geometry.py).
// Координаты меток выводятся из игровых X/Y через аффинную проекцию маркеров вики.
export const MAP_W = 1000;
export const MAP_H = 886;

export const PROJECT = {{
  ax: {AX},
  bx: {BX0},
  ay: {AY},
  by: {BY0},
  kx: {KX},
  ky: {KY},
}} as const;

export function project(x: number, y: number): {{ x: number; y: number }} {{
  return {{
    x: (PROJECT.ax * x + PROJECT.bx) * PROJECT.kx,
    y: (PROJECT.ay * y + PROJECT.by) * PROJECT.ky,
  }};
}}

export const LAND_PATH =
  "{land_d}";

export const ISLAND_PATHS: string[] = [
  "{islands[0] if len(islands) > 0 else ''}",
  "{islands[1] if len(islands) > 1 else ''}",
];

export type TerrainKind = "tree" | "mountain" | "hill" | "swamp";
export interface TerrainMark {{
  t: TerrainKind;
  x: number;
  y: number;
  s: number;
}}

export const TERRAIN: TerrainMark[] = [
  {terrain_ts},
];
'''
open(OUT, "w", encoding="utf-8").write(ts)
print("wrote", OUT, len(ts), "bytes")
