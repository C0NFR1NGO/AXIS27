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

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(229,169,60,0.12)',
        padding: '3rem 5% 2rem',
        textAlign: 'center',
        background: 'linear-gradient(0deg, rgba(7,5,3,0.98) 0%, rgba(13,10,8,0.92) 60%, transparent 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* DBH status bar */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.15em',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '2rem',
        opacity: 0.5,
      }}>
        <span style={{ color: 'var(--spice-blue)' }}>CYBERLIFE: ACTIVE</span>
        <span>
          SOFTWARE INSTABILITY:{' '}
          <motion.span
            style={{ color: 'var(--cyber-red)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            ▲ 94%
          </motion.span>
        </span>
        <motion.span
          style={{ color: 'var(--gold)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          DIRECTIVE: IGNIS AETERNUM
        </motion.span>
      </div>

      {/* Gradient divider below status bar */}
      <div style={{
        height: '1px',
        margin: '0 auto 2rem',
        maxWidth: '480px',
        background: 'linear-gradient(90deg, transparent, var(--gold) 20%, var(--spice-blue) 50%, var(--gold) 80%, transparent)',
        opacity: 0.15,
      }} />

      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ display: 'inline-block' }}>
          <img
            src="/images/logo.png"
            alt="AXIS'27"
            style={{ height: '60px', width: 'auto', objectFit: 'contain', marginBottom: '1rem' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </Link>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: '1.4rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-light), var(--spice-blue))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
          textShadow: '0 0 24px rgba(201,145,26,0.3), 0 0 48px rgba(0,229,255,0.1)',
        }}>
          AXIS'27
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          IGNIS AETERNUM: ILLUMINATING THE INFINITE
        </div>
      </div>

      {/* DBH temple LED pulsing above socials */}
      <div className="led-dot led-dot--ring" style={{ margin: '0 auto 1.2rem' }} />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {Object.entries(socialLinks).map(([platform, url]) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(229,169,60,0.18)',
              borderRadius: '50%',
              color: 'var(--gold)',
              textDecoration: 'none',
              transition: 'all 0.3s var(--ease-cyber)',
              background: 'rgba(229,169,60,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.color = 'var(--bg-deep)';
              e.currentTarget.style.borderColor = 'var(--gold-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(229,169,60,0.04)';
              e.currentTarget.style.color = 'var(--gold)';
              e.currentTarget.style.borderColor = 'rgba(229,169,60,0.18)';
            }}
          >
            {socialIcons[platform]}
          </a>
        ))}
      </div>

      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
        lineHeight: 2,
      }}>
        <p>VISVESVARAYA NATIONAL INSTITUTE OF TECHNOLOGY, NAGPUR</p>
        <p>AXIS Office, Student Activity Centre, VNIT, South Ambazari Road, Nagpur - 440010</p>
        <p style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          position: 'relative',
          opacity: 0.45,
        }}>
          <span style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--gold) 20%, var(--spice-blue) 50%, var(--gold) 80%, transparent)',
            opacity: 0.3,
          }} />
          &copy; {new Date().getFullYear()} AXIS, VNIT Nagpur. All Rights Reserved.
        </p>
      </div>
    </motion.footer>
  );
}