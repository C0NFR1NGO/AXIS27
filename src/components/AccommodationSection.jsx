import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrambleTitle from './ScrambleTitle';

export default function AccommodationSection() {
  return (
    <section id="accommodation" className="section">
      <ScrambleTitle text="Accommodation" />

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '3rem 2.5rem',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Coming Soon
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          marginBottom: '2rem',
          opacity: 0.5,
        }}>
          // ACCOMMODATION_DETAILS_PENDING //
        </div>

        <Link to="/contact" className="btn-primary">
          For Queries, Contact Us
        </Link>
      </motion.div>
    </section>
  );
}
