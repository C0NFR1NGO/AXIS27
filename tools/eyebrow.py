"""Eyebrow legibility against the CORRECTED sky, with a stroke-width-aware
halo model.

The earlier halo model assumed a locally straight glyph edge, which is fair for
Ethnocentric at 8rem and badly wrong for 0.62rem mono: a blurred shadow cast by
a 1.1px stem never reaches its nominal alpha anywhere, because there is not
enough ink to cast it. Modelled here as the difference of two Gaussian CDFs
across the stroke instead of one, which is what actually happens.
"""
import math

def dec(x): return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
def enc(x): return 12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055
def aces(x):
    a, b, c, d, e = 2.51, 0.03, 2.43, 0.59, 0.14
    return max(0.0, min(1.0, (x * (a * x + b)) / (x * (c * x + d) + e)))
def linhex(h):
    h = h.lstrip('#'); return [dec(int(h[i:i+2], 16) / 255) for i in (0, 2, 4)]
def hexc(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
def relL(c): return sum(k * dec(v) for k, v in zip((0.2126, 0.7152, 0.0722), c))
def ratio(a, b):
    la, lb = relL(a), relL(b); return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
def over(fg, a, bg): return tuple(fg[i] * a + bg[i] * (1 - a) for i in range(3))
def Phi(x): return 0.5 * (1 + math.erf(x / math.sqrt(2)))
def sstep(a, b, x):
    t = min(max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t)

NZ, NH = linhex('#04060F'), linhex('#0B0F1C')
DZ, DH = linhex('#7C8B95'), linhex('#E7C79C')
EM, EH = linhex('#FF7A1A'), linhex('#FFCE8A')
SUN = linhex('#FFD9A0')

def solve(s):
    t = min(max(s, -0.45), 1)
    e = -1.5 + 34.0 * t ** 1.25 if t >= 0 else -1.5 - 46.0 * (-t) ** 1.3
    day = sstep(-2., 16., e)
    return dict(e=e, day=day, tw=math.exp(-((e - 1.0) / 9.0) ** 2),
                expo=1.7 * (1 - day) + 0.38 * day)

def sky(elev_deg, s, band=20.0, fwdK=12.0):
    """As shipped after the wash fix: band exp(-20h), fwd exp(-12h)*mix(.25,1,day)."""
    sk = solve(s); day, tw, expo = sk['day'], sk['tw'], sk['expo']
    er = math.radians(sk['e']); L = [0., math.sin(er), -math.cos(er)]
    dr = math.radians(elev_deg); d = [0., math.sin(dr), -math.cos(dr)]
    zen = [NZ[i] * (1 - day) + DZ[i] * day for i in range(3)]
    hor = [NH[i] * (1 - day) + DH[i] * day for i in range(3)]
    up = min(max(d[1] * 1.45 + 0.06, 0), 1)
    col = [hor[i] * (1 - up ** 0.55) + zen[i] * up ** 0.55 for i in range(3)]
    dot = max(sum(d[i] * L[i] for i in range(3)), 0.0)
    low = math.exp(-max(d[1], 0) * band)
    for i in range(3):
        col[i] += EH[i] * low * 0.96 * tw          # dead centre => toward = 1
    aS = math.sqrt(max(1 - dot * dot, 0))
    k = min(day * 1.15, 1)
    for i in range(3):
        col[i] += (EM[i] * (1 - k) + SUN[i] * k) * math.exp(-aS * 13.0) * 0.55
    fwd = dot ** 7.0 * math.exp(-max(d[1], 0) * fwdK) * (0.25 + 0.75 * day)
    for i in range(3):
        col[i] += (EM[i] * (1 - day) + SUN[i] * day) * fwd * 0.30
    return tuple(enc(aces(c * expo)) for c in col)

# Screen position of the eyebrow: measured off the screenshot at elevation
# 7.3 deg. ndc_y = tan(elev - pitch)/tan(vFOV/2) = tan(11.1)/tan(26) = 0.402,
# i.e. 29.9% down the frame. The hero scrim is fully transparent until 48%, so
# the eyebrow gets no help from it at all — worth stating, because every other
# element in the lockup does.
EYEBROW_ELEV = 7.3

def shadow_alpha(A, B, d, stroke):
    """Alpha of one CSS text-shadow at distance d px outside a stroke of the
    given width. CSS blur radius B ~= 2 sigma. A straight-edge model uses
    A*(1 - Phi(d/sig)) and is what was used for the wordmark; a finite stroke
    can only contribute the slab of ink it actually occupies, which is the
    difference of two CDFs. At 10px the two answers differ by 3x."""
    sig = max(B, 1e-6) / 2.0
    return A * (Phi((d + stroke) / sig) - Phi(d / sig))

def composite(stack, bg, d, stroke):
    for _, A, B, col in reversed(stack):
        bg = over(col, min(shadow_alpha(A, B, d, stroke), 1.0), bg)
    return bg

CYAN = hexc('#00A8E8')
STROKE = 1.1   # Martian Mono 500 at 0.62rem ~ 10px => ~1.1px stems

print("=== backdrop at the eyebrow, before and after the wash fix ===")
print(f"  washed (band 8, no fwd gate): "
      f"{[f'{v:.3f}' for v in sky(EYEBROW_ELEV, 0.0, band=8.0, fwdK=0.0)]}")
bg0 = sky(EYEBROW_ELEV, 0.0)
print(f"  fixed  (band 20, fwd gated) : {[f'{v:.3f}' for v in bg0]}  "
      f"relL {relL(bg0):.3f}")
print(f"  bare cyan on the fixed sky  : {ratio(CYAN, bg0):.2f}:1\n")

print("=== why a wide blur cannot help 10px mono ===")
print(f"  {'blur':>5} {'alpha at glyph edge (A=0.9)':>30}")
for B in (2, 3, 4, 6, 10, 14, 20):
    print(f"  {B:>5} {shadow_alpha(0.9, B, 0.0, STROKE):>30.3f}")

CANDIDATES = {
    "shipped: one 14px drop":
        [("drop", 0.90, 14, hexc('#040A0E'))],
    "one 4px tight":
        [("tight", 0.95, 4, hexc('#02070C'))],
    "3px + 8px":
        [("tight", 0.95, 3, hexc('#02070C')),
         ("wide", 0.80, 8, hexc('#02070C'))],
    "2px x2 + 8px":
        [("tight", 0.95, 2, hexc('#02070C')),
         ("tight2", 0.95, 2, hexc('#02070C')),
         ("wide", 0.75, 8, hexc('#02070C'))],
    "2px x3 + 10px":
        [("t1", 0.95, 2, hexc('#02070C')),
         ("t2", 0.95, 2, hexc('#02070C')),
         ("t3", 0.95, 2, hexc('#02070C')),
         ("wide", 0.70, 10, hexc('#02070C'))],
    "1px x2 + 3px + 10px":
        [("t1", 1.0, 1, hexc('#02070C')),
         ("t2", 1.0, 1, hexc('#02070C')),
         ("mid", 0.95, 3, hexc('#02070C')),
         ("wide", 0.70, 10, hexc('#02070C'))],
}

print("\n=== cyan #00A8E8 at 7.3 deg, contrast at the glyph edge and outward ===")
print(f"  {'stack':<22} " + " ".join(f"{f'{d}px':>7}" for d in (0, 1, 2, 4)))
for name, stack in CANDIDATES.items():
    row = " ".join(f"{ratio(CYAN, composite(stack, bg0, d, STROKE)):>7.2f}"
                   for d in (0, 1, 2, 4))
    print(f"  {name:<22} {row}")

print("\n=== the winning stack across the whole scroll arc ===")
best = CANDIDATES["1px x2 + 3px + 10px"]
for s, tag in ((0.0, 'rest'), (0.08, 's=0.08'), (0.15, 's=0.15 (hero gone)')):
    bg = sky(EYEBROW_ELEV, s)
    print(f"  {tag:<20} backdrop {[f'{v:.3f}' for v in bg]}  "
          f"bare {ratio(CYAN, bg):5.2f}  haloed {ratio(CYAN, composite(best, bg, 0, STROKE)):5.2f}")
