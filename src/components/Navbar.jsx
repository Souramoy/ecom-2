import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { categories } from '../data/categories.js';
import SearchOverlay from './SearchOverlay.jsx';
import Modal from './Modal.jsx';

export default function Navbar() {
  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div
          key={`${location.pathname}${location.search}`}
          className="route-progress-sweep"
          aria-hidden="true"
        />
        <div className="container navbar-inner">
          {/* Left: Mobile Trigger + Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="icon-btn mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="brand-logo">
              SOLE STUDIO
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="nav-links" aria-label="Main navigation">
            <div className="nav-item">
              <NavLink to="/" end className="nav-link">
                Home
              </NavLink>
            </div>

            <div className="nav-item">
              <Link to="/shop" className="nav-link">
                Shop <ChevronDown size={14} aria-hidden="true" />
              </Link>
              <div className="nav-dropdown" role="menu" aria-label="Shop categories">
                <p className="nav-dropdown-label">Categories</p>
                <Link to="/shop" className="nav-dropdown-link">
                  <span>All Footwear</span>
                  <span style={{ color: '#777777', fontSize: '0.78rem' }}>22</span>
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                    className="nav-dropdown-link"
                  >
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="nav-item">
              <Link to="/shop?gender=Men" className="nav-link">
                Men
              </Link>
            </div>

            <div className="nav-item">
              <Link to="/shop?gender=Women" className="nav-link">
                Women
              </Link>
            </div>

            <div className="nav-item">
              <Link to="/shop?sort=newest" className="nav-link">
                New Arrivals
              </Link>
            </div>

            <div className="nav-item">
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </div>
          </nav>

          {/* Right: Utility Icons */}
          <div className="nav-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search size={19} />
            </button>

            <button
              type="button"
              className="icon-btn"
              onClick={() => setAccountOpen(true)}
              aria-label="Account preview"
            >
              <User size={19} />
            </button>

            <Link
              to="/wishlist"
              className="icon-btn"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart size={19} />
              {wishlistCount > 0 && <span className="icon-count">{wishlistCount}</span>}
            </Link>

            <button
              type="button"
              className="icon-btn"
              data-cart-target="true"
              onClick={openDrawer}
              aria-label={`Open shopping bag (${cartCount} items)`}
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span key={cartCount} className="icon-count has-accent count-pop">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`drawer-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}
        aria-label="Mobile menu"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-drawer-header">
          <span className="brand-logo">SOLE STUDIO</span>
          <button
            type="button"
            className="icon-btn"
            onClick={closeMobile}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-nav-list" aria-label="Mobile links">
          <Link to="/" onClick={closeMobile} className="mobile-nav-link">
            Home
          </Link>
          <Link to="/shop" onClick={closeMobile} className="mobile-nav-link">
            Shop All
          </Link>
          <Link to="/shop?gender=Men" onClick={closeMobile} className="mobile-nav-link">
            Men
          </Link>
          <Link to="/shop?gender=Women" onClick={closeMobile} className="mobile-nav-link">
            Women
          </Link>
          <Link to="/shop?sort=newest" onClick={closeMobile} className="mobile-nav-link">
            New Arrivals
          </Link>
          <Link to="/about" onClick={closeMobile} className="mobile-nav-link">
            About Us
          </Link>
          <Link to="/contact" onClick={closeMobile} className="mobile-nav-link">
            Contact
          </Link>
          <Link to="/faq" onClick={closeMobile} className="mobile-nav-link">
            FAQ
          </Link>
        </nav>

        <div className="mobile-drawer-footer">
          <Link
            to="/wishlist"
            onClick={closeMobile}
            className="btn btn-outline btn-full"
          >
            Wishlist ({wishlistCount})
          </Link>
          <Link
            to="/cart"
            onClick={closeMobile}
            className="btn btn-primary btn-full"
          >
            Shopping Bag ({cartCount})
          </Link>
        </div>
      </aside>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <Modal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        title="Member Account Preview"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              backgroundColor: '#F5F5F3',
              padding: '1.15rem',
              border: '1px solid #E8E8E8',
            }}
          >
            <p style={{ fontSize: '0.75rem', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Demo Guest Profile
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginTop: '0.25rem' }}>
              SOLE STUDIO Member
            </p>
            <p style={{ fontSize: '0.88rem', color: '#777777', marginTop: '0.25rem' }}>
              Authentication and cloud order sync are disabled in this frontend demonstration.
              Your shopping bag ({cartCount}) and wishlist ({wishlistCount}) persist locally in your browser.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/wishlist"
              onClick={() => setAccountOpen(false)}
              className="btn btn-outline btn-sm"
            >
              View Wishlist
            </Link>
            <Link
              to="/cart"
              onClick={() => setAccountOpen(false)}
              className="btn btn-primary btn-sm"
            >
              Open Shopping Bag
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
