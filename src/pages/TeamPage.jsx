import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TeamSection from '../components/TeamSection';
import usePageMeta from '../hooks/usePageMeta';

export default function TeamPage() {
  usePageMeta({
    title: 'The Team',
    description: "Meet the team behind AXIS'27, the annual technical festival of VNIT Nagpur.",
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
      <TeamSection />
    </div>
  );
}
