import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../data/content';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav className="main-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 1.5rem',
          borderRadius: '4px', /* Crisp square corner DBH layout */
          background: scrolled
            ? 'linear-gradient(135deg, rgba(229,169,60,0.05) 0%, rgba(13,10,8,0.85) 50%, rgba(0,229,255,0.03) 100%)'
            : 'linear-gradient(135deg, rgba(229,169,60,0.08) 0%, rgba(13,10,8,0.6) 50%, rgba(0,229,255,0.04) 100%)',
          border: scrolled ? '1px solid rgba(0,229,255,0.22)' : '1px solid rgba(229,169,60,0.18)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.5), 0 0 15px rgba(0,229,255,0.1)'
            : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'background 0.4s, box-shadow 0.4s, border-color 0.4s',
        }}
      >
        <Link to="/" className="nav-logo-link" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'absolute', left: '1.5rem', gap: '0.5rem', zIndex: 10 }}>
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/logo.png" />
            <img
              src="/images/logo-icon.png"
              alt="AXIS'27"
              className="nav-logo"
              style={{ filter: 'brightness(1.5)' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </picture>
          
          {/* DBH Android Temple LED next to the logo */}
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.15, 0.95] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--spice-blue)',
              boxShadow: '0 0 8px var(--spice-blue)',
              marginLeft: '0.4rem',
            }}
            className="nav-desktop-links"
          />
        </Link>

        {/* Desktop Nav Items with [01] monospace indices */}
        <div className="nav-desktop-links" style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.href;
            const indexStr = String(i + 1).padStart(2, '0');
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
                  color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '2px',
                  background: isActive ? 'rgba(210,156,56,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(210,156,56,0.25)' : '1px solid transparent',
                  transition: 'all 0.3s',
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
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.6 }}>[{indexStr}]</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          style={{
            display: 'none',
            position: 'absolute', right: '1.5rem',
            background: 'none', border: 'none', cursor: 'pointer',
            width: '44px', height: '44px',
            flexDirection: 'column', alignItems: 'center', justifyContainer: 'center',
            padding: 0,
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text-muted)', borderRadius: '999px', transition: 'all 0.3s', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'translateY(0) rotate(0)' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', marginTop: '4px', background: 'var(--text-muted)', borderRadius: '999px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', marginTop: '4px', background: 'var(--text-muted)', borderRadius: '999px', transition: 'all 0.3s', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'translateY(0) rotate(0)' }} />
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
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: 'calc(var(--nav-height) + 2rem) 1rem 1rem',
            }}
          >
            <motion.div
              initial={{ y: 15, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 15, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(100%, 420px)',
                borderRadius: '4px',
                border: '1px solid rgba(229,169,60,0.2)',
                background: 'linear-gradient(180deg, rgba(13,10,8,0.96), rgba(7,5,3,0.99))',
                boxShadow: '0 12px 40px rgba(0,0,0,0.65), 0 0 25px rgba(229,169,60,0.06)',
                padding: '1.2rem',
                overflow: 'hidden',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 0.25rem 0.9rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '1rem',
              }}>
                <div style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: '0.8rem',
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
                  color: 'var(--spice-blue)',
                }}>
                  INSTABILITY: [▲ 94%]
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.href;
                  const indexStr = String(i + 1).padStart(2, '0');
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
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
                          color: isActive ? 'var(--spice-blue)' : 'rgba(220,214,202,0.9)',
                          textDecoration: 'none',
                          padding: '0.85rem 1rem',
                          borderRadius: '2px',
                          border: isActive ? '1px solid rgba(0,229,255,0.35)' : '1px solid rgba(255,255,255,0.04)',
                          background: isActive ? 'rgba(0,229,255,0.08)' : 'rgba(255,255,255,0.02)',
                          boxShadow: isActive ? '0 0 15px rgba(0,229,255,0.1)' : 'none',
                          transition: 'all 0.25s ease',
                          alignItems: 'center',
                          gap: '0.6rem',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                            e.currentTarget.style.color = 'rgba(220,214,202,0.9)';
                          }
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', opacity: 0.5 }}>[{indexStr}]</span>
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
