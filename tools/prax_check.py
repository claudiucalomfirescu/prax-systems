#!/usr/bin/env python3
"""Check a repository against the Prax Systems repository contract.

Usage:
    python3 prax_check.py <repo-dir> [--level bronze|silver] [--json]

Stdlib only, so it runs in any fresh clone. Exit code 0 when the repo
meets the requested level, 1 otherwise.
"""
import argparse
import json
import re
import sys
from pathlib import Path

# The blueprint: everything a future model needs to rebuild the repo. It lives in its own
# folder so the repo root stays the front door (README, manifest, code).
BLUEPRINT = "blueprint"
BLUEPRINT_FILES = ["GOAL.md", "SPEC.md", "ARCHITECTURE.md", "PROMPTS.md", "ROADMAP.md", "DECISIONS.md"]
REQUIRED_FILES = ["prax.yaml", "README.md"] + [f"{BLUEPRINT}/{f}" for f in BLUEPRINT_FILES]
SILVER_PATHS = ["demo/DEMO.md", "explainers/index.html", "tests"]
MANIFEST_KEYS = ["prax", "name", "kind", "one_liner", "status", "run", "docs", "explainer"]
R_ID = re.compile(r"\bR-(\d{3})\b")
TEST_ID = re.compile(r"(?<![A-Za-z])R-?(\d{3})(?!\d)")  # tests may cite R-004 or test_R004_...
PLACEHOLDER = re.compile(r"<name>|<one-liner|R-001 \| The <component>")
# An explainer must open offline from file://, so it may not load anything from the network.
EXTERNAL_LOAD = re.compile(r"<(?:script|link|img|iframe|video|audio|source)\b[^>]*\b(?:src|href)=[\"']?(?:https?:)?//"
                           r"|url\([\"']?(?:https?:)?//|@import", re.I)
TEXT_SUFFIXES = {".py", ".js", ".ts", ".go", ".rs", ".java", ".sh", ".md", ".html", ".txt", ".yaml", ".yml", ".json"}


def read(path):
    return path.read_text(errors="ignore")


def spec_ids(spec_text):
    """(defined, manual): R-ids that start a table row, heading or bullet in SPEC.md, and the
    subset whose row says the check is manual."""
    defined, manual = set(), set()
    for line in spec_text.splitlines():
        s = line.strip()
        m = R_ID.search(s[:20])
        if m and s.startswith(("|", "#", "-", "*")):
            defined.add(m.group(1))
            if "manual" in s.lower():
                manual.add(m.group(1))
    return defined, manual


def cited_in_tests(tests_dir):
    ids = set()
    for p in tests_dir.rglob("*") if tests_dir.is_dir() else ():
        if p.is_file() and p.suffix in TEXT_SUFFIXES:
            ids |= set(TEST_ID.findall(read(p)))
    return ids


def check(repo, level):
    problems, notes = [], []
    for f in REQUIRED_FILES:
        p = repo / f
        if not p.is_file():
            problems.append(f"missing {f}")
        elif p.stat().st_size < 120 and f != "prax.yaml":
            problems.append(f"{f} is nearly empty")
        elif PLACEHOLDER.search(read(p)):
            problems.append(f"{f} still contains template placeholders")
    for f in BLUEPRINT_FILES:
        if (repo / f).is_file():
            problems.append(f"{f} is in the repo root; move it to {BLUEPRINT}/")

    if (repo / "prax.yaml").is_file():
        text = read(repo / "prax.yaml")
        problems += [f"prax.yaml has no '{k}'" for k in MANIFEST_KEYS if not re.search(rf"^{k}:", text, re.M)]

    prompts = repo / BLUEPRINT / "PROMPTS.md"
    if prompts.is_file():
        t = read(prompts)
        problems += [f"PROMPTS.md has no {p}" for p in ("P-REBUILD", "P-VERIFY") if p not in t]
        if not re.search(r"P-0?1\b", t):
            problems.append("PROMPTS.md has no step-by-step prompts (P-01…)")

    spec = repo / BLUEPRINT / "SPEC.md"
    reqs, manual = spec_ids(read(spec)) if spec.is_file() else (set(), set())
    if spec.is_file():
        if not reqs:
            problems.append("SPEC.md defines no requirements (R-001…)")
        if not re.search(r"\bK-[\w-]+@\d", read(spec)):
            notes.append("SPEC.md names no versioned contract (K-…@n)")
        notes.append(f"{len(reqs)} requirements in SPEC.md")

    readme = repo / "README.md"
    if readme.is_file():
        rt = read(readme)
        if "```" not in rt:
            problems.append("README.md has no quickstart commands")
        if f"{BLUEPRINT}/" not in rt:
            problems.append(f"README.md does not point readers to {BLUEPRINT}/")

    if level == "silver":
        problems += [f"silver: missing {p}" for p in SILVER_PATHS if not (repo / p).exists()]
        data = repo / "demo" / "data"
        if not data.is_dir() or not any(data.iterdir()):
            problems.append("silver: demo/data/ has no recorded demo data")
        explainer = repo / "explainers" / "index.html"
        if explainer.is_file() and EXTERNAL_LOAD.search(read(explainer)):
            problems.append("silver: explainers/index.html loads something from the network")
        if reqs:
            covered = cited_in_tests(repo / "tests") | manual
            missing = sorted(reqs - covered)
            if missing:
                problems.append("silver: requirements with no test or manual check: "
                                + ", ".join(f"R-{m}" for m in missing))
            notes.append(f"{len(reqs & covered)}/{len(reqs)} requirements covered")

    return problems, notes


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("repo", type=Path)
    ap.add_argument("--level", choices=["bronze", "silver"], default="bronze")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    problems, notes = check(a.repo, a.level)
    ok = not problems
    if a.json:
        print(json.dumps({"repo": str(a.repo), "level": a.level, "ok": ok,
                          "problems": problems, "notes": notes}, indent=2))
    else:
        print(f"{a.repo}: {'PASS' if ok else 'FAIL'} ({a.level})")
        for p in problems:
            print(f"  ✗ {p}")
        for n in notes:
            print(f"  · {n}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
