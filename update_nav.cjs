const fs = require('fs');
const path = 'src/components/Navigation.jsx';

let content = fs.readFileSync(path, 'utf8');

const drawerInsert = `
              {/* Login Button in Drawer */}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1rem',
                  marginTop: '0.5rem',
                  fontFamily: "var(--font-heading)",
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--spice-blue)',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  border: '1px solid rgba(0,229,255,0.3)',
                  background: 'rgba(0,229,255,0.08)',
                  boxShadow: '0 0 18px rgba(0,229,255,0.08)',
                  transition: 'all 0.3s var(--ease-cyber)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,229,255,0.15)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(0,229,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,229,255,0.08)';
                  e.currentTarget.style.boxShadow = '0 0 18px rgba(0,229,255,0.08)';
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  opacity: 0.45,
                  color: 'var(--spice-blue)',
                  textShadow: '0 0 6px rgba(0,229,255,0.3)',
                }}>
                  [LOGIN]
                </span>
              </Link>

              {/* DBH footer telemetry in drawer */}
`;

content = content.replace(
  `))}
              </div>

              {/* DBH footer telemetry in drawer */}
              <div style={{`,
  `))}
              </div>

              {/* Login Button in Drawer */}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1rem',
                  marginTop: '0.5rem',
                  fontFamily: "var(--font-heading)",
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--spice-blue)',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  border: '1px solid rgba(0,229,255,0.3)',
                  background: 'rgba(0,229,255,0.08)',
                  boxShadow: '0 0 18px rgba(0,229,255,0.08)',
                  transition: 'all 0.3s var(--ease-cyber)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,229,255,0.15)';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(0,229,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,229,255,0.08)';
                  e.currentTarget.style.boxShadow = '0 0 18px rgba(0,229,255,0.08)';
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  opacity: 0.45,
                  color: 'var(--spice-blue)',
                  textShadow: '0 0 6px rgba(0,229,255,0.3)',
                }}>
                  [LOGIN]
                </span>
              </Link>

              {/* DBH footer telemetry in drawer */}
              <div style={{`
);

fs.writeFileSync('src/components/Navigation.jsx', content);
console.log('Done - Navigation.jsx updated');