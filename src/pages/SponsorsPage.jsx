import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SponsorsSection from '../components/SponsorsSection';
import ZoomReveal from '../components/ZoomReveal';
import usePageMeta from '../hooks/usePageMeta';

export default function SponsorsPage() {
  usePageMeta({
    title: 'Sponsors',
    description: 'Partner with AXIS\'27, Central India\'s largest technical festival — 35,000+ students, 200+ colleges.',
  });
  return (
    <div style={{ paddingTop: 'var(--nav-height)', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '2rem 5% 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }}
        >
          ← Back to Home
        </Link>
      </motion.div>
      <ZoomReveal><SponsorsSection /></ZoomReveal>
    </div>
  );
}
