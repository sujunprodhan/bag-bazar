'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);

  const routeKey = `${pathname}?${searchParams?.toString() || ''}`;
  const [prevKey, setPrevKey] = useState(routeKey);

  if (prevKey !== routeKey) {
    setPrevKey(routeKey);
    if (navigating) {
      setNavigating(false);
    }
  }

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank'
      ) {
        return;
      }
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (href !== currentUrl) {
        setNavigating(true);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!navigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-100 pointer-events-none">
      <div className="h-1 w-full bg-orange-100 overflow-hidden">
        <div className="h-full bg-linear-to-r from-orange-400 via-orange-500 to-amber-500 animate-route-progress" />
      </div>
    </div>
  );
}
