import { motion } from 'framer-motion';

export default function AccommodationSection() {
  return (
    <section id="accommodation" className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        Accommodation
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Comfortable stay arrangements within the VNIT campus for all out-of-town participants.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="glass-card"
        style={{
          maxWidth: '600px',
          width: '100%',
          padding: '2.5rem',
        }}
      >
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.9,
          textAlign: 'center',
        }}>
          Accommodation details including registration, fees, and facilities will be announced closer to the event dates.
          For inquiries, reach out to our team.
        </div>

        <div style={{
          display: 'flex',
          gap: '0.8rem',
          justifyContent: 'center',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
        }}>
          {['Campus Hostels', 'Separate Blocks', '24/7 Security'].map((feature) => (
            <div
              key={feature}
              style={{
                padding: '0.5rem 1.2rem',
                border: '1px solid rgba(229,169,60,0.25)',
                borderRadius: '2px',
                fontFamily: "var(--font-body)",
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: 'var(--gold)',
                background: 'rgba(229,169,60,0.05)',
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
