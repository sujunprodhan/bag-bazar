import { Suspense } from 'react';
import Hero from '@/components/Hero';
import HomeProducts from '@/components/HomeProducts';
import HomeExtras from '@/components/HomeExtras';
import { HomeProductsSkeleton } from '@/components/skeletons/ProductSkeleton';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <Suspense fallback={<HomeProductsSkeleton />}>
        <HomeProducts />
      </Suspense>
      <HomeExtras />
    </div>
  );
}
