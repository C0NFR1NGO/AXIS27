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
        Explore 35+ events across 7 categories — from robotics and coding to management, design, and gaming.
      </motion.p>

      {/* Equal widths, equal heights, and a centred final row — all of it in
          `.domain-grid`. The layout's history (flex → grid → flex) is written
          up in global.css so nobody reintroduces either failed iteration. */}
      <div className="domain-grid">
        {eventCategories.map((cat, i) => (
          <EventCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </section>
  );
}