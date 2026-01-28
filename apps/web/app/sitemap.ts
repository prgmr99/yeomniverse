export default function sitemap() {
  return [{
    url: process.env.NEXT_PUBLIC_DOMAIN_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }];
}
