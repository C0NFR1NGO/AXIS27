import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EventsSection from '../components/EventsSection';
import { eventCategories } from '../data/content';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EventSeries',
  name: "AXIS'27 — Ignis Aeternum",
  description: "Central India's largest technical festival at VNIT Nagpur. 35+ events across management, software, robotics, construction, and innovation.",
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
  useEffect(() => {
    document.title = "Events — AXIS'27 | VNIT Nagpur";
    return () => { document.title = "AXIS'27 - Central India's Largest Technical Fest | VNIT Nagpur"; };
  }, []);

  return (
    <div style={{ paddingTop: 'var(--nav-height)', position: 'relative', zIndex: 1 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: '2rem 5% 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }}
        >
          ← Back to Home
        </Link>
      </motion.div>
      <EventsSection />
    </div>
  );
}
