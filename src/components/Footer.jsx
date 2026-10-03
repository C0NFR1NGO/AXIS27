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
        borderTop: '1px solid var(--line-quiet)',
        padding: '3rem 5% 2rem',
        textAlign: 'center',
        background: 'var(--ground)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      {/* DBH status bar */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-dim)',
        letterSpacing: '0.15em',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '2rem',
        opacity: 0.5,
      }}>
        <span>DIRECTIVE: IGNIS AETERNUM</span>
      </div>

      {/* Divider below status bar */}
      <div style={{
        height: '1px',
        margin: '0 auto 2rem',
        maxWidth: '480px',
        background: 'var(--line-quiet)',
      }} />

      <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="/images/logo.png"
            alt="AXIS'27"
            loading="lazy"
            style={{ height: '80px', width: 'auto', objectFit: 'contain', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </Link>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginTop: '0.8rem',
        }}>
          IGNIS AETERNUM: ILLUMINATING THE INFINITE
        </div>
      </div>

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
            className="footer-social"
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--line-quiet)',
              borderRadius: '50%',
              color: 'var(--text-dim)',
              textDecoration: 'none',
              transition: 'all 0.3s var(--ease-cyber)',
              background: 'transparent',
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
            background: 'var(--line-quiet)',
          }} />
          &copy; {new Date().getFullYear()} AXIS, VNIT Nagpur. All Rights Reserved.
        </p>
      </div>
    </motion.footer>
  );
}