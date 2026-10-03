# Renders public/images/og-image.png — a 1200x630 share card of the world's
# first frame, from the same computed numbers DuneSeaFallback uses (it parses
# them straight out of the JSX so the two can never drift). Run from the repo
# root:  python tools/gen_og.py
import math
import re
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
FALLBACK = ROOT / 'src' / 'components' / 'DuneSeaFallback.jsx'
OUT = ROOT / 'public' / 'images' / 'og-image.png'

W, H = 1200, 630
SEAM_Y = 0.57  # --seam-y, the shared anchor


def parse_fallback():
    text = FALLBACK.read_text(encoding='utf-8')
    stars, constellations, moons, paths = [], [], [], []

    for m in re.finditer(
        r'className="dsf-s" style=\{\{ left: \'([\d.]+)%\', top: \'([\d.]+)%\', '
        r'opacity: ([\d.]+), width: \'(\d+)px\'', text):
        stars.append((float(m.group(1)), float(m.group(2)), float(m.group(3)), int(m.group(4))))

    for m in re.finditer(
        r'className="dsf-s dsf-cs" style=\{\{ left: \'([\d.]+)%\', top: \'([\d.]+)%\', '
        r'opacity: ([\d.]+), width: \'(\d+)px\'', text):
        constellations.append((float(m.group(1)), float(m.group(2)), float(m.group(3)), int(m.group(4))))

    for m in re.finditer(
        r'className="dsf-moon" style=\{\{ left: \'([\d.]+)%\', top: \'([\d.]+)%\', '
        r'width: \'([\d.]+)%\', background: \'([^\']+)\'', text):
        moons.append({'left': float(m.group(1)), 'top': float(m.group(2)),
                      'width': float(m.group(3)), 'background': m.group(4)})

    for m in re.finditer(r'<path d="([^"]+)"', text):
        paths.append(m.group(1))

    return stars, constellations, moons, paths


def flatten_path(d):
    """SVG path -> list of (x, y) points in viewBox coords. Handles M/C/L/Z."""
    tokens = re.findall(r'([MLZz])|(-?[\d.]+)', d)
    nums = []
    cmds = []
    for letter, num in tokens:
        if letter:
            cmds.append((letter, len(nums)))
        else:
            nums.append(float(num))
    pts = []
    i = 0
    cur = None
    for letter, pos in cmds:
        if letter in 'Mm':
            cur = (nums[pos], nums[pos + 1])
            pts.append(cur)
            i = pos + 2
        elif letter == 'C':
            while i + 6 <= len(nums):
                x1, y1, x2, y2, x3, y3 = nums[i:i + 6]
                if cur is None:
                    cur = (x1, y1)
                    pts.append(cur)
                for s in range(1, 17):
                    t = s / 16
                    u = 1 - t
                    bx = u ** 3 * cur[0] + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3
                    by = u ** 3 * cur[1] + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3
                    pts.append((bx, by))
                cur = (x3, y3)
                i += 6
        elif letter == 'L':
            while i + 2 <= len(nums):
                cur = (nums[i], nums[i + 1])
                pts.append(cur)
                i += 2
        elif letter in 'Zz':
            break
    return pts


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def hexc(s):
    h = s.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def vgrad_layer(stops, w, h):
    """Vertical gradient layer from (pos, rgb) stops."""
    col = Image.new('RGB', (1, h))
    for y in range(h):
        t = y / (h - 1)
        for k in range(len(stops) - 1):
            p0, c0 = stops[k]
            p1, c1 = stops[k + 1]
            if p0 <= t <= p1:
                col.putpixel((0, y), lerp(c0, c1, (t - p0) / (p1 - p0)))
                break
    return col.resize((w, h))


def radial_layer(centre, radii, stops, w, h, small=(300, 158), fill_outside=False):
    """Radial-gradient layer, computed small and upscaled (soft gradients).
    fill_outside extends the last stop's colour beyond the ending shape —
    the CSS behaviour — instead of leaving it transparent."""
    sw, sh = small
    layer = Image.new('RGBA', (sw, sh), (0, 0, 0, 0))
    cx, cy = centre[0] / 100 * sw, centre[1] / 100 * sh
    rx, ry = radii[0] / 100 * sw, radii[1] / 100 * sh
    px = layer.load()
    last = stops[-1][1]
    for y in range(sh):
        for x in range(sw):
            t = math.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
            if t >= 1:
                if fill_outside:
                    px[x, y] = last
                continue
            for k in range(len(stops) - 1):
                p0, c0 = stops[k]
                p1, c1 = stops[k + 1]
                if p0 <= t <= p1:
                    r, g, b, a0 = c0
                    _, _, _, a1 = c1
                    a = a0 + (a1 - a0) * (t - p0) / (p1 - p0)
                    px[x, y] = (r, g, b, int(a))
                    break
    return layer.resize((w, h), Image.BICUBIC)


def moon_tile(diam, background, small_diam=96):
    """Per-pixel radial gradient inside a circle — the falloff stops at the limb."""
    stops = []
    inner = background[background.index('(') + 1: background.rindex(')')]
    parts = re.findall(r'(rgba\([^)]*\)|#[0-9a-fA-F]{3,8})\s+(\d+(?:\.\d+)?)%', inner)
    centre_part = inner.split(',')[0]
    cm = re.search(r'(\d+)%\s+(\d+)%', centre_part)
    cx_off, cy_off = (float(cm.group(1)), float(cm.group(2))) if cm else (50, 50)
    for colour, pos in parts:
        pos = float(pos) / 100
        if colour.startswith('rgba'):
            nums = [float(n) for n in re.findall(r'[\d.]+', colour)]
            stops.append((pos, (int(nums[0]), int(nums[1]), int(nums[2]), int(nums[3] * 255))))
        else:
            stops.append((pos, hexc(colour) + (255,)))
    stops.sort(key=lambda s: s[0])

    tile = Image.new('RGBA', (small_diam, small_diam), (0, 0, 0, 0))
    px = tile.load()
    r = small_diam / 2
    cx, cy = cx_off / 100 * small_diam, cy_off / 100 * small_diam
    for y in range(small_diam):
        for x in range(small_diam):
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            if dist > r:
                continue
            t = dist / r
            for k in range(len(stops) - 1):
                p0, c0 = stops[k]
                p1, c1 = stops[k + 1]
                if p0 <= t <= p1:
                    a = c0[3] + (c1[3] - c0[3]) * (t - p0) / (p1 - p0)
                    px[x, y] = (c0[0], c0[1], c0[2], int(a))
                    break
    return tile.resize((int(diam), int(diam)), Image.BICUBIC)


def ethnocentric(tmpdir):
    try:
        from fontTools.ttLib import TTFont
        dst = Path(tmpdir) / 'Ethnocentric.ttf'
        f = TTFont(str(ROOT / 'public' / 'fonts' / 'Ethnocentric.woff2'))
        f.flavor = None
        f.save(str(dst))
        return str(dst)
    except Exception:
        for cand in ('segoeuib.ttf', 'arialbd.ttf', 'seguisb.ttf'):
            p = Path('C:/Windows/Fonts') / cand
            if p.exists():
                return str(p)
    return None


def draw_tracked(draw, text, font, fill, centre_y, tracking):
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2
    for ch, wdt in zip(text, widths):
        draw.text((x, centre_y), ch, font=font, fill=fill, anchor='lm')
        x += wdt + tracking


def main():
    stars, constellations, moons, paths = parse_fallback()
    if not stars or not moons or len(paths) < 2:
        raise SystemExit('fallback parse came back short — check the regexes')

    # Plate regime: 1200x630 is wider than 4:3, so the sky bodies live inside a
    # centred 4:3 plate (840 wide) — exactly what the CSS does.
    plate_w = H * 4 / 3
    plate_x = (W - plate_w) / 2

    img = vgrad_layer([(0.0, hexc('#04060F')), (0.34, hexc('#080C18')),
                       (0.52, hexc('#17110E')), (0.60, hexc('#0C0906')),
                       (1.0, hexc('#070505'))], W, H)

    # Two real horizon glows, additive over the base.
    for centre, radii, stops in (
        ((50, 55), (38, 16), [(0.0, (255, 209, 102, 128)), (0.70, (255, 209, 102, 0))]),
        ((50, 57), (120, 34), [(0.0, (255, 158, 0, 61)), (0.72, (255, 158, 0, 0))]),
    ):
        glow = radial_layer(centre, radii, stops, W, H)
        img = Image.alpha_composite(img.convert('RGBA'), glow).convert('RGB')

    draw = ImageDraw.Draw(img, 'RGBA')

    # Field stars, dimmed toward the horizon by their authored opacity.
    for left, top, opacity, size in stars:
        x, y = plate_x + left / 100 * plate_w, top / 100 * H
        draw.ellipse([x - size / 2, y - size / 2, x + size / 2, y + size / 2],
                     fill=(230, 238, 251, int(opacity * 255)))

    # Constellation stars, with their soft halos.
    for left, top, opacity, size in constellations:
        x, y = plate_x + left / 100 * plate_w, top / 100 * H
        halo = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(halo).ellipse([x - size, y - size, x + size, y + size],
                                     fill=(198, 224, 255, int(opacity * 140)))
        halo = halo.filter(ImageFilter.GaussianBlur(2))
        img = Image.alpha_composite(img.convert('RGBA'), halo).convert('RGB')
        draw = ImageDraw.Draw(img, 'RGBA')
        draw.ellipse([x - size / 2, y - size / 2, x + size / 2, y + size / 2],
                     fill=(244, 248, 255, int(opacity * 255)))

    # Moons at their real placements.
    for moon in moons:
        diam = moon['width'] / 100 * plate_w
        x = plate_x + moon['left'] / 100 * plate_w
        y = moon['top'] / 100 * H
        tile = moon_tile(diam, moon['background'])
        if 'boxShadow' in str(moon):
            glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            gr = diam * 0.75
            ImageDraw.Draw(glow).ellipse([x - gr, y - gr, x + gr, y + gr],
                                         fill=(255, 238, 214, 70))
            glow = glow.filter(ImageFilter.GaussianBlur(int(diam * 0.2)))
            img = Image.alpha_composite(img.convert('RGBA'), glow).convert('RGB')
        img.paste(tile, (int(x - diam / 2), int(y - diam / 2)), tile)
        draw = ImageDraw.Draw(img, 'RGBA')

    # Dunes: two silhouettes, gradient-filled per the SVG's own stops.
    for d, top_col, bot_col in ((paths[0], hexc('#1b130d'), hexc('#0a0705')),
                                (paths[1], hexc('#0d0906'), hexc('#050403'))):
        pts = flatten_path(d)
        ys = [p[1] for p in pts]
        y_top, y_bot = min(ys), max(ys)
        rows = Image.new('RGB', (1, H))
        for y in range(H):
            t = (y - y_top * H / 1000) / max(1e-6, (y_bot - y_top) * H / 1000)
            t = max(0.0, min(1.0, t))
            rows.putpixel((0, y), lerp(top_col, bot_col, max(0.0, (t - 0.55) / 0.45)))
        dune_layer = rows.resize((W, H))
        mask = Image.new('L', (W, H), 0)
        ImageDraw.Draw(mask).polygon(
            [(p[0] * W / 1000, p[1] * H / 1000) for p in pts], fill=255)
        img.paste(dune_layer, (0, 0), mask)

    # A lighter, smoother cousin of the splash scrim: centre 0.32 easing to
    # 0.59 at the corners, no hard ellipse edge. The world still reads and the
    # wordmark holds (large text needs 3:1; this clears it with room).
    scrim = radial_layer((50, 57), (52, 50),
                         [(0.0, (4, 3, 2, 82)), (0.55, (4, 3, 2, 125)), (1.0, (4, 3, 2, 150))],
                         W, H, small=(400, 158), fill_outside=True)
    img = Image.alpha_composite(img.convert('RGBA'), scrim).convert('RGB')
    draw = ImageDraw.Draw(img, 'RGBA')

    # The ember seam at --seam-y, with the "world arrives" bloom.
    seam_y = SEAM_Y * H
    bloom = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(bloom).rectangle(
        [W * 0.14, seam_y - 26, W * 0.86, seam_y + 26], fill=(255, 158, 0, 46))
    bloom = bloom.filter(ImageFilter.GaussianBlur(12))
    img = Image.alpha_composite(img.convert('RGBA'), bloom).convert('RGB')
    draw = ImageDraw.Draw(img, 'RGBA')
    for x in range(W):
        t = x / (W - 1)
        stops = [(0.0, 0), (0.26, 71), (0.50, 217), (0.74, 71), (1.0, 0)]
        for k in range(len(stops) - 1):
            p0, a0 = stops[k]
            p1, a1 = stops[k + 1]
            if p0 <= t <= p1:
                a = a0 + (a1 - a0) * (t - p0) / (p1 - p0)
                draw.line([x, seam_y - 1, x, seam_y + 1], fill=(255, 189, 68, int(a)))
                break

    # Wordmark group above the seam; status line below it, on the dunes.
    with tempfile.TemporaryDirectory() as tmpdir:
        font_path = ethnocentric(tmpdir)
        big = ImageFont.truetype(font_path, 84) if font_path else ImageFont.load_default()
        small = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 17)

        draw_tracked(draw, 'IGNIS AETERNUM', small, (0, 168, 232, 255), seam_y - 118, 14)
        draw_tracked(draw, "AXIS'27", big, (242, 247, 250, 255), seam_y - 62, 6)
        draw_tracked(draw, 'CENTRAL INDIA\'S LARGEST TECHNICAL FESTIVAL — VNIT NAGPUR',
                     small, (156, 144, 129, 255), seam_y + 44, 6)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.convert('RGB').save(OUT, 'PNG', optimize=True)
    print(f'wrote {OUT} ({OUT.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
