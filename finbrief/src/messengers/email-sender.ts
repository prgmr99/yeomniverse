import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { AnalysisResult } from '../types/news.types';
import { getContextualAffiliateLinks, getRandomInspirationalQuote } from '../shared/briefing-content';
export { getContextualAffiliateLinks } from '../shared/briefing-content';

/**
 * 이메일 메시지 발송기
 * AI 분석 결과를 포맷팅하여 이메일로 전송합니다.
 */

interface Subscriber {
  email: string;
  unsubscribe_token: string;
}

/**
 * AI 분석 결과를 이메일로 전송
 *
 * @param analysis AI 분석 결과
 * @param affiliateLinks 선택적 제휴 링크
 */
export async function sendEmailBriefing(
  analysis: AnalysisResult,
  affiliateLinks?: { text: string; url: string }[]
): Promise<{ success: boolean; emailsSent: number; error?: string }> {
  try {
    console.log('📧 이메일 발송 준비 중...');

    // 환경 변수 검증
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase 설정이 누락되었습니다. SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인하세요.');
    }

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY가 설정되지 않았습니다.');
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error('RESEND_FROM_EMAIL이 설정되지 않았습니다.');
    }

    // Supabase 클라이언트 초기화
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 활성 구독자 조회
    const { data: subscribers, error: dbError } = await supabase
      .from('subscribers')
      .select('email, unsubscribe_token')
      .eq('is_active', true);

    if (dbError) {
      throw new Error(`구독자 조회 실패: ${dbError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('⚠️  활성화된 구독자가 없습니다.');
      return { success: true, emailsSent: 0 };
    }

    console.log(`📬 ${subscribers.length}명의 구독자에게 이메일 발송 중...`);

    // Resend 클라이언트 초기화
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 이메일 제목 생성
    const subject = generateEmailSubject();

    // 배치 이메일 발송
    const emailPromises = subscribers.map((subscriber: Subscriber) => {
      const htmlContent = formatBriefingEmail(analysis, affiliateLinks, subscriber.unsubscribe_token);

      return resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: subscriber.email,
        subject: subject,
        html: htmlContent,
      });
    });

    const results = await Promise.allSettled(emailPromises);

    // 결과 집계
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ 이메일 발송 완료: ${successCount}개 성공, ${failureCount}개 실패`);

    if (failureCount > 0) {
      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => r.reason)
        .join(', ');
      console.error('❌ 실패한 이메일:', errors);
    }

    return {
      success: successCount > 0,
      emailsSent: successCount,
      error: failureCount > 0 ? `${failureCount}개 이메일 발송 실패` : undefined
    };

  } catch (error) {
    console.error('❌ 이메일 발송 실패:', error);
    return {
      success: false,
      emailsSent: 0,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

/**
 * 이메일 제목 생성
 */
function generateEmailSubject(): string {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return `FinBrief | Morning Brief -- ${today}`;
}

/**
 * 브리핑 이메일 포맷팅 (HTML 형식)
 */
function formatBriefingEmail(
  analysis: AnalysisResult,
  affiliateLinks: { text: string; url: string }[] | undefined,
  unsubscribeToken: string
): string {
  const quote = getRandomInspirationalQuote();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // 주요 뉴스 HTML 생성
  const newsItemsHtml = analysis.topNews.map((news, idx) => {
    const sentimentLabel = getSentimentLabel(news.sentiment);
    const sentimentStyle = getSentimentStyle(news.sentiment);

    return `
      <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
        <h2 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 4px 0;">
          ${idx + 1}. ${escapeHtml(news.title)}
        </h2>
        <span style="display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 3px; margin-bottom: 12px; ${sentimentStyle}">
          ${sentimentLabel}
        </span>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
          ${escapeHtml(news.summary)}
        </p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 4px; border-left: 3px solid #64748b;">
          <p style="font-size: 13px; font-weight: 700; color: #475569; margin: 0 0 6px 0; letter-spacing: 0.3px;">
            Significance
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0;">
            ${escapeHtml(news.reason)}
          </p>
        </div>
      </div>
    `;
  }).join('');

  // 키워드 HTML 생성
  const keywordsHtml = analysis.keywords
    .map(keyword => `<span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 16px; font-size: 14px; margin: 4px;">${escapeHtml(keyword)}</span>`)
    .join('');

  // 제휴 링크 HTML 생성
  let affiliateLinksHtml = '';
  if (affiliateLinks && affiliateLinks.length > 0) {
    const linksHtml = affiliateLinks
      .map(link => `
        <li style="margin-bottom: 8px;">
          <a href="${escapeHtml(link.url)}" style="color: #2563eb; text-decoration: none;">
            ${escapeHtml(link.text)}
          </a>
        </li>
      `)
      .join('');

    affiliateLinksHtml = `
      <div style="margin-top: 32px; padding: 24px; background-color: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0;">
        <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0;">
          Further Reading
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #334155;">
          ${linksHtml}
        </ul>
      </div>
    `;
  }

  // 구독 취소 URL 생성
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://finbrief.vercel.app'}/api/unsubscribe?token=${unsubscribeToken}`;

  // 전체 HTML 구조
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinBrief | Morning Brief</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background-color: #0f172a; padding: 32px 24px; text-align: center;">
      <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0; letter-spacing: 1px; font-family: Georgia, 'Times New Roman', serif;">
        FINBRIEF
      </h1>
      <p style="font-size: 14px; color: #94a3b8; margin: 0; letter-spacing: 0.5px;">
        Morning Brief
      </p>
      <p style="font-size: 13px; color: #64748b; margin: 8px 0 0 0;">
        ${today}
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <!-- 주요 뉴스 -->
      ${newsItemsHtml}

      <!-- 오늘의 키워드 -->
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0; letter-spacing: 0.3px;">
          Key Themes
        </h3>
        <div>
          ${keywordsHtml}
        </div>
      </div>

      <!-- 시장 분위기 -->
      <div style="margin-bottom: 32px; padding: 24px; background-color: #f8fafc; border-left: 4px solid #1e293b; border-radius: 4px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0; letter-spacing: 0.3px;">
          MARKET OUTLOOK
        </h3>
        <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0; font-style: italic;">
          ${escapeHtml(analysis.marketSentiment)}
        </p>
      </div>

      <!-- 제휴 링크 -->
      ${affiliateLinksHtml}

      <!-- Quote of the Day -->
      <div style="margin-top: 32px; padding: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="font-size: 14px; color: #64748b; font-style: italic; line-height: 1.7; margin: 0;">
          ${escapeHtml(quote)}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 24px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 13px; color: #64748b; margin: 0 0 4px 0;">
        <strong>FinBrief</strong> -- Institutional-grade intelligence, delivered daily.
      </p>
      <p style="font-size: 11px; color: #94a3b8; margin: 0;">
        30-second read
      </p>
      <div style="margin-top: 16px;">
        <a href="${unsubscribeUrl}" style="font-size: 11px; color: #94a3b8; text-decoration: underline;">
          Unsubscribe
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function getSentimentLabel(sentiment: 'bull' | 'bear' | 'neutral'): string {
  switch (sentiment) {
    case 'bull':
      return 'BULLISH';
    case 'bear':
      return 'BEARISH';
    case 'neutral':
      return 'NEUTRAL';
    default:
      return '';
  }
}

function getSentimentStyle(sentiment: 'bull' | 'bear' | 'neutral'): string {
  switch (sentiment) {
    case 'bull':
      return 'background-color: #dcfce7; color: #166534;';
    case 'bear':
      return 'background-color: #fef2f2; color: #991b1b;';
    case 'neutral':
      return 'background-color: #f3f4f6; color: #374151;';
    default:
      return 'background-color: #f3f4f6; color: #374151;';
  }
}

/**
 * HTML 이스케이프 처리
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// 테스트 실행 (이 파일을 직접 실행할 때)
if (require.main === module) {
  require('dotenv').config();

  // 테스트 데이터
  const testAnalysis: AnalysisResult = {
    topNews: [
      {
        title: '코스피, 외국인 매수세에 2,500선 회복',
        summary: '외국인 투자자들의 대규모 매수세가 유입되면서 코스피 지수가 2,500선을 회복했습니다.',
        sentiment: 'bull' as const,
        reason: '외국인 자금 유입은 시장 신뢰도 회복의 신호입니다.'
      },
      {
        title: '한은, 기준금리 동결 전망 우세',
        summary: '한국은행이 이번 달 금융통화위원회에서 기준금리를 동결할 것이라는 전망이 우세합니다.',
        sentiment: 'neutral' as const,
        reason: '금리 동결은 시장 안정성을 유지하는 데 도움이 됩니다.'
      },
      {
        title: 'AI 반도체주, 미국 실적 우려에 급락',
        summary: 'AI 관련 반도체 기업들이 미국 실적 우려로 인해 일제히 하락했습니다.',
        sentiment: 'bear' as const,
        reason: '글로벌 AI 시장의 성장세 둔화 가능성을 시사합니다.'
      }
    ],
    keywords: ['외국인 매수', '금리 동결', 'AI 반도체', '실적 우려'],
    marketSentiment: '외국인 매수세가 유입되며 단기 반등 신호를 보이지만, AI 반도체 섹터의 약세로 인한 변동성에 주의가 필요합니다.'
  };

  const testLinks = getContextualAffiliateLinks(testAnalysis.keywords);

  sendEmailBriefing(testAnalysis, testLinks)
    .then(result => {
      if (result.success) {
        console.log(`✅ 테스트 완료! ${result.emailsSent}개 이메일 발송됨`);
        process.exit(0);
      } else {
        console.error(`❌ 테스트 실패: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ 테스트 실패:', error);
      process.exit(1);
    });
}
