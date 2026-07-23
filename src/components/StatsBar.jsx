import { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { stats } from '../data/content';

const DIGIT_HEIGHT = 68;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function SlotDigit({ target, delay, onLanded }) {
  const [landed, setLanded] = useState(false);
  const reelRef = useRef(null);

  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      const controls = animate(0, target * DIGIT_HEIGHT, {
        duration: 1.2 + target * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (latest) => {
          el.style.transform = `translateY(-${latest}px)`;
        },
        onComplete: () => {
          setLanded(true);
          onLanded?.();
        },
      });
      return () => controls.stop();
    }, delay);

    return () => clearTimeout(timer);
  }, [target, delay, onLanded]);

  return (
    <div style={{
      width: 'clamp(34px, 5vw, 50px)',
      height: `${DIGIT_HEIGHT}px`,
      overflow: 'hidden',
      position: 'relative',
      background: 'rgba(8,6,4,0.95)',
      borderRadius: '3px',
      border: `1px solid ${landed ? 'rgba(0,229,255,0.2)' : 'rgba(0,229,255,0.06)'}`,
      boxShadow: landed
        ? '0 0 12px rgba(0,229,255,0.1), inset 0 0 8px rgba(0,229,255,0.03)'
        : 'inset 0 0 6px rgba(0,0,0,0.4)',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    }}>
      {/* Gradient mask top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(180deg, rgba(8,6,4,1) 0%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      {/* Gradient mask bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(0deg, rgba(8,6,4,1) 0%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      {/* Center highlight line */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: '1px',
        background: 'rgba(0,229,255,0.12)',
        zIndex: 3,
        pointerEvents: 'none',
        transform: 'translateY(-0.5px)',
      }} />
      {/* The reel */}
      <div ref={reelRef} style={{
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
      }}>
        {DIGITS.map((d) => (
          <div key={d} style={{
            height: `${DIGIT_HEIGHT}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
            fontWeight: 900,
            background: 'linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 50%, var(--spice-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            userSelect: 'none',
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
  const digitCount = targetStr.length;
  const digits = targetStr.split('').map(Number);
  const [allLanded, setAllLanded] = useState(false);

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
        display: 'flex',
        gap: 'clamp(3px, 0.5vw, 5px)',
        justifyContent: 'center',
        marginBottom: '0.6rem',
      }}>
        {inView && digits.map((d, i) => (
          <SlotDigit
            key={`${digitCount}-${i}`}
            target={d}
            delay={staggerDelay * 1000 + i * 180}
            onLanded={() => {
              if (i === digitCount - 1) setAllLanded(true);
            }}
          />
        ))}
        {!inView && Array.from({ length: digitCount }).map((_, i) => (
          <div key={`placeholder-${i}`} style={{
            width: 'clamp(34px, 5vw, 50px)',
            height: `${DIGIT_HEIGHT}px`,
            background: 'rgba(8,6,4,0.95)',
            borderRadius: '3px',
            border: '1px solid rgba(0,229,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
            fontWeight: 900,
            backgroundClip: 'text',
            color: 'var(--text-muted)',
            opacity: 0.3,
          }}>
            0
          </div>
        ))}
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1rem, 2.2vw, 1.5rem)',
          fontWeight: 700,
          color: 'var(--spice-blue)',
          opacity: allLanded ? 0.8 : 0.3,
          alignSelf: 'flex-end',
          paddingBottom: 'clamp(6px, 1vw, 12px)',
          marginLeft: '0.25rem',
          transition: 'opacity 0.4s',
        }}>
          {suffix}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'clamp(2rem, 5vw, 4rem)',
        padding: '3rem 5%',
        position: 'relative',
        zIndex: 1,
        flexWrap: 'wrap',
        background: 'linear-gradient(180deg, rgba(13,10,8,0.8) 0%, rgba(7,5,3,0.94) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid transparent',
        backgroundImage: 'linear-gradient(180deg, rgba(13,10,8,0.8) 0%, rgba(7,5,3,0.94) 100%), linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)',
        backgroundOrigin: 'padding-box, border-box',
        backgroundClip: 'padding-box, border-box',
        borderBottom: '1px solid rgba(0,229,255,0.1)',
      }}
    >
      {stats.map((s, i) => (
        <SlotNumber key={s.label} value={s.value} suffix={s.suffix} staggerDelay={i * 0.2} />
      ))}
    </motion.div>
  );
}
