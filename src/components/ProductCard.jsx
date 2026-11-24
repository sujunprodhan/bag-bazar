'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiEye, FiShoppingCart } from 'react-icons/fi';

const colorHexMap = {
  black: '#111827',
  grey: '#9CA3AF',
  gray: '#9CA3AF',
  orange: '#F97316',
  pink: '#EC4899',
  navy: '#1E3A8A',
  blue: '#3B82F6',
  red: '#EF4444',
  olive: '#556B2F',
  'army green': '#4B5320',
  charcoal: '#374151',
  'sky blue': '#38BDF8',
  yellow: '#EAB308',
  green: '#22C55E',
  purple: '#A855F7',
  beige: '#F5F5DC',
  brown: '#8B4513',
  white: '#FFFFFF',
  tan: '#D2B48C',
  gold: '#D4AF37',
  silver: '#C0C0C0',
  cream: '#FFFDD0',
};

const ProductCard = ({ product }) => {
  const mainImage = product.images?.[0] || '/images/bags/bag-1.png';
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">

      {/* ── Image ── */}
      <div className="relative aspect-square bg-light-section overflow-hidden flex items-center justify-center p-4">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount / New badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discount && (
            <span className="px-2 py-0.5 rounded-md bg-accent text-white text-[11px] font-bold shadow-xs">
              {discount}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-md bg-primary text-white text-[11px] font-bold shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Stock badge */}
        <span
          className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold z-10 ${
            product.inStock
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
            {product.category?.replace(/-/g, ' ')}
          </span>

          <Link
            href={`/product/${product._id}`}
            className="block font-heading font-bold text-base text-primary hover:text-accent transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          <p className="text-muted text-xs line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-light-section">
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted font-medium">Colors:</span>
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((c, i) => {
                  const hex = colorHexMap[c.toLowerCase()] || '#9CA3AF';
                  return (
                    <span
                      key={i}
                      title={c}
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: hex }}
                    />
                  );
                })}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-muted">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-xl text-primary">
                ৳{product.price}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-muted line-through text-xs font-medium">
                  ৳{product.oldPrice}
                </span>
              )}
            </div>

            {Array.isArray(product.sizes) && product.sizes[0] && (
              <span className="px-2 py-0.5 rounded bg-light-section text-[11px] font-bold text-primary">
                {product.sizes[0]}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/product/${product._id}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-primary/20 text-primary hover:border-accent hover:text-accent text-xs font-semibold transition-all"
            >
              <FiEye className="text-sm" />
              <span>Details</span>
            </Link>

            <Link
              href={`/product/${product._id}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-accent hover:opacity-90 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <FiShoppingCart className="text-sm" />
              <span>Buy Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
