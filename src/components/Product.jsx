import React from 'react';
import Container from '@/layout/Container';
import { getProduct } from '@/actions/server/product';

const Product = async() => {
  const products = await getProduct()
  console.log(products);
  
  return (
    <div className="py-12">
      <Container>
      <h1>Product</h1>
      </Container>
    </div>
  );
};

export default Product;
