const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/product', '/about', '/contact'],
        disallow: ['/dashboard', '/api/', '/cart', '/checkout', '/favorites'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
