/**
 * Common types for blog publishers
 */

export interface BlogPost {
  title: string;
  content: string; // HTML format
  tags: string[];
  category: string;
  visibility: 'public' | 'private' | 'protected';
  thumbnail?: string;
  publishedAt?: Date;
}

export interface PublishResult {
  success: boolean;
  platform: 'tistory' | 'velog';
  postId?: string;
  postUrl?: string;
  error?: string;
}

export interface BlogPublisher {
  authenticate(): Promise<boolean>;
  createPost(post: BlogPost): Promise<PublishResult>;
}

export interface SeoMetaTags {
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
    url: string;
  };
  twitter: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    image: string;
  };
  keywords: string[];
  description: string;
}

export interface JsonLdSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}
