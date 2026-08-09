import { motion } from 'framer-motion';
import { eventCategories } from '../data/content';
import EventCard from './EventCard';
import ScrambleTitle from './ScrambleTitle';

export default function EventsSection() {
  return (
    <section id="events" className="section">
      <ScrambleTitle text="Events" />

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Explore 40+ events across 5 categories — from robotics and coding to management and design.
      </motion.p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1200px',
      }}>
        {eventCategories.map((cat, i) => (
          <div key={cat.id} style={{ flex: '1 1 320px', maxWidth: '380px' }}>
            <EventCard category={cat} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}