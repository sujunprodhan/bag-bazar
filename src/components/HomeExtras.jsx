import React from 'react';
import Link from 'next/link';
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiStar,
  FiArrowRight,
  FiZap,
} from 'react-icons/fi';
import Container from '@/layout/Container';

const trustFeatures = [
  {
    icon: FiTruck,
    title: 'Nationwide Delivery',
    desc: 'Fast doorstep delivery across all 64 districts in Bangladesh with Cash on Delivery.',
  },
  {
    icon: FiShield,
    title: 'Premium Quality',
    desc: 'Water-resistant fabrics, heavy-duty zippers, and reinforced stitching built to last.',
  },
  {
    icon: FiRefreshCw,
    title: '7-Day Easy Exchange',
    desc: 'Hassle-free replacement within 7 days if there is any sizing or quality issue.',
  },
  {
    icon: FiHeadphones,
    title: 'Dedicated Support',
    desc: 'Friendly customer care available 7 days a week via phone, email, and social media.',
  },
];

const testimonials = [
  {
    name: 'Nusrat Jahan',
    location: 'Dhaka',
    product: 'Ladies Tote Bag',
    quote:
      'The stitching and leather finish exceeded my expectations! Delivered within 24 hours with Cash on Delivery.',
  },
  {
    name: 'Tanvir Ahmed',
    location: 'Chattogram',
    product: 'Urban Trek Backpack 40L',
    quote:
      'Used this backpack on a 5-day trip to Sajek. Super comfortable straps and completely waterproof.',
  },
  {
    name: 'Farhana Islam',
    location: 'Sylhet',
    product: 'Trolley Luggage Set',
    quote:
      'Smooth wheels, sturdy handle, and paid easily via bKash. BagBazar is now my go-to bag store!',
  },
];

export default function HomeExtras() {
  return (
    <>
      <section className="py-14 bg-gray-50">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 sm:p-12 lg:p-14 shadow-xl">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-accent/25 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-24 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-orange-300 text-xs font-bold uppercase tracking-wider">
                  <FiZap className="text-accent" />
                  Season Special Offer
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl leading-tight">
                  Up to 35% Off on Travel &amp; Everyday Backpacks
                </h2>
                <p className="text-white/75 text-sm sm:text-base leading-relaxed">
                  Upgrade your daily commute or weekend getaway with durable, weather-ready bags.
                  Pay easily with Cash on Delivery, bKash, Nagad, Rocket, or Upay.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/product?category=travel-bag"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent hover:opacity-90 text-white font-bold text-sm shadow-lg transition-all"
                >
                  <span>Shop Travel Bags</span>
                  <FiArrowRight />
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
                >
                  All Collections
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 bg-white border-t border-gray-100">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-accent text-xs font-bold tracking-widest uppercase mb-1">
              The BagBazar Promise
            </p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
              Why Shop With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-light-section/70 border border-primary/10 hover:border-accent/40 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-white text-accent flex items-center justify-center text-xl shadow-xs mb-4">
                    <Icon />
                  </div>
                  <h3 className="font-heading font-bold text-base text-primary mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-accent text-xs font-bold tracking-widest uppercase mb-1">
                Verified Buyers
              </p>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
                Loved by Customers Across Bangladesh
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className="fill-amber-400" />
                ))}
              </div>
              <span>4.9 / 5.0 Average Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((review, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-primary">{review.name}</p>
                    <p className="text-xs text-muted">{review.location}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-50 text-accent text-[11px] font-semibold">
                    {review.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
