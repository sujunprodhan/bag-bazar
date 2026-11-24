'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiArrowRight,
  FiShield,
  FiTruck,
  FiRefreshCw,
} from 'react-icons/fi';
import Container from '@/layout/Container';

const slides = [
  {
    id: 1,
    tag: 'NEW ARRIVAL 2026',
    title: 'Crafted For Your Daily Journey',
    description:
      'Engineered with premium water-resistant ballistic fabric, ergonomic padded straps, and smart multi-compartment storage for work, travel, and everyday carry.',
    price: '$59.00',
    originalPrice: '$89.00',
    badge: '35% OFF',
    image: '/images/bags/bag-1.png',
    link: '/product',
    category: 'Urban Daypack',
  },
  {
    id: 2,
    tag: 'PREMIUM TRAVEL EDITION',
    title: 'Engineered For Tough Expeditions',
    description:
      'Ultra-durable, weather-sealed backpack with breathable honeycomb back support and heavy-duty load distribution. Ready for any trail and destination.',
    price: '$79.00',
    originalPrice: '$119.00',
    badge: 'BESTSELLER',
    image: '/images/bags/bag-2.png',
    link: '/product',
    category: 'Adventure Rucksack',
  },
  {
    id: 3,
    tag: 'MINIMALIST LUXURY',
    title: 'Sleek Aesthetic With Smart Utility',
    description:
      'Tailored for modern urban commuters. Features dedicated 16-inch padded laptop compartment, quick-access RFID security pocket, and water-repellent finish.',
    price: '$65.00',
    originalPrice: '$95.00',
    badge: 'TRENDING',
    image: '/images/bags/bag-3.png',
    link: '/product',
    category: 'Executive Commuter',
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const changeSlide = useCallback((targetIndex) => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      setCurrent(targetIndex);
      setIsFadingOut(false);
    }, 320);
  }, [isFadingOut]);

  const nextSlide = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsFadingOut(false);
    }, 320);
  }, [isFadingOut]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4800);
    return () => clearInterval(timer);
  }, [nextSlide, current]);

  const active = slides[current];

  return (
    <section className="relative overflow-hidden bg-light-section border-b border-light-section py-10 lg:py-16">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[500px]">
          <div className="lg:col-span-7 min-h-[440px] flex items-center">
            <div
              className={`w-full space-y-6 transition-all duration-300 ease-in-out ${
                isFadingOut
                  ? 'opacity-0 -translate-y-2'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-accent text-xs font-bold tracking-wider uppercase font-heading">
                  {active.tag}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-primary leading-[1.15] tracking-tight">
                {active.title}
              </h1>

              <p className="text-muted text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                {active.description}
              </p>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary font-heading">
                  {active.price}
                </span>
                <span className="text-muted line-through text-base sm:text-lg font-medium">
                  {active.originalPrice}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-accent text-white text-xs font-bold">
                  Save {active.badge}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={active.link}
                  className="bg-accent hover:opacity-90 text-white px-7 py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base group cursor-pointer"
                >
                  <span>Shop Now</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/product"
                  className="border border-primary/25 text-primary hover:border-accent hover:text-accent bg-white/70 backdrop-blur-xs px-6 py-3.5 rounded-xl font-semibold transition-all text-sm sm:text-base cursor-pointer"
                >
                  View Collection
                </Link>
              </div>

              <div className="pt-6 border-t border-primary/10 grid grid-cols-3 gap-3 max-w-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-accent shadow-xs shrink-0">
                    <FiTruck />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-primary">Free Delivery</p>
                    <p className="text-muted text-[11px]">Orders over $50</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-accent shadow-xs shrink-0">
                    <FiShield />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-primary">Genuine Brand</p>
                    <p className="text-muted text-[11px]">100% Authentic</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-accent shadow-xs shrink-0">
                    <FiRefreshCw />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-primary">Easy Return</p>
                    <p className="text-muted text-[11px]">30 Days Policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              <div className="absolute inset-0 m-auto w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-accent/20 to-primary/15 blur-xl -z-10" />

              <div
                className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isFadingOut
                    ? 'opacity-0 scale-95'
                    : 'opacity-100 scale-100'
                }`}
              >
                <div className="relative w-72 sm:w-88 h-72 sm:h-88 animate-gentle-float">
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/60">
                  <span className="text-xs font-bold text-primary">
                    {active.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-full max-w-md pt-4 gap-2 z-20">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => changeSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                    current === idx
                      ? 'w-8 bg-accent'
                      : 'w-2.5 bg-primary/20 hover:bg-primary/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
