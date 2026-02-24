import type { MetadataRoute } from 'next';
import { getAvailableBriefingDates } from '@/lib/briefing';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const dates = getAvailableBriefingDates();

  const briefingEntries: MetadataRoute.Sitemap = dates.map((date) => ({
    url: `${DOMAIN}/briefing/${date}`,
    lastModified: new Date(date),
    changeFrequency: 'never', // historical data never changes
    priority: 0.6,
  }));

  return [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/one-way-index`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/briefing`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...briefingEntries,
  ];
}
