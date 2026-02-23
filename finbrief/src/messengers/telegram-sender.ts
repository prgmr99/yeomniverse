import TelegramBot from 'node-telegram-bot-api';
import { AnalysisResult, FearGreedIndex, OneWayIndex } from '../types/news.types';
import { getContextualAffiliateLinks, getRandomInspirationalQuote } from '../shared/briefing-content';
import { getFearGreedLabel, getFearGreedBar, getFearGreedZoneEmoji } from '../collectors/fear-greed-collector';
import { getOneWayLabel, getOneWayBar, getOneWayDirectionEmoji } from '../analyzers/oneway-analyzer';

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
  affiliateLinks?: { text: string; url: string }[],
  fearGreed?: FearGreedIndex | null,
  oneWay?: OneWayIndex | null
): Promise<void> {
  try {
    console.log('[Telegram] Creating message...');

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set.');
    }

    const message = formatBriefingMessage(analysis, affiliateLinks, fearGreed, oneWay);

    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });

    console.log('[Telegram] Message sent successfully.');
  } catch (error) {
    console.error('[Telegram] Send failed:', error);
    throw error;
  }
}

/**
 * Formats the daily briefing as a Telegram Markdown message.
 */
function formatBriefingMessage(
  analysis: AnalysisResult,
  affiliateLinks?: { text: string; url: string }[],
  fearGreed?: FearGreedIndex | null,
  oneWay?: OneWayIndex | null
): string {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  let message = `*FINBRIEF | MORNING BRIEF*\n`;
  message += `${today}\n\n`;

  // Fear & Greed Index section
  if (fearGreed) {
    const label = getFearGreedLabel(fearGreed.score);
    const bar = getFearGreedBar(fearGreed.score);
    const zoneEmoji = getFearGreedZoneEmoji(fearGreed.score);
    message += `*FEAR & GREED INDEX*\n`;
    message += `${zoneEmoji} ${fearGreed.score}/100  ${label}\n`;
    message += `${bar}\n\n`;
  }

  // One-Way Market Index section
  if (oneWay) {
    const dirEmoji = getOneWayDirectionEmoji(oneWay.direction, oneWay.score);
    const dirLabel = oneWay.direction === 'bull' ? 'Bull' : oneWay.direction === 'bear' ? 'Bear' : 'Neutral';
    const bar = getOneWayBar(oneWay.score);
    message += `*ONE-WAY INDEX*\n`;
    message += `${dirEmoji} ${oneWay.score}/100  ${oneWay.label} (${dirLabel})\n`;
    message += `${bar}\n`;
    message += `ADX ${oneWay.components.adx} | MA ${oneWay.components.maAlignment} | RSI ${oneWay.components.rsiTrend} | VIX ${oneWay.components.vix}\n\n`;
  }

  analysis.topNews.forEach((news, idx) => {
    const tag = getSentimentTag(news.sentiment);

    message += `*${idx + 1}. ${news.title}*\n`;
    message += `${tag}\n\n`;
    message += `${news.summary}\n\n`;
    message += `_Significance:_ ${news.reason}\n\n`;
  });

  message += `*Key Themes:* ${analysis.keywords.join(' | ')}\n\n`;
  message += `*Market Outlook:* ${analysis.marketSentiment}\n\n`;

  if (affiliateLinks && affiliateLinks.length > 0) {
    message += `*Further Reading*\n`;
    affiliateLinks.forEach(link => {
      message += `• [${link.text}](${link.url})\n`;
    });
    message += `\n`;
  }

  message += `_FinBrief -- Institutional-grade intelligence, delivered daily._\n`;
  message += `_30-second read_`;

  const quote = getRandomInspirationalQuote();
  message += `\n\n_${quote}_`;

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

export { getContextualAffiliateLinks } from '../shared/briefing-content';

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
