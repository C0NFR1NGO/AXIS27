import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

const ease = [0.22, 1, 0.36, 1];

const cornerDelay = 0.05;

function ArrowLeftIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function CornerTicks() {
  return (
    <div aria-hidden="true" className="nf-corners">
      {[
        { pos: 'nf-corner--tl', ch: '┌' },
        { pos: 'nf-corner--tr', ch: '┐' },
        { pos: 'nf-corner--bl', ch: '└' },
        { pos: 'nf-corner--br', ch: '┘' },
      ].map(({ pos, ch }) => (
        <motion.span
          key={pos}
          className={`nf-corner ${pos}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.6, delay: cornerDelay, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </div>
  );
}

export default function NotFoundPage() {
  usePageMeta({ title: 'Page Not Found' });
  const reduce = useReducedMotion();

  return (
    <main className="nf-page">
      <div className="nf-grid" aria-hidden="true">
        <span className="nf-grid-label nf-grid-label--tl">GRID-27</span>
        <span className="nf-grid-label nf-grid-label--br">x:0 y:0</span>
      </div>
      <CornerTicks />

      <motion.p
        className="nf-error-line"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        error :: no route for <span>node-0x4</span>
      </motion.p>

      <motion.div
        className="nf-numeral-wrap"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
      >
        <div className="nf-numeral" data-text="404" role="img" aria-label="404">
          404
        </div>
      </motion.div>

      <motion.p
        className="nf-subtext"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease }}
      >
        The coordinates you dialed do not exist in the deep desert.
      </motion.p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease }}
      >
        <Link to="/" className="nf-cta">
          <ArrowLeftIcon size={18} />
          Return to Base
        </Link>
      </motion.div>
    </main>
  );
}
