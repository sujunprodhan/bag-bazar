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
    title: 'সারা দেশে ডেলিভারি',
    desc: 'বাংলাদেশের ৬৪ জেলায় ক্যাশ অন ডেলিভারিসহ দ্রুত হোম ডেলিভারি।',
  },
  {
    icon: FiShield,
    title: 'সেরা মানের নিশ্চয়তা',
    desc: 'ওয়াটার-রেজিস্ট্যান্ট ফ্যাব্রিক, মজবুত জিপার এবং টেকসই সেলাইয়ের গ্যারান্টি।',
  },
  {
    icon: FiRefreshCw,
    title: '৭ দিনের সহজ এক্সচেঞ্জ',
    desc: 'সাইজ বা কোয়ালিটি নিয়ে কোনো সমস্যা হলে ৭ দিনের মধ্যে ঝামেলাহীন এক্সচেঞ্জ সুবিধা।',
  },
  {
    icon: FiHeadphones,
    title: 'ডেডিকেটেড সাপোর্ট',
    desc: 'সপ্তাহের ৭ দিনই ফোন, ইমেইল ও সোশ্যাল মিডিয়ার মাধ্যমে আমাদের আন্তরিক কাস্টমার কেয়ার।',
  },
];

const testimonials = [
  {
    name: 'নুসরাত জাহান',
    location: 'ঢাকা',
    product: 'লেডিস টোট ব্যাগ',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      'ব্যাগটির সেলাই ও লেদার ফিনিশ আমার প্রত্যাশার চেয়েও ভালো ছিল! ক্যাশ অন ডেলিভারিতে ২৪ ঘণ্টার মধ্যেই হাতে পেয়েছি।',
  },
  {
    name: 'তানভীর আহমেদ',
    location: 'চট্টগ্রাম',
    product: 'আরবান ট্রেক ব্যাকপ্যাক ৪০L',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote:
      'সাজেক ৫ দিনের ট্রিপে এই ব্যাকপ্যাকটি ব্যবহার করেছি। স্ট্র্যাপগুলো খুবই আরামদায়ক এবং সম্পূর্ণ ওয়াটারপ্রুফ।',
  },
  {
    name: 'ফারহানা ইসলাম',
    location: 'সিলেট',
    product: 'ট্রলি লাগেজ সেট',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote:
      'চাকাগুলো খুবই স্মুথ, হ্যান্ডেল মজবুত এবং বিকাশে সহজেই পেমেন্ট করেছি। ব্যাগবাজার এখন আমার পছন্দের ব্যাগ স্টোর!',
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
                  সিজনাল স্পেশাল অফার
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl leading-tight">
                  ট্রাভেল ও প্রতিদিনের ব্যাকপ্যাকে সর্বোচ্চ ৩৫% ছাড়
                </h2>
                <p className="text-white/75 text-sm sm:text-base leading-relaxed">
                  প্রতিদিনের যাতায়াত কিংবা ভ্রমণের জন্য নিন টেকসই ও ওয়েদার-রেডি ব্যাগ। সহজেই
                  পেমেন্ট করুন ক্যাশ অন ডেলিভারি, বিকাশ, নগদ, রকেট অথবা উপায়ের মাধ্যমে।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/product?category=travel-bag"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent hover:opacity-90 text-white font-bold text-sm shadow-lg transition-all"
                >
                  <span>ট্রাভেল ব্যাগ দেখুন</span>
                  <FiArrowRight />
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
                >
                  সকল কালেকশন
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
              ব্যাগবাজারের প্রতিশ্রুতি
            </p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
              কেন আমাদের থেকে কেনাকাটা করবেন?
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
                ভেরিফায়েড ক্রেতা
              </p>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
                সারা দেশের ক্রেতাদের ভালোবাসায়
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} className="fill-amber-400" />
                ))}
              </div>
              <span>৪.৯ / ৫.০ গড় রেটিং</span>
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
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-primary truncate">{review.name}</p>
                      <p className="text-xs text-muted">{review.location}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-50 text-accent text-[11px] font-semibold shrink-0">
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
