import { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { stats } from '../data/content';

const DIGIT_HEIGHT = 68;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function SlotDigit({ target, delay }) {
  const reelRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    const el = reelRef.current;
    if (!el) return;

    // The controls handle has to live in effect scope, not in the timer callback: a value
    // returned from a setTimeout callback goes nowhere, so the old `return () =>
    // controls.stop()` inside the timer was unreachable and the reel kept animating (and
    // writing to a detached el.style) after unmount. Only the effect's own return is cleanup.
    let controls = null;
    const timer = setTimeout(() => {
      if (doneRef.current) return;
      controls = animate(0, target * DIGIT_HEIGHT, {
        duration: 1.0 + target * 0.06,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (latest) => {
          el.style.transform = `translateY(-${latest}px)`;
        },
        onComplete: () => {
          doneRef.current = true;
        },
      });
    }, delay);

    return () => {
      clearTimeout(timer);
      controls?.stop();
    };
  }, [target, delay]);

  return (
    <div style={{
      width: 'clamp(34px, 5vw, 50px)',
      height: `${DIGIT_HEIGHT}px`,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(180deg, rgba(7,5,3,0.94) 0%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(0deg, rgba(7,5,3,0.94) 0%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div ref={reelRef} style={{
        display: 'flex', flexDirection: 'column', willChange: 'transform',
      }}>
        {DIGITS.map((d) => (
          <div key={d} style={{
            height: `${DIGIT_HEIGHT}px`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
            fontWeight: 900,
            background: 'linear-gradient(180deg, var(--ember) 0%, var(--sand) 50%, var(--blue) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', userSelect: 'none',
          }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlotNumber({ value, suffix, staggerDelay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const targetStr = String(value);
  const digits = targetStr.split('').map(Number);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: staggerDelay, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: 'center' }}
    >
      <div style={{
        display: 'flex', gap: 'clamp(3px, 0.5vw, 5px)',
        justifyContent: 'center', marginBottom: '0.6rem',
      }}>
        {inView && digits.map((d, i) => (
          <SlotDigit key={`${digits.length}-${i}`} target={d} delay={staggerDelay * 1000 + i * 180} />
        ))}
        {!inView && Array.from({ length: digits.length }).map((_, i) => (
          <div key={`p-${i}`} style={{
            width: 'clamp(34px, 5vw, 50px)', height: `${DIGIT_HEIGHT}px`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 900,
            color: 'var(--text-muted)', opacity: 0.3,
          }}>0</div>
        ))}
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1rem, 2.2vw, 1.5rem)', fontWeight: 700,
          color: 'var(--blue)', opacity: 0.8,
          alignSelf: 'flex-end',
          paddingBottom: 'clamp(6px, 1vw, 12px)', marginLeft: '0.25rem',
        }}>
          {suffix}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        color: 'var(--text-secondary)',
      }}>
        {stats.find(s => s.value === value)?.label}
      </div>
    </motion.div>
  );
}

export default function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 'clamp(2rem, 5vw, 4rem)', padding: '3rem 5%',
        position: 'relative', zIndex: 1, flexWrap: 'wrap',
        background: 'linear-gradient(180deg, rgba(13,10,8,0.8) 0%, rgba(7,5,3,0.94) 100%)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        borderTop: '1px solid transparent',
        backgroundImage: 'linear-gradient(180deg, rgba(13,10,8,0.8) 0%, rgba(7,5,3,0.94) 100%), linear-gradient(90deg, transparent, rgba(0, 168, 232, 0.15), transparent)',
        backgroundOrigin: 'padding-box, border-box',
        backgroundClip: 'padding-box, border-box',
        borderBottom: '1px solid rgba(0, 168, 232, 0.1)',
      }}
    >
      {stats.map((s, i) => (
        <SlotNumber key={s.label} value={s.value} suffix={s.suffix} staggerDelay={i * 0.2} />
      ))}
    </motion.div>
  );
}
