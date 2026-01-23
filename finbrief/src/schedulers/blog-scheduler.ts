import * as cron from 'node-cron';
import { TistoryPublisher } from '../publishers/tistory-publisher';
import { VelogPublisher } from '../publishers/velog-publisher';
import { ContentTransformer } from '../publishers/content-transformer';
import { BlogPost, PublishResult } from '../publishers/types';

interface BlogSchedulerConfig {
  cronTime: string;
  tistory?: {
    clientId: string;
    clientSecret: string;
    blogName: string;
    accessToken: string;
  };
  velog?: {
    accessToken: string;
    username: string;
  };
  siteUrl?: string;
  telegramLink?: string;
  enableTistory?: boolean;
  enableVelog?: boolean;
}

interface PublishingResult {
  date: Date;
  platforms: {
    tistory?: PublishResult;
    velog?: PublishResult;
  };
  success: boolean;
  errors: string[];
}

export class BlogScheduler {
  private config: BlogSchedulerConfig;
  private tistoryPublisher?: TistoryPublisher;
  private velogPublisher?: VelogPublisher;
  private contentTransformer: ContentTransformer;
  private cronJob?: cron.ScheduledTask;
  private publishingHistory: PublishingResult[] = [];

  constructor(config: BlogSchedulerConfig) {
    this.config = config;
    this.contentTransformer = new ContentTransformer(
      config.siteUrl || 'https://finbrief.io'
    );

    // Initialize publishers
    if (config.enableTistory && config.tistory) {
      this.tistoryPublisher = new TistoryPublisher(config.tistory);
    }

    if (config.enableVelog && config.velog) {
      this.velogPublisher = new VelogPublisher(config.velog);
    }
  }

  /**
   * Schedule daily blog posting
   */
  scheduleDaily(cronTime?: string): void {
    const scheduleTime = cronTime || this.config.cronTime;

    console.log(`📅 Scheduling blog posts at: ${scheduleTime}`);

    this.cronJob = cron.schedule(scheduleTime, async () => {
      console.log('⏰ Running scheduled blog publishing...');
      await this.runPublishingPipeline();
    });

    console.log('✅ Blog scheduler started');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log('🛑 Blog scheduler stopped');
    }
  }

  /**
   * Run the complete publishing pipeline
   */
  async runPublishingPipeline(
    briefingContent?: string
  ): Promise<PublishingResult> {
    const result: PublishingResult = {
      date: new Date(),
      platforms: {},
      success: false,
      errors: [],
    };

    try {
      console.log('📝 Starting blog publishing pipeline...');

      // Generate blog content
      const blogPost = await this.generateBlogContent(briefingContent);

      if (!blogPost) {
        result.errors.push('Failed to generate blog content');
        return result;
      }

      console.log(`📄 Blog post created: "${blogPost.title}"`);

      // Publish to all platforms
      const publishResults = await this.publishToAllPlatforms(blogPost);

      result.platforms = publishResults;

      // Check if at least one platform succeeded
      const hasSuccess = Object.values(publishResults).some((r) => r?.success);
      result.success = hasSuccess;

      // Collect errors
      for (const [platform, publishResult] of Object.entries(publishResults)) {
        if (publishResult && !publishResult.success) {
          result.errors.push(`${platform}: ${publishResult.error}`);
        }
      }

      // Save to history
      this.publishingHistory.push(result);

      // Log results
      if (result.success) {
        console.log('✅ Blog publishing completed successfully');
        for (const [platform, publishResult] of Object.entries(
          result.platforms
        )) {
          if (publishResult?.success) {
            console.log(`  ✓ ${platform}: ${publishResult.postUrl}`);
          }
        }
      } else {
        console.error('❌ Blog publishing failed');
        console.error('Errors:', result.errors);
      }

      return result;
    } catch (error: any) {
      console.error('❌ Pipeline error:', error.message);
      result.errors.push(error.message);
      return result;
    }
  }

  /**
   * Generate blog content from briefing
   */
  async generateBlogContent(
    briefingContent?: string
  ): Promise<BlogPost | null> {
    try {
      // If no briefing content provided, use a placeholder
      // In production, this would fetch from your briefing generator
      const content =
        briefingContent ||
        `📈 한국 증시
코스피 2,500pt 마감 (+0.5%)
외국인 매수세 유입

🌏 미국 증시
나스닥 강세 지속
빅테크 중심 상승

💰 환율
달러/원: 1,300원대 유지`;

      const blogPost = this.contentTransformer.createBlogPost(content, {
        visibility: 'public',
      });

      return blogPost;
    } catch (error) {
      console.error('Failed to generate blog content:', error);
      return null;
    }
  }

  /**
   * Publish to all enabled platforms
   */
  async publishToAllPlatforms(post: BlogPost): Promise<{
    tistory?: PublishResult;
    velog?: PublishResult;
  }> {
    const results: {
      tistory?: PublishResult;
      velog?: PublishResult;
    } = {};

    // Publish to Tistory
    if (this.tistoryPublisher) {
      console.log('📮 Publishing to Tistory...');
      try {
        results.tistory = await this.tistoryPublisher.createPostWithRetry(post);
      } catch (error: any) {
        results.tistory = {
          success: false,
          platform: 'tistory',
          error: error.message,
        };
      }
    }

    // Publish to Velog
    if (this.velogPublisher) {
      console.log('📮 Publishing to Velog...');
      try {
        results.velog = await this.velogPublisher.createPostWithRetry(post);
      } catch (error: any) {
        results.velog = {
          success: false,
          platform: 'velog',
          error: error.message,
        };
      }
    }

    return results;
  }

  /**
   * Test publishing with authentication check
   */
  async testPublish(): Promise<boolean> {
    console.log('🧪 Testing blog publishers...\n');

    let allSuccess = true;

    // Test Tistory
    if (this.tistoryPublisher) {
      console.log('Testing Tistory...');
      const authSuccess = await this.tistoryPublisher.authenticate();
      if (!authSuccess) {
        console.error('❌ Tistory authentication failed');
        allSuccess = false;
      }
    }

    // Test Velog
    if (this.velogPublisher) {
      console.log('Testing Velog...');
      const authSuccess = await this.velogPublisher.authenticate();
      if (!authSuccess) {
        console.error('❌ Velog authentication failed');
        allSuccess = false;
      }
    }

    if (allSuccess) {
      console.log('\n✅ All publisher tests passed!');
    } else {
      console.log('\n❌ Some publisher tests failed');
    }

    return allSuccess;
  }

  /**
   * Get publishing history
   */
  getHistory(limit: number = 10): PublishingResult[] {
    return this.publishingHistory.slice(-limit);
  }

  /**
   * Get statistics
   */
  getStats() {
    const total = this.publishingHistory.length;
    const successful = this.publishingHistory.filter((r) => r.success).length;
    const failed = total - successful;

    const platformStats = {
      tistory: {
        total: 0,
        successful: 0,
        failed: 0,
      },
      velog: {
        total: 0,
        successful: 0,
        failed: 0,
      },
    };

    for (const result of this.publishingHistory) {
      if (result.platforms.tistory) {
        platformStats.tistory.total++;
        if (result.platforms.tistory.success) {
          platformStats.tistory.successful++;
        } else {
          platformStats.tistory.failed++;
        }
      }

      if (result.platforms.velog) {
        platformStats.velog.total++;
        if (result.platforms.velog.success) {
          platformStats.velog.successful++;
        } else {
          platformStats.velog.failed++;
        }
      }
    }

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      platforms: platformStats,
    };
  }
}
