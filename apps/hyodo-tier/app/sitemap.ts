import type { MetadataRoute } from 'next';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyo-tier.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
