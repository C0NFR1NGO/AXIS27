import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ease = [0.22, 1, 0.36, 1];

function ArrowLeftIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function makeStars(count, sizeMax, alphaMax) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 100).toFixed(2);
    const y = (Math.random() * 100).toFixed(2);
    const r = (Math.random() * sizeMax + 0.6).toFixed(1);
    const a = (Math.random() * alphaMax + 0.15).toFixed(2);
    arr.push(`${x}% ${y}% 0 ${r}px rgba(255,255,255,${a})`);
  }
  return arr.join(', ');
}

function Starfield() {
  const nearStars = useMemo(() => makeStars(110, 1.5, 0.75), []);
  const farStars = useMemo(() => makeStars(150, 1.0, 0.5), []);

  return (
    <>
      {/* Near stars — twinkle slow */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          boxShadow: nearStars,
        }}
      />
      {/* Far stars — twinkle offset */}
      <motion.div
        animate={{ opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          boxShadow: farStars,
        }}
      />
    </>
  );
}

function AmbientBackdrop() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Starfield />
      {/* Gold aurora glow */}
      <motion.div
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-12%', left: '-10%',
          width: '52vw', height: '52vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,169,60,0.14) 0%, transparent 65%)',
          filter: 'blur(30px)',
        }}
      />
      {/* Blue aurora glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.45, 0.2], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-14%', right: '-8%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 65%)',
          filter: 'blur(30px)',
        }}
      />
      {/* Cyber grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        backgroundSize: '52px 52px', opacity: 0.6,
      }} />
      {/* Dust motes */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: [
          'radial-gradient(0.8px 0.8px at 14% 22%, rgba(229,169,60,0.5), transparent)',
          'radial-gradient(0.8px 0.8px at 78% 16%, rgba(0,229,255,0.45), transparent)',
          'radial-gradient(0.7px 0.7px at 46% 68%, rgba(229,169,60,0.4), transparent)',
          'radial-gradient(0.6px 0.6px at 88% 54%, rgba(0,229,255,0.35), transparent)',
          'radial-gradient(0.7px 0.7px at 30% 84%, rgba(255,51,85,0.3), transparent)',
        ].join(','),
        backgroundSize: '420px 420px, 520px 520px, 600px 600px, 480px 480px, 560px 560px',
        opacity: 0.35,
      }} />
    </div>
  );
}

function BackgroundBackdrop() {
  const textRef = useRef(null);
  const [yScale, setYScale] = useState(1);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const compute = () => {
      const h = el.offsetHeight;
      if (h > 0) setYScale((window.innerHeight / h) * 1.4);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 1,
        pointerEvents: 'none', opacity: 0.8, overflow: 'hidden',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
      }}
    >
      {/* Giant "404" */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          ref={textRef}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(220px, 48vw, 820px)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
            transform: `scale(1.15, ${yScale})`,
            transformOrigin: 'center',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(0,229,255,0.5) 52%, rgba(229,169,60,0.32) 76%, rgba(0,0,0,0) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 120px rgba(0,229,255,0.12)',
          }}
        >
          404
        </div>
      </div>

      {/* Cyber ellipse portal */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${yScale})`, transformOrigin: 'center' }}>
        <div style={{
          position: 'relative',
          width: 'clamp(140px, 22vw, 420px)',
          height: 'clamp(160px, 30vh, 55vh)',
          borderRadius: '50%',
          border: '2px solid rgba(0,229,255,0.25)',
          boxShadow: 'inset 0 0 60px rgba(0,229,255,0.14), 0 0 80px rgba(0,229,255,0.12), 0 0 30px rgba(229,169,60,0.12)',
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: -10, borderRadius: '50%',
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(0,229,255,0.4) 350deg, rgba(229,169,60,0.5) 360deg)',
              filter: 'blur(3px)',
              WebkitMaskImage: 'radial-gradient(circle, transparent 40%, black 70%)',
              maskImage: 'radial-gradient(circle, transparent 40%, black 70%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CenterEmblem() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: 'calc(-6vh - 40px)', pointerEvents: 'none',
    }}>
      <div style={{ position: 'relative', width: 'clamp(120px, 20vw, 190px)', aspectRatio: '1' }}>
        <motion.div
          animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: -22, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229,169,60,0.3) 0%, rgba(229,169,60,0.06) 50%, transparent 75%)',
            filter: 'blur(10px)',
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: -10, borderRadius: '50%',
            border: '2px solid rgba(0,229,255,0.12)',
            borderTopColor: '#00e5ff',
            borderRightColor: 'rgba(0,229,255,0.5)',
            boxShadow: '0 0 24px rgba(0,229,255,0.25)',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px solid rgba(229,169,60,0.1)',
            borderLeftColor: 'var(--gold)',
            borderBottomColor: 'rgba(229,169,60,0.4)',
            boxShadow: '0 0 14px rgba(229,169,60,0.08)',
          }}
        />
        <motion.img
          src="/images/logo-icon.webp"
          alt="AXIS'27"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
            filter: 'drop-shadow(0 0 18px rgba(0,229,255,0.5)) drop-shadow(0 0 6px rgba(229,169,60,0.3))',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <>
      <AmbientBackdrop />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        <BackgroundBackdrop />
        <CenterEmblem />

        <div style={{
          position: 'relative', zIndex: 3,
          marginTop: 'auto', paddingBottom: '4.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', paddingLeft: '1rem', paddingRight: '1rem',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              marginBottom: '1.2rem',
              opacity: 0.6,
            }}
          >
            // SIGNAL_LOST // COORDINATES_OUT_OF_BOUNDS //
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 'clamp(1.25rem, 3.5vw, 2rem)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: '#fff',
              marginBottom: '0.9rem',
            }}
          >
            THIS DIRECTIVE DOES NOT EXIST.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              marginBottom: '2.2rem',
              maxWidth: '420px',
            }}
          >
            The page you're looking for has drifted beyond the deep desert — into the infinite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease }}
          >
            <Link
              to="/"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}
            >
              <ArrowLeftIcon size={18} />
              Return to Base
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
