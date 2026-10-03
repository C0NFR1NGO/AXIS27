"""Verifies the portrait framing solve in DuneSea.jsx.

The bug this exists to prevent from coming back: the hero was switched off
entirely below 768px with `useFallback: !webgl2 || narrow`, and that gate was
covering for a framing bug rather than a capability one. Every azimuth in the
file sits between 17 and 29 degrees, and a portrait phone only sees +/-12.7
horizontally, so both moons and all three constellations were outside the frame.

Two halves, and both are needed:

  SOURCE SHAPE  - that the file still does what this checker assumes. A Python
                  reimplementation of a formula only tests the reimplementation;
                  the lesson from the meteor sweep is that the assertions have
                  to be anchored to the real text as well.

  GEOMETRY      - the fit swept across real device aspects: stars in frame,
                  moons in frame, moon clearance, text-box clearance, and star
                  separation against the sprite size.

Plus the one invariant the whole design rests on: NDC x is PRESERVED across
aspect. If that drifts, the fit is not doing its job even when nothing clips.
"""
import math, re, ast, sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src" / "components" / "DuneSea.jsx"
src = SRC.read_text(encoding="utf-8")

FAILURES = []


def check(label, ok, detail=""):
    print(f"  [{'ok ' if ok else 'FAIL'}] {label}" + (f"  -- {detail}" if detail else ""))
    if not ok:
        FAILURES.append(label)


def nocomments(t):
    """Blank comments but keep line structure, so a rule is never satisfied by
    the paragraph that documents the rule. This has bitten before."""
    t = re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), t, flags=re.S)
    return re.sub(r"//[^\n]*", "", t)


code = nocomments(src)

# ====================================================================== #
# PART 1 - SOURCE SHAPE
# ====================================================================== #
print("\nsource shape (the file must still do what the geometry below assumes)")

check("the width gate is gone from useFallback",
      re.search(r"useFallback:\s*!webgl2\s*,", code) is not None
      and re.search(r"useFallback:[^,\n]*narrow", code) is None,
      "narrow must never decide capability, only quality")

check("narrow still drives the quality tier",
      re.search(r"lowPower:[^,\n]*narrow", code) is not None)

check("a handheld dpr tier exists and is tighter than lowPower",
      re.search(r"handheld:\s*coarse\s*&&\s*narrow", code) is not None
      and re.search(r"dpr=\{\[1,\s*caps\.handheld\s*\?\s*1\.25", code) is not None)

check("frameFit collapses to the aspect ratio, clamped at 1",
      re.search(r"return Math\.min\(1,\s*Math\.max\(aspect,\s*0?\.\d+\)\s*/\s*FIT_REF_ASPECT\)",
                code) is not None,
      "tan(vHalf) cancels, so the factor is aspect/(4:3)")

check("azFit scales the TANGENT of the azimuth, not the azimuth",
      re.search(r"Math\.atan\(Math\.tan\(azDeg \* D2R\) \* fit\) / D2R", code) is not None,
      "NDC x goes as tan(az); scaling the angle drifts ~1 deg out at 29")

check("fitDir round-trips through azimuth and leaves elevation alone",
      re.search(r"function fitDir\(dir, fit\)", code) is not None
      and re.search(r"Math\.asin\(THREE\.MathUtils\.clamp\(dir\.y", code) is not None
      and re.search(r"Math\.atan\(Math\.tan\(Math\.atan2\(dir\.x, -dir\.z\)\) \* fit\)",
                    code) is not None,
      "vFOV does not depend on aspect, so elevation has nothing to correct")

check("Constellations iterates fittedFigures(aspect), not CONSTELLATIONS",
      re.search(r"for \(const cst of fittedFigures\(aspect\)\)", code) is not None
      and re.search(r"for \(const cst of CONSTELLATIONS\)", code) is None)

check("the star geometry memo depends on aspect",
      re.search(r"return \[sg, lg\];\s*\n\s*\}, \[aspect\]\);", code) is not None,
      "otherwise a rotation keeps the landscape buffers")

check("aspect is read as a ratio, not as width and height",
      len(re.findall(r"useThree\(\(s\) => s\.size\.width / s\.size\.height\)", code)) >= 3,
      "an address bar sliding away must not rebuild anything")

# Both materials that consume a moon direction must be fitted: the disc and the
# light have to agree or the highlight lands on the wrong side of every crest.
moon_users = re.findall(r"uMoonDir:\s*\{ value: MOON_DIR([^}]*)\}", code)
check("every uMoonDir is a clone, never the shared module const",
      len(moon_users) >= 2 and all(".clone()" in m for m in moon_users),
      f"found {len(moon_users)} declarations")
fitted_calls = len(re.findall(r"^\s*useFittedMoons\(uniforms\);", code, re.M))
check("useFittedMoons is called by both Sky and Terrain", fitted_calls == 2,
      f"found {fitted_calls}")

# Two assertions the geometry sweep in PART 3 physically cannot make. It computes
# the fitted moon radius in Python, so it stays green when the shader stops
# applying the fit -- lesson (1) from the harness: a check that reimplements
# source logic tests the reimplementation. Both of these were found by mutants
# that the sweep waved through.
calls = re.findall(r"moonBody\(d, normalize\(uMoonDirB?\),\s*([^,]+),", code)
scaled = [c for c in calls if "* uMoonScale" in c]
check("both moon discs scale their radius by uMoonScale",
      len(calls) == 2 and len(scaled) == 2,
      f"{len(scaled)} of {len(calls)} scaled -- a fixed angular radius is a third of a phone screen wide")

body = re.search(r"function useFittedMoons\(uniforms\) \{(.*?)\n\}", code, re.S)
bt = body.group(1) if body else ""
check("useFittedMoons actually writes all three uniforms",
      body is not None
      and "uniforms.uMoonDir.value.copy(fitDir(" in bt
      and "uniforms.uMoonDirB.value.copy(fitDir(" in bt
      and re.search(r"uniforms\.uMoonScale\.value = fit", bt) is not None
      and re.search(r"^\s*return\s*;", bt, re.M) is None,
      "counting the call sites is not enough; the hook has to do the work")

check("meteors spawn through the fit at both call sites",
      len(re.findall(r"spawnMeteor\([^;]*fit\.current\)", code)) == 2,
      "initial pool and respawn")
check("the meteor fit lives in a ref, seeded at first render",
      re.search(r"const fit = useRef\(frameFit\(aspect\)\)", code) is not None,
      "respawns happen inside useFrame, where a render value is stale")

# The camera FOV is the input to the whole derivation, so a change to it
# invalidates every number in this file.
m = re.search(r"camera=\{\{ position: \[0, CAM_Y, 34\], fov: (\d+)", code)
check("camera vFOV is still 52", m is not None and m.group(1) == "52",
      f"found {m.group(1) if m else 'nothing'} -- if this changed, re-solve everything")

# ====================================================================== #
# PART 2 - parse the data and the constants out of the file
# ====================================================================== #
block = src[src.index("const CONSTELLATIONS = ["):]
block = block[: block.index("\n];") + 3]
body = block[block.index("["):]
body = re.sub(r"//[^\n]*", "", body)
body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
body = re.sub(r"(\w+):", r"'\1':", body)
CONSTELLATIONS = ast.literal_eval(body.rstrip().rstrip(";"))

FIT_REF_ASPECT = eval(re.search(r"const FIT_REF_ASPECT = ([^;]+);", code).group(1))
FIT_SOLO_ASPECT = float(re.search(r"const FIT_SOLO_ASPECT = ([\d.]+);", code).group(1))
FIT_PORTRAIT_REF = eval(re.search(r"const FIT_PORTRAIT_REF = ([^;]+);", code).group(1))
print(f"\nparsed: FIT_REF_ASPECT {FIT_REF_ASPECT:.4f}, FIT_SOLO_ASPECT {FIT_SOLO_ASPECT}, "
      f"FIT_PORTRAIT_REF {FIT_PORTRAIT_REF:.4f}")

solo = [c for c in CONSTELLATIONS if "portrait" in c]
check("exactly one figure carries a portrait solve", len(solo) == 1,
      f"{[c['name'] for c in solo]}")
check("the portrait figure is Orion", bool(solo) and solo[0]["name"] == "Orion",
      "a lone Cassiopeia is five unrelated dots")

D2R = math.pi / 180
PITCH, VFOV = -3.8, 52.0
tan_v = math.tan(math.radians(VFOV / 2))
MOONS = {"A": (-0.4657, 0.2871, -0.8371), "B": (0.4812, 0.1219, -0.8681)}
MOON_ANG = 2.1          # angular radius on screen, degrees
SPRITE_ANG = 0.21       # star point sprite, degrees across


def norm(v):
    m = math.sqrt(sum(x * x for x in v))
    return [x / m for x in v]


def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def plate_dir(place, px, py):
    az, el = place["az"] * D2R, place["elev"] * D2R
    c = [math.sin(az) * math.cos(el), math.sin(el), -math.cos(az) * math.cos(el)]
    right = norm(cross(c, [0, 1, 0]))
    up = norm(cross(right, c))
    r = place.get("roll", 0) * D2R
    s = place.get("scale", 1) * D2R
    x = (px * math.cos(r) - py * math.sin(r)) * s
    y = (px * math.sin(r) + py * math.cos(r)) * s
    return norm([c[i] + right[i] * math.tan(x) + up[i] * math.tan(y) for i in range(3)])


def ndc(d, aspect):
    p = math.radians(PITCH)
    y = d[1] * math.cos(p) + d[2] * math.sin(p)
    z = -d[1] * math.sin(p) + d[2] * math.cos(p)
    if z >= -1e-6:
        return 9.9, 9.9
    return (d[0] / -z) / (tan_v * aspect), (y / -z) / tan_v


def ang_between(a, b):
    return math.degrees(math.acos(max(-1, min(1, sum(a[i] * b[i] for i in range(3))))))


# --- the fit, mirroring the JS ---------------------------------------------
def frame_fit(aspect):
    return min(1.0, max(aspect, 0.2) / FIT_REF_ASPECT)


def az_fit(az_deg, fit):
    return math.degrees(math.atan(math.tan(az_deg * D2R) * fit))


def fit_dir(d, fit):
    el = math.asin(max(-1, min(1, d[1])))
    az = math.atan(math.tan(math.atan2(d[0], -d[2])) * fit)
    return [math.sin(az) * math.cos(el), math.sin(el), -math.cos(az) * math.cos(el)]


def fitted_figures(aspect):
    if aspect < FIT_SOLO_ASPECT:
        p = min(1.0, aspect / FIT_PORTRAIT_REF)
        return [dict(c, place=dict(c["portrait"],
                                   az=az_fit(c["portrait"]["az"], p),
                                   scale=c["portrait"].get("scale", 1) * p))
                for c in CONSTELLATIONS if "portrait" in c]
    f = frame_fit(aspect)
    return [dict(c, place=dict(c["place"],
                              az=az_fit(c["place"]["az"], f),
                              scale=c["place"].get("scale", 1) * f))
            for c in CONSTELLATIONS]


# The lockup is a DOM element, so its box is fixed in SCREEN space rather than
# in angle. The az/elev boxes the landscape solve used were measured at 4:3, so
# they get converted at 4:3; the portrait box is a deliberately generous
# estimate, because a clamp()-sized wordmark fills most of a phone's width and
# the exact figure needs a measurement on a real device.
def box_ndc(a0, a1, e0, e1, aspect):
    xs, ys = [], []
    for a in (a0, a1):
        for e in (e0, e1):
            d = [math.sin(a * D2R) * math.cos(e * D2R), math.sin(e * D2R),
                 -math.cos(a * D2R) * math.cos(e * D2R)]
            x, y = ndc(d, aspect)
            xs.append(x)
            ys.append(y)
    return min(xs), max(xs), min(ys), max(ys)


LAND_BOXES = {"eyebrow": box_ndc(-11, 11, 6.4, 8.2, 4 / 3),
              "wordmark": box_ndc(-22, 22, -0.2, 5.4, 4 / 3)}
PORT_BOX = {"lockup (estimated)": (-0.90, 0.90, 0.05, 0.45)}

DEVICES = [
    (21 / 9, "21:9 ultrawide"),
    (16 / 9, "16:9 laptop"),
    (3 / 2, "3:2 surface"),
    (4 / 3, "4:3 reference"),
    (1.0, "1:1 split screen"),
    (768 / 1024, "iPad portrait"),
    (0.70, "just above solo"),
    (0.685, "just below solo"),
    (375 / 667, "iPhone SE"),
    (390 / 844, "iPhone 14"),
    (412 / 915, "Pixel 7"),
    (280 / 653, "Fold, closed"),
    (0.35, "absurdly tall"),
]

# ====================================================================== #
# PART 3 - GEOMETRY across every device aspect
# ====================================================================== #
print("\ngeometry swept across device aspects")
print(f"  {'aspect':>7} {'device':<17} {'hHalf':>6} {'figs':>4} "
      f"{'max|x|':>7} {'max|y|':>7} {'moonGap':>8} {'minSep':>7}  verdict")

ndc_x_ref = {}
rows = []
for aspect, tag in DEVICES:
    figs = fitted_figures(aspect)
    fit = frame_fit(aspect)
    hhalf = math.degrees(math.atan(tan_v * aspect))
    problems = []

    mx = my = 0.0
    stars = []          # (direction, ndc, label)
    for cst in figs:
        for i, (px, py, _m) in enumerate(cst["stars"]):
            d = plate_dir(cst["place"], px, py)
            x, y = ndc(d, aspect)
            mx, my = max(mx, abs(x)), max(my, abs(y))
            stars.append((d, (x, y), f"{cst['name']}[{i}]"))
            if abs(x) > 1 or abs(y) > 1:
                problems.append(f"{cst['name']}[{i}] off frame ({x:+.2f},{y:+.2f})")

    # Moons, fitted. Their limb has to clear the edge too, not just their centre.
    moon_ang = MOON_ANG * fit          # uMoonScale, so the disc holds its screen size
    limb = moon_ang / max(hhalf, 1e-6)
    for name, mraw in MOONS.items():
        md = fit_dir(norm(list(mraw)), fit)
        x, y = ndc(md, aspect)
        if abs(x) + limb > 1 or abs(y) + moon_ang / math.degrees(math.atan(tan_v)) > 1:
            problems.append(f"moon {name} limb off frame ({x:+.3f},{y:+.3f})")
        if name == "A":
            ndc_x_ref[aspect] = x

    # Star-to-moon clearance, against the fitted moons.
    gap = 999.0
    for name, mraw in MOONS.items():
        md = fit_dir(norm(list(mraw)), fit)
        for d, _n, lbl in stars:
            g = ang_between(d, md) - moon_ang
            if g < gap:
                gap, who = g, f"moon {name} <-> {lbl}"
    if gap <= 3.0:
        problems.append(f"star crowding a moon: {gap:.1f} deg ({who})")

    # Separation within a figure, against the sprite size. This is the check
    # that justifies FIT_SOLO_ASPECT existing at all.
    sep = 999.0
    for cst in figs:
        ds = [plate_dir(cst["place"], px, py) for px, py, _m in cst["stars"]]
        for i in range(len(ds)):
            for j in range(i + 1, len(ds)):
                sep = min(sep, ang_between(ds[i], ds[j]))
    if sep < 3 * SPRITE_ANG:
        problems.append(f"figure unreadable: {sep:.2f} deg between stars "
                        f"(< 3 sprites = {3 * SPRITE_ANG:.2f})")

    # Text boxes, in NDC so the test is aspect-honest.
    boxes = PORT_BOX if aspect < FIT_SOLO_ASPECT else LAND_BOXES
    for d, (x, y), lbl in stars:
        for bn, (x0, x1, y0, y1) in boxes.items():
            if x0 <= x <= x1 and y0 <= y <= y1:
                problems.append(f"{lbl} inside {bn}")

    rows.append((aspect, tag, problems))
    print(f"  {aspect:7.3f} {tag:<17} {hhalf:6.1f} {len(figs):4d} "
          f"{mx:7.3f} {my:7.3f} {gap:8.1f} {sep:7.2f}  "
          f"{'ok' if not problems else 'FAIL: ' + '; '.join(problems)}")

check("every aspect is clean", all(not p for _a, _t, p in rows),
      f"{sum(1 for _a, _t, p in rows if p)} of {len(rows)} aspects have problems")

# ====================================================================== #
# PART 4 - the invariant
# ====================================================================== #
print("\nNDC x preservation for moon A (the point of the fit)")
ref = ndc_x_ref[4 / 3]
worst, wide = 0.0, []
for aspect, tag in DEVICES:
    x = ndc_x_ref[aspect]
    drift = abs(x - ref)
    scope = "clamped" if aspect > FIT_REF_ASPECT else "fitted"
    if aspect > FIT_REF_ASPECT:
        wide.append((aspect, abs(x)))
    else:
        worst = max(worst, drift)
    print(f"  {aspect:7.3f} {tag:<17} ndc x {x:+.4f}   drift {drift:.4f}  ({scope})")
check("moon A holds its place at and below the 4:3 reference", worst < 0.02,
      f"worst drift {worst:.4f} of NDC (ref {ref:+.4f} at 4:3)")
# Above the reference the fit is clamped at 1 deliberately, so the correct claim
# is not preservation but that widening only ever adds margin.
wide.sort()
check("wider than 4:3 only ever gains margin",
      all(wide[i][1] < wide[i - 1][1] for i in range(1, len(wide)))
      and (not wide or wide[0][1] < abs(ref)),
      "; ".join(f"{a:.2f}->{v:.3f}" for a, v in wide))

# A figure must keep its proportion of the frame width, or the fit is squashing
# rather than fitting. Measured above the solo threshold, where the landscape
# composition is the one being preserved.
print("\nfigure width as a fraction of frame width (constant where the fit is active)")
worst_w = 0.0
for aspect, tag in DEVICES:
    if aspect < FIT_SOLO_ASPECT or aspect > FIT_REF_ASPECT:
        continue
    cst = fitted_figures(aspect)[2]        # Big Dipper, the widest
    xs = [ndc(plate_dir(cst["place"], px, py), aspect)[0] for px, py, _m in cst["stars"]]
    w = max(xs) - min(xs)
    if aspect == 4 / 3:
        ref_w = w
    print(f"  {aspect:7.3f} {tag:<17} Dipper spans {w:.4f} of NDC x")
for aspect, tag in DEVICES:
    if aspect < FIT_SOLO_ASPECT or aspect > FIT_REF_ASPECT:
        continue
    cst = fitted_figures(aspect)[2]
    xs = [ndc(plate_dir(cst["place"], px, py), aspect)[0] for px, py, _m in cst["stars"]]
    worst_w = max(worst_w, abs((max(xs) - min(xs)) - ref_w))
check("the widest figure keeps its share of the frame", worst_w < 0.03,
      f"worst deviation {worst_w:.4f} of NDC vs {ref_w:.4f} at 4:3")

# ====================================================================== #
print("\n" + "=" * 62)
if FAILURES:
    print(f"  {len(FAILURES)} FAILED:")
    for f in FAILURES:
        print(f"    - {f}")
    print("=" * 62)
    sys.exit(1)
print("  All frame-fit checks passed.")
print("=" * 62)
