import { Suspense } from 'react';
import Product from '@/components/Product';
import { ProductGridSkeleton } from '@/components/skeletons/ProductSkeleton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products | BagBazar',
  description: 'Explore our wide collection of premium bags and luggage.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <Product />
    </Suspense>
  );
}
