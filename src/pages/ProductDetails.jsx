import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Heart,
  Image as ImageIcon,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { products, formatINR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { flyToCart } from '../utils/flyToCart.js';
import QuantitySelector from '../components/QuantitySelector.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import Modal from '../components/Modal.jsx';
import ImageWithFallback from '../components/ImageWithFallback.jsx';
import Sneaker3DShowcase from '../components/Sneaker3DShowcase.jsx';

const SIZE_GUIDE_ROWS = [
  { uk: 'UK 5', eu: '38', cm: '24.1 cm' },
  { uk: 'UK 6', eu: '39', cm: '24.9 cm' },
  { uk: 'UK 7', eu: '41', cm: '25.8 cm' },
  { uk: 'UK 8', eu: '42', cm: '26.7 cm' },
  { uk: 'UK 9', eu: '43', cm: '27.5 cm' },
  { uk: 'UK 10', eu: '44', cm: '28.3 cm' },
  { uk: 'UK 11', eu: '45', cm: '29.2 cm' },
];

function mapProductToColorway(product) {
  const firstColor = (product?.colors[0]?.name || '').toLowerCase();
  if (firstColor.includes('obsidian') || firstColor.includes('carbon') || firstColor.includes('charcoal')) {
    return 'obsidian';
  }
  if (firstColor.includes('terracotta') || firstColor.includes('espresso')) {
    return 'terracotta';
  }
  if (firstColor.includes('navy') || firstColor.includes('cobalt') || firstColor.includes('slate')) {
    return 'cobalt';
  }
  if (firstColor.includes('sand') || firstColor.includes('alabaster') || firstColor.includes('oat')) {
    return 'sand';
  }
  return 'chalk-volt';
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = useMemo(
    () => products.find((p) => p.slug === slug),
    [slug]
  );

  const galleryMainRef = useRef(null);
  const [viewMode, setViewMode] = useState('photos');
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);

  useEffect(() => {
    if (product) {
      setViewMode('photos');
      setSelectedImage(0);
      setZoomed(false);
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(null);
      setSizeError(false);
      setQuantity(1);
    }
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ paddingBlock: '5rem' }}>
        <div className="empty-state">
          <h1 className="section-title">Product not found</h1>
          <p style={{ color: '#777777' }}>
            The footwear silhouette you are looking for may have moved.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Browse All Footwear
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = (openQuickBag = true) => {
    if (!selectedSize) {
      setSizeError(true);
      showToast('Please select a shoe size before adding to bag.', 'info');
      return false;
    }
    setSizeError(false);
    if (openQuickBag) {
      flyToCart(
        galleryMainRef.current,
        product.images[selectedImage] || product.images[0]
      );
    }
    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity,
      openQuickBag,
    });
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart(false)) {
      navigate('/cart');
    }
  };

  const handleToggleWishlist = () => {
    setHeartAnimating(true);
    window.setTimeout(() => setHeartAnimating(false), 380);
    toggleWishlist(product);
  };

  return (
    <>
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
            {product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="container pdp-grid">
        {/* Left: Product Gallery or 3D Kinetic View */}
        <div className="pdp-gallery pdp-gallery-enter">
          <div className="pdp-view-toggle" role="tablist" aria-label="Product media view">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'photos'}
              className={`pdp-view-tab ${viewMode === 'photos' ? 'active' : ''}`}
              onClick={() => setViewMode('photos')}
            >
              <ImageIcon size={15} aria-hidden="true" />
              Studio Photos
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === '3d'}
              className={`pdp-view-tab ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
            >
              <Box size={15} aria-hidden="true" />
              3D Kinetic View
            </button>
          </div>

          {viewMode === '3d' ? (
            <Sneaker3DShowcase
              initialColorway={mapProductToColorway(product)}
              height="520px"
              title={`${product.name.toUpperCase()} · 3D VIEW`}
              subtitle="Orbit, explode layers, or preview Hyper-Sprint flex"
            />
          ) : (
            <>
              <div
                ref={galleryMainRef}
                className={`pdp-main-image ${zoomed ? 'zoomed' : ''}`}
                onClick={() => setZoomed((z) => !z)}
                role="button"
                tabIndex={0}
                aria-label={zoomed ? 'Zoom out product photo' : 'Zoom in product photo'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomed((z) => !z);
                  }
                }}
              >
                <div key={selectedImage} className="pdp-image-swap">
                  <ImageWithFallback
                    src={product.images[selectedImage]}
                    alt={`${product.name} angle ${selectedImage + 1}`}
                    loading="eager"
                  />
                </div>
              </div>

              <div className="pdp-thumbs">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`pdp-thumb ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImage(idx);
                      setZoomed(false);
                    }}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <ImageWithFallback src={img} alt={`${product.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#777777' }}>
                Click main image to toggle close-up inspection, or switch to 3D Kinetic View above.
              </p>
            </>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="pdp-info pdp-info-enter">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '0.45rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#777777',
                }}
              >
                {product.category} · {product.gender}
              </span>
              <span className="product-rating">
                <Star size={14} fill="currentColor" aria-hidden="true" />
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <h1 className="section-title" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}>
              {product.name}
            </h1>

            <div
              className="product-price-row"
              style={{ marginTop: '0.75rem', fontSize: '1.15rem' }}
            >
              <span
                className="product-price"
                style={{ fontSize: '1.45rem', fontFamily: 'var(--font-display)' }}
              >
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="product-original-price" style={{ fontSize: '1rem' }}>
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="product-discount-label" style={{ fontSize: '0.88rem' }}>
                  Save {product.discount}%
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.76rem', color: '#777777', marginTop: '0.2rem' }}>
              Inclusive of all taxes
            </p>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#444444', lineHeight: 1.65 }}>
            {product.description}
          </p>

          {/* Color Selector */}
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.55rem' }}>
              Color: <span style={{ color: '#777777' }}>{selectedColor}</span>
            </p>
            <div className="color-swatch-grid">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className={`color-swatch-btn ${selectedColor === color.name ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Select color ${color.name}`}
                  aria-pressed={selectedColor === color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.55rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: sizeError ? 'var(--color-error)' : 'var(--color-text-primary)',
                }}
              >
                {sizeError ? 'Please select a UK size' : 'Select Size (UK)'}
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                <Ruler size={14} aria-hidden="true" /> Size Guide
              </button>
            </div>

            <div className="pdp-size-grid">
              {product.sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    className={`pdp-size-btn ${active ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    aria-pressed={active}
                  >
                    UK {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Quantity</span>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          {/* Purchase Actions */}
          <div className="pdp-actions">
            <div className="pdp-actions-row">
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => handleAddToCart(true)}
              >
                <ShoppingBag size={16} aria-hidden="true" />
                ADD TO CART
              </button>
              <button
                type="button"
                className={`btn btn-outline ${heartAnimating ? 'heart-pop' : ''}`}
                onClick={handleToggleWishlist}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wishlisted}
                style={{ paddingInline: '1rem' }}
              >
                <Heart
                  size={18}
                  fill={wishlisted ? '#171717' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </div>

            <button
              type="button"
              className="btn btn-accent btn-full"
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>
          </div>

          {/* Shipping & Assurance */}
          <div
            style={{
              backgroundColor: '#F5F5F3',
              border: '1px solid #E8E8E8',
              padding: '1rem 1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontSize: '0.84rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Truck size={16} aria-hidden="true" />
              <span>Free express shipping across India on orders over ₹2,999</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <RefreshCw size={16} aria-hidden="true" />
              <span>14-day complimentary size exchange &amp; doorstep return pickup</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Craftsmanship warranty against sole separation for 6 months</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="pdp-tabs">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              Specifications &amp; Materials
            </h2>
            <table className="spec-table">
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key}>
                    <th scope="row">{key}</th>
                    <td className="tabular-nums">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Customer Reviews Strip */}
      <section className="section section-surface" aria-label="Product reviews">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-kicker">Verified Feedback</p>
              <h2 className="section-title">
                Customer Reviews ({product.reviewCount})
              </h2>
            </div>
            <div className="product-rating" style={{ fontSize: '1.1rem' }}>
              <Star size={18} fill="currentColor" aria-hidden="true" />
              <span>{product.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          <div className="testimonials-grid">
            <article className="testimonial-card">
              <div>
                <div className="testimonial-stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="testimonial-quote" style={{ marginTop: '0.8rem' }}>
                  “True to UK sizing with generous toe space. After three weeks of daily
                  commuting, the cushioning on the {product.name} holds its bounce.”
                </p>
              </div>
              <div className="testimonial-author">
                <span className="testimonial-name">Vikram S. · Pune</span>
                <span className="testimonial-meta">Verified buyer</span>
              </div>
            </article>

            <article className="testimonial-card">
              <div>
                <div className="testimonial-stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="testimonial-quote" style={{ marginTop: '0.8rem' }}>
                  “Finishing and stitching are noticeably cleaner than pairs twice the price.
                  Arrived in Mumbai within 48 hours.”
                </p>
              </div>
              <div className="testimonial-author">
                <span className="testimonial-name">Ananya K. · Mumbai</span>
                <span className="testimonial-meta">Verified buyer</span>
              </div>
            </article>

            <article className="testimonial-card">
              <div>
                <div className="testimonial-stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="testimonial-quote" style={{ marginTop: '0.8rem' }}>
                  “Pairs seamlessly with relaxed trousers and weekend denim alike. Easily my
                  most worn rotation pair this season.”
                </p>
              </div>
              <div className="testimonial-author">
                <span className="testimonial-name">Devika R. · Hyderabad</span>
                <span className="testimonial-meta">Verified buyer</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section" aria-label="Related products">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-kicker">Complete the Rotation</p>
                <h2 className="section-title">Similar Silhouettes</h2>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="section-link"
              >
                View All {product.category}
              </Link>
            </div>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <Modal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title="SOLE STUDIO Size Guide"
      >
        <p style={{ fontSize: '0.9rem', color: '#777777', marginBottom: '1rem' }}>
          Measure your heel-to-toe length standing flat on paper. If you sit between sizes,
          choose the next size up.
        </p>
        <table className="spec-table">
          <thead>
            <tr>
              <th>UK / India</th>
              <th>EU</th>
              <th>Foot Length</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE_ROWS.map((row) => (
              <tr key={row.uk}>
                <td style={{ fontWeight: 600 }}>{row.uk}</td>
                <td className="tabular-nums">{row.eu}</td>
                <td className="tabular-nums">{row.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </>
  );
}
