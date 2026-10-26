# -*- coding: utf-8 -*-
"""Готовит растровую основу карты для вики из официальной мировой карты игры.

Источник: world.png (дамп игровых тайлов 5440x4800, 32 px/тайл).
Результат:
  public/map/world-1600.webp      — обзорный слой для всего острова;
  public/map/tiles/{tx}_{ty}.webp — тайлы 512 px в полном разрешении;
  public/map/lqip.txt             — крошечная подложка на первый кадр.

Тайлы обрабатываются по одному, поэтому скрипт не держит в памяти
полноразмерные float-массивы и работает на машинах с 8 ГБ RAM.
Запуск: python scripts/map-base.py --src <путь к world.png>
Без --src путь берётся из переменной окружения LONA_WORLD_MAP (или ./world.png).
"""
from __future__ import annotations

import argparse
import base64
import io
import os

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "map")
TILE_DIR = os.path.join(OUT_DIR, "tiles")

# Палитра референса (in-game карта): море #937859, суша #b19c6a…#cdc089.
SEA_RGB = np.array([127, 89, 75], dtype=np.float32)
SEA_TARGET = np.array([146, 118, 86], dtype=np.float32)

TILE = 512
PREVIEW_W = 1600
MASK_W, MASK_H = 1360, 1200
PAD = 12


def sea_mask(rgb: np.ndarray) -> np.ndarray:
    """Мягкая маска моря по цвету эталонного дампа."""
    dist = np.abs(rgb - SEA_RGB).sum(axis=2)
    mask = dist < 24
    mask = ndi.binary_closing(mask, np.ones((5, 5)))
    labels, n = ndi.label(mask)
    if n == 0:
        return mask.astype(np.float32)
    sizes = ndi.sum(mask, labels, range(1, n + 1))
    border = np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
    keep = set(int(v) for v in np.unique(border) if v)
    out = np.isin(labels, list(keep)) if keep else labels == (int(np.argmax(sizes)) + 1)
    soft = ndi.gaussian_filter(out.astype(np.float32), 3.0)
    return np.clip(soft, 0, 1)


def make_texture() -> np.ndarray:
    """Общая на весь атлас бумажная фактура (1/4 разрешения).

    Берётся из одного массива для всех тайлов, поэтому на стыках нет швов.
    """
    rng = np.random.default_rng(41)
    blotch = ndi.gaussian_filter(rng.normal(0, 1, (MASK_H // 8, MASK_W // 8)).astype(np.float32), 3).copy()
    blotch = np.array(Image.fromarray(blotch).resize((MASK_W, MASK_H), Image.BICUBIC), dtype=np.float32)
    blotch /= max(1e-6, float(np.abs(blotch).max()))
    grain = ndi.gaussian_filter(rng.normal(0, 1, (MASK_H, MASK_W)).astype(np.float32), 0.7).copy()
    grain /= max(1e-6, float(np.abs(grain).max()))
    return 1.0 + blotch * 0.012 + grain * 0.011


def grade_core(rgb: np.ndarray, sea: np.ndarray, tex: np.ndarray) -> np.ndarray:
    """Тонирование под пергамент. Все операции попиксельные — швов не дают."""
    x = rgb / 255.0
    # 1. общий подъём яркости и тёплый сдвиг
    x = np.power(np.clip(x, 0, 1), 0.84)
    x *= np.array([1.035, 1.075, 0.95], dtype=np.float32)
    lum = x @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    # 2. лёгкая десатурация — ближе к бумаге
    x = lum[..., None] + (x - lum[..., None]) * 0.88
    # 3. контраст вокруг середины
    x = (x - 0.44) * 1.12 + 0.505
    # 4. море: спокойнее и чуть темнее суши
    sea_rgb = 0.62 * x + 0.38 * (SEA_TARGET / 255.0)
    sea_rgb = sea_rgb * np.array([1.0, 0.99, 0.96], dtype=np.float32)
    x = x * (1 - sea[..., None]) + sea_rgb * sea[..., None]
    # 5. бумажное зерно
    return np.clip(x * tex[..., None], 0, 1)


def grade(rgb: np.ndarray, sea: np.ndarray, tex: np.ndarray, offset: np.ndarray) -> np.ndarray:
    """Тонирование + подгонка среднего моря (offset общий для всего атласа)."""
    x = grade_core(rgb, sea, tex)
    x = x + offset * sea[..., None]
    land = sea < 0.5
    if land.any():
        x[land] *= np.array([1.017, 0.996, 0.957], dtype=np.float32)
    return np.clip(x, 0, 1)


def finish_contrast(out: np.ndarray, sea: np.ndarray) -> np.ndarray:
    """Лёгкое локальное усиление контраста на суше (сохраняет детали тайлов)."""
    u8 = (out * 255 + 0.5).astype(np.uint8)
    blur = np.asarray(Image.fromarray(u8).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255.0
    land = (1 - sea)[..., None]
    return np.clip(out + (out - blur) * 0.35 * land, 0, 1)


def save_webp(image: Image.Image, path: str, quality: int) -> None:
    image.save(path, "WEBP", quality=quality, method=6)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=os.environ.get("LONA_WORLD_MAP", "world.png"))
    args = ap.parse_args()

    os.makedirs(TILE_DIR, exist_ok=True)
    src = Image.open(args.src).convert("RGB")
    sw, sh = src.size
    print("source", src.size)

    # Маска моря и фактура — общие для всех тайлов и превью.
    mask_small = sea_mask(np.asarray(src.resize((MASK_W, MASK_H), Image.BOX)).astype(np.float32))
    texture = make_texture()
    print("sea share", round(float((mask_small > 0.5).mean()), 3))

    # Средний цвет моря считаем на уменьшенной копии — константа для всех тайлов.
    probe_rgb = np.asarray(src.resize((680, 600), Image.BOX)).astype(np.float32)
    probe_sea = np.asarray(
        Image.fromarray((mask_small * 255).astype(np.uint8)).resize((680, 600), Image.BILINEAR)
    ).astype(np.float32) / 255.0
    probe_tex = np.asarray(Image.fromarray(texture, mode="F").resize((680, 600), Image.BILINEAR))
    probe_out = grade_core(probe_rgb, probe_sea, probe_tex)
    m = probe_sea > 0.5
    offset = SEA_TARGET / 255.0 - probe_out[m].mean(axis=0) if m.any() else np.zeros(3, dtype=np.float32)
    print("sea offset", offset.round(4))

    # --- обзорный слой -------------------------------------------------
    pw = PREVIEW_W
    ph = int(round(pw * sh / sw))
    preview = np.asarray(src.resize((pw, ph), Image.LANCZOS)).astype(np.float32)
    preview_sea = np.asarray(
        Image.fromarray((mask_small * 255).astype(np.uint8)).resize((pw, ph), Image.BILINEAR)
    ).astype(np.float32) / 255.0
    preview_tex = np.asarray(Image.fromarray(texture, mode="F").resize((pw, ph), Image.BILINEAR))
    preview_out = finish_contrast(grade(preview, preview_sea, preview_tex, offset), preview_sea)
    preview_im = Image.fromarray((preview_out * 255 + 0.5).astype(np.uint8))
    save_webp(preview_im, os.path.join(OUT_DIR, "world-1600.webp"), 74)
    print("world-1600.webp", os.path.getsize(os.path.join(OUT_DIR, "world-1600.webp")) // 1024, "KB", preview_im.size)

    # LQIP 40 px для мгновенной подложки
    lq = preview_im.resize((40, int(round(40 * ph / pw))), Image.LANCZOS)
    buf = io.BytesIO()
    lq.save(buf, "WEBP", quality=45)
    with open(os.path.join(OUT_DIR, "lqip.txt"), "w", encoding="ascii") as fh:
        fh.write(base64.b64encode(buf.getvalue()).decode("ascii"))

    # --- полноразмерные тайлы -----------------------------------------
    cols = (sw + TILE - 1) // TILE
    rows = (sh + TILE - 1) // TILE
    total = 0
    for ty in range(rows):
        for tx in range(cols):
            x0 = tx * TILE
            y0 = ty * TILE
            x1 = min(sw, x0 + TILE)
            y1 = min(sh, y0 + TILE)

            # Запас по краям нужен только для локального контраста.
            px0 = max(0, x0 - PAD)
            py0 = max(0, y0 - PAD)
            px1 = min(sw, x1 + PAD)
            py1 = min(sh, y1 + PAD)

            crop = src.crop((px0, py0, px1, py1))
            cw, ch = crop.size
            rgb = np.asarray(crop).astype(np.float32)

            # Маска: 1360x1200 покрывает 5440x4800 (ровно /4).
            mx0, my0 = px0 // 4, py0 // 4
            mx1, my1 = max(mx0 + 2, (px1 + 3) // 4), max(my0 + 2, (py1 + 3) // 4)
            m_img = Image.fromarray((mask_small[my0:my1, mx0:mx1] * 255).astype(np.uint8))
            sea = np.asarray(m_img.resize((cw, ch), Image.BILINEAR)).astype(np.float32) / 255.0

            tx0, ty0 = px0 // 4, py0 // 4
            tx1 = max(tx0 + 2, (px1 + 3) // 4)
            ty1 = max(ty0 + 2, (py1 + 3) // 4)
            tex_img = Image.fromarray(texture[ty0:ty1, tx0:tx1], mode="F")
            tex = np.asarray(tex_img.resize((cw, ch), Image.BILINEAR), dtype=np.float32)

            out = finish_contrast(grade(rgb, sea, tex, offset), sea)
            ox0, oy0 = x0 - px0, y0 - py0
            tile = out[oy0 : oy0 + (y1 - y0), ox0 : ox0 + (x1 - x0)]
            im = Image.fromarray((tile * 255 + 0.5).astype(np.uint8))
            path = os.path.join(TILE_DIR, f"{tx}_{ty}.webp")
            save_webp(im, path, 76)
            total += os.path.getsize(path)
        print(f"tiles row {ty + 1}/{rows}")

    print("tiles", cols, "x", rows, "=", cols * rows, "files,", total // 1024, "KB")
    print("lqip", os.path.getsize(os.path.join(OUT_DIR, "lqip.txt")), "chars")


if __name__ == "__main__":
    main()
