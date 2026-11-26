import { getSingleProduct, getProduct } from '@/actions/server/product';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getSingleProduct(id);
  if (!product) {
    return { title: 'Product Not Found | BagBazar' };
  }
  return {
    title: `${product.name} | BagBazar`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getSingleProduct(id);

  if (!product) {
    notFound();
  }

  const allProducts = (await getProduct()) || [];
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p._id.toString() !== id &&
        p.category === product.category
    )
    .slice(0, 4);

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
