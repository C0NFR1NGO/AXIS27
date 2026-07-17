import { motion } from 'framer-motion';
import { workshopInfo } from '../data/content';

export default function WorkshopsSection() {
  return (
    <section id="workshops" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {workshopInfo.title}
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {workshopInfo.description}
      </motion.p>

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '2.5rem',
          maxWidth: '700px',
          width: '100%',
          marginBottom: '2rem',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--spice-blue)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span className="led-dot" />
          // NEURAL_WORKSHOP_INTERFACE // ACTIVE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            'AI / Machine Learning & Deep Learning',
            'Ethical Hacking & Cybersecurity',
            'Generative AI & Large Language Models',
            'Robotics & Autonomous Systems',
            'Web3 & Blockchain Development',
            'AR/VR & Immersive Technologies',
          ].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem', textShadow: '0 0 8px rgba(201,145,26,0.3)' }}>◈</span>
              {item}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}