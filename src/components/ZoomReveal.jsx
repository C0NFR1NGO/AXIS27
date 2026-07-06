import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ZoomReveal({ children, style }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 1,
  });

  const y = useTransform(smoothProgress, [0, 1], [60, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.4, 0.8], [0, 0.4, 1]);

  return (
    <div ref={ref} style={{ ...style }}>
      <motion.div style={{ y, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}
