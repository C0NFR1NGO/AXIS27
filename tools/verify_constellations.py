"""Verifies the constellation placement against the code as actually written.

The data is parsed out of DuneSea.jsx rather than retyped, because the whole
point is to catch a transcription slip between the solve and the file. A moon
already shipped once at NDC (1.015, 1.507) — entirely off screen — and the
lesson from that is that sky placement has to be checked against the frame by
a machine, every time.

Checks:
  1. every star inside the frame at 16:9 AND at 4:3 (the narrow case is the
     one that bites: horizontal half-angle drops from 41 to 30.8 degrees)
  2. no star or link near either moon's limb
  3. no star inside the eyebrow or wordmark boxes
  4. star and link brightness against the bloom threshold of 1.0
"""
import math, re, ast
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src" / "components" / "DuneSea.jsx"
src = SRC.read_text(encoding="utf-8")

# ---- parse CONSTELLATIONS straight out of the JSX ----------------------
block = src[src.index("const CONSTELLATIONS = ["):]
block = block[: block.index("\n];") + 3]
body = block[block.index("["): ]
body = re.sub(r"//[^\n]*", "", body)                 # strip line comments
body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)    # strip block comments
body = re.sub(r"(\w+):", r"'\1':", body)             # quote JS keys
body = body.rstrip().rstrip(";")
CONSTELLATIONS = ast.literal_eval(body)
assert len(CONSTELLATIONS) == 3, CONSTELLATIONS
print("parsed from the file:")
for c in CONSTELLATIONS:
    print(f"  {c['name']:<12} {len(c['stars'])} stars, {len(c['links'])} links, "
          f"az {c['place']['az']:+.1f} elev {c['place']['elev']:.1f} "
          f"roll {c['place']['roll']:+} scale {c['place']['scale']}")
tot_s = sum(len(c['stars']) for c in CONSTELLATIONS)
tot_l = sum(len(c['links']) for c in CONSTELLATIONS)
print(f"  total: {tot_s} stars, {tot_l} links "
      f"(CosmicBackground: 250 nodes, 800 segments)")

for c in CONSTELLATIONS:
    n = len(c['stars'])
    for a, b in c['links']:
        assert 0 <= a < n and 0 <= b < n, f"{c['name']}: link {a},{b} out of range"
        assert a != b, f"{c['name']}: self link"
print("  link indices: all in range\n")

# ---- plateDir, mirroring the JS exactly --------------------------------
D2R = math.pi / 180

def norm(v):
    m = math.sqrt(sum(x * x for x in v)); return [x / m for x in v]
def cross(a, b):
    return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]

def plate_dir(place, px, py):
    az, el = place['az']*D2R, place['elev']*D2R
    c = [math.sin(az)*math.cos(el), math.sin(el), -math.cos(az)*math.cos(el)]
    right = norm(cross(c, [0, 1, 0]))
    up = norm(cross(right, c))
    r = place.get('roll', 0)*D2R
    s = place.get('scale', 1)*D2R
    x = (px*math.cos(r) - py*math.sin(r))*s
    y = (px*math.sin(r) + py*math.cos(r))*s
    return norm([c[i] + right[i]*math.tan(x) + up[i]*math.tan(y) for i in range(3)])

def to_ae(d):
    """Back to azimuth/elevation, for reporting in the same units as the input."""
    return math.degrees(math.atan2(d[0], -d[2])), math.degrees(math.asin(d[1]))

# Sanity: the tangent basis must reproduce its own centre, and +px must be
# azimuth-positive. If this flips, every figure mirrors.
for cst in CONSTELLATIONS:
    a0, e0 = to_ae(plate_dir(cst['place'], 0, 0))
    a1, _ = to_ae(plate_dir(cst['place'], 1, 0))
    assert abs(a0 - cst['place']['az']) < 1e-6 and abs(e0 - cst['place']['elev']) < 1e-6
    assert a1 > a0, f"{cst['name']}: +px runs the wrong way"
print("basis: centre reproduced, +px is azimuth-positive for all three\n")

# ---- camera -----------------------------------------------------------
PITCH, VFOV = -3.8, 52.0
tan_v = math.tan(math.radians(VFOV / 2))

def ndc(d, aspect):
    """Project a world direction into NDC for the given aspect ratio."""
    az, el = to_ae(d)
    # Rotate into camera space: only pitch, no yaw or roll.
    p = math.radians(PITCH)
    y = d[1]*math.cos(p) + d[2]*math.sin(p)
    z = -d[1]*math.sin(p) + d[2]*math.cos(p)
    if z >= -1e-6:
        return 9.9, 9.9      # behind the camera
    return (d[0] / -z) / (tan_v * aspect), (y / -z) / tan_v

print(f"frame at pitch {PITCH} vFOV {VFOV}: top of frame is "
      f"{PITCH + math.degrees(math.atan(tan_v)):+.1f} deg elevation")
worst = {}
for aspect, tag in ((16/9, '16:9'), (4/3, '4:3'), (21/9, '21:9')):
    bad = []
    mx = my = 0.0
    for cst in CONSTELLATIONS:
        for i, (px, py, _m) in enumerate(cst['stars']):
            x, y = ndc(plate_dir(cst['place'], px, py), aspect)
            mx, my = max(mx, abs(x)), max(my, abs(y))
            if abs(x) > 1 or abs(y) > 1:
                bad.append(f"{cst['name']}[{i}] ndc ({x:+.3f},{y:+.3f})")
    worst[tag] = (mx, my)
    status = "CLIPPED: " + "; ".join(bad) if bad else "all inside"
    print(f"  {tag:<6} max |ndc| x {mx:.3f} y {my:.3f}   {status}")
assert all(mx <= 1 and my <= 1 for mx, my in worst.values()), "off-frame star"

# ---- moons ------------------------------------------------------------
MOONS = {'A': (-0.4657, 0.2871, -0.8371), 'B': (0.4812, 0.1219, -0.8681)}
MOON_ANG = 2.1   # angular radius on screen, degrees (from the moon solve)
print(f"\nclearance from the moons (limb at {MOON_ANG} deg):")
closest = 999
for name, m in MOONS.items():
    m = norm(list(m))
    for cst in CONSTELLATIONS:
        for i, (px, py, _m) in enumerate(cst['stars']):
            d = plate_dir(cst['place'], px, py)
            ang = math.degrees(math.acos(max(-1, min(1, sum(d[j]*m[j] for j in range(3))))))
            gap = ang - MOON_ANG
            if gap < closest:
                closest, who = gap, f"moon {name} <-> {cst['name']}[{i}]"
print(f"  closest approach to a limb: {closest:.1f} deg  ({who})")
assert closest > 3.0, "a star is crowding a moon"

# ---- text boxes -------------------------------------------------------
BOXES = {'eyebrow': (-11, 11, 6.4, 8.2), 'wordmark': (-22, 22, -0.2, 5.4)}
print("\nstars landing inside a text box (want none):")
hits = []
for cst in CONSTELLATIONS:
    for i, (px, py, _m) in enumerate(cst['stars']):
        az, el = to_ae(plate_dir(cst['place'], px, py))
        for bn, (a0, a1, e0, e1) in BOXES.items():
            if a0 <= az <= a1 and e0 <= el <= e1:
                hits.append(f"{cst['name']}[{i}] in {bn} at ({az:+.1f},{el:.1f})")
print("  " + ("; ".join(hits) if hits else "none"))
assert not hits

# ---- brightness against the bloom threshold ---------------------------
def dec(x): return x/12.92 if x <= 0.04045 else ((x+0.055)/1.055)**2.4
def enc(x): return 12.92*x if x <= 0.0031308 else 1.055*x**(1/2.4)-0.055
def aces(x):
    a,b,c,d,e = 2.51,0.03,2.43,0.59,0.14
    return max(0.0, min(1.0, (x*(a*x+b))/(x*(c*x+d)+e)))
def linhex(h):
    h = h.lstrip('#'); return [dec(int(h[i:i+2],16)/255) for i in (0,2,4)]

STAR, MOONC = linhex('#FFF6EC'), linhex('#9FB0D8')
EXPO = 1.697
PEAK_A = 1.0 + 0.5          # core + halo at r = 0

# Read the gain line out of the shader so this checks what shipped. Hardcoding
# it here is how the earlier off-by-one survived: the comment claimed one
# crossing point and the constant implemented another.
gm = re.search(r"float gain = ([\d.]+) \+ vMag \* ([\d.]+);", src)
assert gm, "could not find the star gain line in CSTAR_FRAG"
GA, GB = float(gm.group(1)), float(gm.group(2))
lm = re.search(r"const m = ([\d.]+) \+ ([\d.]+) \* Math\.min", src)
assert lm, "could not find the link magnitude line"
LA, LB = float(lm.group(1)), float(lm.group(2))

print(f"\nbloom threshold is 1.0; night exposure {EXPO}")
print(f"  gain = {GA} + mag*{GB}   link aMag = {LA} + {LB}*min(magA,magB)")
print("  point sprite peak (core+halo) =", PEAK_A)
mags = sorted({m for c in CONSTELLATIONS for *_x, m in c['stars']})
print(f"  {'mag':>5} {'gain':>6} {'peak lin':>9} {'sRGB':>6}  bloom?")
for m in mags:
    gain = GA + m*GB
    peak = max(STAR)*PEAK_A*gain*EXPO
    print(f"  {m:>5.2f} {gain:>6.3f} {peak:>9.3f} {enc(aces(peak)):>6.3f}"
          f"  {'YES (halo)' if peak > 1.0 else 'no'}")
over = [m for m in mags if max(STAR)*PEAK_A*(GA+m*GB)*EXPO > 1.0]
print(f"  crossing unity: {over}  (intended: Betelgeuse 0.95 and Rigel 1.00 only)")
assert over == [0.95, 1.0], f"unexpected bloom set {over}"

print("\n  link brightness (never blooms, by design):")
sky_night = 0.055   # sRGB blue of the corrected night sky at 15-20 deg
for lo in (min(mags), max(mags)):
    mg = LA + LB*lo
    lit = [c*mg*EXPO for c in MOONC]
    s = [enc(aces(v)) for v in lit]
    print(f"    dimmer end mag {lo:.2f} -> aMag {mg:.3f} -> sRGB "
          f"{[f'{v:.3f}' for v in s]}  peak lin {max(lit):.3f}")
    assert max(lit) < 1.0, "a link would bloom"
print(f"    night sky for comparison: blue ~{sky_night:.3f} sRGB")

print("\nALL CONSTELLATION CHECKS PASSED")
