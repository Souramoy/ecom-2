import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatINR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import QuantitySelector from './QuantitySelector.jsx';
import ImageWithFallback from './ImageWithFallback.jsx';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <Link to={`/product/${item.slug}`} className="cart-item-img">
        <ImageWithFallback src={item.image} alt={item.name} />
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.72rem', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {item.category}
        </span>
        <Link
          to={`/product/${item.slug}`}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem' }}
        >
          {item.name}
        </Link>
        <p style={{ fontSize: '0.84rem', color: '#777777' }}>
          Size: UK {item.size} · Color: {item.color}
        </p>
        <p className="tabular-nums" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          {formatINR(item.price)}
        </p>
      </div>

      <div
        className="cart-item-actions"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.65rem',
        }}
      >
        <span
          className="tabular-nums"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}
        >
          {formatINR(item.price * item.quantity)}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.id, item.size, item.color, qty)}
            label={`Quantity for ${item.name}`}
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => removeFromCart(item.id, item.size, item.color)}
            aria-label={`Remove ${item.name} from bag`}
            style={{ color: '#777777' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
