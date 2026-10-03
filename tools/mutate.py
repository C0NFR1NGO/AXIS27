#!/usr/bin/env python3
"""Mutation test for verify_direction.py.

A static checker that passes tells you nothing unless you know it can fail.
This injects bugs of exactly the kinds the checker claims to catch, one at a
time, and asserts each one is caught.

Re-anchored after the sand/sunrise/moon rewrite. Five of the previous seven
mutants had gone stale — they anchored on uContourStep, lineAt's fwidth
division, and the old subtract-a-disc moon, none of which exist any more. A
stale mutant SKIPs rather than fails, which is the worst possible outcome for
a test harness: it looks like it ran.

Each mutant declares what it expects, because not every defect class is a
hard failure and one of them is a defect the checker provably cannot see:

  fail  the checker must exit nonzero
  warn  the checker must print a warning but still exit zero
  miss  a real quality regression that no static check can catch. Kept
        deliberately, as the honest boundary of what this proves.
"""
import shutil, subprocess, sys
from pathlib import Path

TARGET = Path(__file__).resolve().parent.parent / "src" / "components" / "DuneSea.jsx"
BACKUP = Path("/tmp/DuneSea.jsx.bak")
OUT = str(Path(__file__).resolve().parent.parent / "tools")

# Both checkers, because they cover different things and a mutant should be
# caught by whichever one owns it. verify_direction is structural — braces,
# uniforms, names. verify_constellations is geometric — does the figure fit in
# the frame, does a star crowd a moon, does the wrong tier cross the bloom
# threshold. Running only the first is what made an off-frame placement look
# like an unavoidable blind spot when it is in fact fully covered.
CHECKS = [
    ["python3", f"{OUT}/verify_direction.py"],
    ["python3", f"{OUT}/verify_constellations.py"],
    ["python3", f"{OUT}/verify_sky_motion.py"],
    ["python3", f"{OUT}/verify_frame_fit.py"],
]


def run_checks():
    """Run every checker; fail if any fails. Returns (rc, combined stdout)."""
    rc, out = 0, []
    for cmd in CHECKS:
        r = subprocess.run(cmd, capture_output=True, text=True)
        rc = rc or r.returncode
        out.append(r.stdout + r.stderr)
    return rc, "\n".join(out)

MUTANTS = [
    ("fail", "GLSL closing brace dropped",
     "    gl_FragColor = vec4(col * uExposure, 1.0);\n  }\n`;\n\nconst SKY_VERT",
     "    gl_FragColor = vec4(col * uExposure, 1.0);\n`;\n\nconst SKY_VERT"),

    ("fail", "stray backtick in a shader comment (the real bug this once found)",
     "     * Everything that has to hold a fixed pixel size — stars, both moon",
     "     * Everything that has to hold a fixed `apx` pixel size — stars, both moon"),

    ("fail", "uniform declared in GLSL but never fed from JS",
     "  uniform float uShadowBase;",
     "  uniform float uShadowBase;\n  uniform float uBogusStep;"),

    ("fail", "fragment reads a varying the vertex stage never declares",
     "  uniform vec3 uSkyPole;\n  uniform float uSkyRot;\n  varying vec3 vDir;",
     "  uniform vec3 uSkyPole;\n  uniform float uSkyRot;\n  varying vec3 vDir;"
     "\n  varying float vGhost;"),

    ("fail", "varying declared in the vertex stage but never assigned there",
     "const SKY_VERT = /* glsl */ `\n  varying vec3 vDir;\n  void main() {",
     "const SKY_VERT = /* glsl */ `\n  varying vec3 vDir;\n  varying float vUnset;\n  void main() {"),

    ("fail", "attribute never registered with setAttribute",
     "  attribute float aPhase;",
     "  attribute float aPhase;\n  attribute float aOrphan;"),

    ("fail", "unbalanced paren in JS",
     "const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear();",
     "const lin = (hex) => new THREE.Color(hex.convertSRGBToLinear();"),

    # The two below are not hypotheticals. Both shipped, in the same sitting,
    # from the same cause: an edit anchored on a block of code plus the line
    # that happened to follow it, and the replacement rebuilt the code and
    # dropped the neighbour. The checker passed clean on both. It no longer
    # does, and these are here so that stays true.
    ("fail", "helper deleted by an edit whose anchor swallowed it (shipped once)",
     "const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear();",
     "// const lin was here"),

    ("fail", "block-comment opener deleted, orphaning its continuation lines "
             "(shipped once)",
     "/* Idle drift plus a scroll dolly. Dune's sandwalk is deliberately\n",
     ""),

    ("fail", "constellation star gain fed a uniform nothing supplies",
     "  uniform float uFade;\n  varying float vMag;\n  varying float vTw;",
     "  uniform float uFade;\n  uniform float uTwinkleRate;\n  varying float vMag;"
     "\n  varying float vTw;"),

    ("warn", "JS supplies a uniform no shader declares (stale key after a rename)",
     "    uMoonDirB: { value: MOON_DIR_B.clone() },",
     "    uMoonDirB: { value: MOON_DIR_B.clone() },\n"
     "    uMoonDirBogus: { value: MOON_DIR_B.clone() },"),

    ("fail", "the width gate creeps back into useFallback (the original mobile bug)",
     "      useFallback: !webgl2,",
     "      useFallback: !webgl2 || narrow,"),

    ("fail", "azFit scales the ANGLE instead of its tangent, so wide azimuths drift",
     "  return Math.atan(Math.tan(azDeg * D2R) * fit) / D2R;",
     "  return azDeg * fit;"),

    ("fail", "the star geometry memo stops depending on aspect, so a rotation "
             "keeps the landscape buffers",
     "  }, [aspect]);",
     "  }, []);"),

    ("fail", "the moon disc stops scaling with the frame, so its limb clips a phone",
     "    col += moonBody(d, normalize(uMoonDir),  0.040 * uMoonScale, L, apx, 0.85) * mFade;",
     "    col += moonBody(d, normalize(uMoonDir),  0.040, L, apx, 0.85) * mFade;"),

    ("fail", "useFittedMoons early-returns, so nothing is fitted and both the "
             "disc and the moonlight revert to their 4:3 placement",
     "function useFittedMoons(uniforms) {",
     "function useFittedMoons(uniforms) {\n  return;"),

    ("miss", "regolith backscatter reverted to Lambert (real, invisible to statics)",
     "    float lit = pow(max(dot(n, L), 0.0), 0.55);",
     "    float lit = max(dot(n, L), 0.0);"),

    ("fail", "a constellation moved off-frame at 4:3 (the narrow-window trap)",
     "    place: { az: 2.0, elev: 18.5, roll: 8, scale: 0.8 },",
     "    place: { az: 35.0, elev: 18.5, roll: 8, scale: 0.8 },"),

    ("fail", "star gain nudged so a third star crosses the bloom threshold",
     "    float gain = 0.019 + vMag * 0.414;",
     "    float gain = 0.126 + vMag * 0.306;"),

    # The motion mutants. All four are sign or peak errors: they compile, they
    # animate, and the render looks plausible until you watch it for a while.
    # Exactly the class that a static checker has to own, because "looks fine
    # in a screenshot" is the failure mode.
    ("fail", "sidereal drift sign flipped in the shader, so the procedural field "
             "drifts opposite to the named figures",
     "vec3 ds = rotAxis(d, uSkyPole, -uSkyRot);",
     "vec3 ds = rotAxis(d, uSkyPole, uSkyRot);"),

    ("fail", "drift reversed to run east, into the 7.7 deg side of the frame "
             "instead of the 19.4 deg side",
     "const SKY_SPIN = 0.1 * D2R;",
     "const SKY_SPIN = -0.1 * D2R;"),

    ("fail", "twinkle made to modulate the halo's PEAK rather than its exponent, "
             "which silently renegotiates the bloom set",
     "            + pow(1.0 - r, he) * 0.5;",
     "            + pow(1.0 - r, 2.4) * 0.5 * (0.6 + 0.4 * vTw);"),

    ("fail", "constellation dim inverted so the twinkle brightens past the peak",
     "float dim = 1.0 - 0.16 * (0.5 - 0.5 * vTw);",
     "float dim = 1.0 + 0.16 * (0.5 - 0.5 * vTw);"),

    ("fail", "meteor tangent no longer forced downward, so streaks climb",
     "    .addScaledVector(e2, -Math.abs(Math.sin(th)));",
     "    .addScaledVector(e2, Math.sin(th));"),

    ("fail", "meteor gain dropped below the bloom threshold, leaving a 1px scratch",
     "gl_FragColor = vec4(uStarCol * vMag * 0.9 * uFade * uExposure, 1.0);",
     "gl_FragColor = vec4(uStarCol * vMag * 0.5 * uFade * uExposure, 1.0);"),

    ("fail", "point size swing widened until the faintest star flickers "
             "sub-pixel at DPR 1",
     "gl_PointSize = (2.4 + aMag * 4.0) * (1.0 + vTw * 0.12) * uPixelRatio;",
     "gl_PointSize = (2.4 + aMag * 4.0) * (1.0 + vTw * 0.72) * uPixelRatio;"),
]

shutil.copy(TARGET, BACKUP)
src = BACKUP.read_text(encoding="utf-8")

base_rc, base_out = run_checks()
if base_rc != 0:
    print("baseline is already failing — fix that first:")
    print(base_out)
    sys.exit(1)
base_warns = {l for l in base_out.splitlines() if "warn" in l}
print(f"baseline: clean ({len(base_warns)} pre-existing warning(s))\n")

ok = stale = bad = 0
for expect, name, old, new in MUTANTS:
    if old not in src:
        print(f"  STALE  {name}\n           -> anchor no longer in the file; "
              f"this mutant is testing nothing")
        stale += 1
        continue
    TARGET.write_text(src.replace(old, new, 1), encoding="utf-8")
    r_rc, r_out = run_checks()
    TARGET.write_text(src, encoding="utf-8")

    failed = r_rc != 0
    new_warns = {l for l in r_out.splitlines() if "warn" in l} - base_warns
    detail = next((l.strip() for l in r_out.splitlines() if ("FAIL" in l or "Error" in l)),
                  next(iter(sorted(new_warns)), "")).strip()

    if expect == "fail":
        good = failed
        label = "caught" if good else "MISSED"
    elif expect == "warn":
        good = (not failed) and bool(new_warns)
        label = "warned" if good else ("MISSED" if not failed else "OVER-FAILED")
    else:  # miss
        good = not failed and not new_warns
        label = "missed (expected)" if good else "UNEXPECTEDLY CAUGHT"

    print(f"  {label:<17} {name}")
    if detail:
        print(f"                    -> {detail}")
    ok += good
    bad += not good

shutil.copy(BACKUP, TARGET)
assert TARGET.read_text(encoding="utf-8") == src, "restore failed — check the backup"

print(f"\n{ok}/{len(MUTANTS)} mutants behaved as specified.")
if stale:
    print(f"{stale} stale anchor(s) — re-anchor them or the suite is lying.")
if bad:
    print("Mismatches above are the checker's real blind spots.")
    sys.exit(1)
print("The one expected miss is the honest limit: shading quality, camera "
      "framing and anything needing a GPU still require npm run dev.")
