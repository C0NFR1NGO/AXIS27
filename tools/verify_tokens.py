#!/usr/bin/env python3
"""verify_tokens.py — design-token hygiene.

Checks:
  1. --ember never colours a control (button, link, hover state, focus ring).
  2. --blue never lands on sand (sand backgrounds + blue foreground).
  3. No --gold or --spice-blue in public JSX (admin excluded).
  4. No unloaded font families (Rajdhani, Orbitron, Share Tech Mono) in
     active code (comments and admin excluded).
  5. No .glass-card in public JSX (only .panel is valid).
  6. No inline #00e5ff or #c9911a in public JSX.
  7. --ember and --amber-hot are correct hex values.

Public = src/ minus src/admin/ and pages/AdminLoginPage.jsx.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"
CSS = (ROOT / "styles/global.css").read_text(encoding="utf-8")

ADMIN_EXCLUDE = re.compile(r"(^|[/\\])admin([/\\]|$)|AdminLogin|DashboardPage", re.I)


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def nocomments(src):
    """Blank comment lines so rules never match prose about the rule.

    Handles // line comments, /* ... */ block comments, and JSX {/* ... */}
    block comments (which don't start with /* or * on continuation lines).
    """
    import re as _re
    # First pass: blank /* ... */ and {/* ... */} block comments (multiline)
    src = _re.sub(r"/\*.*?\*/", "", src, flags=_re.S)
    # Second pass: blank // line comments
    src = _re.sub(r"//[^\n]*", "", src)
    return src


# Collect all public JSX (exclude admin/)
public_jsx = {}
for f in sorted(ROOT.rglob("*.jsx")):
    rel = str(f.relative_to(ROOT))
    if ADMIN_EXCLUDE.search(rel):
        continue
    public_jsx[rel] = nocomments(f.read_text(encoding="utf-8"))

fails = []
oks = []


def check(cond, label, detail=""):
    (oks if cond else fails).append(label if cond else f"{label}\n      {detail}")


# ── 1. --ember never colours a control ──────────────────────────────────
EMBER = re.compile(r"--ember")
CTRL_CTX = re.compile(
    r"(btn|button|link|backlink|hover|focus|active|\.main\s+select)", re.I
)
ember_control_hits = []
for path, src in public_jsx.items():
    for i, line in enumerate(src.splitlines(), 1):
        if EMBER.search(line) and CTRL_CTX.search(line):
            ember_control_hits.append(f"{path}:{i}")
check(
    not ember_control_hits,
    "--ember never colours a control",
    "Found --ember near control keywords:\n" + "\n".join(ember_control_hits),
)

# ── 2. --blue never lands on sand ───────────────────────────────────────
# Look for sand-colored backgrounds combined with --blue foreground, but
# EXCLUDE text gradients (backgroundClip: 'text') where the gradient is
# decorative typography, not a background + foreground pairing.
SAND_BG = re.compile(
    r"(--sand|--bone|#e8c89a|#f2e4cc|rgba\(232,\s*200,\s*154|rgba\(242,\s*228,\s*204)"
)
BLUE_FG = re.compile(r"--blue|#00a8e8")
TEXT_CLIP = re.compile(r"backgroundClip|WebkitBackgroundClip|text-fill-color|FillColor")
blue_sand_hits = []
for path, src in public_jsx.items():
    lines = src.splitlines()
    for i, line in enumerate(lines, 1):
        if SAND_BG.search(line) and BLUE_FG.search(line):
            # Check if this is a text gradient (decorative, not bg+fg)
            context = "\n".join(lines[max(0, i - 3) : i + 3])
            if TEXT_CLIP.search(context):
                continue
            blue_sand_hits.append(f"{path}:{i}")
check(
    not blue_sand_hits,
    "--blue never lands on sand",
    "Found sand background + blue foreground:\n" + "\n".join(blue_sand_hits),
)

# ── 3. No --gold / --spice-blue in public JSX ──────────────────────────
GOLD_BLUE = re.compile(r"--gold|--spice-blue")
gold_hits = []
for path, src in public_jsx.items():
    for i, line in enumerate(src.splitlines(), 1):
        if GOLD_BLUE.search(line):
            gold_hits.append(f"{path}:{i}")
check(
    not gold_hits,
    "no --gold / --spice-blue in public JSX",
    "Found legacy tokens:\n" + "\n".join(gold_hits),
)

# ── 4. No unloaded font families in active code ────────────────────────
UNLOADED = re.compile(
    r"""(?:fontFamily|font-family)\s*[:=]\s*['"]?(Rajdhani|Orbitron|Share Tech Mono)['"]?"""
)
font_hits = []
for path, src in public_jsx.items():
    for i, line in enumerate(src.splitlines(), 1):
        m = UNLOADED.search(line)
        if m:
            font_hits.append(f"{path}:{i} — {m.group(1)}")
check(
    not font_hits,
    "no unloaded font families in public active code",
    "Found unloaded fonts:\n" + "\n".join(font_hits),
)

# ── 5. No .glass-card in public JSX ────────────────────────────────────
GLASS = re.compile(r"glass-card")
glass_hits = []
for path, src in public_jsx.items():
    for i, line in enumerate(src.splitlines(), 1):
        if GLASS.search(line):
            glass_hits.append(f"{path}:{i}")
check(
    not glass_hits,
    "no .glass-card in public JSX (use .panel)",
    "Found .glass-card:\n" + "\n".join(glass_hits),
)

# ── 6. No inline #00e5ff / #c9911a / #dca22a in public JSX ───────────
HARDCODED = re.compile(r"""['"]#(?:00e5ff|c9911a|dca22a)['"]""")
hardcoded_hits = []
for path, src in public_jsx.items():
    for i, line in enumerate(src.splitlines(), 1):
        if HARDCODED.search(line):
            hardcoded_hits.append(f"{path}:{i}")
check(
    not hardcoded_hits,
    "no hardcoded #00e5ff / #c9911a / #dca22a in public JSX",
    "Found hardcoded old palette:\n" + "\n".join(hardcoded_hits),
)

# ── 7. --ember and --amber-hot are correct hex values (case-insensitive) ─
check(
    re.search(r"--ember:\s*#ff9e00", CSS, re.I),
    "--ember is defined as #ff9e00 in :root",
)
check(
    re.search(r"--amber-hot:\s*#ffa500", CSS, re.I),
    "--amber-hot is defined as #ffa500 in :root",
)

# ── report ──────────────────────────────────────────────────────────────
print()
for o in oks:
    print(f"    ok  {o}")
print()
print("=" * 62)
if fails:
    for f_ in fails:
        print(f"  FAIL  {f_}")
    print("=" * 62)
    sys.exit(1)
print(f"  ALL {len(oks)} TOKEN CHECKS PASSED")
print("=" * 62)
