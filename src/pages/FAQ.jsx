import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqs } from '../data/faqs.js';

const FAQ_CATEGORIES = ['All', 'Orders', 'Shipping', 'Returns', 'Sizing', 'Payments', 'Products'];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openId, setOpenId] = useState(faqs[0].id);

  const visibleFaqs =
    activeCategory === 'All'
      ? faqs
      : faqs.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>FAQ</span>
          </nav>
          <p className="section-kicker">Help Center</p>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="section-subtitle">
            Everything you need to know about SOLE STUDIO sizing, shipping, returns, and material care.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBlock: '3rem 5rem', maxWidth: '920px' }}>
        {/* Topic Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}
          role="tablist"
          aria-label="FAQ categories"
        >
          {FAQ_CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Accordion */}
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {visibleFaqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="faq-item">
                <button
                  type="button"
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#777777',
                        display: 'block',
                        marginBottom: '0.2rem',
                      }}
                    >
                      {item.category}
                    </span>
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} aria-hidden="true" />
                  ) : (
                    <ChevronDown size={18} aria-hidden="true" />
                  )}
                </button>
                {isOpen && <div className="faq-answer">{item.answer}</div>}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: '3rem',
            padding: '1.75rem',
            backgroundColor: '#F5F5F3',
            border: '1px solid #E8E8E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>
              Still need sizing or order assistance?
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#777777' }}>
              Reach our Mumbai studio concierge directly.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
