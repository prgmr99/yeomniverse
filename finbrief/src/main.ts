import { collectAllNews } from './collectors/rss-collector';
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
  console.log('🚀 FinBrief 일일 브리핑 시작\n');
  console.log('='.repeat(50));
  
  try {
    // Step 1: 뉴스 수집
    console.log('\n📰 Step 1: 뉴스 수집 중...\n');
    const newsItems = await collectAllNews();
    
    if (newsItems.length === 0) {
      throw new Error('수집된 뉴스가 없습니다.');
    }
    
    // Step 2: AI 분석
    console.log('\n🤖 Step 2: AI 분석 중...\n');
    const analysis = await analyzeNews(newsItems);
    
    // 콘솔에 분석 결과 출력
    console.log('\n' + '='.repeat(50));
    console.log(formatAnalysisResult(analysis));
    console.log('='.repeat(50));
    
    // Step 3: 제휴 링크 생성
    const affiliateLinks = getContextualAffiliateLinks(analysis.keywords);
    
    // Step 4: 텔레그램 발송
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
      console.warn('⚠️ TELEGRAM_CHAT_ID가 설정되지 않아 텔레그램 발송을 건너뜁니다.');
    } else {
      console.log('\n📤 Step 4: 텔레그램 발송 중...\n');
      await sendDailyBriefing(chatId, analysis, affiliateLinks);
    }

    // Step 5: 개인화 이메일 발송 (구독 플랜별 분기)
    console.log('\n📧 Step 5: 개인화 이메일 발송 중...\n');

    // Check if personalized sending is enabled
    const usePersonalizedEmails = process.env.USE_PERSONALIZED_EMAILS === 'true';

    if (usePersonalizedEmails) {
      // New personalized email flow
      await sendPersonalizedBriefings(analysis);
    } else {
      // Legacy email flow (fallback)
      const emailResult = await sendEmailBriefing(analysis, affiliateLinks);
      console.log(`  이메일 발송 완료: ${emailResult.emailsSent}건`);
    }

    // Step 5.5: Stock News Alerts (Basic/Pro users with watchlists)
    console.log('\n🔔 Step 5.5: 관심 종목 뉴스 알림 발송 중...\n');
    const alertResult = await sendStockNewsAlerts(newsItems);
    console.log(`  뉴스 알림 발송 완료: ${alertResult.emailsSent}건 이메일`);

    // Step 6: JSON 파일로 저장
    const today = new Date().toISOString().split('T')[0];
    const outputPath = path.join(__dirname, '..', 'data', `${today}.json`);

    const output = {
      date: today,
      timestamp: new Date().toISOString(),
      newsCount: newsItems.length,
      analysis: analysis,
      affiliateLinks: affiliateLinks,
      sentToTelegram: !!chatId,
      usePersonalizedEmails,
      alertsSent: alertResult.emailsSent,
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n💾 결과 저장: ${outputPath}`);
    
    console.log('\n✅ 일일 브리핑 완료!');
    
  } catch (error) {
    console.error('\n❌ 일일 브리핑 실패:', error);
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
