import { collectAllNews } from './collectors/rss-collector';
import { fetchFearGreedIndex } from './collectors/fear-greed-collector';
import { analyzeNews, formatAnalysisResult } from './analyzers/gemini-analyzer';
import { sendDailyBriefing, getContextualAffiliateLinks } from './messengers/telegram-sender';
import { sendEmailBriefing } from './messengers/email-sender';
import { sendPersonalizedBriefings } from './messengers/personalized-email-sender';
import { sendStockNewsAlerts } from './messengers/stock-news-alerter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 메인 실행 스크립트: RSS 수집 + AI 분석 + 텔레그램 발송 + 개인화 이메일
 */

async function main() {
  console.log('🚀 FinBrief Daily Briefing Started\n');
  console.log('='.repeat(50));
  
  try {
    // Step 1: Collect news + Fear & Greed Index in parallel
    console.log('\n[Step 1] Collecting news and market indicators...\n');
    const [newsItems, fearGreedIndex] = await Promise.all([
      collectAllNews(),
      fetchFearGreedIndex(),
    ]);

    console.log(`[Fear & Greed] ${fearGreedIndex ? `Score: ${fearGreedIndex.score} (${fearGreedIndex.rating})` : 'Unavailable'}`);

    if (newsItems.length === 0) {
      throw new Error('No news collected.');
    }

    // Step 2: AI analysis
    console.log('\n[Step 2] Running AI analysis...\n');
    const analysis = await analyzeNews(newsItems);
    
    // 콘솔에 분석 결과 출력
    console.log('\n' + '='.repeat(50));
    console.log(formatAnalysisResult(analysis));
    console.log('='.repeat(50));
    
    // Step 3: Affiliate links
    const affiliateLinks = getContextualAffiliateLinks(analysis.keywords);

    // Step 4: Telegram
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
      console.warn('[Step 4] TELEGRAM_CHAT_ID not set, skipping Telegram delivery.');
    } else {
      console.log('\n[Step 4] Sending Telegram message...\n');
      await sendDailyBriefing(chatId, analysis, affiliateLinks, fearGreedIndex);
    }

    // Step 5: Email
    console.log('\n[Step 5] Sending emails...\n');

    const usePersonalizedEmails = process.env.USE_PERSONALIZED_EMAILS === 'true';

    if (usePersonalizedEmails) {
      await sendPersonalizedBriefings(analysis, fearGreedIndex);
    } else {
      const emailResult = await sendEmailBriefing(analysis, affiliateLinks, fearGreedIndex);
      console.log(`  Emails sent: ${emailResult.emailsSent}`);
    }

    // Step 5.5: Stock News Alerts (Basic/Pro users with watchlists)
    console.log('\n[Step 5.5] Sending watchlist news alerts...\n');
    const alertResult = await sendStockNewsAlerts(newsItems);
    console.log(`  News alerts sent: ${alertResult.emailsSent} emails`);

    // Step 6: Save JSON
    const today = new Date().toISOString().split('T')[0];
    const outputPath = path.join(__dirname, '..', 'data', `${today}.json`);

    const output = {
      date: today,
      timestamp: new Date().toISOString(),
      newsCount: newsItems.length,
      fearGreedIndex,
      analysis,
      affiliateLinks,
      sentToTelegram: !!chatId,
      usePersonalizedEmails,
      alertsSent: alertResult.emailsSent,
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n[Step 6] Results saved: ${outputPath}`);

    console.log('\nDaily briefing complete.');
    
  } catch (error) {
    console.error('\n❌ Daily briefing failed:', error);
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  // dotenv 로드
  require('dotenv').config();
  
  main();
}

export { main };
