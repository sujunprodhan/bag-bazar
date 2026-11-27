import React from 'react';
import Link from 'next/link';
import {
  FiShoppingBag,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
} from 'react-icons/fi';
import Container from './Container';
import { FooterPaymentLogos } from '@/components/PaymentLogos';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Products', href: '/product' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Latest Arrivals', href: '/product?tag=new' },
  ];

  const customerService = [
    { name: 'Track Order', href: '#' },
    { name: 'Shipping & Delivery', href: '#' },
    { name: 'Return & Exchange', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ];

  const categories = [
    { name: 'Backpacks & Rucksacks', href: '/product?cat=backpack' },
    { name: 'Travel & Luggage', href: '/product?cat=travel' },
    { name: 'Leather Bags & Totes', href: '/product?cat=leather' },
    { name: 'Laptop & Office Bags', href: '/product?cat=laptop' },
    { name: 'Accessories & Wallets', href: '/product?cat=accessories' },
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="py-14">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <FiShoppingBag className="text-xl" />
                </div>
                <span className="font-heading font-extrabold text-2xl tracking-tight">
                  <span className="text-white">Bag</span>
                  <span className="text-accent">Bazar</span>
                </span>
              </Link>

              <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                Your premier destination for high-quality backpacks, leather goods, travel luggage, and everyday bags crafted with elegance and durability.
              </p>

              <div className="space-y-2.5 text-sm text-slate-300 pt-2">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-accent text-base shrink-0 mt-1" />
                  <span>Dhanmondi 27, Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-accent text-base shrink-0" />
                  <span>+880 1700-000000</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-accent text-base shrink-0" />
                  <span>support@bagbazar.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-all"
                  aria-label="Facebook"
                >
                  <FiFacebook className="text-base" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <FiInstagram className="text-base" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-all"
                  aria-label="Twitter"
                >
                  <FiTwitter className="text-base" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-all"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin className="text-base" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-heading text-base font-semibold text-white tracking-wide uppercase mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
                Categories
              </h4>
              <ul className="space-y-2.5 text-sm">
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <Link
                      href={cat.href}
                      className="text-slate-300 hover:text-accent transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-base font-semibold text-white tracking-wide uppercase mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-base font-semibold text-white tracking-wide uppercase mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-sm">
                {customerService.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-slate-300 hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      <div className="border-t border-white/10 py-6 bg-primary-dark">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} <span className="text-white font-medium">BagBazar</span>. All rights reserved.
            </p>

            <FooterPaymentLogos />
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
