# -*- coding: utf-8 -*-
"""Готовит растровую основу карты для вики из официальной мировой карты игры.

Источник: world.png (дамп игровых тайлов 5440x4800, 32 px/тайл).
Результат: public/map/world-3360.webp + public/map/world-960.webp + LQIP.
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

# Палитра референса (in-game карта): море #937859, суша #b19c6a…#cdc089.
SEA_RGB = np.array([127, 89, 75], dtype=np.float32)
SEA_TARGET = np.array([146, 118, 86], dtype=np.float32)


def sea_mask(rgb: np.ndarray) -> np.ndarray:
    dist = np.abs(rgb - SEA_RGB).sum(axis=2)
    mask = dist < 24
    mask = ndi.binary_closing(mask, np.ones((5, 5)))
    labels, n = ndi.label(mask)
    if n == 0:
        return mask
    sizes = ndi.sum(mask, labels, range(1, n + 1))
    border = np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
    keep = set(int(v) for v in np.unique(border) if v)
    out = np.isin(labels, list(keep)) if keep else labels == (int(np.argmax(sizes)) + 1)
    # мягкая кромка: сглаживаем маску, чтобы не было зубцов на берегу
    soft = ndi.gaussian_filter(out.astype(np.float32), 3.0)
    return np.clip(soft, 0, 1)


def grade(rgb: np.ndarray, sea: np.ndarray) -> np.ndarray:
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
    # 5. бумажное зерно: крупные пятна + мелкая крупа
    h, w = x.shape[:2]
    rng = np.random.default_rng(41)
    blotch = ndi.gaussian_filter(rng.normal(0, 1, (h // 8, w // 8)).astype(np.float32), 3).copy()
    blotch = np.array(Image.fromarray(blotch).resize((w, h), Image.BICUBIC), dtype=np.float32)
    blotch /= max(1e-6, np.abs(blotch).max())
    grain = ndi.gaussian_filter(rng.normal(0, 1, (h, w)).astype(np.float32), 0.6).copy()
    grain /= max(1e-6, np.abs(grain).max())
    tex = 1.0 + blotch * 0.012 + grain * 0.011
    x = x * tex[..., None]
    # 6. финальная подгонка средних: море — к референсу, суша — с сохранением деталей
    m = sea > 0.5
    if m.any():
        cur = x[m].mean(axis=0)
        x = x + (SEA_TARGET / 255.0 - cur) * sea[..., None]
    land = (sea < 0.5)
    if land.any():
        x[land] *= np.array([1.017, 0.996, 0.957], dtype=np.float32)
    return np.clip(x, 0, 1)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=os.environ.get("LONA_WORLD_MAP", "world.png"))
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    src = Image.open(args.src).convert("RGB")
    print("source", src.size)

    small = np.asarray(src.resize((680, 600), Image.BOX)).astype(np.float32)
    sea_small = sea_mask(small)
    print("sea share", round(float(sea_small.mean()), 3))

    # Полное разрешение: обрабатываем блоками, чтобы не держать гигабайты в памяти.
    w, h = 3360, 2965  # сохраняем пропорции 5440x4800 -> 1.1333
    h = int(round(w * src.height / src.width))
    out = np.zeros((h, w, 3), dtype=np.float32)
    full_sea = np.asarray(
        Image.fromarray((sea_mask(np.asarray(src.resize((1360, 1200), Image.BOX)).astype(np.float32)) * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)
    ).astype(np.float32) / 255.0
    full_sea = np.clip(full_sea * 1.04, 0, 1)

    img = src.resize((w, h), Image.LANCZOS)
    arr = np.asarray(img).astype(np.float32)
    out = grade(arr, full_sea)

    # лёгкое усиление локального контраста на суше (сохраняет детали тайлов)
    land = (1 - full_sea)[..., None]
    blur = np.asarray(Image.fromarray((out * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255.0
    out = out + (out - blur) * 0.35 * land
    out = np.clip(out, 0, 1)

    im = Image.fromarray((out * 255 + 0.5).astype(np.uint8))
    for width, quality, name in ((w, 72, "world-3360.webp"), (960, 72, "world-960.webp")):
        target = im if width == w else im.resize((width, int(round(width * h / w))), Image.LANCZOS)
        path = os.path.join(OUT_DIR, name)
        target.save(path, "WEBP", quality=quality, method=6)
        print(name, os.path.getsize(path) // 1024, "KB", target.size)

    # LQIP 40x35 для мгновенной подложки
    lq = im.resize((40, int(round(40 * h / w))), Image.LANCZOS)
    buf = io.BytesIO()
    lq.save(buf, "WEBP", quality=45)
    data = base64.b64encode(buf.getvalue()).decode("ascii")
    with open(os.path.join(OUT_DIR, "lqip.txt"), "w", encoding="ascii") as fh:
        fh.write(data)
    print("lqip", len(data), "chars")

    # контрольные средние
    a = np.asarray(im.resize((340, 300), Image.BOX)).astype(np.float32)
    m = sea_mask(np.asarray(src.resize((340, 300), Image.BOX)).astype(np.float32)) > 0.5
    print("seed mean sea", a[m].mean(axis=0).round(1), "land", a[~m].mean(axis=0).round(1))

    im.resize((900, int(round(900 * h / w))), Image.LANCZOS).save(os.path.join(OUT_DIR, "preview.png"), "PNG")


if __name__ == "__main__":
    main()
