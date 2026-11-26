'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';

const PRODUCTS_PER_PAGE = 9;

const HomeCategorySection = ({ products = [] }) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const start = page * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

  if (!products.length) return null;

  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-1">
              Our Collection
            </p>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Showing {start + 1}–{Math.min(start + PRODUCTS_PER_PAGE, products.length)} of {products.length} products
            </p>
          </div>

          <Link
            href="/product"
            className="inline-flex items-center gap-1.5 text-orange-500 font-semibold text-sm hover:gap-2.5 transition-all"
          >
            View All Products <FiArrowRight />
          </Link>
        </div>

        {/* ── Product Grid (3×3) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {currentProducts.map((product, idx) => (
            <ProductCard key={`${page}-${product._id}`} product={product} index={idx} />
          ))}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-500 text-sm font-medium hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
            >
              <FiChevronLeft className="text-sm" />
              Prev
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => {
                // Show first, last, current and neighbours; collapse others with …
                const showPage =
                  idx === 0 ||
                  idx === totalPages - 1 ||
                  Math.abs(idx - page) <= 1;
                const showDotsBefore = idx === page - 2 && idx > 1;
                const showDotsAfter  = idx === page + 2 && idx < totalPages - 2;

                if (showDotsBefore || showDotsAfter) {
                  return (
                    <span key={idx} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">
                      …
                    </span>
                  );
                }
                if (!showPage) return null;

                return (
                  <button
                    key={idx}
                    onClick={() => setPage(idx)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                      page === idx
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-110'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-500 text-sm font-medium hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
            >
              Next
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default HomeCategorySection;
