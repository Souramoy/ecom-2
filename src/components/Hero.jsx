import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback.jsx';

export default function Hero() {
  return (
    <section className="hero" aria-label="Featured campaign">
      <div className="hero-media">
        <ImageWithFallback
          src="/src/assets/images/hero_campaign_sneakers_1794984019833.jpg"
          alt="SOLE STUDIO architectural sneakers worn on a travertine staircase"
          loading="eager"
        />
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="container hero-content">
        <div className="hero-copy">
          <p className="hero-kicker">Autumn / Winter Footwear Collection</p>
          <h1 className="hero-title">STEP INTO YOUR OWN STYLE.</h1>
          <p className="hero-subtitle">
            Designed for movement. Built for everyday life. Minimalist silhouettes crafted
            in tumbled leather, breathable technical knit, and natural gum soles.
          </p>
          <div className="hero-cta-row">
            <Link to="/shop?gender=Men" className="btn btn-accent">
              SHOP MEN
            </Link>
            <Link to="/shop?gender=Women" className="btn btn-outline-inverse">
              SHOP WOMEN
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
