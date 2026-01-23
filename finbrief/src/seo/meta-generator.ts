import * as cheerio from 'cheerio';
import { BlogPost, SeoMetaTags } from '../publishers/types';

export class MetaGenerator {
  private readonly siteUrl: string;
  private readonly siteName: string = 'FinBrief - 매일 금융 브리핑';
  private readonly defaultImage: string;

  constructor(siteUrl: string, defaultImage?: string) {
    this.siteUrl = siteUrl;
    this.defaultImage =
      defaultImage || `${siteUrl}/default-thumbnail.jpg`;
  }

  /**
   * Generate Open Graph meta tags
   */
  generateOpenGraph(post: BlogPost, postUrl: string): SeoMetaTags['openGraph'] {
    return {
      title: post.title,
      description: this.optimizeDescription(post.content),
      image: post.thumbnail || this.defaultImage,
      type: 'article',
      url: postUrl,
    };
  }

  /**
   * Generate Twitter Card meta tags
   */
  generateTwitterCard(post: BlogPost): SeoMetaTags['twitter'] {
    return {
      card: 'summary_large_image',
      title: post.title,
      description: this.optimizeDescription(post.content),
      image: post.thumbnail || this.defaultImage,
    };
  }

  /**
   * Extract keywords from content
   */
  extractKeywords(content: string, tags: string[]): string[] {
    // Start with provided tags
    const keywords = [...tags];

    // Common financial keywords
    const commonKeywords = [
      '금융',
      '경제',
      '주식',
      '투자',
      '뉴스',
      '브리핑',
      '시장',
      '분석',
    ];

    // Extract from content (simple approach)
    const $ = cheerio.load(content);
    const text = $('body').text().toLowerCase();

    for (const keyword of commonKeywords) {
      if (text.includes(keyword) && !keywords.includes(keyword)) {
        keywords.push(keyword);
      }
    }

    // Limit to 10 keywords
    return keywords.slice(0, 10);
  }

  /**
   * Optimize description for SEO (155 characters max)
   */
  optimizeDescription(content: string): string {
    // Remove HTML tags
    const $ = cheerio.load(content);
    let text = $('body').text().trim();

    // Remove extra whitespace
    text = text.replace(/\s+/g, ' ');

    // Truncate to 155 characters
    if (text.length > 155) {
      text = text.substring(0, 152) + '...';
    }

    return text;
  }

  /**
   * Generate complete SEO meta tags
   */
  generateMetaTags(post: BlogPost, postUrl: string): SeoMetaTags {
    return {
      openGraph: this.generateOpenGraph(post, postUrl),
      twitter: this.generateTwitterCard(post),
      keywords: this.extractKeywords(post.content, post.tags),
      description: this.optimizeDescription(post.content),
    };
  }

  /**
   * Generate HTML meta tags string
   */
  toHtmlString(metaTags: SeoMetaTags): string {
    const lines: string[] = [];

    // Basic meta tags
    lines.push(`<meta name="description" content="${metaTags.description}" />`);
    lines.push(
      `<meta name="keywords" content="${metaTags.keywords.join(', ')}" />`
    );

    // Open Graph tags
    lines.push(
      `<meta property="og:title" content="${metaTags.openGraph.title}" />`
    );
    lines.push(
      `<meta property="og:description" content="${metaTags.openGraph.description}" />`
    );
    lines.push(
      `<meta property="og:image" content="${metaTags.openGraph.image}" />`
    );
    lines.push(
      `<meta property="og:type" content="${metaTags.openGraph.type}" />`
    );
    lines.push(
      `<meta property="og:url" content="${metaTags.openGraph.url}" />`
    );
    lines.push(`<meta property="og:site_name" content="${this.siteName}" />`);

    // Twitter Card tags
    lines.push(
      `<meta name="twitter:card" content="${metaTags.twitter.card}" />`
    );
    lines.push(
      `<meta name="twitter:title" content="${metaTags.twitter.title}" />`
    );
    lines.push(
      `<meta name="twitter:description" content="${metaTags.twitter.description}" />`
    );
    lines.push(
      `<meta name="twitter:image" content="${metaTags.twitter.image}" />`
    );

    return lines.join('\n');
  }
}
