import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { socialLinks } from '../data/content';
import socialIcons from './SocialIcons';

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
        backdropFilter: 'blur(4px)',
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
            loading="lazy"
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