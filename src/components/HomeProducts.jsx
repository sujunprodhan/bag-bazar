import React from 'react';
import { getProduct } from '@/actions/server/product';
import HomeCategorySection from './HomeCategorySection';
import CategoryMarquee from './CategoryMarquee';

const HomeProducts = async () => {
  const products = (await getProduct()) || [];
  return (
    <>
      <HomeCategorySection products={products} />
      <CategoryMarquee products={products} />
    </>
  );
};

export default HomeProducts;
