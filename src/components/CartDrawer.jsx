import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatINR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import QuantitySelector from './QuantitySelector.jsx';
import ImageWithFallback from './ImageWithFallback.jsx';

export default function CartDrawer() {
  const {
    items,
    subtotal,
    shipping,
    total,
    cartCount,
    amountForFreeShipping,
    freeShippingThreshold,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, closeDrawer]);

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  return (
    <>
      <div
        className={`drawer-backdrop ${isDrawerOpen ? 'open' : ''}`}
        onClick={closeDrawer}
        aria-hidden={!isDrawerOpen}
      />

      <aside
        className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Quick shopping bag"
        aria-hidden={!isDrawerOpen}
      >
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={18} aria-hidden="true" />
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 700,
              }}
            >
              Shopping Bag ({cartCount})
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={closeDrawer}
            aria-label="Close shopping bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="cart-drawer-shipping">
          <p style={{ fontSize: '0.8rem', fontWeight: 500 }}>
            {amountForFreeShipping === 0
              ? 'Complimentary express shipping unlocked.'
              : `Add ${formatINR(amountForFreeShipping)} more for free shipping.`}
          </p>
          <div className="shipping-bar-track" aria-hidden="true">
            <div
              className="shipping-bar-fill"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.9rem',
                padding: '2rem 1rem',
              }}
            >
              <ShoppingBag size={30} color="#777777" aria-hidden="true" />
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.08rem' }}>
                Your bag is empty
              </p>
              <p style={{ fontSize: '0.88rem', color: '#777777', maxWidth: '30ch' }}>
                Add your favorite sneakers or running shoes to inspect them here.
              </p>
              <Link to="/shop" onClick={closeDrawer} className="btn btn-primary btn-sm">
                Explore Footwear
              </Link>
            </div>
          ) : (
            <div className="cart-drawer-list">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="cart-drawer-item"
                >
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={closeDrawer}
                    className="cart-drawer-thumb"
                  >
                    <ImageWithFallback src={item.image} alt={item.name} />
                  </Link>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: '0.94rem',
                        }}
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        aria-label={`Remove ${item.name}`}
                        style={{ color: '#777777', padding: '0.15rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#777777', marginTop: '0.15rem' }}>
                      UK {item.size} · {item.color}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '0.6rem',
                      }}
                    >
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) =>
                          updateQuantity(item.id, item.size, item.color, qty)
                        }
                        label={`Quantity for ${item.name}`}
                      />
                      <span className="tabular-nums" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="summary-row" style={{ paddingBlock: '0.25rem' }}>
              <span style={{ color: '#777777' }}>Subtotal</span>
              <span className="tabular-nums" style={{ fontWeight: 600 }}>
                {formatINR(subtotal)}
              </span>
            </div>
            <div className="summary-row" style={{ paddingBlock: '0.25rem' }}>
              <span style={{ color: '#777777' }}>Shipping</span>
              <span className="tabular-nums" style={{ fontWeight: 600 }}>
                {shipping === 0 ? 'FREE' : formatINR(shipping)}
              </span>
            </div>
            <div
              className="summary-row"
              style={{
                borderTop: '1px solid var(--color-border)',
                marginTop: '0.45rem',
                paddingTop: '0.65rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.05rem',
              }}
            >
              <span>Total</span>
              <span className="tabular-nums">{formatINR(total)}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '0.85rem' }}>
              <Link to="/cart" onClick={closeDrawer} className="btn btn-outline btn-full">
                View Bag
              </Link>
              <Link to="/cart" onClick={closeDrawer} className="btn btn-primary btn-full">
                Checkout <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
