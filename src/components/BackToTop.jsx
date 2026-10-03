/* Floating back-to-top control for the long pages. A control, so it stays
 * cold: panel background, --line-quiet border, --blue focus ring. It lives
 * outside the route-shell in App.jsx (the transform trap would make a fixed
 * child scroll away mid-exit), appears only once the hero has scrolled past,
 * and hands keyboard users the tab stop only while it is visible. */
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function BackToTop() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' back-to-top--show' : ''}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
    >
      &uarr; Top
    </button>
  );
}
