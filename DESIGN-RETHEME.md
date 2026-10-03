# AXIS'27 — retheming the site to the hero

The hero is finished and it sets the terms. This document is the plan for
bringing the other twelve pages, twenty-six components and `global.css` up to
meet it. `HeroSectionV2.jsx` and `DuneSea.jsx` are the fixed reference; nothing
in here changes them.

Two passes, as they happened: the plan, then the critique of the plan. The
critique section is not decoration — three things in the first pass were
defaults dressed as decisions, and they are named.

---

## The governing rule

**The world burns warm. The interface stays cold.**

Everything the hero does well comes out of this one split. Ember, gold and sand
are *light in a landscape* — they belong to the sky, the horizon and the dunes.
Cyan-blue is *a machine talking to you* — it belongs to labels, controls, focus
rings and readouts. The hero never puts blue on sand and never puts ember on a
button, and that is why it reads as a place with an instrument in front of it
rather than a poster with a colour scheme.

The rest of the site currently breaks this everywhere, which is the real reason
it doesn't match. `DESIGN-DIRECTION.md` diagnosed the symptom as "the two themes
are blended rather than opposed." The cause is that gold is used as a UI colour —
20 borders, labels and hover states in admin alone, plus roughly thirty more
across the public components. Gold is warm, so every one of those is world
material sitting on interface chrome.

**So gold is deleted from the public site.** Not re-tuned — removed. It also
happens to resolve a mess: there are currently *three* golds in circulation
(`--gold: #c9911a`, `rgba(229,169,60,·)` and Navigation's `rgba(210,156,56,·)`),
and a token swap would only have moved the first of them.

---

## Pass one: the plan

### Colour

Seven values. Every one is measured off the hero — either from `HeroSectionV2`'s
`T` object or from `DuneSea`'s `PALETTE` — rather than picked to coordinate with
it.

```css
--ground:  #070503;  /* page base. warm-shifted near-black, lifted directly
                        from HomePage's existing instrument-deck scrim */
--surface: #0C0906;  /* panel fill, used at low alpha over --ground */
--bone:    #F2E4CC;  /* primary text. the hero wordmark's colour */
--sand:    #E8C89A;  /* display and secondary text. measured to clear 4.5:1 */
--white:   #F2F7FA;  /* data values only — the number, never its label */
--blue:    #00A8E8;  /* INTERFACE ONLY. labels, controls, focus, hairlines */
--ember:   #FF7A1A;  /* WORLD ONLY. never a border, never text, never a control */
--alert:   #FF3355;  /* reserved: form errors and destructive confirms */
```

The two rules in caps are the whole system. `--ember` appears in exactly one
structural place (see Signature) and otherwise only inside the WebGL canvas.
`--blue` never touches sand.

`--alert` is deliberately close to the existing `--cyber-red` so the one thing
that genuinely needs to shout still can. It is not an accent colour and must not
be used as one.

### Type

All four faces are already loaded and already proven in the hero. No new
webfonts.

**Ethnocentric 400** — the wordmark, and *only* the wordmark. It ships one
weight, so asking for 900 gets a synthesised fake bold. It is never a heading.

**Archivo, `'wdth' 125`, weights 300 and 600** — page titles and display. The
width axis is what makes it feel built rather than set.

**Martian Mono, `'wdth' 112.5`, weights 400 and 500** — every label, readout,
control, nav link and eyebrow. This is the machine's voice and it is the most
load-bearing face on the site.

**Inter Tight, 400 and 500** — body prose, at 46–68 characters per line.

Two weights per family, maximum. The scale:

```
0.55  0.62  0.68  0.80  0.95  1.10  1.50  2.20  3.20  4.40  rem
 └── mono labels ──┘   └─ body ─┘   └──── Archivo display ────┘
```

**The font loading has to move, and this is not cosmetic.** Archivo, Martian
Mono and Inter Tight are currently injected at runtime by
`HeroSectionV2`'s `useDirectionFonts()` hook, which was correct while the hero
was an isolated proof — it deliberately left the rest of the site's font payload
untouched. The moment the whole site depends on those faces, that hook becomes a
bug: on a direct navigation to `/events`, `HeroSectionV2` never mounts, so the
`<link>` is never injected, and every page except home silently falls back to
`system-ui`.

So the `FONT_HREF` request moves into `index.html`, and the **existing** Google
Fonts request there — Audiowide, Share Tech Mono, Orbitron, Rajdhani — comes out
in the same edit. Doing one without the other ships two complete font payloads
on every page load. `Ethnocentric` is unaffected; it already has an `@font-face`
in `global.css` and a preload tag.

### Layout

Twelve columns, 1240px maximum, 24px gutters. Content spans columns 1–7 by
default and **8–12 are left as deliberate void** unless a readout has real
numbers to put there. Card grids go three-up above 1024px, two-up above 640px,
one-up below, and the last row is never stretched to fill.

There is one contradiction in the existing material to resolve.
`HeroSectionV2.jsx` argues, correctly, that *"the eternal flame in DuneSea sits
dead centre on the horizon, so the lockup stands directly in front of it — the
name and the fire share an axis. That symmetry is why centering works here."*
`DESIGN-DIRECTION.md` argues, also correctly, that *"everything is centred"* is
the site's biggest layout problem. Its count of 24 `textAlign: 'center'`
declarations is now stale — the real figure today is **30**.

Both are right, so this becomes a structural rule rather than a conflict:

> **Symmetry is what you get when you are looking at the world. Asymmetry is
> what you get when you are operating an instrument.**

Exactly one centred composition exists on the site — the hero, which is a title
card. Every other page is left-aligned on the grid. The centring isn't a habit
to be broken; it's a signal that means something, and it means something only
because it happens once.

```
        col 1 ─────────────── 7        8 ──────── 12
┌───────────────────────────────────────────────────────────┐
│  ← BACK TO HOME                                           │  mono 0.68
│                                                           │
│  EVENTS                                  ┌──────────────┐ │
│  ▔▔▔▔▔▔                                  │ 34  EVENTS   │ │  the void is
│  Thirty-four events across three days.   │  9  CATEGORY │ │  filled ONLY
│  Robotics, code, design, and the ones    │  3  DAYS     │ │  by real
│  that don't fit a category.              └──────────────┘ │  numbers
│                                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ ROBOTICS    │ │ CODING      │ │ DESIGN      │          │
│  │ 6 events    │ │ 8 events    │ │ 5 events    │          │
│  │▁▁▁▁▁▁▁▁▁▁▁▁▁│ │▁▁▁▁▁▁▁▁▁▁▁▁▁│ │▁▁▁▁▁▁▁▁▁▁▁▁▁│ ← ember   │
│  └─────────────┘ └─────────────┘ └─────────────┘  hairline │
│                                                            │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │ GAMING      │ │ QUIZ        │  ← last row not stretched │
│  └─────────────┘ └─────────────┘                           │
│                                                            │
│  · · · · · · ember seam, fixed at 57vh · · · · · · · · · · │
└────────────────────────────────────────────────────────────┘
```

For contrast, the hero — unchanged, and the only page that looks like this:

```
┌───────────────────────────────────────────────────────────┐
│                      ✦        ☾        ✦                  │
│                                                           │
│                    A X I S ' 2 7                          │  centred, because
│                 three days of fire                        │  the flame behind
│                                                           │  it is centred
│            [ BROWSE EVENTS ]   [ CONTACT US ]             │
│      ╌╌╌╌╌╌╌╌╌╌╌╌╌ ember horizon ╌╌╌╌╌╌╌╌╌╌╌╌╌╌          │
│      ▁▂▃▄▅▆▇▇▇ sand ▇▇▇▆▅▄▃▂▁                             │
└───────────────────────────────────────────────────────────┘
```

### Signature: the ember seam

One warm light source, fixed at the hero's horizon position — centre-x, ~57vh —
lit on **every page**, including home, where it simply sits behind the WebGL
canvas and needs no coordination with it.

Every panel on the site then carries a single 1px `--ember` hairline on its
**bottom** edge, with `--blue` hairlines on the other three. Light comes from
the horizon, and the horizon is below you.

```
   ┌────────── blue #00A8E8 @ 22% ──────────┐
   │                                        │
 blue              content                blue      cold on three sides
   │                                        │
   └────────── ember #FF7A1A @ 55% ─────────┘      lit from below, because
                                                    the horizon is below
```

That one CSS rule *is* the world/interface split made physical instead of
merely stated, and it is the only place ember touches the interface.

Two implementation notes that matter more than they look:

The seam renders in `App.jsx` **outside** the framer-motion route wrappers. This
is not tidiness. Those wrappers animate `scale` and `filter`, and either
property makes an element the containing block for its fixed descendants — the
exact trap that forced the home page's world layer to be `sticky` instead of
`fixed`. Rendered outside them, `position: fixed` is safe and correct.

Living outside the route wrappers also means it **never unmounts on
navigation**, so its CSS animation never restarts. The flame is eternal because
it survives route changes. That is the whole idea, and it costs one line of
placement rather than any JavaScript.

---

## Pass two: critique of the above

Three things in pass one needed changing, and one accusation needed answering.

**The signature was originally something else, and it was wrong.**
`DESIGN-DIRECTION.md` proposed a "spice-scan route dissolve" — a warm sweep
across the viewport on navigation. It is showier than the ember seam and it is
the kind of thing that demos well. It also puts world material directly onto the
interface during the one moment the interface is most in charge, which
contradicts the governing rule the entire palette is built on. Cut. A signature
that breaks the system it is meant to express isn't a signature, it's a special
case.

**"Remove one accessory" landed on the fake telemetry, and you have now
partially overruled me — correctly.** My first pass deleted all of it on the
rule that *every readout on the site displays a real number or it does not
exist*, extending the reasoning we used to cut the hero countdown (a
registration deadline is a promise, and it was the one cell on the page that
would quietly start lying). Your call to keep a few in high-atmosphere places
holds up, because it splits along a line I had missed: the splash is fiction
you pass *through*, not an interface you *use*. Nothing there is claiming to
inform a decision. See the decisions section below for what that means
concretely.

**The left-aligned hairline grid risks reading as AI-default #3** — the
broadsheet look, hairline rules and dense columns. I think it escapes, and here
is the test rather than the assertion: broadsheet is *dense* and this is
*sparse and monumental* (columns 8–12 are usually empty on purpose); the display
face is a wide variable sans, not a high-contrast serif; the radius is 1px,
inherited from the hero's real `.hv2-cta`, not the zero that broadsheet insists
on; and broadsheet has no equivalent of a light source. If it starts to drift
that way in build, the tell will be columns 8–12 filling up with filler.

**The warm-glow-on-near-black risks AI-default #2** — near-black with one acid
accent. It escapes for a countable reason: everything interactive is cold blue,
the palette carries four distinct light values (`--bone`, `--sand`, `--white`,
`--ember`) rather than one accent doing all the work, and `#070503` is a
*measured warm-shifted* black taken from the existing scrim, not the neutral
`#0A0A0A` that look always reaches for.

**Unchanged after critique:** the colour rules, the type stack, the symmetry
rule, and the numbering discipline below. Those came from the hero's own
measured values, so there was nothing to defend them against.

---

## Your two decisions, and what they cost

### Admin stays as it is

**But "leave it alone" is not free, and here is the part that needs your eyes.**
The four admin screens reference `var(--gold)` twenty times and
`var(--spice-blue)` sixteen times. If I delete those tokens as the plan calls
for, admin doesn't keep looking the way it does now — its borders and labels
lose their colour entirely.

So `--gold` and `--spice-blue` survive in `global.css`, moved into a clearly
fenced block:

```css
/* LEGACY — admin only. Not part of the design system. Do not use in new work.
 * These exist solely so the un-rethemed admin screens keep rendering. When
 * admin is eventually brought over, delete this block and these four files
 * are the only ones that will break. */
--gold:       #c9911a;
--spice-blue: #00e5ff;
```

Also worth knowing rather than discovering later: admin *will* change
appearance somewhat regardless, because it also uses `--font-mono`,
`--font-heading`, `--text-muted` and `--text-secondary`, and those are being
redefined. Admin inherits the new type stack for free. I think that is a good
outcome — it drifts *toward* the new system instead of away from it — but it
does mean "leave alone" means "don't hand-edit," not "won't move."

Two live bugs in admin will therefore go unfixed, and I'd rather they be written
down than silently deferred: `AdminLayout.jsx:92` calls an undefined
`setSidebarOpen`, which throws a `ReferenceError` the moment mobile nav is
tapped; and the `.topbar` / `.pageTitle` / `.roleBadge` / `.main` / `.content`
media queries in `global.css` are dead code, because `AdminLayout` applies those
as inline style objects with no `className`. Both are small. Say the word and
I'll fix the crash independently of any theming.

### Telemetry: keep a few, cut the rest

The audit I was working from was imprecise on one point and I want to correct it
before it becomes a plan: only **one** readout on the site is actually random.

`Navigation.jsx:96` re-rolls `88 + Math.floor(Math.random() * 13)` on a 3.2
second interval. That one is cut, and the nav readout becomes a real section
index — `[04/09]` — driven by the actual route.

`Footer.jsx:38` is a hardcoded `▲ 94%` with an infinite opacity pulse. Cut. A
footer is navigation furniture and it was the site's weakest claim to being a
machine.

The splash keeps its readouts — `LOCAL_TIME [2027.04.12]`, `COGNITIVE SYNAPSE
MAP: 98.4%`, `CORE THERMALS: 32.4°C (OPTIMAL)`, `SOFTWARE INSTABILITY: ▲ 94%`.
Good news here: the splash's instability is *already* scripted to the boot
sequence (94 → 91 → 94, stepped by log index), not random, so it doesn't flicker
between renders and needs no freezing. It works as written.

The `// SLASH_WRAPPED //` mono tic still goes. It isn't a readout, it's a
decoration pretending to be one.

Everything that survives elsewhere comes from `data/content.js` and is true:
event counts, category counts, team and gallery counts, coordinates.

### Numbering discipline

`01 / 02 / 03` appears exactly twice on the site: the About-page timeline and
the three-day schedule. Those are the only content on the site that is genuinely
a sequence. Event categories are not a sequence, so event cards get no numbers,
however much the style invites them.

---

## Copy

Copy is design material here, not filler, and the current site has a specific
failure: labels that describe the machine instead of the reader.

Active voice, sentence case, and a control says exactly what happens when you
use it. An action keeps its name through the whole flow, so the button that says
"Send message" produces a confirmation that says "Message sent" — not
"Submission received." Errors don't apologise and are never vague about what
went wrong or what to do next. Empty states are invitations to act, not
apologies for absence: the three "coming soon" pages currently read as dead
ends and should say what will be there and when, or what to do in the meantime.

---

## Motion budget

Four things move. Everything else stops moving.

The hero's existing `rise()` stagger stays as it is. `ZoomReveal` drops `scale`
and keeps opacity and translate only — this both calms the page and removes a
permanent fixed-position containing block, since animating `scale` makes that
element a containing block for every fixed descendant inside it. Scramble fires
once per page, on the page title only, not on all six section headings. And the
ember breathes.

All four sit inside `prefers-reduced-motion`. Right now `TextScramble`,
`TypewriterText`, `ScrambleTitle` and `ZoomReveal` all ignore it entirely, and
`global.css` has only three reduced-motion blocks in 1170 lines.

---

## Primitives to extract first

The single highest-leverage edit on the whole list is a `<BackLink>` component:
the `← Back to…` block is duplicated **ten times**, eight of them on the public
site and two in admin, and extracting it alone moves five pages into the
"reflows automatically from tokens" bucket.

Then `<PageHeader>` (absorbs those eight back-links, the eight `ScrambleTitle`
call sites and the centred subtitles), `<Readout>` (promote `.hv2-strip` /
`.hv2-cell` out of `HeroSectionV2`'s scoped CSS into global), `<Panel>`
(replaces `.glass-card`), `<Control>` (exactly the hero's `.hv2-cta` /
`--ghost`, moved to global), `<Field>` (one input style, where a CSS
`:focus-visible` rule replaces ContactPage's ten duplicated imperative border
assignments), and `<EmptySection>` (the three coming-soon clones collapse into
one).

Two chokepoints are worth knowing before touching anything.
`ScrambleTitle.jsx:12` controls eight headings — the six `*Section` components
plus AboutPage and ContactPage. And `global.css:182–343` (`.section` through
`.glass-card:active`) controls the entire visual frame of **ten** files. Small
edits in either place move a lot of the site at once, which cuts both ways.

---

## Implementation order

Ordered by dependency, not by size. Each row is independently shippable.

| # | Work | Why here |
|---|---|---|
| 1 | Move `FONT_HREF` into `index.html`; delete the old Audiowide/Orbitron/Rajdhani request and `useDirectionFonts()` | Without this, every page but home falls back to `system-ui` |
| 2 | Token block in `global.css`, with the legacy admin fence | Everything below reads from it |
| 3 | `<BackLink>`, `<Panel>`, `<Control>`, `<Field>`, `<PageHeader>`, `<Readout>`, `<EmptySection>` | Five pages become token-only once these exist |
| 4 | `global.css:182–343` — `.section`, `.section-title`, `.glass-card` | One chokepoint, ten files |
| 5 | Delete gold from public components; fix the three-golds problem | The governing rule, made real |
| 6 | Telemetry: cut Navigation + Footer, keep splash, nav readout becomes `[04/09]` | Small, and the page gets quieter immediately |
| 7 | Reduced-motion + focus-visible pass across the four animation components | Quality floor |
| 8 | The ember seam in `App.jsx`, outside the route wrappers | Needs tokens and the panel hairlines to exist |
| 9 | Hand edits: ContactPage (717 LOC), Navigation (482), AboutPage (308), App splash chrome | Largest, and last, because they consume everything above |

`HeroSection.jsx` (235 LOC, zero importers) can be deleted outright. Note that
`CosmicBackground.jsx` is **not** dead despite appearances — it is named in
comments in `DuneSea.jsx` and `HomePage.jsx`, but `EventDetailsPage.jsx:7` holds
the only real import and it is a live `lazy()` consumer.

Preserve and extend rather than retheme: the `.nf-*` 404 page, the `.ng-*`
notable-guests portrait wall, and the `.gallery-*` festival grid with its
lightbox. These three are already the best work in the existing CSS.

---

## What this plan has not verified

The sandbox cannot build this project — `oxlint` and `vite` both fail on native
bindings installed for Windows, and there is no GPU. So every contrast figure in
here is modelled through the real pipeline (linear luminance → ACES → sRGB → CSS
scrim → text alpha) rather than sampled from a rendered frame, exactly as the
hero's numbers were. `--sand` at 4.5:1 and `--bone` over the instrument deck at
roughly 12:1 are calculations, not measurements.

They held up for the hero. They should be spot-checked in a browser once
something is on screen.
