#!/usr/bin/env python3
"""Strict but renderer-aware raster comparison helper.

Usage:
  python visual_diff.py reference.png candidate.png
  python visual_diff.py reference.png candidate.png --json report.json

The metrics support visual QA. They do not replace human/vision inspection.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


def load_rgba(path: Path) -> np.ndarray:
    image = Image.open(path).convert("RGBA")
    return np.asarray(image, dtype=np.float32) / 255.0


def grayscale(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722


def edge_map(gray: np.ndarray, threshold: float = 0.08) -> np.ndarray:
    dx = np.zeros_like(gray)
    dy = np.zeros_like(gray)
    dx[:, 1:] = np.abs(gray[:, 1:] - gray[:, :-1])
    dy[1:, :] = np.abs(gray[1:, :] - gray[:-1, :])
    magnitude = np.maximum(dx, dy)
    return magnitude >= threshold


def edge_iou(a: np.ndarray, b: np.ndarray) -> float:
    union = np.logical_or(a, b).sum()
    if union == 0:
        return 1.0
    intersection = np.logical_and(a, b).sum()
    return float(intersection / union)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("reference", type=Path)
    parser.add_argument("candidate", type=Path)
    parser.add_argument("--json", dest="json_path", type=Path)
    parser.add_argument("--allow-resize", action="store_true")
    args = parser.parse_args()

    ref_img = Image.open(args.reference).convert("RGBA")
    cand_img = Image.open(args.candidate).convert("RGBA")

    ref_size = ref_img.size
    cand_size = cand_img.size
    resized = False

    if ref_size != cand_size:
        if not args.allow_resize:
            report = {
                "status": "FAIL_DIMENSIONS",
                "reference_size": ref_size,
                "candidate_size": cand_size,
                "message": "Dimensions differ. Re-run with --allow-resize only when resampling is intentional."
            }
            print(json.dumps(report, indent=2))
            if args.json_path:
                args.json_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
            return 2
        cand_img = cand_img.resize(ref_size, Image.Resampling.LANCZOS)
        resized = True

    ref = np.asarray(ref_img, dtype=np.float32) / 255.0
    cand = np.asarray(cand_img, dtype=np.float32) / 255.0

    rgb_error = np.abs(ref[..., :3] - cand[..., :3])
    alpha_error = np.abs(ref[..., 3] - cand[..., 3])
    pixel_error = rgb_error.mean(axis=2)

    ref_edges = edge_map(grayscale(ref[..., :3]))
    cand_edges = edge_map(grayscale(cand[..., :3]))

    report = {
        "status": "MEASURED",
        "reference_size": ref_size,
        "candidate_original_size": cand_size,
        "candidate_resized": resized,
        "rgb_mae": float(rgb_error.mean()),
        "rgb_rmse": float(np.sqrt(np.mean(np.square(ref[..., :3] - cand[..., :3])))),
        "pixel_error_p95": float(np.percentile(pixel_error, 95)),
        "pixels_error_gt_0_05": float(np.mean(pixel_error > 0.05)),
        "pixels_error_gt_0_10": float(np.mean(pixel_error > 0.10)),
        "alpha_mae": float(alpha_error.mean()),
        "edge_iou": edge_iou(ref_edges, cand_edges)
    }

    print(json.dumps(report, indent=2))
    if args.json_path:
        args.json_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
