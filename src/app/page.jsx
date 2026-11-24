import Hero from '@/components/Hero';
import Product from '@/components/Product';

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <Product></Product>
    </div>
  );
}
