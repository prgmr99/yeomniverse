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
    console.log('📤 텔레그램 메시지 생성 중...');
    
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN이 설정되지 않았습니다.');
    }
    
    // 메시지 포맷팅
    const message = formatBriefingMessage(analysis, affiliateLinks);
    
    // 텔레그램 전송
    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true // 링크 미리보기 끄기
    });
    
    console.log('✅ 텔레그램 메시지 발송 완료!');
    
  } catch (error) {
    console.error('❌ 텔레그램 발송 실패:', error);
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
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  let message = `📊 *FinBrief - 오늘의 재테크 브리핑*\n`;
  message += `${today}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // 주요 뉴스 3개
  analysis.topNews.forEach((news, idx) => {
    const emoji = getSentimentEmoji(news.sentiment);
    
    message += `*${idx + 1}. ${news.title}* ${emoji}\n\n`;
    message += `${news.summary}\n\n`;
    message += `💡 *왜 중요한가?*\n${news.reason}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  });
  
  // 오늘의 키워드
  message += `🔑 *오늘의 키워드*\n`;
  message += `${analysis.keywords.join(' ')}\n\n`;
  
  // 시장 분위기
  message += `📈 *시장 분위기*\n`;
  message += `${analysis.marketSentiment}\n\n`;
  
  // 제휴 링크 (옵션)
  if (affiliateLinks && affiliateLinks.length > 0) {
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `💰 *추천 정보*\n`;
    affiliateLinks.forEach(link => {
      message += `• [${link.text}](${link.url})\n`;
    });
    message += `\n`;
  }
  
  // 푸터
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `_FinBrief | AI가 엄선한 재테크 뉴스_\n`;
  message += `_읽기 시간: 약 30초_`;
  
  return message;
}

/**
 * 감정에 따른 이모지 반환
 */
function getSentimentEmoji(sentiment: 'bull' | 'bear' | 'neutral'): string {
  switch (sentiment) {
    case 'bull':
      return '🐂';
    case 'bear':
      return '🐻';
    case 'neutral':
      return '😐';
    default:
      return '📰';
  }
}

/**
 * 맥락 기반 제휴 링크 생성
 */
export function getContextualAffiliateLinks(keywords: string[]): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];
  
  // 키워드 기반 추천
  if (keywords.some(k => k.includes('금리') || k.includes('예금'))) {
    links.push({
      text: '📊 지금 가장 높은 예금 금리 비교하기',
      url: 'https://example.com/parking-account'
    });
  }
  
  if (keywords.some(k => k.includes('주식') || k.includes('투자') || k.includes('AI'))) {
    links.push({
      text: '📚 투자 필독서: 돈의 속성',
      url: 'https://example.com/books'
    });
  }
  
  if (keywords.some(k => k.includes('부동산'))) {
    links.push({
      text: '🏠 부동산 투자 가이드',
      url: 'https://example.com/realestate'
    });
  }
  
  // 기본 링크 (키워드 매칭 없을 시)
  if (links.length === 0) {
    links.push({
      text: '💡 재테크 필수 체크리스트',
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
    console.log('✅ 메시지 발송 성공');
  } catch (error) {
    console.error('❌ 메시지 발송 실패:', error);
    throw error;
  }
}

// 테스트 실행 (이 파일을 직접 실행할 때)
if (require.main === module) {
  require('dotenv').config();
  
  const testChatId = process.env.TELEGRAM_CHAT_ID || '';
  
  if (!testChatId) {
    console.error('❌ TELEGRAM_CHAT_ID가 설정되지 않았습니다.');
    process.exit(1);
  }
  
  // 간단한 테스트 메시지
  sendSimpleMessage(testChatId, '🎉 FinBrief 텔레그램 봇 테스트 성공!\n\n이제 AI 뉴스 브리핑을 받을 수 있습니다.')
    .then(() => {
      console.log('테스트 완료!');
      process.exit(0);
    })
    .catch(error => {
      console.error('테스트 실패:', error);
      process.exit(1);
    });
}
