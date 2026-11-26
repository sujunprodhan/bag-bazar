import { Suspense } from 'react';
import { Inter, Poppins, Hind_Siliguri, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import Navbar from '@/layout/Navbar';
import Footer from '@/layout/Footer';
import { ShopProvider } from '@/context/ShopContext';
import AuthProvider from '@/provider/AuthProvider';
import RouteProgressBar from '@/components/RouteProgressBar';
import LiveChatWidget from '@/components/LiveChatWidget';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  variable: '--font-hind-siliguri',
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: '--font-noto-sans-bengali',
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'BagBazar | Premium Bags, Backpacks & Luggage Store in Bangladesh',
    template: '%s | BagBazar',
  },
  description:
    'Shop premium backpacks, travel bags, ladies handbags, school bags, baby bags, and trolley luggage in Bangladesh with fast Cash on Delivery, bKash, Nagad, Rocket & Upay.',
  keywords: [
    'BagBazar',
    'bag store Bangladesh',
    'backpack price in Bangladesh',
    'travel bag BD',
    'ladies bag',
    'school bag',
    'baby bag',
    'trolley luggage',
    'online bag shop Dhaka',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'BagBazar',
    title: 'BagBazar | Premium Bags, Backpacks & Luggage Store in Bangladesh',
    description:
      'Discover durable backpacks, travel bags, ladies bags, school bags & luggage at BagBazar with Cash on Delivery nationwide.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BagBazar | Premium Bags & Luggage Store',
    description:
      'Shop backpacks, travel bags, ladies handbags, school bags & baby bags in Bangladesh.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'BagBazar',
    url: baseUrl,
    description:
      'Online bag and luggage store in Bangladesh offering backpacks, travel bags, ladies bags, school bags, and baby bags.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'House 24, Road 11, Banani',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${hindSiliguri.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AuthProvider>
          <ShopProvider>
            <Suspense fallback={null}>
              <RouteProgressBar />
            </Suspense>
            <header>
              <Navbar />
            </header>
            <main className="flex-1 min-h-[calc(100vh-318px)]">{children}</main>
            <Footer />
            <LiveChatWidget />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
