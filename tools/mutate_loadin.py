#!/usr/bin/env python3
"""Mutation test for verify_loadin.py.

Sibling to mutate.py, which is single-target by design (DuneSea.jsx). The
load-in chain spans four files, so this one carries a path per mutant and
backs up all of them.

Every mutant here is a regression the load-in fix was specifically made for,
which is the point: the reason this harness exists is that most of these bugs
are SILENT. Renaming `onPainted` on one side of the boundary throws nothing and
warns nothing — the world layer just sits at opacity 0 and the page looks blank
with a clean console. If verify_loadin can't fail on that, it isn't testing
anything.

  fail  the checker must exit nonzero
  miss  a real regression no static check can see, kept as the honest boundary
"""
import shutil, subprocess, sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src"
OUT = str(Path(__file__).resolve().parent.parent / "tools")

HOME = SRC / "pages/HomePage.jsx"
DUNE = SRC / "components/DuneSea.jsx"
FALL = SRC / "components/DuneSeaFallback.jsx"
APP = SRC / "App.jsx"
CSS = SRC / "styles/global.css"
TARGETS = [HOME, DUNE, FALL, APP, CSS]

# verify_loadin owns the chain. The other three run too, because a mutant that
# breaks the chain must not be waved through by one checker while quietly
# breaking another, and because a mutant that trips only the structural checker
# is telling me my anchor damaged syntax rather than tested a behaviour.
CHECKS = [
    ["python3", f"{OUT}/verify_loadin.py"],
    ["python3", f"{OUT}/verify_direction.py"],
]

MUTANTS = [
    # ---------------------------------------------------- the original bug --
    ("fail", HOME, "the chunk import deferred back into the render (the original pop-in)",
     "const duneSeaChunk = import('../components/DuneSea');\nconst LazyDuneSea = lazy(() => duneSeaChunk);",
     "const LazyDuneSea = lazy(() => import('../components/DuneSea'));"),

    ("fail", HOME, "reveal simplified back to `ready`, so it fires before there are pixels",
     "const reveal = ready && painted;",
     "const reveal = ready;"),

    # ------------------------------------------- silently severed prop links --
    ("fail", HOME, "onPainted renamed on the HomePage side only (silent blank page)",
     "<LazyDuneSea active={reveal} onPainted={handlePainted} />",
     "<LazyDuneSea active={reveal} onReady={handlePainted} />"),

    ("fail", HOME, "active renamed on the HomePage side only (sunrise never starts)",
     "<LazyDuneSea active={reveal} onPainted={handlePainted} />",
     "<LazyDuneSea live={reveal} onPainted={handlePainted} />"),

    ("fail", APP, "onWorldReady dropped from the HomePage route (splash waits out its cap every load)",
     "onWorldReady={handleWorldReady}",
     "onWorldReady={undefined}"),

    ("fail", DUNE, "PaintProbe mounted without its callback",
     "<PaintProbe onPainted={onPainted} />",
     "<PaintProbe />"),

    # ------------------------------------------------------------- liveness --
    ("fail", DUNE, "frameloop set to demand, so PaintProbe's useFrame never ticks",
     "        dpr={[1, caps.handheld ? 1.25 : caps.lowPower ? 1.5 : 2]}",
     "        frameloop=\"demand\"\n"
     "        dpr={[1, caps.handheld ? 1.25 : caps.lowPower ? 1.5 : 2]}"),

    ("fail", DUNE, "probe reports on tick 1, before that frame is drawn",
     "if (seen.current === 3 && onPainted) onPainted();",
     "if (seen.current === 1 && onPainted) onPainted();"),

    ("fail", DUNE, "fallback path stops reporting readiness (no-WebGL2 stays at opacity 0)",
     "if (caps && caps.useFallback && onPainted) onPainted();",
     "if (caps && caps.useFallback && onPainted) return;"),

    ("fail", APP, "the splash's hold on worldReady loses its cap (strands on a failed fetch)",
     "      holdCap = setTimeout(handOff, SPLASH_HOLD_CAP_MS);\n",
     ""),

    ("fail", APP, "inline arrow for onWorldReady, which restarts the intro mid-flight",
     "  const handleWorldReady = useCallback(() => setWorldReady(true), []);",
     "  const handleWorldReady = () => setWorldReady(true);"),

    ("fail", APP, "worldReady added to the one-shot intro effect's deps",
     "  }, [onComplete]);",
     "  }, [onComplete, worldReady]);"),

    ("fail", APP, "holdPoll left running on unmount",
     "      clearTimeout(scriptTimer);\n      clearInterval(holdPoll);",
     "      clearTimeout(scriptTimer);"),

    ("fail", APP, "handoffTimer left running on unmount",
     "      clearTimeout(handoffTimer);\n      return true;",
     "      return true;"),

    ("fail", APP, "cancel closure no longer returned as effect cleanup",
     "    return cancel;\n  }, [onComplete]);",
     "    return () => {};\n  }, [onComplete]);"),

    # --------------------------------------------------------- the sunrise --
    ("fail", DUNE, "intro ramp ungated, spending the 3.6s sunrise behind the splash",
     "    if (active) {",
     "    if (true) {"),

    # ---------------------------------------------------------- the reveal --
    ("fail", HOME, "scale added to the reveal, resampling the HDR canvas soft",
     "initial={{ opacity: 0, y: reducedMotion ? '0vh' : '3vh' }}",
     "initial={{ opacity: 0, scale: 0.98, y: reducedMotion ? '0vh' : '3vh' }}"),

    ("fail", HOME, "a unitless 0 mixed in with the vh keyframes",
     "? { opacity: 1, y: '0vh' }",
     "? { opacity: 1, y: 0 }"),

    ("fail", HOME, "the rise inverted, uncovering sand-coloured gradient at the bottom",
     "y: reducedMotion ? '0vh' : '3vh' }",
     "y: reducedMotion ? '0vh' : '-3vh' }"),

    ("fail", HOME, "reduced-motion branch removed from the rise",
     "initial={{ opacity: 0, y: reducedMotion ? '0vh' : '3vh' }}",
     "initial={{ opacity: 0, y: '3vh' }}"),

    ("fail", HOME, "overflow clip dropped, so the canvas overhangs while rising",
     "          overflow: 'hidden',\n",
     ""),

    ("fail", HOME, "bridge gradient moved above the canvas instead of beneath it",
     "        <DuneSeaFallback />\n",
     ""),

    # -------------------------------------------------- the code-split trap --
    ("fail", FALL, "three imported into the fallback, dragging it into the main bundle",
     "export default function DuneSeaFallback() {",
     "import * as THREE from 'three';\n\nexport default function DuneSeaFallback() {"),

    ("fail", DUNE, "the re-export dropped, breaking any import that still used it",
     "export { default as DuneSeaFallback } from './DuneSeaFallback';",
     ""),

    ("fail", DUNE, "active loses its default, so HeroPreviewPage's sunrise never runs",
     "export default function DuneSea({ active = true, onPainted, scrollY }) {",
     "export default function DuneSea({ active, onPainted, scrollY }) {"),

    # ------------------------------------------------- the rebuilt splash --
    ("fail", APP, "sealed set outside handOff before the readiness gates",
     "      if (worldReadyRef.current) {",
     "      setSealed(true);\n      if (worldReadyRef.current) {"),

    ("fail", APP, "SplashScene's sealed prop severed from handOff",
     "<SplashScene sealed={sealed}",
     "<SplashScene sealed={false}"),

    ("fail", APP, "SplashScene's painted callback severed",
     "onPainted={handleScenePainted}",
     "onPainted={undefined}"),

    ("fail", APP, "SplashScene loses the reduced-motion preference",
     "<SplashScene sealed={sealed} reduceMotion={reduceMotion}",
     "<SplashScene sealed={sealed}"),

    ("fail", APP, "sceneReady no longer requires the scene's own paint",
     "const sceneReady = () => scenePaintedRef.current\n        && performance.now()",
     "const sceneReady = () => performance.now()"),

    ("fail", APP, "sceneReady skips the minimum time since first paint",
     "performance.now() - scenePaintedAtRef.current >= SPLASH_FLOOR_MS",
     "performance.now() - scenePaintedAtRef.current >= 0"),

    ("fail", APP, "poll hands off without the world being ready",
     "if (!worldReadyRef.current || !sceneReady()) return;",
     "if (!sceneReady()) return;"),

    ("fail", APP, "paint callback no longer records its timestamp",
     "    scenePaintedAtRef.current = performance.now();\n",
     ""),

    ("fail", APP, "old fallback visual reintroduced inside SplashScreen",
     '      <h1 className="intro-title">AXIS27</h1>',
     '      <DuneSeaFallback />\n      <h1 className="intro-title">AXIS27</h1>'),

    ("fail", APP, "old eclipse and seam anchor reintroduced inside SplashScreen",
     '      <h1 className="intro-title">AXIS27</h1>',
     '      <div className="splash-eclipse" style={{ top: "var(--seam-y)" }} />\n      <h1 className="intro-title">AXIS27</h1>'),

    ("fail", APP, "progress bar reintroduced inside SplashScreen",
     '      <h1 className="intro-title">AXIS27</h1>',
     '      <progress value={1} max={1} />\n      <h1 className="intro-title">AXIS27</h1>'),

    ("fail", APP, "intro-dismiss replaced by a non-button element",
     ['            className="intro-dismiss"\n          >\n            Enter site\n          </button>'],
     ['            className="intro-dismiss"\n          >\n            Enter site\n          </div>']),

    ("fail", APP, "a full-viewport blur back on the splash exit",
     "      exit={{ opacity: 0 }}",
     "      exit={{ opacity: 0, filter: 'blur(18px)' }}"),

    # ------------------------------------------------------- the seam ------
    # A move, not a deletion. The element keeps every attribute and still
    # renders; it just acquires a transformed ancestor, which silently makes
    # that ancestor the containing block for position:fixed.
    ("fail", APP, "the ember seam moved inside the transformed route wrapper",
     ["      {location.pathname !== \'/\' && <div className=\"ember-seam\" aria-hidden=\"true\" />}\n",
      "        <a href=\"#main-content\" className=\"skip-link\">Skip to content</a>\n"],
     ["",
      "        <a href=\"#main-content\" className=\"skip-link\">Skip to content</a>\n        {location.pathname !== \'/\' && <div className=\"ember-seam\" aria-hidden=\"true\" />}\n"]),

    ("fail", APP, "the seam keyed by route, restarting its 14s breath on every navigation",
     "<div className=\"ember-seam\" aria-hidden=\"true\" />",
     "<div key={location.pathname} className=\"ember-seam\" aria-hidden=\"true\" />"),

    ("fail", APP, "the seam drawn on the home page too, doubling the hero horizon",
     "{location.pathname !== \'/\' && <div className=\"ember-seam\"",
     "{true && <div className=\"ember-seam\""),

    ("fail", CSS, "the seam switched to absolute, so it scrolls off with the document",
     ".ember-seam {\n  position: fixed;",
     ".ember-seam {\n  position: absolute;"),

    ("fail", CSS, "the seam's breath hoisted out of the reduced-motion guard",
     "@media (prefers-reduced-motion: no-preference) {\n  .ember-seam {\n    animation: seam-breathe 14s var(--ease-in-out) infinite;\n  }\n}",
     ".ember-seam {\n  animation: seam-breathe 14s var(--ease-in-out) infinite;\n}"),

    ("fail", CSS, "route content dropped below the seam, drawing an ember line across body copy",
     ".route-shell {\n  position: relative;\n  z-index: 1;\n}",
     ".route-shell {\n  position: relative;\n  z-index: -1;\n}"),

    # ------------------------------------------------------ honest boundary --
    ("miss", HOME, "cross-fade slowed to 6s — correct, connected, and far too slow",
     "transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}",
     "transition={{ duration: 6.0, ease: [0.22, 1, 0.36, 1] }}"),

    ("miss", FALL, "bridge gradient recoloured to pure black, so the fade is visible",
     "linear-gradient(to bottom, #04060F 0%",
     "linear-gradient(to bottom, #000000 0%"),
]


def run_checks():
    rc, out = 0, []
    for cmd in CHECKS:
        r = subprocess.run(cmd, capture_output=True, text=True)
        rc = rc or r.returncode
        out.append(r.stdout + r.stderr)
    return rc, "\n".join(out)


backups = {p: p.read_text(encoding="utf-8") for p in TARGETS}

base_rc, base_out = run_checks()
if base_rc != 0:
    print("baseline is already failing — fix that first:")
    print(base_out)
    sys.exit(1)
print("baseline: clean\n")

ok = stale = 0
for expect, path, name, old, new in MUTANTS:
    src = backups[path]
    pairs = list(zip(old, new)) if isinstance(old, list) else [(old, new)]
    absent = [o for o, _ in pairs if o not in src]
    if absent:
        print(f"  STALE  {name}\n           -> anchor gone from {path.name}; "
              f"this mutant is testing nothing")
        stale += 1
        continue
    mutated = src
    for o, n in pairs:
        mutated = mutated.replace(o, n, 1)
    path.write_text(mutated, encoding="utf-8")
    r_rc, r_out = run_checks()
    path.write_text(src, encoding="utf-8")

    failed = r_rc != 0
    detail = next((l.strip() for l in r_out.splitlines()
                   if "FAIL" in l or "Error" in l), "")
    if expect == "fail":
        good = failed
        label = "caught" if good else "MISSED"
    else:
        good = not failed
        label = "missed (expected)" if good else "UNEXPECTEDLY CAUGHT"

    print(f"  {label:<17} {name}")
    if detail:
        print(f"                    -> {detail[:150]}")
    ok += good

for p in TARGETS:
    p.write_text(backups[p], encoding="utf-8")
    assert p.read_text(encoding="utf-8") == backups[p], f"restore failed: {p}"

print(f"\n{ok}/{len(MUTANTS)} mutants behaved as specified.")
if stale:
    print(f"{stale} STALE anchor(s) — re-anchor them or the suite is lying.")
    sys.exit(1)
if ok != len(MUTANTS):
    sys.exit(1)
print("The two expected misses are the honest limit: pacing and colour match "
      "need a real browser.")
