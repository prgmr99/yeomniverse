import axios, { AxiosInstance } from 'axios';
import TurndownService from 'turndown';
import { BlogPost, BlogPublisher, PublishResult } from './types';

interface VelogConfig {
  accessToken: string;
  username: string;
}

interface VelogSeries {
  id: string;
  name: string;
}

export class VelogPublisher implements BlogPublisher {
  private config: VelogConfig;
  private client: AxiosInstance;
  private turndownService: TurndownService;
  private seriesId: string | null = null;
  private readonly graphqlEndpoint = 'https://v2.velog.io/graphql';

  constructor(config: VelogConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.graphqlEndpoint,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${config.accessToken}`,
      },
    });

    // Initialize Turndown for HTML to Markdown conversion
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
  }

  /**
   * Authenticate by testing a simple query
   */
  async authenticate(): Promise<boolean> {
    try {
      const query = `
        query {
          currentUser {
            id
            username
          }
        }
      `;

      const response = await this.client.post('', { query });

      if (response.data.data?.currentUser?.username === this.config.username) {
        console.log('✅ Velog authentication successful');
        return true;
      }

      console.error('❌ Velog authentication failed');
      return false;
    } catch (error) {
      console.error('❌ Velog authentication error:', error);
      return false;
    }
  }

  /**
   * Convert HTML to Markdown
   */
  convertToMarkdown(html: string): string {
    return this.turndownService.turndown(html);
  }

  /**
   * Create or get series ID
   */
  async ensureSeries(seriesName: string = '매일 금융 브리핑'): Promise<string | null> {
    if (this.seriesId) {
      return this.seriesId;
    }

    try {
      // Check if series exists
      const listQuery = `
        query GetUserSeriesList($username: String!) {
          userSeriesList(username: $username) {
            id
            name
          }
        }
      `;

      const listResponse = await this.client.post('', {
        query: listQuery,
        variables: { username: this.config.username },
      });

      const seriesList: VelogSeries[] =
        listResponse.data.data?.userSeriesList || [];
      const existingSeries = seriesList.find((s) => s.name === seriesName);

      if (existingSeries) {
        this.seriesId = existingSeries.id;
        console.log(`📚 Found existing series: ${seriesName}`);
        return this.seriesId;
      }

      // Create new series
      const createMutation = `
        mutation CreateSeries($name: String!) {
          createSeries(name: $name) {
            id
            name
          }
        }
      `;

      const createResponse = await this.client.post('', {
        query: createMutation,
        variables: { name: seriesName },
      });

      this.seriesId = createResponse.data.data?.createSeries?.id || null;

      if (this.seriesId) {
        console.log(`📚 Created new series: ${seriesName}`);
      }

      return this.seriesId;
    } catch (error) {
      console.error('Failed to manage series:', error);
      return null;
    }
  }

  /**
   * Add post to series
   */
  async addToSeries(postId: string, seriesId: string): Promise<boolean> {
    try {
      const mutation = `
        mutation AppendToSeries($seriesId: ID!, $postId: ID!) {
          appendToSeries(series_id: $seriesId, post_id: $postId) {
            id
          }
        }
      `;

      const response = await this.client.post('', {
        query: mutation,
        variables: {
          seriesId,
          postId,
        },
      });

      return !!response.data.data?.appendToSeries;
    } catch (error) {
      console.error('Failed to add post to series:', error);
      return false;
    }
  }

  /**
   * Create and publish a blog post
   */
  async createPost(post: BlogPost): Promise<PublishResult> {
    try {
      // Convert HTML to Markdown
      const markdown = this.convertToMarkdown(post.content);

      // Add thumbnail if provided
      let finalMarkdown = markdown;
      if (post.thumbnail) {
        finalMarkdown = `![thumbnail](${post.thumbnail})\n\n${markdown}`;
      }

      const mutation = `
        mutation WritePost(
          $title: String!
          $body: String!
          $tags: [String!]
          $is_temp: Boolean
          $is_private: Boolean
          $url_slug: String
          $thumbnail: String
          $meta: JSON
        ) {
          writePost(
            title: $title
            body: $body
            tags: $tags
            is_temp: $is_temp
            is_private: $is_private
            url_slug: $url_slug
            thumbnail: $thumbnail
            meta: $meta
          ) {
            id
            url_slug
            user {
              username
            }
          }
        }
      `;

      const variables = {
        title: post.title,
        body: finalMarkdown,
        tags: post.tags,
        is_temp: false,
        is_private: post.visibility === 'private',
        thumbnail: post.thumbnail || null,
      };

      const response = await this.client.post('', {
        query: mutation,
        variables,
      });

      const postData = response.data.data?.writePost;

      if (postData) {
        const postId = postData.id;
        const postUrl = `https://velog.io/@${postData.user.username}/${postData.url_slug}`;

        console.log(`✅ Velog post published: ${postUrl}`);

        // Add to series
        const seriesId = await this.ensureSeries();
        if (seriesId) {
          await this.addToSeries(postId, seriesId);
        }

        return {
          success: true,
          platform: 'velog',
          postId,
          postUrl,
        };
      }

      return {
        success: false,
        platform: 'velog',
        error: 'Failed to create post - no data returned',
      };
    } catch (error: any) {
      console.error('❌ Failed to create Velog post:', error.message);

      return {
        success: false,
        platform: 'velog',
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
        console.log(`⚠️  Retrying Velog... (${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      }
    }

    return {
      success: false,
      platform: 'velog',
      error: 'Max retries exceeded',
    };
  }
}
