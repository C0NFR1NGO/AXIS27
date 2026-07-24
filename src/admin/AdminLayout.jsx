import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const allSidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: '◈', minRole: 'user' },
  { path: '/admin/gallery', label: 'Gallery', icon: '▣', minRole: 'moderator' },
  { path: '/admin/events', label: 'Events', icon: '◎', minRole: 'admin' },
  { path: '/admin/workshops', label: 'Workshops', icon: '◉', minRole: 'admin' },
  { path: '/admin/registrations', label: 'Registrations', icon: '▤', minRole: 'admin' },
  { path: '/admin/sponsors', label: 'Sponsors', icon: '◆', minRole: 'admin' },
  { path: '/admin/team', label: 'Team', icon: '◇', minRole: 'admin' },
  { path: '/admin/emails', label: 'Emails', icon: '✉', minRole: 'admin' },
  { path: '/admin/users', label: 'User Management', icon: '◆', minRole: 'super_admin' },
];

const roleHierarchy = { user: 0, moderator: 1, admin: 2, super_admin: 3 };

function hasAccess(userRole, minRole) {
  return (roleHierarchy[userRole] ?? 0) >= (roleHierarchy[minRole] ?? 0);
}

export default function AdminLayout() {
  const { user, profile, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarLinks = allSidebarLinks.filter(link => hasAccess(role, link.minRole));

  // Redirect function for role-based routing
  const getRedirectUrl = (userRole) => {
    if (userRole === 'super_admin' || userRole === 'admin' || userRole === 'moderator') {
      return '/admin';
    }
    // For 'user' role, redirect to home page
    return '/';
  };

  // Redirect based on role
  useEffect(() => {
    if (!loading && user && role) {
      const redirectUrl = getRedirectUrl(role);
      if (window.location.pathname === '/admin') {
        const isInAdminArea = sidebarLinks.some(link => window.location.pathname.startsWith(link.path));
        if (!isInAdminArea) {
          navigate(redirectUrl, { replace: true });
        }
      } else if (window.location.pathname === '/login' && role !== 'user') {
        // If logged in user has admin role and tries to access login page, redirect to admin
        navigate(redirectUrl, { replace: true });
      }
    }
  }, [role, loading, navigate, sidebarLinks]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>AUTHENTICATING...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || !hasAccess(role, 'moderator')) {
    return <Navigate to="/" replace />;
  }

  const roleDisplay = {
    super_admin: 'SUPER ADMIN',
    admin: 'ADMIN',
    moderator: 'MODERATOR',
  };

  const roleColors = {
    super_admin: '#ff3555',
    admin: 'var(--gold)',
    moderator: 'var(--spice-blue)',
  };

  // Close mobile sidebar on navigation
  const handleNavClick = () => {
    setSidebarOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div style={styles.layout}>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.mobileOverlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: fixed, Mobile: slide-in drawer */}
      <aside
        className={`admin-sidebar${mobileMenuOpen ? ' sidebar-open' : ''}`}
        style={styles.sidebar}
      >
        <div style={styles.sidebarHeader}>
          <img src="/images/logo-icon.png" alt="AXIS'27" style={styles.sidebarLogo} />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.sidebarTitle}
          >
            ADMIN
          </motion.span>
        </div>

        <nav style={styles.nav}>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'}
              className="nav-link-item"
              onClick={handleNavClick}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <span style={styles.navIcon}>{link.icon}</span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.navLabel}>
                {link.label}
              </motion.span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.toggleButton}>
            {sidebarOpen ? '◁' : '▷'}
          </button>
        </div>
      </aside>

      {/* Mobile menu toggle button - only visible on mobile */}
      <button
        style={styles.mobileMenuToggle}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <motion.span
          animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }}
          style={{
            display: 'block',
            width: '22px',
            height: '2px',
            background: '#fff',
            borderRadius: '999px',
            transformOrigin: 'center',
          }}
        />
        <motion.span
          animate={{ opacity: mobileMenuOpen ? 0 : 1, scaleX: mobileMenuOpen ? 0 : 1 }}
          style={{
            display: 'block',
            width: '22px',
            height: '2px',
            marginTop: '4px',
            background: '#fff',
            borderRadius: '999px',
            transformOrigin: 'center',
          }}
        />
        <motion.span
          animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }}
          style={{
            display: 'block',
            width: '22px',
            height: '2px',
            marginTop: '4px',
            background: '#fff',
            borderRadius: '999px',
            transformOrigin: 'center',
          }}
        />
      </button>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <button
              style={styles.sidebarToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle sidebar"
            >
              <span style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: '#fff',
                margin: '4px 0',
                borderRadius: '999px',
              }} />
              <span style={{
                display: 'block',
                width: '16px',
                height: '2px',
                background: '#fff',
                margin: '4px 0',
                borderRadius: '999px',
              }} />
              <span style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: '#fff',
                borderRadius: '999px',
              }} />
            </button>
            <h2 style={styles.pageTitle}>AXIS'27 Control Center</h2>
          </div>
          <div style={styles.topbarRight}>
            <span style={{
              ...styles.roleBadge,
              color: roleColors[role],
              borderColor: roleColors[role],
            }}>
              {roleDisplay[role]}
            </span>
            <div style={styles.userInfo}>
              <img
                src={profile?.avatar_url || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=0d0a08&color=e5a93c`}
                alt="Avatar"
                style={styles.avatar}
              />
              <span style={styles.userEmail}>{user?.email}</span>
            </div>
            <button onClick={handleSignOut} style={styles.signOutTopbar}>
              Sign Out
            </button>
          </div>
        </header>

        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0d0a08',
  },
  sidebar: {
    background: 'rgba(12, 10, 8, 0.98)',
    borderRight: '1px solid rgba(229,169,60,0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '260px',
    zIndex: 100,
    transition: 'transform 0.3s ease',
  },
  sidebarHeader: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderBottom: '1px solid rgba(229,169,60,0.08)',
  },
  sidebarLogo: {
    width: '36px',
    height: 'auto',
    filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.4))',
  },
  sidebarTitle: {
    fontFamily: "'Ethnocentric', sans-serif",
    fontSize: '1rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    background: 'linear-gradient(135deg, var(--gold), var(--spice-blue))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  nav: {
    flex: 1,
    padding: '1rem 0',
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1.5rem',
    color: '#fff',
    textDecoration: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    transition: 'all 0.3s ease',
    borderLeft: '2px solid transparent',
  },
  navLinkActive: {
    color: 'var(--gold)',
    background: 'rgba(229,169,60,0.05)',
    borderLeftColor: 'var(--gold)',
  },
  navIcon: {
    fontSize: '1rem',
    width: '20px',
    textAlign: 'center',
  },
  navLabel: {
    whiteSpace: 'nowrap',
  },
  sidebarFooter: {
    padding: '1rem',
    borderTop: '1px solid rgba(229,169,60,0.08)',
  },
  toggleButton: {
    width: '100%',
    padding: '0.5rem',
    background: 'transparent',
    border: '1px solid rgba(229,169,60,0.15)',
    borderRadius: '2px',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    transition: 'all 0.3s ease',
  },
  main: {
    flex: 1,
    marginLeft: '260px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: 'rgba(12, 10, 8, 0.9)',
    borderBottom: '1px solid rgba(229,169,60,0.08)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    gap: '1rem',
    flexWrap: 'wrap',
  },
  topbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  pageTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  roleBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    padding: '0.3rem 0.75rem',
    border: '1px solid',
    borderRadius: '2px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid rgba(229,169,60,0.2)',
  },
  userEmail: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: '#fff',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  signOutTopbar: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid rgba(255,51,85,0.3)',
    borderRadius: '2px',
    color: '#ff3555',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  content: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d0a08',
    gap: '1.5rem',
  },
  loadingText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: '#fff',
    letterSpacing: '0.2em',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '2px solid rgba(229,169,60,0.1)',
    borderTopColor: 'var(--gold)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  unauthorized: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d0a08',
    padding: '2rem',
  },
  unauthorizedCard: {
    textAlign: 'center',
    padding: '3rem',
    background: 'rgba(12, 10, 8, 0.8)',
    border: '1px solid rgba(255,51,85,0.2)',
    borderRadius: '2px',
    maxWidth: '400px',
  },
  unauthorizedTitle: {
    fontFamily: "'Ethnocentric', sans-serif",
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: '#ff3555',
    marginBottom: '1rem',
  },
  unauthorizedText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: '#fff',
    letterSpacing: '0.08em',
    marginBottom: '0.5rem',
  },
  unauthorizedEmail: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--spice-blue)',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  unauthorizedRole: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '1.5rem',
  },
  signOutButton: {
    padding: '0.75rem 2rem',
    background: 'transparent',
    border: '1px solid rgba(255,51,85,0.3)',
    borderRadius: '2px',
    color: '#ff3555',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  // Mobile-specific styles
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  mobileMenuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    zIndex: 101,
  },
  sidebarToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .nav-link-item:hover {
    color: var(--gold) !important;
    background: rgba(229,169,60,0.03) !important;
  }

  /* Desktop: sidebar always visible */
  @media (min-width: 1025px) {
    .admin-sidebar {
      transform: translateX(0) !important;
    }
    .mobileMenuToggle {
      display: none !important;
    }
  }

  /* Mobile: sidebar hidden by default, slides in when open */
  @media (max-width: 1024px) {
    .admin-sidebar {
      transform: translateX(-100%);
      box-shadow: 4px 0 24px rgba(0,0,0,0.4);
      z-index: 200;
    }
    .admin-sidebar.sidebar-open {
      transform: translateX(0) !important;
    }
    .main {
      margin-left: 0 !important;
    }
    .topbar {
      flex-wrap: wrap;
    }
    .sidebarToggle, .mobileMenuToggle {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .topbar {
      padding: 0.75rem 1rem;
    }
    .pageTitle {
      font-size: 0.75rem;
    }
    .content {
      padding: 1rem !important;
    }
    .userEmail {
      display: none;
    }
    .roleBadge {
      padding: 0.2rem 0.5rem;
      font-size: 0.55rem;
    }
  }
`;
document.head.appendChild(styleSheet);