import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const placeholderSections = [
  { 
    path: '/admin/gallery', 
    title: 'GALLERY MANAGEMENT', 
    description: 'Review and approve photo submissions from participants.',
    status: 'Ready for database connection',
    icon: '▣'
  },
  { 
    path: '/admin/events', 
    title: 'EVENT MANAGEMENT', 
    description: 'Manage 35+ events, view registrations, export participant lists.',
    status: 'Ready for database connection',
    icon: '◎'
  },
  { 
    path: '/admin/workshops', 
    title: 'WORKSHOP MANAGEMENT', 
    description: 'Handle workshop registrations, capacity, and waitlists.',
    status: 'Ready for database connection',
    icon: '◉'
  },
  { 
    path: '/admin/registrations', 
    title: 'ALL REGISTRATIONS', 
    description: 'Search, filter, and export all event registrations.',
    status: 'Ready for database connection',
    icon: '▤'
  },
  { 
    path: '/admin/sponsors', 
    title: 'SPONSOR MANAGEMENT', 
    description: 'Add, edit, and organize sponsor tiers and details.',
    status: 'Ready for database connection',
    icon: '◆'
  },
  { 
    path: '/admin/team', 
    title: 'TEAM MANAGEMENT', 
    description: 'Manage team members, roles, and admin permissions.',
    status: 'Ready for database connection',
    icon: '◇'
  },
  { 
    path: '/admin/emails', 
    title: 'EMAIL CENTER', 
    description: 'Compose and send emails to participants and teams.',
    status: 'Pending email service setup',
    icon: '✉'
  },
];

export default function AdminPlaceholderPage({ section }) {
  const currentSection = placeholderSections.find(s => s.path === `/admin/${section}`) || placeholderSections[0];

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.header}>
          <span style={styles.icon}>{currentSection.icon}</span>
          <div>
            <h1 style={styles.title}>{currentSection.title}</h1>
            <p style={styles.description}>{currentSection.description}</p>
          </div>
        </div>

        <div style={styles.statusCard}>
          <div style={styles.statusDot}></div>
          <div>
            <p style={styles.statusLabel}>STATUS</p>
            <p style={styles.statusValue}>{currentSection.status}</p>
          </div>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>NEXT STEPS</p>
          <ul style={styles.infoList}>
            <li>Create Supabase database tables</li>
            <li>Connect to backend API</li>
            <li>Build CRUD operations</li>
          </ul>
        </div>

        <Link to="/admin" style={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  icon: {
    fontSize: '2.5rem',
    color: 'var(--spice-blue)',
    lineHeight: 1,
  },
  title: {
    fontFamily: "'Ethnocentric', sans-serif",
    fontSize: '1.8rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    background: 'linear-gradient(135deg, #fff 0%, var(--gold) 50%, var(--spice-blue) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  description: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    margin: 0,
  },
  statusCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    background: 'rgba(12, 10, 8, 0.6)',
    border: '1px solid rgba(229,169,60,0.15)',
    borderRadius: '2px',
    marginBottom: '1.5rem',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'var(--gold)',
    boxShadow: '0 0 10px var(--gold)',
  },
  statusLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.15em',
    margin: 0,
    marginBottom: '0.25rem',
  },
  statusValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: 'var(--spice-blue)',
    letterSpacing: '0.08em',
    margin: 0,
  },
  infoBox: {
    padding: '1.5rem',
    background: 'rgba(0,229,255,0.03)',
    border: '1px solid rgba(0,229,255,0.1)',
    borderRadius: '2px',
    marginBottom: '2rem',
  },
  infoTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#00e5ff',
    letterSpacing: '0.15em',
    margin: 0,
    marginBottom: '1rem',
  },
  infoList: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
    margin: 0,
    paddingLeft: '1.5rem',
  },
  backLink: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--spice-blue)',
    textDecoration: 'none',
    letterSpacing: '0.1em',
    transition: 'color 0.3s',
  },
};
