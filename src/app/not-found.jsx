import Link from 'next/link';
import { FiShoppingBag, FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center space-y-5">
        <p className="font-heading font-extrabold text-6xl text-accent">404</p>
        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-2xl text-primary">
            Page Not Found
          </h1>
          <p className="text-muted text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition"
          >
            <FiHome />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/product"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 transition"
          >
            <FiShoppingBag />
            <span>Browse Bags</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
