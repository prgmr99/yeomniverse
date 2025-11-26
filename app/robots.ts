import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Example of disallowed path
    },
    sitemap: 'https://hyo-tier.vercel.app/sitemap.xml',
  };
}
