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
  boxSizing: 'border-box',
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
  const [web3formsError, setWeb3formsError] = useState(null);

  const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
  const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

  // Check if Web3Forms key is configured
  const isWeb3FormsConfigured = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY.length > 10;

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

    if (!isWeb3FormsConfigured) {
      setSubmitError(true);
      setSubmitMessage('Contact form is not configured. Please contact us directly via email.');
      return;
    }

    setSubmitting(true);
    setSubmitError(false);
    setSubmitMessage('');
    setWeb3formsError(null);

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
        // Handle Web3Forms specific errors
        const errorMsg = data.message || 'Something went wrong. Please try again.';
        if (errorMsg.toLowerCase().includes('uuid') || errorMsg.toLowerCase().includes('access_key')) {
          setWeb3formsError('Invalid Web3Forms access key. Please contact admin to configure a valid key.');
          setSubmitMessage('Configuration error. Please contact us directly via email.');
        } else {
          setSubmitError(true);
          setSubmitMessage(errorMsg);
        }
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
            boxSizing: 'border-box',
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

          {!isWeb3FormsConfigured && (
            <div style={{
              padding: '1rem',
              background: 'rgba(255,51,85,0.1)',
              border: '1px solid rgba(255,51,85,0.3)',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              color: '#ff3555',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.85rem',
            }}>
              ⚠️ Contact form is not configured. Please email us directly at {contactInfo.email}
            </div>
          )}

          {web3formsError && (
            <div style={{
              padding: '1rem',
              background: 'rgba(255,51,85,0.1)',
              border: '1px solid rgba(255,51,85,0.3)',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              color: '#ff3555',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.85rem',
            }}>
              {web3formsError}
            </div>
          )}

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
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      width: 'auto',
                      minWidth: '120px',
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
                      flex: 1,
                      minWidth: '200px',
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

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={submitting || submitted}
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, var(--spice-blue), var(--cyber-blue))',
                  color: '#0d0a08',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '16px', height: '16px', border: '2px solid #0d0a08', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                    Sending...
                  </span>
                ) : submitted ? (
                  'Sent Successfully!'
                ) : (
                  'Send Query'
                )}
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

        {/* Contact Details & Map - RESPONSIVE GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          {/* Contact Info Card */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', minHeight: '320px' }}>
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
                    lineHeight: 1.7,
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
                    marginBottom: '0.25rem',
                  }}
                >
                  Social
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(0,229,255,0.1)',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = hoverColors[platform];
                        e.currentTarget.style.borderColor = hoverColors[platform];
                        e.currentTarget.style.color = '#0d0a08';
                        e.currentTarget.style.boxShadow = `0 0 20px ${hoverColors[platform]}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.1)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {socialIcons[platform]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map/Location Card */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: '2rem', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
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
              Our Location
            </h3>
            <div style={{ flex: 1, borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0,229,255,0.1)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.5!2d79.045!3d21.12!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd616e!2sVNIT%20Nagpur!5e0!3m2!1sen!2sin!4v123456789"
                width="100%"
                height="100%"
                minHeight="260px"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VNIT Nagpur Location"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
