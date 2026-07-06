import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = [
  {
    role: 'Core Coordinators',
    members: [
      'Kanishk Pantawane',
      'Anuj Raut',
      'Krishna Prasad',
      'Sarth Dharpure',
      'Sourabh Waghmare',
    ],
  },
  {
    role: 'Treasurer',
    members: ['Tanas Adhikari'],
  },
  {
    role: 'Publicity In-charge',
    members: [
      'Harsh Ambade',
      'Krati Verma',
      'Krishita Nakhwa',
      'Prasad Kate',
      'Shivraj Rathod',
      'Shreyas Rane',
      'Soumya Mundhada',
      'Shrutik Unhale',
      'Utkarsha Shekhar',
    ],
  },
];

const allMembers = roles.flatMap((r) => r.members);

function getRole(name) {
  return roles.find((r) => r.members.includes(name))?.role || '';
}

function getInitials(name) {
  return name.split(' ').map((s) => s[0]).join('').slice(0, 2);
}

export default function CoreCommitteeSection() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="section" style={{ minHeight: 'auto', padding: '20px 5% 20px' }}>
      <h2 className="section-title">Core Committee</h2>

      <p className="section-subtitle" style={{ marginBottom: '1rem' }}>The 15-member core team steering AXIS'27</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        {allMembers.map((name) => {
          const isSelected = selected === name;
          return (
            <motion.button
              key={name}
              onClick={() => setSelected(isSelected ? null : name)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="glass-card"
              style={{
                padding: '1.5rem 1rem',
                border: isSelected ? '1px solid var(--gold)' : '1px solid transparent',
                cursor: 'pointer',
                textAlign: 'center',
                background: isSelected
                  ? 'rgba(229,169,60,0.12)'
                  : 'rgba(255,255,255,0.03)',
                transition: 'background 0.3s, border-color 0.3s',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '2px solid var(--violet)',
                  margin: '0 auto 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(139,92,246,0.05)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--violet)',
                  }}
                >
                  {getInitials(name)}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: isSelected ? 'var(--gold)' : 'var(--text-primary)',
                  marginBottom: '0.3rem',
                  transition: 'color 0.3s',
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--cyan)',
                  opacity: 0.8,
                }}
              >
                {getRole(name)}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(5, 8, 18, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '1rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                width: '320px',
                height: '320px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                ✕
              </button>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '2px solid var(--violet)',
                  margin: '0 auto 1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(139,92,246,0.05)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: 'var(--violet)',
                  }}
                >
                  {getInitials(selected)}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.6rem',
                }}
              >
                {selected}
              </h3>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--cyan)',
                  padding: '0.35rem 1.2rem',
                  border: '1px solid rgba(0,229,255,0.2)',
                  borderRadius: '20px',
                  display: 'inline-block',
                }}
              >
                {getRole(selected)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
