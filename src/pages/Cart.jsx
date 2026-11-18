import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatINR } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import CartItem from '../components/CartItem.jsx';
import Modal from '../components/Modal.jsx';

export default function Cart() {
  const {
    items,
    subtotal,
    shipping,
    total,
    amountForFreeShipping,
    clearCart,
  } = useCart();
  const { showToast } = useToast();

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const discountAmount = appliedPromo ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = Math.max(0, total - discountAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'SOLE10') {
      setAppliedPromo('SOLE10');
      showToast('Demo promo code SOLE10 applied (10% off).', 'success');
    } else {
      showToast('Try demo code SOLE10 for 10% off.', 'info');
    }
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Shopping Bag</span>
          </nav>
          <h1 className="section-title">Your Shopping Bag</h1>
        </div>
      </section>

      <div className="container">
        {items.length === 0 ? (
          <div style={{ paddingBlock: '3.5rem 5rem' }}>
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
                <ShoppingBag size={26} aria-hidden="true" />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.45rem',
                  fontWeight: 700,
                }}
              >
                Your shopping bag is empty
              </h2>
              <p style={{ color: '#777777', maxWidth: '42ch' }}>
                Explore our sneakers, running shoes, and everyday suede silhouettes to find
                your next pair.
              </p>
              <Link to="/shop" className="btn btn-primary">
                Continue Shopping <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items List */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: '0.88rem', color: '#777777' }}>
                  {amountForFreeShipping === 0
                    ? 'You have unlocked complimentary express shipping.'
                    : `Add ${formatINR(amountForFreeShipping)} more for free shipping.`}
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    color: '#777777',
                  }}
                >
                  Clear Bag
                </button>
              </div>

              {items.map((item) => (
                <CartItem
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                />
              ))}

              <div style={{ marginTop: '1.5rem' }}>
                <Link to="/shop" className="btn btn-outline">
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="cart-summary" aria-label="Order summary">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                Order Summary
              </h2>

              <form
                onSubmit={handleApplyPromo}
                style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}
              >
                <label htmlFor="promo-code" className="sr-only">
                  Promo code
                </label>
                <input
                  id="promo-code"
                  type="text"
                  className="input-field"
                  placeholder="Promo code (try SOLE10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit" className="btn btn-outline btn-sm">
                  Apply
                </button>
              </form>

              <div className="summary-row">
                <span>Subtotal</span>
                <span className="tabular-nums" style={{ fontWeight: 600 }}>
                  {formatINR(subtotal)}
                </span>
              </div>

              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span className="tabular-nums" style={{ fontWeight: 600 }}>
                  {shipping === 0 ? 'FREE' : formatINR(shipping)}
                </span>
              </div>

              {appliedPromo && (
                <div className="summary-row" style={{ color: 'var(--color-success)' }}>
                  <span>Promo ({appliedPromo})</span>
                  <span className="tabular-nums" style={{ fontWeight: 600 }}>
                    -{formatINR(discountAmount)}
                  </span>
                </div>
              )}

              <div className="summary-row summary-total">
                <span>Total</span>
                <span className="tabular-nums">{formatINR(finalTotal)}</span>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full"
                style={{ marginTop: '1.25rem' }}
                onClick={() => setCheckoutModalOpen(true)}
              >
                Proceed to Checkout
              </button>

              <p
                style={{
                  fontSize: '0.76rem',
                  color: '#777777',
                  marginTop: '0.85rem',
                  textAlign: 'center',
                }}
              >
                Free shipping on orders above ₹2,999 · 14-day size exchange
              </p>
            </aside>
          </div>
        )}
      </div>

      {/* Demo Checkout Notice Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Demo Checkout Experience"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            This website is a frontend client demonstration for <strong>SOLE STUDIO</strong>.
            Live payment gateway processing and order submission are disabled in this demo.
          </p>
          <div
            style={{
              backgroundColor: '#F5F5F3',
              border: '1px solid #E8E8E8',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
            }}
          >
            <span>Simulated Order Total</span>
            <span className="tabular-nums">{formatINR(finalTotal)}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCheckoutModalOpen(false)}
            >
              Return to Bag
            </button>
            <Link
              to="/shop"
              className="btn btn-outline"
              onClick={() => setCheckoutModalOpen(false)}
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
