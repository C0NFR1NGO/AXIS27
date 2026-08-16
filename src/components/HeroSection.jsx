import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { socialLinks } from '../data/content';
import socialIcons from './SocialIcons';

export default function HeroSection({ ready = true }) {
  return (
    <section id="hero" style={{
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
    }}>
      {/* DETROIT: Left holographic HUD panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="nav-desktop-links"
        style={{
          position: 'absolute',
          left: '3rem',
          bottom: '5rem',
          textAlign: 'left',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          borderLeft: '2px solid var(--spice-blue)',
          paddingLeft: '1rem',
          lineHeight: 1.6,
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <div style={{ color: 'var(--spice-blue)', fontWeight: 700, marginBottom: '0.2rem', animation: 'hud-glow-cyan 3s ease-in-out infinite' }}>
          // CYBERLIFE DIRECTIVE
        </div>
        <div>MODEL: AXIS-V270-X1</div>
        <div>
          SOFTWARE INSTABILITY:{' '}
          <motion.span
            style={{ color: 'var(--cyber-red)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            [▲ 94%]
          </motion.span>
        </div>
        <div>STATUS: COMPATIBLE</div>
      </motion.div>

      {/* DETROIT: Right holographic HUD panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="nav-desktop-links"
        style={{
          position: 'absolute',
          right: '3rem',
          bottom: '5rem',
          textAlign: 'right',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          borderRight: '2px solid var(--gold)',
          paddingRight: '1rem',
          lineHeight: 1.6,
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '0.2rem', animation: 'hud-glow-gold 3s ease-in-out infinite' }}>
          // INFINITE LIGHT
        </div>
        <div>TARGET: VNIT NAGPUR</div>
        <div>GPS: 21.1255° N / 79.0505° E</div>
        <div>KALADAN LINK: STABLE</div>
        <div>ENCRYPTION: SHA-256 [SECURE]</div>
      </motion.div>

      {/* AXIS'27 — Dune title with spice shimmer */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(600px, 80vw)',
          height: 'min(400px, 60vw)',
          background: 'radial-gradient(circle, rgba(201,145,26,0.08), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 35 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'Ethnocentric', sans-serif",
          fontSize: 'clamp(3.5rem, 12.5vw, 9.375rem)',
          fontWeight: 900,
          letterSpacing: '0.2em',
          textIndent: '0.2em',
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 25%, var(--spice-blue) 55%, var(--cyber-blue) 75%, var(--gold) 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 80px rgba(201,145,26,0.15), 0 0 120px rgba(0,229,255,0.08), 0 0 60px var(--gold-glow), 0 0 35px var(--spice-blue-glow)',
          marginBottom: '0.4rem',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 3,
          animation: 'shimmer 4s ease-in-out infinite',
        }}
      >
        AXIS'27
      </motion.h1>

      {/* DUNE: Spice-drift tagline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 'clamp(1.25rem, 3.125vw, 1.81rem)',
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          background: 'linear-gradient(90deg, var(--gold), var(--gold-light) 40%, var(--spice-blue) 70%, var(--gold) 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.2rem',
          position: 'relative',
          zIndex: 3,
          animation: 'shimmer 4s linear infinite',
        }}
      >
        ILLUMINATING THE INFINITE
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
        <span style={{
          color: 'var(--gold)',
          letterSpacing: '0.22em',
          textShadow: '0 0 18px var(--gold-glow)',
          fontWeight: 700,
        }}>
          DATES COMING SOON
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Link
          to="/events"
          className="btn-primary"
          style={{
            padding: 'clamp(0.85rem, 1.2vw, 1.1rem) clamp(2.8rem, 4vw, 3.8rem)',
            fontSize: 'clamp(0.85rem, 1vw, 1rem)',
          }}
        >
          Explore Events
        </Link>
        <a
          href="#about"
          className="btn-secondary"
          style={{
            padding: 'clamp(0.85rem, 1.2vw, 1.1rem) clamp(2.8rem, 4vw, 3.8rem)',
            fontSize: 'clamp(0.85rem, 1vw, 1rem)',
          }}
        >
          Learn More
        </a>
      </motion.div>

      {/* Social icons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginTop: '3rem',
          display: 'flex',
          gap: '1.2rem',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {Object.entries(socialLinks).map(([platform, url]) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            {socialIcons[platform]}
          </a>
        ))}
      </motion.div>
    </section>
  );
}