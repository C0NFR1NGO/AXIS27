import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { contactInfo, socialLinks } from '../data/content';
import socialIcons from '../components/SocialIcons';

const hoverColors = {
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  twitter: '#000000',
  youtube: '#FF0000',
};

const countryCodes = [
  { code: '+91', country: 'IN' },
  { code: '+1', country: 'US' },
  { code: '+44', country: 'GB' },
  { code: '+61', country: 'AU' },
  { code: '+81', country: 'JP' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+86', country: 'CN' },
  { code: '+7', country: 'RU' },
  { code: '+55', country: 'BR' },
  { code: '+27', country: 'ZA' },
  { code: '+82', country: 'KR' },
  { code: '+39', country: 'IT' },
  { code: '+34', country: 'ES' },
  { code: '+971', country: 'AE' },
  { code: '+966', country: 'SA' },
  { code: '+65', country: 'SG' },
  { code: '+60', country: 'MY' },
  { code: '+62', country: 'ID' },
  { code: '+63', country: 'PH' },
  { code: '+66', country: 'TH' },
  { code: '+84', country: 'VN' },
  { code: '+880', country: 'BD' },
  { code: '+92', country: 'PK' },
  { code: '+94', country: 'LK' },
  { code: '+977', country: 'NP' },
  { code: '+234', country: 'NG' },
  { code: '+254', country: 'KE' },
  { code: '+20', country: 'EG' },
  { code: '+52', country: 'MX' },
  { code: '+54', country: 'AR' },
  { code: '+56', country: 'CL' },
  { code: '+57', country: 'CO' },
  { code: '+48', country: 'PL' },
  { code: '+31', country: 'NL' },
  { code: '+46', country: 'SE' },
  { code: '+47', country: 'NO' },
  { code: '+45', country: 'DK' },
  { code: '+41', country: 'CH' },
  { code: '+43', country: 'AT' },
  { code: '+353', country: 'IE' },
  { code: '+64', country: 'NZ' },
  { code: '+974', country: 'QA' },
  { code: '+968', country: 'OM' },
  { code: '+973', country: 'BH' },
  { code: '+965', country: 'KW' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: '0.95rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(0,229,255,0.15)',
  borderRadius: '10px',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
};

const labelStyle = {
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--cyan)',
  marginBottom: '0.4rem',
  display: 'block',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    query: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState(false);

  const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
  const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.query.trim()) newErrors.query = 'Query is required';
    if (formData.phone.trim()) {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
      }
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(false);
    setSubmitMessage('');

    const phone = formData.phone.trim()
      ? `${formData.countryCode} ${formData.phone.trim()}`
      : 'Not provided';

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `AXIS'27 Query from ${formData.name.trim()}`,
          from_name: "AXIS'27 Website",
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone,
          message: formData.query.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setSubmitMessage(data.message || 'Your query has been sent successfully!');
        setFormData({ name: '', email: '', countryCode: '+91', phone: '', query: '' });
        setTimeout(() => {
          setSubmitted(false);
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitError(true);
        setSubmitMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError(true);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--nav-height)', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '2rem 5% 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.color = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }}
        >
          ← Back to Home
        </Link>
      </motion.div>

      <section className="section" style={{ minHeight: 'auto', paddingBottom: '100px' }}>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          {contactInfo.title}
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {contactInfo.description}
        </motion.p>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="glass-card"
          style={{
            marginBottom: '2rem',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          <h3
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--violet)',
              marginBottom: '0.4rem',
              letterSpacing: '0.08em',
            }}
          >
            Send Us a Query
          </h3>
          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              letterSpacing: '0.04em',
            }}
          >
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Name */}
              <div>
                <label htmlFor="contact-name" style={labelStyle}>
                  Name <span style={{ color: 'var(--glitch-red)' }}>*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.name ? 'var(--glitch-red)' : 'rgba(0,229,255,0.15)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--spice-blue)';
                    e.target.style.boxShadow = '0 0 16px rgba(0,229,255,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? 'var(--glitch-red)' : 'rgba(0,229,255,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.name && (
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem', color: 'var(--glitch-red)', marginTop: '0.3rem' }}>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" style={labelStyle}>
                  Email <span style={{ color: 'var(--glitch-red)' }}>*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.email ? 'var(--glitch-red)' : 'rgba(0,229,255,0.15)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--spice-blue)';
                    e.target.style.boxShadow = '0 0 16px rgba(0,229,255,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? 'var(--glitch-red)' : 'rgba(0,229,255,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.email && (
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem', color: 'var(--glitch-red)', marginTop: '0.3rem' }}>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Phone (optional) */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="contact-phone" style={labelStyle}>
                  Phone Number <span style={{ color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '0.05em' }}>(optional)</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      width: '120px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b0b0d0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      paddingRight: '2rem',
                    }}
                  >
                    {countryCodes.map((cc) => (
                      <option key={cc.code + cc.country} value={cc.code} style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)' }}>
                        {cc.country} {cc.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone number (min. 10 digits)"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      borderColor: errors.phone ? 'var(--glitch-red)' : 'rgba(0,229,255,0.15)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--spice-blue)';
                      e.target.style.boxShadow = '0 0 16px rgba(0,229,255,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.phone ? 'var(--glitch-red)' : 'rgba(0,229,255,0.15)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                {errors.phone && (
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem', color: 'var(--glitch-red)', marginTop: '0.3rem' }}>
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* Query */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="contact-query" style={labelStyle}>
                  Your Query <span style={{ color: 'var(--glitch-red)' }}>*</span>
                </label>
                <textarea
                  id="contact-query"
                  name="query"
                  required
                  placeholder="Describe your query, question, or collaboration idea…"
                  rows={5}
                  value={formData.query}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '120px',
                    borderColor: errors.query ? 'var(--glitch-red)' : 'rgba(0,229,255,0.15)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--spice-blue)';
                    e.target.style.boxShadow = '0 0 16px rgba(0,229,255,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.query ? 'var(--glitch-red)' : 'rgba(0,229,255,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.query && (
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem', color: 'var(--glitch-red)', marginTop: '0.3rem' }}>
                    {errors.query}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="submit"
                disabled={submitting || submitted}
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.85rem 2.8rem',
                  border: `2px solid ${submitted ? 'var(--cyan)' : 'var(--spice-blue)'}`,
                  color: (submitted || submitting) ? 'var(--bg-deep)' : 'var(--spice-blue)',
                  background: submitted ? 'var(--cyan)' : submitting ? 'var(--spice-blue)' : 'transparent',
                  cursor: (submitting || submitted) ? 'default' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 0 20px var(--gold-glow), inset 0 0 20px var(--spice-blue-glow)',
                  borderRadius: '4px',
                  opacity: submitting ? 0.8 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitted && !submitting) {
                    e.target.style.background = 'var(--spice-blue)';
                    e.target.style.color = 'var(--bg-deep)';
                    e.target.style.boxShadow = '0 0 40px var(--gold-glow), inset 0 0 20px var(--spice-blue-glow)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitted && !submitting) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--spice-blue)';
                    e.target.style.boxShadow = '0 0 20px var(--gold-glow), inset 0 0 20px var(--spice-blue-glow)';
                  }
                }}
              >
                {submitted ? '✓ Sent!' : submitting ? 'Sending…' : 'Submit Query'}
              </button>

              {submitMessage && (
                <span
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.85rem',
                    color: submitError ? 'var(--glitch-red)' : 'var(--cyan)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {submitMessage}
                </span>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem' }}>
            <h3
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--violet)',
                marginBottom: '1.5rem',
                letterSpacing: '0.08em',
                textShadow: '0 0 12px rgba(0,229,255,0.2)',
              }}
            >
              Get in Touch
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--cyan)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Address
                </div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {contactInfo.address}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--cyan)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Email
                </div>
                <a
                  href={`mailto:${contactInfo.email}`}
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--gold)'; }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
                >
                  {contactInfo.email}
                </a>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--cyan)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Social
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1px solid rgba(229,169,60,0.25)',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#fff';
                        e.target.style.borderColor = hoverColors[platform];
                        e.target.style.background = hoverColors[platform];
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-muted)';
                        e.target.style.borderColor = 'rgba(229,169,60,0.25)';
                        e.target.style.background = 'transparent';
                      }}
                    >
                      {socialIcons[platform]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <iframe
              title="VNIT Nagpur Location"
              src="https://www.google.com/maps?q=Visvesvaraya+National+Institute+of+Technology+Nagpur&z=15&output=embed"
              style={{ width: '100%', height: '100%', minHeight: '400px', border: '1px solid rgba(0,229,255,0.08)', borderRadius: '2px', display: 'block' }}
              allowFullScreen
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

