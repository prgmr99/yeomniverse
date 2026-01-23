/**
 * Example usage of BlogScheduler
 * 
 * This file demonstrates how to integrate the blog scheduler into your application
 */

import { BlogScheduler } from './schedulers/blog-scheduler';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Initialize blog scheduler
  const scheduler = new BlogScheduler({
    // Cron time: Every day at 8:00 AM KST
    cronTime: process.env.BLOG_PUBLISH_TIME || '0 8 * * *',
    
    // Tistory configuration
    enableTistory: process.env.ENABLE_TISTORY === 'true',
    tistory: process.env.ENABLE_TISTORY === 'true' ? {
      clientId: process.env.TISTORY_CLIENT_ID!,
      clientSecret: process.env.TISTORY_CLIENT_SECRET!,
      blogName: process.env.TISTORY_BLOG_NAME!,
      accessToken: process.env.TISTORY_ACCESS_TOKEN!,
    } : undefined,
    
    // Velog configuration
    enableVelog: process.env.ENABLE_VELOG === 'true',
    velog: process.env.ENABLE_VELOG === 'true' ? {
      accessToken: process.env.VELOG_ACCESS_TOKEN!,
      username: process.env.VELOG_USERNAME!,
    } : undefined,
    
    // Site configuration
    siteUrl: process.env.SITE_URL || 'https://finbrief.io',
    telegramLink: process.env.TELEGRAM_LINK || 'https://t.me/finbrief_bot',
  });

  // Test authentication
  console.log('🧪 Testing blog publishers authentication...\n');
  const testResult = await scheduler.testPublish();
  
  if (!testResult) {
    console.error('❌ Publisher authentication failed. Please check your credentials.');
    process.exit(1);
  }

  // Option 1: Schedule automatic daily publishing
  if (process.env.ENABLE_SCHEDULER === 'true') {
    scheduler.scheduleDaily();
    console.log('✅ Blog scheduler is running. Press Ctrl+C to stop.\n');
    
    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping scheduler...');
      scheduler.stop();
      process.exit(0);
    });
  }
  
  // Option 2: Manual one-time publish
  else if (process.env.RUN_ONCE === 'true') {
    console.log('📝 Running one-time blog publish...\n');
    
    // You can pass your briefing content here
    const briefingContent = process.env.BRIEFING_CONTENT;
    
    const result = await scheduler.runPublishingPipeline(briefingContent);
    
    if (result.success) {
      console.log('\n✅ Publishing completed successfully!');
      console.log('Stats:', scheduler.getStats());
      process.exit(0);
    } else {
      console.error('\n❌ Publishing failed');
      console.error('Errors:', result.errors);
      process.exit(1);
    }
  }
  
  // Default: just show stats
  else {
    console.log('\n📊 Current Statistics:');
    console.log(scheduler.getStats());
    console.log('\nTip: Set ENABLE_SCHEDULER=true or RUN_ONCE=true to publish\n');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { BlogScheduler };
