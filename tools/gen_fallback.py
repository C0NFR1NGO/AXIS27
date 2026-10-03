"""Generates DuneSeaFallback.jsx.

Every position below is computed from the same camera the real scene uses, not
eyeballed, so the cross-fade lands on an image that already agrees with it.
"""
import math, re, ast, random
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src" / "components" / "DuneSea.jsx"
src = SRC.read_text(encoding="utf-8")

D2R = math.pi / 180
PITCH, VFOV = -3.8, 52.0
tan_v = math.tan(math.radians(VFOV / 2))
REF = 4 / 3
MOONS = {"A": (-0.4657, 0.2871, -0.8371), "B": (0.4812, 0.1219, -0.8681)}
MOON_R = {"A": 0.040, "B": 0.024}      # the moonBody r params, ~= angular radius in rad

def norm(v):
    m = math.sqrt(sum(x * x for x in v)); return [x / m for x in v]
def cross(a, b):
    return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def ndc(d, aspect=REF):
    p = math.radians(PITCH)
    y = d[1]*math.cos(p) + d[2]*math.sin(p)
    z = -d[1]*math.sin(p) + d[2]*math.cos(p)
    return (d[0] / -z) / (tan_v * aspect), (y / -z) / tan_v
def plate_dir(place, px, py):
    az, el = place["az"]*D2R, place["elev"]*D2R
    c = [math.sin(az)*math.cos(el), math.sin(el), -math.cos(az)*math.cos(el)]
    right = norm(cross(c, [0, 1, 0])); up = norm(cross(right, c))
    r = place.get("roll", 0)*D2R; s = place.get("scale", 1)*D2R
    x = (px*math.cos(r) - py*math.sin(r))*s
    y = (px*math.sin(r) + py*math.cos(r))*s
    return norm([c[i] + right[i]*math.tan(x) + up[i]*math.tan(y) for i in range(3)])

block = src[src.index("const CONSTELLATIONS = ["):]
block = block[: block.index("\n];") + 3]
body = re.sub(r"/\*.*?\*/", "", re.sub(r"//[^\n]*", "", block[block.index("["):]), flags=re.S)
CONSTELLATIONS = ast.literal_eval(re.sub(r"(\w+):", r"'\1':", body).rstrip().rstrip(";"))

# NDC -> percentage of the plate. x is % of plate width, y is % of plate height.
def pct(x, y):
    return (x + 1) / 2 * 100, (1 - y) / 2 * 100

# ---- moons ---------------------------------------------------------------
moons = []
for k, raw in MOONS.items():
    x, y = ndc(norm(list(raw)))
    lx, ty = pct(x, y)
    # Diameter as a share of PLATE WIDTH. At the 4:3 plate that equals the
    # angular size; below 4:3 the plate is the viewport, so the same percentage
    # shrinks in exact proportion to aspect -- which is what uMoonScale does in
    # the shader. The fit therefore costs nothing here: the plate carries it.
    diam = 2 * math.degrees(MOON_R[k]) / math.degrees(math.atan(tan_v * REF)) / 2 * 100
    moons.append((k, lx, ty, diam))

# ---- named figures -------------------------------------------------------
cstars = []
for c in CONSTELLATIONS:
    for px, py, mag in c["stars"]:
        x, y = ndc(plate_dir(c["place"], px, py))
        lx, ty = pct(x, y)
        cstars.append((lx, ty, mag, c["name"]))

# ---- field stars ---------------------------------------------------------
# Deterministic, and rejection-sampled so the field never clumps: the real
# field is a hash over direction, which is close to uniform, and clumps are the
# thing that reads as "generated" rather than as sky.
HORIZON_NDC = -0.14
rng = random.Random(7)
field = []
occupied = [(x, y) for x, y, _m, _n in
            [(a, b, c_, d_) for a, b, c_, d_ in cstars]]
tries = 0
while len(field) < 78 and tries < 40000:
    tries += 1
    x = rng.uniform(-0.985, 0.985)
    y = rng.uniform(HORIZON_NDC + 0.05, 0.985)
    lx, ty = pct(x, y)
    if any((lx-ox)**2 + (ty-oy)**2 < 7.0 for ox, oy in occupied):
        continue
    # Extinction: the sky brightens into the ember band, so a star near the
    # horizon is washed out. Same reason real low stars look dim.
    h = (y - HORIZON_NDC) / (1 - HORIZON_NDC)
    op = round(0.14 + 0.62 * h ** 0.75, 3)
    px_size = 2 if rng.random() < 0.14 else 1
    field.append((round(lx, 2), round(ty, 2), op, px_size))
    occupied.append((lx, ty))

# ---- dune ridges ---------------------------------------------------------
# Two silhouettes rather than one flat band: a single edge reads as fog, and a
# far/near pair is the cheapest thing that reads as distance.
def ridge(base, amp, seed, k1, k2):
    r = random.Random(seed)
    pts = []
    for i in range(0, 1001, 20):
        u = i / 1000
        h = (math.sin(u * k1 * math.pi + r.random() * 6) * 0.6
             + math.sin(u * k2 * math.pi + r.random() * 6) * 0.4)
        pts.append((i, round(base - h * amp, 2)))
    d = f"M {pts[0][0]} {pts[0][1]}"
    for i in range(1, len(pts)):
        x0, y0 = pts[i - 1]; x1, y1 = pts[i]
        d += f" C {(x0+x1)/2} {y0}, {(x0+x1)/2} {y1}, {x1} {y1}"
    return d + " L 1000 1000 L 0 1000 Z", pts[0][1]

far, _ = ridge(570, 9, 3, 5, 11)
near, _ = ridge(668, 22, 12, 3, 7)

# ====================================================================== #
out = []
w = out.append
w("""/* Static stand-in for the dune sea, and the bridge the real canvas fades onto.
 *
 * This lives in its own module, with no three.js import, so it can do two jobs
 * from one definition:
 *
 *   1. the fallback when WebGL2 is genuinely unavailable, and
 *   2. the bridge image underneath the real canvas while the chunk downloads
 *      and the shaders compile.
 *
 * It used to be what every phone saw permanently, because the capability gate
 * read `!webgl2 || innerWidth < 768`. That gate is gone -- it was covering for a
 * framing bug, not a capability one -- so this is now only ever a fallback or a
 * bridge, and it needs to survive being looked at for about a second rather
 * than for a whole visit.
 *
 * Job 2 is why it is not still inside DuneSea.jsx. Importing it from there
 * would pull three, @react-three/fiber and postprocessing into whatever bundle
 * referenced it -- which for HomePage is the main bundle, defeating the code
 * split it is meant to cover for. That constraint is why the sky below is DOM
 * and CSS rather than a canvas, and why nothing here is generated at runtime.
 *
 * EVERY NUMBER IN THIS FILE IS COMPUTED, NOT CHOSEN. The moon centres, the moon
 * diameters and all 19 named stars come from the same camera the real scene
 * uses -- pitch -3.8, vertical FOV 52 -- projected to NDC and converted to
 * percentages. Regenerate rather than hand-edit if the camera, PALETTE's night
 * end, or the moon placements move.
 *
 * THE PLATE, which is the one idea here worth understanding. Horizontal
 * position depends on aspect and vertical position does not, because fov is the
 * VERTICAL field of view. The real scene handles that with a frame fit that
 * scales tan(azimuth) by aspect/(4:3), clamped at 1. CSS cannot compute an
 * aspect ratio, but it does not need to: putting the bodies inside a plate that
 * is exactly 4:3 above the reference aspect and exactly the viewport below it
 * reproduces both regimes from one set of percentages. Above 4:3 a percentage
 * of the plate's width is a percentage of 4/3 x height, which is the clamped
 * case; below it, the percentage is of the real width, which is the fitted
 * case. The two agree at 4:3, so there is no seam. Moon diameters ride the same
 * trick, which is why they are expressed as a share of width. */
export default function DuneSeaFallback() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <style>{CSS}</style>
      {/* The base is unchanged: three stops matched to PALETTE at scroll 0 with
          the sun at its intro depth, so the canvas cross-fades onto an image it
          already almost is. */}
      <div className="dsf-base" />
      <div className="dsf-plate">""")

w("        {/* Field stars. Dimmed toward the horizon, because the sky brightens\n"
  "            into the ember band and a low star is washed out by it. */}")
for lx, ty, op, sz in field:
    w(f'        <i className="dsf-s" style={{{{ left: \'{lx}%\', top: \'{ty}%\', '
      f'opacity: {op}, width: \'{sz}px\', height: \'{sz}px\' }}}} />')

w("\n        {/* The three named figures, at their real placements. These are the\n"
  "            part a returning visitor recognises, so they are worth the DOM. */}")
for lx, ty, mag, name in cstars:
    op = round(min(0.95, 0.42 + 0.5 * mag), 3)
    sz = 3 if mag >= 0.95 else 2
    glow = f", boxShadow: '0 0 {4 if sz == 3 else 3}px rgba(198,224,255,{round(op*0.55,3)})'"
    w(f'        <i className="dsf-s dsf-cs" style={{{{ left: \'{lx:.2f}%\', top: \'{ty:.2f}%\', '
      f'opacity: {op}, width: \'{sz}px\', height: \'{sz}px\'{glow} }}}} /> {{/* {name} */}}')

w("\n        {/* Moons. Additive in the real scene and with no halo outside the\n"
  "            limb, so a soft edge here would be wrong -- the falloff below\n"
  "            stops at the limb and the sky takes over. */}")
for k, lx, ty, diam in moons:
    if k == "A":
        bg = ("radial-gradient(circle at 38% 34%, #fff6e8 0%, #f0dcc0 42%, "
              "#c9ae92 72%, #8d7a66 92%, rgba(141,122,102,0) 100%)")
        extra = ", boxShadow: '0 0 14px rgba(255,238,214,0.28)'"
    else:
        bg = ("radial-gradient(circle at 42% 36%, #cfd8e4 0%, #a8b3c2 50%, "
              "#6e7784 88%, rgba(110,119,132,0) 100%)")
        extra = ""
    w(f'        <i className="dsf-moon" style={{{{ left: \'{lx:.3f}%\', top: \'{ty:.3f}%\', '
      f'width: \'{diam:.3f}%\', background: \'{bg}\'{extra} }}}} /> {{/* moon {k} */}}')

w(f"""      </div>

      {{/* Dunes. Two silhouettes rather than one edge: a single horizon line
          reads as fog, and a far/near pair is the cheapest thing that reads as
          distance. Stretched with preserveAspectRatio="none" on purpose, so the
          crests widen with the viewport instead of scaling like a logo. */}}
      <svg
        className="dsf-dunes"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="dsfFar" x1="0" y1="0.55" x2="0" y2="1">
            <stop offset="0" stopColor="#1b130d" />
            <stop offset="1" stopColor="#0a0705" />
          </linearGradient>
          <linearGradient id="dsfNear" x1="0" y1="0.62" x2="0" y2="1">
            <stop offset="0" stopColor="#0d0906" />
            <stop offset="1" stopColor="#050403" />
          </linearGradient>
        </defs>
        <path d="{far}" fill="url(#dsfFar)" />
        <path d="{near}" fill="url(#dsfNear)" />
      </svg>
    </div>
  );
}}

/* Scoped to this component rather than added to global.css, so the module stays
   self-contained and the stylesheet does not grow a section that only matters
   for a second of page life. Nothing here animates: the real scene owns the
   motion, and a bridge that moves would draw the eye to the hand-off it is
   supposed to hide -- which also means there is no reduced-motion case to
   answer for. */
const CSS = `
.dsf-base {{
  position: absolute;
  inset: 0;
  background:
    radial-gradient(38% 16% at 50% 55%, rgba(255,206,138,0.50), transparent 70%),
    radial-gradient(120% 34% at 50% 57%, rgba(255,122,26,0.24), transparent 72%),
    linear-gradient(to bottom, #04060F 0%, #080C18 34%, #17110E 52%, #0C0906 60%, #070505 100%);
}}
.dsf-plate {{ position: absolute; inset: 0; }}
@media (min-aspect-ratio: 4/3) {{
  .dsf-plate {{
    inset: 0 auto;
    aspect-ratio: 4 / 3;
    left: 50%;
    transform: translateX(-50%);
  }}
}}
.dsf-s {{
  position: absolute;
  border-radius: 50%;
  background: #e6eefb;
  transform: translate(-50%, -50%);
}}
.dsf-cs {{ background: #f4f8ff; }}
.dsf-moon {{
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}}
.dsf-dunes {{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}}
`;
""")

(Path(__file__).resolve().parent.parent / "src" / "components" / "DuneSeaFallback.jsx").write_text(
    "\n".join(out), encoding="utf-8")

print(f"field stars: {len(field)}   named stars: {len(cstars)}")
for k, lx, ty, d in moons:
    print(f"  moon {k}: left {lx:.2f}%  top {ty:.2f}%  diameter {d:.2f}% of plate width")
ys = [t for _l, t, _m, _n in cstars]
print(f"  named stars span top {min(ys):.1f}% .. {max(ys):.1f}%")
