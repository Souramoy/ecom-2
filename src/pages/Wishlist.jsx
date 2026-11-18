import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { products, formatINR } from '../data/products.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { flyToCart } from '../utils/flyToCart.js';
import ImageWithFallback from '../components/ImageWithFallback.jsx';

export default function Wishlist() {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleMoveToBag = (product, event) => {
    const defaultSize = product.sizes.includes(8)
      ? 8
      : product.sizes[Math.floor(product.sizes.length / 2)];
    const mediaEl =
      event?.currentTarget?.closest('.product-card')?.querySelector('.product-card-media') ||
      event?.currentTarget;
    flyToCart(mediaEl, product.images[0]);
    addToCart(product, {
      size: defaultSize,
      color: product.colors[0]?.name,
      quantity: 1,
    });
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Wishlist</span>
          </nav>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <h1 className="section-title">Saved Wishlist</h1>
            <span className="tabular-nums" style={{ fontSize: '0.88rem', color: '#777777' }}>
              {savedProducts.length} Item{savedProducts.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBlock: '3rem 5rem' }}>
        {savedProducts.length === 0 ? (
          <div className="empty-state">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E8E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={26} aria-hidden="true" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700 }}>
              No saved footwear yet
            </h2>
            <p style={{ color: '#777777', maxWidth: '42ch' }}>
              Tap the heart icon on any silhouette to save favorites for later comparison.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {savedProducts.map((product, idx) => (
              <article
                key={product.id}
                className="product-card stagger-card"
                style={{ '--stagger-delay': `${Math.min(idx, 7) * 45}ms` }}
              >
                <div className="product-card-media">
                  <Link to={`/product/${product.slug}`}>
                    <ImageWithFallback src={product.images[0]} alt={product.name} />
                  </Link>
                  <button
                    type="button"
                    className="product-wishlist-btn active"
                    onClick={() => removeFromWishlist(product)}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="product-card-body">
                  <span className="product-card-meta product-card-category">
                    {product.category} · {product.gender}
                  </span>
                  <Link to={`/product/${product.slug}`} className="product-card-title">
                    {product.name}
                  </Link>
                  <div className="product-price-row">
                    <span className="product-price">{formatINR(product.price)}</span>
                    {product.originalPrice && (
                      <span className="product-original-price">
                        {formatINR(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-full"
                    style={{ marginTop: '0.6rem' }}
                    onClick={(e) => handleMoveToBag(product, e)}
                  >
                    <ShoppingBag size={14} aria-hidden="true" />
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
