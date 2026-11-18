import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = 'sole_studio_wishlist';

function readStoredWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(readStoredWishlist);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage errors
    }
  }, [wishlistIds]);

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const toggleWishlist = (product) => {
    const exists = wishlistIds.includes(product.id);
    if (exists) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`Removed ${product.name} from wishlist`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`Saved ${product.name} to wishlist`, 'success');
    }
  };

  const removeFromWishlist = (product) => {
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
    showToast(`Removed ${product.name} from wishlist`, 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return ctx;
}
