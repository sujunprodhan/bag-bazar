import React from 'react';
import Link from 'next/link';
import {
  FiAward,
  FiUsers,
  FiMapPin,
  FiShield,
  FiTruck,
  FiHeart,
  FiArrowRight,
} from 'react-icons/fi';
import Container from '@/layout/Container';

const stats = [
  { icon: FiUsers, value: '15,000+', label: 'Happy Customers' },
  { icon: FiAward, value: '500+', label: 'Bag Styles' },
  { icon: FiMapPin, value: '64 Districts', label: 'Delivery Coverage' },
  { icon: FiHeart, value: '4.9 / 5', label: 'Customer Rating' },
];

const values = [
  {
    icon: FiShield,
    title: 'Crafted to Endure',
    desc: 'Every bag is tested for fabric durability, water resistance, and zipper strength before reaching our store.',
  },
  {
    icon: FiTruck,
    title: 'Honest Value & Fast Delivery',
    desc: 'Direct sourcing allows us to offer premium quality at fair prices with reliable nationwide shipping.',
  },
  {
    icon: FiHeart,
    title: 'Customer-First Promise',
    desc: 'From flexible payment options to 7-day easy exchanges, your satisfaction is always our priority.',
  },
];

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative overflow-hidden bg-primary text-white py-16 sm:py-20">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <Container>
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-accent">About Us</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl leading-tight">
              Carry Confidence Every Single Day
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              BagBazar was founded in Bangladesh with one simple mission: to deliver stylish,
              durable, and thoughtfully designed bags for work, travel, school, and everyday life.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-10 bg-white border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-light-section/70 border border-primary/10 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-white text-accent flex items-center justify-center text-xl shadow-xs shrink-0">
                    <Icon />
                  </div>
                  <div>
                    <p className="font-heading font-extrabold text-xl sm:text-2xl text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-accent text-xs font-bold tracking-widest uppercase">
                Our Story
              </p>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
                Built for Commuters, Travelers &amp; Trendsetters
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Whether you are heading to university with a laptop backpack, packing a 40L
                travel duffel for the hills, or picking out an elegant ladies tote for the office,
                we curate collections that blend utility with timeless design.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Every product at BagBazar goes through strict quality checks so you never have to
                compromise between style, comfort, and price.
              </p>
            </div>
            <div className="lg:col-span-5 bg-light-section rounded-2xl p-7 space-y-4 border border-primary/10">
              <h3 className="font-heading font-bold text-lg text-primary">
                What We Offer
              </h3>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li>• Backpacks, Laptop &amp; School Bags</li>
                <li>• Travel Bags &amp; Trolley Luggage</li>
                <li>• Ladies Bags, Handbags &amp; Totes</li>
                <li>• Gym Duffel Bags &amp; Baby Bags</li>
                <li>• Raincoats &amp; All-Weather Umbrellas</li>
              </ul>
              <Link
                href="/product"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all pt-1"
              >
                <span>Explore Collection</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-accent text-xs font-bold tracking-widest uppercase mb-1">
              Our Values
            </p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
              Why Customers Trust BagBazar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-100 p-7 shadow-xs hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-accent flex items-center justify-center text-xl mb-4">
                    <Icon />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    {v.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;
