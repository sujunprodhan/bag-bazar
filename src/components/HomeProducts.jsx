import React from 'react';
import { getProduct } from '@/actions/server/product';
import HomeCategorySection from './HomeCategorySection';
import CategoryMarquee from './CategoryMarquee';
import HomeFeaturedSections from './HomeFeaturedSections';

const HomeProducts = async () => {
  const products = (await getProduct()) || [];
  return (
    <>
      <CategoryMarquee products={products} />
      <HomeCategorySection products={products} />
      <HomeFeaturedSections products={products} />
    </>
  );
};

export default HomeProducts;
