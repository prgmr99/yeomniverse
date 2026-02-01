import type { MetadataRoute } from 'next';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyo-tier.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
