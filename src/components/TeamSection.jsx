import { motion } from 'framer-motion';
import { teamInfo } from '../data/content';

export default function TeamSection() {
  return (
    <section id="team" className="section" style={{ minHeight: 'auto', paddingBottom: '40px' }}>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {teamInfo.title}
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {teamInfo.description}
      </motion.p>

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '2rem',
          maxWidth: '700px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--spice-blue)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          <span className="led-dot" style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
          // TEAM_COMPOSITION_SCAN //
        </div>
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          letterSpacing: '0.04em',
        }}>
          Meet the team behind AXIS'27 — 200+ passionate students from VNIT Nagpur
          organizing Central India's largest technical festival. From core committee
          leadership to domain leads and volunteers, every member contributes to
          the Ignis Aeternum vision.
        </p>
      </motion.div>
    </section>
  );
}