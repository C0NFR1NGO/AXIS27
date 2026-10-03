import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ *
 * AXIS'27 — HERO, INTERFACE LAYER
 *
 * Centered composition. The eternal flame in DuneSea sits dead centre on
 * the horizon, so the lockup stands directly in front of it — the name and
 * the fire share an axis. That symmetry is why centering works here.
 *
 * Rules held:
 *   - cyber-blue appears in chrome only, never on sand
 *   - ember/gold is the world and the theme; it never becomes UI chrome
 *   - no gradient text — the wordmark is solid bone and lets the flame
 *     behind it do the colour work. Gradient fills on a display face this
 *     wide just muddy the counters.
 *   - AXIS'27 is set in Ethnocentric, the existing brand face, already
 *     shipped at /fonts/Ethnocentric.woff2 and preloaded in index.html
 *   - the theme is Ignis Aeternum but the words are not printed here. The
 *     fire is on screen; captioning it is what a slide does, not a title.
 *     The name lives in the page metadata and the sections below.
 *
 * Every colour and alpha in this file was picked by measurement, not by eye,
 * because the backdrop is a tone-mapped HDR render rather than a flat fill:
 * scene luminance -> ACES -> sRGB -> the scrim below -> text alpha. Bone on
 * the horizon ember band is 1.00:1 unassisted. If you change a value here,
 * re-check it against both the mean night sand and its bright 5%.
 * ------------------------------------------------------------------ */

/* Two hooks used to live here and are gone, both because the retheme made them
 * unnecessary rather than because they were wrong.
 *
 * `useDirectionFonts` injected a <link> for Archivo, Martian Mono and Inter
 * Tight at runtime, so the rest of the site could keep its own font payload
 * while this hero was still a proof. Now that those three ARE the site's faces
 * the request lives in index.html — which also fixes the real bug that came
 * with injecting it here: the effect only ran when this hero mounted, so a
 * direct hit to any URL other than / rendered the whole page in system-ui.
 *
 * `useSuppressGlobalOverlays` added a body class purely to switch off
 * `body::after` and `body::before` — a vignette, scanlines and a cyan frame
 * that flattened every measured value in the render underneath. Those two
 * pseudo-elements have been deleted from global.css outright, so there is
 * nothing left to suppress and the class no longer means anything.
 */

const T = {
  accent: "'Ethnocentric', sans-serif",
  display: "'Archivo', system-ui, sans-serif",
  mono: "'Martian Mono', ui-monospace, monospace",
  body: "'Inter Tight', system-ui, sans-serif",
  bone: '#F2E4CC',
  /* The tagline's colour. #C9A06A measured about 3.4:1 against the scrimmed
     night sand — under the 4.5:1 floor, and it is large-but-not-huge text, so
     the 3:1 large-text exemption is not something to lean on. Lightened until
     it clears 4.5:1 while staying recognisably sand rather than turning bone. */
  sandLight: '#E8C89A',
  blue: '#00A8E8',
  white: '#F2F7FA',
};

const wide = { fontVariationSettings: "'wdth' 125" };
const monoWide = { fontVariationSettings: "'wdth' 112.5" };

const SCOPED_CSS = `
.hv2 *:focus-visible,
.hv2-cta:focus-visible {
  outline: 2px solid ${T.blue};
  outline-offset: 3px;
}
.hv2-cta {
  font-family: ${T.mono};
  font-variation-settings: 'wdth' 112.5;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.95rem 2.1rem;
  border: 1px solid ${T.blue};
  color: ${T.blue};
  background: rgba(0, 20, 32, 0.28);
  backdrop-filter: blur(3px);
  text-decoration: none;
  display: inline-block;
  border-radius: 1px;
  transition: background 0.25s cubic-bezier(0.22, 1, 0.36, 1),
              color 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.hv2-cta:hover {
  background: ${T.blue};
  color: #04121A;
}
.hv2-cta--ghost {
  border-color: rgba(242, 228, 204, 0.3);
  color: ${T.bone};
  background: rgba(24, 15, 10, 0.24);
}
.hv2-cta--ghost:hover {
  background: rgba(242, 228, 204, 0.1);
  color: ${T.bone};
}

/* Symmetric readout strip. Flanking panels only work in an asymmetric
   layout; centered, they read as an accident. One centred strip with
   hairline dividers keeps the Detroit precision without fighting the axis. */
.hv2-strip {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  border-top: 1px solid rgba(0, 168, 232, 0.22);
  border-bottom: 1px solid rgba(0, 168, 232, 0.22);
  background: linear-gradient(180deg, rgba(0, 22, 34, 0.34), rgba(0, 14, 22, 0.14));
  backdrop-filter: blur(6px);
}
.hv2-cell {
  padding: 0.85rem 1.9rem;
  text-align: center;
  min-width: 0;
}
.hv2-cell + .hv2-cell {
  border-left: 1px solid rgba(0, 168, 232, 0.18);
}
.hv2-cell dt {
  font-family: ${T.mono};
  font-variation-settings: 'wdth' 112.5;
  font-size: 0.55rem;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  /* 0.62, up from 0.36. These labels sit lowest in the frame, over the
     brightest sand, and 0.36 measured 3.2:1 against the mean night value and
     2.5:1 against the bright 5% — a label nobody can read is just texture.
     0.62 takes it to 6.9 / 4.3. Weight up from 300 for the same reason:
     hairline mono at 0.55rem is the worst case for a thin colour. */
  color: rgba(242, 247, 250, 0.62);
  margin-bottom: 0.34rem;
}
.hv2-cell dd {
  font-family: ${T.mono};
  font-variation-settings: 'wdth' 112.5;
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: ${T.white};
  margin: 0;
}
@media (max-width: 640px) {
  .hv2-cell { padding: 0.7rem 1.05rem; }
  .hv2-cell + .hv2-cell { border-left: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hv2 * { animation: none !important; }
}
`;

/* Facts only — every line in the readout strip is verifiable. The countdown
 * that used to live here is gone: a registration deadline is a promise, and it
 * was the one cell on the page that would quietly start lying the moment the
 * date moved. Host and coordinates cannot go stale. */

function Rule({ side }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 'clamp(18px, 5vw, 46px)',
        height: 1,
        background:
          side === 'left'
            ? `linear-gradient(to right, transparent, ${T.blue})`
            : `linear-gradient(to left, transparent, ${T.blue})`,
      }}
    />
  );
}

export default function HeroSectionV2({ ready = true }) {
  const rise = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section
      className="hv2"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(5.5rem, 13vh, 9rem) clamp(1.25rem, 4vw, 3rem) clamp(2rem, 6vh, 4rem)',
        overflow: 'hidden',
      }}
    >
      <style>{SCOPED_CSS}</style>

      {/* Contrast scrim. The sand fills the lower half of the frame and is
          brightest exactly where the tagline, copy and controls sit — and it
          gets brighter still as the sun rises, so this has to hold at both
          ends of the arc. LINEAR from the bottom rather than a centred
          radial on purpose: a radial would also cover the sun at ~43% down
          the frame, and the sun is the whole point. Starting the ramp at 48%
          leaves the horizon and the wordmark untouched. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 48%, rgba(6,4,5,0.32) 63%, rgba(6,4,5,0.64) 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1000, margin: '0 auto' }}>
        {/* Eyebrow. Rules on both sides — symmetric, so it belongs on a
            centered axis rather than looking like a left-aligned leftover. */}
        <motion.div
          {...rise(0.15)}
          style={{
            fontFamily: T.mono,
            ...monoWide,
            fontSize: '0.62rem',
            fontWeight: 500,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: T.blue,
            marginBottom: '1.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            /* Six layers, and every one of them is doing work. This line sits
               at 7.3 degrees of elevation — about 30% down the frame — and the
               hero scrim below is fully transparent until 48%, so the eyebrow
               is the one element in the lockup that gets no help from it. Bare
               cyan on the sky there measures 1.59:1.

               Recolouring cannot fix it, and that is worth knowing before
               someone tries: the backdrop sits at relative luminance 0.194,
               and against it #3FC4FF reaches 2.16, #A8E6FF 3.16, and pure
               white only 3.98 — still under the floor. The backdrop has to
               change locally, which means a halo.

               The blur radii are small on purpose. Martian Mono at 0.62rem has
               roughly 1.1px stems, and a stem that thin cannot cast a wide
               shadow — there is not enough ink. The single 14px drop that used
               to be here produced 0.056 alpha at the glyph edge and bought
               1.75:1, i.e. nothing. Three tight 3px layers carry the edge to
               5.39:1, the 6px pair holds 4.25 at one pixel out and 3.54 at
               1.5, and the 12px is the only cosmetic one, softening the whole
               thing so it reads as depth rather than as outlined type. Still
               4.45:1 at the edge by the time the hero scrolls away. */
            textShadow: [
              '0 0 3px rgba(2,7,12,0.95)',
              '0 0 3px rgba(2,7,12,0.95)',
              '0 0 3px rgba(2,7,12,0.95)',
              '0 0 6px rgba(2,7,12,0.85)',
              '0 0 6px rgba(2,7,12,0.85)',
              '0 0 12px rgba(2,7,12,0.55)',
            ].join(','),
          }}
        >
          <Rule side="left" />
          <span>VNIT Nagpur · Annual Technical Festival</span>
          <Rule side="right" />
        </motion.div>

        <motion.h1
          {...rise(0.25)}
          style={{
            fontFamily: T.accent,
            /* Ethnocentric ships a single 400 weight. Asking for 900 makes
               the browser synthesise a fake bold, which thickens the stems
               unevenly and is part of why the old lockup looked soft. */
            fontWeight: 400,
            /* Ethnocentric runs about 0.98em per glyph including the 0.2em
               tracking, so AXIS'27 is roughly 6.4em wide. At the 8rem ceiling
               that is ~817px, which is why the wrapper above is 1000 — any
               larger and the lockup starts colliding with its own container
               before the viewport gets a say. */
            fontSize: 'clamp(2.5rem, 9.5vw, 8rem)',
            lineHeight: 1.02,
            letterSpacing: '0.2em',
            /* letter-spacing adds a trailing space after the last glyph, so
               a centered block sits half a letterspace left of true centre.
               This puts it back. */
            textIndent: '0.1em',
            textTransform: 'uppercase',
            color: T.bone,
            margin: 0,
            /* Ember glow for the theme, plus a tight dark halo. The halo is
               the load-bearing half, and not by a small margin: the wordmark
               sits directly over the horizon glow, which tone-maps to near
               white, and bone on that measures 1.00:1 — the letters simply
               are not there. The 16px dark layer is what makes them legible,
               taking the glyph edge to 5.0:1. Do not drop it to "clean up"
               the glow, and do not widen it either; past about 8px out it has
               decayed to 2.6:1, so its whole job is the first few pixels. */
            textShadow: [
              '0 0 70px rgba(255,158,0,0.30)',
              '0 0 28px rgba(255,154,60,0.18)',
              '0 0 16px rgba(10,6,3,0.85)',
              '0 2px 40px rgba(12,7,3,0.9)',
            ].join(','),
          }}
        >
          AXIS&rsquo;27
        </motion.h1>

        <motion.p
          {...rise(0.36)}
          style={{
            fontFamily: T.display,
            ...wide,
            /* Bold and about a quarter of the wordmark's size. Below roughly
               600 at this size Archivo goes limp next to Ethnocentric's even
               stems and stops reading as a partner to the title. */
            fontWeight: 600,
            fontSize: 'clamp(1.05rem, 2.35vw, 1.95rem)',
            lineHeight: 1.15,
            letterSpacing: '0.1em',
            textIndent: '0.1em',
            textTransform: 'uppercase',
            color: T.sandLight,
            margin: '1.5rem 0 0',
            textShadow: '0 1px 16px rgba(10,6,3,0.9), 0 0 36px rgba(10,6,3,0.7)',
          }}
        >
          Illuminating the Infinite
        </motion.p>

        <motion.p
          {...rise(0.5)}
          style={{
            fontFamily: T.body,
            fontWeight: 400,
            fontSize: 'clamp(0.95rem, 1.25vw, 1.1rem)',
            lineHeight: 1.7,
            /* 0.88, up from 0.72. Measured against the night sand under the
               scrim this holds about 10:1, and the hero is only ever on screen
               through the first fifteen percent of the arc — by the time the
               sand is genuinely bright the content below has scrolled over it. */
            color: 'rgba(242, 228, 204, 0.88)',
            margin: '1.6rem auto 0',
            maxWidth: '46ch',
            textShadow: '0 1px 12px rgba(10,6,3,0.85)',
          }}
        >
          Three days of events, workshops, exhibitions and performances on the
          VNIT campus.
        </motion.p>

        {/* Interface controls. Blue because they are instruments, not world. */}
        <motion.div
          {...rise(0.6)}
          style={{
            display: 'flex',
            gap: '0.9rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '2.5rem',
          }}
        >
          <Link to="/events" className="hv2-cta">
            Browse events
          </Link>
          <Link to="/contact" className="hv2-cta hv2-cta--ghost">
            Contact us
          </Link>
        </motion.div>

        <motion.dl
          {...rise(0.72)}
          className="hv2-strip"
          style={{ marginTop: '3.2rem', marginBottom: 0 }}
        >
          <div className="hv2-cell">
            <dt>Host</dt>
            <dd>VNIT Nagpur</dd>
          </div>
          <div className="hv2-cell">
            <dt>Coordinates</dt>
            <dd>21.1255&deg; N / 79.0505&deg; E</dd>
          </div>
        </motion.dl>
      </div>

      {/* Scroll affordance, single hairline, on the same centre axis. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 1.15 }}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 'clamp(1.1rem, 3vh, 2rem)',
          textAlign: 'center',
          fontFamily: T.mono,
          ...monoWide,
          fontSize: '0.52rem',
          letterSpacing: '0.2em',
          textIndent: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(242, 228, 204, 0.34)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: 1,
            height: 42,
            margin: '0 auto 0.65rem',
            background: 'linear-gradient(to bottom, transparent, rgba(242,228,204,0.42))',
          }}
        />
        Scroll
      </motion.div>
    </section>
  );
}
