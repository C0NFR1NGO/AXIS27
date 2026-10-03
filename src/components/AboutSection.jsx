import { motion } from 'framer-motion';
import { aboutText } from '../data/content';
import TypewriterText from './TypewriterText';
import ScrambleTitle from './ScrambleTitle';

export default function AboutSection() {
  return (
    <section id="about" className="section">
      <ScrambleTitle text="About AXIS" />

      <motion.div
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: '800px',
          width: '100%',
          padding: '2.5rem',
          marginBottom: '2rem',
        }}
      >
        <p style={{
          fontFamily: "var(--font-display)",
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
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
            className="panel"
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              transition: 'border-color 0.3s var(--ease-cyber), transform 0.3s var(--ease-cyber), box-shadow 0.3s var(--ease-cyber)',
            }}
          >
            <motion.div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: '1.6rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--ember), var(--sand))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ color: 'var(--blue)', marginRight: '0.35rem', fontSize: '1rem', verticalAlign: 'middle' }}>▲</span>
              {item.value}
            </motion.div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--blue)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              {item.title}
            </div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginTop: '0.4rem',
            }}>
              {item.desc}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}