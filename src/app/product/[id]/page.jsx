import { getSingleProduct, getProduct } from '@/actions/server/product';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { notFound } from 'next/navigation';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getSingleProduct(id);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  const title = product.seoTitle || `${product.name} Price in Bangladesh`;
  const description =
    product.seoDescription || product.shortDescription || product.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/product/${id}`,
      images: product.images?.[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
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
    .filter((p) => p._id.toString() !== id && p.category === product.category)
    .slice(0, 4);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.shortDescription || product.description,
    sku: product.sku || product._id,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${id}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
