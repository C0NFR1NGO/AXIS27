import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { aboutText } from '../data/content';
import TypewriterText from '../components/TypewriterText';

const milestones = [
  { year: '2001', event: 'Founded as Odyssey — VNIT\'s first tech fest' },
  { year: '2005', event: 'Rebranded to AXIS; expanded to national scale' },
  { year: '2010', event: 'Crossed 10,000 annual footfall' },
  { year: '2015', event: 'Featured NDRF & DRDO exhibitions' },
  { year: '2020', event: 'Pioneered hybrid format during the pandemic' },
  { year: '2025', event: 'Record 35,000+ participants from 200+ colleges' },
  { year: '2027', event: 'AXIS\'27 — Ignis Aeternum: Illuminating the Infinite' },
  { year: 'Past Guests', event: 'Information coming soon', placeholder: true },
  { year: 'Past Artists', event: 'Information coming soon', placeholder: true },
];

const windows = [
  { id: 'about', label: 'About' },
  { id: 'history', label: 'History' },
  { id: 'gallery', label: 'Gallery' },
];

function TimelineSection() {
  const timelineRef = useRef(null);

  const scroll = (dir) => {
    const el = timelineRef.current;
    if (!el) return;
    const start = el.scrollLeft;
    const target = start + dir * el.clientWidth;
    const duration = 500;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.scrollLeft = start + (target - start) * ease;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => scroll(-1)} style={{
        position: 'absolute', left: '-3.5rem', zIndex: 2,
        width: '40px', height: '40px', borderRadius: '50%',
        border: '1px solid rgba(0,229,255,0.2)',
        background: 'rgba(13,10,8,0.8)',
        backdropFilter: 'blur(8px)',
        color: 'var(--spice-blue)',
        fontSize: '1.2rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,229,255,0.15)'; e.currentTarget.style.borderColor = 'var(--spice-blue)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(13,10,8,0.8)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'; }}
      >
        ‹
      </button>
      <div ref={timelineRef} style={{
        display: 'flex', gap: '1rem', width: '100%', overflowX: 'auto',
        padding: '1rem 0',
      }}>
        {milestones.map((m, i) => (
          <motion.div key={m.year} initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="glass-card" style={{
              minWidth: m.placeholder ? '200px' : '220px', flex: '0 0 auto', padding: '1.5rem 1.25rem',
              textAlign: 'center', position: 'relative',
              borderLeft: `2px solid ${m.placeholder ? 'rgba(0,229,255,0.15)' : 'rgba(201,145,26,0.2)'}`,
              transition: 'border-color 0.3s',
              opacity: m.placeholder ? 0.5 : 1,
            }}
            whileHover={{ borderLeftColor: m.placeholder ? 'var(--spice-blue)' : 'var(--gold)' }}
          >
            <div style={{
              fontFamily: "'Orbitron', monospace", fontSize: m.placeholder ? '0.85rem' : '1.4rem', fontWeight: 800,
              color: m.placeholder ? 'var(--spice-blue)' : 'var(--violet)', marginBottom: '0.5rem',
            }}>
              {m.placeholder ? '// TBD //' : m.year}
            </div>
            <div style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem',
              color: 'var(--text-secondary)', lineHeight: 1.5,
            }}>
              {m.event}
            </div>
          </motion.div>
        ))}
      </div>
      <button onClick={() => scroll(1)} style={{
        position: 'absolute', right: '-3.5rem', zIndex: 2,
        width: '40px', height: '40px', borderRadius: '50%',
        border: '1px solid rgba(0,229,255,0.2)',
        background: 'rgba(13,10,8,0.8)',
        backdropFilter: 'blur(8px)',
        color: 'var(--spice-blue)',
        fontSize: '1.2rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,229,255,0.15)'; e.currentTarget.style.borderColor = 'var(--spice-blue)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(13,10,8,0.8)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'; }}
      >
        ›
      </button>
    </div>
  );
}

export default function AboutPage() {
  const [activeWindow, setActiveWindow] = useState('about');

  return (
    <div style={{ paddingTop: 'var(--nav-height)', position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ padding: '2rem 5% 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Link to="/" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
          onMouseEnter={(e) => { e.target.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }}
        >
          ← Back to Home
        </Link>
      </motion.div>

      <div style={{ flex: 1, padding: '2rem 5% 4rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0', marginBottom: '2rem',
            fontFamily: 'var(--font-body)', fontSize: '0.95rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}
        >
          {windows.map((win, i) => {
            const isActive = activeWindow === win.id;
            return (
              <span key={win.id} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ color: 'var(--text-muted)', opacity: 0.3, margin: '0 1.2rem', fontSize: '0.9rem' }}>|</span>
                )}
                <button onClick={() => setActiveWindow(win.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  fontWeight: isActive ? 700 : 500, letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--spice-blue)' : 'var(--text-muted)',
                  padding: '0.5rem 0.2rem',
                  transition: 'color 0.25s var(--ease-cyber)',
                  textShadow: isActive ? '0 0 12px rgba(0,229,255,0.2)' : 'none',
                }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.4, marginRight: '0.4rem' }}>
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                  {win.label}
                </button>
              </span>
            );
          })}
        </motion.div>

        <motion.div layout style={{ minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {activeWindow === 'about' && (
              <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', border: '1px solid rgba(0,229,255,0.1)', borderBottom: 'none', background: 'rgba(8,6,4,0.7)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--spice-blue)' }}>●</span>
                  WINDOW // ABOUT
                  <span style={{ flex: 1 }} />
                  <span style={{ opacity: 0.4 }}>ID: A01</span>
                </div>
                <div style={{ border: '1px solid rgba(0,229,255,0.1)', background: 'rgba(8,6,4,0.5)', padding: '2.5rem' }}>
                  <section style={{ textAlign: 'center' }}>
                    <h2 className="section-title" style={{ marginTop: 0 }}>About AXIS</h2>
                    <p className="section-subtitle">The story of Central India's largest technical festival</p>

                    <div className="glass-card" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem', margin: '0 auto 3rem', borderTop: '1px solid rgba(0,229,255,0.08)' }}>
                      <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '0.03em', lineHeight: 1.9, textAlign: 'center', minHeight: '7em' }}>
                        <TypewriterText text={aboutText} speed={36} />
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                      {[
                        { title: 'Founded', value: '2001', desc: 'Started as Odyssey' },
                        { title: 'Organizers', value: '200+', desc: 'Student-run fest' },
                        { title: 'Reach', value: '35K+', desc: 'Annual footfall' },
                      ].map((item) => (
                        <div key={item.title} className="glass-card" style={{ textAlign: 'center', padding: '2rem 1rem', transition: 'border-color 0.3s var(--ease-cyber), transform 0.3s var(--ease-cyber), box-shadow 0.3s var(--ease-cyber)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--spice-blue)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 229, 255, 0.12)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(229,169,60,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          <div style={{ fontFamily: "var(--font-heading)", fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--spice-blue)', marginRight: '0.35rem', fontSize: '1rem', verticalAlign: 'middle' }}>▲</span>
                            {item.value}
                          </div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: '1.1rem', fontWeight: 700, color: 'var(--spice-blue)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeWindow === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', border: '1px solid rgba(0,229,255,0.1)', borderBottom: 'none', background: 'rgba(8,6,4,0.7)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--spice-blue)' }}>●</span>
                  WINDOW // HISTORY
                  <span style={{ flex: 1 }} />
                  <span style={{ opacity: 0.4 }}>ID: A02</span>
                </div>
                <div style={{ border: '1px solid rgba(0,229,255,0.1)', background: 'rgba(8,6,4,0.5)', padding: '2.5rem' }}>
                  <section style={{ textAlign: 'center' }}>
                    <h2 className="section-title" style={{ marginTop: 0 }}>Our Journey</h2>
                    <p className="section-subtitle">The AXIS timeline — from Odyssey to Ignis Aeternum</p>

                    <div style={{ maxWidth: '900px', margin: '0 auto 4rem' }}>
                      <TimelineSection />
                    </div>

                    <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                      Past Guests & Artists
                    </h3>

                    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem', border: '1px solid var(--border-gold)', borderRadius: '2px', background: 'rgba(8,6,4,0.6)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '1rem' }}>
                        // COMING SOON //
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                        Information about past guests and artists will be added soon.
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeWindow === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', border: '1px solid rgba(0,229,255,0.1)', borderBottom: 'none', background: 'rgba(8,6,4,0.7)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--spice-blue)' }}>●</span>
                  WINDOW // GALLERY
                  <span style={{ flex: 1 }} />
                  <span style={{ opacity: 0.4 }}>ID: A03</span>
                </div>
                <div style={{ border: '1px solid rgba(0,229,255,0.1)', background: 'rgba(8,6,4,0.5)', padding: '2.5rem', textAlign: 'center' }}>
                  <h2 className="section-title" style={{ marginTop: 0 }}>Gallery</h2>
                  <p className="section-subtitle">Photos from AXIS'27 will be displayed soon.</p>
                  <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', border: '1px solid var(--border-gold)', borderRadius: '2px', background: 'rgba(8,6,4,0.6)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '1rem' }}>
                      // NO PHOTOS YET //
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                      Gallery coming soon. Check back after the fest!
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}