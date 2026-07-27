import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const teamData = [
  {
    category: 'Core Co-ordinators',
    roles: [
      { role: 'Head of Events', members: ['Kanishk Pantawane', 'Anuj Raut'] },
      { role: 'Sponsorship Heads', tileRole: 'Sponsorship Head', members: ['Krishna Prasad', 'Sarth Dharpure', 'Sourabh Waghmare'] },
    ],
  },
  {
    category: 'Treasurer',
    roles: [
      { role: 'Treasurer', members: ['Tanas Adhikari'] },
    ],
  },
  {
    category: 'Publicity In-charges',
    roles: [
      { role: 'JS Heads', tileRole: 'JS Head', members: ['Harsh Ambade', 'Soumya Mundhada'] },
      { role: 'CA & Exhibitions Head', members: ['Krati Verma'] },
      { role: 'Workshops Head', members: ['Prasad Kate'] },
      { role: 'Guest & Hospitality Head', members: ['Krishita Nakhwa'] },
      { role: 'DEXTER Head', members: ['Shrutik Unhale'] },
      { role: 'Design Head', members: ['Utkarsha Shekhar'] },
      { role: 'Web Head', members: ['Shreyas Rane'] },
      { role: 'Social Media Manager', members: ['Shivraj Rathod'] },
    ],
  },
];

function getEmail(firstName, lastName) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@axisvnit.in`;
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function TeamMemberTile({ name, role, onClick }) {
  return (
    <motion.div
      className="glass-card"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        textAlign: 'center',
        minWidth: '180px',
        flex: '1 1 180px',
        maxWidth: '260px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Avatar circle with initials */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(201,145,26,0.12))',
        border: '1.5px solid rgba(0,229,255,0.2)',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--spice-blue)',
        letterSpacing: '0.08em',
        boxShadow: '0 0 20px rgba(0,229,255,0.06), inset 0 0 14px rgba(0,229,255,0.04)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}>
        {getInitials(name)}
      </div>

      <div style={{
        fontFamily: "var(--font-heading)",
        fontSize: '0.82rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '0.3rem',
        lineHeight: 1.3,
      }}>
        {name}
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        color: 'var(--spice-blue)',
        letterSpacing: '0.08em',
        opacity: 0.8,
      }}>
        {role}
      </div>

      {/* Subtle click hint */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        color: 'var(--text-muted)',
        marginTop: '0.6rem',
        opacity: 0.5,
        letterSpacing: '0.06em',
      }}>
        [ CLICK TO VIEW ]
      </div>
    </motion.div>
  );
}

function MemberModal({ member, role, category, onClose }) {
  const parts = member.split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  const email = getEmail(firstName, lastName);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(3,2,1,0.85)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflow: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem 2rem',
          position: 'relative',
          border: '1px solid rgba(0,229,255,0.15)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '2px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            padding: '0.3rem 0.6rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.08em',
          }}
          onMouseEnter={(e) => { e.target.style.borderColor = 'var(--cyber-red)'; e.target.style.color = 'var(--cyber-red)'; }}
          onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'var(--text-muted)'; }}
        >
          [ESC]
        </button>

        {/* Category tag */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          marginBottom: '0.4rem',
          opacity: 0.6,
        }}>
          // {category.toUpperCase().replace(/\s+/g, '_')} //
        </div>

        {/* Avatar */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          margin: '0 auto 1.2rem',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(201,145,26,0.15))',
          border: '2px solid rgba(0,229,255,0.25)',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--spice-blue)',
          letterSpacing: '0.08em',
          boxShadow: '0 0 30px rgba(0,229,255,0.08), inset 0 0 20px rgba(0,229,255,0.05)',
        }}>
          {getInitials(member)}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "var(--font-heading)",
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          textAlign: 'center',
          marginBottom: '0.3rem',
        }}>
          {member}
        </div>

        {/* Role */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--spice-blue)',
          letterSpacing: '0.08em',
          textAlign: 'center',
          marginBottom: '1.5rem',
          opacity: 0.8,
        }}>
          {role}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.15), rgba(201,145,26,0.12), transparent)',
          marginBottom: '1.5rem',
        }} />

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          {/* Phone */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '0.8rem 1rem',
            background: 'rgba(0,229,255,0.03)',
            border: '1px solid rgba(0,229,255,0.08)',
            borderRadius: '2px',
            width: '100%',
            maxWidth: '320px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--spice-blue)',
              letterSpacing: '0.08em',
            }}>
              PHONE:
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}>
              To be updated
            </div>
          </div>

          {/* Email */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '0.8rem 1rem',
            background: 'rgba(201,145,26,0.03)',
            border: '1px solid rgba(201,145,26,0.08)',
            borderRadius: '2px',
            width: '100%',
            maxWidth: '320px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--gold)',
              letterSpacing: '0.08em',
            }}>
              EMAIL:
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: 'var(--gold-light)',
              letterSpacing: '0.02em',
              wordBreak: 'break-all',
            }}>
              {email}
            </div>
          </div>
        </div>

        {/* Bottom HUD line */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: '1.5rem',
          opacity: 0.4,
          letterSpacing: '0.1em',
        }}>
          MEMBER_PROFILE // AXIS'27
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="team" className="section" style={{ minHeight: 'auto', paddingBottom: '40px' }}>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Our Team
      </motion.h2>

      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        AXIS is entirely student-organized. Meet the people powering the vision.
      </motion.p>

      {teamData.map((section, sIdx) => (
        <motion.div
          key={section.category}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: sIdx * 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: '1100px',
            marginBottom: '3rem',
          }}
        >
          {/* Category header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--spice-blue)',
              letterSpacing: '0.12em',
              marginBottom: '0.4rem',
              opacity: 0.5,
            }}>
              // SECTION_{String(sIdx + 1).padStart(2, '0')} //
            </div>
            <h3 style={{
              fontFamily: "var(--font-heading)",
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
            }}>
              {section.category}
            </h3>
            <div style={{
              width: '80px',
              height: '2px',
              margin: '0 auto',
              background: 'linear-gradient(90deg, transparent, var(--gold), var(--spice-blue), var(--gold), transparent)',
              boxShadow: '0 0 12px var(--spice-blue-glow)',
            }} />
          </div>

          {/* Roles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {section.roles.map((roleGroup) => (
              <div key={roleGroup.role}>
                {/* Role label */}
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--gold)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.8rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                }}>
                  <span className="led-dot led-dot--gold" style={{ display: 'inline-block' }} />
                  {roleGroup.role}
                </div>

                {/* Members row */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '1rem',
                }}>
                  {roleGroup.members.map((member) => (
                    <TeamMemberTile
                      key={member}
                      name={member}
                      role={roleGroup.tileRole || roleGroup.role}
                      category={section.category}
                      onClick={() => setSelectedMember({ name: member, role: roleGroup.tileRole || roleGroup.role, category: section.category })}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedMember && (
            <MemberModal
              member={selectedMember.name}
              role={selectedMember.role}
              category={selectedMember.category}
              onClose={() => setSelectedMember(null)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
