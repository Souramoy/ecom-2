import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'sole_studio_cart';

function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (product, { size, color, quantity = 1, openQuickBag = false } = {}) => {
    const chosenSize = size ?? product.sizes[0];
    const chosenColor = color ?? product.colors[0]?.name ?? 'Default';

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (entry) =>
          entry.id === product.id &&
          entry.size === chosenSize &&
          entry.color === chosenColor
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          size: chosenSize,
          color: chosenColor,
          quantity,
        },
      ];
    });

    if (openQuickBag) {
      window.setTimeout(() => setIsDrawerOpen(true), 420);
    } else {
      showToast(`Added ${product.name} (UK ${chosenSize}) to bag`, 'success', {
        label: 'View Bag',
        onClick: () => setIsDrawerOpen(true),
      });
    }
  };

  const removeFromCart = (id, size, color) => {
    const target = items.find(
      (entry) => entry.id === id && entry.size === size && entry.color === color
    );
    setItems((prev) =>
      prev.filter(
        (entry) => !(entry.id === id && entry.size === size && entry.color === color)
      )
    );
    if (target) {
      showToast(`Removed ${target.name} from bag`, 'info');
    }
  };

  const updateQuantity = (id, size, color, newQty) => {
    if (newQty < 1) {
      removeFromCart(id, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((entry) =>
        entry.id === id && entry.size === size && entry.color === color
          ? { ...entry, quantity: Math.min(10, newQty) }
          : entry
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= 2999 ? 0 : 199;
    return {
      subtotal,
      cartCount,
      shipping,
      total: subtotal + shipping,
      freeShippingThreshold: 2999,
      amountForFreeShipping: Math.max(0, 2999 - subtotal),
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        ...summary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
