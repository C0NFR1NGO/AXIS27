import { useId, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import slugify from '../lib/slugify';
import EventMotif from './EventMotif';
import { eventMotifs } from '../data/content';

/* One emblem per domain — content marking, the same licence the event hero's
 * crest carries. Keys follow content.js's category ids; unmatched falls back
 * to the gear. */
const DOMAIN_MOTIFS = {
  management: 'trade',
  software: 'code',
  robotics: 'gear',
  construction: 'fabricate',
  devise: 'focus',
  'igniting-minds': 'atom',
  esports: 'game',
};

/* One of the five event domains.
 *
 * Structure notes, because two earlier versions got this wrong in opposite
 * directions:
 *
 * 1. The toggle is a real <button> with `aria-expanded` and `aria-controls`.
 *    The first version was a div with an onClick, which fired both the toggle
 *    and any `<Link>` a click landed on and was unreachable by keyboard. The
 *    button is still the single tab stop and the single accessible name.
 *
 * 2. The WHOLE CARD is clickable anyway: `.domain-card__toggle::before`
 *    stretches the button's hit area across the card (the classic
 *    "stretched button" pattern), so a click anywhere toggles while inner
 *    `<Link>`s stay above it via z-index and keep working as links. The very
 *    first version achieved whole-card clicking with onClick on the wrapper
 *    div — same visible result, broken semantics. This is the version that
 *    gets both.
 *
 * 3. Layout is centred with equal sizes via `.domain-grid` / `.domain-card`
 *    rather than inline flex sizing. See the DOMAIN CARDS block in global.css.
 */
export default function EventCard({ category, index }) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  /* Ties the button to the region it controls. Generated rather than derived
   * from `category.id` so the component stays correct if it is ever rendered
   * twice on one page. */
  const panelId = `${useId()}-events`;

  const count = category.events.length;

  return (
    <motion.article
      layout
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.65,
        delay: reduceMotion ? 0 : index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="panel domain-card"
    >
      <div className="domain-card__crest" aria-hidden="true">
        <EventMotif motif={DOMAIN_MOTIFS[category.id] || 'gear'} size={26} />
      </div>

      <span className="label label--blue" style={{ letterSpacing: '0.15em', marginBottom: '0.35rem' }}>
        {category.subtitle}
      </span>

      <h3 className="domain-card__title">{category.title}</h3>

      <p className="domain-card__desc">{category.description}</p>

      {/* The count is real — it is the length of the list this opens — so it
          belongs in the label. "Show 8 events" tells you what you are getting
          before you commit to the scroll. */}
      <button
        type="button"
        className="domain-card__toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? 'Hide events' : `Show ${count} ${count === 1 ? 'event' : 'events'}`}
        <span className="domain-card__chevron" aria-hidden="true">
          ▼
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{ overflow: 'hidden', width: '100%' }}
          >
            <div className="domain-card__events">
              {category.events.map((event) => {
                const slug = slugify(event.name);
                return (
                  <Link key={event.name} to={`/events/${slug}`} className="domain-event">
                    <span className="domain-event__motif" aria-hidden="true">
                      <EventMotif motif={eventMotifs[event.name] || 'gear'} size={13} />
                    </span>
                    <span className="domain-event__name">{event.name}</span>
                    <span className="domain-event__desc" style={{ display: 'block' }}>
                      {event.desc}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
