import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import WorkshopsPage from './pages/WorkshopsPage';
import SponsorsPage from './pages/SponsorsPage';
import AccommodationPage from './pages/AccommodationPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import useCursorDistortion from './hooks/useCursorDistortion';
import './styles/global.css';

function SplashScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const logList = [
      "// DETROIT CYBERLIFE INC. REG 846-92",
      "// SYSTEM INTERRUPT SIGNAL: OK [✓]",
      "// INITIALIZING COGNITIVE INTERFACE...",
      "// LOADING SPICE DRIFT PARTICLE ENGINE...",
      "// DETECTING SOFTWARE INSTABILITY [▲ 92%]",
      "// SYNCHRONIZING CORE CONSTELLATION MAP...",
      "// ANOMALY STATUS: COMPATIBLE",
      "// INITIATING DIRECTIVE: IGNIS AETERNUM",
      "// ILLUMINATING THE INFINITE... READY"
    ];
    
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logList.length) {
        const logToAppend = logList[currentLog];
        setLogs(prev => [...prev, logToAppend]);
        currentLog++;
      } else {
        clearInterval(interval);
      }
    }, 230);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onComplete, 3300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(15px)' }}
      transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, rgba(210,156,56,0.12) 0%, rgba(13,10,8,0.98) 45%, var(--bg-deep) 100%)',
      }}
    >
      {/* Cinematic Sand/Dust particles background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: [
          'radial-gradient(circle at 15% 25%, rgba(229,169,60,0.4) 0 1px, transparent 1.5px)',
          'radial-gradient(circle at 75% 15%, rgba(0,229,255,0.4) 0 1px, transparent 1.5px)',
          'radial-gradient(circle at 50% 80%, rgba(229,169,60,0.3) 0 1px, transparent 1.5px)',
          'radial-gradient(circle at 30% 70%, rgba(255,51,85,0.35) 0 1px, transparent 1.5px)',
        ].join(','),
        backgroundSize: '200px 200px, 300px 300px, 400px 400px, 500px 500px',
        opacity: 0.25,
      }} />

      {/* Background Cyber Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.85,
        pointerEvents: 'none',
      }} />

      {/* Detroit Corner Telemetry - Top-Left */}
      <div className="nav-desktop-links" style={{
        position: 'absolute',
        top: '2.5rem',
        left: '3rem',
        textAlign: 'left',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        letterSpacing: '0.08em',
        opacity: 0.5,
        pointerEvents: 'none',
      }}>
        <div>[ CYBERLIFE BOOTLOADER v4.10 ]</div>
        <div>KERNEL DIRECTIVE LOADED: 100%</div>
        <div>DUNE_MELANGE_INTERFACE: ACTIVE</div>
      </div>

      {/* Detroit Corner Telemetry - Top-Right */}
      <div className="nav-desktop-links" style={{
        position: 'absolute',
        top: '2.5rem',
        right: '3rem',
        textAlign: 'right',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        letterSpacing: '0.08em',
        opacity: 0.5,
        pointerEvents: 'none',
      }}>
        <div>LOCAL_TIME: [2027.04.12]</div>
        <div>COHERENCE LEVEL: SECURE [✓]</div>
        <div>CONNECTION STATE: ENCRYPTED</div>
      </div>

      {/* Detroit Corner Telemetry - Bottom-Left */}
      <div className="nav-desktop-links" style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '3rem',
        textAlign: 'left',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        letterSpacing: '0.08em',
        opacity: 0.5,
        pointerEvents: 'none',
      }}>
        <div>BOOT REGISTRY STATUS: ACTIVE</div>
        <div>COGNITIVE SYNAPSE MAP: 98.4%</div>
        <div>SOFTWARE INSTABILITY: [▲ 92%]</div>
      </div>

      {/* Detroit Corner Telemetry - Bottom-Right */}
      <div className="nav-desktop-links" style={{
        position: 'absolute',
        bottom: '2.5rem',
        right: '3rem',
        textAlign: 'right',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.62rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        letterSpacing: '0.08em',
        opacity: 0.5,
        pointerEvents: 'none',
      }}>
        <div>PROCESSOR STATE: STABLE [16/16]</div>
        <div>CORE THERMALS: 32.4°C (OPTIMAL)</div>
        <div>STAGE SYSTEM: DIRECTIVE BOOT</div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
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
          
          {/* Main Decorative Center Container (Dune Eclipse + DBH LED temple Ring) */}
          <div style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '2.5rem' }}>
            
            {/* Dune Eclipse: Outer Corona Glow */}
            <motion.div
              animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(229,169,60,0.25) 0%, rgba(229,169,60,0.08) 40%, transparent 70%)',
                filter: 'blur(6px)',
              }}
            />
            
            {/* DBH CyberLife LED Ring (Spins) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(0,229,255,0.15)',
                borderTopColor: '#00e5ff',
                borderRightColor: 'rgba(0,229,255,0.45)',
                boxShadow: '0 0 25px rgba(0,229,255,0.3)',
              }}
            />

            {/* DBH Soft Inner ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '50%',
                border: '1px solid rgba(229,169,60,0.12)',
                borderLeftColor: '#d29c38',
                borderBottomColor: 'rgba(229,169,60,0.35)',
              }}
            />
            
            {/* Dark Sun Eclipse body */}
            <div style={{
              position: 'absolute',
              inset: '20px',
              borderRadius: '50%',
              background: '#070503',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: 'inset 0 0 20px rgba(229,169,60,0.15)',
            }}>
               <motion.img
                src="/images/logo-icon.png"
                alt="AXIS'27"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  width: '130px',
                  height: 'auto',
                  filter: 'drop-shadow(0 0 15px rgba(0,229,255,0.45))',
                }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* AXIS'27 Cinematic Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontFamily: "'Ethnocentric', sans-serif",
              fontSize: 'clamp(3.125rem, 10vw, 6.875rem)',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textIndent: '0.22em',
              background: 'linear-gradient(135deg, #fff 0%, var(--gold) 45%, var(--gold-light) 70%, var(--spice-blue) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              textShadow: '0 0 40px rgba(229,169,60,0.15)',
            }}
          >
            AXIS'27
          </motion.div>

          {/* Overhauled Tagline */}
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
            }}
          >
            IGNIS AETERNUM: ILLUMINATING THE INFINITE
          </motion.div>

          {/* DBH Holographic Loading Diagnostics Block */}
          <div style={{
            marginTop: '2rem',
            width: 'min(100%, 420px)',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(0, 229, 255, 0.08)',
            borderLeft: '3px solid var(--spice-blue)',
            padding: '0.8rem 1.2rem',
            textAlign: 'left',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            minHeight: '100px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          }}>
            <AnimatePresence>
              {logs.map((log, index) => {
                const isWarning = log.includes("INSTABILITY");
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ 
                      color: isWarning ? 'var(--cyber-red)' : index === logs.length - 1 ? 'var(--spice-blue)' : 'var(--text-secondary)',
                      fontWeight: index === logs.length - 1 ? 600 : 400
                    }}
                  >
                    {log}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Loading Progress Bar */}
          <div style={{
            width: 'min(100%, 420px)',
            marginTop: '1.2rem',
          }}>
            <div style={{
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.05)',
              overflow: 'hidden',
              border: '1px solid rgba(229,169,60,0.08)',
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.8, ease: [0.65, 0, 0.35, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--gold), var(--spice-blue))',
                  boxShadow: '0 0 10px var(--spice-blue)',
                }}
              />
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
    if (typeof window === 'undefined' || location.pathname !== '/') {
      return false;
    }

    return window.sessionStorage.getItem('axis27-home-intro-seen') !== '1';
  });
  const [homeRevealReady, setHomeRevealReady] = useState(false);
  useCursorDistortion();

  // Reset scroll to top on path changes and prevent default browser scroll restoration
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

  useEffect(() => {
    if (location.pathname !== '/') {
      setHomeRevealReady(false);
      return;
    }

    if (showSplash) {
      setHomeRevealReady(false);
      return;
    }

    const timer = setTimeout(() => setHomeRevealReady(true), 120);
    return () => clearTimeout(timer);
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
        initial={location.pathname === '/' ? { opacity: 0, y: 14, scale: 0.992, filter: 'blur(12px)' } : false}
        animate={location.pathname === '/' ? (homeRevealReady ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: 14, scale: 0.992, filter: 'blur(12px)' }) : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: showSplash ? 'none' : 'auto' }}
      >
        <Navigation />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 1.01, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.995, y: -4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 26, scale: 0.99, filter: 'blur(14px)' }}
                    animate={homeRevealReady ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: 26, scale: 0.99, filter: 'blur(14px)' }}
                    transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <HomePage ready={homeRevealReady} />
                  </motion.div>
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/workshops" element={<WorkshopsPage />} />
              <Route path="/sponsors" element={<SponsorsPage />} />
              <Route path="/accommodation" element={<AccommodationPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
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
