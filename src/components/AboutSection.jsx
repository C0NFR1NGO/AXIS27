import { motion } from 'framer-motion';
import { aboutText } from '../data/content';
import TypewriterText from './TypewriterText';

export default function AboutSection() {
  return (
    <section id="about" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        About AXIS
      </motion.h2>

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
          marginBottom: '2rem',
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

      <motion.div
        className="about-stats-grid"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, delay: 0.4 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        {[
          { title: 'Founded', value: '2001', desc: 'Started as Odyssey' },
          { title: 'Organizers', value: '200+', desc: 'Student-run fest' },
          { title: 'Reach', value: '35K+', desc: 'Annual footfall' },
        ].map((item) => (
          <div
            key={item.title}
            className="glass-card"
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--spice-blue)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(229,169,60,0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontFamily: "var(--font-heading)", fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--spice-blue)', marginRight: '0.35rem', fontSize: '1rem', verticalAlign: 'middle' }}>▲</span>
              {item.value}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: '1.1rem', fontWeight: 700, color: 'var(--spice-blue)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {item.desc}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
