import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/* Two jobs in one component, split by the `full` prop.
 *
 * Default: the 2px hairline across the top of the viewport that draws on every
 * route change — instant feedback that a navigation started, even when the new
 * page's chunk is already cached and the wait is one frame long.
 *
 * full: the Suspense fallback. Rendered only while a lazy chunk is genuinely
 * in flight, and it reports that through `onActive` so App can withhold the
 * footer for exactly the same window. Without this the old page's exit left
 * its footer sitting under the loader, which read as "the next page has
 * arrived" while it was still mid-fetch.
 *
 * onActive is mount/unmount symmetric: the fallback mounts when suspension
 * starts and unmounts the moment the real page resolves, so no timer or fetch
 * bookkeeping is needed to clear it. */
export default function RouteLoading({ full = false, onActive }) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!onActive) return undefined;
    onActive(true);
    return () => onActive(false);
  }, [onActive]);

  return (
    <>
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
            background: 'linear-gradient(90deg, var(--amber-hot), var(--blue), var(--amber-hot))',
            boxShadow: '0 0 12px rgba(0, 168, 232, 0.22)',
            transformOrigin: 'left',
            zIndex: 10001,
          }}
        />
      </AnimatePresence>

      {full && (
        <div className="route-loader">
          <span className="route-loader__label" role="status" aria-live="polite">
            Loading selection
          </span>
          {/* Reduced motion gets the same track with the runner parked mid-line:
              still visibly "a loader", just not one that moves. */}
          <div
            className="route-loader__scan"
            style={reduceMotion ? { opacity: 0.5 } : undefined}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}
