'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCart,
  addToCartAction,
  updateCartQtyAction,
  removeFromCartAction,
  clearCartAction,
} from '@/actions/server/cart';
import {
  getFavorites,
  toggleFavoriteAction,
  clearFavoritesAction,
} from '@/actions/server/wishlist';
import ShadcnToaster from '@/components/ui/ShadcnToaster';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [dbCart, dbFavorites] = await Promise.all([getCart(), getFavorites()]);
      if (active) {
        setCart(dbCart || []);
        setFavorites(dbFavorites || []);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ id, status = 'success', title, description, action, duration = 3000 }) => {
      const toastId = id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const exists = prev.some((t) => t.id === toastId);
        const nextToast = { id: toastId, status, title, description, action };
        if (exists) {
          return prev.map((t) => (t.id === toastId ? nextToast : t));
        }
        return [...prev.slice(-2), nextToast];
      });

      if (status !== 'loading' && duration > 0) {
        setTimeout(() => {
          dismissToast(toastId);
        }, duration);
      }
      return toastId;
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    async (product, options = {}) => {
      if (!product?._id) return;
      const color = options.color || product.colors?.[0] || 'Default';
      const size = options.size || product.sizes?.[0] || 'Standard';
      const qty = Math.max(1, options.quantity || 1);
      const itemKey = `${product._id}-${color}-${size}`;

      const toastId = pushToast({
        status: 'loading',
        title: 'Adding to cart...',
        description: product.name,
      });

      setCart((prev) => {
        const idx = prev.findIndex((i) => i.key === itemKey);
        if (idx > -1) {
          return prev.map((item, i) =>
            i === idx ? { ...item, quantity: item.quantity + qty } : item
          );
        }
        return [
          ...prev,
          {
            key: itemKey,
            productId: product._id,
            name: product.name,
            price: product.price || 0,
            oldPrice: product.oldPrice || null,
            image: product.images?.[0] || null,
            category: product.category || 'bag',
            selectedColor: color,
            selectedSize: size,
            quantity: qty,
          },
        ];
      });

      try {
        const updated = await addToCartAction(product, options);
        if (Array.isArray(updated)) setCart(updated);
        pushToast({
          id: toastId,
          status: 'success',
          title: 'Added to Cart',
          description: product.name,
          action: { label: 'View Cart', href: '/cart' },
        });
      } catch {
        pushToast({
          id: toastId,
          status: 'error',
          title: 'Failed to add to cart',
          description: 'Please try again.',
        });
      }
    },
    [pushToast]
  );

  const removeFromCart = useCallback(
    async (key) => {
      setCart((prev) => prev.filter((item) => item.key !== key));
      const updated = await removeFromCartAction(key);
      if (Array.isArray(updated)) setCart(updated);
      pushToast({
        status: 'success',
        title: 'Removed from Cart',
        description: 'Item removed from your shopping bag.',
      });
    },
    [pushToast]
  );

  const updateQuantity = useCallback(async (key, newQty) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: newQty } : item))
    );
    const updated = await updateCartQtyAction(key, newQty);
    if (Array.isArray(updated)) setCart(updated);
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    await clearCartAction();
  }, []);

  const toggleFavorite = useCallback(
    async (product) => {
      if (!product?._id) return;
      const exists = favorites.some((p) => p._id === product._id);

      const toastId = pushToast({
        status: 'loading',
        title: exists ? 'Removing from favorites...' : 'Saving to favorites...',
        description: product.name,
      });

      setFavorites((prev) =>
        exists ? prev.filter((p) => p._id !== product._id) : [product, ...prev]
      );

      try {
        const updated = await toggleFavoriteAction(product);
        if (Array.isArray(updated)) setFavorites(updated);
        pushToast({
          id: toastId,
          status: 'success',
          title: exists ? 'Removed from Favorites' : 'Saved to Favorites',
          description: product.name,
          action: exists ? null : { label: 'Wishlist', href: '/favorites' },
        });
      } catch {
        pushToast({
          id: toastId,
          status: 'error',
          title: 'Could not update favorites',
        });
      }
    },
    [favorites, pushToast]
  );

  const clearFavorites = useCallback(async () => {
    setFavorites([]);
    await clearFavoritesAction();
  }, []);

  const isFavorite = useCallback(
    (productId) => favorites.some((p) => p._id === productId),
    [favorites]
  );

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const favoritesCount = favorites.length;

  return (
    <ShopContext.Provider
      value={{
        cart,
        favorites,
        cartCount,
        cartTotal,
        favoritesCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        clearFavorites,
        isFavorite,
        setCartDirect: setCart,
      }}
    >
      {children}
      <ShadcnToaster toasts={toasts} onDismiss={dismissToast} />
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return ctx;
}
