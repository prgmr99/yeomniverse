import TelegramBot from 'node-telegram-bot-api';
import { AnalysisResult } from '../types/news.types';

/**
 * 텔레그램 메시지 발송기
 * AI 분석 결과를 포맷팅하여 텔레그램으로 전송합니다.
 */

// 텔레그램 봇 초기화 (Polling 모드로 사용하지 않음)
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });

/**
 * AI 분석 결과를 텔레그램으로 전송
 * 
 * @param chatId 텔레그램 Chat ID
 * @param analysis AI 분석 결과
 * @param affiliateLinks 선택적 제휴 링크
 */
export async function sendDailyBriefing(
  chatId: string,
  analysis: AnalysisResult,
  affiliateLinks?: { text: string; url: string }[]
): Promise<void> {
  try {
    console.log('📤 Creating Telegram message...');
    
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set.');
    }
    
    // 메시지 포맷팅
    const message = formatBriefingMessage(analysis, affiliateLinks);
    
    // 텔레그램 전송
    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true // 링크 미리보기 끄기
    });
    
    console.log('✅ Telegram message sent successfully!');
    
  } catch (error) {
    console.error('❌ Telegram send failed:', error);
    throw error;
  }
}

/**
 * 브리핑 메시지 포맷팅 (Markdown 형식)
 */
function formatBriefingMessage(
  analysis: AnalysisResult,
  affiliateLinks?: { text: string; url: string }[]
): string {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const SEP = '──────────────────────';

  let message = `*FINBRIEF | MORNING BRIEF*\n`;
  message += `${today}\n`;
  message += `${SEP}\n\n`;

  analysis.topNews.forEach((news, idx) => {
    const tag = getSentimentTag(news.sentiment);

    message += `*${idx + 1}. ${news.title}*\n`;
    message += `${tag}\n\n`;
    message += `${news.summary}\n\n`;
    message += `_Significance:_ ${news.reason}\n\n`;

    if (idx < analysis.topNews.length - 1) {
      message += `${SEP}\n\n`;
    }
  });

  message += `${SEP}\n\n`;

  message += `*Key Themes:* ${analysis.keywords.join(' | ')}\n\n`;

  message += `*Market Outlook:* ${analysis.marketSentiment}\n\n`;

  if (affiliateLinks && affiliateLinks.length > 0) {
    message += `${SEP}\n\n`;
    message += `*Further Reading*\n`;
    affiliateLinks.forEach(link => {
      message += `• [${link.text}](${link.url})\n`;
    });
    message += `\n`;
  }

  message += `${SEP}\n`;
  message += `_FinBrief -- Institutional-grade intelligence, delivered daily._\n`;
  message += `_30-second read_`;

  return message;
}

/**
 * 감정에 따른 이모지 반환
 */
function getSentimentTag(sentiment: 'bull' | 'bear' | 'neutral'): string {
  switch (sentiment) {
    case 'bull':
      return '[BULLISH]';
    case 'bear':
      return '[BEARISH]';
    case 'neutral':
      return '[NEUTRAL]';
    default:
      return '';
  }
}

/**
 * 맥락 기반 제휴 링크 생성
 */
export function getContextualAffiliateLinks(keywords: string[]): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];
  
  // 키워드 기반 추천
  if (keywords.some(k => k.includes('금리') || k.includes('예금') || k.includes('rate') || k.includes('savings'))) {
    links.push({
      text: 'Compare leading savings rates',
      url: 'https://example.com/parking-account'
    });
  }

  if (keywords.some(k => k.includes('주식') || k.includes('투자') || k.includes('AI') || k.includes('stock') || k.includes('invest'))) {
    links.push({
      text: 'Recommended: The Psychology of Money',
      url: 'https://example.com/books'
    });
  }

  if (keywords.some(k => k.includes('부동산') || k.includes('real estate') || k.includes('property'))) {
    links.push({
      text: 'Real estate investment guide',
      url: 'https://example.com/realestate'
    });
  }

  // 기본 링크 (키워드 매칭 없을 시)
  if (links.length === 0) {
    links.push({
      text: 'Essential finance checklist',
      url: 'https://example.com/checklist'
    });
  }
  
  return links;
}

/**
 * 간단한 텍스트 메시지 전송 (테스트용)
 */
export async function sendSimpleMessage(chatId: string, text: string): Promise<void> {
  try {
    await bot.sendMessage(chatId, text);
    console.log('✅ Message sent successfully');
  } catch (error) {
    console.error('❌ Message send failed:', error);
    throw error;
  }
}

// 테스트 실행 (이 파일을 직접 실행할 때)
if (require.main === module) {
  require('dotenv').config();
  
  const testChatId = process.env.TELEGRAM_CHAT_ID || '';
  
  if (!testChatId) {
    console.error('❌ TELEGRAM_CHAT_ID is not set.');
    process.exit(1);
  }
  
  // 간단한 테스트 메시지
  sendSimpleMessage(testChatId, 'FinBrief connection verified. You will receive daily morning briefs.')
    .then(() => {
      console.log('Test complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}
