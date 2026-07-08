import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import CosmicBackground from '../components/CosmicBackground';

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const eventName = eventId ? eventId.replace(/-/g, ' ') : 'Event';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        <CosmicBackground />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: 'calc(var(--nav-height) + 2rem) 5% 0' }}
      >
        <Link
          to="/events"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.2s var(--ease-cyber)',
          }}
          onMouseEnter={(e) => { e.target.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }}
        >
           ← Back to Events
        </Link>
      </motion.div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 5%',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Ethnocentric', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '2rem',
            textShadow: '0 0 24px var(--gold-glow)',
          }}
        >
          {eventName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', bounce: 0.2 }}
          style={{
            padding: '1.2rem 3rem',
            border: '1px solid var(--spice-blue)',
            background: 'rgba(0, 229, 255, 0.04)',
            borderRadius: '2px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '1.2rem',
            color: 'var(--spice-blue)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            boxShadow: '0 0 22px rgba(0, 229, 255, 0.12), inset 0 0 22px rgba(0, 229, 255, 0.02)',
          }}
        >
          Coming Soon
        </motion.div>
      </div>
    </div>
  );
}