import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const roles = [
  { value: 'user', label: 'User', color: 'var(--text-muted)' },
  { value: 'moderator', label: 'Moderator', color: 'var(--spice-blue)' },
  { value: 'admin', label: 'Admin', color: 'var(--gold)' },
  { value: 'super_admin', label: 'Super Admin', color: '#ff3555' },
];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error) {
      setUsers(data);
    }
    setLoading(false);
  };

  const updateRole = async (userId, newRole) => {
    setUpdating(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdating(null);
  };

  const getRoleInfo = (roleValue) => roles.find(r => r.value === roleValue) || roles[0];

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>LOADING USERS...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 style={styles.title}>USER MANAGEMENT</h1>
        <p style={styles.subtitle}>Manage admin roles and permissions</p>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{users.length}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#ff3555' }}>
              {users.filter(u => u.role === 'super_admin').length}
            </div>
            <div style={styles.statLabel}>Super Admins</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: 'var(--gold)' }}>
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div style={styles.statLabel}>Admins</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: 'var(--spice-blue)' }}>
              {users.filter(u => u.role === 'moderator').length}
            </div>
            <div style={styles.statLabel}>Moderators</div>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <span style={{ ...styles.headerCell, flex: 2 }}>User</span>
            <span style={{ ...styles.headerCell, flex: 1 }}>Role</span>
            <span style={{ ...styles.headerCell, flex: 1 }}>Joined</span>
            <span style={{ ...styles.headerCell, flex: 1.5 }}>Actions</span>
          </div>

          {users.map((u) => {
            const roleInfo = getRoleInfo(u.role);
            const isCurrentUser = u.id === currentUser?.id;
            const isLastSuperAdmin = u.role === 'super_admin' &&
              users.filter(x => x.role === 'super_admin').length === 1;

            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  ...styles.tableRow,
                  ...(isCurrentUser ? styles.tableRowCurrent : {}),
                }}
              >
                <div style={{ ...styles.cell, flex: 2 }}>
                  <img
                    src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.email}&background=0d0a08&color=e5a93c`}
                    alt=""
                    style={styles.userAvatar}
                  />
                  <div>
                    <div style={styles.userName}>{u.full_name || 'Unknown'}</div>
                    <div style={styles.userEmail}>{u.email}</div>
                  </div>
                </div>

                <div style={{ ...styles.cell, flex: 1 }}>
                  <span style={{
                    ...styles.roleBadge,
                    color: roleInfo.color,
                    borderColor: roleInfo.color,
                  }}>
                    {roleInfo.label}
                  </span>
                </div>

                <div style={{ ...styles.cell, flex: 1 }}>
                  <span style={styles.dateText}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ ...styles.cell, flex: 1.5 }}>
                  {isCurrentUser ? (
                    <span style={styles.youLabel}>YOU</span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      disabled={updating === u.id || (isLastSuperAdmin && u.role === 'super_admin')}
                      style={styles.select}
                    >
                      {roles.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              </motion.div>
            );
          })}

          {users.length === 0 && (
            <div style={styles.empty}>
              No users found. Users will appear after they sign in.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
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
  subtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    marginBottom: '2rem',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    padding: '1.25rem',
    background: 'rgba(12, 10, 8, 0.6)',
    border: '1px solid rgba(229,169,60,0.1)',
    borderRadius: '2px',
    textAlign: 'center',
  },
  statValue: {
    fontFamily: "'Ethnocentric', sans-serif",
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  tableContainer: {
    background: 'rgba(12, 10, 8, 0.6)',
    border: '1px solid rgba(229,169,60,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid rgba(229,169,60,0.1)',
    background: 'rgba(229,169,60,0.03)',
  },
  headerCell: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    fontWeight: 700,
    color: 'var(--gold)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid rgba(229,169,60,0.05)',
    transition: 'background 0.2s',
  },
  tableRowCurrent: {
    background: 'rgba(0,229,255,0.03)',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid rgba(229,169,60,0.15)',
    marginRight: '0.75rem',
  },
  userName: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.15rem',
  },
  userEmail: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
  },
  roleBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.55rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '0.25rem 0.6rem',
    border: '1px solid',
    borderRadius: '2px',
    textTransform: 'uppercase',
  },
  dateText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  select: {
    padding: '0.4rem 0.75rem',
    background: 'rgba(12, 10, 8, 0.8)',
    border: '1px solid rgba(229,169,60,0.2)',
    borderRadius: '2px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    outline: 'none',
  },
  youLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    fontWeight: 700,
    color: 'var(--spice-blue)',
    letterSpacing: '0.1em',
  },
  empty: {
    padding: '3rem',
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    gap: '1rem',
  },
  loadingText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.2em',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '2px solid rgba(229,169,60,0.1)',
    borderTopColor: 'var(--gold)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

