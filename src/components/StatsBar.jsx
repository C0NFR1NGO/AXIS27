import { motion } from 'framer-motion';
import { stats } from '../data/content';

export default function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3rem',
        padding: '3rem 5%',
        position: 'relative',
        zIndex: 1,
        flexWrap: 'wrap',
        background: 'linear-gradient(180deg, rgba(13,10,8,0.8) 0%, rgba(7,5,3,0.94) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(229,169,60,0.14)',
        borderBottom: '1px solid rgba(0,229,255,0.1)',
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', padding: '0.5rem 1.5rem', position: 'relative' }}
        >
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--spice-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.06em',
            marginBottom: '0.25rem',
          }}>
            {s.value}
            <span style={{
              fontFamily: "var(--font-heading)",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--spice-blue)',
              opacity: 0.7,
              marginLeft: '0.2rem',
            }}>
              {s.suffix}
            </span>
          </div>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--text-secondary)',
          }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}