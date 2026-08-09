import { motion } from 'framer-motion';
import ScrambleTitle from './ScrambleTitle';
import NotifyMe from './NotifyMe';

export default function WorkshopsSection() {
  return (
    <section id="workshops" className="section">
      <ScrambleTitle text="Workshops" />

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Learn by doing — hands-on sessions led by industry mentors and student experts, across six domains.
      </motion.p>

      <motion.div
        className="glass-card"
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
          color: 'var(--gold)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '0.4rem',
        }}>
          Lineup Being Finalized
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          opacity: 0.5,
          marginBottom: '2.2rem',
        }}>
          // WORKSHOP_DOMAINS_LOCKED //
        </div>

        <NotifyMe
          interest="workshops"
          hint="// SESSION SCHEDULE + REGISTRATION OPENS SOON //"
        />
      </motion.div>
    </section>
  );
}
