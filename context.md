# AXIS'27 — Handoff Context

Written 2026-08-25 for an agent picking up this work cold. Everything below is
current as of the last edit; where something is a plan rather than a fact it says
so.

---

## 1. What this project is

`AXIS'27` is the site for VNIT Nagpur's annual technical festival. It is a
React 19 + Vite 8 SPA deployed on Vercel at `axis27alt.vercel.app`, with Supabase
behind an admin area.

The stack, exactly:

| Thing | Version / note |
|---|---|
| React | 19 |
| Vite | 8 (rolldown / oxc — **not** esbuild+rollup) |
| Router | react-router-dom 7 |
| 3D | three 0.185.1, @react-three/fiber 9.7.0, @react-three/postprocessing 3.0.5, postprocessing 6.39.4 |
| Motion | framer-motion ^12.42.2 (exports `useReducedMotion`) |
| Lint | **oxlint**, not ESLint |
| Backend | Supabase (admin only) |

Windows host. Workspace folder is `C:\Users\Shreyas\Desktop\AXIS27 Draft 1`,
which maps to `/sessions/<id>/mnt/AXIS27 Draft 1/` inside the Linux sandbox.

---

## 2. The design brief, in the client's words

The theme is **Dune × Detroit: Become Human**, and the festival's own theme is
**Ignis Aeternum** — eternal flame.

The governing rule, which every colour decision on the site answers to:

> **The world burns warm, the interface stays cold.**

Concretely: bone / sand / ember belong to the world (the hero render, the horizon
seam, a timeline node marking the current edition). Blue / white belong to
anything a person operates — buttons, links, focus rings, labels, borders. Ember
never lands on a control. Blue never lands on sand.

The one deliberate exception now on the site is `AboutPage`'s timeline, where the
newest milestone is ember and every earlier one is blue: the present edition is
the one that is burning. That is content marking, not a control, and it is
commented in place.

---

## 3. Scope decisions the user has already made

These came through multiple-choice prompts earlier and should not be re-litigated.

**Admin area — "Leave admin alone for now."** The public site gets the retheme;
`src/admin/*` and `src/pages/AdminLoginPage.jsx` do not. Crash-class bugs in
admin are still in scope, styling is not. This is why `--gold`, `--gold-light`,
`--gold-glow`, `--spice-blue` and `--spice-blue-glow` are *still defined* in
`:root` at their legacy values — admin consumes them and they must keep resolving.
Do not delete them. There is a comment block at `global.css:127` saying exactly
this.

Note the accepted trade recorded there: admin also consumes `--font-mono`,
`--font-heading`, `--text-muted` and `--text-secondary`, which *have* been
repointed. So admin will shift with the site. "Leave admin alone" was agreed to
mean "do not hand-edit it," not "it will not move."

**Telemetry — "Keep a few, cut the rest."** The old site was covered in fake
machine chatter: `// SECTION_02 //`, `SOFTWARE INSTABILITY: ▲ 94%`,
`// WORKSHOP_DOMAINS_LOCKED //`, invented processor readouts. Keep it only where
it is high-atmosphere (the splash). Cut it from nav, footer, and section bodies.
Where the string carried real information, keep the information and drop the
costume.

**Build verification — off the agent's plate.** The user said: *"as for trying to
build the website in sandbox, dont worry about it i will go through all the
changes manually."* Do not spend turns fighting the toolchain (see §9).

---

## 4. Design process rules in force

These come from the `anthropic-skills:frontend-design` skill, already invoked
earlier in this work. **Do not re-invoke it**; just keep applying it.

Work in two passes. First brainstorm a compact token system — colour as 4–6 named
hex values, type for two or more roles, a layout concept in one-sentence prose
plus ASCII wireframes, and one signature element. Then critique that plan against
the brief *before* building, and say what changed and why.

Avoid the three AI-default looks: warm cream `#F4F1EA` + high-contrast serif +
terracotta near `#D97757`; near-black + one acid-green or vermilion accent; and
the broadsheet layout with hairline rules, zero border-radius and dense newspaper
columns.

Spend boldness in one place — the Chanel rule, remove one accessory before you
leave. Structural devices must encode something true: `01 / 02 / 03` only if the
content genuinely is a sequence. There is deliberately no such numbering anywhere
in `global.css`, and a comment says why.

Quality floor without announcing it: responsive, visible keyboard focus, reduced
motion respected.

Copy is design material. Active voice, sentence case, an action keeps its name
through the whole flow, errors never apologise and are never vague, empty states
are invitations to act.

Do most of the planning in thinking; only surface high-confidence ideas.

**And the rule that overrides all of the above: the brief's own words always win.**
This mattered concretely — see §5.

---

## 5. Feedback history that changes what you should do

The user has corrected direction twice in ways that are easy to accidentally undo.

**The heading gradient.** The agent designed and shipped a bone→sand→ember 180°
gradient on `.section-title`, with a long CSS comment arguing why the site's
original gold→cyan shimmer had to go. The user rejected it:

> *"the gradient on the text does not look good, also the font on the headers
> looks very basic and bad. for the headers, revert back to the previous font and
> gradient. just change the yellow in that prior gradient to match current
> colours more. Also center align all the elements as well, not just the headers"*

This has been done (§6). If you find yourself reasoning your way back toward the
180° ramp, or toward Archivo on headings — stop. The user looked at both and
chose the original.

**Centring.** An earlier pass left-aligned the frame. The user reverted it, then
reverted it again more forcefully: `text-align: center` alone was not enough,
because several components hand their own children an explicit width
(`width: 100%; max-width: 1100px`) and a block with a max-width and no auto
margin sits against its container's left edge regardless of `text-align`. The
flex centring is what actually moves the boxes.

---

## 6. What has been built (current state of the code)

### 6.1 The hero and the world

`src/components/DuneSea.jsx` renders a WebGL dune sea: starfield with sidereal
drift and occasional meteors, three named constellations (Orion, Cassiopeia, Big
Dipper), two shaded moons, and a scroll-driven sunrise that runs across the whole
home page rather than just the hero section.

`--seam-y: 57vh` is a **shared anchor**, and this is the single most important
number in the codebase. The hero's horizon, the site-wide ember seam, the splash's
ember line, and `DuneSeaFallback`'s dune crest (SVG y ≈ 565–579 of 1000) all sit
at exactly this height, so nothing moves at any hand-off. Do not change one
without the others.

`src/components/DuneSeaFallback.jsx` is a 233-line, **import-free** module that
renders a camera-accurate CSS/SVG still of the world's first frame: a three-stop
base gradient with two warm horizon glows, 78 field stars, 21 constellation stars,
two radial-gradient moons, and two dune paths. Its header says "EVERY NUMBER IN
THIS FILE IS COMPUTED, NOT CHOSEN." Nothing in it animates, so there is no
reduced-motion case. A verification check (`DuneSeaFallback imports nothing`)
guards its import-freeness — that is what lets `App.jsx` import it statically.

Its "plate" trick is worth knowing: CSS cannot compute an aspect ratio, but
wrapping the sky bodies in a plate that is exactly 4:3 above the reference aspect
and exactly the viewport below it reproduces both the clamped and fitted camera
regimes from one set of percentages, and the two agree at 4:3 so there is no seam.

### 6.2 The load-in contract (do not break this)

`App.jsx`'s `SplashScreen` has a verified hand-off contract. **71 static checks
and 34 mutants assert it.** The invariants:

- `SPLASH_FLOOR_MS = 1700`, `SPLASH_HOLD_CAP_MS = 1800`, `SPLASH_HANDOFF_MS = 600`
- `worldReady` is read through `worldReadyRef`, never as an effect dependency —
  the intro effect is one-shot and keyed only on `onComplete`
- `handOff()` is the **only** place `setSealed(true)` is called
- cleanup clears `scriptTimer`, `holdPoll` and `holdCap`
- the exit is `exit={{ opacity: 0 }}` — **no `scale`, no `filter`**
- the ember line draws to `0.62` on the script and completes only on `sealed`
- no percentage, progress bar or invented number anywhere on the splash
- both `handleWorldReady` and `handleSplashComplete` are `useCallback`-stable

The ember seam in `AppContent` has its own invariants: it is a **sibling** of the
animated route wrapper (never a child), never keyed, `aria-hidden`, `position:
fixed` at `top: var(--seam-y)`, hidden on `/`, its breathing animation behind
`prefers-reduced-motion: no-preference`, and `z-index` below `.route-shell`.

### 6.3 The token system — `src/styles/global.css`

```css
--ground: #070503;  --surface: #0c0906;  --panel: #12100c;

/* World light. Warm. Never on a control. */
--bone: #f2e4cc;  --sand: #e8c89a;  --ember: #ff7a1a;

/* Interface. Cold. Never on sand. */
--blue: #00a8e8;  --white: #f2f7fa;

/* Failure only. Not an accent. */
--alert: #ff3355;

--text: var(--bone);  --text-2: #ded2bd;  --text-dim: #9c9081;
--line: rgba(0,168,232,0.22);  --line-quiet: rgba(242,228,204,0.1);
--seam-y: 57vh;

--font-display: 'Archivo', system-ui, sans-serif;
--font-body:    'Inter Tight', system-ui, sans-serif;
--font-mono:    'Martian Mono', ui-monospace, monospace;
--font-accent:  'Ethnocentric', sans-serif;
--font-heading: 'Audiowide', var(--font-display);   /* headings only */

--t-h1: clamp(1.9rem,3.6vw,3rem);   --t-h2: clamp(1.35rem,2.2vw,1.85rem);
--t-h3: clamp(1.05rem,1.4vw,1.25rem); --t-body: clamp(0.95rem,1.05vw,1.0625rem);
--t-small: 0.8125rem;                --t-label: 0.6875rem;

--grid-max: 1240px;  --gutter: clamp(1.25rem,5vw,4rem);  --nav-height: 72px;
--ease-out: cubic-bezier(0.23,1,0.32,1);
```

There is also a **CARRIED NAMES** block (`--text-primary`, `--text-secondary`,
`--text-muted`, `--bg-deep`, `--cyber-red`, `--cyan`, `--violet`, `--border-gold`
and friends) repointed at the system above. Public files still reference these
and that is fine — they resolve correctly. They are not for new code.

Measured contrast against `--ground #070503`: bone 16.22:1, sand 12.75:1, ember
7.80:1, blue 7.53:1, white 18.86:1, `--text-2` 13.62:1, `--text-dim` 6.51:1. The
full sand→ember ramp never drops below 7.80:1.

Two contrast traps that were measured rather than guessed: bone over the
fallback's ember band (`rgba(255,206,138,0.50)` over `#17110E` ≈ `#8b704c`) is
only **3.70:1**, and rises to 12.50:1 behind a 0.72 dark scrim. Deep sky
`#080C18` gives bone 15.56:1, far dune `#1b130d` 14.62:1, near dune `#050403`
16.33:1.

### 6.4 Headings — reverted, as instructed

`.section-title` is now the site's original treatment with only the colour
changed. Audiowide via `--font-heading`, `clamp(1.8rem, 4.5vw, 3.2rem)`, weight
700, `0.16em` tracking, uppercase, a `135deg` gradient clipped to the text at
`background-size: 200% 200%`, the `shimmer 6s` loop **behind
`@media (prefers-reduced-motion: no-preference)`**, and the 120px × 2px `::after`
rule underneath.

The recolour map applied to the original gradient:

| Original | Now |
|---|---|
| `--gold #c9911a` | `--ember` |
| `--gold-light #dca22a` | `--sand` |
| `--spice-blue #00e5ff` | `--blue` |

That swap also fixed a contrast problem: the old ramp swung from 4.60:1 (gold) to
12.9:1 (spice-blue) inside a single word. The new ramp is 7.80 / 12.75 / 7.53.

Audiowide is a **single-weight static face (400 only)**, so `font-weight: 700`
produces synthetic bold. That is deliberate — it is what the site has always
looked like, and dropping to 400 would have quietly changed every heading while
claiming to be a revert. It is added to the single Google Fonts request in
`index.html` and scoped to `--font-heading` rather than `--font-display`, because
its wide geometry is wrong on a button or a 12px label.

The `::after` glow was dialled back from the original's `0 0 16px` + `0 0 32px`
double halo to a single `0 0 10px rgba(0,168,232,0.35)`. A 32px bloom under every
heading competed with the ember seam, which is meant to be the page's only light.

`ScrambleTitle.jsx` renders `<motion.h2 className="section-title">`, so every
section heading picks this up.

### 6.5 Centring — flex, not just `text-align`

`.section` and `.page` are both `display: flex; flex-direction: column;
align-items: center` with `text-align: center`.

**Deliberately omitted** from the restore: `min-height: 60vh` and
`justify-content: center`, which the original had. Those padded every section out
to fill a screen it had no content for — the cause of the large empty bands — and
the flex centring fought the sunrise's scroll pacing.

`align-items: center` shrink-wraps children, which is right for a heading and
wrong for a grid, so there are guards:

```css
.section > *, .page > * { max-width: 100%; }
.section > .grid-cards, .section > .panel, .section > .empty,
.page    > .grid-cards, .page    > .panel, .page    > .empty { width: 100%; }
```

`.page-head` carries `width: 100%` — without it the flex parent shrink-wraps it
to the title's width and the back link's `align-self: flex-start` lands under the
title's first letter instead of out at the page gutter.

`.field` keeps `text-align: left`, with a comment saying it is not a leftover:
a centred value in a text input jumps sideways as you type.

### 6.6 Shared primitives available in `global.css`

`.panel` (and `.glass-card`, the same rule under its old name because eight files
still say it) — `--panel` background, `--line-quiet` border, 2px radius, and a
`::before` ember hairline along the **bottom edge only**, because that is where
the light is. The `backdrop-filter` is deliberately gone: it cost a full-panel
blur on every card on every scroll frame.

`.btn-primary` is bone-on-ground with no hue at all. That is the choice worth
protecting: an ember button breaks the governing rule *and* makes every button
compete with the seam, so the primary action wins on value instead of colour.
`.btn-secondary` is a `--line` outline that goes blue on hover.

`.label` / `.label--blue` / `.readout` / `.eyebrow` are the mono primitives. All
of them set `font-stretch: 75%` — Martian Mono is ~30% wider than the Share Tech
Mono it replaced, and stretching rather than shrinking keeps labels legible while
stopping the 80-odd existing call sites from overflowing.

`.backlink` is the shared back-navigation control, with the arrow as a `::before`
and a reduced-motion branch. Nine hand-rolled versions still exist across the
pages; converting them is part of the remaining retheme.

`.grid-cards` is the generic responsive card grid,
`repeat(auto-fill, minmax(min(100%,280px), 1fr))`.

`.empty` is the empty-state box. Copy convention: name what will appear and what
to do meanwhile — never "no data" or a bare "coming soon".

`.domain-grid` / `.domain-card` are the Events domain cards (§6.7).

### 6.7 Events domain cards — done this session

The five event domains used to be flex items at `flex: 1 1 320px; max-width:
380px` inside a wrapping flex row, which produced three different card sizes on
one screen: `flex-grow` divided leftover space among however many cards landed on
each line, so a row of three and a row of two came out different widths, and
`align-items: flex-start` let each card stop at the height of its own paragraph —
and those paragraphs run from 32 to 138 characters.

Now `.domain-grid` is a centred-wrap flex row, and every `.domain-card` is
`flex: 0 1 clamp(300px, 31%, 350px)` — a hard **three per row** on the flagship
screen, decided by the user after seeing the two-wide grid. `grow: 0` means a
short final row never re-expands into the leftover space (that was the original
layout's flaw), and the basis is sized from the section's real content width
(~1112px): three 380px cards never fit, 31% tracks the shrinking container,
capped at 350px so three never overflow and floored at 300px so the cards stop
shrinking before they get cramped — below ~950px it drops to two per row. A full
comment block over `.domain-grid` records the two rejected attempts (the flex
`flex: 1 1 320px` row and the `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`
grid, which cannot centre a lone seventh card).

`.domain-card` is a centred flex column at `height: 100%`.
`.domain-card__desc` holds `min-height: 6.4em` — four lines at `1.6em`
line-height — so the toggle buttons line up across every card regardless of copy
length, expressed in the element's own `em` so it follows the fluid body size.
`.domain-card__toggle` sits at the bottom via `margin-top: auto`.

`EventCard.jsx` was rewritten. It is **no longer a clickable div**: that version
had an `onClick` toggle wrapping `<Link>`s, so a click on an event name fired
both the link and the toggle, and the control was unreachable by keyboard (a div
with `onClick` has no role, no tab stop, no Enter/Space). It is now a real
`<button>` with `aria-expanded` and `aria-controls`, labelled with the genuine
event count — `Show 8 events` / `Hide events`. Event rows hover on a background
tint instead of the old 5px x-slide, which read as a wobble once centred.

### 6.8 Team page name change — done

`src/components/TeamSection.jsx:11` now reads `'Harshal Ramteke'` in place of
`'Sarth Dharpure'`. The email is **derived, never stored** — `getEmail()` builds
`` `${first}.${last}@axisvnit.in` `` — so the address became
`harshal.ramteke@axisvnit.in` automatically. Zero remaining occurrences of
"Sarth" or "Dharpure" anywhere in the repo.

### 6.9 Cold-colour retheme pass — done

`outputs/retheme_cold.py` repointed **132 references across 10 public files**:
`var(--spice-blue)` → `var(--blue)`, `var(--spice-blue-glow)` →
`rgba(0,168,232,0.22)`, `#00e5ff` → `#00a8e8`, and
`rgba(0,229,255,a)` → `rgba(0,168,232,a)` with alpha preserved.

This was safe to do blind because spice-blue and blue play the *same role* — only
the value changed. That is **not** true of the gold family, whose replacement
depends on whether the thing it colours is world or interface, which is why gold
was left for a hand pass.

### 6.10 Event detail pages — the warm/cool theming system, built this session

Every event now has a *distinct* detail page rather than a shared template.
Three system pieces drive it:

**`src/lib/eventTheme.js`** exports `resolveEventTheme` / `themeVars` /
`categoryPalette`. Categories are split into a **cool** palette (`--blue`; the
default for software, robotics, igniting-minds, esports) and a **warm** palette
(`--ember`; management, construction, devise) — the same world/interface rule as
everything else, applied per category.

**`src/lib/motifs.jsx`** holds a 26-emblem SVG glyph library. `content.js` maps
all 37 catalogue events to a motif via `eventMotifs` (`name` → emblem, unmatched
falls back to `gear`) and seven events get `eventLayoutOverrides`
(Robowars, Mechatryst, Aquahunt, Insomnia, Aquaskylark, Toycathon → stage;
Space Innovation Challenge → blueprint). `EventMotif.jsx` renders the crest in
the hero.

**The living world, not a static composite.** The original event backdrops
(EventBackdrop's gradient sky + texture + motif stamp, driven by
`resolveEventBackdrop` in `eventBg.js`) were a static CSS composite. The user
rejected static backgrounds for the non-home pages ("i dont want all non home
page backgrounds to be static, i want them to be dynamic, even for event pages").
They are replaced by App.jsx's fixed per-route living world — the WebGL dune sea
for warm categories, the WebGL cosmic field for cool ones — and `eventBg.js` now
ships only `LAYOUT_DEFAULTS`. The per-event page keeps its theme accent vars,
its hero crest, and the `page-dimmer` scrim for legibility; the background is
App's, animated.

`EventDetailsPage.jsx` renders: hero with chip + crest +
tagline + watermark title + description, facts tiles, About/Rules/Materials
(construction only)/Schedule (stage only)/Prizes/Contacts sections, and a
disabled `Register — Coming soon` button feeding `NotifyMe`. No invented facts —
anything unfinalised says TBA.

`EventGridOverlay.jsx` is deleted (it was the old shared overlay background).
`@keyframes coming-soon-pulse` is deleted. Build-verified: `npm run build`
passes on this host (vite v8.1.3, ~546 modules) — see the corrected §9.

Files touched: `AboutSection`, `Footer`, `Navigation` (34), `NotifyMe`,
`RouteLoading`, `StatsBar`, `TeamSection` (20), `AboutPage` (24),
`ContactPage` (25), `EventDetailsPage` (12). Admin and `AdminLoginPage.jsx` are
excluded by the script. Public JSX now has **zero** references to the old cold
palette; the only remaining hits are the intentional legacy token definitions and
prose inside comments.

Three empty-state components (`AccommodationSection`, `SponsorsSection`,
`WorkshopsSection`) had their heading gold swapped to `--text` and their
`// SLASH_WRAPPED //` telemetry replaced with the plain sentence underneath it:
`// ARRANGEMENTS BEING FINALIZED — VNIT CAMPUS & SURROUNDINGS //` became
"Arrangements are being finalised across the VNIT campus and nearby," and so on.

`EventsPage.jsx`'s back link became `.backlink`. Its old version set `'Rajdhani'`
(a family the page no longer loads, so it rendered as system-ui), coloured its
hover with `--gold`, and did it through `onMouseEnter`/`onMouseLeave` handlers
writing to `e.target.style` — so the colour was lost on any re-render and never
fired at all for a keyboard user.

### 6.11 Page scenes — the living world, built this session

Every non-home page used to sit behind a fixed night DuneSea showing nothing but
`.page-dimmer`'s flat 4-stop grey scrim, and a short-lived experiment layered a
*static* CSS scene (gradient sky + seam glow + texture + motif watermark) over
it. The user rejected static outright:

> "dont want all non home page backgrounds to be static, i want them to be
> dynamic, even for event pages. for dune themed pages, use dune bg, and for the
> others use cosmicbg"

So the static scene system (`PageBackdrop.jsx`, `pageBg.js`, `EventBackdrop.jsx`,
`EventTexture.jsx`, and the `.page-backdrop*` / `.event-backdrop*` CSS) is
**deleted**. In its place, `App.jsx` mounts one **fixed living world** behind
every non-home route, chosen by `worldKind(pathname)`:

- **Dune pages** (about, events and its detail pages where the event's category
  burns warm — management, construction, devise — workshops, accommodation,
  dashboard, preview-hero) get `<LazyDuneSea active={false} scrollY={1} />` —
  the WebGL dune sea at full night: drifting field, meteors, two moons, the
  shared horizon at `--seam-y`.
- **Cosmic pages** (contact, team, sponsors, login, and any unmatched route =
  NotFound) get `<LazyCosmicBackground />` — the WebGL constellation field:
  cold nodes, warm spice dust, connection webs that part around your cursor.
- **Event detail pages** follow their event's category palette, so a single
  route switch in one file keeps the whole background system in step with the
  warm/cool rule — the site's own world/interface split applied to the backdrop
  itself: ember belongs to the dunes, cold routes float on the stars.

Both chunks start downloading at module scope (like DuneSea), so they overlap
navigation. Both respect the `route-shell` transform trap by living outside the
animated wrapper in the fixed layer at `z-index: 0`, with the `.ember-seam`
unmoved above them. Pages keep `.page-dimmer` (its 4-stop scrim is the legibility
layer over a moving world — its gradient now means the world shows through
progressively as you scroll) — **except event pages**: the blanket grey buried
the cosmic field on cool events, so `.event-page.page-dimmer` overrides it with
a lighter gradient (near-transparent through the hero, 0.22 @ 14vh → 0.48 @ 34vh
→ 0.62 @ 60vh, reaching the old 0.82 only in the dense content zone below). The
hero still holds text: the title glows, the chip has its own pill background.
`EventDetailsPage` keeps its theme accent vars + hero crest. `eventBg.js` is
trimmed to `LAYOUT_DEFAULTS` only; the motif library and `EventMotif.jsx`
remain.

Build-verified on this host (545 modules). Dashboard and AdminLogin are
untouched. The cosmic field still carries its original gold/cyan/magenta
particles — reuse it at the user's explicit request, but flag it if the retheme
ever wants the cosmic dust recoloured to the cold palette.

---

## 6.12 The cosmetic sweep — built 2026-09-17

Ten cosmetic changes, all shipped and build-verified:

1. **Cosmic field recoloured to the cold palette.** CosmicBackground's node,
   dust, spice and cursor-line colours moved from gold/cyan/magenta to
   blue/white/ice (nodes 0/0.66/0.91, 0.92/0.95/0.98, 0.5/0.78/1.0). Only the
   colour values changed — the `rand()` draw order is load-bearing, so the
   ratio keys were renamed (`primaryRatio`/`secondaryRatio`) but the values are
   untouched.
2. **OG share image.** `public/images/og-image.png` (1200×630, 49 KB), generated
   by `tools/gen_og.py` — it parses the star/moon/dune numbers straight out of
   `DuneSeaFallback.jsx` (so the two can never drift), converts Ethnocentric
   woff2→ttf via fontTools (brotli — installed on this host 2026-09-17), and
   renders the splash's world with a lighter smooth scrim (centre 0.32 → 0.59
   corners, no hard ellipse edge — the splash's own 0.72/0.88 scrim rendered as
   a hard dark oval when reproduced). Regenerate with `python tools/gen_og.py`.
   `og:image`/`twitter:image` now point at it.
3. **Scroll-reveal on event detail sections.** The `Reveal` wrapper
   (EventDetailsPage.jsx) gives About/Rules/Materials/Schedule/Prizes/Contacts
   `whileInView` fade-ups, once, behind `useReducedMotion`. The facts strip too.
4. **Prize rank markers.** Prizes are a genuine sequence, so `01/02/03`
   `.readout` ranks are the one numbering the site allows — same pattern as the
   schedule rounds.
5. **Register → NotifyMe crossfade.** NotifyMe's form/success swap now runs
   through `AnimatePresence mode="wait"` with exit fades, behind
   `useReducedMotion`. The event-page hint dropped its slash-wrap for the plain
   sentence.
6. **404 polish.** The error line shows the real attempted path
   (`useLocation().pathname`) in place of the invented `node-0x4`; the
   never-updating `x:0 y:0` scroll readout is cut. `GRID-27` stays.
7. **Domain crests.** Each of the event-domain cards carries its emblem above
   the subtitle (`DOMAIN_MOTIFS` in EventCard.jsx: management→trade,
   software→code, robotics→gear, construction→fabricate, devise→focus,
   igniting-minds→atom, esports→game), in `--text-dim` — content marking, not a
   control.
8. **Event row motifs.** Each event row in a domain card leads with a 13px
   motif crest (`.domain-event__motif`), tying the listing to the detail pages.
9. **Back-to-top.** `BackToTop.jsx`, mounted in App's fixed layer outside the
   route-shell (same transform trap as the seam), hidden on `/`, appearing past
   0.8 viewport heights, cold (`.back-to-top` in global.css: panel bg,
   `--line-quiet` border, `--blue` focus ring, reduced-motion drops the slide).
10. **Category breadcrumb.** The event-page nav is now
    `← Events / <Category title>` (`.event-page__crumbs` + `-sep` + `-here`);
    the category is plain text because it has no page of its own.

Also this session: the event-page scrim mid-band went lighter (0.48 → 0.35,
0.62 → 0.55) after the user found the cosmic field too dimmed on cool events.

---

## 7. What is left to do

> **STATUS (2026-09-16): §7.1–§7.8 below are all *done*. The detail sections are
> kept for the record — the plans describe what actually shipped, with two
> exceptions flagged where the build diverged from the plan. Since that sweep a
> page-scene system (§6.11) has also shipped — every non-home content and event
> page now stands in front of App's fixed living world (dune sea or cosmic
> field, per route), after the user rejected a static backdrop composite. The
> remaining work now is the thing this list never captured: user visual QA of
> the event detail pages and the page scenes, plus the two findings at the end
> of §7.6.**

### 7.1 Finish the gold hand-pass — **DONE**

The 52 referenced lines were worked through; no `var(--gold)`/`--gold-light`/
`--gold-glow`/`--spice-blue` reference remains in public JSX other than prose
comments (§7.7's checker asserts this). The Footer treatment shipped as planned:
`--line-quiet` borders and dividers, social buttons now cold (`.btn-secondary`-
style: `--line-quiet` border, `--text-dim`, hover to `--blue`/`--white` via a
CSS class — the `onMouseEnter`/`onMouseLeave` pattern is gone), and the status
bar cut to the single true line `DIRECTIVE: IGNIS AETERNUM`, un-animated. The
four hand-rolled page back-links became `.backlink`. The old detail:

| File | Lines |
|---|---|
| `components/Footer.jsx` | 16, 48, 61, 105, 107, 110, 113, 115, 118, 119, 120, 149 |
| `components/TeamSection.jsx` | 79, 224, 268, 312, 313, 321, 329, 367, 449, 460 |
| `components/Navigation.jsx` | 124, 125, 128, 189, 205, 344, 346, 376 |
| `pages/AboutPage.jsx` | 114, 159, 239, 272, 278 |
| `components/NotifyMe.jsx` | 125, 127, 130 |
| `pages/EventDetailsPage.jsx` | 68, 116, 120 |
| `pages/ContactPage.jsx` | 269, 634 |
| `components/RouteLoading.jsx` | 20, 21 |
| `components/StatsBar.jsx` | 69 |
| `components/AboutSection.jsx` | 70 |
| `pages/AccommodationPage.jsx`, `SponsorsPage.jsx`, `TeamPage.jsx`, `WorkshopsPage.jsx` | 36, 36, 35, 36 |

The four single-line page hits are all the same hand-rolled back link and should
become `.backlink`.

**Footer.jsx was open and mid-edit when this handoff was written — nothing in it
has been changed yet.** The planned treatment:

Its `borderTop: '1px solid rgba(229,169,60,0.12)'` should become
`var(--line-quiet)`. The two identical gradient dividers at lines 61 and 149,
`linear-gradient(90deg, transparent, var(--gold) 20%, var(--blue) 50%, var(--gold)
80%, transparent)`, are the footer's own competing light source and should reduce
to a flat `var(--line-quiet)` hairline — the ember seam is the only thing that
glows.

The social icon buttons (105–120) are the clearest governing-rule violation left
on the site: gold border, gold text, gold background wash, and a hover that fills
the whole circle with `var(--gold)`. They are controls, so they go cold —
`--line-quiet` border, `--text-dim` icon, transparent background, hover to
`--blue` border and `--white` icon. They should also lose the
`onMouseEnter`/`onMouseLeave` inline-style pattern in favour of a CSS class,
for the same keyboard reason as the `EventsPage` back link.

The status bar (36–53) is the footer's telemetry and falls under "cut the rest":
`CYBERLIFE: ACTIVE` is invented, `SOFTWARE INSTABILITY: ▲ 94%` is a hardcoded
number on an `Infinity`-repeat pulse, and `DIRECTIVE: IGNIS AETERNUM` is the only
line of the three carrying anything true. Cut the first two and keep the theme
line, un-animated.

### 7.2 Stale font families — 32 hardcoded strings

`'Rajdhani'`, `'Orbitron'` and `'Share Tech Mono'` are all still hardcoded in
public files and **none of them are loaded any more**, so every one renders as
system-ui:

`ContactPage.jsx` 18, `AboutPage.jsx` 6, `EventDetailsPage.jsx` 2, and one each
in `WorkshopsPage`, `TeamPage`, `SponsorsPage`, `EventsPage`,
`AccommodationPage`, `AboutSection`.

`'Audiowide'` is a special case — it **is** loaded again as of this session, so
hardcoded `'Audiowide'` strings now resolve correctly. They should still move to
`var(--font-heading)` for consistency, but they are not broken.

Map `'Rajdhani'` and `'Orbitron'` to `var(--font-display)` and
`'Share Tech Mono'` to `var(--font-mono)`, remembering that mono call sites need
`font-stretch: 75%`.

### 7.3 `.glass-card` → `.panel` — 7 files

`AboutSection` (2), `AccommodationSection` (1), `SponsorsSection` (1),
`TeamSection` (2), `WorkshopsSection` (1), `AboutPage` (3), `ContactPage` (3).
Both names resolve to the same rule today, so this is a rename with no visual
change. Repointing the name in `global.css` was chosen over a mass rename
precisely because a missed file would leave an unstyled box on a live page — so
if you do the rename, do it exhaustively or not at all.

### 7.4 Remaining telemetry theatre

Four sites: `Footer.jsx:36` and `:38` (covered above),
`Navigation.jsx:473`, and `WorkshopsSection.jsx:44`. Also
`Navigation.jsx:96` reportedly generates a **random** section readout — a
`.readout` is supposed to be a value the site actually knows, so this should
become the real section index or stop being dressed as a readout.
`TeamSection.jsx:443` emits `// SECTION_01 //`, which is numbering a set that is
not a sequence.

### 7.5 The splash rebuild — **DONE, superseded twice**

The user's verdict: *"i went through the splash page, it looks very basic."*
Direction selected: **"Make it the first frame of the world."** — shipped as
planned, exactly as below.

Render `<DuneSeaFallback />` as the splash background. It already *is* a still of
the world's first frame, it is three-free, and its horizon is at `--seam-y` — and
because `HomePage` paints the same module as its bridge image, the overlay fades
out onto an identical picture, so nothing pops at the hand-off.

Add a `radial-gradient(… rgba(4,3,2,0.72) …)` scrim, measured: bone over the
fallback's ember band is only 3.70:1, and 12.50:1 behind that scrim.

Raise the wordmark group off the ember band to
`bottom: calc(100% - var(--seam-y) + 3.5rem)`, clear of moon B at top 26.5–30.7%
/ left 93%. Keep the ember line at `--seam-y`. Move the hand-made bloom layer so
it appears **only** when `sealed` — that is the Chanel accessory being removed,
since `dsf-base` already carries two real horizon glows, and it turns the bloom
into the "world arrives" beat. Put the status line and skip button below the seam,
on the dunes.

**The entire hand-off contract in §6.2 must survive unchanged.** The checks and
mutants assert it — but they were rewritten for the current design (see below);
the count is now **80 checks / 46 mutants**.

**Superseded twice (2026-09-17).** The user rejected the ignition-over-the-
living-world splash and then a CSS "eclipse" screen (*"completely scrap the
current splash screen"*), and finally asked for **3D** retaining **only the
AXIS'27 text**.

**The current splash — shards converging on the core.** A dedicated WebGL scene,
`src/components/SplashScene.jsx`, loaded as a separate chunk via a module-scope
`import()` promise (`splashSceneChunk`, with `.catch(() => {})` so a failed
fetch never becomes an unhandled rejection):

- 340 instanced tetrahedra (`InstancedMesh`, deterministic `mulberry32(27)`
  seed) tumbling through a dark navy volume `#05070d` toward a warm faceted
  icosahedron core at z −7. Cold shards `#7fb4d8`/`#e8eef5` with ~22% warm
  `#ff9e00` ones — the site's world/interface rule in one image. Camera dollies
  forward the whole time; bloom + vignette via the postprocessing composer.
- On `sealed`: converging shards accelerate into the core, the core's
  `emissiveIntensity` flares (0.9 → 2.75), the camera pushes in.
- The scene reports ready on **frame 3** (`onPainted`) — the same
  useFrame-runs-before-draw discipline as the dune sea's PaintProbe. The DOM
  side mirrors `sealed` straight through; there is no separate `progress`
  prop any more.
- A `SceneBoundary` error class inside SplashScene.jsx returns `null` on a
  failed shader/context. **Do not move a class component into App.jsx** —
  `verify_direction.py`'s uninitialised-call parser does not model class
  methods and will report `constructor()/render()` as never declared.

The splash's DOM (`SplashScreen` in App.jsx) holds exactly three things: the
`intro-stage` fixed root, the AXIS'27 `<h1 class="intro-title">` (single plain
text — no per-character spans, no gradient, no sweep), and the `Enter site`
button (`intro-dismiss`, auto-focused once, Escape dismisses). The route shell
gets `inert={showSplash}` so nothing behind the overlay is tabbable. The old
`skipped → return null` path is gone: skip cancels all timers synchronously via
`cancelRef` and lets AnimatePresence run the opacity exit.

Hand-off invariants kept: `SPLASH_FLOOR_MS 1700` / `SPLASH_HOLD_CAP_MS 1800` /
`SPLASH_HANDOFF_MS 600`; `handOff()` is the only `setSealed(true)` site; the
hand-off requires **both** `worldReady` and the scene's paint timestamp being
at least the floor old (or the cap fires); every timer (`scriptTimer`,
`holdPoll`, `holdCap`, `handoffTimer`) is cleared in the returned `cancel`
closure; exit is `exit={{ opacity: 0 }}` only; no progress bar, no invented
numbers. There is deliberately **no ember line, no seam-y composition and no
DuneSeaFallback in the splash any more** — the checks assert their absence.
The session flag is `axis27-shard-intro-seen` (versioned from
`axis27-home-intro-seen`, storage access guarded).

The corresponding old-CSS block was fully removed and replaced by the
`intro-stage`/`intro-canvas`/`intro-title`/`intro-dismiss` rules in
global.css (navy fallback background; responsive + short-landscape +
focus-visible cases). The monoliths note below stands: do not rebuild them.

### 7.6 Remaining catalogued bugs

The blur-radius mismatches are all paired now — `Navigation.jsx:132/133`,
`Navigation.jsx:327/328` and `Footer.jsx:20/21` each carry matching prefixed +
unprefixed values. Two open items remain, both found during the §7.7 sweep on
2026-09-16:

- `mutate.py` flags a stale-uniform warning — *"JS supplies a uniform no shader
  declares"* — plus a real numeric finding: a constellation star's twinkle peak
  reaches **1.16**, above the 1.0 the bloom threshold was solved against, so
  `verify_constellations`' bloom assertion is stale. A twinkle must modulate
  **downward only**. This is GLSL and this host has no GPU, so it was recorded
  rather than hand-fixed.
- The `.splash-stars` layer renders nothing (the rebuild left it bereft of any
  background). It was judged harmless dead weight and kept; deleting it is an
  optional cleanup.

Deviation from ship-as-planned, same sweep: the CSS entry/loop animations on the
splash that had not already been gated (`.splash-horizon-glow`) and on the nav
(`.main-nav--animate`, `.nav-led-strip`) were wrapped behind
`prefers-reduced-motion: no-preference` before the sweep was called done.

Roughly 25 lower-severity findings remain across `ContactPage.jsx`,
`AboutPage.jsx` and `AboutSection.jsx`.

### 7.7 Verification — **DONE**

`tools/verify_tokens.py` asserts that `--ember` never lands on a control or as
text, that `--blue` never lands on sand, and that no public file references
`--gold`, `--spice-blue` or an unloaded font family. **All 8 checks pass.** It
excludes admin via `ADMIN_EXCLUDE = (^|[/\\])admin([/\\]|$)|AdminLogin|DashboardPage`
(DashboardPage.jsx legitimately uses `--ember` as a status accent on an admin
page). The reduced-motion and `:focus-visible` sweep is also done: every
looping/infinite `animation:` in `global.css` now sits behind
`@media (prefers-reduced-motion: no-preference)`, and the `:focus-visible` ring
(`--blue`) is global plus per-control.

Note: `@keyframes shimmer` is **kept** — the reverted heading uses it again.

### 7.8 Housekeeping — **DONE**

`claudedesignskills-main/` and `claudedesignskills.zip` are gone from the repo.

---

## 8. The verification suite

The checkers and mutation harnesses live in `tools/` at the repository root
(they were written for a sandbox that could not build, but they run fine on this
Windows host and are the fastest automated signal — every one of them is green
as of 2026-09-16).

| Script | What it covers |
|---|---|
| `verify_loadin.py` | **71 checks** — splash contract, ember seam, world-ready probe, reveal sequence, fallback import-freeness. Reads `App.jsx`, `HomePage.jsx`, `DuneSea.jsx`, `DuneSeaFallback.jsx`, `HeroPreviewPage.jsx`, `global.css`. **Currently all 71 pass.** |
| `mutate_loadin.py` | **34 mutants**, all behaving. Backs up, mutates, re-runs `verify_loadin.py`, restores. |
| `verify_constellations.py` | Sky-body framing across aspect ratios including portrait |
| `verify_frame_fit.py` | Camera azimuth/elevation solve |
| `verify_sky_motion.py` | Drift, twinkle, meteors |
| `verify_direction.py`, `eyebrow.py`, `gen_fallback.py` | Design-direction and fallback generation helpers |
| `verify_tokens.py` | **8 checks** — the §7.7 token checker: `--ember` never on a control/text, `--blue` never on sand, no public reference to `--gold`/`--spice-blue`/unloaded fonts. Excludes admin per §7.7. |
| `mutate.py` | 26 dune-sea mutants, all behaving |
| `retheme_cold.py` | The pass-1 colour swap described in §6.9. Idempotent; re-running is safe. |

**Operating rules for the suite, learned the hard way:**

Blank comments before matching, or a comment describing the bug will satisfy the
check that is supposed to catch it.

Anchor `opacity:` with a lookbehind, and anchor animation assertions to
`animate=`. An unanchored `scaleX` search lands on
`initial={{ scaleX: reduceMotion ? 1 : 0 }}` first, which satisfies *both* the
"target is a function of sealed" and "draw stops short" assertions for entirely
the wrong reason.

Do not assume attribute order. `<div className="ember-seam"[^>]*>` stops matching
the moment a `key=` is inserted *before* `className`, which made a real check
unreachable and let a different check report the failure with the wrong
diagnosis. Match `<div\s[^>]*className="ember-seam"[^>]*>`.

Scope resource-cleanup checks to the cleanup path. Assert over *every* instance,
not the first. Do not assert a bound at the endpoint you believe is extremal.

**A check that reimplements source logic in Python tests the reimplementation,
not the code.**

**A stale mutant SKIPs rather than fails — it looks like it ran.** This is the
failure that prompted the last audit: the hold-cap mutant was anchored on the
literal `}, 1800);`, a rewrite changed it to `}, SPLASH_HOLD_CAP_MS);`, and the
mutant silently tested nothing. `mutate_loadin.py` now prints an explicit
`STALE … this mutant is testing nothing` line and counts them.

---

## 9. Environment constraints — read before troubleshooting

**Build verification is off the agent's plate, but usable if you have the host.**
The Linux sandbox cannot build this project (oxc/rolldown native bindings are
Windows-only in `node_modules`), and there is no GPU there, so **the GLSL in
this project has never been compiled anywhere in this workflow.** Since
2026-09-16 the verification suite and `npm run build` *do* both run cleanly on
the Windows host (vite v8.1.3, rolldown) — §7's sweep and the event-pages build
were verified there. Do not spend turns in a Linux sandbox trying to fix the
toolchain — the user has explicitly taken build verification off the agent's
plate and reviews changes by hand in their own editor and browser.

**Network:** all outbound hosts except `agentrouter.org` are blocked, and GitHub
is egress-blocked specifically. Do not retry clones; ask for a local copy.

**Per system instructions:** when `WebFetch` or `WebSearch` fails, do not work
around it with bash, curl, wget, Python, or any other fetching method, including
caches, archives or mirrors.

The user has stated no security constraints of their own.

---

## 10. Language and platform gotchas worth carrying forward

`position: fixed` is broken by **any** ancestor with `transform` or `filter` —
that ancestor silently becomes the containing block. This is why the ember seam
must be a sibling of, not a child of, the animated route wrapper, and it is the
same trap that once sized the world layer to the whole document instead of the
viewport.

`!important` in an author stylesheet overrides a normal inline `style`
declaration. A normal inline `style` write beats a normal stylesheet rule. Both
directions have bitten this codebase.

`React.lazy` does not invoke its factory until first render — the root cause of
the original hero pop-in, fixed with a module-scope `import()`.

A `useFrame` subscriber runs **before** that frame is drawn, so readiness is
reported on frame 3. `frameloop="demand"` would stop the probe entirely.

Never animate `scale` on the HDR canvas; resampling goes soft. Opacity and
translate only.

`filter: blur(18px)` on a full-viewport element is one of the most expensive
things you can ask of a phone GPU — and the old splash asked for it in exactly
the frames the world behind it was compiling shaders.

three's `PerspectiveCamera.fov` is the **vertical** FOV, so
`hHalf = atan(tan(vHalf) · aspect)` and NDC x ∝ `tan(az)/(tan(vHalf)·aspect)`.
Hold a body in frame by scaling the **tangent** of the azimuth, with
`fit = aspect/(4/3)` clamped at 1. Elevation needs no correction.

`flex-direction: column` + `align-items: center` shrink-wraps children. Right for
a heading, wrong for a grid — grids need `width: 100%`.

Audiowide has no bold. `font-weight: 700` on it is synthetic, and that is
intentional here.

**JSX must live in `.jsx`, not `.js`.** Vite's oxc parser rejects a `.js` file
that contains JSX with a hard parse error. `src/lib/motifs.jsx` (the emblem
library, written as JSX) *is* the slash pattern; keep the extension when
renaming or it will take the build down with it.

`overflow: hidden` on a page root kills a sticky descendant's rail: the sticky
element then sticks against the scroll container that clips it, which in the
dossier layout meant the whole rail scrolling away. Clip scrollers at the
backdrop, not the page.

---

## 11. Immediate next action

The event detail pages (§6.10) are built and the full verification suite is
green (71 load-in checks, 34 + 26 mutants, 8 token checks) on this host. The
remaining work is outside the agent's reach: **the user visually QAs the event
detail pages** in their own browser (see the findings list at the end of §7.6),
and any changes that come back follow the normal hand-pass discipline.

The user reviews all changes manually in their own editor and browser, so
finishing a coherent slice and saying plainly what changed is more useful than
partial edits across many files.
