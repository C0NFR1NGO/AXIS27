# AXIS'27 — Design Direction

**Brief:** Full UI/visual overhaul of the AXIS'27 techfest site (VNIT Nagpur). Theme constant: Dune × Detroit: Become Human. Goal: read as deliberately designed, lean harder into 3D, and give the hero a background worth staying on.

---

## 0. On techfest.org

I could not load techfest.org — the sandbox blocks all outbound hosts except one, so I have no first-hand view of it. From search-indexed fragments I can say only this much: it runs a **yearly narrative theme** as its organising idea ("An Aetherial Renaissance" on the homepage, "The Simulated Paradigm" on the gallery), it's animation-heavy enough that crawlers see almost no text, and its IA splits into competitions / exhibitions / lectures / workshops plus named flagship segments (Technoholix, Ozone).

The one transferable lesson is the first: **the theme is the product, not a skin.** Techfest names its year, then commits — the theme reaches the gallery page and the section banners, not just the hero. AXIS'27 currently has a theme in its CSS variables but not in its structure. Everything below is downstream of fixing that.

Do not treat the rest of this as "what techfest.org does." Get me a screen recording or add `techfest.org` to the egress allowlist if you want an actual comparative teardown.

---

## 1. What's actually holding the current design back

Not effort — there's a lot of craft in here already. Five specific things:

**The two themes are blended instead of opposed.** Gold and cyan appear together, at equal weight, in the same elements — the `h1` alone runs a five-stop gradient through gold → gold-light → spice-blue → cyber-blue → gold. When both identities occupy every element, neither reads. Dune and Detroit are aesthetically *opposite*, and that's the asset.

**The typeface stack is the tell.** Audiowide, Orbitron, Rajdhani, Share Tech Mono, Ethnocentric. Orbitron + Rajdhani is the single most-used pairing in Indian college fest sites, and it resembles neither source. Villeneuve's Dune is wide, monumental, near-ornamentless, tracked-out thin caps. Detroit's UI is a sterile geometric grotesque — closer to DIN and Eurostile. Neither is a "space font."

**Gradient text with stacked glows is the template answer.** 11 components use `WebkitTextFillColor: transparent`. The hero `h1` carries a gradient *and* four text-shadows *and* a shimmer animation. Confidence reads as restraint; this reads as hedging.

**Everything is centred.** 24 `textAlign: 'center'` declarations across components and pages. Dune's language is asymmetric monumentality with brutal negative space; Detroit's is strict left-aligned data panels on a grid. A centred stack is neither.

**Pure black kills the Dune half.** `--bg-deep: #050302`. Arrakis darkness is *warm* — dust-scattered, never neutral. And `body::after` lays scanlines + vignette over the entire document at `z-index: 9999`, muting every considered colour underneath it.

**One concrete opportunity:** `@react-three/postprocessing@3` is in your dependencies and **imported nowhere.** Bloom, DOF, grain, and vignette are already paid for and unused.

---

## 2. The organising idea

> **An android's interface, overlaid on Arrakis.**

Stop mixing. Assign each source to a layer:

| | **Dune** owns | **Detroit** owns |
|---|---|---|
| Layer | The *world* — 3D, background, horizon, atmosphere | The *interface* — panels, type, readouts, transitions |
| Temperature | Warm: bone, sand, rust, spice | Cold: CyberLife blue, near-white |
| Scale | Enormous, slow, geological | Precise, small, immediate |
| Motion | Drift, haze, wind | Snap, scan, state-change |

Warm monumental world; cold precise instrument on top of it. Every colour decision now has an answer: *is this world, or is this interface?* Cyan never touches sand again. Gold never appears in a UI chrome element again.

This is also faithful. Detroit's actual UI is bright, clean, and sits *over* the scene as an overlay — you already discovered this instinct with the corner HUD panels, which are the most on-theme thing on the page. They just need to become structure rather than garnish.

---

## 3. Tokens

### Colour

World (Dune) — warm, desaturated, never pure black:
```
--sand-bone     #E8DCC8   /* highest-value sand, headline on dark */
--sand-mid      #C2A878   /* mid dune */
--spice-rust    #9C5A2E   /* spice, oxidised — replaces #c9911a */
--dust-shadow   #1A1410   /* warm shadow */
--bg-deep       #0F0B08   /* warm near-black, NOT #050302 */
```

Interface (Detroit) — used only in chrome, sparingly:
```
--cyber-blue    #00A8E8   /* CyberLife; UI only */
--android-white #F2F7FA   /* readouts, labels */
--instability   #FF3355   /* RESERVED: errors + deadlines only, never decorative */
```

The discipline that makes this work: **spice-rust is the only accent in content; cyber-blue is the only accent in chrome.** Instability red appears at most once per screen and always means something is wrong or expiring.

Drop the legacy aliases (`--violet`, `--cyan`, `--blue`) once migrated — they're mapping old names onto new intent and will cause drift.

### Type

Replace the whole stack. Every one of these is OFL/free:

- **Display — `Archivo Expanded`** (variable, has a real width axis). Set at 300–400 weight, uppercase, tracking `-0.02em`, sizes above 6rem. Wide and monumental is the Dune move; thin-and-huge is what Orbitron can never do.
- **Interface/data — `Martian Mono`.** Wide mono, distinctly synthetic, far more characterful than Share Tech Mono. This carries every HUD readout, label, timestamp, and coordinate.
- **Body — `Inter Tight`.** Neutral, sterile, gets out of the way. Detroit's body copy has no personality by design.
- **Keep `Ethnocentric` for the AXIS'27 wordmark lockup only** — never for headings. As a logotype it's fine; as a heading face it's the fest-site default.

Type scale, tight and few: `0.75 / 0.875 / 1 / 1.5 / 2.5 / 4 / 7rem`. Two weights per family, maximum.

---

## 4. The hero background — the real upgrade

### Why the current one plateaus

`CosmicBackground.jsx` is a particle constellation: 5000 dust + 300 spice + 250 nodes + up to 800 connection lines, all integrated **on the CPU in JavaScript every frame**, with an O(n²) neighbour search — 250² ≈ 31k distance checks per frame, plus four buffer re-uploads. That's why it can't get richer without dropping frames. It's also the most common WebGL background on the internet; connection-line constellations read as "template 3D" regardless of execution quality.

### Replace it with a sand sea

A single fullscreen raymarched dune field. Counter-intuitively this is **cheaper** than 5000 CPU particles — the work moves to the GPU, where it belongs, and the CPU does nothing per frame but advance a uniform.

- FBM-noise dune ridges receding to a horizon, sun sitting *low and enormous*
- Wind-blown sand streaming off the ridge crests (a second, thin shader layer — not particles)
- Heat shimmer as a UV distortion near the horizon
- **Scale is the emotion.** Every Dune frame is a tiny figure against something vast. Put the horizon low, let the sky take 60% of the frame, and set the AXIS'27 lockup small against it. This is the opposite of the current 9.375rem gradient headline filling the screen, and it will look ten times more expensive.

Then use the postprocessing you already have:

- **Bloom** — low threshold, tight radius, on the sun only
- **DepthOfField** — near dunes soft, horizon sharp; instantly reads as photographed rather than rendered
- **Noise/grain** — at ~0.04, *in the shader pass*, replacing the `body::after` overlay so grain sits on the world and not on your UI
- **Vignette** — same move, replaces the CSS radial gradient
- **ChromaticAberration** — edges only, very low; this is the Detroit optical signature

Delete the `body::after` scanline-over-everything and the `body::before` frame's decorative half. Keep the corner brackets, but promote them: make them structural, and let them react to route changes.

### Scroll

Dolly the camera *over* the dunes as the page scrolls — the sand sea passes beneath the interface. Dune's sandwalk is deliberately arrhythmic, so vary the easing rather than a linear scroll-tie. Sections then feel like locations crossed, not divs stacked.

---

## 5. Structure

Move to a strict 12-column grid, content left-aligned, with large asymmetric voids. Pin the Detroit HUD elements to grid edges — you're already doing this at `left: 3rem / bottom: 5rem`, so formalise it.

Give the HUD panels a real job. Right now `SOFTWARE INSTABILITY [▲94%]` is set dressing. Bind it to something true: registrations filled, days until close, seats left in a workshop. A readout that reports live state is thematic *and* useful; a fake one is a costume. `STATUS: COMPATIBLE` could reflect whether the visitor is signed in.

Float the Detroit panels at different Z depths with genuine perspective and parallax rather than as flat divs — that's where "more 3D" pays off in the *interface*, not just the background.

---

## 6. Signature

One memorable thing, everything else quiet. Pick **one**:

**A. The horizon hero.** Vast low sun, sand sea, tiny lockup. Restraint as the statement. Lowest risk, highest polish ceiling.

**B. The spice-scan route transition.** Navigation triggers a horizontal scan line — Detroit's UI wipe — that dissolves the page into drifting sand and reassembles it on the next route. Ties both halves into a single gesture and would be the thing people remember. This is the risk worth taking.

Do not do both. B needs A to be calm to land.

---

## 7. Sequence

1. Tokens: colour + type swap, kill the legacy aliases and the full-page scanline overlay
2. Hero: replace `CosmicBackground` with the dune shader + postprocessing chain
3. De-centre: grid pass across sections, strip the 11 gradient-text instances down to the wordmark alone
4. HUD: bind readouts to real data, add Z-depth parallax
5. Signature: horizon restraint, or the spice-scan transition
6. Quality floor: mobile shader fallback (static gradient + grain under ~768px), `prefers-reduced-motion` honoured on the camera dolly and scan transition — currently only three narrow rules exist, visible keyboard focus throughout

---

## Quality floor, non-negotiable

Responsive to mobile with a cheap shader fallback. Reduced-motion respected on every camera and scan animation. Visible keyboard focus. Contrast checked — `--text-muted: #a8a098` on `#0F0B08` is fine, but sand-on-sand combinations will need verifying.
