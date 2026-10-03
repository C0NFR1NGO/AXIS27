import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AccommodationSection from '../components/AccommodationSection';
import ZoomReveal from '../components/ZoomReveal';
import usePageMeta from '../hooks/usePageMeta';

export default function AccommodationPage() {
  usePageMeta({
    title: 'Accommodation',
    description: 'Accommodation for outstation participants at AXIS\'27, VNIT Nagpur.',
  });
  return (
    <div className="page-dimmer" style={{ paddingTop: 'var(--nav-height)', position: 'relative', zIndex: 1 }}>
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
        <Link to="/" className="backlink">← Back to Home</Link>
      </motion.div>
      <ZoomReveal><AccommodationSection /></ZoomReveal>
    </div>
  );
}
