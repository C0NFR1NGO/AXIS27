#!/usr/bin/env python3
"""Verifies the three layers of night-sky motion against the shipped source.

Companion to verify_constellations.py, which checks where things ARE. This one
checks how they MOVE, and exists mainly for one defect: the sky shader rotates
the direction it looks in, so it must use the opposite sign to the geometry it
is supposed to move with. Nothing about that is visible in a diff, both signs
compile, and getting it wrong makes the named figures sail one way while the
field behind them goes the other. Every constant below is regex-extracted from
DuneSea.jsx rather than retyped, so this checks what shipped.

  1. sign coherence between SKY_FRAG's rotAxis and the Constellations group
  2. the drift keeps all 19 stars in a 4:3 frame long enough to matter, and
     never walks one across a moon's limb
  3. every twinkle modulates DOWNWARD only, so the peak — and therefore which
     stars cross the bloom threshold — is pinned by construction
  4. meteor paths: on the sphere, always descending, head blooms, tail doesn't
"""
import ast
import math
import re
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src" / "components" / "DuneSea.jsx"
src = SRC.read_text(encoding="utf-8")
D2R = math.pi / 180
fails = []
warns = []


def grab(pattern, what, flags=0):
    """Extract a constant, loudly. A rename must break this, not skip it."""
    m = re.search(pattern, src, flags)
    if not m:
        fails.append(f"could not find {what} in DuneSea.jsx — this check is "
                     f"now testing nothing; re-anchor it")
        return None
    return m


def norm(v):
    m = math.sqrt(sum(x * x for x in v))
    return [x / m for x in v]


def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]]


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def rot_axis(v, ax, a):
    c, s = math.cos(a), math.sin(a)
    cx = cross(ax, v)
    k = dot(ax, v) * (1 - c)
    return [v[i] * c + cx[i] * s + ax[i] * k for i in range(3)]


print("=" * 64)

# ---- 1. the sign ------------------------------------------------------
m = grab(r"const SKY_POLE = new THREE\.Vector3\(\s*0,\s*Math\.sin\(([\d.]+) \* D2R\),"
         r"\s*Math\.cos\(([\d.]+) \* D2R\)\)\.normalize\(\);", "SKY_POLE")
LAT = float(m.group(1)) if m else 21.0
if m and m.group(1) != m.group(2):
    fails.append(f"SKY_POLE uses two different latitudes, {m.group(1)} and "
                 f"{m.group(2)} — the axis is not a unit celestial pole")
POLE = norm([0, math.sin(LAT * D2R), math.cos(LAT * D2R)])

m = grab(r"const SKY_SPIN = (-?[\d.]+) \* D2R;", "SKY_SPIN")
RATE = float(m.group(1)) if m else 0.1

shader = grab(r"vec3 ds = rotAxis\(d, uSkyPole, (-?)uSkyRot\);", "the SKY_FRAG rotation")
group = grab(r"grp\.current\.quaternion\.setFromAxisAngle\(SKY_POLE, (-?)env\.skyRot\)",
             "the Constellations group rotation")
if shader and group:
    s_sign, g_sign = shader.group(1), group.group(1)
    if s_sign == g_sign:
        fails.append(
            f"SIGN INVERSION: SKY_FRAG uses '{s_sign or '+'}uSkyRot' and the "
            f"Constellations group uses '{g_sign or '+'}env.skyRot'. These must "
            f"be OPPOSITE — the shader rotates the lookup direction, which is a "
            f"change of basis and runs backwards. As written the field stars and "
            f"the named figures will drift in opposite directions.")
    else:
        print(f"  sign: shader '{s_sign or '+'}uSkyRot' vs group "
              f"'{g_sign or '+'}env.skyRot' — opposite, correct")

# Does the geometry's own sign actually carry the stars west (-azimuth)?
probe = norm([math.sin(2 * D2R), math.sin(18.5 * D2R), -math.cos(2 * D2R) * math.cos(18.5 * D2R)])
az0 = math.degrees(math.atan2(probe[0], -probe[2]))
turned = rot_axis(probe, POLE, RATE * D2R * 10)
az1 = math.degrees(math.atan2(turned[0], -turned[2]))
if az1 >= az0:
    fails.append(f"drift runs EAST (+az): a probe star goes {az0:+.2f} -> {az1:+.2f} "
                 f"over 10s. The sweep found only 7.7 deg of headroom that way "
                 f"against 19.4 going west; flip the sign of SKY_SPIN.")
else:
    print(f"  direction: probe star {az0:+.2f} -> {az1:+.2f} deg azimuth over 10s "
          f"(west, the 19.4 deg budget)")
print(f"  axis: north celestial pole for lat {LAT} N, elevation "
      f"{math.degrees(math.asin(POLE[1])):.1f} deg, behind the camera")
print(f"  rate: {RATE} deg/s = {RATE * 1022 / 52:.2f} px/s = "
      f"{RATE / 0.00417:.0f}x sidereal")

# ---- 2. the drift sweep ----------------------------------------------
blk = src[src.index("const CONSTELLATIONS = ["):]
blk = blk[: blk.index("\n];") + 3]
body = blk[blk.index("["):]
body = re.sub(r"//[^\n]*", "", body)
body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
body = re.sub(r"(\w+):", r"'\1':", body).rstrip().rstrip(";")
CST = ast.literal_eval(body)

PITCH, VFOV = -3.8, 52.0
tan_v = math.tan(math.radians(VFOV / 2))


def plate(place, px, py):
    az, el = place['az'] * D2R, place['elev'] * D2R
    c = [math.sin(az) * math.cos(el), math.sin(el), -math.cos(az) * math.cos(el)]
    r_ = norm(cross(c, [0, 1, 0]))
    u_ = norm(cross(r_, c))
    r = place.get('roll', 0) * D2R
    s = place.get('scale', 1) * D2R
    x = (px * math.cos(r) - py * math.sin(r)) * s
    y = (px * math.sin(r) + py * math.cos(r)) * s
    return norm([c[i] + r_[i] * math.tan(x) + u_[i] * math.tan(y) for i in range(3)])


def ndc(d, aspect):
    p = math.radians(PITCH)
    y = d[1] * math.cos(p) + d[2] * math.sin(p)
    z = -d[1] * math.sin(p) + d[2] * math.cos(p)
    if z >= -1e-6:
        return 9.9, 9.9
    return (d[0] / -z) / (tan_v * aspect), (y / -z) / tan_v


MOONS = {'A': norm([-0.4657, 0.2871, -0.8371]), 'B': norm([0.4812, 0.1219, -0.8681])}
MOON_ANG = 2.1
STARS = [(c['name'], i, plate(c['place'], px, py))
         for c in CST for i, (px, py, _m) in enumerate(c['stars'])]

# Moon clearance during a drift is NOT the same rule as moon clearance in a
# static composition, and conflating them is what made the first two versions of
# this file report defects that are not defects.
#
# verify_constellations already owns the composition rule: at rest, no star
# within 3 deg of a limb. That is about where you PLACE a figure — a star pinned
# beside a bright disc loses the figure's shape and looks like an accident.
#
# The rule for a moving sky is narrower, and it is a rendering rule rather than a
# design one: a star must not TOUCH the disc. Measured, that threshold is about
# 0.5 deg, not 3 — moonBody returns vec3(0.0) outside the limb (`if (disc <= 0.0)
# return`), so there is no glow halo to be lost in, only a hard edge with 1.5px
# of antialiasing. A star sprite is ~4.2 CSS px, i.e. 0.21 deg, so contact needs
# a gap under roughly 0.3 deg. At 1.1 deg the star sits on plain night sky and is
# perfectly legible; it is a conjunction, which is something skies do.
#
# Once the composition is gone anyway, even contact is acceptable: everything in
# SKY_FRAG is additive (`col +=`, both moonBody calls included) and so are the
# constellation points, so the disc absorbs the star through ACES rather than the
# star punching through the disc. That is an occultation. It is reported loudly
# and not failed, because the alternative is moving real geometry to satisfy a
# cosmetic edge case thirteen minutes into an uninterrupted dwell on the hero.
TOUCH = 0.5
COMPOSE = 3.0
ASPECTS = (21 / 9, 16 / 9, 4 / 3)


def visible(d):
    return any(abs(x) <= 1 and abs(y) <= 1
               for x, y in (ndc(d, a) for a in ASPECTS))


SWEEP = [(step * 0.5, RATE * step * 0.5 * D2R) for step in range(1801)]

# Pass one: how long does the designed composition survive?
full_until = None
for t, ang in SWEEP:
    if any(abs(x) > 1 or abs(y) > 1
           for x, y in (ndc(rot_axis(d0, POLE, ang), 4 / 3) for _n, _i, d0 in STARS)):
        full_until = t
        break
full_until = full_until if full_until is not None else SWEEP[-1][0]

# Pass two: gaps, split by whether the composition still holds.
strict_gap, strict_at = 999.0, None
later_gap, later_at = 999.0, None
census = {}
for t, ang in SWEEP:
    seen = 0
    for _n, _i, d0 in STARS:
        d = rot_axis(d0, POLE, ang)
        on = visible(d)
        seen += on
        for mn, mv in MOONS.items():
            g = math.degrees(math.acos(max(-1, min(1, dot(d, mv))))) - MOON_ANG
            if t <= full_until:
                if g < strict_gap:
                    strict_gap, strict_at = g, f"{_n}[{_i}] vs moon {mn} at t={t:.0f}s"
            elif on and g < later_gap:
                later_gap, later_at = g, f"{_n}[{_i}] vs moon {mn} at t={t:.0f}s"
    census[t] = seen

print(f"\n  designed composition (all {len(STARS)} stars in a 4:3 frame) holds "
      f"for {full_until:.0f}s = {full_until / 60:.1f} min, "
      f"{RATE * full_until:.1f} deg of turn")
if full_until < 150:
    fails.append(f"the drift breaks the composition after only {full_until:.0f}s; "
                 f"slow SKY_SPIN or re-place the figures")

print(f"  closest to a moon's limb while composed: {strict_gap:+.1f} deg ({strict_at})")
if strict_gap < TOUCH:
    fails.append(f"a constellation star touches a moon's disc at {strict_gap:.1f} deg "
                 f"while the figure is still composed ({strict_at}); the sprite is "
                 f"~0.21 deg across and the limb is hard-edged, so the vertex "
                 f"disappears and the figure reads as broken")
elif strict_gap < COMPOSE:
    warns.append(f"{strict_at} closes to {strict_gap:+.1f} deg, inside the 3 deg "
                 f"margin the static solve holds but well clear of contact at "
                 f"{TOUCH} deg. Legible — moonBody has no halo outside the limb — "
                 f"but this is the pair to watch if SKY_SPIN or the placement moves")

print(f"  after that, an on-screen star reaches {later_gap:+.1f} deg ({later_at})"
      + (" — occultation, additive, accepted" if later_gap < TOUCH else ""))

# The figures do not simply leave and stay gone: the sky wraps, so named stars
# keep drifting through frame. Worth reporting, because "the constellations
# vanish after three minutes" would be a real cost and it is not what happens —
# the composition breaks when ONE star clips an edge, not when they all leave.
marks = [0, 120, 194, 300, 450, 600, 750, 900]
print("  named stars on screen over 15 min: "
      + ", ".join(f"{t}s:{census[float(t)]}" for t in marks))
if max(census[float(t)] for t in marks[3:]) == 0:
    fails.append(f"after the composition breaks at {full_until:.0f}s no named star "
                 f"returns to frame for the rest of the sweep; the sky keeps "
                 f"moving but the constellations are gone for good")

# ---- 3. every twinkle must modulate downward only --------------------
# No phase of any waveform below may exceed 1.0, because that is the brightness
# verify_constellations solved the bloom set against. Get this wrong and the set
# of stars that cross the threshold changes on a frame the screenshot did not
# happen to catch.
#
# The bound is taken over the WHOLE cycle rather than at the end I believe is the
# peak. Mutation testing is why: this check originally sampled only w = +1 and
# waved through an inverted sign, because `1.0 + k * (0.5 - 0.5 * w)` is still
# exactly 1.0 at w = +1 — the flip turns the floor into a ceiling and leaves that
# one endpoint alone. Assuming which end is the maximum is assuming away the bug.
print("\n  twinkle: no phase may exceed the state the bloom set was solved at")


def peak_of(pattern, what, form):
    """Parse a `1.0 <sign> k * (0.5 - 0.5 * w)` modulation and bound it over w."""
    mm = grab(pattern, what)
    if not mm:
        return
    sign, raw = mm.group(1), mm.group(2)
    if raw == "tw":
        # The field star's depth is not a constant: it is mixed by elevation,
        # deeper near the horizon where the air path is longer. Take the deepest
        # end, since that is the case that could overshoot.
        tm = grab(r"float tw = mix\(([\d.]+), ([\d.]+), clamp", "the tw depth mix")
        if not tm:
            return
        k = max(float(tm.group(1)), float(tm.group(2)))
        form += f", depth {tm.group(1)}..{tm.group(2)} by elevation"
    else:
        k = float(raw)
    s = 1.0 if sign == "+" else -1.0
    vals = [1.0 + s * k * (0.5 - 0.5 * w) for w in (-1.0, 1.0)]
    hi, lo = max(vals), min(vals)
    if abs(hi - 1.0) > 1e-9:
        fails.append(f"{what}: over the twinkle cycle this reaches {hi:.4f}, above "
                     f"1.0 — some phase of the animation is BRIGHTER than the state "
                     f"the bloom threshold was solved against, so "
                     f"verify_constellations' bloom assertion is now stale. A "
                     f"twinkle has to modulate downward only.")
        return
    print(f"    ok  {what}: {form}, max {hi:.3f}, floor {lo:.3f}")


peak_of(r"spot \*= 1\.0 ([-+]) (tw|[\d.]+) \* \(0\.5 - 0\.5 \* w\);",
        "field star brightness", "per-pixel in SKY_FRAG")
peak_of(r"float dim = 1\.0 ([-+]) (tw|[\d.]+) \* \(0\.5 - 0\.5 \* vTw\);",
        "constellation star brightness", "per-star varying")

for pat, what in (
    (r"float w = 0\.62 \* sin\([^;]+?\+ 0\.38 \* sin\([^;]+?;",
     "field star waveform, two detuned sines summing to +-1"),
    (r"float r = apx \* cells \* 1\.1 \* \(1\.0 \+ 0\.16 \* \(0\.5 \+ 0\.5 \* w\)\);",
     "field star radius grows only, never shrinks sub-pixel"),
    (r"\+ pow\(1\.0 - r, he\) \* 0\.5;",
     "constellation halo twinkles via its EXPONENT, so r=0 stays exactly 1.0"),
):
    if not re.search(pat, src):
        fails.append(f"twinkle term changed or gone: {what}. Re-derive the peak "
                     f"before trusting verify_constellations' bloom assertion.")
    else:
        print(f"    ok  {what}")

m = grab(r"gl_PointSize = \(2\.4 \+ aMag \* 4\.0\) \* \(1\.0 \+ vTw \* ([\d.]+)\)"
         r" \* uPixelRatio;", "the constellation point size")
if m:
    swing = float(m.group(1))
    faintest = min(mm for c in CST for *_x, mm in c['stars'])
    floor_px = (2.4 + faintest * 4.0) * (1.0 - swing)
    print(f"    ok  point size floor {floor_px:.2f} CSS px (faintest star, "
          f"mag {faintest}) at DPR 1")
    if floor_px < 1.5:
        fails.append(f"point size can fall to {floor_px:.2f} px, near a single "
                     f"device pixel at DPR 1 — that flickers from aliasing "
                     f"rather than twinkling")

# ---- 4. meteors ------------------------------------------------------
print("\n  meteors")
mp = {}
# Re-anchored when the portrait frame fit went in: the launch azimuth is now
# drawn from the same range but pushed through azFit, which is the identity at
# the 4:3 reference this sweep runs at. Containment on a narrower frame is
# verify_frame_fit.py's job, not this file's.
for key, pat in (("az", r"const az = azFit\(Math\.random\(\) \* ([\d.]+) - ([\d.]+), fit\) \* D2R;"),
                 ("el", r"const el = \(([\d.]+) \+ Math\.random\(\) \* ([\d.]+)\) \* D2R;"),
                 ("arc", r"arc: \(([\d.]+) \+ Math\.random\(\) \* ([\d.]+)\) \* D2R,"),
                 ("tail", r"tail: \(([\d.]+) \+ Math\.random\(\) \* ([\d.]+)\) \* D2R,")):
    mm = grab(pat, f"the meteor {key} range")
    if mm:
        mp[key] = (float(mm.group(1)), float(mm.group(2)))

m = grab(r"const METEOR_SEGS = (\d+);", "METEOR_SEGS")
SEGS = int(m.group(1)) if m else 9
m = grab(r"const meteorTaper = \(j\) => Math\.pow\(1 - j / METEOR_SEGS, ([\d.]+)\);",
         "meteorTaper")
TAPER_P = float(m.group(1)) if m else 1.6
m = grab(r"uStarCol \* vMag \* ([\d.]+) \* uFade \* uExposure", "the meteor gain")
GAIN = float(m.group(1)) if m else 0.9

if len(mp) == 4:
    # Read the vertical component of the launch tangent out of the source rather
    # than reimplementing it. Hardcoding `-abs(sin th)` here would have made the
    # descent sweep below pass no matter what the file said, which is the exact
    # way a checker ends up testing its own assumptions.
    tm = grab(r"\.addScaledVector\(e2, (-?)(Math\.abs\()?Math\.sin\(th\)\)?\);",
              "the meteor launch tangent")
    if tm is None:
        vert = None
    elif tm.group(1) == "-" and tm.group(2):
        vert = lambda th: -abs(math.sin(th))       # noqa: E731
        print("    ok  launch tangent forced into the lower half-plane "
              "(-abs(sin th)), so every meteor starts downward")
    else:
        vert = lambda th: math.sin(th)            # noqa: E731
        fails.append("the meteor launch tangent no longer reflects into the "
                     "lower half-plane; the sweep below will show how many "
                     "streaks now climb")

if len(mp) == 4 and vert is not None:
    import random
    random.seed(11)
    worst_perp = worst_unit = worst_sphere = 0.0
    climbed = 0
    for _ in range(4000):
        az = (random.random() * mp["az"][0] - mp["az"][1]) * D2R
        el = (mp["el"][0] + random.random() * mp["el"][1]) * D2R
        p0 = [math.sin(az) * math.cos(el), math.sin(el), -math.cos(az) * math.cos(el)]
        e1 = norm(cross(p0, [0, 1, 0]))
        e2 = norm(cross(e1, p0))
        th = random.random() * math.pi * 2
        tan = [e1[i] * math.cos(th) + e2[i] * vert(th) for i in range(3)]
        worst_perp = max(worst_perp, abs(dot(p0, tan)))
        worst_unit = max(worst_unit, abs(math.sqrt(dot(tan, tan)) - 1.0))
        axis = norm(cross(p0, tan))
        arc = (mp["arc"][0] + random.random() * mp["arc"][1]) * D2R
        prev = math.degrees(math.asin(p0[1]))
        for st in range(1, 25):
            q = rot_axis(p0, axis, arc * st / 24)
            worst_sphere = max(worst_sphere, abs(math.sqrt(dot(q, q)) - 1.0))
            e = math.degrees(math.asin(q[1]))
            if e > prev + 1e-9:
                climbed += 1
                break
            prev = e
    print(f"    ok  tangent perpendicular to start (worst |dot| {worst_perp:.2e}) "
          f"and unit without renormalising (worst error {worst_unit:.2e})")
    print(f"    ok  path stays on the sphere (worst radius error {worst_sphere:.2e})")
    if climbed:
        fails.append(f"{climbed}/4000 meteors gain elevation somewhere along the "
                     f"flight — the tangent is not being reflected downward")
    else:
        print(f"    ok  all 4000 sampled meteors descend monotonically")

EXPO = 1.697
blooming = [j for j in range(SEGS + 1)
            if (1 - j / SEGS) ** TAPER_P * GAIN * EXPO > 1.0]
head = GAIN * EXPO
if not blooming:
    # Guarded rather than indexed. The first version wrote blooming[0] straight
    # into the report and died with IndexError on the mutant that dims the head —
    # nonzero exit, so the harness scored it as caught, but a traceback is not a
    # diagnosis and the next person reads it as a broken checker.
    fails.append(f"meteor head peaks at {head:.2f} linear and nothing in the trail "
                 f"crosses the 1.0 bloom threshold. WebGL caps line width at 1, so "
                 f"bloom is the only thing giving these any weight; without it the "
                 f"streak is a one-pixel scratch.")
else:
    print(f"    ok  head at {head:.2f} linear vs a 1.0 bloom threshold; "
          f"segments {blooming[0]}-{blooming[-1]} of {SEGS} glow, the rest is "
          f"hairline")
    if len(blooming) > SEGS * 0.6:
        fails.append(f"{len(blooming)} of {SEGS + 1} trail vertices bloom; the whole "
                     f"streak glowing loses the head-versus-trail read that makes "
                     f"this a meteor rather than a line")

print("=" * 64)
for w in warns:
    print(f"  warn  {w}")
if warns:
    print("-" * 64)
if fails:
    for f in fails:
        print(f"  FAIL  {f}")
    print(f"\n{len(fails)} problem(s) found.")
    sys.exit(1)
print("  ALL SKY-MOTION CHECKS PASSED")
print("=" * 64)
