import { motion } from 'framer-motion';

export default function TeamCategoriesSection() {
  const domains = [
    { name: 'Technical', lead: 'To be announced', desc: 'Event planning, robotics, coding — the technical backbone' },
    { name: 'Public Relations', lead: 'To be announced', desc: 'Sponsorships, outreach, media & college ambassador network' },
    { name: 'Design & Creative', lead: 'To be announced', desc: 'Brand identity, graphics, UI/UX, and creative direction' },
    { name: 'Logistics', lead: 'To be announced', desc: 'Infrastructure, accommodation, transportation & venue management' },
    { name: 'Content & Marketing', lead: 'To be announced', desc: 'Copywriting, social media, campaign strategy & storytelling' },
  ];

  return (
    <section className="section" style={{ minHeight: 'auto', paddingBottom: '100px' }}>
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
        // DOMAIN ALLOCATION MATRIX //
      </motion.h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1100px',
      }}>
        {domains.map((d, i) => (
          <motion.div
            key={d.name}
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '1.5rem',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--spice-blue)',
              letterSpacing: '0.1em',
              marginBottom: '0.6rem',
              opacity: 0.7,
            }}>
              // DOMAIN_{String(i + 1).padStart(2, '0')} //
            </div>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.5rem',
            }}>
              {d.name}
            </div>
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: '0.8rem',
            }}>
              {d.desc}
            </p>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              paddingTop: '0.6rem',
            }}>
              LEAD: {d.lead}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}