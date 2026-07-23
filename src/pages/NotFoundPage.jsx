import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(5rem, 15vw, 10rem)',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--gold), var(--spice-blue))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
        }}
      >
        404
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          marginBottom: '2rem',
          opacity: 0.6,
        }}
      >
        // SIGNAL_LOST // COORDINATES_OUT_OF_BOUNDS //
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
          marginBottom: '2.5rem',
          maxWidth: '400px',
        }}
      >
        This directive does not exist. The page you're looking for has drifted beyond the deep desert.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Link to="/" className="btn-primary">
          Return to Base
        </Link>
      </motion.div>
    </div>
  );
}
