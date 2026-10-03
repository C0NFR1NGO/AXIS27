# Hyperframes Composition Brief: AXIS'27

## Objective
Create a short launch-style brag video for AXIS'27 — the website for VNIT Nagpur's annual technical festival (theme: **Ignis Aeternum**, the eternal flame).

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 22.0 seconds

## Source Material
- Project root: `C:\Users\Shreyas\Desktop\AXIS27 Draft 1` (the live site)
- Primary files read: `index.html`, `src/styles/global.css` (palette tokens), `src/data/content.js` (real events, taglines, stats), `src/pages/HomePage.jsx`, `src/components/StatsBar.jsx`, `src/components/ScrambleTitle.jsx`
- Product name: **AXIS'27**
- Tagline / strongest claim: **"Central India's largest technical fest"** (from index.html title/description); theme **Ignis Aeternum**
- Key UI or visual moment to recreate: the **dune sea** — near-black warm ground `#070503`, bone star field, two moons, and the ember seam along the horizon at 57%; the cold StatsBar ("instrument deck") over the warm world; the site's panel event cards with an ember bottom rule
- Copy that must appear verbatim (real site copy):
  - `Every edition leaves ash.` / `This one is the flame.` (brag hook built from the theme)
  - `AXIS'27`
  - `IGNIS AETERNUM`
  - `Central India's largest technical fest. VNIT Nagpur.`
  - `35+ EVENTS` / `200+ COLLEGES` / `35,000+ FOOTFALL` (the site's real stats from `content.js`)
  - `ROBOWARS — BUILD. FIGHT. SURVIVE.` (real tagline)
  - `INSOMNIA — CODE. THINK. SURVIVE.` (real tagline)
  - `MECHATRYST — ROAR. RACE. WIN.` (real tagline)
  - `The world burns warm.` / `The interface stays cold.` (the site's governing rule, verbatim)
  - `axis27alt.vercel.app`

## Creative Direction
- Tone preset: **cinematic**
- Creative direction: *a desert sunrise for an eternal flame — the festival as a natural event, told at trailer scale*
- Interpretation: few scenes (5), long holds, big type, dramatic reveals; lines land one at a time and are left settled. Restraint is the confidence move — the ember seam and two bells carry the drama; no flash, no whoosh, no typing theatrics.
- Angle: the whole video is a proof of the site's one sentence — *the world burns warm, the interface stays cold*: ember for the world, blue for anything a person operates; numbers are counters on a cold panel over a warm living world.
- Hook (0-4.4s): two sentence-lines over the night dune sea — "Every edition leaves ash." → "This one is the flame."
- Outro / punchline (17.5-22s): "The world burns warm." / "The interface stays cold." → AXIS'27 → address, fade to black.
- Avoid:
  - Generic SaaS language, "streamline", "unlock", "elevate"
  - Abstract filler / gradient washes / floating shapes that belong to any video
  - Blue on sand, ember on a control (the site's own rule — respect it)
  - Full-screen linear gradients (banding); use radial glows / solid fills
  - Alarm/glitch/error sounds, typed-computer chatter

## Visual Identity
- Background: `#070503`
- Text/world (bone): `#f2e4cc`; secondary `#ded2bd`; dim `#9c9081`
- World accent (ember): `#ff7a1a`; (sand): `#e8c89a`
- Interface accent (blue): `#00a8e8`; white `#f2f7fa`
- Panel surface: `#12100c`; hairline `rgba(242,228,204,0.1)`; blue line `rgba(0,168,232,0.22)`
- Display font: **Ethnocentric** (AXIS'27 wordmark — bundled local `assets/fonts/Ethnocentric.woff2`)
- Heading font: **Audiowide** (site section headings — bundled)
- Body font: **Inter Tight** (bundled)
- Mono/readouts: **Martian Mono** (bundled)
- Visual references from the project: night dune sea (two moons + star field + ember seam at 57% height), cold instrument-deck panel over the warm world, event cards with ember bottom-rule only.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract. Timings are beat-locked to the music preset (strong-cue locks in bold):

1. **The eternal flame** — 0.00-4.40s (hook) — night dune sea; two sentence lines enter and hold
2. **The wordmark rises** — 4.40-8.74s — AXIS'27 slams (bell); IGNIS AETERNUM; claim line
3. **The counters** — 8.74-13.11s — **lock 8.74s**: cold panel slides in over the warm world; three readouts reel up one by one (35+/200+/35,000+)
4. **The town** — 13.11-17.47s — three event cards arrive one by one (Robowars / Insomnia / Mechatryst)
5. **The thesis** — 17.47-22.00s — **lock 17.47s**: warm/cold lines; **lock 19.66s**: AXIS'27 full-width slam (heavier bell); address; fade to black

## Audio
- Audio role: cinematic support — low steady bed, sparse professional accents
- Audio arc: quiet open → one bell at wordmark → steady middle → swell into outro → clean fade
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (vol-12 — the cinematic/polished track)
- Music treatment: volume 0.28, start at 0, beat-locked transitions at 8.74/13.11/17.47, final lock 19.66, fade out completed by ~21.8s
- Music cue guidance: bundled preset `assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` (110 BPM; beat grid + strongCues). Locks: 8.74s (panel-in cut), 17.47s (outro), 19.66s (wordmark). Sequential snaps: stats ~9.4/10.6/11.8, cards ~13.7/14.9/16.1.
- Audio-reactive treatment: subtle — the dune-sea seam glow and panel edge hairline breathe with RMS; no waveforms/equalizers/strobes
- Audio-coupled moments:
  - Scene 2 wordmark slam — deep single bell (impactBell/impactSoft family)
  - Stats reel-up — soft impact per counter stop
  - Event cards — quiet card-place per arrival
  - Final wordmark (19.66s) — heavier bell, beat-locked
- SFX selection guidance: sparse + cinematic; prefer `impactSoft_medium_*` / `impactBell_heavy_*` / `interface/drop_*` families; never more than one accent per reveal
- SFX analysis guidance: `C:\Users\Shreyas\.config\opencode\skills\brag\assets\sfx\sfx-analysis.md`
- Exact SFX choice: Hyperframes to choose filenames/timestamps/volume against the implemented animation
- Audio files: copy chosen music + SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. /brag is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo / launch-video workflow. Prefer native Hyperframes conventions.

Requirements:
- The persistent world layer (dune sea) is a fixed full-bleed child of the root (position:absolute; inset:0) that stays for the whole 22s, with the ember seam at ~57% height and two moons + star field; scenes change by animated foreground text/panels/cards, not by background swaps
- All copy legible at 1920x1080; headlans 96-140px, body 40-56px, labels 28px, absolutely no body under 24px
- Ember only on world/content markings; blue only on interface elements (counters, index numbers, hairlines, the "cold" emphasis)
- Keep within 22.0s exactly (root data-duration="22")
- Music + beat-locks + audio-reactive subtle seam glow per above
- Run `hyperframes check` before render — brag's single gate