import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { products, formatINR } from '../data/products.js';
import ImageWithFallback from './ImageWithFallback.jsx';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 60);
      const onKey = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    return undefined;
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return products.filter((p) => p.isBestSeller).slice(0, 4);
    }
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.gender.toLowerCase().includes(trimmed)
    );
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    onClose();
    if (trimmed) {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div
      className={`search-overlay ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-panel" role="dialog" aria-label="Search footwear">
        <div className="container">
          <form onSubmit={handleSubmit} className="search-input-row">
            <Search size={20} color="#777777" aria-hidden="true" />
            <label htmlFor="sole-search-input" className="sr-only">
              Search shoes by name or category
            </label>
            <input
              id="sole-search-input"
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder="Search sneakers, running shoes, suede..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setQuery('')}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.25rem',
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#777777',
              }}
            >
              {query.trim()
                ? `${results.length} matching result${results.length === 1 ? '' : 's'}`
                : 'Popular Searches'}
            </span>
            {results.length > 0 && (
              <Link
                to={query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop'}
                onClick={onClose}
                className="section-link"
              >
                View all in Shop <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {results.length === 0 ? (
            <div style={{ paddingBlock: '2.5rem', textAlign: 'center', color: '#777777' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#171717' }}>
                No footwear matched “{query}”
              </p>
              <p style={{ fontSize: '0.88rem', marginTop: '0.35rem' }}>
                Try searching for Sneakers, Running, Suede, or Classic Court.
              </p>
            </div>
          ) : (
            <div className="search-results-grid">
              {results.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.slug}`}
                  onClick={onClose}
                  className="search-result-card"
                >
                  <div className="search-result-img">
                    <ImageWithFallback src={item.images[0]} alt={item.name} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: '#777777', textTransform: 'uppercase' }}>
                      {item.category} · {item.gender}
                    </p>
                    <p style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.name}</p>
                    <p className="tabular-nums" style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                      {formatINR(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
