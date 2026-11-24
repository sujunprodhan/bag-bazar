'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import NavLinks from '@/buttons/NavLink';
import Container from './Container';

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Product', href: '/product' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-white border-b border-light-section sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-accent shadow-sm group-hover:scale-105 transition-transform duration-200">
              <FiShoppingBag className="text-xl" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight">
              <span className="text-primary">Bag</span>
              <span className="text-accent">Bazar</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLinks key={link.href} href={link.href}>
                {link.name}
              </NavLinks>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-base pointer-events-none" />
              <input
                type="text"
                placeholder="Search bags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-light-section text-body-text placeholder-muted rounded-full border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all w-44 lg:w-56 focus:w-64"
              />
            </form>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-full text-primary hover:text-accent hover:bg-light-section transition-colors"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-xl" />
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[11px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow-xs">
                0
              </span>
            </Link>

            <Link
              href="/login"
              className="text-primary hover:text-accent hover:bg-light-section px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="bg-accent hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs hover:shadow transition-all"
            >
              Register
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-primary hover:text-accent hover:bg-light-section"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-xl" />
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                0
              </span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-primary hover:bg-light-section transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-light-section space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative px-2">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-muted text-base pointer-events-none" />
              <input
                type="text"
                placeholder="Search bags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-light-section text-body-text placeholder-muted rounded-lg border border-transparent focus:border-accent focus:bg-white focus:outline-none"
              />
            </form>

            <div className="flex flex-col space-y-1 px-2">
              {navLinks.map((link) => (
                <div key={link.href} onClick={() => setIsOpen(false)}>
                  <NavLinks href={link.href} className="block w-full py-2.5">
                    {link.name}
                  </NavLinks>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-light-section flex flex-col gap-2 px-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 border border-primary/20 text-primary hover:text-accent rounded-lg text-sm font-semibold transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 bg-accent hover:opacity-90 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
