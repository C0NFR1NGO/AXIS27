import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'axis27-notify-list';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const isWeb3FormsConfigured = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY.length > 10;

/**
 * NotifyMe — shared "notify me when live" email capture.
 * Stores emails in localStorage under a shared key so every
 * Coming Soon card builds the same pre-launch mailing list.
 */
export function getNotifyList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addNotifyEmail(email, interest = 'general') {
  const list = getNotifyList();
  if (list.some(entry => entry.email.toLowerCase() === email.toLowerCase())) return list;
  const next = [...list, { email, interest, at: new Date().toISOString() }];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export default function NotifyMe({ interest = 'general', _compact = false, title, hint }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error
  const [existing, setExisting] = useState(false);
  const [errorKind, setErrorKind] = useState('validation'); // validation | send

  useEffect(() => {
    const list = getNotifyList();
    if (list.length > 0) {
      // Mark as already opted-in if the same device already registered
      setExisting(list.length > 0);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorKind('validation');
      setStatus('error');
      return;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.trim())) {
      setErrorKind('validation');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    const list = getNotifyList();
    const trimmed = email.trim();    const isDuplicate = list.some(entry => entry.email.toLowerCase() === trimmed.toLowerCase());

    // No key configured (local dev): keep the localStorage ledger flow.
    if (!isWeb3FormsConfigured) {
      setTimeout(() => {
        if (!isDuplicate) addNotifyEmail(trimmed, interest);
        setStatus('done');
      }, 350);
      return;
    }

    if (isDuplicate) {
      setStatus('done');
      return;
    }

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `AXIS'27 notify-me: ${interest}`,
          from_name: "AXIS'27 Website",
          email: trimmed,
          message: `Launch notification signup — interest: ${interest}, page: ${window.location.pathname}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Submission failed');
      }
      addNotifyEmail(trimmed, interest);
      setStatus('done');
    } catch {
      // Keep the lead locally even if the upstream send fails.
      addNotifyEmail(trimmed, interest);
      setErrorKind('send');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          padding: '0.9rem 1.4rem',
          border: '1px solid rgba(229,169,60,0.25)',
          borderRadius: '2px',
          background: 'rgba(201,145,26,0.06)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--gold-light)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ color: 'var(--spice-blue)' }}>■</span>
        {existing ? 'ALREADY ON THE LIST — WE\'LL NOTIFY YOU' : 'REGISTERED — WE\'LL NOTIFY YOU WHEN THIS GOES LIVE'}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.88rem',
        color: 'var(--text-secondary)',
        letterSpacing: '0.03em',
        marginBottom: '0.9rem',
        lineHeight: 1.6,
      }}>
        {title ?? 'Want to be the first to know? Drop your email and we\'ll ping you the moment this goes live.'}
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); setErrorKind('validation'); }}
          placeholder="your@email.com"
          aria-label="Email address for launch notifications"
          style={{
            flex: '1 1 240px',
            padding: '0.75rem 1rem',
            background: 'rgba(0,0,0,0.35)',
            border: `1px solid ${status === 'error' ? 'var(--cyber-red)' : 'rgba(0,229,255,0.18)'}`,
            borderLeft: '3px solid var(--spice-blue)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            outline: 'none',
            transition: 'border-color 0.25s var(--ease-cyber), box-shadow 0.25s var(--ease-cyber)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = status === 'error' ? 'var(--cyber-red)' : 'var(--spice-blue)';
            e.currentTarget.style.boxShadow = '0 0 14px rgba(0,229,255,0.12)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = status === 'error' ? 'var(--cyber-red)' : 'rgba(0,229,255,0.18)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-secondary"
          style={{
            padding: '0.75rem 1.6rem',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            opacity: status === 'submitting' ? 0.55 : 1,
            pointerEvents: status === 'submitting' ? 'none' : 'auto',
          }}
        >
          {status === 'submitting' ? 'SYNCING...' : 'NOTIFY ME ▸'}
        </button>
      </div>
      {status === 'error' && (
        <div style={{
          marginTop: '0.6rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--cyber-red)',
          letterSpacing: '0.06em',
        }}>
          {errorKind === 'send'
            ? '// TRANSMISSION FAILED — SAVED LOCALLY, PLEASE RETRY //'
            : email.trim()
              ? '// INVALID EMAIL FORMAT //'
              : '// EMAIL REQUIRED //'}
        </div>
      )}
      {hint && (
        <div style={{
          marginTop: '0.6rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          opacity: 0.55,
        }}>
          {hint}
        </div>
      )}
    </form>
  );
}
