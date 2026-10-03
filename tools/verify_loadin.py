#!/usr/bin/env python3
"""verify_loadin.py — the hand-off from splash to world.

The reveal is a chain across four files:

    App.jsx          worldReady state  <--- onWorldReady
      SplashScreen   holds for worldReady (capped), then onComplete
      HomePage       ready && painted -> reveal
        DuneSea      PaintProbe -> onPainted

Every link is a string. A prop renamed on one side and not the other does not
throw and does not warn — `onPainted` stays undefined, `painted` stays false,
`reveal` stays false, and the world layer sits at opacity 0 forever. The page
looks blank and the console is clean. Nothing else in this suite can see that,
because there is no JS parser here and no GPU to render with.

So this checks the chain by name, in both directions, plus the handful of
invariants that make the sequence correct rather than merely connected:
readiness cannot deadlock, the chunk request is not gated, the intro is held
while hidden, no timer leaks, and the reveal never touches `scale`.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"
APP = (ROOT / "App.jsx").read_text(encoding="utf-8")
HOME = (ROOT / "pages/HomePage.jsx").read_text(encoding="utf-8")
DUNE = (ROOT / "components/DuneSea.jsx").read_text(encoding="utf-8")
FALL = (ROOT / "components/DuneSeaFallback.jsx").read_text(encoding="utf-8")
PREV = (ROOT / "pages/HeroPreviewPage.jsx").read_text(encoding="utf-8")
SCENE = (ROOT / "components/SplashScene.jsx").read_text(encoding="utf-8")
CSS_SRC = (ROOT / "styles/global.css").read_text(encoding="utf-8")

fails = []
warns = []
oks = []


def check(cond, label, detail=""):
    (oks if cond else fails).append(label if cond else f"{label}\n      {detail}")


def warn_if(cond, label):
    if cond:
        warns.append(label)


def nocomments(src):
    """Blank comments so a rule is never satisfied by prose about the rule.

    Every one of these files documents its own invariants at length, so
    grepping the raw text would pass on the comment that explains the fix even
    if the fix itself were reverted.
    """
    out, i, n = [], 0, len(src)
    while i < n:
        two = src[i:i + 2]
        if two == "/*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            out.append(" " * (j - i))
            i = j
        elif two == "//":
            j = src.find("\n", i)
            j = n if j < 0 else j
            out.append(" " * (j - i))
            i = j
        else:
            out.append(src[i])
            i += 1
    return "".join(out)


A, H, D, F, P, S, C = (nocomments(s) for s in (APP, HOME, DUNE, FALL, PREV, SCENE, CSS_SRC))
splash = A[A.find("function SplashScreen"):A.find("function AppContent")]
appbody = A[A.find("function AppContent"):]
intro_effect = re.search(
    r"useEffect\(\(\)\s*=>\s*\{\s*let cancelled\b(.*?)\n  \},\s*\[onComplete\]\);",
    splash,
    re.S,
)
effect_body = intro_effect.group(1) if intro_effect else ""

print("=" * 62)
print("  splash -> world hand-off")
print("=" * 62)

# ---------------------------------------------------------------- chain ----
# 1. App -> HomePage
check(
    re.search(r"<HomePage\b[^>]*\bready=\{", H + A) or "ready=" in A,
    "App passes `ready` to HomePage",
    "the HomePage route element has no ready={...} prop",
)
check(
    re.search(r"onWorldReady=\{", A),
    "App passes `onWorldReady` to HomePage",
)
check(
    re.search(r"function HomePage\(\s*\{([^}]*)\}", H)
    and {"ready", "onWorldReady"} <= set(
        p.strip().split(":")[0].split("=")[0].strip()
        for p in re.search(r"function HomePage\(\s*\{([^}]*)\}", H).group(1).split(",")
    ),
    "HomePage destructures both `ready` and `onWorldReady`",
    "a prop passed but not destructured is silently undefined",
)

# 2. HomePage -> DuneSea
m = re.search(r"<LazyDuneSea\b([^/>]*)", H)
check(m and "active=" in m.group(1), "HomePage passes `active` to DuneSea")
check(m and "onPainted=" in m.group(1), "HomePage passes `onPainted` to DuneSea")
sig = re.search(r"function DuneSea\(\s*\{([^}]*)\}", D)
names = set()
if sig:
    names = {
        p.strip().split(":")[0].split("=")[0].strip() for p in sig.group(1).split(",")
    }
check("active" in names, "DuneSea accepts `active`")
check("onPainted" in names, "DuneSea accepts `onPainted`")
check(
    re.search(r"active\s*=\s*true", sig.group(1) if sig else ""),
    "DuneSea defaults `active` to true",
    "HeroPreviewPage mounts DuneSea with no props; without a default the "
    "sunrise would never start there",
)
check(
    "<DuneSea" in P and not re.search(r"<DuneSea[^/>]*\b(active|onPainted)=", P),
    "HeroPreviewPage still mounts DuneSea bare, so the default path is exercised",
)

# 3. DuneSea -> back up
check(
    re.search(r"<PaintProbe\b[^/>]*onPainted=\{\s*onPainted\s*\}", D),
    "PaintProbe is mounted with onPainted forwarded",
)
check(
    re.search(r"onPainted\(\)", D),
    "DuneSea actually calls onPainted()",
)
# A useFrame subscriber runs BEFORE that frame is drawn, so reporting on tick 1
# hands over an empty canvas. Tick 1 is also the expensive one — three compiles
# materials lazily on first use.
probe = re.search(r"function PaintProbe\(.*?\n\}", D, re.S)
pn = re.search(r"seen\.current\s*===\s*(\d+)", probe.group(0) if probe else "")
check(
    pn and int(pn.group(1)) >= 2,
    "PaintProbe reports after the first drawn frame, not on it",
    f"reports on tick {pn.group(1) if pn else '?'}; a useFrame callback runs "
    "before its frame is drawn, so tick 1 means nothing is on screen yet",
)
check(
    re.search(r"handlePainted[^)]*\)\s*=>\s*\{[^}]*onWorldReady\(\)", H, re.S)
    or ("onWorldReady()" in H and "setPainted(true)" in H),
    "HomePage's painted handler both sets local state and calls onWorldReady",
    "one without the other reveals the canvas but never releases the splash, "
    "or vice versa",
)
check(
    re.search(r"onWorldReady=\{\s*handleWorldReady\s*\}", A)
    and re.search(r"handleWorldReady\s*=\s*useCallback", A),
    "App's handleWorldReady is a stable useCallback",
    "SplashScreen's intro sequence is a one-shot effect keyed on onComplete; an "
    "inline arrow here re-runs it on every render and restarts the intro",
)
check(
    re.search(r"handleSplashComplete\s*=\s*useCallback", A)
    and re.search(r"onComplete=\{\s*handleSplashComplete\s*\}", A),
    "App's handleSplashComplete is a stable useCallback",
)

# ------------------------------------------------------------ deadlock ----
print()
print("  liveness")

# painted must not depend on ready, or the two wait on each other forever.
probe_gated = re.search(r"\{\s*(ready|reveal|active)\s*&&\s*<PaintProbe", D)
check(not probe_gated, "PaintProbe is not gated on ready/reveal/active")
check(
    not re.search(r"\{\s*ready\s*&&\s*(<Suspense|<LazyDuneSea|<motion)", H),
    "the world layer mounts unconditionally",
    "gating the mount on `ready` is the original bug: React.lazy never calls "
    "its factory, so the chunk is not even requested until the splash is gone",
)
check(
    re.search(r"^const\s+duneSeaChunk\s*=\s*import\(", H, re.M),
    "the DuneSea chunk import is issued at module scope",
)
check(
    re.search(r"lazy\(\s*\(\)\s*=>\s*duneSeaChunk\s*\)", H),
    "lazy() resolves the already-started chunk promise",
    "lazy(() => import(...)) would defer the request to first render again",
)
check(
    not re.search(r"frameloop\s*=", D),
    "the Canvas has no frameloop override",
    "frameloop='demand' would stop PaintProbe's useFrame from ever ticking, "
    "so onPainted would never fire",
)

# the no-WebGL2 path renders no frames at all
fb = re.search(
    r"useEffect\(\(\)\s*=>\s*\{\s*if\s*\(caps\s*&&\s*caps\.useFallback\s*&&\s*onPainted\)\s*onPainted\(\);",
    D,
)
check(fb, "the fallback path reports readiness from an effect")
early = D.find("if (!caps || caps.useFallback) return")
check(
    fb and early > 0 and fb.start() < early,
    "that effect sits BEFORE the early return",
    "a hook after a conditional return changes hook order between renders",
)

# the splash must not be able to wait forever
check(
    re.search(r"holdCap\s*=\s*setTimeout\(handOff,\s*SPLASH_HOLD_CAP_MS\)", effect_body),
    "the splash's wait for worldReady is capped by the hand-off itself",
    "no cap means a failed chunk fetch, a lost context or no WebGL2 strands "
    "the visitor on the intro screen",
)
check(
    re.search(r"worldReadyRef\.current\s*=\s*worldReady", A)
    and re.search(r"worldReadyRef\.current", A[A.find("const finish"):]),
    "worldReady is mirrored into a ref and read from there inside finish()",
)
# The sync effect SHOULD depend on worldReady — that is its whole job. The
# effect that runs the intro sequence must not, and that is the one to assert
# on: it is a one-shot built on timers and a closure flag, so a dependency that
# changes mid-intro tears the whole sequence down and starts it again, which on
# this splash means the ember line snaps back to zero width and redraws.
introdeps = re.findall(r"\}, \[([^\]]*)\];?\);", A)
onecomplete = [d for d in introdeps if "onComplete" in d]
check(
    onecomplete and all("worldReady" not in d for d in onecomplete),
    "the splash's one-shot intro effect does not depend on worldReady",
    f"dep arrays containing onComplete: {onecomplete}",
)

cancel_block = re.search(
    r"const cancel\s*=\s*\(\)\s*=>\s*\{((?:(?!\n    \};).)*?)\n    \};",
    effect_body,
    re.S,
)
cleanup_tail = effect_body[cancel_block.end():] if cancel_block else ""
check(
    cancel_block and re.fullmatch(r"\s*cancelRef\.current\s*=\s*cancel;\s*return cancel;\s*", cleanup_tail),
    "the splash effect returns its actual cancel closure as cleanup",
)
created = set(re.findall(r"(\w+)\s*=\s*set(?:Timeout|Interval)\(", effect_body))
cleanup_body = cancel_block.group(1) if cancel_block else ""
cleaned = set(re.findall(r"clear(?:Timeout|Interval)\(\s*(\w+)\s*\)", cleanup_body))
missing = sorted((created | {"scriptTimer", "holdPoll", "holdCap", "handoffTimer"}) - cleaned)
check(
    not missing,
    "every timer the splash creates is cleared inside the cancel block",
    f"not cleared on unmount: {missing}",
)
check(
    all(re.search(rf"clear{kind}\(\s*{name}\s*\)", cleanup_body)
        for name, kind in re.findall(r"(\w+)\s*=\s*set(Timeout|Interval)\(", effect_body))
    and bool(created),
    "cancel clears each timer with its matching clear function",
)

# and cleared with the matching function
for name in sorted(created):
    kind = "Interval" if re.search(rf"{name}\s*=\s*setInterval\(", A) else "Timeout"
    wrong = re.search(rf"clear{'Timeout' if kind == 'Interval' else 'Interval'}\({name}\)", A)
    warn_if(wrong, f"{name} is a set{kind} but is cleared with the other clear*")

# ---------------------------------------------------- the splash itself ----
print()
print("  the splash tells the truth")

# Two regions, because almost every assertion below is about which side of the
# `function AppContent` line a thing lives on.
splash = A[A.find("function SplashScreen"):A.find("function AppContent")]
appbody = A[A.find("function AppContent"):]

check(splash and appbody, "SplashScreen and AppContent are both present")

seal_sites = re.findall(r"\bsetSealed\s*\(", splash)
handoff = re.search(r"const handOff = \(\) => \{(.*?)\n      \};", effect_body, re.S)
check(handoff, "handOff() is the single hand-over path")
check(
    len(seal_sites) == 1 and handoff and re.search(r"\bsetSealed\(\s*true\s*\)", handoff.group(1)),
    "sealed is set only from inside handOff()",
    f"setSealed call sites: {len(seal_sites)}",
)
scene_tag = re.search(r"<SplashScene\b([^>]*)/>", splash)
for prop, value in (("sealed", "sealed"), ("reduceMotion", "reduceMotion"), ("onPainted", "handleScenePainted")):
    check(
        scene_tag and re.search(rf"\b{prop}=\{{\s*{value}\s*\}}", scene_tag.group(1)),
        f"SplashScene receives {prop}={{{value}}}",
    )
check(
    re.search(r"const reduceMotion\s*=\s*useReducedMotion\(\)", splash),
    "SplashScreen reads the reduced-motion preference",
)
scene_sig = re.search(r"export default function SplashScene\(\s*\{([^}]*)\}", S)
scene_names = {
    p.strip().split(":")[0].split("=")[0].strip()
    for p in (scene_sig.group(1) if scene_sig else "").split(",")
}
check(
    {"sealed", "reduceMotion", "onPainted"} <= scene_names,
    "SplashScene accepts sealing, reduced motion and painted callback props",
)
paint_handler = re.search(r"const handleScenePainted\s*=\s*useCallback\(\(\)\s*=>\s*\{(.*?)\},\s*\[\]\)", splash, re.S)
check(
    paint_handler and re.fullmatch(
        r"\s*if \(scenePaintedRef\.current\) return;\s*"
        r"scenePaintedAtRef\.current = performance\.now\(\);\s*"
        r"scenePaintedRef\.current = true;\s*", paint_handler.group(1)
    ) and len(re.findall(r"scenePaintedAtRef\.current\s*=(?!=)", splash)) == 1
    and len(re.findall(r"scenePaintedRef\.current\s*=(?!=)", splash)) == 1
    and re.search(r"scenePaintedRef\s*=\s*useRef\(false\)", splash)
    and re.search(r"scenePaintedAtRef\s*=\s*useRef\(null\)", splash),
    "the stable painted handler records the scene's first paint timestamp once",
)
check(
    re.search(
        r"const sceneReady\s*=\s*\(\)\s*=>\s*scenePaintedRef\.current\s*"
        r"&&\s*performance\.now\(\)\s*-\s*scenePaintedAtRef\.current\s*>=\s*SPLASH_FLOOR_MS\s*;",
        effect_body,
    ),
    "sceneReady requires its own paint and a full floor since that paint",
)
check(
    re.search(r"if \(worldReadyRef\.current\)\s*\{\s*if \(sceneReady\(\)\)\s*\{\s*handOff\(\);\s*return;\s*\}\s*\}", effect_body)
    and re.search(r"holdPoll\s*=\s*setInterval\(\(\)\s*=>\s*\{\s*if \(!worldReadyRef\.current \|\| !sceneReady\(\)\) return;\s*handOff\(\);\s*\},\s*80\)", effect_body)
    and len(re.findall(r"\bhandOff\(\)", effect_body)) == 2,
    "both uncapped hand-off paths require worldReady and sceneReady",
)
check(
    re.search(r"const scriptTimer\s*=\s*setTimeout\(finish,\s*SPLASH_FLOOR_MS\)", effect_body)
    and handoff and re.search(r"handoffTimer\s*=\s*setTimeout\(.*?\},\s*SPLASH_HANDOFF_MS\)", handoff.group(1), re.S),
    "the initial floor and sealed hand-off delay use their timing constants",
)
check(
    not re.search(r"\b(progress|percent|pct|loadPercent)\b", splash, re.I),
    "no progress-bar state survives in the splash",
)
check(
    not re.search(r"\$\{[^}]*\}\s*%", splash) and "LOADING:" not in splash,
    "the splash interpolates no percentage into text",
)

# The exit is a plain cross-fade on purpose: a full-viewport filter: blur() is
# among the most expensive things a phone GPU can be asked for, and the old one
# asked for it in the same frames the world behind was compiling shaders.
ex = re.search(r"exit=\{\{([^}]*)\}\}", splash)
check(ex, "the splash has an exit animation")
check(
    ex and "scale" not in ex.group(1) and "filter" not in ex.group(1),
    "the splash exits on opacity alone — no scale, no blur",
    f"exit target: {{{ex.group(1).strip() if ex else '?'}}}",
)

check(
    re.search(r'<motion\.div\s[^>]*className="intro-stage"', splash),
    "the redesigned splash root uses intro-stage",
)
old_visuals = re.findall(r"DuneSeaFallback|--seam-y|\bsplash-[\w-]+|\bember-seam\b|\bscaleX\b|<(?:line|hr|progress)\b|\b(?:intro|ember)-(?:line|seam|progress)\b", splash)
check(
    not old_visuals,
    "SplashScreen contains no old splash visuals, seam, line or progress bar",
    f"obsolete visuals: {old_visuals}",
)
check(
    "nav-desktop-links" not in splash,
    "no stray nav class in the splash",
    "the old corner-HUD blocks carried className='nav-desktop-links', so the "
    "responsive rules for the navigation applied to splash decoration",
)
check(
    not re.search(r"key=\{\s*i(?:dx|ndex)?\s*\}", splash),
    "nothing in the splash is keyed by array index",
)
dismiss = re.search(r'<button\b([^>]*)>\s*Enter site\s*</button>', splash)
check(
    dismiss and all(re.search(pattern, dismiss.group(1)) for pattern in (
        r'className="intro-dismiss"', r'type="button"', r'onClick=\{handleSkip\}',
    )),
    "the intro-dismiss control is a real button wired to handleSkip",
)

# ------------------------------------------------------- the ember seam ----
print()
print("  the ember seam survives navigation")

seam_at = appbody.find('className="ember-seam"')
shell_at = appbody.find('className="route-shell"')
check(
    0 < seam_at < shell_at,
    "the ember seam is a sibling of the route wrapper, not a child of it",
    "the wrapper animates `filter` and `scale`, and an ancestor with either "
    "becomes the containing block for position:fixed — inside it this line "
    "would scroll away and blur on every route change. `route-shell` is the "
    "last prop on that opening tag, so anything before it is outside.",
)
# Attribute order is not fixed, so match the whole tag rather than assuming
# className comes first. Anchoring on `<div className="ember-seam"` made the
# "never keyed" check below unreachable for a key inserted BEFORE className:
# the tag simply stopped matching and the failure surfaced as "not rendered",
# which is a true report of the wrong problem.
seam_tag = re.search(r"<div\s[^>]*className=\"ember-seam\"[^>]*>", appbody)
check(seam_tag, "the seam is rendered in AppContent")
check(
    seam_tag and "key=" not in seam_tag.group(0),
    "the seam is never keyed",
    "a key would remount it on navigation and restart its 14s breath; the "
    "eternal flame is eternal because nothing re-renders it",
)
check(
    seam_tag and "aria-hidden" in seam_tag.group(0),
    "the seam is aria-hidden",
)
check(
    re.search(r"location\.pathname !== '/'\s*&&\s*<div className=\"ember-seam\"", appbody),
    "the home page hides the seam",
    "the hero draws a real horizon at this exact height, and two lights on "
    "one horizon is one too many",
)

seam_css = re.search(r"\.ember-seam\s*\{([^}]*)\}", C)
check(seam_css, ".ember-seam is defined in global.css")
check(
    seam_css and "position: fixed" in seam_css.group(1),
    "the seam is position: fixed",
)
check(
    seam_css and "top: var(--seam-y)" in seam_css.group(1),
    "the seam sits at --seam-y, the same height as the hero horizon",
)
check(
    re.search(r"--seam-y:\s*[\d.]+vh", C),
    "--seam-y is defined as a viewport height",
)
# Every keyframe that moves, behind the guard — see the reveal section for why
# this is asserted over all instances rather than the first match.
breathe = [
    m.start() for m in re.finditer(r"animation:\s*seam-breathe", C)
]
guard = C.find("@media (prefers-reduced-motion: no-preference)")
check(
    breathe and guard > 0 and all(b > guard for b in breathe),
    "the seam's breath is behind prefers-reduced-motion: no-preference",
    f"seam-breathe at {breathe}, first no-preference block at {guard}",
)
shell_css = re.search(r"\.route-shell\s*\{([^}]*)\}", C)
zseam = re.search(r"z-index:\s*(-?\d+)", seam_css.group(1) if seam_css else "")
zshell = re.search(r"z-index:\s*(-?\d+)", shell_css.group(1) if shell_css else "")
check(
    zseam and zshell and int(zshell.group(1)) > int(zseam.group(1)),
    "page content stacks above the seam",
    "the seam is atmosphere, not a divider drawn over the interface",
)

# -------------------------------------------------------------- reveal ----
print()
print("  the reveal itself")

check(
    re.search(r"const\s+reveal\s*=\s*ready\s*&&\s*painted", H),
    "reveal requires both `ready` and `painted`",
)
mot = re.search(r"<motion\.div(.*?)>", H, re.S)
body = mot.group(1) if mot else ""
check(mot, "the world layer is a motion.div")
check("opacity: 0" in body and "opacity: 1" in body, "it animates opacity 0 -> 1")
check(
    "scale" not in body,
    "it does not animate `scale`",
    "scaling a tone-mapped HDR canvas resamples every pixel and goes soft — "
    "the exact complaint this background was rebuilt twice to fix",
)
# Every y value in the reveal, both arms of every ternary. The lookbehind
# matters: `opacity:` ends in `y:`, so an unanchored match reports the opacity
# keyframes as unitless y keyframes and the check fails on correct code.
yexprs = re.findall(r"(?<![A-Za-z0-9_$])y:\s*([^,}]+)", body)
ys = [m for e in yexprs for m in re.findall(r"'?(-?[\d.]+)([a-z%]*)'?", e)]
units = {u for _, u in ys}
check(
    len(ys) >= 2 and len(units) == 1 and "" not in units,
    "every y keyframe carries the same unit",
    f"keyframes {ys}; framer-motion has to guess when a unitless 0 meets a "
    "'3vh' string, and the guess is not always translateY",
)
check(
    re.search(r"useReducedMotion\(\)", H),
    "HomePage reads useReducedMotion",
)
# EVERY keyframe that moves, not just one of them. There are two independent y
# blocks here (initial, and both arms of animate's ternary); guarding one and
# not the others still ships a rise to someone who asked for no motion, and
# reads as correct at a glance.
moving = [e for e in yexprs if re.search(r"[1-9]", e)]
unguarded = [e.strip() for e in moving if "reducedMotion" not in e]
check(
    moving and not unguarded,
    "every y keyframe that moves is behind reducedMotion",
    f"unguarded: {unguarded}",
)
check(
    all(float(v) >= 0 for v, _ in ys),
    "the rise starts at or below its resting position",
    "a negative start shifts the canvas UP, uncovering the bottom of the "
    "frame, where the fallback gradient is sand rather than sky",
)
sticky = re.search(r"position:\s*'sticky'(.*?)\}\}", H, re.S)
check(
    sticky and "overflow: 'hidden'" in sticky.group(1),
    "the sticky world layer clips its overhang",
)
check(
    H.find("<DuneSeaFallback />") > 0
    and H.find("<DuneSeaFallback />") < (mot.start() if mot else 0),
    "the bridge gradient paints beneath the canvas, not above it",
)

# ----------------------------------------------------------- intro gate ----
print()
print("  the sunrise is held, not spent")

check(
    re.search(r"function EnvDriver\(\s*\{[^}]*\bactive\b", D),
    "EnvDriver receives `active`",
)
check(
    re.search(r"<EnvDriver\b[^/>]*active=\{\s*active\s*\}", D),
    "EnvDriver is mounted with `active` forwarded",
)
intro = re.search(r"if \(active\) \{(.*?)\n    \}", D, re.S)
check(
    intro and "env.intro = Math.min(env.intro" in intro.group(1),
    "the intro ramp only advances while active",
    "without this the 3.6s sunrise runs to completion behind the opaque "
    "splash and the visitor arrives at full morning",
)
check(
    re.search(r"INTRO_DEPTH \* Math\.pow\(1 - env\.intro", D),
    "the sun's lift still reads env.intro, so holding intro parks the sun low",
)

# ------------------------------------------------------- module hygiene ----
print()
print("  the fallback split")

heavy = [m for m in re.findall(r"^import .*?from '([^']+)'", F, re.M)]
check(
    not heavy,
    "DuneSeaFallback imports nothing",
    f"imports found: {heavy}. Anything from three/@react-three/postprocessing "
    "here would be pulled into HomePage's main bundle and defeat the code "
    "split this module exists to cover for",
)
check(
    "export default function DuneSeaFallback" in F,
    "DuneSeaFallback has a default export",
)
check(
    re.search(r"import DuneSeaFallback from '\.\./components/DuneSeaFallback'", H),
    "HomePage imports the fallback directly, not through DuneSea",
)
check(
    re.search(r"export \{ default as DuneSeaFallback \} from '\./DuneSeaFallback'", D),
    "DuneSea re-exports DuneSeaFallback",
    "it used to be declared there; the re-export keeps that import path alive",
)
check(
    not re.search(r"export function DuneSeaFallback", D),
    "DuneSea no longer declares its own copy",
)
check(
    re.search(r"import DuneSeaFallback from '\./DuneSeaFallback'", D),
    "DuneSea imports the fallback it renders",
)

# ------------------------------------------------------------- report ----
print()
for o in oks:
    print(f"    ok  {o}")
if warns:
    print()
    for w in warns:
        print(f"  warn  {w}")
print()
print("=" * 62)
if fails:
    for f_ in fails:
        print(f"  FAIL  {f_}")
    print("=" * 62)
    sys.exit(1)
print(f"  ALL {len(oks)} LOAD-IN CHECKS PASSED")
print("=" * 62)
