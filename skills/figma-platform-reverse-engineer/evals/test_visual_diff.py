#!/usr/bin/env python3

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw


def run_diff(script: Path, a: Path, b: Path):
    proc = subprocess.run(
        [sys.executable, str(script), str(a), str(b)],
        capture_output=True,
        text=True,
        check=False,
    )
    return proc.returncode, json.loads(proc.stdout)


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    script = root / "scripts" / "visual_diff.py"

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        a = tmp / "a.png"
        b = tmp / "b.png"
        c = tmp / "c.png"
        d = tmp / "d.png"

        base = Image.new("RGBA", (64, 64), (255, 255, 255, 255))
        draw = ImageDraw.Draw(base)
        draw.rectangle((16, 16, 48, 48), fill=(0, 0, 0, 255))
        base.save(a)
        base.save(b)

        altered = base.copy()
        draw2 = ImageDraw.Draw(altered)
        draw2.rectangle((16, 16, 48, 48), fill=(80, 0, 0, 255))
        altered.save(c)

        Image.new("RGBA", (32, 32), (255, 255, 255, 255)).save(d)

        code, identical = run_diff(script, a, b)
        assert code == 0
        assert identical["rgb_mae"] == 0.0
        assert identical["edge_iou"] == 1.0

        code, changed = run_diff(script, a, c)
        assert code == 0
        assert changed["rgb_mae"] > 0.0

        code, mismatch = run_diff(script, a, d)
        assert code == 2
        assert mismatch["status"] == "FAIL_DIMENSIONS"

    print("visual_diff tests: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
