import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { formatINR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { flyToCart } from '../utils/flyToCart.js';
import ImageWithFallback from './ImageWithFallback.jsx';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const [heartAnimating, setHeartAnimating] = useState(false);

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 9;
    const rotateX = (0.5 - py) * 9;
    el.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
    el.style.setProperty('--sheen-x', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--sheen-y', `${(py * 100).toFixed(1)}%`);
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes.includes(8)
      ? 8
      : product.sizes[Math.floor(product.sizes.length / 2)];
    flyToCart(mediaRef.current || e.currentTarget, product.images[0]);
    addToCart(product, {
      size: defaultSize,
      color: product.colors[0]?.name,
      quantity: 1,
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnimating(true);
    window.setTimeout(() => setHeartAnimating(false), 380);
    toggleWishlist(product);
  };

  return (
    <article
      ref={cardRef}
      className="product-card tilt-card stagger-card"
      style={{ '--stagger-delay': `${Math.min(index, 7) * 45}ms` }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div ref={mediaRef} className="product-card-media">
        <div className="tilt-sheen" aria-hidden="true" />
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <ImageWithFallback src={product.images[0]} alt={product.name} />
        </Link>

        {product.discount > 0 ? (
          <span className="product-card-tag tag-accent">-{product.discount}%</span>
        ) : product.badge ? (
          <span className="product-card-tag">{product.badge}</span>
        ) : null}

        <button
          type="button"
          className={`product-wishlist-btn ${wishlisted ? 'active' : ''} ${
            heartAnimating ? 'heart-pop' : ''
          }`}
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        <button
          type="button"
          className="product-quick-add"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to bag`}
        >
          <ShoppingBag size={14} aria-hidden="true" />
          Quick Add
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-card-category">
            {product.category} · {product.gender}
          </span>
          <span className="product-rating" aria-label={`Rated ${product.rating} out of 5`}>
            <Star size={12} fill="currentColor" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
        </div>

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
          {product.discount > 0 && (
            <span className="product-discount-label">{product.discount}% off</span>
          )}
        </div>
      </div>
    </article>
  );
}
