import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EventCard({ category, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01, borderColor: 'var(--spice-blue)', boxShadow: '0 0 28px rgba(0, 229, 255, 0.12), 0 0 40px rgba(229, 169, 60, 0.04)' }}
      onClick={() => setExpanded(!expanded)}
      className="glass-card"
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'border-color 0.3s var(--ease-cyber), transform 0.3s var(--ease-cyber), box-shadow 0.3s var(--ease-cyber)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* DBH-style category header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <motion.div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--spice-blue)',
              marginBottom: '0.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
              style={{
                display: 'inline-block',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--spice-blue)',
                boxShadow: '0 0 6px var(--spice-blue)',
              }}
            />
            {category.subtitle}
          </motion.div>
          <h3 style={{
            fontFamily: "var(--font-heading)",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.06em',
            marginBottom: '0.5rem',
          }}>
            {category.title}
          </h3>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            {category.description}
          </p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: '1rem',
            color: 'var(--spice-blue)',
            marginLeft: '1rem',
            flexShrink: 0,
            marginTop: '0.2rem',
          }}
        >
          ▼
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(229,169,60,0.12)',
            }}>
              {category.events.map((event, i) => {
                const slug = event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Link key={event.name} to={`/events/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ x: 5, backgroundColor: 'rgba(0,229,255,0.03)' }}
                      style={{
                        padding: '0.7rem 0.5rem',
                        margin: '0 -0.5rem',
                        borderRadius: '2px',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <div style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        letterSpacing: '0.05em',
                      }}>
                        {event.name}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.15rem',
                      }}>
                        {event.desc}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}