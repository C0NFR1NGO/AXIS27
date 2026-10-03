import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrambleTitle from './ScrambleTitle';
import NotifyMe from './NotifyMe';

export default function AccommodationSection() {
  return (
    <section id="accommodation" className="section">
      <ScrambleTitle text="Accommodation" />

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Coming to Nagpur from out of town? Here's what to expect while we finalize arrangements.
      </motion.p>

      <motion.div
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '3rem 2.5rem',
          maxWidth: '760px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '0.4rem',
        }}>
          Stay Options
        </div>
        {/* Was `// ARRANGEMENTS BEING FINALIZED — VNIT CAMPUS & SURROUNDINGS //`.
            The sentence was real information wearing a machine costume; the
            slashes and the shouting are gone and the sentence stayed. */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--t-small)',
          color: 'var(--text-dim)',
          marginBottom: '2.2rem',
        }}>
          Arrangements are being finalised across the VNIT campus and nearby.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem' }}>
          <Link to="/contact" className="btn-primary">
            For Queries, Contact Us
          </Link>
          <NotifyMe
            interest="accommodation"
            title="Outstation participant? Join the waitlist — we'll announce hostel allotment and partner-hotel rates first."
            hint="// WAITLIST OPENS CLOSER TO FEST DATES //"
          />
        </div>
      </motion.div>
    </section>
  );
}
