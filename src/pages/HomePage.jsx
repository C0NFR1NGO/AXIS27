import { lazy, Suspense, useCallback, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import HeroSectionV2 from '../components/HeroSectionV2';
import DuneSeaFallback from '../components/DuneSeaFallback';
import StatsBar from '../components/StatsBar';
import AboutSection from '../components/AboutSection';
import ZoomReveal from '../components/ZoomReveal';
import usePageMeta from '../hooks/usePageMeta';

/* Hero is the Ignis Aeternum dune sea, and the world layer now spans the
 * whole page rather than the first screen: scrolling the home page carries
 * the sun from just under the horizon up into morning. DuneSea reads document
 * scroll progress directly, so the arc is paced by the real page length.
 *
 * To revert to the previous hero, swap these two imports back to
 * HeroSection / CosmicBackground — nothing else here changed. */

/* Started at module scope, deliberately, and this is the whole fix for the
 * late pop-in.
 *
 * React.lazy does not call its factory until the component first renders. The
 * mount below used to be gated on `ready` (i.e. the splash being gone), which
 * meant the request for this chunk — three, @react-three/fiber,
 * postprocessing, and 1900 lines of GLSL, comfortably the largest asset on the
 * site — was not even issued until the intro had already left the screen. The
 * visitor then watched a bare page while it downloaded, parsed and compiled.
 *
 * HomePage's own module is evaluated while the splash is still up, so kicking
 * the import off here overlaps every bit of that with the intro instead. */
const duneSeaChunk = import('../components/DuneSea');
const LazyDuneSea = lazy(() => duneSeaChunk);

export default function HomePage({ ready, onWorldReady }) {
  usePageMeta({
    description: "AXIS'27 — Ignis Aeternum. The annual technical festival of VNIT Nagpur. 35+ events, 200+ colleges, 35,000+ participants.",
  });

  const reducedMotion = useReducedMotion();
  const [painted, setPainted] = useState(false);

  /* Stable, because it is a useFrame dependency inside the canvas and a prop
   * on a lazy boundary. A fresh identity each render would resubscribe the
   * probe every time. */
  const handlePainted = useCallback(() => {
    setPainted(true);
    if (onWorldReady) onWorldReady();
  }, [onWorldReady]);

  /* Two conditions, both required. `painted` means the render loop has
   * actually produced frames, so there is something to reveal; `ready` means
   * the intro is done, so revealing it is not wasted behind an opaque overlay.
   * Either one alone is a way to show an empty canvas. */
  const reveal = ready && painted;

  return (
    <div style={{ position: 'relative' }}>
      {/* ---------------------------------------------------------------- *
        * World layer. STICKY, not fixed, and that is not a style choice:
        * HomePage renders inside two framer-motion wrappers in App.jsx that
        * animate scale and filter, and either property makes an element the
        * containing block for its fixed descendants. A position:fixed layer
        * in here would therefore be sized to the entire document and would
        * scroll away with it — the sunrise would be over before the first
        * screen had finished. Sticky is unaffected by transformed ancestors.
        *
        * It occupies 100vh of flow, which the content below pulls back with
        * a negative margin.
        * ---------------------------------------------------------------- */}
      <div
        aria-hidden="true"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          /* Clips the canvas's overhang while it rises into place. Safe on the
             sticky element itself — only an ANCESTOR with overflow hidden
             would interfere with sticky positioning. */
          overflow: 'hidden',
        }}
      >
        {/* Bridge image, and the reason the hand-off has nothing to hide. It
            is one paint of a CSS gradient, it is already the no-WebGL2
            fallback, and it is matched to the night end of PALETTE — so the
            canvas fades onto an image it very nearly is, rather than onto
            black. It also covers the sliver at the top of the frame while the
            canvas is still translated down, which is why the rise is a rise
            and not a visible seam. */}
        <DuneSeaFallback />

        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          /* Both keyframes carry the same unit on purpose. Interpolating a
             unitless 0 against a '3vh' string leaves framer-motion to guess,
             and the guess is not always translateY. */
          initial={{ opacity: 0, y: reducedMotion ? '0vh' : '3vh' }}
          animate={
            reveal
              ? { opacity: 1, y: '0vh' }
              : { opacity: 0, y: reducedMotion ? '0vh' : '3vh' }
          }
          /* Slow, and on the site's standard ease. 1.4s reads as the world
             arriving; anything near a UI duration reads as a div appearing.
             Opacity and translate only — no scale. Scaling a tone-mapped HDR
             canvas resamples every pixel and goes soft, and soft is the exact
             complaint this background has already been rebuilt twice to fix. */
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={null}>
            {/* Mounted unconditionally now. The context creation and the
                shader compiles are the expensive, main-thread-blocking part of
                this component, and they are far better spent behind the intro
                than in front of the visitor. `active` is what holds the
                sunrise back until the reveal, so nothing animates unseen. */}
            <LazyDuneSea active={reveal} onPainted={handlePainted} />
          </Suspense>
        </motion.div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: '-100vh' }}>
        <HeroSectionV2 ready={ready} />

        {/* Instrument deck. The world burns warm, the interface stays cold —
            so where content begins, a cold panel slides over the sand.
            0.80 rather than opaque is deliberate: it leaves about a fifth of
            the dune sea showing through, which is enough that the sky still
            visibly brightens behind the content instead of the sunrise
            stopping at the fold. Bone text over this still measures roughly
            12:1 even at full daylight, because four fifths of near-black
            dominates the composite. Turn this up if copy ever feels thin. */}
        <div
          style={{
            position: 'relative',
            background: [
              'linear-gradient(to bottom,',
              'rgba(7,5,3,0) 0,',
              'rgba(7,5,3,0.58) 7vh,',
              'rgba(7,5,3,0.80) 20vh,',
              'rgba(7,5,3,0.82) 100%)',
            ].join(' '),
          }}
        >
          <ZoomReveal><StatsBar /></ZoomReveal>
          <ZoomReveal><AboutSection /></ZoomReveal>
        </div>
      </div>
    </div>
  );
}
