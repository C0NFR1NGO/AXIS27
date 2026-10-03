import { Link } from 'react-router-dom';
import DuneSea from '../components/DuneSea';
import HeroSectionV2 from '../components/HeroSectionV2';

/* ------------------------------------------------------------------ *
 * /preview-hero — scroll-behaviour proof.
 *
 * The hero itself now ships on /, where the world layer also spans the whole
 * page. This route survives as the isolated version: same sticky world, but
 * with only two screens of content, so the sunrise arc and the camera dolly
 * can be watched end to end without the rest of the home page in the way.
 *
 * STICKY rather than fixed, for the same reason as HomePage: routes render
 * inside framer-motion wrappers in App.jsx that animate scale and filter, and
 * either property makes an ancestor the containing block for position:fixed.
 * A fixed layer here was sized to the document and scrolled with it, which is
 * exactly the behaviour this route was supposed to rule out.
 *
 * The global overlay suppression lives in HeroSectionV2, so there is no
 * page-level CSS here.
 * ------------------------------------------------------------------ */

export default function HeroPreviewPage() {
  return (
    <div style={{ position: 'relative' }}>
      {/* World layer, pinned behind everything */}
      <div
        aria-hidden="true"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <DuneSea />
      </div>

      {/* Interface layer, pulled back over the pinned world */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '-100vh' }}>
        <HeroSectionV2 ready />

        {/* A second screen, so the scroll dolly has somewhere to travel.
            Sections should feel like locations crossed, not divs stacked. */}
        <section
          style={{
            minHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(3rem, 10vh, 7rem) clamp(1.25rem, 4vw, 3rem)',
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <div
              style={{
                fontFamily: "'Martian Mono', ui-monospace, monospace",
                fontVariationSettings: "'wdth' 112.5",
                fontSize: '0.6rem',
                letterSpacing: '0.22em',
                textIndent: '0.22em',
                textTransform: 'uppercase',
                color: '#00A8E8',
                marginBottom: '1.4rem',
              }}
            >
              What changed
            </div>
            <h2
              style={{
                fontFamily: "'Archivo', system-ui, sans-serif",
                fontVariationSettings: "'wdth' 125",
                fontWeight: 300,
                fontSize: 'clamp(1.6rem, 3.2vw, 2.7rem)',
                lineHeight: 1.06,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#F2E4CC',
                margin: 0,
              }}
            >
              The world burns warm.
              <br />
              The interface stays cold.
            </h2>
            <p
              style={{
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.92rem, 1.15vw, 1.05rem)',
                lineHeight: 1.75,
                color: 'rgba(242, 228, 204, 0.58)',
                maxWidth: '46ch',
                margin: '1.6rem auto 0',
              }}
            >
              At rest the sun sits just under the horizon, so all that shows is
              its glow burning through one stretch of skyline &mdash; dead
              centre, with the wordmark standing in front of it. Scrolling
              lifts it. The stars go out, the shadows swing and shorten, and
              the sand comes up out of the dark. Dune owns the sand and the
              heat; Detroit owns the panels and the readouts. Neither borrows
              the other&rsquo;s temperature, which is why both read.
            </p>

            <div style={{ display: 'flex', gap: '0.9rem', marginTop: '2.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="hv2-cta hv2-cta--ghost">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
