import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function RouteLoading() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--gold), var(--spice-blue), var(--gold))',
          boxShadow: '0 0 12px var(--spice-blue-glow), 0 0 24px var(--gold-glow)',
          transformOrigin: 'left',
          zIndex: 10001,
        }}
      />
    </AnimatePresence>
  );
}
