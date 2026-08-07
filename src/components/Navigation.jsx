import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../data/content';

function LoginButton({ isMobile = false, onMobileClick }) {
  const baseStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: isMobile ? '0.95rem' : '0.68rem',
    fontWeight: 700,
    letterSpacing: isMobile ? '0.1em' : '0.12em',
    textTransform: 'uppercase',
    color: 'var(--spice-blue)',
    textDecoration: 'none',
    borderRadius: '2px',
    border: '1px solid rgba(0,229,255,0.5)',
    background: 'rgba(0,229,255,0.14)',
    boxShadow: '0 0 12px rgba(0,229,255,0.12)',
    transition: 'all 0.3s var(--ease-cyber)',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem',
  };

  const mobileStyle = {
    ...baseStyle,
    padding: '0.85rem 1rem',
    marginTop: '0.5rem',
    fontFamily: "var(--font-heading)",
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    border: '1px solid rgba(0,229,255,0.55)',
    background: 'rgba(0,229,255,0.14)',
    boxShadow: '0 0 18px rgba(0,229,255,0.15)',
    width: '100%',
  };

  const desktopStyle = {
    ...baseStyle,
    padding: '0.5rem 1rem',
    border: '1px solid rgba(0,229,255,0.5)',
    background: 'rgba(0,229,255,0.14)',
    marginLeft: '1rem',
  };

  const hoverStyle = isMobile
    ? { background: 'rgba(0,229,255,0.25)', boxShadow: '0 0 24px rgba(0,229,255,0.25)' }
    : { background: 'rgba(0,229,255,0.25)', boxShadow: '0 0 16px rgba(0,229,255,0.25)' };

  const leaveStyle = isMobile
    ? { background: 'rgba(0,229,255,0.14)', boxShadow: '0 0 18px rgba(0,229,255,0.15)' }
    : { background: 'rgba(0,229,255,0.14)', boxShadow: '0 0 12px rgba(0,229,255,0.12)' };

  return (
    <Link
      to="/login"
      onClick={onMobileClick}
      style={isMobile ? mobileStyle : desktopStyle}
      onMouseEnter={(e) => { e.currentTarget.style.background = hoverStyle.background; e.currentTarget.style.boxShadow = hoverStyle.boxShadow; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = leaveStyle.background; e.currentTarget.style.boxShadow = leaveStyle.boxShadow; }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: isMobile ? '0.72rem' : '0.6rem',
        opacity: 0.9,
        color: 'var(--spice-blue)',
        textShadow: '0 0 8px rgba(0,229,255,0.6)',
      }}>
        [SIGNUP/LOGIN]
      </span>
    </Link>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [instability, setInstability] = useState(94);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setInstability(88 + Math.floor(Math.random() * 13));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav className="main-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderRadius: '2px',
          background: scrolled
            ? 'linear-gradient(135deg, rgba(229,169,60,0.04) 0%, rgba(13,10,8,0.92) 50%, rgba(0,229,255,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(229,169,60,0.06) 0%, rgba(13,10,8,0.65) 50%, rgba(0,229,255,0.03) 100%)',
          border: scrolled
            ? '1px solid rgba(0,229,255,0.18)'
            : '1px solid rgba(229,169,60,0.14)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.6), 0 0 18px rgba(0,229,255,0.08)'
            : '0 4px 20px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(14px)',
          transition: 'background 0.4s, box-shadow 0.4s, border-color 0.4s',
        }}
      >
        {/* Top-edge cyan LED strip */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--spice-blue), transparent)',
            pointerEvents: 'none',
          }}
        />
        {/* Logo + DBH temple LED */}
        <Link
          to="/"
          className="nav-logo-link"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            gap: '0.5rem',
            zIndex: 10,
          }}
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/logo.png" />
            <img
              src="/images/logo-icon.webp"
              alt="AXIS'27"
              className="nav-logo"
              style={{ filter: 'brightness(1.7) drop-shadow(0 0 6px rgba(0,229,255,0.25))' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </picture>
        </Link>

        {/* Desktop Nav — DBH monospace indices */}
        <div className="nav-desktop-links" style={{ display: 'flex', gap: '0.2rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--gold)' : '#fff',
                  textDecoration: 'none',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '2px',
                  background: isActive ? 'rgba(210,156,56,0.1)' : 'transparent',
                  border: isActive
                    ? '1px solid rgba(210,156,56,0.22)'
                    : '1px solid transparent',
                  transition: 'all 0.3s var(--ease-cyber)',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--gold)';
                    e.currentTarget.style.background = 'rgba(210,156,56,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(210,156,56,0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  opacity: 0.5,
                  color: 'var(--spice-blue)',
                  textShadow: '0 0 6px rgba(0,229,255,0.3)',
                }}>
                  [{String(i + 1).padStart(2, '0')}]
                </span>
                {link.label}
              </Link>
            );
          })}

          {/* DBH instability indicator */}
          <motion.span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              color: 'var(--cyber-red)',
              marginLeft: '0.8rem',
              opacity: 0.65,
              whiteSpace: 'nowrap',
            }}
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ▲ {instability}%
          </motion.span>
        </div>

        {/* Desktop Login Button - Right aligned */}
        <div className="nav-desktop-login">
          <LoginButton isMobile={false} />
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          style={{
            display: 'none',
            position: 'absolute',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '44px',
            height: '44px',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              background: '#fff',
              borderRadius: '999px',
              transformOrigin: 'center',
            }}
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              marginTop: '4px',
              background: '#fff',
              borderRadius: '999px',
              transformOrigin: 'center',
            }}
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              marginTop: '4px',
              background: '#fff',
              borderRadius: '999px',
              transformOrigin: 'center',
            }}
          />
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 3000,
              background: 'rgba(7,5,3,0.97)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: 'calc(var(--nav-height) + 2.5rem) 1rem 1rem',
            }}
          >
            <motion.div
              initial={{ y: 15, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 15, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(100%, 420px)',
                borderRadius: '2px',
                border: '1px solid rgba(229,169,60,0.18)',
                background: 'linear-gradient(180deg, rgba(13,10,8,0.97), rgba(7,5,3,0.99))',
                boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 28px rgba(229,169,60,0.04)',
                padding: '1.2rem',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Drawer top-edge cyan line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--spice-blue), transparent)',
              }} />

              {/* DBH header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 0.25rem 0.9rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '1rem',
              }}>
                <div style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: '0.78rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                }}>
                  // SYSTEM MENU
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--cyber-red)',
                }}>
                  INSTABILITY: ▲ {instability}%
                </div>
              </div>

              {/* Login Button at very top of drawer */}
              <LoginButton isMobile={true} onMobileClick={() => setMenuOpen(false)} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'flex',
                          fontFamily: "var(--font-heading)",
                          fontSize: '0.95rem',
                          fontWeight: isActive ? 700 : 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: isActive ? 'var(--spice-blue)' : '#fff',
                          textDecoration: 'none',
                          padding: '0.85rem 1rem',
                          borderRadius: '2px',
                          border: isActive
                            ? '1px solid rgba(0,229,255,0.3)'
                            : '1px solid rgba(255,255,255,0.04)',
                          background: isActive
                            ? 'rgba(0,229,255,0.08)'
                            : 'rgba(255,255,255,0.02)',
                          boxShadow: isActive
                            ? '0 0 18px rgba(0,229,255,0.08)'
                            : 'none',
                          transition: 'all 0.3s var(--ease-cyber)',
                          alignItems: 'center',
                          gap: '0.6rem',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.color = '#fff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.color = '#fff';
                          }
                        }}
                      >
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          opacity: 0.45,
                          color: 'var(--spice-blue)',
                          textShadow: '0 0 6px rgba(0,229,255,0.3)',
                        }}>
                          [{String(i + 1).padStart(2, '0')}]
                        </span>
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* DBH footer telemetry in drawer */}
              <div style={{
                marginTop: '1.2rem',
                paddingTop: '0.8rem',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: '#ccc',
                letterSpacing: '0.1em',
                lineHeight: 1.6,
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <div>CYBERLIFE: ACTIVE</div>
                <div style={{ color: 'var(--cyber-red)' }}>▲ {instability}%</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
