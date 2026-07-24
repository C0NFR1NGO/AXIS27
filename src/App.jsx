import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import WorkshopsPage from './pages/WorkshopsPage';
import SponsorsPage from './pages/SponsorsPage';
import AccommodationPage from './pages/AccommodationPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import RouteLoading from './components/RouteLoading';
import useCursorDistortion from './hooks/useCursorDistortion';
import './styles/global.css';

function SplashScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [instability, setInstability] = useState(92);

  useEffect(() => {
    const logList = [
      "CYBERLIFE INDUSTRIES INC.  |  REG: AXIS-v2.70",
      "KERNEL INTERRUPT SIGNAL... OK [✓]",
      "INITIALIZING SPICE_MELANGE_INTERFACE...",
      "LOADING CONSTELLATION PARTICLE ENGINE (4200 NODES)...",
      "SOFTWARE INSTABILITY DETECTED  [▲ 92%]",
      "SYNCHRONIZING ARRAKIS TERRAIN MAP...",
      "KALADAN FREQUENCY LOCK: STABLE",
      "ANOMALY STATUS: COMPATIBLE  [DEVIANT? NO]",
      "DIRECTIVE // IGNIS AETERNUM // ACTIVE",
      "ILLUMINATING THE INFINITE... READY [■]",
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logList.length) {
        setLogs(prev => [...prev, logList[currentLog]]);
        currentLog++;
        if (currentLog === 5) setInstability(94);
        if (currentLog === 6) setInstability(91);
      } else {
        clearInterval(interval);
      }
    }, 210);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onComplete, 3600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(18px)' }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(210,156,56,0.08) 0%, rgba(13,10,8,0.97) 50%, var(--bg-deep) 100%)',
      }}
    >
      {/* DUNE: Cinematic spice dust field — scattered fine particles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: [
          'radial-gradient(0.8px 0.8px at 12% 18%, rgba(229,169,60,0.55), transparent)',
          'radial-gradient(0.8px 0.8px at 82% 12%, rgba(0,229,255,0.5), transparent)',
          'radial-gradient(0.8px 0.8px at 48% 72%, rgba(229,169,60,0.45), transparent)',
          'radial-gradient(0.8px 0.8px at 28% 62%, rgba(255,51,85,0.4), transparent)',
          'radial-gradient(0.6px 0.6px at 64% 28%, rgba(0,229,255,0.35), transparent)',
          'radial-gradient(0.7px 0.7px at 8% 55%, rgba(229,169,60,0.4), transparent)',
          'radial-gradient(0.9px 0.9px at 90% 78%, rgba(229,169,60,0.5), transparent)',
          'radial-gradient(0.6px 0.6px at 38% 92%, rgba(0,136,255,0.38), transparent)',
          'radial-gradient(0.7px 0.7px at 55% 8%, rgba(229,169,60,0.42), transparent)',
          'radial-gradient(0.5px 0.5px at 20% 40%, rgba(0,229,255,0.3), transparent)',
        ].join(','),
        backgroundSize: '180px 180px, 260px 260px, 320px 320px, 400px 400px, 220px 220px, 350px 350px, 280px 280px, 380px 380px, 300px 300px, 440px 440px',
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      {/* DETROIT: Cybernetic diagnostic grid (DBH HUD floor plan) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.7,
        pointerEvents: 'none',
      }} />

      {/* DETROIT: Thin corner HUD brackets */}
      {['top-left','top-right','bottom-left','bottom-right'].map(corner => (
        <div key={corner} className="nav-desktop-links" style={{
          position: 'absolute',
          ...(corner.includes('top') ? { top: '1.5rem' } : { bottom: '1.5rem' }),
          ...(corner.includes('left') ? { left: '2rem', textAlign: 'left' } : { right: '2rem', textAlign: 'right' }),
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          letterSpacing: '0.1em',
          opacity: 0.42,
          pointerEvents: 'none',
        }}>
          {corner === 'top-left' && (
            <>
              <div style={{ color: 'var(--spice-blue)' }}>CYBERLIFE BOOTLOADER v4.10</div>
              <div>KERNEL: DIRECTIVE LOADED</div>
              <div>IFACE: DUNE_MELANGE (ACTIVE)</div>
            </>
          )}
          {corner === 'top-right' && (
            <>
              <div style={{ color: 'var(--gold)' }}>LOCAL_TIME [2027.04.12]</div>
              <div>COHERENCE: SECURE [✓]</div>
              <div>CONNECTION: ENCRYPTED (TLS 1.3)</div>
            </>
          )}
          {corner === 'bottom-left' && (
            <>
              <div>BOOT REGISTRY: ACTIVE</div>
              <div>COGNITIVE SYNAPSE MAP: 98.4%</div>
              <div style={{ color: 'var(--cyber-red)' }}>
                SOFTWARE INSTABILITY: ▲ {instability}%
              </div>
            </>
          )}
          {corner === 'bottom-right' && (
            <>
              <div>PROCESSOR: STABLE [16/16]</div>
              <div>CORE THERMALS: 32.4°C (OPTIMAL)</div>
              <div style={{ color: 'var(--spice-blue)' }}>STAGE: DIRECTIVE BOOT</div>
            </>
          )}
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          padding: '6rem 1.5rem 4rem',
        }}
      >
        <div style={{ position: 'relative', width: 'min(92vw, 760px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* DUNE ECLIPSE + DBH CYBERLIFE LED TEMPLE */}
          <div style={{ position: 'relative', width: '240px', height: '240px', marginBottom: '2.5rem' }}>
            {/* Outer corona — spice aurora */}
            <motion.div
              animate={{ scale: [0.92, 1.1, 0.92], opacity: [0.45, 0.85, 0.45] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: -15,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(229,169,60,0.28) 0%, rgba(229,169,60,0.06) 50%, transparent 75%)',
                filter: 'blur(10px)',
              }}
            />
            {/* DBH CyberLife LED primary ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                border: '2px solid rgba(0,229,255,0.12)',
                borderTopColor: '#00e5ff',
                borderRightColor: 'rgba(0,229,255,0.5)',
                boxShadow: '0 0 30px rgba(0,229,255,0.25), 0 0 60px rgba(0,229,255,0.08)',
              }}
            />
            {/* DBH inner ring — counter-spin, gold spice */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: 6,
                borderRadius: '50%',
                border: '1.5px solid rgba(229,169,60,0.1)',
                borderLeftColor: 'var(--gold)',
                borderBottomColor: 'rgba(229,169,60,0.4)',
                boxShadow: '0 0 15px rgba(229,169,60,0.08)',
              }}
            />
            {/* Dune Eclipse body — dark sun */}
            <div style={{
              position: 'absolute',
              inset: 20,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #0d0805 30%, #070503 100%)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: 'inset 0 0 28px rgba(229,169,60,0.18), 0 0 40px rgba(0,0,0,0.6)',
            }}>
              {/* DBH temple LED pulsing behind logo */}
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.08, 0.95] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'var(--spice-blue)',
                  boxShadow: '0 0 16px var(--spice-blue), 0 0 32px var(--spice-blue-glow)',
                  top: '14px',
                  right: '18px',
                }}
              />
              <motion.img
                src="/images/logo-icon.png"
                alt="AXIS'27"
                initial={{ opacity: 0, scale: 0.88, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                transition={{ 
                  default: { duration: 0.7, delay: 0.2 },
                  rotate: { duration: 10, repeat: Infinity, ease: 'linear' }
                }}
                style={{
                  width: '130px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 18px rgba(0,229,255,0.5)) drop-shadow(0 0 6px rgba(229,169,60,0.3))',
                  transformOrigin: 'center center',
                }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* AXIS'27 — Cinematic Dune Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontFamily: "'Ethnocentric', sans-serif",
              fontSize: 'clamp(3.125rem, 10vw, 6.875rem)',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textIndent: '0.22em',
              background: 'linear-gradient(135deg, #fff 0%, var(--gold) 35%, var(--gold-light) 60%, var(--spice-blue) 85%, var(--cyber-blue) 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              textShadow: '0 0 60px rgba(229,169,60,0.2), 0 0 30px rgba(0,229,255,0.1)',
              animation: 'shimmer 5s ease-in-out infinite',
            }}
          >
            AXIS'27
          </motion.div>

          {/* Tagline — DBH monospace directive */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              marginTop: '0.8rem',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.0rem, 2.25vw, 1.185rem)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              borderBottom: '1px solid rgba(229,169,60,0.12)',
              paddingBottom: '0.3rem',
            }}
          >
            IGNIS AETERNUM: ILLUMINATING THE INFINITE
          </motion.div>

          {/* DBH Holographic Diagnostics Terminal */}
          <div style={{
            marginTop: '2rem',
            width: 'min(100%, 440px)',
            background: 'rgba(0, 0, 0, 0.42)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            borderLeft: '3px solid var(--spice-blue)',
            borderRadius: '2px',
            padding: '0.9rem 1.3rem',
            textAlign: 'left',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
            minHeight: '110px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              color: 'var(--spice-blue)',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              marginBottom: '0.4rem',
              borderBottom: '1px solid rgba(0,229,255,0.06)',
              paddingBottom: '0.3rem',
            }}>
              // TERMINAL: CYBERLIFE DIAGNOSTICS //
            </div>
            <AnimatePresence>
              {logs.map((log, index) => {
                if (!log) return null;
                const isWarning = log.includes("INSTABILITY");
                const isComplete = index === logs.length - 1;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{
                      color: isWarning ? 'var(--cyber-red)' : isComplete ? 'var(--spice-blue)' : 'var(--text-secondary)',
                      fontWeight: isComplete ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>&gt;</span>
                    {log}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Loading Progress Bar — Spice → CyberLife gradient */}
          <div style={{
            width: 'min(100%, 440px)',
            marginTop: '1.2rem',
          }}>
            <div style={{
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.04)',
              overflow: 'hidden',
              border: '1px solid rgba(229,169,60,0.06)',
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.0, ease: [0.65, 0, 0.35, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--gold), var(--spice-blue), var(--cyber-blue))',
                  boxShadow: '0 0 14px var(--spice-blue), 0 0 28px var(--spice-blue-glow)',
                }}
              />
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'var(--text-muted)',
              marginTop: '0.4rem',
              letterSpacing: '0.08em',
              textAlign: 'right',
            }}>
              LOADING: {Math.min(100, (logs.length / 10 * 100)).toFixed(0)}%
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined' || location.pathname !== '/') return false;
    return window.sessionStorage.getItem('axis27-home-intro-seen') !== '1';
  });
  useCursorDistortion();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/' && showSplash) {
      window.sessionStorage.setItem('axis27-home-intro-seen', '1');
    }
  }, [location.pathname, showSplash]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            key="splash"
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={location.pathname === '/' && showSplash ? { opacity: 0, y: 18, scale: 0.99, filter: 'blur(14px)' } : false}
        animate={location.pathname === '/' && showSplash 
          ? { opacity: 0, y: 18, scale: 0.99, filter: 'blur(14px)' }
          : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{ pointerEvents: showSplash ? 'none' : 'auto' }}
      >
        <Navigation />
        <RouteLoading />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 1.01, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.995, y: -4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage ready={!showSplash} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/workshops" element={<WorkshopsPage />} />
              <Route path="/sponsors" element={<SponsorsPage />} />
              <Route path="/accommodation" element={<AccommodationPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        <Footer />
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
