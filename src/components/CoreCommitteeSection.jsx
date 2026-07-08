import { motion } from 'framer-motion';

export default function CoreCommitteeSection() {
  const members = [
    { role: 'Overall Coordinator', name: 'To be announced' },
    { role: 'Technical Head', name: 'To be announced' },
    { role: 'PR & Sponsorship Head', name: 'To be announced' },
    { role: 'Creative Head', name: 'To be announced' },
    { role: 'Logistics Head', name: 'To be announced' },
    { role: 'Content & Marketing Head', name: 'To be announced' },
    { role: 'Treasurer', name: 'To be announced' },
  ];

  return (
    <section className="section" style={{ minHeight: 'auto', padding: '40px 5% 40px' }}>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        // CORE_COMMITTEE_LOADED //
      </motion.h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        width: '100%',
        maxWidth: '1000px',
      }}>
        {members.map((m, i) => (
          <motion.div
            key={m.role}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '1.25rem',
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--spice-blue)',
                boxShadow: '0 0 8px var(--spice-blue)',
                margin: '0 auto 0.5rem',
              }}
            />
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--spice-blue)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.4rem',
            }}>
              {m.role}
            </div>
            <div style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}>
              {m.name}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}