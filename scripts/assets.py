#!/usr/bin/env python3
"""Генерирует иконки PWA и OG-картинку из контура официальной карты.

Запуск из корня репозитория:
    python scripts/assets.py

Требуется Pillow. Скрипт детерминирован: один и тот же результат при
повторном запуске, если не менялись LAND_PATH и шрифты.
"""
from __future__ import annotations

import math
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
ICONS = PUBLIC / "icons"
ICONS.mkdir(parents=True, exist_ok=True)

VOID = (7, 6, 10)
ABYSS = (11, 10, 15)
GOLD = (216, 181, 107)
GOLD_DIM = (150, 124, 70)
EMBER = (200, 121, 65)
PARCHMENT = (236, 228, 212)
MUTED = (169, 157, 138)
SEA = (12, 20, 24)
LAND = (26, 27, 22)

FONT_DISPLAY = "C:/Windows/Fonts/georgiab.ttf"
FONT_DISPLAY_REG = "C:/Windows/Fonts/georgia.ttf"
FONT_BODY = "C:/Windows/Fonts/segoeui.ttf"
FONT_BODY_SEMI = "C:/Windows/Fonts/seguisb.ttf"
FONT_BODY_BOLD = "C:/Windows/Fonts/segoeuib.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def tracked(draw: ImageDraw.ImageDraw, xy, text, fnt, fill, spacing=0, anchor=None):
    """Рисует текст с трекингом. anchor поддерживает только 'la'."""
    x, y = xy
    if not spacing:
        draw.text((x, y), text, font=fnt, fill=fill, anchor=anchor)
        return
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + spacing


def parse_land() -> list[tuple[float, float]]:
    source = (ROOT / "src" / "data" / "map-geometry.ts").read_text(encoding="utf-8")
    match = re.search(r'export const LAND_PATH =\s*"([^"]+)"', source)
    if not match:
        raise SystemExit("LAND_PATH not found in src/data/map-geometry.ts")
    path = match.group(1)
    nums = re.findall(r"-?\d+(?:\.\d+)?", path)
    pairs = [(float(nums[i]), float(nums[i + 1])) for i in range(0, len(nums) - 1, 2)]
    return pairs


def fit_points(points, box):
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    x0, y0, x1, y1 = box
    scale = min((x1 - x0) / (maxx - minx), (y1 - y0) / (maxy - miny))
    ox = x0 + ((x1 - x0) - (maxx - minx) * scale) / 2
    oy = y0 + ((y1 - y0) - (maxy - miny) * scale) / 2
    return [((x - minx) * scale + ox, (y - miny) * scale + oy) for x, y in points]


def sigil(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float, color, width=3):
    draw.polygon([(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)], outline=color, width=width)
    r2 = r * 0.72
    draw.polygon([(cx, cy - r2), (cx + r2, cy), (cx, cy + r2), (cx - r2, cy)], outline=color, width=max(1, width // 2))
    draw.line([(cx, cy - r * 0.48), (cx, cy + r * 0.46)], fill=color, width=width)
    draw.line([(cx - r * 0.22, cy - r * 0.24), (cx, cy - r * 0.48), (cx + r * 0.22, cy - r * 0.24)], fill=color, width=width)
    draw.ellipse([cx - width, cy + r * 0.36, cx + width, cy + r * 0.36], fill=color)


def radial_background(size, inner=(20, 16, 24), outer=VOID):
    w, h = size
    img = Image.new("RGB", size, outer)
    px = img.load()
    cx, cy = w * 0.32, h * 0.18
    maxd = math.hypot(max(cx, w - cx), max(cy, h - cy))
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / maxd
            t = max(0.0, 1.0 - d) ** 1.25
            px[x, y] = tuple(int(outer[i] + (inner[i] - outer[i]) * t) for i in range(3))
    return img


def make_icon(size: int, maskable: bool = False) -> Image.Image:
    ss = 4
    s = size * ss
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    bg = radial_background((s, s), inner=(30, 23, 28), outer=VOID)
    img.paste(bg, (0, 0))

    d = ImageDraw.Draw(img)
    pad = s * (0.24 if maskable else 0.13)
    # внешняя рамка
    d.rounded_rectangle([pad * 0.55, pad * 0.55, s - pad * 0.55, s - pad * 0.55], radius=s * 0.02,
                        outline=(*GOLD_DIM, 255), width=max(2, int(s * 0.0035)))
    d.rounded_rectangle([pad * 0.72, pad * 0.72, s - pad * 0.72, s - pad * 0.72], radius=s * 0.015,
                        outline=(*GOLD, 70), width=max(1, int(s * 0.0018)))

    cx = cy = s / 2
    r = s * (0.245 if maskable else 0.32)
    # мягкое свечение
    glow = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    sigil(gd, cx, cy, r, (*EMBER, 120), width=max(2, int(s * 0.008)))
    glow = glow.filter(ImageFilter.GaussianBlur(s * 0.018))
    img.alpha_composite(glow)
    # чёткий знак
    sigil(d, cx, cy, r, (*GOLD, 255), width=max(2, int(s * 0.0085)))
    sigil(d, cx, cy, r * 0.98, (*GOLD, 80), width=max(1, int(s * 0.0025)))

    # четыре засечки по сторонам
    tick = s * 0.035
    off = s * (0.43 if maskable else 0.455)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        d.line([(cx + dx * off, cy + dy * off), (cx + dx * (off + tick), cy + dy * (off + tick))],
               fill=(*GOLD, 180), width=max(1, int(s * 0.004)))

    return img.resize((size, size), Image.LANCZOS)


def make_og() -> Image.Image:
    W, H = 1200, 630
    img = radial_background((W, H), inner=(31, 24, 30), outer=VOID).convert("RGBA")

    # карта справа
    land = fit_points(parse_land(), (640, 78, 1160, 552))
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.polygon(land, fill=(*LAND, 255))
    ld.line(land + [land[0]], fill=(*GOLD, 120), width=2, joint="curve")
    glow = layer.filter(ImageFilter.GaussianBlur(9))
    img.alpha_composite(glow)
    img.alpha_composite(layer)

    # внутренний контур
    inner = [(x + (W / 2 - x) * 0.03, y + (H / 2 - y) * 0.03) for x, y in land]
    d = ImageDraw.Draw(img)
    d.line(inner + [inner[0]], fill=(*GOLD, 34), width=1)

    # затемнение под текстом
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    sd.rectangle([0, 0, 700, H], fill=(7, 6, 10, 150))
    img.alpha_composite(shade.filter(ImageFilter.GaussianBlur(60)))

    d = ImageDraw.Draw(img)
    # вертикальная линия
    d.line([(74, 108), (74, 500)], fill=(*GOLD, 90), width=2)
    d.line([(74, 108), (108, 108)], fill=(*GOLD, 160), width=2)
    d.line([(74, 500), (108, 500)], fill=(*GOLD, 160), width=2)

    tracked(d, (110, 92), "РУССКИЙ ПУТЕВОДИТЕЛЬ", font(FONT_BODY_SEMI, 19), (*EMBER, 255), spacing=3.4)

    d.text((108, 132), "LONA", font=font(FONT_DISPLAY, 108), fill=(*PARCHMENT, 255))
    d.text((108, 246), "RPG", font=font(FONT_DISPLAY, 108), fill=(*GOLD, 255))
    tracked(d, (110, 372), "АРХИВ НОЭРА", font(FONT_BODY_SEMI, 38), (*PARCHMENT, 255), spacing=7.5)

    d.text((110, 440), "Карта · квесты · снаряжение", font=font(FONT_BODY, 24), fill=(*MUTED, 255))
    d.text((110, 474), "секреты · концовки · трекер", font=font(FONT_BODY, 24), fill=(*MUTED, 255))

    d.line([(110, 530), (600, 530)], fill=(*GOLD_DIM, 80), width=1)
    d.text((110, 548), "B.0.10.8.31", font=font(FONT_BODY_SEMI, 19), fill=(*GOLD, 230))
    d.text((300, 548), "pcuxxx.github.io/LonaWIKI", font=font(FONT_BODY, 19), fill=(*MUTED, 200))

    sigil(d, 1098, 576, 26, (*GOLD, 120), width=2)

    # тонкая рамка и зерно
    d.rectangle([18, 18, W - 19, H - 19], outline=(*GOLD_DIM, 70), width=1)
    noise = Image.effect_noise((W, H), 18).convert("L").point(lambda v: int(v * 0.12))
    grain = Image.new("RGBA", (W, H), (255, 248, 230, 0))
    grain.putalpha(noise)
    img = Image.alpha_composite(img.convert("RGBA"), grain)
    return img.convert("RGB")


def main():
    make_icon(192).save(ICONS / "icon-192.png", optimize=True)
    make_icon(512).save(ICONS / "icon-512.png", optimize=True)
    make_icon(512, maskable=True).save(ICONS / "maskable-512.png", optimize=True)
    make_icon(180).save(ICONS / "apple-touch-icon.png", optimize=True)
    make_icon(32).save(ICONS / "favicon-32.png", optimize=True)
    make_og().save(PUBLIC / "og.png", optimize=True)
    print("icons + og.png written")


if __name__ == "__main__":
    main()
