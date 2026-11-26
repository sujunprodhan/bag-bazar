'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiShoppingCart, FiHeart, FiLoader } from 'react-icons/fi';
import { useShop } from '@/context/ShopContext';

const colorHexMap = {
  black: '#111827', grey: '#9CA3AF', gray: '#9CA3AF', orange: '#F97316',
  pink: '#EC4899', navy: '#1E3A8A', blue: '#3B82F6', red: '#EF4444',
  olive: '#556B2F', 'army green': '#4B5320', charcoal: '#374151',
  'sky blue': '#38BDF8', yellow: '#EAB308', green: '#22C55E',
  purple: '#A855F7', beige: '#F5F5DC', brown: '#8B4513', white: '#FFFFFF',
  tan: '#D2B48C', gold: '#D4AF37', silver: '#C0C0C0', cream: '#FFFDD0',
};

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const wished = isFavorite(product._id);
  const mainImage = product.images?.[0] || null;

  const handleAddToCart = async () => {
    if (adding || !product.inStock) return;
    setAdding(true);
    try {
      await addToCart(product);
    } finally {
      setAdding(false);
    }
  };

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div
      style={{ animationDelay: `${(index % 9) * 55}ms` }}
      className="animate-card-in bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      <div className="relative w-full h-64 sm:h-72 bg-white overflow-hidden">
        {mainImage ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <img
              src={mainImage}
              alt={product.name || 'Product'}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover brightness-[1.03] group-hover:scale-105 transition-all duration-500 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full text-gray-300 bg-gray-50">
            <FiShoppingCart className="text-5xl mb-2" />
            <span className="text-xs">No Image</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount && (
            <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-white text-[11px] font-bold shadow">
              -{discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow">
              NEW
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-label={wished ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
        >
          <FiHeart
            className={`text-sm transition-colors ${wished ? 'text-red-500' : 'text-gray-400'}`}
            style={wished ? { fill: '#ef4444' } : {}}
          />
        </button>

        <span
          className={`absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            product.inStock
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
          {product.category?.replace(/-/g, ' ') || 'Bag'}
        </span>

        <Link
          href={`/product/${product._id}`}
          className="font-bold text-sm text-gray-900 hover:text-orange-500 transition-colors line-clamp-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {Array.isArray(product.colors) && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 5).map((c, i) => {
              const hex = colorHexMap[c.toLowerCase()] || '#9CA3AF';
              return (
                <span
                  key={i}
                  title={c}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                  style={{ backgroundColor: hex }}
                />
              );
            })}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-400 font-medium">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-lg text-gray-900">
              ৳{product.price?.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-gray-400 line-through text-xs">
                ৳{product.oldPrice?.toLocaleString()}
              </span>
            )}
          </div>

          {Array.isArray(product.sizes) && product.sizes[0] && (
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-semibold">
              {product.sizes[0]}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/product/${product._id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-500 text-xs font-semibold transition-all"
          >
            <FiEye className="text-sm" />
            Details
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock || adding}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {adding ? (
              <>
                <FiLoader className="text-sm animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <FiShoppingCart className="text-sm" />
                <span>{product.inStock ? 'Add to Cart' : 'Sold Out'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
