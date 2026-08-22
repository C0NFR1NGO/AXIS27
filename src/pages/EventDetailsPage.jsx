import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { eventCategories } from '../data/content';
import NotifyMe from '../components/NotifyMe';
import usePageMeta from '../hooks/usePageMeta';
const CosmicBackground = lazy(() => import('../components/CosmicBackground'));

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const slug = eventId ? eventId.toLowerCase() : '';
  const eventName = eventId ? eventId.replace(/-/g, ' ') : 'Event';
  usePageMeta({
    title: `${eventName} — Event`,
    description: `${eventName} at AXIS'27, the annual technical festival of VNIT Nagpur. Details and notifications.`,
  });

  // Match the slug to a category + event entry when possible
  let matched = null;
  if (slug) {
    outer:
    for (const cat of eventCategories) {
      for (const ev of cat.events || []) {
        if (ev.name && ev.name.toLowerCase().replace(/\s+/g, '-') === slug) {
          matched = { category: cat, event: ev };
          break outer;
        }
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        <Suspense fallback={null}>
          <CosmicBackground />
        </Suspense>
      </div>

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: 0.03,
        pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

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
        padding: '3rem 5% 5rem',
      }}>
        {matched && matched.category && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              padding: '0.5rem 1.2rem',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: '2px',
              background: 'rgba(0,229,255,0.05)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              color: 'var(--spice-blue)',
              textTransform: 'uppercase',
              marginBottom: '1.6rem',
            }}
          >
            <span>◆</span> {matched.category.title}
          </motion.div>
        )}

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
            marginBottom: '1rem',
            textShadow: '0 0 24px var(--gold-glow), 0 0 48px rgba(0,229,255,0.1)',
          }}
        >
          {eventName}
        </motion.h1>

        {matched && matched.event && matched.event.desc && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              maxWidth: '620px',
              marginBottom: '2.4rem',
            }}
          >
            {matched.event.desc}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', bounce: 0.2 }}
          style={{
            padding: '0.9rem 2.4rem',
            border: '1px solid var(--spice-blue)',
            background: 'rgba(0, 229, 255, 0.04)',
            borderRadius: '2px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '1.05rem',
            color: 'var(--spice-blue)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            boxShadow: '0 0 0 1px rgba(0,229,255,0.1), 0 0 22px rgba(0, 229, 255, 0.12), inset 0 0 22px rgba(0, 229, 255, 0.02)',
            animation: 'coming-soon-pulse 3s ease-in-out infinite',
            marginBottom: '2.6rem',
          }}
        >
          Coming Soon
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: '560px' }}
        >
          <NotifyMe
            interest="events"
            title={`Be notified the moment "${eventName}" opens for registration.`}
            hint="// REGISTRATION DETAILS INCOMING //"
          />
        </motion.div>
      </div>
    </div>
  );
}
