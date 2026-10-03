/* Individual event page. Every event gets the same honest skeleton — hero,
   facts, brief, rules, (schedule for tournaments), prizes, contacts, and a
   disabled register CTA — but distinct furniture: a per-event motif crest and
   wallpaper, a per-event background composite, and one of three layouts.
   Nothing here invents a fact: labels are real, values say "coming soon"
   until the team publishes them. The register button is the one true control
   on the page and it is cold — the accent never lands on it. */
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { eventCategories, eventMotifs, eventLayoutOverrides } from '../data/content';
import NotifyMe from '../components/NotifyMe';
import EventMotif from '../components/EventMotif';
import { resolveEventTheme, themeVars } from '../lib/eventTheme';
import { LAYOUT_DEFAULTS } from '../lib/eventBg';
import slugify from '../lib/slugify';
import usePageMeta from '../hooks/usePageMeta';

const COOL_FALLBACK = {
  accent: '#00a8e8',
  glow: 'rgba(0,168,232,0.32)',
  dim: 'rgba(0,168,232,0.06)',
  grid: 'rgba(0,240,255,0.045)',
  tagline: '',
};

const FACTS = [
  { key: 'when', label: 'When' },
  { key: 'where', label: 'Where' },
  { key: 'team', label: 'Team size' },
  { key: 'entry', label: 'Entry' },
];

const RULES = [
  { key: 'format', label: 'Format' },
  { key: 'eligibility', label: 'Eligibility' },
  { key: 'run', label: 'How it runs' },
];

/* Scroll-reveal for the sections below the hero. The hero animates on mount;
   these arrive as you scroll, once, and respect reduced motion. */
function Reveal({ reduceMotion, children, ...rest }) {
  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const reduceMotion = useReducedMotion();
  const slug = eventId ? eventId.toLowerCase() : '';
  const fallbackName = eventId ? eventId.replace(/-/g, ' ') : 'Event';

  let matched = null;
  if (slug) {
    outer:
    for (const cat of eventCategories) {
      for (const ev of cat.events || []) {
        if (ev.name && slugify(ev.name) === slug) {
          matched = { category: cat, event: ev };
          break outer;
        }
      }
    }
  }

  const eventName = matched ? matched.event.name : fallbackName;
  const theme = matched ? resolveEventTheme(matched.category, matched.event) : COOL_FALLBACK;
  const vars = themeVars(theme);

  const motif = matched ? (eventMotifs[matched.event.name] || 'gear') : 'gear';
  const layout =
    (matched && eventLayoutOverrides[matched.event.name]) ||
    (matched ? LAYOUT_DEFAULTS[matched.category.id] : 'blueprint') ||
    'blueprint';
  const isConstruction = matched && matched.category.id === 'construction';

  usePageMeta({
    title: matched ? `${matched.event.name} — AXIS'27` : `${eventName} — Event`,
    description: matched
      ? `${matched.event.desc} — ${matched.category.title} at AXIS'27, VNIT Nagpur.`
      : `${eventName} at AXIS'27, the annual technical festival of VNIT Nagpur. Details and notifications.`,
  });

  return (
    <div
      className={`event-page event-layout--${layout} page-dimmer`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
        ...vars,
      }}
    >
      {/* The world behind the interface is App's fixed living backdrop — the
          dune sea for warm-category events, the cosmic field for cool ones. The
          page-dimmer scrim keeps text legible over it; no media, no WebGL here. */}

      {/* Breadcrumb — the backlink plus where you are. The category is plain
          text because it has no page of its own; the listing (/events) is the
          link. A control stays cold on every palette. */}
      <motion.div
        className="event-page__nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="event-page__crumbs">
          <Link to="/events" className="backlink">Events</Link>
          {matched && matched.category && (
            <>
              <span className="event-page__crumb-sep" aria-hidden="true">/</span>
              <span className="event-page__crumb-here">{matched.category.title}</span>
            </>
          )}
        </div>
      </motion.div>

      <header className="event-hero">
        {matched && matched.category && (
          <motion.div
            className="event-hero__chip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>◆</span> {matched.category.title}
          </motion.div>
        )}

        {/* The one glyph that names this event — its crest */}
        <motion.div
          className="event-hero__crest"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <EventMotif motif={motif} size={46} />
        </motion.div>

        {matched && theme.tagline && (
          <motion.div
            className="event-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {theme.tagline}
          </motion.div>
        )}

        {/* Title with its watermark echo behind it */}
        <div className="event-hero__titlewrap" style={{ position: 'relative', width: '100%' }}>
          {matched && (
            <div className="event-watermark" aria-hidden="true">
              {eventName}
            </div>
          )}

          <motion.h1
            className="event-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {eventName}
          </motion.h1>
        </div>

        {matched && matched.event.desc && (
          <motion.p
            className="event-hero__desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {matched.event.desc}
          </motion.p>
        )}
      </header>

      <main className="event-main">
        {/* Facts — real labels, honest placeholders. Nothing invented here. */}
        <motion.div
          className="event-facts"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {FACTS.map((f) => (
            <div className="event-fact" key={f.key}>
              <span className="label">{f.label}</span>
              <span className="event-fact__value">Coming soon</span>
            </div>
          ))}
        </motion.div>

        <div className="event-content">
          <Reveal className="event-section panel" reduceMotion={reduceMotion}>
            <p className="eyebrow event-section__eyebrow">About</p>
            <h2 className="event-section__title">The brief</h2>
            <p className="event-section__body">
              The full brief for {eventName} is coming soon — format, problem statement and
              what you'll be graded on will land here before the fest.
            </p>
          </Reveal>

          <Reveal className="event-section panel" reduceMotion={reduceMotion}>
            <p className="eyebrow event-section__eyebrow">Rules</p>
            <h2 className="event-section__title">How it works</h2>
            <div className="event-rules">
              {RULES.map((r) => (
                <div className="event-rule" key={r.key}>
                  <span className="label">{r.label}</span>
                  <span className="event-fact__value">Coming soon</span>
                </div>
              ))}
            </div>
          </Reveal>

          {isConstruction && (
            <Reveal className="event-section panel" reduceMotion={reduceMotion}>
              <p className="eyebrow event-section__eyebrow">Materials</p>
              <h2 className="event-section__title">What you build with</h2>
              <p className="event-section__body">
                The materials list is coming soon. Expect the kit to be announced before the
                fest with enough lead time to plan your build.
              </p>
            </Reveal>
          )}

          {layout === 'stage' && (
            <Reveal className="event-section panel" reduceMotion={reduceMotion}>
              <p className="eyebrow event-section__eyebrow">Schedule</p>
              <h2 className="event-section__title">Rounds</h2>
              <div className="event-schedule">
                {['Round 1', 'Round 2', 'Finals'].map((round, i) => (
                  <div className="event-schedule__row" key={round}>
                    <span className="readout">{String(i + 1).padStart(2, '0')}</span>
                    <span className="label">{round}</span>
                    <span className="event-fact__value">Coming soon</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal className="event-section panel" reduceMotion={reduceMotion}>
            <p className="eyebrow event-section__eyebrow">Prizes</p>
            <h2 className="event-section__title">What's at stake</h2>
            <div className="event-prizes">
              {/* Prizes are a genuine sequence, so rank numbering is the one
                  numbering the site allows — same pattern as the schedule
                  rounds. The place name stays the honest label. */}
              {['1st Place', '2nd Place', '3rd Place'].map((place, i) => (
                <div className="event-prize" key={place}>
                  <span className="readout">{String(i + 1).padStart(2, '0')}</span>
                  <span className="event-prize__place">{place}</span>
                  <span className="event-fact__value">TBA</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="event-section panel" reduceMotion={reduceMotion}>
            <p className="eyebrow event-section__eyebrow">Contacts</p>
            <h2 className="event-section__title">Who to ask</h2>
            <div className="event-contact">
              <div className="event-contact__row">
                <span className="label">Points of contact</span>
                <span className="event-fact__value">Announced soon</span>
              </div>
            </div>
          </Reveal>

          {/* The page's one true CTA. Cold by rule: bone button, blue glow. */}
          <div className="event-cta">
            <button type="button" className="btn-primary" disabled>
              Register — Coming soon
            </button>
            <div className="event-cta__notify">
              <NotifyMe
                interest="events"
                title={`Be notified the moment "${eventName}" opens for registration.`}
                hint="Registration details land here before the fest."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}