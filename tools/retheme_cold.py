#!/usr/bin/env python3
"""Retheme pass 1 — the cold half, which is mechanical.

`--spice-blue` (#00e5ff) and `--blue` (#00a8e8) play the same role: they are the
interface colour. Only the value changed, so every public reference can be
repointed without looking at what it is colouring. That is not true of the gold
family — gold's replacement depends on whether the thing it colours is world or
interface — so gold is left for a hand pass.

Admin is deliberately out of scope: it keeps the legacy tokens at their legacy
values, so rewriting its literals would change its appearance, which is the one
thing "leave admin alone" rules out. AdminLoginPage.jsx lives in pages/ but is
part of admin, so it is excluded by name.

Prints a per-file count and writes nothing it cannot account for.
"""
import re
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src"

SKIP_DIRS = {"admin"}
SKIP_FILES = {"AdminLoginPage.jsx"}

# Ordered: the -glow name contains the base name, so it has to go first.
SWAPS = [
    ("var(--spice-blue-glow)", "rgba(0, 168, 232, 0.22)"),
    ("var(--spice-blue)", "var(--blue)"),
    ("#00e5ff", "#00a8e8"),
    ("#00E5FF", "#00a8e8"),
]

# rgba(0,229,255,a) -> rgba(0,168,232,a), any spacing, alpha preserved.
RGBA = re.compile(r"rgba\(\s*0\s*,\s*229\s*,\s*255\s*,\s*([0-9.]+)\s*\)")


def targets():
    for p in sorted(SRC.rglob("*.jsx")):
        rel = p.relative_to(SRC)
        if set(rel.parts) & SKIP_DIRS or p.name in SKIP_FILES:
            continue
        yield p


def main():
    total = 0
    touched = 0
    for p in targets():
        src = p.read_text(encoding="utf-8")
        out = src
        n = 0
        for old, new in SWAPS:
            n += out.count(old)
            out = out.replace(old, new)
        n += len(RGBA.findall(out))
        out = RGBA.sub(lambda m: f"rgba(0, 168, 232, {m.group(1)})", out)
        if out == src:
            continue
        p.write_text(out, encoding="utf-8")
        print(f"  {n:3d}  {p.relative_to(SRC)}")
        total += n
        touched += 1

    print(f"\n  {total} references repointed across {touched} files")

    # Nothing cold from the old palette may survive in a public file.
    leftovers = []
    for p in targets():
        s = p.read_text(encoding="utf-8")
        for pat in ("--spice-blue", "00e5ff", "00E5FF", "229,255", "229, 255"):
            if pat in s:
                leftovers.append(f"{p.relative_to(SRC)}: {pat}")
    if leftovers:
        print("\n  LEFTOVERS:")
        for l in leftovers:
            print(f"    {l}")
        return 1
    print("  no cold references to the old palette remain in public files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
