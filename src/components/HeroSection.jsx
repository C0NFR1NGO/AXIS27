import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { socialLinks } from '../data/content';

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

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
        <div style={{ color: 'var(--spice-blue)', fontWeight: 700, marginBottom: '0.2rem' }}>// CYBERLIFE DIRECTIVE</div>
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
        <div>
          TEMPLE LED:{' '}
          <motion.span
            style={{ color: 'var(--spice-blue)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            PULSING [●]
          </motion.span>
        </div>
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
        <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '0.2rem' }}>// INFINITE LIGHT</div>
        <div>TARGET: VNIT NAGPUR</div>
        <div>GPS: 21.1255° N / 79.0505° E</div>
        <div>KALADAN LINK: STABLE</div>
        <div>ENCRYPTION: SHA-256 [SECURE]</div>
      </motion.div>

      {/* DBH instability indicator top-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="nav-desktop-links"
        style={{
          position: 'absolute',
          top: '2.5rem',
          right: '3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--spice-blue)',
          zIndex: 2,
        }}
      >
        <span>SOFTWARE INSTABILITY: ▲ 94%</span>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: 'var(--spice-blue)',
            boxShadow: '0 0 12px var(--spice-blue), 0 0 24px var(--spice-blue-glow)',
          }}
        />
      </motion.div>

      {/* AXIS'27 — Dune title with spice shimmer */}
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
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 35%, var(--spice-blue) 65%, var(--cyber-blue) 85%, var(--gold) 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 60px var(--gold-glow), 0 0 35px var(--spice-blue-glow)',
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