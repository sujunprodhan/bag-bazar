'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import Container from '@/layout/Container';
import {
  FiShoppingBag, FiPackage, FiGrid, FiBook,
  FiAnchor, FiDroplet, FiUser, FiStar,
  FiBriefcase, FiUmbrella, FiWind, FiTag,
} from 'react-icons/fi';

const categoryMeta = {
  'new-arrival':     { label: 'New Arrival',     icon: FiStar,        linear: 'from-amber-400 via-orange-500 to-rose-500' },
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
      className="bg-white rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-md p-4 sm:p-5 flex flex-col items-center justify-between transition-all duration-200 group"
    >
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden mb-3">
        {cat.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.image}
            alt={cat.label}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-16 h-16 rounded-2xl bg-linear-to-b ${cat.linear} flex items-center justify-center shadow-xs`}
          >
            <Icon className="text-white text-2xl" />
          </div>
        )}
      </div>

      <p className="text-sm sm:text-base font-semibold text-gray-600 group-hover:text-orange-500 text-center leading-snug line-clamp-2 transition-colors">
        {cat.label}
      </p>
    </Link>
  );
};

const CategoryMarquee = ({ products = [] }) => {
  const categories = useMemo(() => {
    const map = {};
    const addToMap = (slug, p) => {
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
    };

    products.forEach((p) => {
      if (p.category) {
        addToMap(p.category, p);
      }
      if (p.isNewArrival && p.category !== 'new-arrival') {
        addToMap('new-arrival', p);
      }
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

  const visibleCategories = categories.slice(0, 12);

  return (
    <section className="bg-gray-50/60 py-12 border-t border-gray-100">
      <Container>
        <div className="text-center mb-8">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
            Popular Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {visibleCategories.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/product"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-lg shadow-xs transition"
          >
            View More Collections
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default CategoryMarquee;
