import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { notableGuests } from '../data/content';

const ease = [0.22, 1, 0.36, 1];

function PersonCard({ person, index, reduce, verb }) {
  const [errored, setErrored] = useState(false);
  const cls = ['ng-card', person.span === 'featured' ? 'ng--featured' : ''].filter(Boolean).join(' ');

  return (
    <motion.figure
      className={cls}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06, ease }}
    >
      <div className="ng-media">
        {errored ? (
          <div className="ng-fallback" role="img" aria-label={person.name}>
            <span>IMG // OFFLINE</span>
          </div>
        ) : (
          <img src={person.img} alt={person.name} loading="lazy" onError={() => setErrored(true)} />
        )}
      </div>
      <figcaption className="ng-caption">
        <div className="ng-name">{person.name}</div>
        <div className="ng-role">{person.role}</div>
        <div className="ng-year">{verb} · {person.year}</div>
      </figcaption>
    </motion.figure>
  );
}

export default function NotableGuests({ people = notableGuests, verb = 'VISITED' }) {
  const reduce = useReducedMotion();

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontVariationSettings: "'wdth' 75",
        fontSize: 'var(--t-label)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--text-dim)',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        &gt; ARCHIVE // PRECEDENT REGISTRY — CYCLES 2001 – PRESENT // STATUS: DEOBFUSCATED
      </div>
      <div className="ng-grid" style={{ maxWidth: '1060px', margin: '0 auto' }}>
        {people.map((person, i) => (
          <PersonCard key={person.id} person={person} index={i} reduce={reduce} verb={verb} />
        ))}
      </div>
    </div>
  );
}
