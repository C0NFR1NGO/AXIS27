import{a as e}from"./rolldown-runtime-CNC7AqOf.js";import{o as t,s as n}from"./framer-DZVMnmUz.js";import{E as r,S as i,a,b as o,c as s,d as c,f as l,h as u,i as d,l as f,n as p,o as m,p as h,r as g,s as ee,t as _,u as v,w as y,y as b}from"./three-BBwbbjtD.js";import{t as x}from"./DuneSeaFallback-Bq5atd9T.js";var S=e(n(),1),C=t(),w=`
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
`,T=`
  uniform float uTime;
  uniform float uAmp;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec2 vPlane;
  varying float vHeight;

  ${w}

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
`,te=`
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

  ${w}

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
`,ne=`
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,re=`
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

  ${w}

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
`,ie=`
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
`,ae=`
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
`,oe=`
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
`,E=`
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
`,D=`
  attribute float aMag;
  varying float vMag;
  void main() {
    vMag = aMag;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,se=`
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
`,ce=`
  attribute float aMag;
  varying float vMag;
  void main() {
    vMag = aMag;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,O=`
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
`,k=e=>new u(e).convertSRGBToLinear(),A={albLo:k(`#7A5433`),albHi:k(`#D8B584`),sunLow:k(`#FF9A42`),sunHigh:k(`#FFF2DC`),ambNight:k(`#121A2E`),ambDay:k(`#9FB8CE`),nightZenith:k(`#04060F`),nightHorizon:k(`#0B0F1C`),dayZenith:k(`#7C8B95`),dayHorizon:k(`#E7C79C`),ember:k(`#FF9E00`),emberHot:k(`#FFCE8A`),star:k(`#FFF6EC`),galaxy:k(`#2A3450`),moon:k(`#9FB0D8`),dust:k(`#D8C3A2`)},j=new r(-.4657,.2871,-.8371).normalize(),M=new r(.4812,.1219,-.8681).normalize(),N=[{name:`Orion`,place:{az:-17,elev:14.5,roll:-8,scale:.58},portrait:{az:-4,elev:15,roll:-8,scale:.46},stars:[[-4.5,7,.95],[4,8.5,.7],[-1.8,0,.7],[0,.6,.75],[2,1.2,.65],[-4.2,-7.5,.68],[5,-6.5,1]],links:[[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]]},{name:`Cassiopeia`,place:{az:24,elev:14.5,roll:-10,scale:.7},stars:[[-6,.5,.72],[-3,-.8,.85],[0,.6,.7],[3,-.6,.72],[6,1.2,.62]],links:[[0,1],[1,2],[2,3],[3,4]]},{name:`Big Dipper`,place:{az:2,elev:18.5,roll:8,scale:.8},stars:[[-6.5,1.6,.85],[-5.6,-.8,.8],[-3,-1.6,.78],[-1.6,-.4,.6],[.6,-.2,.88],[3.2,.4,.74],[6,-.6,.86]],links:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]]}],P=Math.PI/180;function le(e,t,n,i){let a=e.az*P,o=e.elev*P,s=new r(Math.sin(a)*Math.cos(o),Math.sin(o),-Math.cos(a)*Math.cos(o)),c=new r().crossVectors(s,new r(0,1,0)).normalize(),l=new r().crossVectors(c,s).normalize(),u=(e.roll||0)*P,d=(e.scale??1)*P,f=(t*Math.cos(u)-n*Math.sin(u))*d,p=(t*Math.sin(u)+n*Math.cos(u))*d;return s.clone().addScaledVector(c,Math.tan(f)).addScaledVector(l,Math.tan(p)).normalize().multiplyScalar(i)}var F=4/3,I=.78,L=390/844;function R(e){return Math.min(1,Math.max(e,.2)/F)}function z(e,t){return Math.atan(Math.tan(e*P)*t)/P}function B(e,t){let n=Math.asin(i.clamp(e.y,-1,1)),a=Math.atan(Math.tan(Math.atan2(e.x,-e.z))*t);return new r(Math.sin(a)*Math.cos(n),Math.sin(n),-Math.cos(a)*Math.cos(n))}function V(e){if(e<I){let t=Math.min(1,e/L);return N.filter(e=>e.portrait).map(e=>({...e,place:{...e.portrait,az:z(e.portrait.az,t),scale:(e.portrait.scale??1)*t}}))}let t=R(e);return N.map(e=>({...e,place:{...e.place,az:z(e.place.az,t),scale:(e.place.scale??1)*t}}))}function H(e){let t=c(e=>e.size.width/e.size.height);(0,S.useEffect)(()=>{let n=R(t);e.uMoonDir&&e.uMoonDir.value.copy(B(j,n)),e.uMoonDirB&&e.uMoonDirB.value.copy(B(M,n)),e.uMoonScale&&(e.uMoonScale.value=n)},[t,e])}var U=new r(0,Math.sin(21.1255*P),Math.cos(21.1255*P)).normalize(),W=.1*P,G=1400,ue=900,K=900,de=-380,fe=1.9,pe=15,q=25,me=.26,he=3.6,ge=.9,J=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)};function _e(e){let t=Math.min(Math.max(e,-.45),1),n=t>=0?-1.5+34*t**1.25:-1.5-46*(-t)**1.3,r=J(-2,16,n);return{elevDeg:n,sunY:Math.sin(n*Math.PI/180),sunZ:-Math.cos(n*Math.PI/180),day:r,stars:1-J(0,11,n),twilight:Math.exp(-(((n-1)/9)**2)),sunStr:J(-2,11,n)*3.4,ambStr:.22+.72*r,exposure:1.7*(1-r)+.38*r,rimFade:Math.exp(-Math.max(n,0)/11)}}function ve({env:e,reducedMotion:t,active:n,scrollY:r}){return(0,S.useEffect)(()=>{if(r!=null){e.targetScroll=r,e.scroll=r;return}let t=()=>{let t=document.documentElement.scrollHeight-window.innerHeight;e.targetScroll=t>0?Math.min(window.scrollY/t,1):0};return t(),window.addEventListener(`scroll`,t,{passive:!0}),window.addEventListener(`resize`,t,{passive:!0}),()=>{window.removeEventListener(`scroll`,t),window.removeEventListener(`resize`,t)}},[e,r]),v((i,a)=>{let o=1-.02**Math.min(a,.1);if(e.scroll+=(e.targetScroll-e.scroll)*o,n){let t=e.targetScroll>.003?ge:he;e.intro=Math.min(e.intro+a/t,1)}let s=t||r!=null?0:me*(1-e.intro)**1.6,c=_e(Math.max(e.scroll,0)-s);e.sky=c,e.sunDir.set(0,c.sunY,c.sunZ),e.sunCol.copy(A.sunLow).lerp(A.sunHigh,c.day),e.ambCol.copy(A.ambNight).lerp(A.ambDay,c.day),e.hazeCol.copy(A.nightHorizon).lerp(A.dayHorizon,c.day),e.hazeCol.lerp(A.ember,c.twilight*.42),e.time=i.clock.elapsedTime,e.skyRot=t?0:e.time*W}),null}function ye({env:e,segW:t,segD:n,shadowSteps:i,shadowBase:a}){let o=(0,S.useRef)(),s=(0,S.useMemo)(()=>{let e=new y(ue,K,t,n),r=e.attributes.position,i=K/2;for(let e=0;e<r.count;e++){let t=(r.getY(e)+i)/K;r.setY(e,-450+K*t**+fe)}return r.needsUpdate=!0,e.computeBoundingSphere(),e},[t,n]);(0,S.useEffect)(()=>()=>s.dispose(),[s]);let c=(0,S.useMemo)(()=>({uTime:{value:0},uAmp:{value:pe},uSunDir:{value:new r(0,.02,-1)},uSunCol:{value:new u},uSkyCol:{value:new u},uMoonDir:{value:j.clone()},uMoonCol:{value:A.moon},uAlbLo:{value:A.albLo},uAlbHi:{value:A.albHi},uHazeCol:{value:new u},uSunStr:{value:0},uAmbStr:{value:.22},uExposure:{value:1.7},uRimFade:{value:1},uDay:{value:0},uRipple:{value:.09},uShadowSteps:{value:i},uShadowBase:{value:a}}),[i,a]);return H(c),v(()=>{let t=o.current;if(!t||!e.sky)return;let n=t.uniforms;n.uTime.value=e.time,n.uSunDir.value.copy(e.sunDir),n.uSunCol.value.copy(e.sunCol),n.uSkyCol.value.copy(e.ambCol),n.uHazeCol.value.copy(e.hazeCol),n.uSunStr.value=e.sky.sunStr,n.uAmbStr.value=e.sky.ambStr,n.uExposure.value=e.sky.exposure,n.uRimFade.value=e.sky.rimFade,n.uDay.value=e.sky.day}),(0,C.jsx)(`mesh`,{geometry:s,rotation:[-Math.PI/2,0,0],position:[0,0,de],frustumCulled:!1,children:(0,C.jsx)(`shaderMaterial`,{ref:o,vertexShader:T,fragmentShader:te,uniforms:c})})}function be({env:e}){let t=(0,S.useRef)(),n=(0,S.useMemo)(()=>({uTime:{value:0},uSunDir:{value:new r(0,.02,-1)},uSunCol:{value:new u},uMoonDir:{value:j.clone()},uMoonDirB:{value:M.clone()},uMoonScale:{value:1},uMoonCol:{value:A.moon},uNightZenith:{value:A.nightZenith},uNightHorizon:{value:A.nightHorizon},uDayZenith:{value:A.dayZenith},uDayHorizon:{value:A.dayHorizon},uEmber:{value:A.ember},uEmberHot:{value:A.emberHot},uStarCol:{value:A.star},uGalCol:{value:A.galaxy},uDay:{value:0},uStars:{value:1},uTwilight:{value:1},uExposure:{value:1.7},uSkyPole:{value:U},uSkyRot:{value:0}}),[]);return H(n),v(()=>{let n=t.current;if(!n||!e.sky)return;let r=n.uniforms;r.uTime.value=e.time,r.uSunDir.value.copy(e.sunDir),r.uSunCol.value.copy(e.sunCol),r.uDay.value=e.sky.day,r.uStars.value=e.sky.stars,r.uTwilight.value=e.sky.twilight,r.uExposure.value=e.sky.exposure,r.uSkyRot.value=e.skyRot}),(0,C.jsxs)(`mesh`,{frustumCulled:!1,children:[(0,C.jsx)(`sphereGeometry`,{args:[G,64,40]}),(0,C.jsx)(`shaderMaterial`,{ref:t,vertexShader:ne,fragmentShader:re,uniforms:n,side:1,depthWrite:!1})]})}function xe({env:e,count:t}){let n=(0,S.useRef)(),{gl:r}=c(),i=(0,S.useMemo)(()=>{let e=new h,n=new Float32Array(t*3),r=new Float32Array(t),i=new Float32Array(t),a=new Float32Array(t);for(let e=0;e<t;e++)n[e*3]=(Math.random()-.5)*520,n[e*3+1]=16+Math.random()*14,n[e*3+2]=40-Math.random()*460,r[e]=.5+Math.random()*1.4,i[e]=.7+Math.random()*1.9,a[e]=Math.random()*Math.PI*2;return e.setAttribute(`position`,new l(n,3)),e.setAttribute(`aSpeed`,new l(r,1)),e.setAttribute(`aSize`,new l(i,1)),e.setAttribute(`aPhase`,new l(a,1)),e},[t]),a=(0,S.useMemo)(()=>({uTime:{value:0},uRise:{value:5.2},uLife:{value:90},uPixelRatio:{value:Math.min(r.getPixelRatio(),2)},uDay:{value:0},uEmber:{value:A.ember},uEmberHot:{value:A.emberHot},uDustCol:{value:A.dust}}),[r]);return v(()=>{let t=n.current;!t||!e.sky||(t.uniforms.uTime.value=e.time,t.uniforms.uDay.value=e.sky.day)}),(0,S.useEffect)(()=>()=>i.dispose(),[i]),(0,C.jsx)(`points`,{geometry:i,frustumCulled:!1,children:(0,C.jsx)(`shaderMaterial`,{ref:n,vertexShader:ie,fragmentShader:ae,uniforms:a,transparent:!0,depthWrite:!1,blending:2})})}var Se=e=>{let t=Math.sin(e*12.9898+78.233)*43758.5453;return t-Math.floor(t)};function Ce({env:e}){let t=(0,S.useRef)(),n=(0,S.useRef)(),r=(0,S.useRef)(),{gl:i}=c(),a=c(e=>e.size.width/e.size.height),[o,s]=(0,S.useMemo)(()=>{let e=G*.94,t=[],n=[],r=[],i=[],o=[];for(let s of V(a)){let a=s.stars.map(([t,n])=>le(s.place,t,n,e));a.forEach((e,i)=>{t.push(e.x,e.y,e.z),n.push(s.stars[i][2]),r.push(Se(r.length))});for(let[e,t]of s.links){i.push(a[e].x,a[e].y,a[e].z,a[t].x,a[t].y,a[t].z);let n=.09+.07*Math.min(s.stars[e][2],s.stars[t][2]);o.push(n,n)}}let s=new h;s.setAttribute(`position`,new b(t,3)),s.setAttribute(`aMag`,new b(n,1)),s.setAttribute(`aTw`,new b(r,1));let c=new h;return c.setAttribute(`position`,new b(i,3)),c.setAttribute(`aMag`,new b(o,1)),[s,c]},[a]),l=(0,S.useMemo)(()=>({uPixelRatio:{value:Math.min(i.getPixelRatio(),2)},uStarCol:{value:A.star},uExposure:{value:1},uFade:{value:1},uTime:{value:0}}),[i]),u=(0,S.useMemo)(()=>({uMoonCol:{value:A.moon},uExposure:{value:1},uFade:{value:1}}),[]);return v(()=>{if(!e.sky)return;let{stars:i,exposure:a}=e.sky;for(let e of[n.current,r.current])e&&(e.uniforms.uFade.value=i,e.uniforms.uExposure.value=a);n.current&&(n.current.uniforms.uTime.value=e.time),t.current&&t.current.quaternion.setFromAxisAngle(U,e.skyRot)}),(0,S.useEffect)(()=>()=>{o.dispose(),s.dispose()},[o,s]),(0,C.jsxs)(`group`,{ref:t,children:[(0,C.jsx)(`lineSegments`,{geometry:s,frustumCulled:!1,children:(0,C.jsx)(`shaderMaterial`,{ref:r,vertexShader:D,fragmentShader:se,uniforms:u,transparent:!0,depthWrite:!1,blending:2})}),(0,C.jsx)(`points`,{geometry:o,frustumCulled:!1,children:(0,C.jsx)(`shaderMaterial`,{ref:n,vertexShader:oe,fragmentShader:E,uniforms:l,transparent:!0,depthWrite:!1,blending:2})})]})}var Y=5,X=9,Z=Y*X*2,we=G*.94,Q=e=>(1-e/X)**1.6;function $(e,t=1){let n=z(Math.random()*92-46,t)*P,i=(9+Math.random()*21)*P,a=new r(Math.sin(n)*Math.cos(i),Math.sin(i),-Math.cos(n)*Math.cos(i)),o=new r().crossVectors(a,new r(0,1,0)).normalize(),s=new r().crossVectors(o,a).normalize(),c=Math.random()*Math.PI*2,l=o.clone().multiplyScalar(Math.cos(c)).addScaledVector(s,-Math.abs(Math.sin(c)));return{p0:a,axis:new r().crossVectors(a,l).normalize(),arc:(12+Math.random()*14)*P,tail:(3.5+Math.random()*3.5)*P,dur:1.9+Math.random()*1.3,t0:e}}function Te({env:e}){let t=(0,S.useRef)(),n=c(e=>e.size.width/e.size.height),i=(0,S.useRef)(R(n));(0,S.useEffect)(()=>{i.current=R(n)},[n]);let a=(0,S.useMemo)(()=>{let e=new h;return e.setAttribute(`position`,new b(new Float32Array(Z*3),3)),e.setAttribute(`aMag`,new b(new Float32Array(Z),1)),e},[]),o=(0,S.useMemo)(()=>({uStarCol:{value:A.star},uExposure:{value:1},uFade:{value:0}}),[]),s=(0,S.useMemo)(()=>Array.from({length:Y},()=>$(Math.random()*20,i.current)),[]),l=(0,S.useMemo)(()=>Array.from({length:10},()=>new r),[]);return v(()=>{if(!e.sky)return;let n=t.current;if(!n||(n.uniforms.uFade.value=e.sky.stars,n.uniforms.uExposure.value=e.sky.exposure,e.sky.stars<.004))return;let r=e.time,o=a.attributes.position.array,c=a.attributes.aMag.array,u=0,d=(e,t)=>{o[u*3]=e.x,o[u*3+1]=e.y,o[u*3+2]=e.z,c[u]=t,u+=1};for(let e of s){let t=(r-e.t0)/e.dur;t>1&&(Object.assign(e,$(r+6+Math.random()*8,i.current)),t=(r-e.t0)/e.dur);let n=t>=0&&t<=1?Math.sin(Math.PI*t)**.7:0,a=Math.max(t,0)*e.arc;for(let t=0;t<=X;t++)l[t].copy(e.p0).applyAxisAngle(e.axis,Math.max(a-t/X*e.tail,0)).multiplyScalar(we);for(let e=0;e<X;e++)d(l[e],n*Q(e)),d(l[e+1],n*Q(e+1))}a.attributes.position.needsUpdate=!0,a.attributes.aMag.needsUpdate=!0}),(0,S.useEffect)(()=>()=>a.dispose(),[a]),(0,C.jsx)(`lineSegments`,{geometry:a,frustumCulled:!1,children:(0,C.jsx)(`shaderMaterial`,{ref:t,vertexShader:ce,fragmentShader:O,uniforms:o,transparent:!0,depthWrite:!1,blending:2})})}function Ee({env:e,reducedMotion:t}){let n=(0,S.useRef)({x:0,y:0});return(0,S.useEffect)(()=>{if(t)return;let e=e=>{n.current.x=e.clientX/window.innerWidth*2-1,n.current.y=-(e.clientY/window.innerHeight)*2+1};return window.addEventListener(`pointermove`,e,{passive:!0}),()=>window.removeEventListener(`pointermove`,e)},[t]),v((r,i)=>{let a=r.clock.elapsedTime,o=e.scroll,s=t?0:Math.sin(a*.06)*2.6+Math.sin(a*.023)*1.4,c=t?0:Math.sin(a*.041)*.5,l=s+n.current.x*2.4,u=q+c+n.current.y*.8+o*6,d=34-o*46,f=1-.0016**Math.min(i,.1);r.camera.position.x+=(l-r.camera.position.x)*f,r.camera.position.y+=(u-r.camera.position.y)*f,r.camera.position.z+=(d-r.camera.position.z)*f,r.camera.lookAt(0,5+o*3,-300)}),null}function De({lowPower:e}){return e?(0,C.jsxs)(p,{disableNormalPass:!0,frameBufferType:o,children:[(0,C.jsx)(a,{intensity:.95,luminanceThreshold:1,luminanceSmoothing:.28,mipmapBlur:!0}),(0,C.jsx)(_,{mode:s.ACES_FILMIC}),(0,C.jsx)(d,{}),(0,C.jsx)(g,{eskil:!1,offset:.34,darkness:.55})]}):(0,C.jsxs)(p,{disableNormalPass:!0,frameBufferType:o,children:[(0,C.jsx)(a,{intensity:1.05,luminanceThreshold:1,luminanceSmoothing:.3,mipmapBlur:!0}),(0,C.jsx)(_,{mode:s.ACES_FILMIC}),(0,C.jsx)(d,{}),(0,C.jsx)(m,{opacity:.016,premultiply:!0,blendFunction:ee.OVERLAY}),(0,C.jsx)(g,{eskil:!1,offset:.36,darkness:.58})]})}function Oe({onPainted:e}){let t=(0,S.useRef)(0);return v(()=>{t.current>3||(t.current+=1,t.current===3&&e&&e())}),null}function ke({active:e=!0,onPainted:t,scrollY:n}){let[i,a]=(0,S.useState)(null),o=(0,S.useRef)({scroll:0,targetScroll:0,intro:0,time:0,skyRot:0,sky:null,sunDir:new r(0,.02,-1),sunCol:new u,ambCol:new u,hazeCol:new u}).current;return(0,S.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,t=window.matchMedia(`(pointer: coarse)`).matches,n=window.innerWidth<768,r=navigator.hardwareConcurrency||4,i=!1;try{i=!!document.createElement(`canvas`).getContext(`webgl2`)}catch{i=!1}a({reducedMotion:e,useFallback:!i,lowPower:t||r<=4||n,handheld:t&&n})},[]),(0,S.useEffect)(()=>{i&&i.useFallback&&t&&t()},[i,t]),!i||i.useFallback?(0,C.jsx)(x,{}):(0,C.jsx)(`div`,{style:{position:`absolute`,inset:0},children:(0,C.jsxs)(f,{camera:{position:[0,q,34],fov:52,near:.5,far:3e3},dpr:[1,i.handheld?1.25:i.lowPower?1.5:2],gl:{antialias:!1,powerPreference:`high-performance`,toneMapping:0},style:{display:`block`},children:[(0,C.jsx)(ve,{env:o,reducedMotion:i.reducedMotion,active:e,scrollY:n}),(0,C.jsx)(Oe,{onPainted:t}),(0,C.jsx)(be,{env:o}),(0,C.jsx)(Ce,{env:o}),!i.reducedMotion&&(0,C.jsx)(Te,{env:o}),(0,C.jsx)(ye,{env:o,segW:i.lowPower?180:360,segD:i.lowPower?200:400,shadowSteps:i.lowPower?6:10,shadowBase:i.lowPower?3.2:1.8}),(0,C.jsx)(xe,{env:o,count:i.lowPower?260:700}),(0,C.jsx)(Ee,{env:o,reducedMotion:i.reducedMotion}),(0,C.jsx)(De,{lowPower:i.lowPower})]})})}export{x as DuneSeaFallback,ke as default};