'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiArrowLeft, FiCheck } from 'react-icons/fi';
import Container from '@/layout/Container';
import ProductCard from './ProductCard';

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

export default function ProductDetailsClient({ product, relatedProducts = [] }) {
  const images = product.images?.length ? product.images : ['/images/bags/bag-1.png'];
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="bg-light-section min-h-screen py-10">
      <Container>
        {/* Back link */}
        <Link
          href="/product"
          className="inline-flex items-center gap-1.5 text-muted text-sm hover:text-accent transition-colors mb-6"
        >
          <FiArrowLeft />
          Back to Products
        </Link>

        {/* Main section */}
        <div className="bg-white rounded-2xl border border-primary/10 shadow-xs p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ── Image gallery ── */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-light-section flex items-center justify-center">
              <Image
                src={images[activeImg]}
                alt={product.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6"
              />
              {discount && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-accent text-white text-xs font-bold shadow">
                  {discount}% OFF
                </span>
              )}
              {product.isNewArrival && (
                <span className="absolute top-4 left-4 mt-7 px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold shadow">
                  NEW
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImg === i
                        ? 'border-accent shadow'
                        : 'border-primary/10 hover:border-accent/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="flex flex-col gap-5">
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {product.category?.replace(/-/g, ' ')}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.inStock
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading font-extrabold text-3xl text-accent">
                ৳{product.price}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-muted line-through text-base font-medium">
                  ৳{product.oldPrice}
                </span>
              )}
              {discount && (
                <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-bold">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted text-sm leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Colors */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-primary">
                  Color:{' '}
                  <span className="font-normal text-muted capitalize">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((c, i) => {
                    const hex = colorHexMap[c.toLowerCase()] || '#9CA3AF';
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={i}
                        title={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-accent scale-110 shadow'
                            : 'border-black/10 hover:border-accent/60'
                        }`}
                        style={{ backgroundColor: hex }}
                      >
                        {isSelected && (
                          <FiCheck
                            className="text-xs"
                            style={{ color: hex === '#FFFFFF' ? '#000' : '#fff' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-primary">
                  Size:{' '}
                  <span className="font-normal text-muted">{selectedSize}</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                        selectedSize === s
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-body-text border-primary/20 hover:border-accent hover:text-accent'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock count */}
            {product.stock != null && (
              <p className="text-xs text-muted">
                {product.stock > 0 ? (
                  <>
                    <span className="text-emerald-600 font-semibold">{product.stock}</span> units
                    left in stock
                  </>
                ) : (
                  <span className="text-rose-500 font-semibold">Out of stock</span>
                )}
              </p>
            )}

            {/* CTA */}
            <button
              disabled={!product.inStock}
              className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow transition-all"
            >
              <FiShoppingCart />
              {product.inStock ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="font-heading font-extrabold text-2xl text-primary mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
