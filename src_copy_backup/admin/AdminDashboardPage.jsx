import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const stats = [
  { label: 'Pending Reviews', value: 0, icon: '⏳', color: 'var(--gold)', link: '/admin/gallery' },
  { label: 'Total Registrations', value: 0, icon: '👥', color: 'var(--spice-blue)', link: '/admin/registrations' },
  { label: 'Active Events', value: 35, icon: '🎯', color: '#00e5ff', link: '/admin/events' },
  { label: 'Gallery Photos', value: 0, icon: '📷', color: '#ff3555', link: '/admin/gallery' },
];

const recentActivity = [
  { type: 'registration', message: 'System ready — awaiting first registration', time: 'Now' },
  { type: 'gallery', message: 'Gallery module initialized', time: 'Now' },
  { type: 'system', message: 'Admin dashboard deployed', time: 'Now' },
];

export default function AdminDashboardPage() {
  const [galleryStats, setGalleryStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryStats();
  }, []);

  const fetchGalleryStats = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('gallery_submissions')
        .select('status');

      if (error) throw error;

      const stats = {
        pending: 0,
        approved: 0,
        rejected: 0,
      };

      data?.forEach((item) => {
        if (item.status === 'pending') stats.pending++;
        else if (item.status === 'approved') stats.approved++;
        else if (item.status === 'rejected') stats.rejected++;
      });

      setGalleryStats(stats);
      setLoading(false);
    } catch {
      console.log('Gallery table not found yet - using defaults');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={styles.title}>DASHBOARD</h1>
        <p style={styles.subtitle}>System overview and quick actions</p>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={stat.link} style={styles.statCard}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statValue}>
                  {stat.label === 'Pending Reviews'
                    ? galleryStats.pending
                    : stat.label === 'Gallery Photos'
                      ? galleryStats.approved
                      : stat.value}
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
                <div style={{ ...styles.statBorder, background: stat.color }}></div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={styles.section}
        >
          <h2 style={styles.sectionTitle}>QUICK ACTIONS</h2>
          <div style={styles.actionsGrid}>
            <Link to="/admin/gallery" style={styles.actionButton}>
              <span style={styles.actionIcon}>▣</span>
              Review Gallery
            </Link>
            <Link to="/admin/registrations" style={styles.actionButton}>
              <span style={styles.actionIcon}>▤</span>
              View Registrations
            </Link>
            <Link to="/admin/events" style={styles.actionButton}>
              <span style={styles.actionIcon}>◎</span>
              Manage Events
            </Link>
            <Link to="/admin/emails" style={styles.actionButton}>
              <span style={styles.actionIcon}>✉</span>
              Send Email
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={styles.section}
        >
          <h2 style={styles.sectionTitle}>RECENT ACTIVITY</h2>
          <div style={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={{
                  ...styles.activityDot,
                  background: activity.type === 'registration'
                    ? 'var(--spice-blue)'
                    : activity.type === 'gallery'
                      ? 'var(--gold)'
                      : '#00e5ff',
                }}></div>
                <div style={styles.activityContent}>
                  <p style={styles.activityMessage}>{activity.message}</p>
                  <span style={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={styles.section}
        >
          <h2 style={styles.sectionTitle}>SYSTEM STATUS</h2>
          <div style={styles.statusGrid}>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Authentication</span>
              <span style={{ ...styles.statusValue, color: '#00e5ff' }}>ACTIVE</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Database</span>
              <span style={{ ...styles.statusValue, color: loading ? 'var(--gold)' : '#00e5ff' }}>
                {loading ? 'CHECKING...' : 'CONNECTED'}
              </span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Gallery Module</span>
              <span style={{ ...styles.statusValue, color: '#00e5ff' }}>READY</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>Email Service</span>
              <span style={{ ...styles.statusValue, color: 'var(--gold)' }}>PENDING SETUP</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0',
    boxSizing: 'border-box',
  },
  title: {
    fontFamily: "'Ethnocentric', sans-serif",
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 800,
    letterSpacing: '0.15em',
    background: 'linear-gradient(135deg, #fff 0%, var(--gold) 50%, var(--spice-blue) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'clamp(0.7rem, 2vw, 0.75rem)',
    color: '#ccc',
    letterSpacing: '0.1em',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'block',
    padding: '1.25rem',
    background: 'rgba(12, 10, 8, 0.6)',
    border: '1px solid rgba(229,169,60,0.1)',
    borderRadius: '2px',
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  statIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
  },
  statValue: {
    fontFamily: "'Ethnocentric', sans-serif",
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: '#ccc',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  statBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    opacity: 0.6,
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--gold)',
    letterSpacing: '0.15em',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(229,169,60,0.15)',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    background: 'rgba(12, 10, 8, 0.6)',
    border: '1px solid rgba(229,169,60,0.1)',
    borderRadius: '2px',
    color: '#ccc',
    textDecoration: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    transition: 'all 0.3s ease',
  },
  actionIcon: {
    fontSize: '1.1rem',
    color: 'var(--spice-blue)',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(12, 10, 8, 0.4)',
    border: '1px solid rgba(229,169,60,0.05)',
    borderRadius: '2px',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '0.35rem',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: '#ccc',
    letterSpacing: '0.05em',
    margin: 0,
    marginBottom: '0.25rem',
  },
  activityTime: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: '#888',
    letterSpacing: '0.08em',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(12, 10, 8, 0.4)',
    border: '1px solid rgba(229,169,60,0.05)',
    borderRadius: '2px',
  },
  statusLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: '#888',
    letterSpacing: '0.08em',
  },
  statusValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
};
