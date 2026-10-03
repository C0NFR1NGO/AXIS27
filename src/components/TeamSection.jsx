import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ScrambleTitle from './ScrambleTitle';
import slugify from '../lib/slugify';
import socialIcons from './SocialIcons';

const memberProfiles = {};

const teamData = [
  {
    category: 'Core Co-ordinators',
    roles: [
      { role: 'Head of Events', members: ['Kanishk Pantawane', 'Anuj Raut'] },
      { role: 'Corporate Relations', tileRole: 'Corporate Relations', members: ['Krishna Prasad', 'Harshal Ramteke', 'Sourabh Waghmare'] },
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
    groups: [
      {
        roles: [
          { role: 'CA & Exhibitions Head', members: ['Krati Verma'] },
          { role: 'Web Head', members: ['Shreyas Rane'] },
          { role: 'Workshops Head', members: ['Prasad Kate'] },
        ],
      },
      {
        roles: [
          { role: 'JS Head', members: ['Harsh Ambade', 'Soumya Mundhada'] },
          { role: 'DEXTER Head', members: ['Shrutik Unhale'] },
        ],
      },
      {
        roles: [
          { role: 'Design Head', members: ['Utkarsha Shekhar'] },
          { role: 'Guest & Hospitality Head', members: ['Krishita Nakhwa'] },
          { role: 'Social Media Leads', members: ['Shivraj Rathod', 'Sai Sujay Konda'] },
        ],
      },
    ],
  },
];

function getEmail(firstName, lastName) {
  return `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase()}@axisvnit.in`;
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function allRoles(section) {
  return section.groups ? section.groups.flatMap(g => g.roles) : section.roles;
}

function memberFromSlug(slug) {
  if (!slug) return null;
  for (const section of teamData) {
    for (const roleGroup of allRoles(section)) {
      for (const member of roleGroup.members) {
        if (slugify(member) === slug) {
          return { name: member, role: roleGroup.tileRole || roleGroup.role };
        }
      }
    }
  }
  return null;
}

function MemberPortrait({ name, photoSrc, tall = false, layoutId }) {
  const cls = tall ? 'member-portrait member-portrait--tall' : 'member-portrait';
  if (photoSrc) {
    return <motion.img layoutId={layoutId} src={photoSrc} alt={name} className={cls} />;
  }
  return (
    <motion.div layoutId={layoutId} className={cls} aria-hidden="true">
      <span className="member-portrait__glow" />
      <span className="member-portrait__initials">{getInitials(name)}</span>
      <span className="member-portrait__label">Photograph to follow</span>
    </motion.div>
  );
}

function TeamMemberTile({ name, role, reduceMotion, onOpen }) {
  const slug = slugify(name);
  const layout = (id) => (reduceMotion ? undefined : `member-${slug}-${id}`);

  return (
    <motion.button
      type="button"
      layoutId={layout('card')}
      onClick={onOpen}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className="member-tile"
      aria-haspopup="dialog"
    >
      <MemberPortrait name={name} layoutId={layout('portrait')} />
      <span className="member-tile__scrim" aria-hidden="true" />
      <span className="member-tile__meta">
        <motion.span layoutId={layout('name')} className="member-tile__name">{name}</motion.span>
        <motion.span layoutId={layout('role')} className="member-tile__role">{role}</motion.span>
      </span>
    </motion.button>
  );
}

function MemberCard({ member, reduceMotion, onClose }) {
  const parts = member.name.split(' ');
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, -1).join(' ');
  const email = getEmail(firstName, lastName);
  const slug = slugify(member.name);
  const layout = (id) => (reduceMotion ? undefined : `member-${slug}-${id}`);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  const profile = memberProfiles[slug] || {};
  const bio = profile.bio || null;
  const socials = profile.socials || {};
  const socialOrder = ['instagram', 'linkedin', 'github', 'twitter'];

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      clearTimeout(copyTimer.current);
    };
  }, [onClose]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/team/${slug}`);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="member-overlay"
    >
      <motion.div
        layoutId={layout('card')}
        onClick={(e) => e.stopPropagation()}
        className="member-card"
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name} — ${member.role}`}
      >
        <button onClick={onClose} className="member-card__close" aria-label="Close profile">✕</button>

        <div className="member-card__visual">
          <MemberPortrait name={member.name} tall layoutId={layout('portrait')} />
          <span className="member-tile__scrim" aria-hidden="true" />
        </div>

        <div className="member-card__details">
          <motion.span layoutId={layout('role')} className="member-card__role">{member.role}</motion.span>
          <motion.h3 layoutId={layout('name')} className="member-card__name">{member.name}</motion.h3>

          <div className="member-card__facts">
            <div className="member-card__fact">
              <span className="member-card__factlabel">Phone</span>
              <span className="member-card__factvalue">To be updated</span>
            </div>
            <div className="member-card__fact">
              <span className="member-card__factlabel">Email</span>
              <span className="member-card__factvalue">{email}</span>
            </div>
            <div className="member-card__fact member-card__fact--bio">
              <span className="member-card__factlabel">Bio</span>
              <span className="member-card__factvalue">{bio || 'To be updated'}</span>
            </div>
          </div>

          <div className="member-card__socials">
            {socialOrder.map((key) => {
              const url = socials[key];
              const label = `${member.name} on ${key.charAt(0).toUpperCase()}${key.slice(1)}`;
              return url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="member-card__social"
                  aria-label={label}
                >
                  {socialIcons[key]}
                </a>
              ) : (
                <span
                  key={key}
                  className="member-card__social member-card__social--empty"
                  title="To be added"
                  aria-hidden="true"
                >
                  {socialIcons[key]}
                </span>
              );
            })}
          </div>

          <div className="member-card__share">
            <span className="member-card__path">/team/{slug}</span>
            <button onClick={copyLink} className="member-card__copy">{copied ? 'Copied' : 'Copy link'}</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamSection() {
  const location = useLocation();
  const reduceMotion = useReducedMotion() ?? false;

  const [selectedMember, setSelectedMember] = useState(() => {
    const slug = (location.pathname.split('/')[2] || '').toLowerCase();
    return memberFromSlug(slug);
  });

  /* The router's location is the single source of truth: a popstate (back or
   * forward), a direct hit to /team/name, or a nav click all arrive here as a
   * location change and re-derive the open member from the URL. Opening and
   * closing from inside the page only pushState — the SPA never remounts. */
  useEffect(() => {
    const slug = (location.pathname.split('/')[2] || '').toLowerCase();
    setSelectedMember(memberFromSlug(slug));
  }, [location]);

  const syncUrl = (member) => {
    const target = member ? `/team/${slugify(member.name)}` : '/team';
    if (window.location.pathname !== target) {
      window.history.pushState({}, '', target);
    }
  };

  const openMember = (member) => {
    setSelectedMember(member);
    syncUrl(member);
  };

  const closeMember = () => {
    setSelectedMember(null);
    syncUrl(null);
  };

  const renderRoleBlock = (roleGroup, section, layout) => {
    const multi = layout === 'column' && roleGroup.members.length > 1;
    const blockWidth = multi ? '600px' : '340px';
    const flexBasis = multi ? '500px' : '280px';
    return (
      <div key={roleGroup.role} style={layout === 'column' ? { flex: `1 1 ${flexBasis}`, maxWidth: blockWidth } : {}}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '0.8rem',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
        }}>
          {roleGroup.role}
        </div>

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
              reduceMotion={reduceMotion}
              onOpen={() => openMember({ name: member, role: roleGroup.tileRole || roleGroup.role })}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="team" className="section" style={{ minHeight: 'auto', paddingBottom: '40px' }}>
      <ScrambleTitle text="Our Team" />

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
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--blue)',
              letterSpacing: '0.12em',
              marginBottom: '0.4rem',
              opacity: 0.5,
            }}>
              // {section.category.toUpperCase().replace(/\s+/g, '_')} //
            </div>
            <h3 style={{
              fontFamily: "var(--font-heading)",
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text)',
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
              background: 'linear-gradient(90deg, transparent, var(--blue), var(--ember), var(--blue), transparent)',
              boxShadow: '0 0 12px rgba(0, 168, 232, 0.22)',
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {section.groups
              ? section.groups.map((group, gIdx) => (
                  <div key={gIdx} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', alignItems: 'flex-start' }}>
                    {group.roles.map((roleGroup) => renderRoleBlock(roleGroup, section, 'column'))}
                  </div>
                ))
              : section.roles.map((roleGroup) => renderRoleBlock(roleGroup, section, 'row'))}
          </div>
        </motion.div>
      ))}

      {createPortal(
        <AnimatePresence>
          {selectedMember && (
            <MemberCard
              member={selectedMember}
              reduceMotion={reduceMotion}
              onClose={closeMember}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
