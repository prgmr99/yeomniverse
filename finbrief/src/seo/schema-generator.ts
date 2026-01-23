import { JsonLdSchema } from '../publishers/types';

export class SchemaGenerator {
  private readonly siteName: string = 'FinBrief';
  private readonly siteUrl: string;
  private readonly logoUrl: string;

  constructor(siteUrl: string, logoUrl?: string) {
    this.siteUrl = siteUrl;
    this.logoUrl = logoUrl || `${siteUrl}/logo.png`;
  }

  /**
   * Generate Article schema
   */
  generateArticleSchema(
    title: string,
    description: string,
    imageUrl: string,
    publishedDate: Date,
    author: string = 'FinBrief AI'
  ): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: imageUrl,
      datePublished: publishedDate.toISOString(),
      dateModified: publishedDate.toISOString(),
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
        logo: {
          '@type': 'ImageObject',
          url: this.logoUrl,
        },
      },
    };
  }

  /**
   * Generate Organization schema
   */
  generateOrganizationSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.siteName,
      url: this.siteUrl,
      logo: this.logoUrl,
      description: '매일 아침 AI가 정리하는 금융 브리핑',
      sameAs: [
        // Add social media URLs if available
        // 'https://twitter.com/finbrief',
        // 'https://github.com/your-repo',
      ],
    };
  }

  /**
   * Generate Breadcrumb schema
   */
  generateBreadcrumbSchema(url: string, pageTitle: string): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: this.siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: pageTitle,
          item: url,
        },
      ],
    };
  }

  /**
   * Generate WebPage schema
   */
  generateWebPageSchema(
    url: string,
    title: string,
    description: string
  ): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: url,
      name: title,
      description: description,
      publisher: {
        '@type': 'Organization',
        name: this.siteName,
      },
    };
  }

  /**
   * Convert schema to JSON-LD script tag
   */
  toScriptTag(schema: JsonLdSchema | JsonLdSchema[]): string {
    const schemaArray = Array.isArray(schema) ? schema : [schema];
    const jsonContent = JSON.stringify(schemaArray, null, 2);

    return `<script type="application/ld+json">\n${jsonContent}\n</script>`;
  }
}
