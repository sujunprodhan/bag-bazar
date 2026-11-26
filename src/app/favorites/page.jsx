'use client';
import React from 'react';
import Link from 'next/link';
import { FiHeart, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useShop } from '@/context/ShopContext';
import Container from '@/layout/Container';
import ProductCard from '@/components/ProductCard';

export default function FavoritesPage() {
  const { favorites, favoritesCount, clearFavorites } = useShop();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-1">
              Saved Items
            </p>
            <h1 className="font-heading font-extrabold text-3xl text-gray-900">
              My Favorites ({favoritesCount})
            </h1>
          </div>

          {favorites.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
            >
              <FiTrash2 />
              Clear Favorites
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-2xl">
              <FiHeart />
            </div>
            <h2 className="font-heading font-bold text-xl text-gray-900">
              No favorites yet
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Tap the heart icon on any bag you love to save it here for later.
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow-sm"
            >
              Explore Products
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {favorites.map((product, idx) => (
              <ProductCard key={product._id} product={product} index={idx} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
