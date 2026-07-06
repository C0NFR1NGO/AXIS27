import { motion } from 'framer-motion';

const sponsorTiers = [
  { tier: 'Title Sponsor', companies: ['Your Brand Here'] },
  { tier: 'Co-Title Sponsor', companies: ['Your Brand Here'] },
  { tier: 'Associate Sponsors', companies: ['Your Brand Here', 'Your Brand Here'] },
];

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
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
        Partner with AXIS'27 — connect with 35,000+ brilliant minds from across India.
      </motion.p>

      <div style={{ width: '100%', maxWidth: '900px' }}>
        {sponsorTiers.map((tier, ti) => (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: ti * 0.15 }}
            style={{ marginBottom: '2.5rem', textAlign: 'center' }}
          >
            <div style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--cyan)',
              marginBottom: '1rem',
            }}>
              {tier.tier}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
            }}>
              {tier.companies.map((company, ci) => (
                <div
                  key={`${company}-${ci}`}
                  className="glass-card"
                  style={{
                    padding: '1.5rem 3rem',
                    cursor: 'default',
                    minWidth: '200px',
                    textAlign: 'center',
                    transition: 'border-color 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--spice-blue)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(229,169,60,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: 'var(--text-secondary)',
                  }}>
                    {company}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
