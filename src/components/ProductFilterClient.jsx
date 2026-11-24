'use client';
import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import Container from '@/layout/Container';
import ProductCard from './ProductCard';

const ProductFilterClient = ({ initialProducts = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        const matchesSearch =
          !searchQuery.trim() ||
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });
  }, [initialProducts, searchQuery, sortBy]);

  return (
    <div className="bg-light-section min-h-screen py-10">
      <Container>
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-accent text-xs font-bold tracking-wider uppercase font-heading">
                BagBazar Collection
              </span>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary mt-1">
                Explore All Bags
              </h1>
              <p className="text-muted text-sm mt-1">
                Showing {filteredProducts.length} of {initialProducts.length} premium products
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search bags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white text-body-text placeholder-muted rounded-xl border border-primary/10 focus:border-accent focus:outline-none transition-all shadow-xs"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white text-body-text border border-primary/10 rounded-xl px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none shadow-xs cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-primary/10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-light-section text-accent flex items-center justify-center mx-auto text-2xl">
              <FiSearch />
            </div>
            <h3 className="font-heading font-bold text-xl text-primary">No bags found</h3>
            <p className="text-muted text-sm max-w-md mx-auto">
              No products match your search. Try a different keyword.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductFilterClient;
