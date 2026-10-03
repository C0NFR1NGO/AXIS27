import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EventsSection from '../components/EventsSection';
import { eventCategories } from '../data/content';
import usePageMeta from '../hooks/usePageMeta';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EventSeries',
  name: "AXIS'27 — Ignis Aeternum",
  description: "Central India's largest technical festival at VNIT Nagpur. 35+ events across management, software, robotics, construction, design, and gaming.",
  url: 'https://axis27alt.vercel.app/events',
  organizer: {
    '@type': 'Organization',
    name: 'AXIS, VNIT Nagpur',
    url: 'https://axis27alt.vercel.app',
  },
  location: {
    '@type': 'Place',
    name: 'Visvesvaraya National Institute of Technology',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nagpur',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
  },
  subEvent: eventCategories.flatMap(cat =>
    cat.events.map(evt => ({
      '@type': 'Event',
      name: evt.name,
      description: evt.desc,
      organizer: {
        '@type': 'Organization',
        name: 'AXIS, VNIT Nagpur',
      },
    }))
  ),
};

export default function EventsPage() {
  usePageMeta({
    title: 'Events',
    description: "35+ technical events across Management, Software & Electronics, Robotics and more — Robowars, CTF, Drone Racing and Insomnia at AXIS'27, VNIT Nagpur.",
  });

  return (
    <div className="page-dimmer" style={{ paddingTop: 'var(--nav-height)', position: 'relative', zIndex: 1 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* One of nine hand-rolled back links on the site, now the shared
          `.backlink` primitive. The version here set 'Rajdhani' (a family the
          page no longer loads, so it was rendering as system-ui), coloured its
          hover with `--gold`, and did it through two `onMouseEnter`/`onMouseLeave`
          handlers writing to `e.target.style` — which meant the colour change was
          lost the moment the element re-rendered, and never fired at all for a
          keyboard user. The arrow is a `::before` on the class now, so the label
          is just the label. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '2rem var(--gutter) 0' }}
      >
        <Link to="/" className="backlink">
          Back to home
        </Link>
      </motion.div>
      <EventsSection />
    </div>
  );
}
