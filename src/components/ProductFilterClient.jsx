'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiGrid, FiList, FiTag, FiChevronRight, FiX, FiArrowRight } from 'react-icons/fi';
import ProductCard from './ProductCard';

const categoryMeta = {
  'all': { label: 'All Products', emoji: '🛍️' },
  'new-arrival': { label: 'New Arrival', emoji: '✨' },
  'handbag': { label: 'Handbag', emoji: '👜' },
  'ladies-bag': { label: 'Ladies Bag', emoji: '👛' },
  'tote-bag': { label: 'Tote Bag', emoji: '🎒' },
  'backpack': { label: 'Backpack', emoji: '🎒' },
  'travel-bag': { label: 'Travel Bag', emoji: '🧳' },
  'trolley-luggage': { label: 'Trolley Luggage', emoji: '🧳' },
  'school-bag': { label: 'School Bag', emoji: '📚' },
  'gym-duffel-bag': { label: 'Gym Duffel Bag', emoji: '🏋️' },
  'baby-bag': { label: 'Baby Bag', emoji: '👶' },
  'umbrella': { label: 'Umbrella', emoji: '☂️' },
  'raincoat': { label: 'Raincoat', emoji: '🧥' },
};

const getCategoryLabel = (slug) => {
  if (!slug) return 'Other';
  return categoryMeta[slug]?.label || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const getCategoryEmoji = (slug) => {
  return categoryMeta[slug]?.emoji || '🏷️';
};

const ProductFilterClient = ({ initialProducts = [] }) => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [prevCategoryParam, setPrevCategoryParam] = useState(categoryParam);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  if (prevCategoryParam !== categoryParam) {
    setPrevCategoryParam(categoryParam);
    setSelectedCategory(categoryParam || 'all');
  }

  const heroProducts = useMemo(
    () => initialProducts.filter((p) => p.images?.[0]).slice(0, 8),
    [initialProducts]
  );

  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroProducts.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroProducts.length]);

  const activeHeroProduct = heroProducts[heroIndex % Math.max(1, heroProducts.length)] || null;

  const categories = useMemo(() => {
    const countMap = {};
    let newArrivalCount = 0;
    initialProducts.forEach((p) => {
      const cat = p.category || 'other';
      countMap[cat] = (countMap[cat] || 0) + 1;
      if (p.category === 'new-arrival' || p.isNewArrival) {
        newArrivalCount += 1;
      }
    });
    delete countMap['new-arrival'];
    return [
      { slug: 'all', label: 'All Products', emoji: '🛍️', count: initialProducts.length },
      {
        slug: 'new-arrival',
        label: getCategoryLabel('new-arrival'),
        emoji: getCategoryEmoji('new-arrival'),
        count: newArrivalCount,
      },
      ...Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .map(([slug, count]) => ({
          slug,
          label: getCategoryLabel(slug),
          emoji: getCategoryEmoji(slug),
          count,
        })),
    ];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          (selectedCategory === 'new-arrival'
            ? product.category === 'new-arrival' || Boolean(product.isNewArrival)
            : product.category === selectedCategory);

        const matchesSearch =
          !searchQuery.trim() ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const activeCategoryLabel =
    categories.find((c) => c.slug === selectedCategory)?.label || 'All Products';

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative overflow-hidden bg-primary text-white py-20 sm:py-28 lg:py-32 min-h-[420px] sm:min-h-[500px] lg:min-h-[540px] flex items-center">
        {heroProducts.map((hp, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={hp._id}
            src={hp.images[0]}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out pointer-events-none ${
              idx === heroIndex % heroProducts.length
                ? 'opacity-65 scale-105'
                : 'opacity-0 scale-100'
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2135]/80 via-[#0F2A43]/55 to-[#0F2A43]/30 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-accent/25 blur-3xl pointer-events-none" />

        <div className="w-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-4 px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-accent">Products</span>
              </div>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                {selectedCategory === 'all' ? 'Explore All Bags' : activeCategoryLabel}
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-xl">
                Showing {filteredProducts.length} of {initialProducts.length} premium products crafted
                for daily commute, travel, and lifestyle.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
                  Cash on Delivery
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
                  bKash / Nagad / Rocket / Upay
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">
                  7-Day Exchange
                </span>
              </div>
            </div>

            {activeHeroProduct && (
              <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
                <Link
                  href={`/product/${activeHeroProduct._id}`}
                  key={activeHeroProduct._id}
                  className="animate-card-in w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/15 transition-all group shadow-2xl"
                >
                  <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-xl bg-white overflow-hidden shrink-0 relative">
                    <img
                      src={activeHeroProduct.images[0]}
                      alt={activeHeroProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-orange-300 uppercase tracking-widest">
                      {activeHeroProduct.category?.replace(/-/g, ' ')}
                    </span>
                    <p className="font-bold text-base sm:text-lg text-white line-clamp-2 leading-snug mt-1">
                      {activeHeroProduct.name}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-extrabold text-lg sm:text-xl text-orange-400">
                        ৳{activeHeroProduct.price?.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white">
                        View <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>

                {heroProducts.length > 1 && (
                  <div className="flex items-center gap-1.5 mt-3">
                    {heroProducts.map((hp, idx) => (
                      <button
                        key={hp._id}
                        type="button"
                        onClick={() => setHeroIndex(idx)}
                        aria-label={`Show featured product ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === heroIndex % heroProducts.length
                            ? 'w-6 bg-accent'
                            : 'w-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-10">

        <div className="flex gap-6">

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            className={`
              fixed top-0 left-0 h-full w-72 bg-white z-40 shadow-2xl overflow-y-auto
              transform transition-transform duration-300 ease-in-out
              lg:static lg:translate-x-0 lg:z-auto lg:shadow-none lg:w-60 lg:shrink-0
              lg:h-auto lg:max-h-fit lg:rounded-2xl lg:border lg:border-gray-100 lg:overflow-visible
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiTag className="text-orange-500 text-base" />
                <span className="font-bold text-gray-800 text-sm">Categories</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600 transition"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <ul className="p-3 space-y-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <li key={cat.slug}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{cat.emoji}</span>
                        <span className="text-left leading-tight">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600'
                          }`}
                        >
                          {cat.count}
                        </span>
                        {isActive && <FiChevronRight className="text-xs opacity-70" />}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="flex-1 min-w-0">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 font-medium shadow-sm hover:border-orange-400 hover:text-orange-500 transition"
                >
                  <FiTag className="text-sm" />
                  {activeCategoryLabel}
                </button>

                <div className="relative flex-1 sm:w-64">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search bags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white text-gray-800 placeholder-gray-400 rounded-xl border border-gray-200 focus:border-orange-400 focus:outline-none transition shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none shadow-sm cursor-pointer"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name: A → Z</option>
                </select>

                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-orange-500'}`}
                  >
                    <FiGrid className="text-sm" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-orange-500'}`}
                  >
                    <FiList className="text-sm" />
                  </button>
                </div>
              </div>
            </div>

            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                  {getCategoryEmoji(selectedCategory)} {activeCategoryLabel}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 hover:text-orange-800 transition"
                  >
                    <FiX className="text-xs" />
                  </button>
                </span>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto text-2xl mb-4">
                  <FiSearch />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">No bags found</h3>
                <p className="text-gray-400 text-sm mb-5">
                  Try a different category or search keyword.
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={`${selectedCategory}-${product._id}`} product={product} index={idx} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={`${selectedCategory}-${product._id}`} product={product} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilterClient;
