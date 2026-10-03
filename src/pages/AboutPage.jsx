import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { aboutText } from '../data/content';
import TypewriterText from '../components/TypewriterText';
import ScrambleTitle from '../components/ScrambleTitle';
import GallerySection from '../components/GallerySection';
import NotableGuests from '../components/NotableGuests';
import { notablePerformers } from '../data/content';
import usePageMeta from '../hooks/usePageMeta';

const milestones = [
  { year: '2001', event: 'Founded as Odyssey — VNIT\'s first tech fest' },
  { year: '2005', event: 'Rebranded to AXIS; expanded to national scale' },
  { year: '2010', event: 'Crossed 10,000 annual footfall' },
  { year: '2015', event: 'Featured NDRF & DRDO exhibitions' },
  { year: '2020', event: 'Pioneered hybrid format during the pandemic' },
  { year: '2025', event: 'Record 35,000+ participants from 200+ colleges' },
  { year: '2026', event: 'AXIS\'26 — "Forging Across Timelines"; 16-drone show, ISRO & defence pavilions, National Insights lecture series' },
];

const windows = [
  { id: 'about', label: 'About' },
  { id: 'history', label: 'History' },
  { id: 'gallery', label: 'Gallery' },
];

function TimelineSection() {
  const timelineRef = useRef(null);
  const LAST = milestones.length - 1;
  /* The newest milestone is warm and the rest are cold, and that is the one
     place ember is allowed onto a page: it marks the edition that is happening
     rather than one that happened. Everything behind it is history, drawn in the
     interface colour. Ember stays off every control on this page. */
  const accent = (i) => (i === LAST ? 'var(--ember)' : 'var(--blue)');
  const accentRgba = (i) => (i === LAST ? 'rgba(255,158,0,' : 'rgba(0,168,232,');

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

  const arrowBtn = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 2,
    width: '40px', height: '40px', borderRadius: '50%',
    border: '1px solid rgba(0, 168, 232, 0.2)',
    background: 'rgba(13,10,8,0.8)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: 'var(--blue)',
    fontSize: '1.2rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s',
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto', padding: '1rem 0 2rem' }}>
      <button onClick={() => scroll(-1)} style={{ ...arrowBtn, left: '-3.5rem' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 168, 232, 0.15)'; e.currentTarget.style.borderColor = 'var(--blue)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(13,10,8,0.8)'; e.currentTarget.style.borderColor = 'rgba(0, 168, 232, 0.2)'; }}
      >
        ‹
      </button>

      <div ref={timelineRef} style={{
        display: 'flex', gap: '1rem', width: '100%', overflowX: 'auto',
        scrollbarWidth: 'none', padding: '0.5rem 0',
      }}>
        {milestones.map((p, i) => {
          const isLast = i === LAST;
          const ac = accent(i);
          return (
            <motion.div key={p.year} initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="panel" style={{
                width: '260px', flex: '0 0 auto',
                padding: '1rem 1.15rem', position: 'relative',
                display: 'flex', flexDirection: 'column',
                background: 'rgba(10,8,6,0.72)',
                border: `1px solid ${accentRgba(i)}0.22)`,
                borderRadius: '6px', overflow: 'hidden',
                transition: 'border-color 0.35s, box-shadow 0.35s, transform 0.35s',
              }}
              whileHover={{ y: -4, borderColor: ac, boxShadow: `0 0 26px ${accentRgba(i)}0.14)` }}
            >
              {/* Top accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, ${ac}, ${accentRgba(i)}0.2))`,
              }} />

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.6rem', textAlign: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.14em',
                  color: 'var(--text-muted)', opacity: 0.65,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: '1.2rem', fontWeight: 800,
                  letterSpacing: '0.03em', color: ac,
                  textShadow: isLast ? '0 0 18px rgba(255,158,0,0.5)' : '0 0 14px rgba(0, 168, 232, 0.3)',
                }}>
                  {p.year}
                </span>
              </div>

              <div style={{ width: '100%', height: '1px', margin: '0.55rem 0', background: `${accentRgba(i)}0.18)` }} />

              <div style={{
                fontFamily: "var(--font-display)", fontSize: '0.85rem', lineHeight: 1.5,
                color: 'var(--text-secondary)', opacity: 0.95, flex: 1, textAlign: 'center',
              }}>
                {p.event}
              </div>
            </motion.div>
          );
        })}
      </div>

      <button onClick={() => scroll(1)} style={{ ...arrowBtn, right: '-3.5rem' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 168, 232, 0.15)'; e.currentTarget.style.borderColor = 'var(--blue)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(13,10,8,0.8)'; e.currentTarget.style.borderColor = 'rgba(0, 168, 232, 0.2)'; }}
      >
        ›
      </button>
    </div>
  );
}

export default function AboutPage() {
  usePageMeta({
    title: 'About',
    description: "The story of AXIS — from Odyssey 2001 to Central India's largest technical festival. History, gallery and notable guests.",
  });
  const [activeWindow, setActiveWindow] = useState('about');

  return (
    <div className="page-dimmer" style={{ paddingTop: 'var(--nav-height)', position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ padding: '2rem 5% 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Link to="/" className="backlink">← Back to Home</Link>
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
                  color: isActive ? 'var(--blue)' : 'var(--text-muted)',
                  padding: '0.5rem 0.2rem',
                  transition: 'color 0.25s var(--ease-cyber)',
                  textShadow: isActive ? '0 0 12px rgba(0, 168, 232, 0.2)' : 'none',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', border: '1px solid rgba(0, 168, 232, 0.1)', borderBottom: 'none', background: 'rgba(8,6,4,0.7)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--blue)' }}>●</span>
                  WINDOW // ABOUT
                  <span style={{ flex: 1 }} />
                  <span style={{ opacity: 0.4 }}>ID: A01</span>
                </div>
                <div style={{ border: '1px solid rgba(0, 168, 232, 0.1)', background: 'rgba(8,6,4,0.5)', padding: '2.5rem', textAlign: 'center' }}>
                  <section>
                    <ScrambleTitle text="About AXIS" style={{ marginTop: 0 }} />
                    <p className="section-subtitle">The story of Central India's largest technical festival</p>

                    <div className="panel" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem', margin: '0 auto 3rem', borderTop: '1px solid rgba(0, 168, 232, 0.08)' }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '0.03em', lineHeight: 1.9, textAlign: 'center', minHeight: '7em' }}>
                        <TypewriterText text={aboutText} speed={36} />
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                      {[
                        { title: 'Founded', value: '2001', desc: 'Started as Odyssey' },
                        { title: 'Organizers', value: '200+', desc: 'Student-run fest' },
                        { title: 'Reach', value: '35K+', desc: 'Annual footfall' },
                      ].map((item) => (
                        <div key={item.title} className="panel" style={{ textAlign: 'center', padding: '2rem 1rem', transition: 'border-color 0.3s var(--ease-cyber), transform 0.3s var(--ease-cyber), box-shadow 0.3s var(--ease-cyber)' }}
                        >
                          <div style={{ fontFamily: "var(--font-heading)", fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--ember), var(--sand))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--blue)', marginRight: '0.35rem', fontSize: '1rem', verticalAlign: 'middle' }}>▲</span>
                            {item.value}
                          </div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.title}</div>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', border: '1px solid rgba(0, 168, 232, 0.1)', borderBottom: 'none', background: 'rgba(8,6,4,0.7)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--blue)' }}>●</span>
                  WINDOW // HISTORY
                  <span style={{ flex: 1 }} />
                  <span style={{ opacity: 0.4 }}>ID: A02</span>
                </div>
                <div style={{ border: '1px solid rgba(0, 168, 232, 0.1)', background: 'rgba(8,6,4,0.5)', padding: '2.5rem', textAlign: 'center' }}>
                  <section>
                    <ScrambleTitle text="Our Journey" style={{ marginTop: 0 }} />
                    <p className="section-subtitle">The AXIS timeline — from Odyssey to Ignis Aeternum</p>

                    <div style={{ maxWidth: '900px', margin: '0 auto 4rem' }}>
                      <TimelineSection />
                    </div>

                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                      Notable Guests
                    </h3>

                    <NotableGuests />

                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', margin: '4rem 0 2rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
                      Notable Performers
                    </h3>

                    <NotableGuests people={notablePerformers} verb="PERFORMED" />
                  </section>
                </div>
              </motion.div>
            )}

            {activeWindow === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', border: '1px solid rgba(0, 168, 232, 0.1)', borderBottom: 'none', background: 'rgba(8,6,4,0.7)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--blue)' }}>●</span>
                  WINDOW // GALLERY
                  <span style={{ flex: 1 }} />
                  <span style={{ opacity: 0.4 }}>ID: A03</span>
                </div>
                <div style={{ border: '1px solid rgba(0, 168, 232, 0.1)', background: 'rgba(8,6,4,0.5)', padding: '2.5rem', textAlign: 'center' }}>
                  <ScrambleTitle text="Gallery" style={{ marginTop: 0 }} />
                  <p className="section-subtitle">Frames from AXIS'26</p>
                  <GallerySection />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}