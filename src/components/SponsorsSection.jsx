import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrambleTitle from './ScrambleTitle';
import NotifyMe from './NotifyMe';

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="section">
      <ScrambleTitle text="Sponsors" />

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Partner with Central India's largest technical festival and put your brand in front of 35,000+ students.
      </motion.p>

      <motion.div
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: '3rem 2.5rem',
          maxWidth: '900px',
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
          Sponsorship Tiers
        </div>
        {/* Was `// PROSPECTUS COMING SOON — PARTNERSHIPS OPEN NOW //`. An empty
            state is an invitation, so it now says the useful half plainly. */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--t-small)',
          color: 'var(--text-dim)',
          marginBottom: '2.2rem',
        }}>
          The prospectus is on its way. Partnerships are open now.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem' }}>
          <Link to="/contact" className="btn-primary">
            Contact Us to Be a Sponsor
          </Link>
          <NotifyMe
            interest="sponsorship"
            title="Want the full sponsorship prospectus? Leave your email and we'll send it over the moment it's ready."
            hint="// PROSPECTUS DELIVERY INCOMING //"
          />
        </div>
      </motion.div>
    </section>
  );
}
