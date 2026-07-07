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
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        borderColor: 'var(--spice-blue)', 
        boxShadow: '0 0 25px rgba(0, 229, 255, 0.15)' 
      }}
      onClick={() => setExpanded(!expanded)}
      className="glass-card"
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--spice-blue)',
            marginBottom: '0.3rem',
          }}>
            {category.subtitle}
          </div>
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
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: '1rem',
          color: 'var(--spice-blue)',
          transition: 'transform 0.3s ease',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          marginLeft: '1rem',
          flexShrink: 0,
          marginTop: '0.2rem',
        }}>
          ▼
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(229,169,60,0.15)',
            }}>
              {category.events.map((event, i) => {
                const slug = event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Link key={event.name} to={`/events/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.02)' }}
                      style={{
                        padding: '0.7rem 0.5rem',
                        margin: '0 -0.5rem',
                        borderRadius: '4px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
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
