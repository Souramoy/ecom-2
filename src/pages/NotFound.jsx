import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: '5.5rem' }}>
      <div className="empty-state">
        <p className="section-kicker">404 Error</p>
        <h1 className="section-title">Page Not Found</h1>
        <p style={{ color: '#777777', maxWidth: '42ch' }}>
          The route you requested does not exist. Return to the storefront or explore our
          latest footwear releases.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/shop" className="btn btn-outline">
            Shop Footwear
          </Link>
        </div>
      </div>
    </div>
  );
}
