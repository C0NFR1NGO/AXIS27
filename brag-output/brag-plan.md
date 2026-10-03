# Brag Plan: AXIS'27

## What is this app?
AXIS'27 — **Ignis Aeternum** — the site for VNIT Nagpur's annual technical festival: a React 19 SPA whose living WebGL dune sea rises behind 37 events, with a governing design law: *the world burns warm, the interface stays cold.*

## The angle
Treat the festival as a **desert sunrise** — a trailer for an eternal flame. The site itself is a natural event (dune sea, two moons, constellations, a sunrise that runs the length of the page), so the video plays it that way: night, then the flame, then the town waking up (stats, events), then the light breaking the horizon. Its own theme line ("The world burns warm, the interface stays cold") is used verbatim as the coat of arms — ember for the world, blue for anything a person operates.

## Hook (first 2-3 seconds)
A near-black dune field with two moons and a bare star field, the ember seam glinting at the 57% horizon line.
Text, one line at a time, slow and held:
> **"Every edition leaves ash."**  →  **"This one is the flame."**

No product, no logo. A sentence that only makes sense once you know the festival is called Ignis Aeternum.

## Key moments (the middle)

- **AXIS'27 wordmark rises** in Ethnocentric over the dunes with a low bell, then the subtitle in the site's own voice: `IGNIS AETERNUM` — and the claim, verbatim: "Central India's largest technical fest."

- **The counters reel up** like the site's own slot-dial StatsBar: `35+ EVENTS`, `200+ COLLEGES`, `35,000+ FOOTFALL` — each number arriving one after another on a cold panel as the world glows warm behind it. Real numbers from `content.js`.

- **Event cards slide in one by one** — Robowars, Insomnia, Mechatryst — each with a real tagline from the catalogue:
  - `ROBOWARS · BUILD. FIGHT. SURVIVE.`
  - `INSOMNIA · CODE. THINK. SURVIVE.`
  - `MECHATRYST · ROAR. RACE. WIN.`

## Outro / punchline
The thesis, one clause at a time:
> **The world burns warm.** *(ember)*
> **The interface stays cold.** *(blue)*

Then AXIS'27 + `IGNIS AETERNUM` + `axis27alt.vercel.app`. The whole video has been a proof of that one sentence.

## User flow worth showing
none — landing-page only. The site is a festival backdrop, not an app with a mode of use; the strongest video material is its own world (the dune sea), its real counters, and its real event catalogue. So the centerpiece recreates the *living world*, not a workflow.

## Tone
- Preset: **cinematic**
- Creative direction: *a desert sunrise for an eternal flame — the festival as a natural event, told at trailer scale*
- Interpretation: few scenes, long holds, big type, dramatic reveals. Lines land one at a time and are left up. Restraint is the confidence move: no flash, no whooshing text — the ember seam and the bell carry the drama.

## Format: landscape — 1920x1080
## Duration: 22s

## Visual identity (from the project)
- Background: `#070503` (--ground) — near-black warm brown, not blue-black
- Text (world): `#f2e4cc` (--bone) · `#ded2bd` (--text-2)
- Accent world: `#ff7a1a` (--ember) · `#e8c89a` (--sand)
- Accent interface: `#00a8e8` (--blue) · `#f2f7fa` (--white)
- Surface: `#12100c` (--panel) · hairline `rgba(242,228,204,0.1)`
- Display font: **Ethnocentric** (AXIS'27 wordmark, bundled local woff2)
- Heading font: **Audiowide** (site's section-heading face)
- Body font: **Inter Tight**
- Mono (labels/readouts): **Martian Mono**
- Strongest visual element: the dune sea horizon at 57vh with the ember seam — I will draw a CSS/SVG dune sea (near-black base, two warm horizon glows, distant dune crest at ~57%, a star field) as the composition's persistent backdrop, matching the site's first frame.

## Share copy (draft)
```
Every edition leaves ash. AXIS'27 — Ignis Aeternum.
37 events, 200+ colleges, 35,000+ people. Central India's largest technical fest.
The world burns warm; the interface stays cold. 🔥
```

## Audio direction
- Role: **cinematic support** — low bed that swells, restrained accents, no wall-to-wall excitement
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (vol-12: "steady and clean" — the cinematic/polished pick per audio.md)
- Music treatment: start at 0.28 volume, no fade-in (the scene opens on the hook), dip nothing before the bell at the wordmark, allow a subtle swell into the outro wordmark, fade out by 21.8s. Beat-sync two/three strong moments; let the rest ride naturally.
- Music cue guidance: bundled preset for vol-12 (110 BPM). Strong-cue locks: **8.74s** (stats panel in — cut lands on the strongest beat), **17.47s** (outro begins), **19.66s** (final wordmark slam). Scene cuts at 4.4s and 13.1s ride plain beats (4.39, 13.11) for a cleaner cadence. Sequential events snap to beats: stats at ~9.4/10.6/11.8, event cards at ~13.7/14.9/16.1.
- Audio-reactive treatment: subtle; dune glow + seam brightness breathe with RMS; the bedroom of the world, not a music visualizer. No waveforms/equalizers/strobes.
- SFX posture: **sparse and cinematic** — one deep bell on the wordmark (impactBell), soft thuds on the three stats, a quiet card-place per event, a final heavier bell on the wordmark slam. Everything else silence.
- Audio-coupled moments: stat counter ticks per reel-up stop; card slide sounds per event row; the two bell hits; nothing else.
- Restraint rule: no more than one accent per reveal, no alarm/glitch/error sounds, no typed-computer chatter — this festival is warm, not broken.

## Storyboard

### Scene 1 — "The eternal flame" (hook) — 4.4s
Full-bleed night dune sea: near-black warm ground, bone-pale stars, two moons, ember seam glinting across the horizon at 57%. No chrome. Text holds center-low, one sentence at a time.
- 0.4s: `Every edition leaves ash.` (bone, Archivo body, then holds)
- 2.5s: `This one is the flame.` (bone, holds to scene end)
Sequential/interaction: yes — two hook lines enter one after the other, each left settled a full ~2s.
Audio intent: music bed enters low at 0; nothing announces. The two lines land in silence.
Audio-coupled idea: none (silence is the point).
Music: subtle low bed, steady.
Transition mood: hard cut on beat 4.39 → Scene 2

### Scene 2 — "The wordmark rises" (reveal) — 4.5s
Same world, slightly brighter. Seam glows hotter. Center composition.
- 4.8s: **AXIS'27** slams in (Ethnocentric, bone-white, very large) — bell.
- 6.4s: `IGNIS AETERNUM` (Audiowide, ember) slides up under it.
- 7.4s: `Central India's largest technical fest. VNIT Nagpur.` (Inter Tight, text-2) — small, held.
Sequential/interaction: yes — wordmark, then theme, then claim, left settled.
Audio intent: the one bell carries the scene; brief swell then settle.
Audio-coupled idea: wordmark slam → single deep bell (impactBell_heavy_000).
Music: bed swells with the slam, settles.
Transition mood: cut on strong cue 8.74 → Scene 3

### Scene 3 — "The counters" (proof) — 4.4s
Cold panel slides over the sand (the site's own instrument-deck concept), three readouts arrive one after another on blue hairlines.
- 8.74s: panel in (cut on the strong cue).
- 9.4s: `35+ EVENTS`  →  10.6s: `200+ COLLEGES`  →  11.8s: `35,000+ FOOTFALL`
Each: big Audiowide number in blue, mono label underneath. The dune world still glows behind the panel's translucent scrim (site uses 0.80 — the sky stays visibly alive).
Sequential/interaction: yes — exactly the site's slot-dial rhythm: one number, settle, next.
Audio intent: quiet certainty; soft thuds, no fanfare.
Audio-coupled idea: one soft impact per counter stop.
Music: mid bed, steady.
Transition mood: cut on strong cue 13.11 → Scene 4

### Scene 4 — "The town" (events) — 4.4s
Three catalogue cards slide in one by one, each: ember emblem mark → featured event name + real tagline.
- 13.7s: `ROBOWARS — BUILD. FIGHT. SURVIVE.`
- 14.9s: `INSOMNIA — CODE. THINK. SURVIVE.`
- 16.1s: `MECHATRYST — ROAR. RACE. WIN.`
Cards are the site's panel look: surface `#12100c`, hairline border, ember rule along the bottom edge only, cold blue index number.
Sequential/interaction: yes — three cards arrive one by one, each held.
Audio intent: building warmth; card sounds.
Audio-coupled idea: one card-place sound per card arrival.
Music: bed swells toward the outro.
Transition mood: cut on strong cue 17.47 → Scene 5

### Scene 5 — "The thesis" (outro) — 4.5s
Wide dune field, seam glowing like a horizon. Two lines land center, one word-emphasis each.
- 17.6s: `The world burns warm.` (the word "burns" stepped in ember)
- 18.6s: `The interface stays cold.` ("cold" in blue)
- 19.66s: **AXIS'27** slams full-width (Ethnocentric) — heavier bell.
- 20.8s: `IGNIS AETERNUM · axis27alt.vercel.app` (mono, small) fades under, holds to black at 22.0s.
Sequential/interaction: yes — thesis, then wordmark, then address.
Audio intent: rise, resolve, fade.
Audio-coupled idea: final bell on the wordmark slam (beat-locked 19.66).
Music: swell into the wordmark, clean fade to black.
Transition mood: fade to black → end.

**Music mood for this video:** cinematic, restrained, rising into the outro.
**Audio summary:** a low steady bed carries the whole piece; two bells and four soft accents do all the punctuation; silence does the rest.