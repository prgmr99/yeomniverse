import { collectAllNewsWithRaw } from './collectors/rss-collector';
import { fetchFearGreedIndex } from './collectors/fear-greed-collector';
import { scoreNews } from './analyzers/news-scorer';
import { analyzeNews, formatAnalysisResult } from './analyzers/gemini-analyzer';
import { calculateOneWayIndex, recalcWithFearGreed } from './analyzers/oneway-analyzer';
import { sendDailyBriefing, getContextualAffiliateLinks } from './messengers/telegram-sender';
import { sendEmailBriefing } from './messengers/email-sender';
import { sendPersonalizedBriefings } from './messengers/personalized-email-sender';
import { sendStockNewsAlerts } from './messengers/stock-news-alerter';
import { DEFAULT_ARTICLE_COUNT, MAX_ARTICLE_COUNT, BRIEFING_LANGUAGE } from './config/briefing-config';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('FinBrief Daily Briefing Started\n');
  console.log('='.repeat(50));
  console.log(`[Config] Language: ${BRIEFING_LANGUAGE}`);

  try {
    // Step 1: Collect news + Fear & Greed Index + One-Way Index in parallel
    console.log('\n[Step 1] Collecting news and market indicators...\n');
    const [{ deduplicated: newsItems, raw: rawItems }, fearGreedIndex, rawOneWayIndex] = await Promise.all([
      collectAllNewsWithRaw(),
      fetchFearGreedIndex(),
      calculateOneWayIndex(),
    ]);

    // Recalculate one-way index with Fear & Greed score if both available
    const oneWayIndex = rawOneWayIndex && fearGreedIndex
      ? recalcWithFearGreed(rawOneWayIndex, fearGreedIndex.score)
      : rawOneWayIndex;

    console.log(`[Fear & Greed] ${fearGreedIndex ? `Score: ${fearGreedIndex.score} (${fearGreedIndex.rating})` : 'Unavailable'}`);
    console.log(`[One-Way Index] ${oneWayIndex ? `Score: ${oneWayIndex.score}/100 (${oneWayIndex.label}) ${oneWayIndex.direction}` : 'Unavailable'}`);

    if (newsItems.length === 0) {
      throw new Error('No news collected.');
    }

    // Step 1.5: Score news by importance
    console.log('\n[Step 1.5] Scoring news by importance...\n');
    const scoredItems = scoreNews(newsItems, rawItems);

    // Step 2: AI analysis with max count (will be sliced per tier in messengers)
    console.log(`\n[Step 2] Running AI analysis (top ${MAX_ARTICLE_COUNT})...\n`);
    const analysis = await analyzeNews(scoredItems, MAX_ARTICLE_COUNT, BRIEFING_LANGUAGE);

    console.log('\n' + '='.repeat(50));
    console.log(formatAnalysisResult(analysis));
    console.log('='.repeat(50));

    // Step 3: Affiliate links
    const affiliateLinks = getContextualAffiliateLinks(analysis.keywords, BRIEFING_LANGUAGE);

    // Step 4: Telegram (uses DEFAULT_ARTICLE_COUNT slice)
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
      console.warn('[Step 4] TELEGRAM_CHAT_ID not set, skipping Telegram delivery.');
    } else {
      console.log('\n[Step 4] Sending Telegram message...\n');
      // Telegram gets the default count (3) — slice the full analysis
      const telegramAnalysis = {
        ...analysis,
        topNews: analysis.topNews.slice(0, DEFAULT_ARTICLE_COUNT),
      };
      await sendDailyBriefing(chatId, telegramAnalysis, affiliateLinks, fearGreedIndex, oneWayIndex, BRIEFING_LANGUAGE);
    }

    // Step 5: Email (personalized sender handles per-tier slicing internally)
    console.log('\n[Step 5] Sending emails...\n');

    const usePersonalizedEmails = process.env.USE_PERSONALIZED_EMAILS === 'true';

    if (usePersonalizedEmails) {
      await sendPersonalizedBriefings(analysis, fearGreedIndex, oneWayIndex, BRIEFING_LANGUAGE);
    } else {
      // Legacy email gets the default count
      const legacyAnalysis = {
        ...analysis,
        topNews: analysis.topNews.slice(0, DEFAULT_ARTICLE_COUNT),
      };
      const emailResult = await sendEmailBriefing(legacyAnalysis, affiliateLinks, fearGreedIndex, oneWayIndex, BRIEFING_LANGUAGE);
      console.log(`  Emails sent: ${emailResult.emailsSent}`);
    }

    // Step 5.5: Stock News Alerts (uses deduplicated list, not scored)
    console.log('\n[Step 5.5] Sending watchlist news alerts...\n');
    const alertResult = await sendStockNewsAlerts(newsItems);
    console.log(`  News alerts sent: ${alertResult.emailsSent} emails`);

    // Step 6: Save JSON (full internal data)
    const today = new Date().toISOString().split('T')[0];
    const outputPath = path.join(__dirname, '..', 'data', `${today}.json`);

    const output = {
      date: today,
      timestamp: new Date().toISOString(),
      newsCount: newsItems.length,
      fearGreedIndex,
      oneWayIndex,
      analysis,
      affiliateLinks,
      sentToTelegram: !!chatId,
      usePersonalizedEmails,
      alertsSent: alertResult.emailsSent,
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n[Step 6] Results saved: ${outputPath}`);

    // Step 6b: Save public JSON (no operational metadata for web exposure)
    const publicDataDir = path.join(__dirname, '..', 'data', 'public');
    if (!fs.existsSync(publicDataDir)) {
      fs.mkdirSync(publicDataDir, { recursive: true });
    }

    const publicOutputPath = path.join(publicDataDir, `${today}.json`);
    const outputLanguage = BRIEFING_LANGUAGE;

    const publicOutput = {
      date: today,
      timestamp: new Date().toISOString(),
      newsCount: newsItems.length,
      outputLanguage,
      fearGreedIndex,
      oneWayIndex,
      analysis,
    };

    fs.writeFileSync(publicOutputPath, JSON.stringify(publicOutput, null, 2), 'utf-8');
    console.log(`[Step 6b] Public JSON saved: ${publicOutputPath}`);

    console.log('\nDaily briefing complete.');

  } catch (error) {
    console.error('\nDaily briefing failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  require('dotenv').config();
  main();
}

export { main };
