import { Resend } from 'resend';
import { createServerClient } from '../../../packages/services/src/supabase/client.js';
import { PersonalizedBriefing } from '../../../packages/services/src/email/templates/PersonalizedBriefing.js';
import { getStockQuote, getHistoricalData } from '../collectors/stock-collector.js';
import { calculateTechnicalIndicators } from '../analyzers/technical-analyzer.js';
import { generateBriefAnalysis } from '../analyzers/stock-ai-analyzer.js';
import type { AnalysisResult } from '../types/news.types.js';

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;

interface Subscriber {
  id: string;
  email: string;
  plan_id: string | null;
  unsubscribe_token: string;
}

interface Plan {
  name: 'free' | 'basic' | 'pro';
  features: {
    technical_analysis?: boolean;
  };
}

interface WatchlistItem {
  symbol: string;
  name: string;
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

export async function sendPersonalizedBriefings(analysis: AnalysisResult): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createServerClient();
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
  const planMap = new Map(plans?.map((p: { id: string; name: string; features: unknown }) => [p.id, p]) || []);

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
    const plan = planMap.get(sub.plan_id || '') as Plan | undefined;
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
          react: PersonalizedBriefing({
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
        const plan = planMap.get(sub.plan_id || '') as Plan;
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

            if (isPro) {
              const ninetyDaysAgo = new Date();
              ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
              const historical = await getHistoricalData(w.symbol, ninetyDaysAgo);
              const indicators = calculateTechnicalIndicators(historical);

              rsi = indicators.rsi || undefined;
              if (indicators.macd) {
                macdSignal = indicators.macd.MACD > indicators.macd.signal ? 'MACD 매수신호' : 'MACD 매도신호';
              }

              aiSummary = await generateBriefAnalysis(quote, indicators);
            }

            return {
              symbol: w.symbol,
              name: w.name,
              price: quote.regularMarketPrice,
              changePercent: quote.regularMarketChangePercent,
              aiSignal: undefined,
              aiSummary,
              rsi,
              macdSignal,
            };
          })
        );

        const validWatchlist = watchlistData.filter(Boolean) as NonNullable<typeof watchlistData[0]>[];

        return resend.emails.send({
          from: fromEmail,
          to: sub.email,
          subject: `📊 FinBrief - ${dateStr} 맞춤 브리핑`,
          react: PersonalizedBriefing({
            date: dateStr,
            planName: plan?.name || 'basic',
            watchlist: validWatchlist,
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
