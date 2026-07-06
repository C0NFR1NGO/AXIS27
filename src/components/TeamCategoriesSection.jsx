const categories = [
  {
    title: 'Event Managers',
    count: '40+',
    description: 'The driving force behind every event — from management and analytics to robotics, software, construction, and igniting minds.',
  },
  {
    title: 'Organizers',
    count: '150+',
    description: 'The backbone of AXIS — coordinating logistics, operations, hospitality, marketing, and on-ground execution across the fest.',
  },
  {
    title: 'Volunteers',
    count: '200+',
    description: 'Passionate students from VNIT who dedicate their time and energy to ensure every attendee has a seamless experience.',
  },
];

export default function TeamCategoriesSection() {
  return (
    <section className="section" style={{ minHeight: 'auto', padding: '0 5% 60px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          width: '100%',
          maxWidth: '1100px',
        }}
      >
        {categories.map((cat) => (
          <div key={cat.title} className="glass-card"
            style={{
              padding: '1.5rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--cyan)',
                marginBottom: '0.25rem',
              }}
            >
              Team
            </div>
            <div
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: '1.4rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--violet), var(--violet-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.2rem',
              }}
            >
              {cat.count}
            </div>
            <div
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem',
              }}
            >
              {cat.title}
            </div>
            <div
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {cat.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
