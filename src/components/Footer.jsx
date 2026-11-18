import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand-logo" style={{ color: '#FFFFFF' }}>
              SOLE STUDIO
            </Link>
            <p className="footer-brand-desc">
              Contemporary footwear engineered for movement and sculpted for everyday life.
              Designed in Mumbai with breathable technical knits and responsibly tanned leathers.
            </p>
            <div className="footer-socials" aria-label="Social media channels">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="SOLE STUDIO on Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="SOLE STUDIO on X"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="SOLE STUDIO on YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Shop</h3>
            <ul className="footer-links">
              <li>
                <Link to="/shop" className="footer-link">
                  All Footwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Sneakers" className="footer-link">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Running" className="footer-link">
                  Running Shoes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Casual" className="footer-link">
                  Casual Shoes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Sports" className="footer-link">
                  Sports Shoes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Customer Service</h3>
            <ul className="footer-links">
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ &amp; Sizing Help
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="footer-link">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">About</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="footer-link">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=newest" className="footer-link">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Men" className="footer-link">
                  Men’s Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Women" className="footer-link">
                  Women’s Collection
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} SOLE STUDIO Footwear Pvt. Ltd. All rights reserved.
          </p>
          <div className="payment-methods" aria-label="Supported payment methods">
            <span className="payment-chip">UPI</span>
            <span className="payment-chip">VISA</span>
            <span className="payment-chip">MASTERCARD</span>
            <span className="payment-chip">RUPAY</span>
            <span className="payment-chip">NETBANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
