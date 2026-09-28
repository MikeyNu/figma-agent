#!/usr/bin/env python3

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SKILL = ROOT / "skills" / "figma-platform-reverse-engineer" / "SKILL.md"


def main() -> int:
    required = [
        ROOT / "README.md",
        ROOT / "AGENTS.md",
        SKILL,
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "tool-contract.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "evidence-and-confidence.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "flow-and-platform-inference.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "design-system-forensics.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "asset-pipeline.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "parity-qa.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "agent-failure-modes.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "error-recovery.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "documentation-spec.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "references" / "research-pain-points.md",
        ROOT / "skills" / "figma-platform-reverse-engineer" / "evals" / "BATTLE_TESTS.md"
    ]

    missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
    if missing:
        raise SystemExit(f"Missing required files: {missing}")

    text = SKILL.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise SystemExit("SKILL.md is missing YAML frontmatter")
    if "name: figma-platform-reverse-engineer" not in text:
        raise SystemExit("Unexpected skill name")

    required_terms = [
        "OBSERVED",
        "INFERRED",
        "PROPOSED",
        "UNRESOLVED",
        "get_design_context",
        "get_metadata",
        "get_screenshot",
        "download_assets",
        "use_figma",
        "Completion gates",
        "Later PRD comparison contract"
    ]
    for term in required_terms:
        if term not in text:
            raise SystemExit(f"SKILL.md missing required concept: {term}")

    all_text = "\n".join(
        p.read_text(encoding="utf-8")
        for p in ROOT.rglob("*")
        if p.is_file() and p.suffix in {".md", ".js", ".py", ".json", ".csv", ".txt"}
    )
    if "\u2014" in all_text:
        raise SystemExit("Em dash found in bundle")

    battle = (ROOT / "skills" / "figma-platform-reverse-engineer" / "evals" / "BATTLE_TESTS.md").read_text(encoding="utf-8")
    cases = re.findall(r"^## BT-\d+:\s", battle, flags=re.MULTILINE)
    if len(cases) < 25:
        raise SystemExit(f"Expected at least 25 battle tests, found {len(cases)}")

    print(f"bundle lint: PASS ({len(cases)} battle tests)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
