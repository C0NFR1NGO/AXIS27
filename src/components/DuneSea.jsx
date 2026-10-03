import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  EffectComposer, Bloom, Noise, Vignette, ToneMapping, SMAA,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import DuneSeaFallback from './DuneSeaFallback';

/* Re-exported so the fallback stays reachable from this module's public
 * surface, where it used to be defined. It now lives in its own three-free
 * file because HomePage shows it as a bridge image while this chunk loads. */
export { default as DuneSeaFallback } from './DuneSeaFallback';

/* ------------------------------------------------------------------ *
 * AXIS'27 â€” DUNE SEA AT DAWN / IGNIS AETERNUM
 *
 * Scrolling the home page turns the sky. At the top the dune sea sits under
 * a full field of stars with the sun's crown just breaking the horizon â€”
 * that ember on the skyline is the eternal flame, and the wordmark stands
 * directly in front of it. Scrolling lifts the sun into a warm morning: the
 * stars go out, the shadows shorten and swing, and the sand comes up out of
 * the dark. It is one continuous arc, driven entirely by scroll position.
 *
 * Sand is shaded here rather than drawn as line work, which only becomes a
 * good idea once the sun is low. Grazing light is what makes a dune look
 * sculptural: it turns a smooth mound into a lit crest with a long shadow.
 * The same surface under a high sun is a flat beige field, which is why
 * essentially all real dune photography is shot within an hour of sunrise.
 * So the shading model spends its budget on the two things low light needs
 * and nothing else: cast shadows, and light bleeding through crest edges.
 *
 * Four techniques carry it:
 *
 *   1. Cast shadows by ray-marching the height field toward the sun, with
 *      steps that grow geometrically so ten of them reach ninety units.
 *      Without cast shadows a dune sea has no depth at all at low sun.
 *   2. A coarser 3-octave field for those shadow samples. It correlates
 *      0.995 with the full 5-octave surface, so the shadows land in the
 *      right places at a third of the cost.
 *   3. Wrap diffuse, because sand is a dense scattering medium and its
 *      terminator is not at N.L = 0.
 *   4. Exposure that closes down as the sun rises, the way a real camera
 *      does. This is what keeps the frame from blowing out at midday while
 *      still letting the night read, and it holds the sand below the bloom
 *      threshold so bloom stays reserved for the sun.
 *
 * Requires WebGL2 â€” three 0.185 is WebGL2-only anyway, which also means
 * fwidth is available to ESSL1 shaders without an extension pragma.
 * ------------------------------------------------------------------ */

const NOISE_GLSL = /* glsl */ `
  /* Trig-free hash. The old sin(dot(...)) * 43758.5 hash cost two sines per
   * corner, i.e. eight per noise sample, and this shader takes around thirty
   * samples per fragment for the shadow march alone. That is a budget that
   * only works without transcendentals. It is also better distributed than
   * the sine hash, which visibly banded on some mobile GPUs. */
  vec2 hash2(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return -1.0 + 2.0 * fract((p3.xx + p3.yz) * p3.zy);
  }

  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
  }

  float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  float fbm3(vec2 p) {
    float f = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      f += gnoise(p) * a;
      p *= 2.07;
      a *= 0.5;
    }
    return f;
  }

  /* One definition, called from the vertex stage, the fragment stage and the
   * shadow march. If any two of those disagreed about where the dunes are,
   * the shadows would slide off the crests casting them, so there is
   * deliberately only one place to change it. */
  float driftAt(float t) { return t * 0.35; }

  /* Ridged multifractal, rebased onto a floor.
   *
   * gnoise lands in about [-0.62, 0.68], so scale toward [-1, 1] first;
   * 1.0 - abs() folds the valleys up into sharp crests. Squaring after the
   * fold sharpens them â€” squaring before would double every ridge, which is
   * not what dunes do.
   *
   * The raw normalised sum only spans about [0.19, 0.98]: a lumpy plateau
   * with no ground level anywhere. Subtracting the floor and rescaling gives
   * dunes rising out of a flat pan. The constants are the 0.4th and 99.6th
   * percentiles of the actual field, measured rather than guessed, which is
   * what puts a little genuine interdune flat in the result instead of
   * clipping half the surface to zero. Re-measure them if the hash, the
   * octave count or the lacunarity changes â€” they are properties of this
   * exact noise, not universal numbers. */
  float duneHeight(vec2 p, float drift) {
    vec2 q = vec2(p.x * 0.30, p.y) + vec2(drift, drift * 0.15);
    float h = 0.0;
    float amp = 1.0;
    float freq = 0.020;
    float norm = 0.0;
    for (int i = 0; i < 5; i++) {
      float n = gnoise(q * freq) * 1.45;
      n = clamp(1.0 - abs(n), 0.0, 1.0);
      n = n * n;
      h += n * amp;
      norm += amp;
      amp *= 0.46;
      freq *= 2.13;
    }
    h = clamp((h / norm - 0.2958) * 1.5629, 0.0, 1.0);
    return pow(h, 1.25);
  }

  /* The same field truncated to three octaves, for shadow sampling only.
   * Measured correlation with the full surface is 0.995 and the mean
   * absolute difference is 0.018 of full amplitude â€” well under a shadow
   * edge's own softness, so the shadows land where the visible crests are.
   * Its rebase constants differ because a 3-octave sum has a different
   * distribution; reusing the 5-octave pair here would lift the shadow
   * field slightly above the real one and every dune would self-shadow. */
  float macroHeight(vec2 p, float drift) {
    vec2 q = vec2(p.x * 0.30, p.y) + vec2(drift, drift * 0.15);
    float h = 0.0;
    float amp = 1.0;
    float freq = 0.020;
    float norm = 0.0;
    for (int i = 0; i < 3; i++) {
      float n = gnoise(q * freq) * 1.45;
      n = clamp(1.0 - abs(n), 0.0, 1.0);
      n = n * n;
      h += n * amp;
      norm += amp;
      amp *= 0.46;
      freq *= 2.13;
    }
    h = clamp((h / norm - 0.2645) * 1.4420, 0.0, 1.0);
    return pow(h, 1.25);
  }
`;

const TERRAIN_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec2 vPlane;
  varying float vHeight;

  ${NOISE_GLSL}

  void main() {
    vec3 pos = position;
    float drift = driftAt(uTime);

    /* Plane-local xy, handed to the fragment stage. It interpolates exactly,
     * because the plane really is flat in these coordinates, so the fragment
     * can march the same height field for shadows and place ripples without
     * inheriting the tessellation. */
    vPlane = pos.xy;

    float hn = duneHeight(pos.xy, drift);
    vHeight = hn;
    pos.z = hn * uAmp;

    /* Normal from finite differences at 1.1 units â€” a little wider than the
     * near-field quad size, which smooths the per-vertex normal without
     * flattening the crests. Ripples are added per-fragment later; putting
     * them here would need a hundred times this tessellation. */
    float e = 1.1;
    float hx = duneHeight(pos.xy + vec2(e, 0.0), drift) * uAmp;
    float hy = duneHeight(pos.xy + vec2(0.0, e), drift) * uAmp;
    vec3 tx = normalize(vec3(e, 0.0, hx - pos.z));
    vec3 ty = normalize(vec3(0.0, e, hy - pos.z));
    vec3 nLocal = normalize(cross(tx, ty));

    // The mesh is rotated flat, so local +z is world +y.
    vNormal = normalize(mat3(modelMatrix) * nLocal);

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const TERRAIN_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform vec3 uSunDir;
  uniform vec3 uSunCol;
  uniform vec3 uSkyCol;
  uniform vec3 uMoonDir;
  uniform vec3 uMoonCol;
  uniform vec3 uAlbLo;
  uniform vec3 uAlbHi;
  uniform vec3 uHazeCol;
  uniform float uSunStr;
  uniform float uAmbStr;
  uniform float uExposure;
  uniform float uRimFade;
  uniform float uDay;
  uniform float uRipple;
  uniform float uShadowSteps;
  uniform float uShadowBase;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec2 vPlane;
  varying float vHeight;

  ${NOISE_GLSL}

  /* Cast shadows by marching the height field toward the sun.
   *
   * Steps grow geometrically by exp2(0.42) per iteration. A uniform march
   * long enough to catch a crest ninety units away would need hundreds of
   * samples; growing the step reaches 92.6 units in ten, which covers every
   * shadow the sun casts above about 5 degrees of elevation. Below that the
   * diffuse term has collapsed to nothing anyway, so the shadows that go
   * missing are shadows inside an already-black frame.
   *
   * This marches in +local y because that is sunward: the mesh is a plane
   * rotated -PI/2 about x, so local +y maps to world -z, and the sun sits at
   * azimuth 0 in world -z. Give the sun an x component and this is no longer
   * the right direction to walk.
   *
   * Note the height reference is the MACRO field, not the visible one. The
   * comparison has to be between two samples of the same field or every
   * crest shadows itself by the difference between them. */
  float sunShadow(vec2 p, float drift, float h0) {
    vec3 L = normalize(uSunDir);
    float tanE = L.y / max(length(L.xz), 1e-3);
    float t = 0.0;
    float dt = uShadowBase;
    float occ = 0.0;
    for (int i = 0; i < 10; i++) {
      if (float(i) >= uShadowSteps) break;
      t += dt;
      dt *= 1.338;
      float hs = macroHeight(p + vec2(0.0, t), drift) * uAmp;
      float over = hs - (h0 + t * tanE);
      /* Penumbra widens with distance to the occluder, which is real: a
       * crest eighty units away casts a soft edge and one two units away
       * casts a hard one. Dividing that out of the smoothstep width is what
       * makes this read as sand rather than as a stencil, and it costs
       * nothing because t is already in hand. */
      occ = max(occ, smoothstep(0.0, 0.9 + t * 0.055, over));
    }
    return 1.0 - occ;
  }

  void main() {
    float drift = driftAt(uTime);
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 L = normalize(uSunDir);
    float dist = length(vWorld - cameraPosition);

    /* Ripples. Phase runs along local y because the height field is stretched
     * 0.30 in x, so its crests run along x and the prevailing wind is along
     * y â€” and ripples form across the wind. Warped by a slow noise so they
     * meander instead of running dead straight to the horizon.
     *
     * The wavelength is art-directed, not metric: real sand ripples are
     * about ten centimetres and would be sub-pixel everywhere in this frame.
     */
    float ph = vPlane.y * 2.2 + gnoise(vPlane * vec2(0.010, 0.035)) * 7.0;
    /* fwidth on the phase says how much of a ripple period falls inside one
     * pixel. Past about one period per pixel there is no signal left to
     * resolve and drawing it can only alias, so fade it out â€” the same
     * reasoning as a mipmap, done analytically. */
    float fade = 1.0 - smoothstep(0.8, 2.2, fwidth(ph));
    float drdy = cos(ph) * 2.2 * uRipple * fade;

    /* Re-inflate the interpolated normal back to a gradient before adding
     * the ripple slope. Dividing by n.y recovers (-dh/dx, 1, dh/dy) from the
     * normalised vector, so the ripple contribution can be added to the
     * gradient where it belongs instead of being nudged into a unit vector
     * at the wrong scale. */
    vec3 g = vNormal / max(vNormal.y, 1e-3);
    g.z += drdy;
    vec3 n = normalize(g);

    float hn = clamp(vHeight, 0.0, 1.0);
    vec3 alb = mix(uAlbLo, uAlbHi, pow(hn, 0.7));
    // Ripple crests are wind-scoured a shade lighter than their troughs.
    alb *= 1.0 + sin(ph) * 0.06 * fade;

    float shadow = sunShadow(vPlane, drift, macroHeight(vPlane, drift) * uAmp);

    /* Wrap diffuse. Sand scatters light a few grains deep, so its terminator
     * is not at N.L = 0 â€” it bleeds around the curve. w = 0.35 is what stops
     * a low sun from ruling a hard black line down the face of every dune,
     * which is the single most obvious tell of untreated Lambert on sand. */
    float w = 0.35;
    float wd = max((dot(n, L) + w) / (1.0 + w), 0.0);
    vec3 col = alb * uSunCol * uSunStr * wd * shadow;

    /* Back-lit crest rim. The camera looks into the sun across the dunes, so
     * every crest is edge-lit and the top of the sand transmits. Gated on
     * geometry, so it lands on the far side of crests where the surface turns
     * away, and faded as the sun climbs because this is grazing-light only.
     *
     * 0.26 is measured against the Bloom threshold, not chosen by eye: it
     * puts about 1% of the frame above 1.0 at the dawn moment and 0% at
     * midday. So a scatter of crest rims glows while the sand itself never
     * does, and bloom keeps meaning "this is a light source". */
    float rim = pow(1.0 - max(dot(n, V), 0.0), 4.0);
    col += uSunCol * rim * uSunStr * 0.26 * shadow * uRimFade;

    // Hemispheric sky fill, then moonlight while there is still night left.
    col += alb * uSkyCol * uAmbStr * (0.5 + 0.5 * n.y);
    col += alb * uMoonCol * 0.42 * (1.0 - uDay)
         * max(dot(n, normalize(uMoonDir)), 0.0);

    /* Aerial perspective into the sky's own horizon colour, so the sand
     * dissolves into the skyline instead of ending at it. uHazeCol is fed
     * from the same schedule that drives the sky, which is why the seam
     * stays invisible as the palette turns. */
    float haze = pow(1.0 - exp(-dist * 0.0021), 1.3);
    col = mix(col, uHazeCol, haze);

    gl_FragColor = vec4(col * uExposure, 1.0);
  }
`;

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSunDir;
  uniform vec3 uSunCol;
  uniform vec3 uMoonDir;
  uniform vec3 uMoonDirB;
  /* Angular radius multiplier, 1.0 at 4:3 and narrower elsewhere. A moon is a
   * fixed angular size, so shrinking the field of view for a portrait frame
   * blows it up: at aspect 0.46 a 2.3 degree radius disc is a third of the
   * screen wide, which is not the delicate crescent any of this was solved for.
   * Scaling the radius alongside the azimuth holds the moon at a constant
   * fraction of the frame â€” about 6% of frame width on both a desktop and a
   * phone. Per-pixel brightness is untouched, so the bloom solve survives. */
  uniform float uMoonScale;
  uniform vec3 uMoonCol;
  uniform vec3 uNightZenith;
  uniform vec3 uNightHorizon;
  uniform vec3 uDayZenith;
  uniform vec3 uDayHorizon;
  uniform vec3 uEmber;
  uniform vec3 uEmberHot;
  uniform vec3 uStarCol;
  uniform vec3 uGalCol;
  uniform float uDay;
  uniform float uStars;
  uniform float uTwilight;
  uniform float uExposure;
  /* Sidereal drift. uSkyPole is the axis the sky turns about and uSkyRot is
   * how far it has turned. Only the star and galaxy lookups use them â€” see the
   * note at the rotation itself for why the sky mesh is not simply spun. */
  uniform vec3 uSkyPole;
  uniform float uSkyRot;
  varying vec3 vDir;

  ${NOISE_GLSL}

  /* Rodrigues rotation. Cheaper than building a mat3 for one axis, and it is
   * an isometry, which matters more than the cost: apx is measured from
   * fwidth(d) on the UNROTATED direction, and because rotation preserves
   * angles that measurement stays valid for the rotated lookup. If this were a
   * scale or a shear instead, every star's pixel size would be wrong. */
  vec3 rotAxis(vec3 v, vec3 axis, float a) {
    float c = cos(a);
    return v * c + cross(axis, v) * sin(a) + axis * dot(axis, v) * (1.0 - c);
  }

  /* One star per cell of a 3D hash grid, brightness pow(h, 9).
   *
   * That curve is doing the real work. It turns a flat random field into
   * something close to a stellar magnitude distribution â€” a handful of cells
   * come out bright and the overwhelming majority sit below the visible
   * floor. Rolling a probability instead would give a field of identically
   * bright dots, which is the immediate tell of a fake night sky.
   *
   * apx (the angular size of one pixel) is passed in rather than measured
   * here on purpose: fwidth inside a function that gets called from a branch
   * is undefined behaviour, and this does get called from one.
   *
   * Returns a colour rather than a scalar, and flickers. Both of those come
   * from CosmicBackground, which gave its points three colours and a per-point
   * flicker â€” that variety is most of why it read as a sky, and a field of
   * identical dots is the other half of what made this one look flat. The
   * colours here are stellar though (cool blue-white through white to amber)
   * rather than that file's gold/cyan/crimson, which are interface colours and
   * would read as litter in a world that is otherwise only sand and fire. */
  vec3 starField(vec3 d, float cells, float apx, float thresh, float t, float tw) {
    vec3 p = d * cells;
    vec3 c = floor(p);
    vec3 h = hash33(c);
    float mag = pow(h.z, 9.0);
    mag = max(mag - thresh, 0.0) / (1.0 - thresh);

    /* Scintillation. Computed up here rather than at the end because it now
     * drives the spot's size as well as its brightness.
     *
     * Two detuned sines instead of one, which is most of the difference
     * between a sky and a string of fairy lights. A single sine gives every
     * star a metronome. Summed 0.62/0.38 with unrelated rates the two beat
     * against each other, so a star holds nearly steady for a while, then dips
     * hard, then recovers â€” bursts rather than a pulse, which is what
     * atmospheric seeing actually does. Both rates come from independent hash
     * components, so the beat period differs star to star as well.
     *
     * w lands in [-1, 1] and +1 is the REFERENCE state: largest and
     * brightest. Everything below modulates only downward from there, which is
     * what stops a bright star wandering across the bloom threshold at some
     * arbitrary moment instead of by design. */
    float w = 0.62 * sin(t * (1.7 + h.x * 5.3) + h.y * 43.0)
            + 0.38 * sin(t * (0.9 + h.y * 3.7) + h.z * 71.0);

    /* Drawn at a constant ~1.1 pixels regardless of distance or DPR, which is
     * not a cheat: a star is a point source, so a fixed spot is exactly what
     * it should leave. The twinkle swells that by up to 16% and never shrinks
     * it â€” below a pixel the field flickers as the camera drifts, and that is
     * aliasing rather than scintillation and reads like it. */
    float r = apx * cells * 1.1 * (1.0 + 0.16 * (0.5 + 0.5 * w));
    float dd = length(fract(p) - (0.22 + h * 0.56));
    float spot = (1.0 - smoothstep(r * 0.35, r, dd)) * mag;

    /* Depth is passed in rather than derived from d, because d is the rotated
     * lookup direction now and the air path a star is seen through depends on
     * where it sits ON SCREEN, not on where it sits on the celestial sphere.
     * Getting that backwards would make the twinkle strength drift across the
     * frame as the sky turned. */
    spot *= 1.0 - tw * (0.5 - 0.5 * w);

    /* Weighted toward the warm end because the blue end is genuinely rare â€”
     * an evenly mixed field looks like confetti. */
    return mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.83, 0.62),
               pow(h.x, 0.7)) * spot;
  }

  /* A MOON AS A SHADED SPHERE, not a stamped disc.
   *
   * The version this replaces faked a crescent by subtracting a second copy of
   * the disc offset in a hardcoded direction, and two things gave it away.
   * The offset was written in tangent-frame coordinates that bear no relation
   * to where the sun actually is â€” measured, the terminator sat 77 degrees off
   * at scroll 0, which is the frame every visitor sees first. And being
   * hardcoded it could not swing round as the sun climbed. Subtracting also
   * deletes the dark limb outright, so a thin phase had no body behind it: a
   * bright sliver floating on nothing.
   *
   * Instead, un-project the disc coordinate back onto the sphere to recover a
   * real surface normal, then light it with the same uSunDir that lights the
   * sand. The phase is then whatever the geometry says it is, it evolves as the
   * sun rises, and it costs one dot product less than the trick it replaces.
   *
   * Both moons have to be in frame while the sun is also in frame, which fixes
   * them about 30 degrees from it â€” so the correct phase is a thin crescent,
   * around 9% lit. Earthshine is what makes that legible: the ashen disc lit by
   * light bounced off the planet, faintly visible inside the horns. Leave it
   * out and a 9% moon reads as a scratch on the sky.
   *
   * The early returns are non-uniform control flow, which is fine here only
   * because apx arrives as an argument â€” nothing inside takes a derivative. */
  vec3 moonBody(vec3 d, vec3 m, float r, vec3 L, float apx, float bright) {
    /* The tangent frame below is just as degenerate at the antipode as it is
     * here, so without this a phantom moon appears opposite. Load-bearing. */
    if (dot(d, m) <= 0.0) return vec3(0.0);
    vec3 u = normalize(cross(m, vec3(0.0, 1.0, 0.0)));
    vec3 v = cross(u, m);
    vec2 q = vec2(dot(d, u), dot(d, v)) / r;
    float rq = length(q);
    // Limb held to ~1.5px at any DPR, off the same apx the stars use.
    float aa = max(apx / r, 0.004) * 1.5;
    float disc = 1.0 - smoothstep(1.0 - aa, 1.0, rq);
    if (disc <= 0.0) return vec3(0.0);

    /* Back onto the sphere: -m at the centre, so facing the viewer, and
     * perpendicular to the line of sight at the limb. */
    vec3 n = q.x * u + q.y * v - sqrt(max(1.0 - rq * rq, 0.0)) * m;

    /* Regolith backscatters hard, so a real moon is much flatter across the
     * disc than Lambert predicts and its terminator is abrupt rather than a
     * soft ramp. The fractional exponent stands in for that. */
    float lit = pow(max(dot(n, L), 0.0), 0.55);

    // Maria. Without them the lit side is a clean gradient â€” the other half
    // of why the old one read as a decal rather than a body.
    float mar = fbm3(n.xy * 3.6 + vec2(n.z * 2.4));
    float alb = 1.0 - 0.32 * smoothstep(0.0, 0.5, mar);

    return uMoonCol * alb * (lit * bright + 0.030) * disc;
  }

  void main() {
    vec3 d = normalize(vDir);
    vec3 L = normalize(uSunDir);

    /* Angular size of one pixel, measured once in uniform control flow.
     * Everything that has to hold a fixed pixel size â€” stars, both moon
     * limbs, the sun's edge â€” scales off this, which is what stops them
     * turning to mush at DPR 2 or to specks at DPR 1. */
    float apx = length(fwidth(d));

    vec3 zen = mix(uNightZenith, uDayZenith, uDay);
    vec3 hor = mix(uNightHorizon, uDayHorizon, uDay);
    float up = clamp(d.y * 1.45 + 0.06, 0.0, 1.0);
    vec3 col = mix(hor, zen, pow(up, 0.55));

    /* Stars and the galactic band. Branching on a uniform is uniform control
     * flow, so this is a legitimate way to buy back the cost once the sun is
     * up â€” and by then uStars is 0 and the whole block is dead weight. */
    if (uStars > 0.002) {
      /* SIDEREAL DRIFT.
       *
       * Only the lookup direction turns. The obvious implementation â€” spin the
       * sky mesh â€” is wrong here, because the sun, the ember band and both
       * moons are all drawn in this same shader off the same d, and they would
       * be dragged around with the stars. The horizon glow would slide out from
       * under the wordmark. So the gradient, the ember band, the sun and the
       * moons keep the true view direction and the star field is sampled
       * somewhere else instead.
       *
       * THE MINUS IS LOAD-BEARING. Rotating where we LOOK by +r makes the stars
       * appear to move by -r: this is a change of basis, not a motion, so it
       * runs backwards. The Constellations group is real geometry and rotates
       * by +uSkyRot; if these two ever disagree in sign the named figures will
       * sail one way while the field behind them goes the other, which is the
       * kind of thing that looks like a rendering fault rather than a bug. */
      vec3 ds = rotAxis(d, uSkyPole, -uSkyRot);

      /* Scintillation depth, stronger low down. Not a flourish: a star near
       * the horizon is seen through several times the air path of one
       * overhead, so it really does twinkle harder. Deliberately measured off
       * d and not ds â€” see starField for why. */
      float tw = mix(0.62, 0.26, clamp(d.y * 1.6, 0.0, 1.0));

      vec3 s1 = starField(ds, 62.0, apx, 0.16, uTime, tw);
      vec3 s2 = starField(ds, 137.0, apx, 0.34, uTime, tw);
      col += uStarCol * (s1 + s2 * 0.7) * 1.4 * uStars;

      /* Milky Way as the neighbourhood of a tilted great circle, filled with
       * fbm so it has structure rather than being an airbrushed stripe. The
       * fbm is sampled on a continuous function of the view direction rather
       * than on atan(), which would lay a visible seam down one meridian.
       * Sampled on ds so the band rides the drift with the stars â€” it is part
       * of the same sphere, and a galaxy that stayed put while the stars slid
       * across it would give the whole trick away. */
      vec3 gal = normalize(vec3(0.42, 0.66, -0.62));
      float band = 1.0 - smoothstep(0.0, 0.34, abs(dot(ds, gal)));
      float structure = fbm3(vec2(ds.x, ds.z) * 2.6 + vec2(ds.y * 3.1));
      col += uGalCol * band * clamp(0.35 + structure * 1.5, 0.0, 1.0)
           * uStars * 0.9;
    }

    /* Two moons, because Arrakis has two. They fade out as the sky comes up
     * rather than setting â€” a moon that tracked across the sky would need to
     * be somewhere specific at every scroll position, and this arc is short.
     *
     * The positions are solved, not chosen. At a pitch of about -4 degrees with
     * a 52-degree vertical FOV the top edge of frame is only +22 degrees up and
     * the sides are +/-41 at 16:9, and both discs have to clear those edges
     * from 4:3 through 21:9. The previous second moon sat at 26 degrees
     * elevation and 40 of azimuth: entirely off-screen at 16:9, which is why
     * only one was ever visible. Within what fits, these are as far from the
     * sun as they can get, because separation is what sets the phase â€” every
     * degree of it is another fraction of a pixel of lit crescent. */
    float mFade = 1.0 - smoothstep(0.25, 0.85, uDay);
    col += moonBody(d, normalize(uMoonDir),  0.040 * uMoonScale, L, apx, 0.85) * mFade;
    col += moonBody(d, normalize(uMoonDirB), 0.024 * uMoonScale, L, apx, 0.62) * mFade;

    /* Twilight band: hugs the horizon, hottest at the sun's azimuth. This is
     * the eternal flame at scroll 0 â€” the sun is still below the skyline, so
     * all that shows is its glow burning through one stretch of horizon,
     * dead centre, behind the wordmark. */
    vec2 dh = vec2(d.x, d.z);
    vec2 lh = normalize(vec2(L.x, L.z) + vec2(1e-5, -1.0e-5));
    float az = clamp(dot(dh / max(length(dh), 1e-4), lh), -1.0, 1.0);
    float toward = pow(max(az, 0.0), 3.2);
    /* 20, not 8. At 8 this band still had 5% of its strength at the top of
     * frame, which sounds negligible and is not: emberHot at 5% is roughly
     * forty times the night zenith's own red, so the band alone was enough
     * to turn the whole sky orange and bury the starfield. Measured at rest,
     * top of frame went from sRGB 0.739 red to 0.055 across this change and
     * the two below, while the horizon itself only moved 0.975 -> 0.969.
     * The glow is now genuinely a band â€” the eternal flame burning through
     * one stretch of skyline, which is what the composition always claimed. */
    float low = exp(-max(d.y, 0.0) * 20.0);
    col += mix(uEmber, uEmberHot, toward) * low
         * (0.16 + 0.80 * toward) * uTwilight;

    /* The sun, which in this design is also the flame. Same tangent-frame
     * trick as the moons, for the same precision reason. */
    vec3 su = normalize(cross(L, vec3(0.0, 1.0, 0.0)));
    vec3 sv = cross(su, L);
    vec2 sp = vec2(dot(d, su), dot(d, sv));
    float aS = length(sp);
    float front = step(0.0, dot(d, L));

    /* The rim licks. Ignis Aeternum is the theme, so the sun does not get a
     * clean photographic limb â€” fbm modulates its radius over time. Held to
     * 0.22 of a radius: past that it stops reading as a sun and starts
     * reading as a cartoon fireball. Sampled on cos/sin of the angle so the
     * pattern closes on itself instead of tearing along one ray. */
    float ang = atan(sp.y, sp.x);
    float lick = fbm3(vec2(cos(ang), sin(ang)) * 2.8
                    + vec2(uTime * 0.30, uTime * 0.21));
    float rS = 0.0165 * (1.0 + lick * 0.22);
    float disc = (1.0 - smoothstep(rS - apx * 1.4, rS, aS)) * front;

    /* Reddened while low. This is not decoration â€” a low sun really is
     * orange, because its light has taken the long path through the
     * atmosphere and lost the short wavelengths on the way. */
    vec3 sunTint = mix(uEmber, uSunCol, clamp(uDay * 1.15, 0.0, 1.0));
    col += sunTint * disc * 7.0;
    col += sunTint * exp(-aS * 13.0) * (0.30 + lick * 0.50) * front;
    /* Broad forward scatter: the sky brightens toward the sun. Two gates were
     * missing here, and their absence is what washed the entire frame orange.
     *
     * It has to fall off with height, and it has to be scaled by how much of
     * the air along the line of sight the sun can actually reach. At rest the
     * sun sits BELOW the skyline, so there is no lit path up the zenith at
     * all â€” yet unconditionally this single term was putting about a hundred
     * times the night sky's own red at the top of frame. It is also why the
     * moons read as flat mauve discs rather than crescents: a pale blue body
     * added onto a bright orange sky just makes lavender, so both were
     * losing their terminator to the background, not to their own shading. */
    float fwd = pow(max(dot(d, L), 0.0), 7.0) * exp(-max(d.y, 0.0) * 12.0);
    col += mix(uEmber, uSunCol, uDay) * fwd * mix(0.25, 1.0, uDay) * 0.30;

    gl_FragColor = vec4(col * uExposure, 1.0);
  }
`;

/* One particle field doing two jobs. At night these are embers climbing off
 * the flame; by morning they are dust hanging in the air, slower and dimmer
 * and no longer glowing. Crossfading one field is not a shortcut â€” embers
 * and motes move the same way, and two fields would mean two draw calls to
 * show the same thing twice.
 *
 * Animated entirely in the vertex shader: the CPU advances one uniform per
 * frame and never touches a buffer. */
const DUST_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uRise;
  uniform float uLife;
  uniform float uPixelRatio;
  uniform float uDay;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    vec3 p = position;

    // Embers climb; daytime dust mostly hangs and drifts.
    float rise = uRise * mix(1.0, 0.32, uDay);
    float climb = mod(uTime * aSpeed * rise + aPhase * 37.0, uLife);
    p.y += climb;
    p.x += sin(uTime * 0.45 + aPhase) * 2.6 + climb * 0.07;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float d = -mv.z;
    gl_PointSize = aSize * uPixelRatio * (150.0 / max(d, 1.0));

    vHeat = 1.0 - climb / uLife;
    // Faded at both ends of the depth range so nothing pops into existence.
    vAlpha = smoothstep(8.0, 44.0, d) * (1.0 - smoothstep(260.0, 520.0, d));
    vAlpha *= pow(vHeat, 1.5);
    vAlpha *= 0.55 + 0.45 * sin(uTime * 3.1 + aPhase * 4.0);
  }
`;

const DUST_FRAG = /* glsl */ `
  uniform vec3 uEmber;
  uniform vec3 uEmberHot;
  uniform vec3 uDustCol;
  uniform float uDay;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float m = 1.0 - smoothstep(0.08, 0.5, length(gl_PointCoord - 0.5));
    vec3 c = mix(mix(uEmber, uEmberHot, vHeat * 0.85), uDustCol, uDay);
    // Only the night embers are allowed over 1.0. Dust is lit, not emissive.
    float hot = (1.0 - uDay) * vHeat * 1.6;
    gl_FragColor = vec4(c * (1.0 + hot), m * vAlpha * mix(1.0, 0.5, uDay));
  }
`;

/* ------------------------------------------------------------------ *
 * CONSTELLATIONS â€” named stars, drawn as geometry rather than in the sky
 * shader, for one decisive reason: the field stars are a procedural hash
 * grid, so there is no way to know where any of them landed and therefore no
 * way to join them. These are placed, so they can be.
 *
 * Exposure is applied per-material in this scene (the renderer is set to
 * NoToneMapping and ACES happens in the composer), so both shaders below have
 * to multiply by uExposure themselves or they would fail to dim as the sun
 * comes up while everything around them did.
 * ------------------------------------------------------------------ */
const CSTAR_VERT = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uTime;
  attribute float aMag;
  attribute float aTw;
  varying float vMag;
  varying float vTw;
  void main() {
    vMag = aMag;

    /* The twinkle waveform is solved here, once per star, and handed to the
     * fragment stage as a varying. Both stages need the same number, and a
     * point sprite covers enough fragments that recomputing it there would be
     * wasteful as well as a chance for the two to disagree. Same
     * two-detuned-sines shape as the field stars, so the named stars and the
     * field behind them scintillate as one sky rather than as two systems. */
    float r1 = 1.5 + aTw * 3.4;
    float r2 = 0.8 + fract(aTw * 7.31) * 2.6;
    vTw = 0.62 * sin(uTime * r1 + aTw * 39.0)
        + 0.38 * sin(uTime * r2 + aTw * 91.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    /* Fixed on-screen size. These sit on a sphere 1316 units out, so
     * distance attenuation would be a rounding error anyway â€” but stating it
     * in pixels is what keeps them matched to the field stars, which are
     * sized off fwidth in the sky shader for the same reason.
     *
     * Size is one of the two levers that actually work on these stars; see
     * CSTAR_FRAG for why brightness is not one of them. The floor is 0.88 of
     * nominal, which even for the faintest star is 4.2 CSS px, so there is no
     * risk of dropping toward a single device pixel and flickering. */
    gl_PointSize = (2.4 + aMag * 4.0) * (1.0 + vTw * 0.12) * uPixelRatio;
  }
`;

const CSTAR_FRAG = /* glsl */ `
  uniform vec3 uStarCol;
  uniform float uExposure;
  uniform float uFade;
  varying float vMag;
  varying float vTw;
  void main() {
    float r = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (r > 1.0) discard;
    /* Core plus halo. A hard disc reads as a dot of UI; the halo is what
     * makes it read as a light source rather than a marker.
     *
     * The halo EXPONENT is what twinkles, and picking that particular knob is
     * the whole trick. Brightness â€” the obvious move, and what the field stars
     * use â€” barely works here: these nineteen stars land between 0.86 and 0.92
     * sRGB, which is the flat top of the ACES curve, so cutting linear light by
     * 22% moves the displayed value about 0.03. Measurably present, visually
     * absent. It is the same reason the sky read as static in the first place.
     *
     * The exponent changes how far the glow REACHES instead, and pow(1-r, he)
     * at r = 0 is exactly 1.0 for every he, so the peak pixel is pinned by
     * construction. That matters beyond tidiness: which stars cross the bloom
     * threshold is a design decision solved once below, and this way the
     * twinkle cannot quietly renegotiate it. The star breathes and the two
     * haloed stars stay haloed. */
    float he = 2.4 - vTw * 1.15;
    float a = (1.0 - smoothstep(0.0, 0.55, r))
            + pow(1.0 - r, he) * 0.5;

    /* A shallow brightness dip on top. Worth only about 0.03 sRGB by itself,
     * as established above â€” but it is in phase with the size and the halo, and
     * the three together read as one star twinkling rather than as a star
     * changing size. Downward only, so the peak state is still vTw = +1. */
    float dim = 1.0 - 0.16 * (0.5 - 0.5 * vTw);

    /* Gain solved against the bloom threshold, which this scene pins at 1.0
     * precisely so that only intended things glow. The line is steeper than it
     * looks like it needs to be, and that is the solve: at 0.126 + mag*0.306
     * the crossing landed at magnitude 0.87, which quietly pulled a third star
     * over â€” Alioth in the Dipper, at 1.006, i.e. blooming for no reason
     * anyone chose. Crossing at 0.905 instead means exactly Betelgeuse (1.047)
     * and Rigel (1.100) carry a halo and the other seventeen stay clean
     * points, which is both what was intended and, as it happens, true of the
     * real sky. The side effect is a wider dynamic range: the faintest star
     * drops from 0.788 to 0.679, so faint stars are now small AND dim rather
     * than small alone. Re-solve this if uExposure's night value moves. */
    float gain = 0.019 + vMag * 0.414;
    gl_FragColor = vec4(uStarCol * a * gain * dim * uFade * uExposure, 1.0);
  }
`;

const CLINK_VERT = /* glsl */ `
  attribute float aMag;
  varying float vMag;
  void main() {
    vMag = aMag;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CLINK_FRAG = /* glsl */ `
  uniform vec3 uMoonCol;
  uniform float uExposure;
  uniform float uFade;
  varying float vMag;
  void main() {
    /* The same light as the moons, deliberately: it ties the lines to the
     * bodies in the sky instead of to the chrome. Cyan here would read as a
     * UI overlay stapled to the world, and the one rule this scene holds
     * everywhere is that the world burns warm and only the interface is
     * allowed to look designed.
     *
     * These never cross 1.0, because a blooming line stops looking like a
     * drawn constellation and starts looking like a laser. WebGL caps
     * gl_LineWidth at 1, so brightness is the only lever there is â€” which is
     * why the value looks high for something described as a hairline: at DPR
     * 2 each line covers half a CSS pixel and loses most of it to coverage. */
    gl_FragColor = vec4(uMoonCol * vMag * uFade * uExposure, 1.0);
  }
`;

/* Meteor trail. Byte for byte the same as CLINK_VERT, and kept separate on
 * purpose: verify_direction pairs shader stages by their X_VERT / X_FRAG
 * prefix, so folding this into CLINK_VERT would leave METEOR_FRAG unpaired and
 * its varyings silently unchecked. Nine lines of duplication for a real check
 * is a trade worth making. */
const METEOR_VERT = /* glsl */ `
  attribute float aMag;
  varying float vMag;
  void main() {
    vMag = aMag;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const METEOR_FRAG = /* glsl */ `
  uniform vec3 uStarCol;
  uniform float uExposure;
  uniform float uFade;
  varying float vMag;
  void main() {
    /* 0.9 puts the head at 1.53 linear against a bloom threshold of 1.0, and
     * the taper carries the tail back under it within a couple of segments.
     * That split is the entire effect: the head glows and the trail does not,
     * which is what makes a one-pixel line read as a meteor rather than as a
     * scratch on the screen. Unlike the constellation links, this one is
     * MEANT to bloom â€” it is the brightest thing in the night sky short of the
     * moons, and briefly. */
    gl_FragColor = vec4(uStarCol * vMag * 0.9 * uFade * uExposure, 1.0);
  }
`;

/* Authored in sRGB, converted once to linear â€” the shaders work in linear
 * radiance throughout, and ACES is applied later in the composer. */
const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear();

const PALETTE = {
  /* Sand as ALBEDO, not as a colour to draw. These are reflectances: real
   * dry sand sits around 0.35-0.45, and the pair here brackets that. Getting
   * this wrong is what makes procedural sand look like plastic â€” an albedo
   * over ~0.6 cannot be lit into anything but a glowing beige blob. */
  albLo: lin('#7A5433'),
  albHi: lin('#D8B584'),

  sunLow: lin('#FF9A42'),
  sunHigh: lin('#FFF2DC'),

  /* Sky fill for the sand. Night is a desaturated violet-grey rather than a
   * cyber blue: the rule that the world burns warm and the interface stays
   * cold is held by SATURATION here, not by hue. A saturated blue night
   * would compete directly with the chrome. */
  ambNight: lin('#121A2E'),
  ambDay: lin('#9FB8CE'),

  nightZenith: lin('#04060F'),
  nightHorizon: lin('#0B0F1C'),
  /* Arrakis daylight, not Earth daylight. A properly blue zenith would drag
   * the whole world cold and collide with the interface palette, so the
   * zenith is a bleached grey-blue and the horizon is warm sand. */
  dayZenith: lin('#7C8B95'),
  dayHorizon: lin('#E7C79C'),

  ember: lin('#FF9E00'),
  emberHot: lin('#FFCE8A'),
  /* Near-white on purpose. starField now assigns each star its own colour
     temperature, so a strongly tinted white point here would flatten the
     warm end back out and undo the variety. */
  star: lin('#FFF6EC'),
  galaxy: lin('#2A3450'),
  moon: lin('#9FB0D8'),
  dust: lin('#D8C3A2'),
};

/* Moon directions, solved against the frame rather than picked by eye â€” see the
 * comment at the moon block in SKY_FRAG. Both clear every edge from 4:3 to 21:9
 * with a 6% margin while sitting as far from the sun as that allows:
 *
 *   A: elevation 16.7, azimuth -29.1  ->  34.0 deg from the sun, 8.5% lit
 *   B: elevation  7.0, azimuth +29.0  ->  30.2 deg from the sun, 6.8% lit
 *
 * Re-solve these if CAM_Y, the lookAt target or the FOV changes â€” they are
 * properties of the framing, not of the sky. */
const MOON_DIR = new THREE.Vector3(-0.4657, 0.2871, -0.8371).normalize();
const MOON_DIR_B = new THREE.Vector3(0.4812, 0.1219, -0.8681).normalize();

/* ------------------------------------------------------------------ *
 * CONSTELLATION DATA
 *
 * Three figures, nineteen stars, seventeen links â€” against CosmicBackground's
 * 250 nodes and 800 segments. That component's density is right for what it
 * is, a full-bleed graphic, but on a horizon it would read as a UI overlay
 * pinned over the world, and the interface is the only thing in this scene
 * allowed to look designed. Sparse is the whole brief.
 *
 * Placement is boxed in hard on every side, which is why these numbers look
 * arbitrary and are not. The camera sits at pitch -3.8 with vFOV 52, so the
 * top of frame is only +22.2 degrees; horizontally it sees +/-41 at 16:9 but
 * only +/-30.8 at 4:3, so anything that must survive a narrow window has to
 * live well inside 30. The wordmark occupies roughly +/-22 azimuth up to 5
 * elevation and the eyebrow sits at +/-11 between 6.4 and 8.2, and the two
 * moons hold (-29.1, 16.7) and (+29.0, 7.0). What is left is a band from
 * about 10 to 21 degrees up, and that is exactly where these three sit.
 *
 * Licence taken, and worth stating: Orion, Cassiopeia and the Dipper are
 * never all above the horizon at once from Nagpur's latitude. Same licence as
 * the two moons â€” this is Arrakis at an hour that does not exist.
 *
 * Everything above is the LANDSCAPE solve, and it is valid down to 4:3.
 * Narrower frames are not handled by a second set of hand-picked numbers but by
 * frameFit, which scales azimuths and plate scales together so this composition
 * survives the narrowing intact â€” the derivation is at frameFit. Below aspect
 * 0.69 the figures would be geometrically fine but too small to read, and the
 * sky switches to Orion's `portrait` entry on its own.
 *
 * Plate coordinates are degrees on a tangent plane, [x, y, magnitude], with
 * magnitude 0..1 driving both size and brightness.
 * ------------------------------------------------------------------ */
const CONSTELLATIONS = [
  {
    name: 'Orion',
    place: { az: -17.0, elev: 14.5, roll: -8, scale: 0.58 },
    /* The solo portrait composition, and it is solved the same way the
     * landscape one was rather than scaled down from it. With roll -8 the
     * plate's x extent is +/-5.20 and its y runs -7.13 to +7.86, so at scale
     * 0.46 the figure spans azimuth -6.39..-1.61 and elevation 11.72..18.62.
     * On a 0.46 aspect phone that is NDC x 0.11..0.50 and y 0.57..0.85, so it
     * clears the top of frame by 15% and stays out of the corner where the
     * vignette (offset 0.36, darkness 0.58) would eat the fainter stars.
     * Closest approach to the fitted moon A at (-10.9, 16.7) is 5.6 degrees,
     * against the 3 degree rule the landscape solve holds.
     *
     * Pushed left of centre deliberately. On a phone the wordmark is
     * proportionally far taller than it is on a desktop, so a figure sitting at
     * azimuth 0 would spend the whole scene behind it.
     *
     * Orion is the one that gets a portrait entry because it is the figure a
     * general audience can actually name â€” a lone Cassiopeia would read as five
     * unrelated dots. See FIT_SOLO_ASPECT. */
    portrait: { az: -4.0, elev: 15.0, roll: -8, scale: 0.46 },
    stars: [
      [-4.5, 7.0, 0.95], // Betelgeuse
      [4.0, 8.5, 0.7], // Bellatrix
      [-1.8, 0.0, 0.7], // Alnitak
      [0.0, 0.6, 0.75], // Alnilam
      [2.0, 1.2, 0.65], // Mintaka
      [-4.2, -7.5, 0.68], // Saiph
      [5.0, -6.5, 1.0], // Rigel
    ],
    links: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
  },
  {
    name: 'Cassiopeia',
    place: { az: 24.0, elev: 14.5, roll: -10, scale: 0.7 },
    stars: [
      [-6.0, 0.5, 0.72],
      [-3.0, -0.8, 0.85],
      [0.0, 0.6, 0.7],
      [3.0, -0.6, 0.72],
      [6.0, 1.2, 0.62],
    ],
    links: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    /* High centre, because it is the widest figure at 12.5 degrees across and
     * the only place it fits. An earlier pass put it at azimuth +35, which
     * dropped four of its seven stars off the right edge at 4:3 â€” a bowl with
     * no handle, the same class of bug as the moon that once shipped entirely
     * off screen. Check wide figures at 4:3, not at 16:9. */
    name: 'Big Dipper',
    place: { az: 2.0, elev: 18.5, roll: 8, scale: 0.8 },
    stars: [
      [-6.5, 1.6, 0.85],
      [-5.6, -0.8, 0.8],
      [-3.0, -1.6, 0.78],
      [-1.6, -0.4, 0.6],
      [0.6, -0.2, 0.88],
      [3.2, 0.4, 0.74],
      [6.0, -0.6, 0.86],
    ],
    links: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]],
  },
];

const D2R = Math.PI / 180;

/* Gnomonic (tangent-plane) projection of a plate coordinate onto the sky.
 *
 * tan of the angle, not the angle itself â€” that is the entire trick. With a
 * raw angular offset the figure is drawn on a curved surface and straight
 * chart lines come out bowed, which on the Dipper is instantly legible as
 * wrong because everyone knows that handle is straight. Projecting through a
 * tangent plane keeps lines straight at the cost of a little scale distortion
 * at the edges, and at 12 degrees across that distortion is invisible. */
function plateDir(place, px, py, radius) {
  const az = place.az * D2R;
  const el = place.elev * D2R;
  const c = new THREE.Vector3(
    Math.sin(az) * Math.cos(el),
    Math.sin(el),
    -Math.cos(az) * Math.cos(el),
  );
  const right = new THREE.Vector3().crossVectors(c, new THREE.Vector3(0, 1, 0)).normalize();
  const up = new THREE.Vector3().crossVectors(right, c).normalize();

  const r = (place.roll || 0) * D2R;
  const s = (place.scale ?? 1) * D2R;
  const x = (px * Math.cos(r) - py * Math.sin(r)) * s;
  const y = (px * Math.sin(r) + py * Math.cos(r)) * s;

  return c
    .clone()
    .addScaledVector(right, Math.tan(x))
    .addScaledVector(up, Math.tan(y))
    .normalize()
    .multiplyScalar(radius);
}

/* ------------------------------------------------------------------ *
 * FRAME FIT â€” how a portrait window gets the same sky
 *
 * three's `fov` is the VERTICAL field of view, so the horizontal one falls out
 * of the aspect: hHalf = atan(tan(vHalf) * aspect). At 4:3 â€” the narrowest
 * frame everything above was solved against â€” that is 33.0 degrees. A phone
 * held upright is aspect 0.46, where it collapses to 12.7, and every azimuth
 * in this file sits between 17 and 29. So on a phone both moons and all three
 * figures were outside the frame entirely.
 *
 * That, and not a WebGL capability problem, is the real reason this scene used
 * to be replaced by a flat gradient below 768px. The capability gate was
 * covering for a framing bug, which is worth stating plainly because the gate
 * looked like a considered performance decision and read as one for months.
 *
 * NDC x goes as tan(az) / (tan(vHalf) * aspect), so to hold a body at the same
 * spot in the frame across aspects the quantity to scale is the TANGENT of the
 * azimuth, not the azimuth. The two agree to about a degree out at 29, and that
 * degree is most of the edge margin, so the distinction is load-bearing rather
 * than pedantic. Scaling tangents also makes the factor collapse, because
 * tan(vHalf) cancels top and bottom:
 *
 *     fit = aspect / (4/3)
 *
 * Plate scale is multiplied by the same factor, which holds a figure at a fixed
 * fraction of the frame width instead of squashing it â€” the Dipper's handle has
 * to stay straight and stay recognisable, which is the whole reason plateDir
 * projects gnomonically in the first place.
 *
 * Clamped at 1, so anything wider than 4:3 keeps the solved composition
 * untouched. Widening a window only adds margin, and re-deriving for it would
 * move both moons on every desktop for no reason.
 *
 * One standing assumption: every body this is applied to is in front of the
 * camera, |az| < 90. tan/atan is not a bijection past that and the round trip
 * would silently fold a body behind the viewer onto the frame in front.
 * ------------------------------------------------------------------ */
const FIT_REF_ASPECT = 4 / 3;

/* Below this aspect the fit is still geometrically correct but stops being
 * legible. The closest pair of stars anywhere in the three figures sits 1.10
 * degrees apart at 4:3, and a star point sprite is 0.21 degrees across, so
 * under a fit of 0.573 the gap between two discs falls below two sprite widths
 * and a figure reads as a smudge rather than as stars. That is aspect 0.764,
 * rounded up to 0.78 for margin.
 *
 * Worth recording that the first pass put this at 0.69, derived from Orion's
 * belt by hand. The belt is not the tightest pair in the data â€” the checker
 * swept every pair and found one 43% closer, which is exactly the class of
 * mistake that comes from picking the endpoint you believe is extremal instead
 * of measuring all of them. */
const FIT_SOLO_ASPECT = 0.78;

/* The aspect the solo portrait composition is solved at: a 390x844 phone, which
 * is the modal handset. Below it the solo figure shrinks along with everything
 * else, and that is not cosmetic â€” the moons keep fitting inward as the frame
 * gets taller, so a figure pinned at a fixed azimuth would eventually be
 * sitting underneath moon A. Clamped at 1 above it rather than allowed to grow,
 * because elevation is never fitted: a figure scaled up to fill a wider window
 * runs into the top of frame long before it runs out of horizontal room. */
const FIT_PORTRAIT_REF = 390 / 844;

function frameFit(aspect) {
  return Math.min(1, Math.max(aspect, 0.2) / FIT_REF_ASPECT);
}

/* Azimuth in, azimuth out, both in degrees. */
function azFit(azDeg, fit) {
  return Math.atan(Math.tan(azDeg * D2R) * fit) / D2R;
}

/* The moons are stored as directions rather than angles, because a direction is
 * what the shader wants, so the fit has to go out to an azimuth and back.
 * Elevation is deliberately untouched: the vertical field of view does not
 * depend on aspect, so a portrait window sees exactly the same band of sky
 * vertically and there is nothing there to correct. */
function fitDir(dir, fit) {
  const el = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
  const az = Math.atan(Math.tan(Math.atan2(dir.x, -dir.z)) * fit);
  return new THREE.Vector3(
    Math.sin(az) * Math.cos(el),
    Math.sin(el),
    -Math.cos(az) * Math.cos(el),
  );
}

/* The figures that survive a given frame, already fitted. Above the solo
 * threshold this is the solved landscape composition with every azimuth and
 * every plate scale pushed through the fit, which holds the arrangement in
 * place as the window narrows â€” the figures shrink, they do not drift or
 * collide, and that is a property of the fit rather than luck. Below it, the
 * hand-solved portrait entry is used verbatim: one figure at a size a phone can
 * read beats three at a size it cannot. */
function fittedFigures(aspect) {
  if (aspect < FIT_SOLO_ASPECT) {
    const p = Math.min(1, aspect / FIT_PORTRAIT_REF);
    return CONSTELLATIONS.filter((c) => c.portrait).map((c) => ({
      ...c,
      place: {
        ...c.portrait,
        az: azFit(c.portrait.az, p),
        scale: (c.portrait.scale ?? 1) * p,
      },
    }));
  }
  const fit = frameFit(aspect);
  return CONSTELLATIONS.map((c) => ({
    ...c,
    place: { ...c.place, az: azFit(c.place.az, fit), scale: (c.place.scale ?? 1) * fit },
  }));
}

/* Shared by Sky and Terrain, and it has to be both: the moon lights the sand
 * from the direction it is seen from, so a fitted disc over unfitted moonlight
 * would put the highlight on the wrong side of every crest. */
function useFittedMoons(uniforms) {
  const aspect = useThree((s) => s.size.width / s.size.height);
  useEffect(() => {
    const fit = frameFit(aspect);
    if (uniforms.uMoonDir) uniforms.uMoonDir.value.copy(fitDir(MOON_DIR, fit));
    if (uniforms.uMoonDirB) uniforms.uMoonDirB.value.copy(fitDir(MOON_DIR_B, fit));
    /* Sky only. Terrain reads the direction to light the sand and has no disc
     * to size, so it declares no uMoonScale and this is skipped there. */
    if (uniforms.uMoonScale) uniforms.uMoonScale.value = fit;
  }, [aspect, uniforms]);
}

/* SIDEREAL DRIFT â€” the axis the night sky turns about, and how fast.
 *
 * The axis is the real north celestial pole for VNIT's latitude, 21.1255 N:
 * normalize(0, sin lat, cos lat). It sits 21 degrees above the horizon and,
 * since +z is behind the camera, behind the viewer's shoulder â€” which is why
 * the figures wheel gently across the frame instead of pinwheeling. A pole
 * placed inside the visible region does not work at all, and that is worth
 * recording because it looks like the obvious choice: the clear strip of sky
 * between the wordmark and the top of the frame is about eleven degrees tall,
 * and circles do not fit inside strips.
 *
 * Four candidate axes were swept for how far the sky can turn before the first
 * constellation star leaves a 4:3 frame. Turning toward -azimuth is worth 19.4
 * degrees of headroom against 7.7 the other way, so the SIGN matters more than
 * the axis; this axis happens to be both the astronomically honest choice and
 * the most generous of the four. Across the whole sweep no star ever crosses
 * either moon's limb â€” closest approach is 1.1 degrees outside moon B at around
 * the three minute mark, which is a graze rather than an overlap.
 *
 * The rate is 24x sidereal, and that multiplier is the point rather than a
 * compromise. True sidereal is 0.00417 deg/s, which works out to 0.08 px/s in
 * this frame and is exactly as static as it sounds. 0.1 deg/s is 2 px/s: a star
 * clears 20 px in ten seconds against fixed type, which reads as a sky that is
 * alive without ever reading as an animation. The 19.4 degree budget lasts
 * 3 min 14 s, after which the named figures gradually leave frame â€” the field
 * stars are a procedural hash grid, so they are infinite and the sky itself
 * never empties. */
const SKY_POLE = new THREE.Vector3(
  0, Math.sin(21.1255 * D2R), Math.cos(21.1255 * D2R)).normalize();
const SKY_SPIN = 0.1 * D2R; // rad/s; positive carries the stars west, -azimuth

const SKY_RADIUS = 1400;
const TERRAIN_W = 900;
const TERRAIN_D = 900;
const TERRAIN_Z = -380;
/* Power curve on the depth axis. 1.0 would be a uniform grid; 1.9 puts about
 * 40% of the rows into the first 170 units in front of the camera, giving
 * roughly 1.3-unit quads there and 4-unit quads at the horizon where they
 * subtend almost nothing. */
const DEPTH_WARP = 1.9;

/* Relief in world units, and the camera height that clears it. Measured, not
 * assumed: the sampled maximum crest at amplitude 15 is 15.0, so 25 rising to
 * 31 leaves +10 to +16 of clearance across the whole scroll. An earlier pass
 * had the camera at 6.2 with a mean terrain height of 9.9 â€” flying through
 * the inside of the dunes, which is its own kind of "looks terrible". Always
 * check camera height against the sampled crest, never against this constant. */
const TERRAIN_AMP = 15.0;
const CAM_Y = 25.0;

/* Load-in. INTRO_DEPTH is in scroll units, not degrees: fed through the
 * schedule's negative branch it puts the sun at about -9.4 degrees, deep enough
 * that the horizon glow is a third of its resting strength and the lift is
 * unmistakable. 3.6s is long enough to read as a sunrise and short enough not
 * to hold the page hostage; INTRO_SKIP is what is left if the visitor scrolls. */
const INTRO_DEPTH = 0.26;
const INTRO_DUR = 3.6;
const INTRO_SKIP = 0.9;

const sstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ *
 * THE SCHEDULE
 *
 * One function owns the entire day. Sky, sand, dust and exposure all read
 * from it, so the arc can be retimed by editing this and nothing else â€”
 * rather than by hunting matched constants across three shaders, which is
 * how a sunrise ends up with the shadows pointing one way and the sky
 * lighting another.
 *
 * Everything is keyed to the sun's ELEVATION rather than to scroll directly.
 * That is what keeps it physically coherent: stars fade because the sky is
 * getting bright, shadows shorten because the sun is climbing. Retiming the
 * scroll curve then cannot desynchronise any of it.
 * ------------------------------------------------------------------ */
function solveSky(s) {
  /* Elevation in degrees. The exponent above 1 means the sun leaves the
   * horizon slowly and then accelerates, so the first flick of scroll reads
   * as something enormous beginning to move. It starts at -1.5, just under
   * the skyline: at rest you get a starfield with a burning horizon, which
   * is the frame the centred wordmark was composed against.
   *
   * (A dark starry sky over a lit horizon is a licence â€” by the time the sun
   * is that close, real twilight has already washed the stars out. It is the
   * Dune reading of the moment rather than the photometric one, and it is
   * worth the trade.)
   *
   * s is allowed below zero, and that is the whole mechanism behind the
   * load-in: the intro feeds a negative value and lets it decay to zero, so
   * the sun LIFTS into its resting position rather than appearing there. The
   * branch belongs in this function rather than in the driver precisely so the
   * intro and the scroll are the same motion â€” the sun cannot rise, stop, and
   * then start again, which is what any separately animated intro would give.
   * The exponent above 1 on the negative side means it arrives at rest with
   * its velocity going to zero instead of slamming into place. */
  const t = Math.min(Math.max(s, -0.45), 1);
  const elevDeg = t >= 0
    ? -1.5 + 34.0 * Math.pow(t, 1.25)
    : -1.5 - 46.0 * Math.pow(-t, 1.3);
  const day = sstep(-2.0, 16.0, elevDeg);
  return {
    elevDeg,
    sunY: Math.sin((elevDeg * Math.PI) / 180),
    sunZ: -Math.cos((elevDeg * Math.PI) / 180),
    day,
    stars: 1.0 - sstep(0.0, 11.0, elevDeg),
    // Peaks as the sun crosses the skyline, gone by ~20 degrees.
    twilight: Math.exp(-Math.pow((elevDeg - 1.0) / 9.0, 2)),
    sunStr: sstep(-2.0, 11.0, elevDeg) * 3.4,
    ambStr: 0.22 + 0.72 * day,
    /* Exposure closes down as the sun rises, exactly as a camera does.
     * Measured: this holds mean frame luminance from 0.034 to 0.30 across
     * the arc â€” a ninefold change that reads unmistakably as night into day
     * â€” while keeping the 95th percentile under 0.55 so the sand never
     * crosses the bloom threshold and never blows out. */
    exposure: 1.7 * (1 - day) + 0.38 * day,
    // Crest translucency is a grazing-light effect; it has no business at noon.
    rimFade: Math.exp(-Math.max(elevDeg, 0) / 11.0),
  };
}

/* Owns the scroll signal and the smoothed environment every other component
 * reads. Placed first in the JSX so its useFrame registers first, but nothing
 * here is order-critical: worst case a material reads a one-frame-old sun
 * position, which at these rates is invisible.
 *
 * Deliberately NOT using a useFrame priority to force ordering â€” a nonzero
 * priority switches off R3F's automatic render and the canvas goes black. */
function EnvDriver({ env, reducedMotion, active, scrollY }) {
  useEffect(() => {
    /* When scrollY is set, lock the scene to that position â€” no DOM scroll
     * listener needed. Used by AppContent to pin non-home pages at the night
     * state (scrollY=1) as a full-viewport background. */
    if (scrollY != null) {
      env.targetScroll = scrollY;
      env.scroll = scrollY;
      return undefined;
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      env.targetScroll = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [env, scrollY]);

  useFrame((state, delta) => {
    /* Smoothed rather than read raw. Trackpad and smooth-scroll events
     * arrive unevenly, and an unsmoothed sun would visibly stutter up the
     * sky. Frame-rate independent, so it behaves the same at 60 and 144. */
    const k = 1 - Math.pow(0.02, Math.min(delta, 0.1));
    env.scroll += (env.targetScroll - env.scroll) * k;

    /* LOAD-IN. The sun starts about 9 degrees under the horizon and lifts to
     * its resting position, so the page opens on a deep starfield that warms
     * into the burning skyline the wordmark sits against.
     *
     * Held at zero until `active`, which is what makes it survive the splash.
     * The canvas now mounts BEHIND the intro overlay so that the chunk, the
     * WebGL context and eight shader compiles all land while there is still
     * something on screen to look at. Ramping on mount would therefore spend
     * most of a 3.6s sunrise underneath an opaque div: the visitor would get
     * the splash, then the sun already up. Parking the sun at its intro depth
     * and starting the clock on reveal costs nothing â€” the frames still render,
     * so the compile still happens early â€” and the sunrise plays in full.
     *
     * Any real scroll input collapses the remainder into INTRO_SKIP: the intro
     * is a courtesy, not a cutscene, and a visitor who has already started
     * scrolling should not have to wait out an animation to get control of the
     * sun. Reduced-motion skips it outright â€” this is a large moving light
     * source and it is exactly what that preference is asking about. */
    if (active) {
      const dur = env.targetScroll > 0.003 ? INTRO_SKIP : INTRO_DUR;
      env.intro = Math.min(env.intro + delta / dur, 1);
    }
    const lift = (reducedMotion || scrollY != null)
      ? 0
      : INTRO_DEPTH * Math.pow(1 - env.intro, 1.6);

    const sky = solveSky(Math.max(env.scroll, 0) - lift);
    env.sky = sky;
    env.sunDir.set(0, sky.sunY, sky.sunZ);

    env.sunCol.copy(PALETTE.sunLow).lerp(PALETTE.sunHigh, sky.day);
    env.ambCol.copy(PALETTE.ambNight).lerp(PALETTE.ambDay, sky.day);
    /* Haze is the sky's own horizon colour, warmed by however much twilight
     * is burning. Feeding the terrain from the same schedule is what keeps
     * the skyline seam invisible as the palette turns. */
    env.hazeCol.copy(PALETTE.nightHorizon).lerp(PALETTE.dayHorizon, sky.day);
    env.hazeCol.lerp(PALETTE.ember, sky.twilight * 0.42);
    env.time = state.clock.elapsedTime;
    /* One number, read by both the sky shader and the Constellations group, so
     * that the field stars and the named figures cannot possibly drift apart.
     * Reduced motion pins it at zero: an entire sky in slow continuous motion
     * is squarely what that preference is about. The stars still twinkle in
     * place, which is scintillation rather than movement. */
    env.skyRot = reducedMotion ? 0 : env.time * SKY_SPIN;
  });

  return null;
}

function Terrain({ env, segW, segD, shadowSteps, shadowBase }) {
  const matRef = useRef();

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(TERRAIN_W, TERRAIN_D, segW, segD);
    const pos = g.attributes.position;
    const half = TERRAIN_D / 2;
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) + half) / TERRAIN_D; // 0 = nearest, 1 = horizon
      pos.setY(i, -half + TERRAIN_D * Math.pow(t, DEPTH_WARP));
    }
    pos.needsUpdate = true;
    g.computeBoundingSphere();
    return g;
  }, [segW, segD]);

  useEffect(() => () => geo.dispose(), [geo]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAmp: { value: TERRAIN_AMP },
    uSunDir: { value: new THREE.Vector3(0, 0.02, -1) },
    uSunCol: { value: new THREE.Color() },
    uSkyCol: { value: new THREE.Color() },
    /* Cloned for the same reason as in Sky â€” useFittedMoons mutates it. */
    uMoonDir: { value: MOON_DIR.clone() },
    uMoonCol: { value: PALETTE.moon },
    uAlbLo: { value: PALETTE.albLo },
    uAlbHi: { value: PALETTE.albHi },
    uHazeCol: { value: new THREE.Color() },
    uSunStr: { value: 0 },
    uAmbStr: { value: 0.22 },
    uExposure: { value: 1.7 },
    uRimFade: { value: 1 },
    uDay: { value: 0 },
    /* Ripple height amplitude in world units. With wavenumber 2.2 this tilts
     * the normal by about 11 degrees at the steepest point â€” plenty under
     * grazing light, invisible once the sun is high, which is correct. */
    uRipple: { value: 0.09 },
    uShadowSteps: { value: shadowSteps },
    uShadowBase: { value: shadowBase },
  }), [shadowSteps, shadowBase]);

  useFittedMoons(uniforms);

  useFrame(() => {
    const m = matRef.current;
    if (!m || !env.sky) return;
    const u = m.uniforms;
    u.uTime.value = env.time;
    u.uSunDir.value.copy(env.sunDir);
    u.uSunCol.value.copy(env.sunCol);
    u.uSkyCol.value.copy(env.ambCol);
    u.uHazeCol.value.copy(env.hazeCol);
    u.uSunStr.value = env.sky.sunStr;
    u.uAmbStr.value = env.sky.ambStr;
    u.uExposure.value = env.sky.exposure;
    u.uRimFade.value = env.sky.rimFade;
    u.uDay.value = env.sky.day;
  });

  return (
    <mesh
      geometry={geo}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, TERRAIN_Z]}
      frustumCulled={false}
    >
      <shaderMaterial
        ref={matRef}
        vertexShader={TERRAIN_VERT}
        fragmentShader={TERRAIN_FRAG}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Sky({ env }) {
  const matRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDir: { value: new THREE.Vector3(0, 0.02, -1) },
    uSunCol: { value: new THREE.Color() },
    /* Cloned rather than shared. MOON_DIR is a module const that Terrain reads
     * as well, and useFittedMoons writes into these vectors in place. */
    uMoonDir: { value: MOON_DIR.clone() },
    uMoonDirB: { value: MOON_DIR_B.clone() },
    uMoonScale: { value: 1 },
    uMoonCol: { value: PALETTE.moon },
    uNightZenith: { value: PALETTE.nightZenith },
    uNightHorizon: { value: PALETTE.nightHorizon },
    uDayZenith: { value: PALETTE.dayZenith },
    uDayHorizon: { value: PALETTE.dayHorizon },
    uEmber: { value: PALETTE.ember },
    uEmberHot: { value: PALETTE.emberHot },
    uStarCol: { value: PALETTE.star },
    uGalCol: { value: PALETTE.galaxy },
    uDay: { value: 0 },
    uStars: { value: 1 },
    uTwilight: { value: 1 },
    uExposure: { value: 1.7 },
    uSkyPole: { value: SKY_POLE },
    uSkyRot: { value: 0 },
  }), []);

  useFittedMoons(uniforms);

  useFrame(() => {
    const m = matRef.current;
    if (!m || !env.sky) return;
    const u = m.uniforms;
    u.uTime.value = env.time;
    u.uSunDir.value.copy(env.sunDir);
    u.uSunCol.value.copy(env.sunCol);
    u.uDay.value = env.sky.day;
    u.uStars.value = env.sky.stars;
    u.uTwilight.value = env.sky.twilight;
    u.uExposure.value = env.sky.exposure;
    u.uSkyRot.value = env.skyRot;
  });

  return (
    <mesh frustumCulled={false}>
      <sphereGeometry args={[SKY_RADIUS, 64, 40]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function DustField({ env, count }) {
  const matRef = useRef();
  const { gl } = useThree();

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 520;
      /* Spawned above the highest crest so particles rise through open air
       * rather than out of the inside of a dune. */
      pos[i * 3 + 1] = TERRAIN_AMP + 1 + Math.random() * 14;
      pos[i * 3 + 2] = 40 - Math.random() * 460;
      speed[i] = 0.5 + Math.random() * 1.4;
      size[i] = 0.7 + Math.random() * 1.9;
      phase[i] = Math.random() * Math.PI * 2;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uRise: { value: 5.2 },
    uLife: { value: 90.0 },
    uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    uDay: { value: 0 },
    uEmber: { value: PALETTE.ember },
    uEmberHot: { value: PALETTE.emberHot },
    uDustCol: { value: PALETTE.dust },
  }), [gl]);

  useFrame(() => {
    const m = matRef.current;
    if (!m || !env.sky) return;
    m.uniforms.uTime.value = env.time;
    m.uniforms.uDay.value = env.sky.day;
  });

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={DUST_VERT}
        fragmentShader={DUST_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Named stars and the lines between them.
 *
 * Two draw calls, both at 0.94 of the sky radius â€” 1316 units, which is well
 * beyond the terrain's far edge at about 864. That matters: with depthTest on
 * and depthWrite off, the dunes occlude any part of a figure that dips below
 * the skyline, while the sky sphere (which also writes no depth) does not. So
 * the constellations sit *in* the world rather than on top of it, without a
 * single line of masking code.
 *
 * uFade tracks env.sky.stars exactly, so these dissolve on the same curve as
 * the field stars as the sun comes up. Anything else and you would get a
 * constellation hanging in a blue morning sky. */
/* A per-star twinkle seed, deterministic rather than Math.random so the sky
 * comes up identical on every load and a phase problem is reproducible instead
 * of a once-a-session mystery. The sin-fract shape is the same hash the shaders
 * use, which is the only reason to prefer it over anything else here. */
const twSeed = (i) => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

function Constellations({ env }) {
  const grp = useRef();
  const starMat = useRef();
  const linkMat = useRef();
  const { gl } = useThree();
  /* Subscribed to the ratio rather than to width and height, so a mobile
   * browser sliding its address bar away â€” a height change of maybe 12% with no
   * change of shape â€” does not rebuild the buffers. A phone actually rotating
   * does, which is the case that matters. */
  const aspect = useThree((s) => s.size.width / s.size.height);

  const [starGeo, linkGeo] = useMemo(() => {
    const radius = SKY_RADIUS * 0.94;
    const sPos = [];
    const sMag = [];
    const sTw = [];
    const lPos = [];
    const lMag = [];

    for (const cst of fittedFigures(aspect)) {
      const pts = cst.stars.map(([px, py]) => plateDir(cst.place, px, py, radius));
      pts.forEach((p, i) => {
        sPos.push(p.x, p.y, p.z);
        sMag.push(cst.stars[i][2]);
        sTw.push(twSeed(sTw.length));
      });
      for (const [a, b] of cst.links) {
        lPos.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z);
        /* A link is only as bright as its dimmer end, and then some. Keyed off
         * min() rather than the average so a line running from Rigel out to a
         * faint star fades toward the faint end, which is how a chart reads â€”
         * the eye follows brightness into the figure, not out of it. */
        const m = 0.09 + 0.07 * Math.min(cst.stars[a][2], cst.stars[b][2]);
        lMag.push(m, m);
      }
    }

    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(sPos, 3));
    sg.setAttribute('aMag', new THREE.Float32BufferAttribute(sMag, 1));
    sg.setAttribute('aTw', new THREE.Float32BufferAttribute(sTw, 1));

    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(lPos, 3));
    lg.setAttribute('aMag', new THREE.Float32BufferAttribute(lMag, 1));

    return [sg, lg];
  }, [aspect]);

  const starUniforms = useMemo(() => ({
    uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    uStarCol: { value: PALETTE.star },
    uExposure: { value: 1.0 },
    uFade: { value: 1.0 },
    uTime: { value: 0 },
  }), [gl]);

  const linkUniforms = useMemo(() => ({
    uMoonCol: { value: PALETTE.moon },
    uExposure: { value: 1.0 },
    uFade: { value: 1.0 },
  }), []);

  useFrame(() => {
    if (!env.sky) return;
    const { stars, exposure } = env.sky;
    for (const m of [starMat.current, linkMat.current]) {
      if (!m) continue;
      m.uniforms.uFade.value = stars;
      m.uniforms.uExposure.value = exposure;
    }
    if (starMat.current) starMat.current.uniforms.uTime.value = env.time;

    /* The same axis and the same angle as the sky shader â€” but NOT the same
     * sign, and that is deliberate rather than an oversight. The shader rotates
     * the direction it looks in, which runs backwards; here the geometry itself
     * turns, so the angle is used as it comes. The minus lives in SKY_FRAG next
     * to an explanation. Rotating the group rather than rebuilding the buffer
     * keeps this at one quaternion per frame regardless of star count. */
    if (grp.current) grp.current.quaternion.setFromAxisAngle(SKY_POLE, env.skyRot);
  });

  useEffect(() => () => {
    starGeo.dispose();
    linkGeo.dispose();
  }, [starGeo, linkGeo]);

  return (
    <group ref={grp}>
      <lineSegments geometry={linkGeo} frustumCulled={false}>
        <shaderMaterial
          ref={linkMat}
          vertexShader={CLINK_VERT}
          fragmentShader={CLINK_FRAG}
          uniforms={linkUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points geometry={starGeo} frustumCulled={false}>
        <shaderMaterial
          ref={starMat}
          vertexShader={CSTAR_VERT}
          fragmentShader={CSTAR_FRAG}
          uniforms={starUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* METEORS â€” the third layer of sky motion, and the only one that is an event
 * rather than a continuous drift.
 *
 * Sparse by construction. Three in the pool, each waiting 18 to 36 seconds
 * between flights, which comes to roughly one crossing every nine seconds. A
 * shower would be easier to build and would wreck the thing the rest of this
 * scene rests on â€” the point is that the sky is alive, not that it is busy. The
 * long waits are also what makes catching one feel like luck rather than like a
 * scheduled event, which is most of the value.
 *
 * Each flight is an arc of a great circle: pick a start direction, pick a
 * tangent to leave along, and the path is that start point rotated about
 * cross(start, tangent). Same Rodrigues identity the sidereal drift uses, and
 * the reason the trail bends with the sphere rather than cutting a straight
 * chord through it. The tangent is reflected into the lower half of the tangent
 * plane so meteors always fall â€” the geometry is perfectly symmetric, but one
 * that climbs reads as a bug.
 *
 * The trail is a real path rather than a stretched sprite: each of the nine
 * segments is where the head actually was a moment earlier, so the streak
 * curves exactly as the flight does. Sitting on the same 0.94 shell as the
 * constellations means the dunes occlude a meteor that drops below the skyline,
 * which is free and is the detail that sells the depth. */
const METEOR_COUNT = 5;
const METEOR_SEGS = 9;
const METEOR_VERTS = METEOR_COUNT * METEOR_SEGS * 2;
const METEOR_RADIUS = SKY_RADIUS * 0.94;

/* Cubic-ish falloff down the trail. Steeper than linear so the brightness
 * collapses just behind the head instead of leaving an evenly lit worm. */
const meteorTaper = (j) => Math.pow(1 - j / METEOR_SEGS, 1.6);

function spawnMeteor(t0, fit = 1) {
  /* Spawn azimuth goes through the same fit as every other body in this sky.
   * Without it a portrait phone throws roughly three quarters of its meteors
   * outside the frame, and since one arrives only every several seconds, that
   * reads as the feature being broken rather than as it being rare. */
  const az = azFit(Math.random() * 92 - 46, fit) * D2R;
  const el = (9 + Math.random() * 21) * D2R;
  const p0 = new THREE.Vector3(
    Math.sin(az) * Math.cos(el),
    Math.sin(el),
    -Math.cos(az) * Math.cos(el),
  );
  /* Orthonormal tangent basis at p0: e1 runs horizontally, e2 points up the
   * sky. Because both are unit and perpendicular, cos/sin components need no
   * renormalising â€” and negating the e2 term is the whole of "make it fall". */
  const e1 = new THREE.Vector3().crossVectors(p0, new THREE.Vector3(0, 1, 0)).normalize();
  const e2 = new THREE.Vector3().crossVectors(e1, p0).normalize();
  const th = Math.random() * Math.PI * 2;
  const tan = e1
    .clone()
    .multiplyScalar(Math.cos(th))
    .addScaledVector(e2, -Math.abs(Math.sin(th)));
  return {
    p0,
    axis: new THREE.Vector3().crossVectors(p0, tan).normalize(),
    arc: (12 + Math.random() * 14) * D2R,
    tail: (3.5 + Math.random() * 3.5) * D2R,
    /* Deliberately slow. The original 0.55-1.1s flight read as a blink â€” the
     * client asked for shooters that hang in the sky, so a crossing now takes
     * about two to three seconds and the long arc reads as travel rather
     * than as a flicker. */
    dur: 1.9 + Math.random() * 1.3,
    t0,
  };
}

function Meteors({ env }) {
  const matRef = useRef();
  /* Held in a ref rather than read straight out of the selector, because
   * respawns happen inside useFrame and a render-time value would be stale
   * there. Seeded on the first render so the initial pool is already fitted,
   * then kept current by the effect for anything that respawns after a
   * rotation. The three meteors in flight at that moment keep their old
   * azimuths, which is correct â€” they are already moving. */
  const aspect = useThree((s) => s.size.width / s.size.height);
  const fit = useRef(frameFit(aspect));
  useEffect(() => {
    fit.current = frameFit(aspect);
  }, [aspect]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position',
      new THREE.Float32BufferAttribute(new Float32Array(METEOR_VERTS * 3), 3));
    g.setAttribute('aMag',
      new THREE.Float32BufferAttribute(new Float32Array(METEOR_VERTS), 1));
    return g;
  }, []);

  const uniforms = useMemo(() => ({
    uStarCol: { value: PALETTE.star },
    uExposure: { value: 1.0 },
    uFade: { value: 0.0 },
  }), []);

  /* Staggered starts, so several shooters are already mid-flight or arriving
   * within the first few seconds of the night sky instead of queueing behind
   * one full wait. */
  const pool = useMemo(
    () => Array.from({ length: METEOR_COUNT }, () => spawnMeteor(Math.random() * 20, fit.current)),
    [],
  );
  const pts = useMemo(
    () => Array.from({ length: METEOR_SEGS + 1 }, () => new THREE.Vector3()),
    [],
  );

  useFrame(() => {
    if (!env.sky) return;
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uFade.value = env.sky.stars;
    m.uniforms.uExposure.value = env.sky.exposure;

    /* Nothing to draw once the sun is up, and the early return does more than
     * save the arithmetic: it freezes the waits. Without it, a visitor who
     * scrolls back up into the night would walk into a burst of meteors that
     * had queued up behind a daylit sky. */
    if (env.sky.stars < 0.004) return;

    const t = env.time;
    const pos = geo.attributes.position.array;
    const mags = geo.attributes.aMag.array;
    let k = 0;
    const put = (v, w) => {
      pos[k * 3] = v.x;
      pos[k * 3 + 1] = v.y;
      pos[k * 3 + 2] = v.z;
      mags[k] = w;
      k += 1;
    };

    for (const me of pool) {
      let u = (t - me.t0) / me.dur;
      if (u > 1) {
        Object.assign(me, spawnMeteor(t + 6 + Math.random() * 8, fit.current));
        u = (t - me.t0) / me.dur;
      }
      /* sin rises and falls with no discontinuity at either end; the 0.7 power
       * flattens its top so the streak holds brightness across the middle of
       * the flight rather than peaking for a single frame. Outside [0,1] the
       * meteor is waiting, and zero weight makes it invisible under additive
       * blending without needing to collapse the geometry. */
      const life = u >= 0 && u <= 1 ? Math.pow(Math.sin(Math.PI * u), 0.7) : 0;
      const head = Math.max(u, 0) * me.arc;

      for (let j = 0; j <= METEOR_SEGS; j++) {
        pts[j]
          .copy(me.p0)
          .applyAxisAngle(me.axis, Math.max(head - (j / METEOR_SEGS) * me.tail, 0))
          .multiplyScalar(METEOR_RADIUS);
      }
      for (let j = 0; j < METEOR_SEGS; j++) {
        put(pts[j], life * meteorTaper(j));
        put(pts[j + 1], life * meteorTaper(j + 1));
      }
    }

    geo.attributes.position.needsUpdate = true;
    geo.attributes.aMag.needsUpdate = true;
  });

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <lineSegments geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={METEOR_VERT}
        fragmentShader={METEOR_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* Idle drift plus a scroll dolly. Dune's sandwalk is deliberately
 * arrhythmic, so the drift runs two detuned periods rather than one clean
 * oscillation. */
function CameraRig({ env, reducedMotion }) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return undefined;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = env.scroll;

    const driftX = reducedMotion ? 0 : Math.sin(t * 0.06) * 2.6 + Math.sin(t * 0.023) * 1.4;
    const driftY = reducedMotion ? 0 : Math.sin(t * 0.041) * 0.5;

    const targetX = driftX + pointer.current.x * 2.4;
    const targetY = CAM_Y + driftY + pointer.current.y * 0.8 + s * 6.0;
    const targetZ = 34 - s * 46;

    // Frame-rate independent smoothing.
    const k = 1 - Math.pow(0.0016, Math.min(delta, 0.1));
    state.camera.position.x += (targetX - state.camera.position.x) * k;
    state.camera.position.y += (targetY - state.camera.position.y) * k;
    state.camera.position.z += (targetZ - state.camera.position.z) * k;

    /* Aim at x = 0 so the sun stays centred behind the wordmark whatever the
     * drift is doing. Unchanged from the previous pass on purpose â€” the look
     * target and camera height together hold the pitch at about -3.8 degrees
     * and the horizon at roughly 43% down the frame, which is the framing
     * the centred lockup was composed against. */
    state.camera.lookAt(0, 5.0 + s * 3.0, -300);
  });

  return null;
}

/* Threshold stays at 1.0 and the shading is tuned around it: the sand is
 * measured to peak near 0.55, so the only things that bloom are the sun, the
 * hot embers and the scatter of back-lit crest rims at dawn. That is the
 * difference between bloom reading as light and bloom reading as blur. */
function Effects({ lowPower }) {
  if (lowPower) {
    return (
      <EffectComposer disableNormalPass frameBufferType={THREE.HalfFloatType}>
        <Bloom intensity={0.95} luminanceThreshold={1.0} luminanceSmoothing={0.28} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <SMAA />
        <Vignette eskil={false} offset={0.34} darkness={0.55} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer disableNormalPass frameBufferType={THREE.HalfFloatType}>
      <Bloom intensity={1.05} luminanceThreshold={1.0} luminanceSmoothing={0.3} mipmapBlur />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      {/* EffectComposer owns the framebuffer, so the canvas antialias flag is
          inert â€” this pass is the only AA in the pipeline. */}
      <SMAA />
      {/* Load-bearing at this level: the night sky is one enormous smooth
          gradient and 8-bit output bands it visibly without a dither. */}
      <Noise opacity={0.016} premultiply blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.36} darkness={0.58} />
    </EffectComposer>
  );
}

/* PaintProbe â€” reports that the world is genuinely on screen.
 *
 * Not a timer and not a mount effect, because both of those lie: the mount
 * fires before the WebGL context exists, and a timer has no idea how long
 * three will take to compile eight materials plus the composer's passes on
 * this particular GPU. The reveal in HomePage hangs off this callback, so it
 * has to mean "there are pixels", and the only honest signal for that is
 * having been through the render loop.
 *
 * Frame 3 rather than frame 1. A useFrame subscriber runs BEFORE that frame is
 * drawn, so reporting on the first tick would reveal an empty canvas; the
 * first tick is also the expensive one, since three compiles lazily on first
 * use. Waiting two further ticks costs ~32ms and clears both the compile and
 * any ordering difference between this subscriber and the EffectComposer's. */
function PaintProbe({ onPainted }) {
  const seen = useRef(0);
  useFrame(() => {
    if (seen.current > 3) return;
    seen.current += 1;
    if (seen.current === 3 && onPainted) onPainted();
  });
  return null;
}

export default function DuneSea({ active = true, onPainted, scrollY }) {
  const [caps, setCaps] = useState(null);

  /* Created before the capability gate so the hook order never changes
   * between the fallback and the real render. */
  const env = useRef({
    scroll: 0,
    targetScroll: 0,
    intro: 0,
    time: 0,
    skyRot: 0,
    sky: null,
    sunDir: new THREE.Vector3(0, 0.02, -1),
    sunCol: new THREE.Color(),
    ambCol: new THREE.Color(),
    hazeCol: new THREE.Color(),
  }).current;

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.innerWidth < 768;
    const cores = navigator.hardwareConcurrency || 4;

    /* WebGL2 specifically. The ripple fade and every screen-space size in the
     * sky depend on fwidth, and three 0.185 is WebGL2-only regardless, so
     * fall back rather than render this wrong. */
    let webgl2 = false;
    try {
      webgl2 = !!document.createElement('canvas').getContext('webgl2');
    } catch {
      webgl2 = false;
    }

    /* Width is a QUALITY signal here and never a capability one. It used to be
     * both â€” `useFallback: !webgl2 || narrow` â€” which is why a phone only ever
     * saw the flat gradient. The thing actually broken below 768px was the
     * framing, since every azimuth in this file was solved against a landscape
     * frame; frameFit handles that now, so all a narrow window still needs is a
     * cheaper pipeline. */
    setCaps({
      reducedMotion,
      useFallback: !webgl2,
      lowPower: coarse || cores <= 4 || narrow,
      /* A handset is not just a slow laptop. It has a device pixel ratio around
       * 3 and no active cooling, so a pipeline that holds 60fps on weak
       * integrated graphics will thermally throttle on a phone inside a minute.
       * This tier only changes how many pixels get shaded, which is the one
       * lever that scales with both at once. */
      handheld: coarse && narrow,
    });
  }, []);

  /* The fallback path renders no frames at all, so PaintProbe can never fire
   * there. Report immediately instead: the reveal then cross-fades one copy of
   * the gradient onto an identical one, which is invisible, and HomePage is not
   * left holding a hand-off that will never arrive. */
  useEffect(() => {
    if (caps && caps.useFallback && onPainted) onPainted();
  }, [caps, onPainted]);

  if (!caps || caps.useFallback) return <DuneSeaFallback />;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, CAM_Y, 34], fov: 52, near: 0.5, far: 3000 }}
        dpr={[1, caps.handheld ? 1.25 : caps.lowPower ? 1.5 : 2]}
        gl={{
          // Inert while EffectComposer owns the framebuffer; SMAA does the
          // work. Left explicit so it isn't mistaken for an oversight.
          antialias: false,
          powerPreference: 'high-performance',
          // Off by design: ACES is applied in the composer, so nothing gets
          // tone mapped twice.
          toneMapping: THREE.NoToneMapping,
        }}
        style={{ display: 'block' }}
      >
        <EnvDriver env={env} reducedMotion={caps.reducedMotion} active={active} scrollY={scrollY} />
        <PaintProbe onPainted={onPainted} />
        <Sky env={env} />
        {/* After Sky, before Terrain: the sky writes no depth so it cannot
            occlude these, and Terrain does, so it can. Order here is only for
            reading â€” the depth buffer does the actual work. */}
        <Constellations env={env} />
        {/* Gated at the mount rather than disabled from inside. A fast streak
            arriving without warning is precisely the motion that
            prefers-reduced-motion exists to suppress, and not mounting it
            costs nothing â€” the drift and the twinkle are already pinned. */}
        {!caps.reducedMotion && <Meteors env={env} />}
        <Terrain
          env={env}
          segW={caps.lowPower ? 180 : 360}
          segD={caps.lowPower ? 200 : 400}
          /* Fewer, longer steps on weak hardware. Measured reach is 92.6
           * units at 10 x 1.8 and 44.8 at 6 x 3.2, so the cheap tier still
           * casts every shadow above about 10 degrees of sun â€” it loses
           * softness and the longest dawn shadows, not the composition. */
          shadowSteps={caps.lowPower ? 6 : 10}
          shadowBase={caps.lowPower ? 3.2 : 1.8}
        />
        <DustField env={env} count={caps.lowPower ? 260 : 700} />
        <CameraRig env={env} reducedMotion={caps.reducedMotion} />
        <Effects lowPower={caps.lowPower} />
      </Canvas>
    </div>
  );
}
