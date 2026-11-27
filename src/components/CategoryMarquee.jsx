'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  FiShoppingBag, FiPackage, FiGrid, FiBook,
  FiAnchor, FiDroplet, FiUser, FiStar,
  FiBriefcase, FiUmbrella, FiWind, FiTag,
} from 'react-icons/fi';

const categoryMeta = {
  'handbag':         { label: 'Handbag',         icon: FiShoppingBag, linear: 'from-rose-400 via-pink-500 to-purple-600' },
  'ladies-bag':      { label: 'Ladies Bag',      icon: FiStar,        linear: 'from-purple-400 via-violet-500 to-indigo-600' },
  'tote-bag':        { label: 'Tote Bag',        icon: FiPackage,     linear: 'from-blue-400 via-cyan-500 to-teal-600' },
  'backpack':        { label: 'Backpack',        icon: FiGrid,        linear: 'from-emerald-400 via-green-500 to-lime-600' },
  'travel-bag':      { label: 'Travel Bag',      icon: FiBriefcase,   linear: 'from-orange-400 via-amber-500 to-yellow-500' },
  'trolley-luggage': { label: 'Trolley Luggage', icon: FiAnchor,      linear: 'from-cyan-400 via-sky-500 to-blue-600' },
  'school-bag':      { label: 'School Bag',      icon: FiBook,        linear: 'from-yellow-400 via-orange-400 to-red-500' },
  'gym-duffel-bag':  { label: 'Gym Duffel',      icon: FiDroplet,     linear: 'from-red-400 via-rose-500 to-pink-600' },
  'baby-bag':        { label: 'Baby Bag',        icon: FiUser,        linear: 'from-lime-400 via-green-400 to-emerald-500' },
  'umbrella':        { label: 'Umbrella',        icon: FiUmbrella,    linear: 'from-indigo-400 via-purple-400 to-violet-600' },
  'raincoat':        { label: 'Raincoat',        icon: FiWind,        linear: 'from-teal-400 via-cyan-500 to-sky-600' },
};

const formatLabel = (slug) =>
  categoryMeta[slug]?.label ||
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryCard = ({ cat }) => {
  const Icon = cat.icon;
  return (
    <Link
      href={`/product?category=${encodeURIComponent(cat.slug)}`}
      className="flex-shrink-0 w-44 h-60 rounded-3xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`absolute inset-0 bg-linear-to-b ${cat.linear}`} />

      {cat.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cat.image}
          alt={cat.label}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10" />

      <div className="absolute top-1/2 -translate-y-4 left-4">
        <div className="w-10 h-10 rounded-xl bg-white/25 backdrop-blur-md border border-white/35 flex items-center justify-center group-hover:bg-white/35 transition-colors shadow-sm">
          <Icon className="text-white text-lg" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-bold text-base leading-tight mb-1 drop-shadow-xs">
          {cat.label}
        </p>
        <p className="text-white/80 text-xs font-medium">
          {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
        </p>
      </div>
    </Link>
  );
};

const CategoryMarquee = ({ products = [] }) => {
  const categories = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const slug = p.category;
      if (!slug) return;
      if (!map[slug]) {
        const meta = categoryMeta[slug] || {};
        map[slug] = {
          slug,
          label: formatLabel(slug),
          icon: meta.icon || FiTag,
          linear: meta.linear || 'from-slate-500 to-slate-700',
          image: p.images?.[0] || null,
          count: 0,
        };
      }
      if (!map[slug].image && p.images?.[0]) {
        map[slug].image = p.images[0];
      }
      map[slug].count += 1;
    });

    const list = Object.values(map);
    if (list.length > 0) return list;

    return Object.entries(categoryMeta).map(([slug, meta]) => ({
      slug,
      label: meta.label,
      icon: meta.icon,
      linear: meta.linear,
      image: null,
      count: 0,
    }));
  }, [products]);

  const doubled = [...categories, ...categories];

  return (
    <section className="bg-white py-12 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7">
        <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-1">Browse</p>
        <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900">Shop By Category</h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-linear-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-linear-to-l from-white to-transparent z-10" />

        <div className="flex gap-4 w-max animate-marquee-left px-4">
          {doubled.map((cat, i) => (
            <CategoryCard key={`${cat.slug}-${i}`} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryMarquee;
