import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ScrambleTitle from './ScrambleTitle';
import NotifyMe from './NotifyMe';
import EventMotif from './EventMotif';
import { workshops } from '../data/content';

const ease = [0.22, 1, 0.36, 1];

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function WorkshopCard({ workshop, onOpen }) {
  return (
    <div className="workshop-card panel">
      <EventMotif motif="gear" size={30} style={{ color: 'var(--text-dim)' }} />
      <h3 className="workshop-card__title">{workshop.title}</h3>
      <div className="workshop-tagline">{workshop.tagline}</div>

      <p className="workshop-card__teaser">{workshop.teaser}</p>

      <div className="workshop-card__facts">
        <span className="workshop-card__fact">{workshop.date}</span>
        <span className="workshop-card__fact">{workshop.venue}</span>
        <span className="workshop-card__fact">{workshop.fee}</span>
      </div>

      <div className="workshop-card__actions">
        <a className="btn-primary" href={workshop.registerUrl} target="_blank" rel="noopener noreferrer">
          Register ▸
        </a>
        <button
          type="button"
          className="btn-secondary"
          onClick={(e) => onOpen(workshop.id, e.currentTarget)}
          aria-haspopup="dialog"
        >
          Details
        </button>
      </div>
    </div>
  );
}

/* Portal to document.body: any ancestor with a transform or filter silently
   becomes the containing block for position:fixed, which centered the modal
   against the whole page instead of the visible window. Outside that subtree
   the overlay is viewport-true. Body scroll is not locked — the page behind
   stays scrollable, and the frame itself scrolls when its content is tall. */
function WorkshopModal({ workshop, onClose }) {
  const reduce = useReducedMotion();
  const frameRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    frameRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="workshop-modal"
      role="dialog"
      aria-modal="true"
      aria-label={workshop.title}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        ref={frameRef}
        className="workshop-modal__frame"
        tabIndex={-1}
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease }}
      >
        <button type="button" className="workshop-modal__close" onClick={onClose} aria-label="Close workshop details">
          <CloseIcon />
        </button>

        <EventMotif motif="gear" size={30} style={{ color: 'var(--text-dim)', marginBottom: '0.7rem' }} />
        <h3 className="workshop-modal__title">{workshop.title}</h3>
        <div className="workshop-tagline">{workshop.tagline}</div>

        <div className="workshop-modal__facts">
          <div className="workshop-fact">
            <span className="workshop-fact__label">Date</span>
            <span className="workshop-fact__value">{workshop.date}</span>
          </div>
          <div className="workshop-fact">
            <span className="workshop-fact__label">Venue</span>
            <span className="workshop-fact__value">{workshop.venue}</span>
          </div>
          <div className="workshop-fact">
            <span className="workshop-fact__label">Eligibility</span>
            <span className="workshop-fact__value">{workshop.eligibility}</span>
          </div>
          <div className="workshop-fact">
            <span className="workshop-fact__label">Registration Fee</span>
            <span className="workshop-fact__value">{workshop.fee}</span>
          </div>
        </div>

        <p className="workshop-modal__desc">{workshop.description}</p>

        <a className="btn-primary" href={workshop.registerUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: '0.4rem' }}>
          Register ▸
        </a>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export default function WorkshopsSection() {
  const [activeId, setActiveId] = useState(null);
  // The card that opened the modal, captured in its own click handler, so
  // focus returns to it when the modal closes — the gallery lightbox pattern.
  const triggerRef = useRef(null);
  const active = workshops.find((w) => w.id === activeId) || null;

  const openFrom = (id, el) => {
    triggerRef.current = el;
    setActiveId(id);
  };

  const close = () => {
    setActiveId(null);
    triggerRef.current?.focus?.();
  };

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
        style={{ width: '100%' }}
      >
        <div className="workshop-grid">
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} onOpen={openFrom} />
          ))}
        </div>
      </motion.div>

      {/* Was the "Lineup Being Finalized" panel — now that a workshop is live
          the invitation moves under the cards and speaks only about the rest
          of the lineup. */}
      <div style={{ width: '100%', marginTop: '3rem' }}>
        <NotifyMe
          interest="workshops"
          title="More workshops are being finalised — drop your email and we'll ping you as each one opens."
        />
      </div>

      <AnimatePresence>
        {active && <WorkshopModal key={active.id} workshop={active} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
