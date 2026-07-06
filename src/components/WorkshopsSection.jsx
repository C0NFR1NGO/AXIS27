import { motion } from 'framer-motion';

const workshops = [
  { title: 'AI & Machine Learning', icon: '🤖' },
  { title: 'Ethical Hacking', icon: '🔐' },
  { title: 'Generative AI', icon: '✨' },
  { title: 'Robotics', icon: '⚙️' },
  { title: 'Web Development', icon: '🌐' },
  { title: 'Data Science', icon: '📊' },
];

export default function WorkshopsSection() {
  return (
    <section id="workshops" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        Workshops
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Hands-on sessions on cutting-edge technologies led by industry experts. Stay tuned for 2027 details.
      </motion.p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        maxWidth: '800px',
      }}>
        {workshops.map((w, i) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{
              scale: 1.05,
              borderColor: 'var(--cyan)',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.12)',
            }}
            className="glass-card"
            style={{
              padding: '1.2rem 2rem',
              border: '1px solid rgba(0,229,255,0.15)',
              cursor: 'default',
              transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
            }}
          >
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: 'var(--text-primary)',
            }}>
              {w.title}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
