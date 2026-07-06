import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const heroStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  padding: '6.5rem 5% 2rem',
  textAlign: 'center',
  overflow: 'hidden',
};

export default function HeroSection({ ready = true }) {
  return (
    <section id="hero" style={heroStyle}>
      {/* DBH Holographic Left Panel (hidden on mobile) */}
      <div style={{
        position: 'absolute',
        left: '3rem',
        bottom: '5rem',
        textAlign: 'left',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderLeft: '2px solid var(--spice-blue)',
        paddingLeft: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.08em',
        pointerEvents: 'none',
        zIndex: 2,
      }} className="nav-desktop-links">
        <div style={{ color: 'var(--spice-blue)', fontWeight: 700, marginBottom: '0.2rem' }}>// CYBERLIFE DIRECTIVE</div>
        <div>MODEL: AXIS-v2.70</div>
        <div>SOFTWARE INSTABILITY: <span style={{ color: 'var(--cyber-red)' }}>[▲ 94%]</span></div>
        <div>STATUS: COMPATIBLE</div>
        <div>LED SYSTEM: PULSING [●]</div>
      </div>

      {/* DBH Holographic Right Panel (hidden on mobile) */}
      <div style={{
        position: 'absolute',
        right: '3rem',
        bottom: '5rem',
        textAlign: 'right',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        borderRight: '2px solid var(--gold)',
        paddingRight: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.08em',
        pointerEvents: 'none',
        zIndex: 2,
      }} className="nav-desktop-links">
        <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '0.2rem' }}>// INFINITE LIGHT</div>
        <div>TARGET: NAGPUR (VNIT)</div>
        <div>GPS: 21.1255° N, 79.0505° E</div>
        <div>STATUS: OPERATIONAL</div>
        <div>SECURITY: SHA-256 [SECURE]</div>
      </div>

      {/* Pulsing Android LED temple indicator overlay (top right) */}
      <div style={{
        position: 'absolute',
        top: '2.5rem',
        right: '3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: 'var(--spice-blue)',
        zIndex: 2,
      }} className="nav-desktop-links">
        <span>SOFTWARE INSTABILITY: ▲ 94%</span>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--spice-blue)',
            boxShadow: '0 0 10px var(--spice-blue)',
          }}
        />
      </div>


      <motion.h1
        initial={{ opacity: 0, y: 35 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
        transition={{ duration: 1.1, delay: 0.1, ease: 'easeOut' }}
        style={{
          fontFamily: "'Ethnocentric', sans-serif",
          fontSize: 'clamp(3.5rem, 12.5vw, 9.375rem)',
          fontWeight: 900,
          letterSpacing: '0.2em',
          textIndent: '0.2em',
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 40%, #fff 60%, var(--spice-blue) 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 50px var(--gold-glow), 0 0 30px var(--spice-blue-glow)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
          animation: 'shimmer 5s ease-in-out infinite',
        }}
      >
        AXIS'27
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.95, delay: 0.28, ease: 'easeOut' }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 'clamp(1.25rem, 3.125vw, 1.81rem)',
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          background: 'linear-gradient(90deg, var(--gold), #fff 50%, var(--spice-blue))',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.2rem',
          position: 'relative',
          zIndex: 1,
          animation: 'shimmer 4s linear infinite',
        }}
      >
        ILLUMINATING THE INFINITE
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.95, delay: 0.48, ease: 'easeOut' }}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)',
          letterSpacing: '0.12em',
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          lineHeight: 1.8,
        }}
      >
        <span>VISVESVARAYA NATIONAL INSTITUTE OF TECHNOLOGY, NAGPUR</span>
        <br />
        <span style={{ color: 'var(--gold)', letterSpacing: '0.22em', textShadow: '0 0 15px var(--gold-glow)', fontWeight: 700 }}>APRIL 2027</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.95, delay: 0.65, ease: 'easeOut' }}
        style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Link
          to="/events"
          className="btn-primary"
          style={{
            padding: '0.85rem 2.8rem',
            fontFamily: "var(--font-heading)",
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            background: 'transparent',
            cursor: 'pointer',
            textDecoration: 'none',
            borderRadius: '2px',
            boxShadow: '0 0 15px rgba(229,169,60,0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--gold)';
            e.target.style.color = '#050403';
            e.target.style.boxShadow = '0 0 35px var(--gold)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--gold)';
            e.target.style.boxShadow = '0 0 15px rgba(229,169,60,0.15)';
          }}
        >
          Explore Events
        </Link>
        <a
          href="#about"
          className="btn-secondary"
          style={{
            padding: '0.85rem 2.8rem',
            fontFamily: "var(--font-heading)",
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: '1px solid var(--spice-blue)',
            color: 'var(--spice-blue)',
            background: 'transparent',
            cursor: 'pointer',
            textDecoration: 'none',
            borderRadius: '2px',
            boxShadow: '0 0 15px rgba(0,229,255,0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--spice-blue)';
            e.target.style.color = '#050403';
            e.target.style.boxShadow = '0 0 35px var(--spice-blue)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--spice-blue)';
            e.target.style.boxShadow = '0 0 15px rgba(0,229,255,0.15)';
          }}
        >
          Learn More
        </a>
      </motion.div>
    </section>
  );
}
