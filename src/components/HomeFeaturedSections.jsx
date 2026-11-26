'use client';
import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import Container from '@/layout/Container';
import ProductCard from './ProductCard';

function CategoryShowcaseBlock({ tag, title, emoji, items, viewAllHref, bgClass = 'bg-white' }) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`${bgClass} py-12 border-t border-gray-100`}>
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-accent text-xs font-bold tracking-widest uppercase mb-1">
              {tag}
            </p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary flex items-center gap-2">
              <span>{emoji}</span>
              <span>{title}</span>
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm hover:gap-2.5 transition-all"
          >
            <span>View All {title}</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.slice(0, 4).map((product, idx) => (
            <ProductCard key={`${title}-${product._id}`} product={product} index={idx} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function HomeFeaturedSections({ products = [] }) {
  const newArrivals = products.filter((p) => p.isNewArrival);
  const schoolBags = products.filter((p) => p.category === 'school-bag');
  const babyBags = products.filter((p) => p.category === 'baby-bag');

  return (
    <>
      <CategoryShowcaseBlock
        tag="Fresh Drops"
        title="New Arrivals"
        emoji="✨"
        items={newArrivals}
        viewAllHref="/product"
        bgClass="bg-gray-50"
      />
      <CategoryShowcaseBlock
        tag="Back to School"
        title="School Bags"
        emoji="📚"
        items={schoolBags}
        viewAllHref="/product?category=school-bag"
        bgClass="bg-white"
      />
      <CategoryShowcaseBlock
        tag="Parenting Essentials"
        title="Baby Bags"
        emoji="👶"
        items={babyBags}
        viewAllHref="/product?category=baby-bag"
        bgClass="bg-gray-50"
      />
    </>
  );
}
