import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please complete all required fields.', 'info');
      return;
    }
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    showToast('Your message has been received (demo submission).', 'success');
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Contact</span>
          </nav>
          <p className="section-kicker">Client Care</p>
          <h1 className="section-title">Get in Touch with SOLE STUDIO</h1>
          <p className="section-subtitle">
            Questions about sizing, orders, or retail partnerships? Our studio team responds
            within one business day.
          </p>
        </div>
      </section>

      <div className="container contact-grid">
        {/* Left: Studio Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: '#F5F5F3',
              border: '1px solid #E8E8E8',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
              Flagship Atelier &amp; Support
            </h2>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <MapPin size={18} style={{ marginTop: '2px', flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.92rem' }}>Mumbai Design Studio</p>
                <p style={{ fontSize: '0.88rem', color: '#777777' }}>
                  14 Kala Ghoda Courtyard, Fort, Mumbai 400001
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Mail size={18} style={{ marginTop: '2px', flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.92rem' }}>Concierge Email</p>
                <p style={{ fontSize: '0.88rem', color: '#777777' }}>care@solestudio.in</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Phone size={18} style={{ marginTop: '2px', flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.92rem' }}>Studio Desk</p>
                <p className="tabular-nums" style={{ fontSize: '0.88rem', color: '#777777' }}>
                  +91 22 4890 3100
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Clock size={18} style={{ marginTop: '2px', flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.92rem' }}>Operating Hours</p>
                <p style={{ fontSize: '0.88rem', color: '#777777' }}>
                  Mon – Sat, 10:00 AM – 7:00 PM IST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          {submitted ? (
            <div
              style={{
                border: '1px solid #171717',
                backgroundColor: '#F5F5F3',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Check size={22} color="#166534" aria-hidden="true" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
                  Inquiry Submitted
                </h2>
              </div>
              <p style={{ color: '#555555' }}>
                Thank you for contacting SOLE STUDIO. This is a frontend demo experience—no
                external email was sent.
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label
                    htmlFor="contact-name"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className="input-field"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Sizing question, order inquiry, or wholesale"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  className="input-field"
                  placeholder="Tell us how we can assist..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
