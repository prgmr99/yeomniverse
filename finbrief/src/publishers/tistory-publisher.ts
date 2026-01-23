import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { BlogPost, BlogPublisher, PublishResult } from './types';

interface TistoryConfig {
  clientId: string;
  clientSecret: string;
  blogName: string;
  accessToken: string;
}

interface TistoryCategory {
  id: string;
  name: string;
  parent?: string;
  label?: string;
}

export class TistoryPublisher implements BlogPublisher {
  private config: TistoryConfig;
  private client: AxiosInstance;
  private categories: TistoryCategory[] = [];
  private readonly baseUrl = 'https://www.tistory.com/apis';

  constructor(config: TistoryConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    });
  }

  /**
   * Authenticate with Tistory API
   */
  async authenticate(): Promise<boolean> {
    try {
      // Test authentication by fetching blog info
      const response = await this.client.get('/blog/info', {
        params: {
          access_token: this.config.accessToken,
          output: 'json',
        },
      });

      if (response.data.tistory.status === '200') {
        console.log('✅ Tistory authentication successful');
        await this.loadCategories();
        return true;
      }

      console.error('❌ Tistory authentication failed:', response.data);
      return false;
    } catch (error) {
      console.error('❌ Tistory authentication error:', error);
      return false;
    }
  }

  /**
   * Load blog categories
   */
  private async loadCategories(): Promise<void> {
    try {
      const response = await this.client.get('/category/list', {
        params: {
          access_token: this.config.accessToken,
          blogName: this.config.blogName,
          output: 'json',
        },
      });

      if (response.data.tistory.status === '200') {
        this.categories = response.data.tistory.item.categories || [];
        console.log(`📂 Loaded ${this.categories.length} categories from Tistory`);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }

  /**
   * Categorize post based on tags
   */
  categorizePost(tags: string[]): string {
    const categoryMap: Record<string, string[]> = {
      '주식': ['코스피', '코스닥', '상승', '하락', '증시', '주가'],
      '환율': ['달러', '엔화', '원화', '환율', '외환'],
      '암호화폐': ['비트코인', '이더리움', '코인', '가상화폐', '암호화폐'],
      '부동산': ['부동산', '아파트', '주택', '전세', '매매'],
      '경제': ['경제', '금리', '인플레이션', '성장률', 'GDP'],
    };

    for (const tag of tags) {
      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some((keyword) => tag.includes(keyword))) {
          // Find category ID
          const categoryItem = this.categories.find((c) => c.name === category);
          return categoryItem?.id || '0';
        }
      }
    }

    return '0'; // Default category
  }

  /**
   * Upload image to Tistory
   */
  async uploadImage(imageUrl: string): Promise<string | null> {
    try {
      // Download image first
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      const formData = new FormData();
      formData.append('access_token', this.config.accessToken);
      formData.append('blogName', this.config.blogName);
      formData.append('uploadedfile', Buffer.from(imageResponse.data), {
        filename: 'thumbnail.jpg',
        contentType: 'image/jpeg',
      });

      const response = await this.client.post('/post/attach', formData, {
        headers: formData.getHeaders(),
      });

      if (response.data.tistory.status === '200') {
        return response.data.tistory.url;
      }

      return null;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  }

  /**
   * Create and publish a blog post
   */
  async createPost(post: BlogPost): Promise<PublishResult> {
    try {
      const categoryId = this.categorizePost(post.tags);

      const params: any = {
        access_token: this.config.accessToken,
        blogName: this.config.blogName,
        title: post.title,
        content: post.content,
        visibility: post.visibility === 'private' ? '0' : '3', // 0: private, 3: public
        category: categoryId,
        tag: post.tags.join(','),
        output: 'json',
      };

      // Upload thumbnail if provided
      if (post.thumbnail) {
        const uploadedUrl = await this.uploadImage(post.thumbnail);
        if (uploadedUrl) {
          params.content = `<img src="${uploadedUrl}" alt="thumbnail" />\n${params.content}`;
        }
      }

      const response = await this.client.post('/post/write', null, { params });

      if (response.data.tistory.status === '200') {
        const postId = response.data.tistory.postId;
        const postUrl = response.data.tistory.url;

        console.log(`✅ Tistory post published: ${postUrl}`);

        return {
          success: true,
          platform: 'tistory',
          postId,
          postUrl,
        };
      }

      return {
        success: false,
        platform: 'tistory',
        error: `API returned status: ${response.data.tistory.status}`,
      };
    } catch (error: any) {
      console.error('❌ Failed to create Tistory post:', error.message);

      return {
        success: false,
        platform: 'tistory',
        error: error.message,
      };
    }
  }

  /**
   * Retry logic wrapper
   */
  async createPostWithRetry(
    post: BlogPost,
    maxRetries: number = 3
  ): Promise<PublishResult> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.createPost(post);

      if (result.success) {
        return result;
      }

      if (attempt < maxRetries) {
        console.log(`⚠️  Retrying... (${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      }
    }

    return {
      success: false,
      platform: 'tistory',
      error: 'Max retries exceeded',
    };
  }
}
