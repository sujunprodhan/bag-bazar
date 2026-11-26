'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  FiShoppingBag,
  FiSearch,
  FiMenu,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiGrid,
  FiShield,
} from 'react-icons/fi';
import NavLinks from '@/buttons/NavLink';
import Container from './Container';
import { useShop } from '@/context/ShopContext';

const productCategories = [
  { name: 'All Products', href: '/product' },
  { name: 'Backpack', href: '/product?category=backpack' },
  { name: 'Travel Bag', href: '/product?category=travel-bag' },
  { name: 'Ladies Bag', href: '/product?category=ladies-bag' },
  { name: 'Tote Bag', href: '/product?category=tote-bag' },
  { name: 'Handbag', href: '/product?category=handbag' },
  { name: 'School Bag', href: '/product?category=school-bag' },
  { name: 'Baby Bag', href: '/product?category=baby-bag' },
  { name: 'Trolley Luggage', href: '/product?category=trolley-luggage' },
  { name: 'Gym Duffel Bag', href: '/product?category=gym-duffel-bag' },
  { name: 'Umbrella', href: '/product?category=umbrella' },
  { name: 'Raincoat', href: '/product?category=raincoat' },
];

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, favoritesCount } = useShop();
  const menuRef = useRef(null);
  const productMenuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (productMenuRef.current && !productMenuRef.current.contains(e.target)) {
        setProductMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

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
            {navLinks.map((link) =>
              link.name === 'Product' ? (
                <div
                  key={link.href}
                  ref={productMenuRef}
                  className="relative group"
                  onMouseEnter={() => setProductMenuOpen(true)}
                  onMouseLeave={() => setProductMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <NavLinks href={link.href}>
                      <span className="inline-flex items-center gap-1">
                        <span>{link.name}</span>
                        <FiChevronDown
                          className={`text-xs transition-transform duration-200 ${
                            productMenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    </NavLinks>
                  </div>

                  {productMenuOpen && (
                    <div className="absolute left-0 top-full pt-2 w-72 z-50">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-3 grid grid-cols-2 gap-1 animate-card-in">
                        {productCategories.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            onClick={() => setProductMenuOpen(false)}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-accent transition truncate"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLinks key={link.href} href={link.href}>
                  {link.name}
                </NavLinks>
              )
            )}
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
              href="/favorites"
              className="relative p-2.5 rounded-full text-primary hover:text-accent hover:bg-light-section transition-colors"
              aria-label="Favorites"
            >
              <FiHeart className="text-xl" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[11px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-full text-primary hover:text-accent hover:bg-light-section transition-colors"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[11px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {session?.user ? (
              <div className="relative pl-1" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-light-section border border-primary/10 hover:border-accent transition cursor-pointer"
                >
                  {session.user.image && !imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary text-accent flex items-center justify-center text-xs font-bold">
                      {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-primary max-w-28 truncate">
                    {session.user.name || session.user.email}
                  </span>
                  <FiChevronDown
                    className={`text-xs text-muted transition-transform ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-50 animate-card-in">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-bold text-sm text-primary truncate">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-xs text-muted truncate">{session.user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-orange-50 text-accent text-[10px] font-bold uppercase">
                        {session.user.role || 'user'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard?view=user"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-accent transition"
                      >
                        <FiGrid className="text-base" />
                        <span>User Dashboard</span>
                      </Link>

                      {session.user.role === 'admin' && (
                        <Link
                          href="/dashboard?view=admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-orange-50 hover:text-accent transition"
                        >
                          <FiShield className="text-base text-accent" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-accent transition"
                      >
                        <FiHeart className="text-base" />
                        <span>My Wishlist</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <FiLogOut className="text-base" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/favorites"
              className="relative p-2 rounded-lg text-primary hover:text-accent hover:bg-light-section"
              aria-label="Favorites"
            >
              <FiHeart className="text-xl" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-primary hover:text-accent hover:bg-light-section"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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
              {navLinks.map((link) =>
                link.name === 'Product' ? (
                  <div key={link.href} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div onClick={() => setIsOpen(false)} className="flex-1">
                        <NavLinks href={link.href} className="block w-full py-2.5">
                          {link.name}
                        </NavLinks>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMobileProductOpen((prev) => !prev)}
                        aria-label="Toggle product categories"
                        className="p-2 text-primary hover:text-accent cursor-pointer"
                      >
                        <FiChevronDown
                          className={`text-base transition-transform ${
                            mobileProductOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {mobileProductOpen && (
                      <div className="grid grid-cols-2 gap-1 pl-3 pb-2">
                        {productCategories.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            onClick={() => setIsOpen(false)}
                            className="px-2.5 py-1.5 rounded-lg bg-light-section text-xs font-medium text-gray-700 hover:text-accent truncate"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={link.href} onClick={() => setIsOpen(false)}>
                    <NavLinks href={link.href} className="block w-full py-2.5">
                      {link.name}
                    </NavLinks>
                  </div>
                )
              )}
            </div>

            <div className="pt-3 border-t border-light-section flex flex-col gap-2 px-2">
              {session?.user ? (
                <>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-light-section">
                    <FiUser className="text-primary text-sm shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primary truncate">
                        {session.user.name || session.user.email}
                      </p>
                      <p className="text-[10px] text-accent font-bold uppercase">
                        {session.user.role || 'user'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard?view=user"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-primary hover:border-accent"
                  >
                    <FiGrid />
                    <span>User Dashboard</span>
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link
                      href="/dashboard?view=admin"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-200 bg-orange-50 text-xs font-semibold text-accent"
                    >
                      <FiShield />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-rose-200 text-rose-600 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <FiLogOut />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
