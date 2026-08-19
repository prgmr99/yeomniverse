import type { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blogData';
import { RESULTS } from '@/lib/resultData';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyodo-tier.yeomniverse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Get all blog posts for dynamic URLs
  const posts = getBlogPosts();
  const blogUrls = posts.map((post) => ({
    url: `${DOMAIN}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 결과 유형별 랜딩 — 유형 이름 롱테일 검색 유입을 노린다
  const resultUrls = Object.keys(RESULTS).map((type) => ({
    url: `${DOMAIN}/result/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/parent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/parent/quiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${DOMAIN}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${DOMAIN}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...resultUrls,
    ...blogUrls,
  ];
}
