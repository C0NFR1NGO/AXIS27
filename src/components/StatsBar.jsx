import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '../data/content';

function FlipDigit({ digit }) {
  const [current, setCurrent] = useState(digit);
  const [prev, setPrev] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== current) {
      setPrev(current);
      setFlipping(true);
      const timer = setTimeout(() => {
        setCurrent(digit);
        setFlipping(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [digit, current]);

  return (
    <div style={{
      position: 'relative',
      width: 'clamp(36px, 5vw, 52px)',
      height: 'clamp(52px, 7.5vw, 76px)',
      perspective: '300px',
    }}>
      {/* Static base half */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        overflow: 'hidden',
        background: 'rgba(8,6,4,0.95)',
        borderBottom: '1px solid rgba(0,229,255,0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '0',
      }}>
        <span style={digitStyle}>{current}</span>
      </div>

      {/* Top static half */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        overflow: 'hidden',
        background: 'rgba(8,6,4,0.95)',
        borderBottom: '1px solid rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}>
        <span style={digitStyle}>{current}</span>
      </div>

      {/* Flip card */}
      {flipping && (
        <>
          {/* Flipping top half (falls down, shows prev) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            overflow: 'hidden',
            background: 'rgba(8,6,4,0.95)',
            transformOrigin: 'bottom center',
            animation: 'flipTop 0.3s ease-in forwards',
            zIndex: 2,
            borderBottom: '1px solid rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
            <span style={digitStyle}>{prev}</span>
          </div>
          {/* Flipping bottom half (rises up, shows current) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            overflow: 'hidden',
            background: 'rgba(8,6,4,0.95)',
            transformOrigin: 'top center',
            animation: 'flipBottom 0.3s ease-out 0.12s forwards',
            transform: 'rotateX(90deg)',
            zIndex: 2,
            borderBottom: '1px solid rgba(0,229,255,0.08)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
            <span style={digitStyle}>{current}</span>
          </div>
        </>
      )}

      {/* Center line */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: '1px',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 5,
        boxShadow: '0 0 4px rgba(0,229,255,0.1)',
      }} />
    </div>
  );
}

const digitStyle = {
  fontFamily: "var(--font-heading)",
  fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
  fontWeight: 900,
  lineHeight: 'clamp(52px, 7.5vw, 76px)',
  background: 'linear-gradient(180deg, var(--gold) 0%, var(--gold-light) 45%, var(--spice-blue) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textAlign: 'center',
  width: '100%',
  userSelect: 'none',
};

function FlipNumber({ value, suffix, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const target = value;
    const duration = 1800;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, value]);

  const str = String(displayValue).padStart(String(value).length, '0');
  const digits = str.split('');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: 'center' }}
    >
      <div style={{
        display: 'flex',
        gap: 'clamp(3px, 0.5vw, 6px)',
        justifyContent: 'center',
        marginBottom: '0.5rem',
      }}>
        {digits.map((d, i) => (
          <FlipDigit key={`${digits.length}-${i}`} digit={d} />
        ))}
        <span style={{
          fontFamily: "var(--font-heading)",
          fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
          fontWeight: 700,
          color: 'var(--spice-blue)',
          opacity: 0.7,
          alignSelf: 'flex-end',
          paddingBottom: 'clamp(6px, 1vw, 12px)',
          marginLeft: '0.2rem',
        }}>
          {suffix}
        </span>
      </div>
      <div style={{
        fontFamily: "var(--font-body)",
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
    <>
      <style>{`
        @keyframes flipTop {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipBottom {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
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
          <FlipNumber key={s.label} value={s.value} suffix={s.suffix} delay={i * 0.15} />
        ))}
      </motion.div>
    </>
  );
}
