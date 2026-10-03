import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import usePageMeta from '../hooks/usePageMeta';

const ease = [0.22, 1, 0.36, 1];

const QUICK_ACTIONS = [
  { id: 'events', label: 'Events', eyebrow: '> COMPETE', desc: '35+ events across management, software, robotics, construction, and innovation.', link: '/events', accent: 'var(--blue)' },
  { id: 'workshops', label: 'Workshops', eyebrow: '> LEARN', desc: 'Hands-on sessions led by industry experts and faculty mentors.', link: '/workshops', accent: 'var(--blue)' },
  { id: 'accommodation', label: 'Accommodation', eyebrow: '> LODGE', desc: 'Campus and nearby accommodation options for outstation participants.', link: '/accommodation', accent: 'var(--sand)' },
];

function CornerTicks() {
  return (
    <>
      <span style={{ position: 'absolute', top: '10px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--blue)', opacity: 0.3 }}>┌</span>
      <span style={{ position: 'absolute', top: '10px', right: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--blue)', opacity: 0.3 }}>┐</span>
      <span style={{ position: 'absolute', bottom: '10px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--blue)', opacity: 0.3 }}>└</span>
      <span style={{ position: 'absolute', bottom: '10px', right: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--blue)', opacity: 0.3 }}>┘</span>
    </>
  );
}

function StatCard({ label, value, sub, icon, accent, delay, reduceMotion }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease }}
      style={{
        borderRadius: '2px',
        border: '1px solid rgba(0,168,232,0.08)',
        background: 'rgba(12,9,6,0.6)',
        padding: '1.2rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
        flex: '1 1 200px',
        minWidth: 0,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}30`; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 12px ${accent}08`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,168,232,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.4 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
          fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--text-dim)',
        }}>
          {label}
        </span>
        <span style={{ fontSize: '1.1rem', opacity: 0.6 }}>{icon}</span>
      </div>

      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700, letterSpacing: '0.06em',
        color: 'var(--text)', lineHeight: 1,
        marginBottom: '0.3rem',
      }}>
        {value}
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
        fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
        color: accent, opacity: 0.7,
      }}>
        {sub}
      </div>
    </motion.div>
  );
}

function AxisIdCard({ profile, onRetryAxisId, reduceMotion }) {
  const [copied, setCopied] = useState(false);
  const axisId = profile?.axis_id;

  const handleCopy = useCallback(() => {
    if (!axisId) return;
    navigator.clipboard.writeText(axisId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [axisId]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease }}
      style={{
        borderRadius: '2px',
        border: '1px solid rgba(0,168,232,0.15)',
        background: 'linear-gradient(160deg, rgba(0,168,232,0.04) 0%, rgba(7,5,3,0.98) 30%, rgba(7,5,3,1) 70%, rgba(0,168,232,0.02) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(0,168,232,0.04), inset 0 1px 0 rgba(0,168,232,0.06)',
        padding: '2rem 1.75rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        flex: '1 1 380px',
        maxWidth: '480px',
      }}
    >
      <CornerTicks />

      {/* Top LED strip */}
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--blue), transparent)', opacity: 0.5 }} />

      {/* Background grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.012, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,168,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,232,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75", fontSize: 'var(--t-label)', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
          {'> CREDENTIAL // VERIFIED'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75", fontSize: '0.5rem', letterSpacing: '0.15em', color: 'var(--text-dim)', opacity: 0.5, padding: '0.2rem 0.5rem', border: '1px solid rgba(0,168,232,0.1)', borderRadius: '2px' }}>
          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : '----'}
        </span>
      </div>

      {/* AXIS ID */}
      <div style={{ textAlign: 'center', marginBottom: '0.3rem' }}>
        {axisId ? (
          <div
            onClick={handleCopy}
            title="Click to copy"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #00a8e8 0%, #00d4ff 40%, #00a8e8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1, cursor: 'pointer', position: 'relative',
            }}
          >
            {axisId}
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute', bottom: '-1.2rem', left: '50%', transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
                  fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--blue)',
                }}
              >
                COPIED
              </motion.span>
            )}
          </div>
        ) : (
          <button onClick={onRetryAxisId} style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--text-dim)', background: 'none',
            border: '1px dashed rgba(0,168,232,0.2)', borderRadius: '2px',
            padding: '0.2rem 1rem', cursor: 'pointer', transition: 'all 0.3s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,168,232,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,168,232,0.2)'; }}
          >
            CLICK TO GENERATE
          </button>
        )}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75", fontSize: '0.5rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--ember)', marginBottom: '1.2rem', textAlign: 'center', opacity: 0.7 }}>
        IGNIS AETERNUM — AXIS&apos;27
      </div>

      {/* Separator */}
      <div style={{ width: '100%', height: '1px', marginBottom: '1rem', background: 'linear-gradient(90deg, transparent, rgba(0,168,232,0.15), transparent)' }} />

      {/* Profile row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '2px', border: '1px solid rgba(0,168,232,0.15)', overflow: 'hidden', flexShrink: 0, background: 'rgba(0,168,232,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--blue)', opacity: 0.5 }}>
              {(profile?.full_name || 'U')[0].toUpperCase()}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-small)', color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profile?.full_name || 'Your Name'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75", fontSize: '0.65rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profile?.email || 'your@email.com'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ section, index, reduceMotion }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 + index * 0.08, ease }}
      style={{
        borderRadius: '2px',
        border: '1px solid rgba(0,168,232,0.08)',
        background: 'rgba(12,9,6,0.6)',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${section.accent}30`; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 12px ${section.accent}08`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,168,232,0.08)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <Link to={section.link} style={{ textDecoration: 'none', display: 'block', padding: '1.25rem 1.25rem 1.1rem' }}>
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${section.accent}, transparent)`, opacity: 0.3 }} />

        <div style={{ fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75", fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
          {section.eyebrow}
        </div>

        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '0.5rem' }}>
          {section.label}
        </div>

        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
          {section.desc}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
          fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: section.accent, display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.4rem 0.7rem',
          border: `1px solid ${section.accent}20`,
          borderRadius: '2px',
          background: `${section.accent}06`,
        }}>
          Open →
        </div>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  usePageMeta({ title: 'Dashboard', description: 'Your AXIS dashboard — manage registrations, bookings, and your AXIS ID.' });
  const { user, profile, loading, signOut, retryAxisId } = useAuth();
  const reduceMotion = useReducedMotion();

  if (loading) return null;

  return (
    <div className="page-dimmer" style={{
      paddingTop: 'var(--nav-height)',
      position: 'relative', zIndex: 1, minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {/* Top bar */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '1.5rem 5% 0', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px' }}
      >
        <Link to="/" className="backlink">← Back to Home</Link>
        <button onClick={signOut} style={{
          fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
          fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-dim)', background: 'none',
          border: '1px solid rgba(242,228,204,0.1)',
          borderRadius: '2px', padding: '0.4rem 1rem', cursor: 'pointer',
          transition: 'all 0.3s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,51,85,0.35)'; e.currentTarget.style.color = '#ff3355'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(242,228,204,0.1)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
        >
          Sign out
        </button>
      </motion.div>

      <div style={{
        flex: 1, padding: '1.5rem 5% 4rem', width: '100%',
        maxWidth: '1200px',
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
      }}>
        {/* Greeting */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
            fontSize: 'var(--t-label)', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--text-dim)', marginBottom: '0.2rem',
          }}>
            {'> WELCOME BACK'}
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--text)',
          }}>
            {profile?.full_name?.split(' ')[0] || 'Participant'}
          </div>
        </motion.div>

        {/* Stat cards row */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <StatCard label="Events" value="35+" sub="COMING SOON" icon="⚡" accent="var(--blue)" delay={0.1} reduceMotion={reduceMotion} />
          <StatCard label="Workshops" value="10+" sub="COMING SOON" icon="🔧" accent="var(--blue)" delay={0.15} reduceMotion={reduceMotion} />
          <StatCard label="Domains" value="5" sub="CSE · ECE · MECH · CIVIL · MGMT" icon="◎" accent="var(--sand)" delay={0.2} reduceMotion={reduceMotion} />
          <StatCard label="Status" value="LIVE" sub={profile?.axis_id ? 'AXIS ID ACTIVE' : 'AXIS ID PENDING'} icon={profile?.axis_id ? '●' : '○'} accent={profile?.axis_id ? 'var(--ember)' : 'var(--text-dim)'} delay={0.25} reduceMotion={reduceMotion} />
        </div>

        {/* Main content grid: AXIS ID card + Quick actions */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
          <AxisIdCard profile={profile} onRetryAxisId={retryAxisId} reduceMotion={reduceMotion} />

          {/* Quick actions column */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                fontFamily: 'var(--font-mono)', fontVariationSettings: "'wdth' 75",
                fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--text-dim)',
              }}
            >
              {'> QUICK ACCESS'}
            </motion.div>

            {QUICK_ACTIONS.map((s, i) => (
              <QuickActionCard key={s.id} section={s} index={i} reduceMotion={reduceMotion} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
