'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavLinks = ({ children, href, className = '' }) => {
  const path = usePathname();
  const isActive = href && (href === '/' ? path === '/' : path.startsWith(href));

  return (
    <Link
      href={href || '/'}
      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'text-accent font-semibold bg-light-section'
          : 'text-body-text hover:text-accent hover:bg-light-section'
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLinks;
