import { useRef } from 'react';
import { motion } from 'framer-motion';
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
];

export default function AboutPage() {
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
    <div style={{ paddingTop: 'var(--nav-height)', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '2rem 5% 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }}
        >
          ← Back to Home
        </Link>
      </motion.div>

      <section className="section" style={{ minHeight: 'auto', padding: '60px 5% 100px' }}>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          About AXIS
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The story of Central India's largest technical festival
        </motion.p>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            maxWidth: '800px',
            width: '100%',
            padding: '2.5rem',
            marginBottom: '3rem',
            borderTop: '1px solid rgba(0,229,255,0.08)',
          }}
        >
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '1.1rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.03em',
            lineHeight: 1.9,
            textAlign: 'center',
            minHeight: '7em',
          }}>
            <TypewriterText text={aboutText} speed={36} />
          </p>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--violet)',
            marginBottom: '2rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Our Journey
        </motion.h3>

        <div style={{ position: 'relative', width: '100%', maxWidth: '900px', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => scroll(-1)}
            style={{
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
            onMouseEnter={(e) => { e.target.style.background = 'rgba(0,229,255,0.15)'; e.target.style.borderColor = 'var(--spice-blue)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(13,10,8,0.8)'; e.target.style.borderColor = 'rgba(0,229,255,0.2)'; }}
          >
            ‹
          </button>
          <div
            ref={timelineRef}
            style={{
              display: 'flex', gap: '1rem', width: '100%', overflowX: 'auto',
              padding: '1rem 0',
            }}
          >
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card"
                style={{
                  minWidth: '220px', flex: '0 0 auto', padding: '1.5rem 1.25rem',
                  textAlign: 'center', position: 'relative',
                  borderLeft: '2px solid rgba(201,145,26,0.2)',
                  transition: 'border-color 0.3s',
                }}
                whileHover={{ borderLeftColor: 'var(--gold)' }}
              >
                <div style={{
                  fontFamily: "'Orbitron', monospace", fontSize: '1.4rem', fontWeight: 800,
                  color: 'var(--violet)', marginBottom: '0.5rem',
                }}>
                  {m.year}
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
          <button
            onClick={() => scroll(1)}
            style={{
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
            onMouseEnter={(e) => { e.target.style.background = 'rgba(0,229,255,0.15)'; e.target.style.borderColor = 'var(--spice-blue)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(13,10,8,0.8)'; e.target.style.borderColor = 'rgba(0,229,255,0.2)'; }}
          >
            ›
          </button>
        </div>
      </section>
    </div>
  );
}
