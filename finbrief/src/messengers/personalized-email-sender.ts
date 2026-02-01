import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { getStockQuote, getHistoricalData } from '../collectors/stock-collector';
import { calculateTechnicalIndicators } from '../analyzers/technical-analyzer';
import { generateBriefAnalysis } from '../analyzers/stock-ai-analyzer';
import type { AnalysisResult } from '../types/news.types';

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;

interface Subscriber {
  id: string;
  email: string;
  plan_id: string | null;
  unsubscribe_token: string;
}

interface Plan {
  id: string;
  name: 'free' | 'basic' | 'pro';
  features: {
    technical_analysis?: boolean;
  };
}

interface WatchlistItem {
  symbol: string;
  name: string;
}

interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  aiSummary?: string;
  rsi?: number;
  macdSignal?: string;
  trendSignal?: string; // Simple trend signal for Basic plan
}

// Utility functions
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

function generatePersonalizedEmailHtml(options: {
  date: string;
  planName: string;
  topNews: Array<{ title: string; summary: string; sentiment: 'bull' | 'bear' | 'neutral' }>;
  keywords: string[];
  marketSentiment: string;
  unsubscribeToken: string;
  dashboardUrl: string;
  watchlist?: WatchlistStock[];
}): string {
  const { date, planName, topNews, keywords, marketSentiment, unsubscribeToken, dashboardUrl, watchlist } = options;

  const isPro = planName === 'pro';
  const isBasic = planName === 'basic';
  const isPaid = planName !== 'free';

  // 주요 뉴스 HTML 생성
  const newsItemsHtml = topNews.map((news, idx) => {
    const emoji = getSentimentEmoji(news.sentiment);
    return `
      <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
        <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">
          ${idx + 1}. ${escapeHtml(news.title)} ${emoji}
        </h2>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
          ${escapeHtml(news.summary)}
        </p>
      </div>
    `;
  }).join('');

  // 키워드 HTML 생성
  const keywordsHtml = keywords
    .map(keyword => `<span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 16px; font-size: 14px; margin: 4px;">${escapeHtml(keyword)}</span>`)
    .join('');

  // 워치리스트 HTML 생성 (유료 플랜만)
  let watchlistHtml = '';
  if (isPaid && watchlist && watchlist.length > 0) {
    const stocksHtml = watchlist.map(stock => {
      const changeColor = stock.changePercent >= 0 ? '#10b981' : '#ef4444';
      const changeSign = stock.changePercent >= 0 ? '+' : '';

      let technicalHtml = '';
      if (isPro && (stock.rsi || stock.macdSignal)) {
        // Pro plan: Show RSI and MACD
        technicalHtml = `
          <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
            ${stock.rsi ? `RSI: ${stock.rsi.toFixed(1)}` : ''}
            ${stock.rsi && stock.macdSignal ? ' | ' : ''}
            ${stock.macdSignal || ''}
          </div>
        `;
      } else if (isBasic && stock.trendSignal) {
        // Basic plan: Show simple trend signal
        technicalHtml = `
          <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
            📊 ${stock.trendSignal}
          </div>
        `;
      }

      let aiSummaryHtml = '';
      if (isPro && stock.aiSummary) {
        aiSummaryHtml = `
          <div style="margin-top: 8px; padding: 8px; background-color: #f9fafb; border-radius: 4px; font-size: 13px; color: #4b5563;">
            🤖 ${escapeHtml(stock.aiSummary)}
          </div>
        `;
      }

      return `
        <div style="padding: 16px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600; color: #111827;">${escapeHtml(stock.name)}</div>
              <div style="font-size: 12px; color: #6b7280;">${escapeHtml(stock.symbol)}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 600; color: #111827;">₩${stock.price.toLocaleString()}</div>
              <div style="font-size: 14px; color: ${changeColor};">${changeSign}${stock.changePercent.toFixed(2)}%</div>
            </div>
          </div>
          ${technicalHtml}
          ${aiSummaryHtml}
        </div>
      `;
    }).join('');

    watchlistHtml = `
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">
          📌 내 관심 종목
        </h3>
        ${stocksHtml}
      </div>
    `;
  }

  // 플랜 배지
  const planBadgeColor = planName === 'pro' ? '#7c3aed' : planName === 'basic' ? '#2563eb' : '#6b7280';
  const planBadgeText = planName === 'pro' ? 'PRO' : planName === 'basic' ? 'BASIC' : 'FREE';

  const unsubscribeUrl = `${dashboardUrl.replace('/dashboard', '')}/api/unsubscribe?token=${unsubscribeToken}`;

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinBrief - ${date} 브리핑</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center;">
      <div style="display: inline-block; background-color: ${planBadgeColor}; color: white; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; margin-bottom: 12px;">
        ${planBadgeText}
      </div>
      <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0;">
        📊 FinBrief
      </h1>
      <p style="font-size: 16px; color: #e0e7ff; margin: 0;">
        ${isPaid ? '맞춤 재테크 브리핑' : '오늘의 재테크 브리핑'}
      </p>
      <p style="font-size: 14px; color: #c7d2fe; margin: 8px 0 0 0;">
        ${date}
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <!-- 워치리스트 (유료만) -->
      ${watchlistHtml}

      <!-- 주요 뉴스 -->
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">
          📰 주요 뉴스
        </h3>
        ${newsItemsHtml}
      </div>

      <!-- 오늘의 키워드 -->
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 16px 0;">
          🔑 오늘의 키워드
        </h3>
        <div>
          ${keywordsHtml}
        </div>
      </div>

      <!-- 시장 분위기 -->
      <div style="margin-bottom: 32px; padding: 24px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #065f46; margin: 0 0 12px 0;">
          📈 시장 분위기
        </h3>
        <p style="font-size: 16px; line-height: 1.6; color: #047857; margin: 0;">
          ${escapeHtml(marketSentiment)}
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          대시보드에서 더 보기
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 24px; background-color: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">
        <strong>FinBrief</strong> | AI가 엄선한 재테크 뉴스
      </p>
      <div style="margin-top: 16px;">
        <a href="${unsubscribeUrl}" style="font-size: 12px; color: #6b7280; text-decoration: underline;">
          구독 해지
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendPersonalizedBriefings(analysis: AnalysisResult): Promise<void> {
  // 환경 변수 검증
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ Supabase 설정이 누락되어 개인화 이메일을 건너뜁니다.');
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY가 설정되지 않아 개인화 이메일을 건너뜁니다.');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'FinBrief <noreply@finbrief.io>';
  const dashboardUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finbrief.vercel.app';

  // Get all active subscribers with their plans
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, email, plan_id, unsubscribe_token')
    .eq('is_active', true);

  if (error || !subscribers) {
    console.error('Failed to fetch subscribers:', error);
    return;
  }

  // Get plans
  const { data: plans } = await supabase.from('plans').select('id, name, features');
  const planMap = new Map<string, Plan>(plans?.map((p: Plan) => [p.id, p]) || []);

  // Format date
  const today = new Date();
  const dateStr = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // Group subscribers by plan type
  const freeSubscribers: Subscriber[] = [];
  const paidSubscribers: Subscriber[] = [];

  for (const sub of subscribers) {
    const plan = planMap.get(sub.plan_id || '');
    if (!plan || plan.name === 'free') {
      freeSubscribers.push(sub);
    } else {
      paidSubscribers.push(sub);
    }
  }

  console.log(`📧 Sending briefings to ${subscribers.length} subscribers...`);
  console.log(`  - Free: ${freeSubscribers.length}`);
  console.log(`  - Paid: ${paidSubscribers.length}`);

  // Send to free subscribers (standard briefing)
  const freeBatches = chunk(freeSubscribers, BATCH_SIZE);
  for (const batch of freeBatches) {
    await Promise.allSettled(
      batch.map(sub =>
        resend.emails.send({
          from: fromEmail,
          to: sub.email,
          subject: `📊 FinBrief - ${dateStr} 재테크 브리핑`,
          html: generatePersonalizedEmailHtml({
            date: dateStr,
            planName: 'free',
            topNews: analysis.topNews.map(n => ({
              title: n.title,
              summary: n.summary,
              sentiment: n.sentiment as 'bull' | 'bear' | 'neutral',
            })),
            keywords: analysis.keywords,
            marketSentiment: analysis.marketSentiment,
            unsubscribeToken: sub.unsubscribe_token,
            dashboardUrl: `${dashboardUrl}/dashboard`,
          }),
        })
      )
    );
    await delay(BATCH_DELAY_MS);
  }

  // Send to paid subscribers (personalized briefing with watchlist)
  for (const batch of chunk(paidSubscribers, BATCH_SIZE)) {
    await Promise.allSettled(
      batch.map(async sub => {
        const plan = planMap.get(sub.plan_id || '');
        const isPro = plan?.name === 'pro';

        // Get user's watchlist
        const { data: watchlists } = await supabase
          .from('watchlists')
          .select('symbol, name')
          .eq('user_id', sub.id)
          .eq('is_active', true);

        // Fetch stock data for watchlist
        const watchlistData = await Promise.all(
          (watchlists || []).map(async (w: WatchlistItem) => {
            const quote = await getStockQuote(w.symbol);
            if (!quote) return null;

            let rsi: number | undefined;
            let macdSignal: string | undefined;
            let aiSummary: string | undefined;
            let trendSignal: string | undefined;

            const isBasic = plan?.name === 'basic';

            if (isPro) {
              // Pro plan: Full technical analysis
              const ninetyDaysAgo = new Date();
              ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
              const historical = await getHistoricalData(w.symbol, ninetyDaysAgo);
              const indicators = calculateTechnicalIndicators(historical);

              rsi = indicators.rsi || undefined;
              if (indicators.macd) {
                macdSignal = indicators.macd.MACD > indicators.macd.signal ? 'MACD 매수신호' : 'MACD 매도신호';
              }

              aiSummary = await generateBriefAnalysis(quote, indicators);
            } else if (isBasic) {
              // Basic plan: Simple SMA-based trend signal
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              const historical = await getHistoricalData(w.symbol, thirtyDaysAgo);
              const indicators = calculateTechnicalIndicators(historical);

              // Simple trend based on SMA crossover
              if (indicators.sma.sma5 && indicators.sma.sma20) {
                if (indicators.sma.sma5 > indicators.sma.sma20) {
                  trendSignal = '상승 추세 (5일선 > 20일선)';
                } else if (indicators.sma.sma5 < indicators.sma.sma20) {
                  trendSignal = '하락 추세 (5일선 < 20일선)';
                } else {
                  trendSignal = '중립';
                }
              } else {
                // Fallback to simple price change
                trendSignal = quote.regularMarketChangePercent >= 0 ? '상승 추세' : '하락 추세';
              }
            }

            return {
              symbol: w.symbol,
              name: w.name,
              price: quote.regularMarketPrice,
              changePercent: quote.regularMarketChangePercent,
              aiSummary,
              rsi,
              macdSignal,
              trendSignal,
            };
          })
        );

        const validWatchlist = watchlistData.filter((item): item is NonNullable<typeof item> => item !== null);

        return resend.emails.send({
          from: fromEmail,
          to: sub.email,
          subject: `📊 FinBrief - ${dateStr} 맞춤 브리핑`,
          html: generatePersonalizedEmailHtml({
            date: dateStr,
            planName: plan?.name || 'basic',
            watchlist: validWatchlist as WatchlistStock[],
            topNews: analysis.topNews.map(n => ({
              title: n.title,
              summary: n.summary,
              sentiment: n.sentiment as 'bull' | 'bear' | 'neutral',
            })),
            keywords: analysis.keywords,
            marketSentiment: analysis.marketSentiment,
            unsubscribeToken: sub.unsubscribe_token,
            dashboardUrl: `${dashboardUrl}/dashboard`,
          }),
        });
      })
    );
    await delay(BATCH_DELAY_MS);
  }

  console.log('✅ All briefings sent successfully');
}
