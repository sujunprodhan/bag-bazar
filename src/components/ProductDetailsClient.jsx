'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiCheckCircle, FiHeart, FiMinus, FiPlus, FiLoader } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { useShop } from '@/context/ShopContext';

const colorHexMap = {
  black: '#111827', grey: '#9CA3AF', gray: '#9CA3AF', orange: '#F97316',
  pink: '#EC4899', navy: '#1E3A8A', blue: '#3B82F6', red: '#EF4444',
  olive: '#556B2F', 'army green': '#4B5320', charcoal: '#374151',
  'sky blue': '#38BDF8', yellow: '#EAB308', green: '#22C55E',
  purple: '#A855F7', beige: '#F5F5DC', brown: '#8B4513', white: '#FFFFFF',
  tan: '#D2B48C', gold: '#D4AF37', silver: '#C0C0C0', cream: '#FFFDD0',
};

const defaultHighlights = [
  { title: 'Spacious', subtitle: 'প্রচুর জায়গা' },
  { title: 'Durable', subtitle: 'টেকসই ফ্যাব্রিক' },
  { title: 'Easy Carry', subtitle: 'মজবুত হ্যান্ডেল' },
  { title: 'Smart Zips', subtitle: 'সহজে খোলা-বন্ধ' },
];

export default function ProductDetailsClient({ product, relatedProducts = [] }) {
  const highlights =
    Array.isArray(product.highlights) && product.highlights.length > 0
      ? product.highlights
      : defaultHighlights;
  const router = useRouter();
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const images = product.images?.length ? product.images : [];
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const wished = isFavorite(product._id);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          href="/product"
          className="inline-flex items-center gap-1.5 text-gray-400 text-sm hover:text-orange-500 transition-colors mb-6"
        >
          <FiArrowLeft /> Back to Products
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-6">

          <div className="flex flex-col gap-3">
            <div className="relative w-full h-96 md:h-[480px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              {images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 flex-col gap-2">
                  <FiShoppingCart className="text-6xl" />
                  <span className="text-sm">No Image</span>
                </div>
              )}

              {discount && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-bold shadow">
                  -{discount}%
                </span>
              )}
              {product.isNewArrival && (
                <span className="absolute top-4 left-14 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow">
                  NEW
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImg === i ? 'border-orange-500 shadow' : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                {product.category?.replace(/-/g, ' ') || 'Bag'}
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  product.inStock
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  aria-label={wished ? 'Remove from favorites' : 'Add to favorites'}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition cursor-pointer"
                >
                  <FiHeart className={`text-sm ${wished ? 'text-red-500' : 'text-gray-400'}`}
                    style={wished ? { fill: '#ef4444' } : {}} />
                </button>
              </div>
            </div>

            <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="font-extrabold text-3xl text-orange-500">
                ৳{product.price?.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-gray-400 line-through text-base">
                  ৳{product.oldPrice?.toLocaleString()}
                </span>
              )}
              {discount && (
                <span className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-500 text-xs font-bold border border-orange-100">
                  Save {discount}%
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {product.shortDescription || product.description || 'No description available.'}
            </p>

            {(product.material || product.sku) && (
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                {product.material && (
                  <span className="px-3 py-1 rounded-lg bg-gray-100">
                    Material: <strong className="text-gray-800">{product.material}</strong>
                  </span>
                )}
                {product.sku && (
                  <span className="px-3 py-1 rounded-lg bg-gray-100">
                    SKU: <strong className="text-gray-800">{product.sku}</strong>
                  </span>
                )}
              </div>
            )}

            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Color: <span className="font-normal text-gray-500 capitalize">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c, i) => {
                    const hex = colorHexMap[c.toLowerCase()] || '#9CA3AF';
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={i}
                        title={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${
                          isSelected ? 'border-orange-500 scale-110 shadow-md' : 'border-white ring-1 ring-gray-200 hover:scale-110'
                        }`}
                        style={{ backgroundColor: hex }}
                      >
                        {isSelected && (
                          <FiCheck className="text-xs" style={{ color: hex === '#FFFFFF' ? '#000' : '#fff' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Size: <span className="font-normal text-gray-500">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedSize === s
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.stock != null && (
              <p className="text-xs text-gray-400">
                {product.stock > 0 ? (
                  <><span className="text-emerald-600 font-semibold">{product.stock}</span> units left</>
                ) : (
                  <span className="text-rose-500 font-semibold">Out of stock</span>
                )}
              </p>
            )}

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Quantity</p>
              <div className="inline-flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  <FiMinus className="text-sm" />
                </button>
                <span className="px-5 py-2 text-sm font-bold text-gray-900 min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  <FiPlus className="text-sm" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                disabled={!product.inStock || adding || buying}
                onClick={async () => {
                  setAdding(true);
                  try {
                    await addToCart(product, { color: selectedColor, size: selectedSize, quantity });
                  } finally {
                    setAdding(false);
                  }
                }}
                className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {adding ? (
                  <>
                    <FiLoader className="text-base animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="text-base" />
                    <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={!product.inStock || adding || buying}
                onClick={async () => {
                  setBuying(true);
                  try {
                    await addToCart(product, { color: selectedColor, size: selectedSize, quantity });
                    router.push('/checkout');
                  } finally {
                    setBuying(false);
                  }
                }}
                className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {buying ? (
                  <>
                    <FiLoader className="text-base animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Buy Now</span>
                )}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2 grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div key={`${item.title}-${idx}`} className="space-y-1">
                <p className="font-heading font-bold text-base sm:text-lg text-accent">
                  {item.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-bangla">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {( (Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0) || product.description || product.shortDescription ) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
            {Array.isArray(product.keyFeatures) &&
              product.keyFeatures.filter((f) => f && f.toLowerCase() !== 'key features').length > 0 && (
                <div
                  className={`${
                    product.description || product.shortDescription
                      ? 'lg:col-span-6'
                      : 'lg:col-span-12'
                  } bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-7 space-y-4`}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h2 className="font-heading font-bold text-lg text-primary">
                      Key Features
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-accent text-xs font-semibold">
                      Highlights
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.keyFeatures
                      .filter((f) => f && f.toLowerCase() !== 'key features')
                      .map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-700"
                        >
                          <FiCheckCircle className="text-orange-500 text-sm shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            {(product.description || product.shortDescription) && (
              <div
                className={`${
                  Array.isArray(product.keyFeatures) &&
                  product.keyFeatures.filter((f) => f && f.toLowerCase() !== 'key features').length > 0
                    ? 'lg:col-span-6'
                    : 'lg:col-span-12'
                } bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-7 space-y-4`}
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h2 className="font-heading font-bold text-lg text-primary">
                    Product Description
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                    Details
                  </span>
                </div>
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-bangla">
                  {product.description || product.shortDescription}
                </div>
              </div>
            )}
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-extrabold text-2xl text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
