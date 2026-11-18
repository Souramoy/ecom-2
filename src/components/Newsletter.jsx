import { useState } from 'react';
import { Check } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'info');
      return;
    }
    setSubmitted(true);
    setEmail('');
    showToast('Subscribed to SOLE STUDIO first-access releases.', 'success');
  };

  return (
    <section className="section" aria-label="Newsletter signup">
      <div className="container">
        <div className="newsletter-box">
          <div>
            <p className="section-kicker">Members Dispatch</p>
            <h2 className="section-title">GET FIRST ACCESS.</h2>
            <p className="section-subtitle">
              Sign up for exclusive releases, new collections and special offers.
            </p>
          </div>

          <div>
            {submitted ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 1.25rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #171717',
                }}
              >
                <Check size={18} color="#166534" aria-hidden="true" />
                <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                  You’re on the list. Watch your inbox for our next studio drop.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </form>
            )}
            <p style={{ fontSize: '0.75rem', color: '#777777', marginTop: '0.6rem' }}>
              Frontend demo preview — no external emails are transmitted.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
