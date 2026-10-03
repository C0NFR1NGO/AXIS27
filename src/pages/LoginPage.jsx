import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import usePageMeta from '../hooks/usePageMeta';

const ease = [0.22, 1, 0.36, 1];

export default function LoginPage() {
  usePageMeta({ title: 'Login', description: 'Sign in to access your AXIS dashboard and register for events.' });
  const { user, loading, signInWithGoogle } = useAuth();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (user && !loading) {
      window.location.replace('/dashboard');
    }
  }, [user, loading]);

  if (loading) return null;
  if (user) return null;

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // silently fail — Supabase may not be configured
    }
  };

  return (
    <div className="page-dimmer" style={{
      paddingTop: 'var(--nav-height)',
      position: 'relative', zIndex: 1, minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ padding: '2rem 5% 0', width: '100%', display: 'flex', justifyContent: 'flex-start' }}
      >
        <Link to="/" className="backlink">← Back to Home</Link>
      </motion.div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 5% 4rem', width: '100%' }}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          style={{
            width: '100%', maxWidth: '420px',
            borderRadius: '2px',
            border: '1px solid rgba(0,168,232,0.18)',
            background: 'linear-gradient(180deg, rgba(13,10,8,0.95), rgba(7,5,3,0.98))',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,168,232,0.04)',
            padding: '2.5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top-edge cyan line */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--blue), transparent)',
          }} />

          {/* Eyebrow */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
            fontSize: 'var(--t-label)', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--text-dim)', marginBottom: '0.5rem', textAlign: 'center',
          }}>
            {'> IDENTITY // AUTHENTICATE'}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--text)', textAlign: 'center', marginBottom: '0.6rem',
          }}>
            Sign In
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--t-small)',
            color: 'var(--text-dim)', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.6,
          }}>
            Use your Google account to access your AXIS dashboard, register for events, and manage your bookings.
          </p>

          {/* Google button */}
          <button onClick={handleLogin} style={{
            width: '100%', padding: '0.85rem 1rem',
            fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
            fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--blue)', background: 'rgba(0,168,232,0.14)',
            border: '1px solid rgba(0,168,232,0.5)',
            borderRadius: '2px', cursor: 'pointer',
            boxShadow: '0 0 14px rgba(0,168,232,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            transition: 'all 0.3s var(--ease-cyber)',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,168,232,0.25)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0,168,232,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,168,232,0.14)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(0,168,232,0.12)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Fine print */}
          <p style={{
            fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
            fontSize: '0.6rem', color: 'var(--text-dim)', opacity: 0.6,
            textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.5,
          }}>
            By signing in you agree to the festival's terms of participation.
            Your profile is used only for event registration and identification.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
