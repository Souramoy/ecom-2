import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products.js';
import { categories } from '../data/categories.js';
import { testimonials } from '../data/testimonials.js';
import Hero from '../components/Hero.jsx';
import Sneaker3DShowcase from '../components/Sneaker3DShowcase.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import TestimonialCard from '../components/TestimonialCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import ImageWithFallback from '../components/ImageWithFallback.jsx';

export default function Home() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);

  return (
    <>
      {/* Section 1: Hero Banner */}
      <Hero />

      {/* Interactive 3D Kinetic Lab Showcase */}
      <section className="kinetic-lab-section" aria-label="Interactive 3D footwear showcase">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '1.75rem' }}>
            <div>
              <p className="hero-kicker" style={{ marginBottom: '0.45rem' }}>
                Interactive WebGL Experience
              </p>
              <h2 className="section-title" style={{ color: '#FFFFFF' }}>
                EXPLORE EVERY LAYER IN 3D.
              </h2>
              <p
                style={{
                  color: 'var(--color-text-inverse-muted)',
                  maxWidth: '54ch',
                  marginTop: '0.5rem',
                  fontSize: '0.96rem',
                }}
              >
                Inspect our carbon propulsion plate, AeroFoam midsole flex, and engineered
                knit weave in real time. Switch between Zero-G, Exploded Anatomy, and Hyper-Sprint.
              </p>
            </div>
            <Link to="/product/velocity-knit" className="btn btn-accent btn-sm">
              Shop Featured Silhouette <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <Sneaker3DShowcase />
      </section>

      {/* Section 2: Shop by Category */}
      <section className="section" aria-label="Shop by category">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-kicker">Curated Silhouettes</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link to="/shop" className="section-link">
              View All Categories <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Best Sellers */}
      <section className="section section-surface" aria-label="Best sellers">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-kicker">Most Loved Pairs</p>
              <h2 className="section-title">Best Sellers</h2>
              <p className="section-subtitle">
                Tried and tested everyday favorites crafted with breathable uppers and all-day cushioning.
              </p>
            </div>
            <Link to="/shop?sort=rated" className="section-link">
              Shop Best Sellers <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* Section 4: New Arrivals */}
      <section className="section" aria-label="New arrivals">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-kicker">Latest Releases</p>
              <h2 className="section-title">FRESH OFF THE GROUND</h2>
            </div>
            <Link to="/shop?sort=newest" className="section-link">
              Explore New Drops <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Section 5: Promotional Campaign */}
      <section className="promo-banner" aria-label="Editorial campaign">
        <div className="promo-banner-media">
          <ImageWithFallback
            src="/src/assets/images/promo_move_different_1794984018836.jpg"
            alt="Runner in obsidian and volt SOLE STUDIO sneakers on concrete terrace"
          />
        </div>
        <div className="promo-banner-scrim" aria-hidden="true" />
        <div className="container">
          <div className="promo-banner-content">
            <p className="hero-kicker">Performance Capsule</p>
            <h2
              className="display-heading"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', marginBottom: '1rem' }}
            >
              MADE TO MOVE DIFFERENT.
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '1.05rem',
                marginBottom: '1.75rem',
                maxWidth: '44ch',
              }}
            >
              Find your everyday essential. Discover footwear designed to keep up with you.
            </p>
            <Link to="/shop?category=Running" className="btn btn-accent">
              EXPLORE THE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Featured Collection */}
      <section className="section" aria-label="Featured collection">
        <div className="container">
          <div className="split-grid">
            <div className="split-media">
              <ImageWithFallback
                src="/src/assets/images/featured_collection_main_1794984021174.jpg"
                alt="Monolith Atelier architectural sneaker on stone plinth"
              />
            </div>

            <div className="split-content">
              <div>
                <p className="section-kicker">Featured Capsule</p>
                <h2 className="section-title">The Atelier Monochrome Series</h2>
                <p className="section-subtitle" style={{ marginTop: '0.85rem' }}>
                  Sculpted proportions in bone alabaster, dove nubuck, and matte obsidian.
                  Designed around anatomical lasts that balance gallery minimalism with
                  multi-density underfoot support.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <Link to="/product/atelier-sculpt-low" className="btn btn-primary">
                  Shop Atelier Sculpt Low
                </Link>
                <Link to="/shop?category=Sneakers" className="btn btn-outline">
                  View All Sneakers
                </Link>
              </div>

              <div className="supporting-thumbs">
                <Link to="/product/monolith-studio-01" className="supporting-thumb">
                  <ImageWithFallback
                    src="/src/assets/images/shoe_monolith_grey_1794984027874.jpg"
                    alt="Monolith Studio 01"
                  />
                </Link>
                <Link to="/product/classic-court-white" className="supporting-thumb">
                  <ImageWithFallback
                    src="/src/assets/images/shoe_classic_court_1794984021097.jpg"
                    alt="Classic Court White"
                  />
                </Link>
                <Link to="/product/prism-court-mid" className="supporting-thumb">
                  <ImageWithFallback
                    src="/src/assets/images/shoe_prism_high_1794984025777.jpg"
                    alt="Prism Court Mid"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Brand Story */}
      <section className="section section-dark" aria-label="Brand story">
        <div className="container">
          <div className="brand-story-grid">
            <div>
              <p className="hero-kicker">Our Philosophy</p>
              <h2
                className="display-heading"
                style={{ fontSize: 'clamp(2rem, 3.2vw, 2.85rem)', marginBottom: '1rem' }}
              >
                MORE THAN JUST SHOES.
              </h2>
              <p
                style={{
                  color: 'var(--color-text-inverse-muted)',
                  fontSize: '1.05rem',
                  maxWidth: '46ch',
                  marginBottom: '2rem',
                  lineHeight: 1.7,
                }}
              >
                We believe great footwear should feel as good as it looks. Every step,
                every journey, every moment — make it yours.
              </p>
              <Link to="/about" className="btn btn-outline-inverse">
                Read Our Story <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="brand-story-media">
              <ImageWithFallback
                src="/src/assets/images/brand_story_craft_1794984019720.jpg"
                alt="SOLE STUDIO design workbench with wooden shoe last and knit swatches"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Customer Reviews */}
      <section className="section" aria-label="Customer reviews">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-kicker">Verified Wearers</p>
              <h2 className="section-title">Worn Across the City</h2>
            </div>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Newsletter */}
      <Newsletter />
    </>
  );
}
