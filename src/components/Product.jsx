import React from 'react';
import { getProduct } from '@/actions/server/product';
import ProductFilterClient from './ProductFilterClient';

const Product = async () => {
  const products = (await getProduct()) || [];
  return <ProductFilterClient initialProducts={products} />;
};

export default Product;
