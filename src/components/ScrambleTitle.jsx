import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import TextScramble from './TextScramble';

export default function ScrambleTitle({ text, style, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.h2
      ref={ref}
      className="section-title"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      {...rest}
    >
      <TextScramble text={text} active={inView} />
    </motion.h2>
  );
}
