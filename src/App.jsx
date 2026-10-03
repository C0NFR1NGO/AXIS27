import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import RouteLoading from './components/RouteLoading';
import BackToTop from './components/BackToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { eventCategories } from './data/content';
import { categoryPalette } from './lib/eventTheme';
import slugify from './lib/slugify';
import './styles/global.css';

const duneSeaChunk = import('./components/DuneSea');
const LazyDuneSea = lazy(() => duneSeaChunk);

const splashSceneChunk = import('./components/SplashScene');
splashSceneChunk.catch(() => {});
const SplashScene = lazy(() => splashSceneChunk);

/* The other world: a living constellation field in the cold palette, for the
 * interface pages. Same module-scope kick so it overlaps navigation, not the
 * splash. Falling glyph rain in the cold palette — a hacker wallpaper. The
 * dither and the original constellation field are kept beside it as backups
 * and can be plugged back in one line. */
const cosmicChunk = import('./components/CosmicRain');
const LazyCosmicBackground = lazy(() => cosmicChunk);

/* Every non-home page stands in front of a living world. World pages
 * (about, events and its detail pages where the event's category burns warm,
 * workshops, accommodation) get the dune sea at full night; interface pages
 * (contact, team, sponsors, login, anything unmatched) get the cosmic field.
 * That is the site's own world/interface rule applied to the backdrop itself —
 * ember belongs to the dunes, cold routes float on the stars. Admin stays on
 * the dunes, the quietest change. */
function worldKind(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/contact' || p === '/sponsors' || p === '/login') return 'cosmic';
  if (p.startsWith('/events')) {
    const slug = (p.split('/')[2] || '').toLowerCase();
    if (slug) {
      for (const cat of eventCategories) {
        if (!cat.events) continue;
        for (const ev of cat.events) {
          if (ev.name && slugify(ev.name) === slug) {
            return categoryPalette(cat.id) === 'cool' ? 'cosmic' : 'dune';
          }
        }
      }
    }
    return 'dune'; // the /events listing itself
  }
  if (p === '/about' || p === '/team' || p === '/workshops' || p === '/accommodation' || p === '/dashboard' || p === '/preview-hero') return 'dune';
  return 'cosmic'; // NotFound and anything unmatched
}

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'));
const WorkshopsPage = lazy(() => import('./pages/WorkshopsPage'));
const SponsorsPage = lazy(() => import('./pages/SponsorsPage'));
const AccommodationPage = lazy(() => import('./pages/AccommodationPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const HeroPreviewPage = lazy(() => import('./pages/HeroPreviewPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const SPLASH_FLOOR_MS = 1700;
const SPLASH_HOLD_CAP_MS = 1800;
const SPLASH_HANDOFF_MS = 600;

function IntroClock() {
  const ref = useRef(null);
  useEffect(() => {
    const tick = () => {
      if (!ref.current) return;
      const d = new Date();
      ref.current.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((n) => String(n).padStart(2, '0')).join(':');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span ref={ref} aria-hidden="true">--:--:--</span>;
}

function SplashScreen({ onComplete, worldReady }) {
  const [sealed, setSealed] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  const worldReadyRef = useRef(worldReady);
  useEffect(() => { worldReadyRef.current = worldReady; }, [worldReady]);

  const scenePaintedRef = useRef(false);
  const scenePaintedAtRef = useRef(null);
  const handleScenePainted = useCallback(() => {
    if (scenePaintedRef.current) return;
    scenePaintedAtRef.current = performance.now();
    scenePaintedRef.current = true;
  }, []);

  const skipBtnRef = useRef(null);
  const cancelRef = useRef(null);

  const handleSkip = useCallback(() => {
    if (cancelRef.current?.()) onComplete();
  }, [onComplete]);

  useEffect(() => {
    skipBtnRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let completed = false;
    let handedOff = false;
    let holdPoll = null;
    let holdCap = null;
    let handoffTimer = null;

    const finish = () => {
      if (cancelled || completed) return;
      completed = true;
      const handOff = () => {
        if (cancelled || handedOff) return;
        handedOff = true;
        clearInterval(holdPoll);
        clearTimeout(holdCap);
        setSealed(true);
        handoffTimer = setTimeout(() => {
          if (cancelRef.current?.()) onComplete();
        }, SPLASH_HANDOFF_MS);
      };
      const sceneReady = () => scenePaintedRef.current
        && performance.now() - scenePaintedAtRef.current >= SPLASH_FLOOR_MS;
      if (worldReadyRef.current) {
        if (sceneReady()) {
          handOff();
          return;
        }
      }
      holdCap = setTimeout(handOff, SPLASH_HOLD_CAP_MS);
      holdPoll = setInterval(() => {
        if (!worldReadyRef.current || !sceneReady()) return;
        handOff();
      }, 80);
    };

    const scriptTimer = setTimeout(finish, SPLASH_FLOOR_MS);
    const cancel = () => {
      if (cancelled) return false;
      cancelled = true;
      clearTimeout(scriptTimer);
      clearInterval(holdPoll);
      clearTimeout(holdCap);
      clearTimeout(handoffTimer);
      return true;
    };
    cancelRef.current = cancel;

    return cancel;
  }, [onComplete]);

  const sealedLine = sealed
    ? 'the dawn is breaking'
    : worldReady ? 'the world is up' : 'compiling the world';
  const stageFill = worldReady ? (sealed ? 2 : 1) : 0;

  return (
    <motion.div
      className="intro-stage"
      role="group"
      aria-label="Intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleSkip();
        }
      }}
    >
      <div className="intro-canvas" aria-hidden="true">
        <Suspense fallback={null}>
          <SplashScene sealed={sealed} reduceMotion={reduceMotion} onPainted={handleScenePainted} />
        </Suspense>
      </div>

      <div className="intro-film" aria-hidden="true" />
      <span className="intro-mark intro-mark--tl" aria-hidden="true" />
      <span className="intro-mark intro-mark--tr" aria-hidden="true" />
      <span className="intro-mark intro-mark--bl" aria-hidden="true" />
      <span className="intro-mark intro-mark--br" aria-hidden="true" />

      <div className="intro-ui">
        <div className="intro-bar intro-rise intro-rise--d1">
          <div>
            AXIS<span className="intro-amber">'</span>27 // VNIT NAGPUR
            <span className="intro-drop">the annual technical festival</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            IGNIS AETERNUM
            <br />
            <IntroClock /> IST
          </div>
        </div>

        <div className="intro-center">
          <div className="intro-lens intro-rise intro-rise--d2">
            <span className="intro-lens__r1" aria-hidden="true" />
            <span className="intro-lens__r2" aria-hidden="true" />
            <h1 className="intro-title">AXIS27</h1>
          </div>

          <div className="intro-sub intro-rise intro-rise--d3">
            Ignis Aeternum — illuminate the infinite
          </div>

          <div className="intro-boot intro-rise intro-rise--d4">
            <div className="intro-log" role="status" aria-live="polite">
              <span className="intro-log__prompt">{'>'}</span>
              {sealedLine}
            </div>
            <div className="intro-track" aria-hidden="true">
              <span className="intro-track__fill" style={{ '--fill': stageFill }} />
            </div>
            <div className="intro-meta">
              <span>ignis aeternum</span>
              <span>monolith render // core_active</span>
            </div>
          </div>

          <button
            ref={skipBtnRef}
            type="button"
            onClick={handleSkip}
            className="intro-dismiss"
          >
            Enter site
          </button>
        </div>

        <div className="intro-bar intro-bar--foot intro-rise intro-rise--d1">
          <div className="intro-stats">
            <span><b>35+</b> events</span>
            <span><b>200+</b> colleges</span>
            <span><b>35,000+</b> participants</span>
          </div>
          <div className="intro-drop" style={{ textAlign: 'right' }}>
            central india's largest technical fest
          </div>
        </div>
      </div>
    </motion.div>
  );
}


function AppContent() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined' || location.pathname !== '/') return false;
    try {
      return window.sessionStorage.getItem('axis27-shard-intro-seen') !== '1';
    } catch {
      return true;
    }
  });
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/' && showSplash) {
      try {
        window.sessionStorage.setItem('axis27-shard-intro-seen', '1');
      } catch {
        return;
      }
    }
  }, [location.pathname, showSplash]);

  const [worldReady, setWorldReady] = useState(false);
  const handleWorldReady = useCallback(() => setWorldReady(true), []);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  /* True exactly while a lazy route chunk is in flight — RouteLoading's
   * Suspense-fallback instance reports it through its own mount/unmount, so
   * there is no router-internals plumbing here. The footer is withheld for the
   * same window: last page's footer sitting under the loader read as if the
   * next page had already arrived. */
  const [navLoading, setNavLoading] = useState(false);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            key="splash"
            onComplete={handleSplashComplete}
            worldReady={worldReady}
          />
        )}
      </AnimatePresence>

      {/* Non-home pages get a fixed living world as the page background: the
          dune sea at full night on dune pages, the cosmic field on the others
          (worldKind above). It sits outside the route-shell motion.div so the
          shell's filter/scale transforms don't make it the containing block for
          position:fixed. On the home page, HomePage renders its own sticky
          DuneSea with the scroll-driven sunrise. */}
      {location.pathname !== '/' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Suspense fallback={null}>
            {worldKind(location.pathname) === 'cosmic' ? (
              <LazyCosmicBackground
                color="#05f0e4"
                fontSize={8}
                speed={0.6}
                className="opacity-80"
              />
            ) : (
              <LazyDuneSea active={false} scrollY={1} />
            )}
          </Suspense>
        </div>
      )}

      {/* The ember seam. Its position here is the whole reason it works, so it is
          worth being explicit: it sits OUTSIDE the motion.div below, as a sibling.
          That wrapper animates `filter` and `scale`, and an ancestor with either
          one silently becomes the containing block for `position: fixed` — the
          same trap that once sized the world layer to the entire document instead
          of the viewport. Inside the wrapper this line would scroll away and blur
          on every route change.

          It is also never unmounted or re-keyed, so its 14s breathing animation
          runs continuously for the whole session rather than restarting on
          navigation. The eternal flame is eternal because nothing re-renders it.

          The home page hides it: the hero draws a real horizon at this exact
          height, and two lights on one horizon is one too many. */}
      {location.pathname !== '/' && <div className="ember-seam" aria-hidden="true" />}

      {/* Back-to-top, outside the route-shell like the seam above — same
          transform trap, same reasoning. Hidden on home, where the sunrise is
          the navigation. */}
      {location.pathname !== '/' && <BackToTop />}

      <motion.div
        initial={location.pathname === '/' && showSplash ? { opacity: 0, y: 18, scale: 0.99, filter: 'blur(14px)' } : false}
        animate={location.pathname === '/' && showSplash
          ? { opacity: 0, y: 18, scale: 0.99, filter: 'blur(14px)' }
          : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{ pointerEvents: showSplash ? 'none' : 'auto' }}
        inert={showSplash}
        className="route-shell"
      >
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Navigation />
        <RouteLoading />
        <AnimatePresence mode="wait">
          <motion.div
            id="main-content"
            key={location.pathname}
            initial={{ opacity: 0, scale: 1.01, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.995, y: -4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<RouteLoading full onActive={setNavLoading} />}>
              <Routes location={location}>
              <Route path="/" element={<HomePage ready={!showSplash} onWorldReady={handleWorldReady} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/workshops" element={<WorkshopsPage />} />
              <Route path="/sponsors" element={<SponsorsPage />} />
              <Route path="/accommodation" element={<AccommodationPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/team/:memberSlug" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Design direction proof — additive, remove once adopted */}
              <Route path="/preview-hero" element={<HeroPreviewPage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
        {!navLoading && <Footer />}
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
