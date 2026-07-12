import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SponsorsSection() {
  const categories = [
    { label: 'Title Sponsor', tier: 'title' },
    { label: 'Platinum Sponsors', tier: 'platinum' },
    { label: 'Gold Sponsors', tier: 'gold' },
    { label: 'Silver Sponsors', tier: 'silver' },
    { label: 'Partners', tier: 'partner' },
  ];

  return (
    <section id="sponsors" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Sponsors
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Partner with Central India's largest technical festival and connect with 35,000+ brilliant minds.
      </motion.p>

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '3rem',
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
        }}>
          Sponsorship Tiers
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.tier}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              style={{
                padding: '1.25rem',
                border: '1px solid rgba(229,169,60,0.1)',
                borderRadius: '2px',
                background: 'rgba(229,169,60,0.02)',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(229,169,60,0.1)'; }}
            >
              <span>{cat.label}</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}>
                Available
              </span>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <Link to="/contact" className="btn-primary">
            Become a Sponsor
          </Link>
        </div>
      </motion.div>
    </section>
  );
}