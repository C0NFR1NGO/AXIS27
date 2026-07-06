import { motion } from 'framer-motion';
import { stats } from '../data/content';

const barStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '3rem',
  padding: '3rem 5%',
  position: 'relative',
  zIndex: 1,
  flexWrap: 'wrap',
  background: 'linear-gradient(180deg, rgba(13,10,8,0.75) 0%, rgba(7,5,3,0.92) 100%)',
  backdropFilter: 'blur(14px)',
  borderTop: '1px solid rgba(229,169,60,0.16)',
  borderBottom: '1px solid rgba(229,169,60,0.16)',
};

const statItemStyle = {
  textAlign: 'center',
  padding: '0.5rem 1.5rem',
  position: 'relative',
};

const numberStyle = {
  fontFamily: "var(--font-heading)",
  fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
  fontWeight: 800,
  background: 'linear-gradient(135deg, var(--gold), var(--gold-light), var(--spice-blue))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1.2,
  textShadow: '0 0 45px var(--gold-glow)',
  whiteSpace: 'nowrap',
};

const labelStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: '0.82rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
  marginTop: '0.3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.3rem',
};

export default function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      style={barStyle}
    >
      {stats.map((stat, idx) => (
        <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <motion.div
            whileHover={{ scale: 1.05, z: 20 }}
            style={statItemStyle}
            transition={{ duration: 0.3 }}
          >
            <div style={numberStyle}>
              {stat.value}{stat.suffix}
            </div>
            <div style={labelStyle}>
              <span style={{ color: 'var(--spice-blue)', fontSize: '0.7rem' }}>▲</span>
              {stat.label}
            </div>
          </motion.div>
          {idx < stats.length - 1 && (
            <div 
              style={{ 
                width: '1px', 
                height: '40px', 
                background: 'linear-gradient(180deg, transparent, var(--spice-blue), transparent)', 
                opacity: 0.35 
              }} 
              className="nav-desktop-links" 
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}