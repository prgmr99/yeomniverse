import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { filterNewsByWatchlist, MatchedNews, WatchlistItem } from '../collectors/news-filter';
import type { NewsItem } from '../types/news.types';

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;

interface UserWithPlan {
  id: string;
  email: string;
  plan_name: 'free' | 'basic' | 'pro';
  telegram_chat_id?: string;
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

function generateAlertEmailHtml(matches: MatchedNews[], unsubscribeUrl: string): string {
  const newsListHtml = matches.map(match => `
    <div style="margin-bottom: 16px; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981;">
      <div style="font-size: 12px; color: #10b981; margin-bottom: 8px;">
        📌 ${escapeHtml(match.matchedStock.name)} (${escapeHtml(match.matchedStock.symbol)})
      </div>
      <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">
        ${escapeHtml(match.news.title)}
      </h3>
      <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.5;">
        ${escapeHtml(match.news.contentSnippet || '')}
      </p>
      ${match.news.link ? `<a href="${match.news.link}" style="display: inline-block; margin-top: 8px; font-size: 14px; color: #2563eb;">자세히 보기 →</a>` : ''}
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinBrief - 관심종목 뉴스 알림</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; text-align: center;">
      <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0;">
        🔔 관심종목 뉴스 알림
      </h1>
      <p style="font-size: 14px; color: #d1fae5; margin: 8px 0 0 0;">
        내 관심종목과 관련된 새로운 뉴스가 있습니다
      </p>
    </div>
    <div style="padding: 24px;">
      ${newsListHtml}
    </div>
    <div style="padding: 16px 24px; background-color: #f3f4f6; text-align: center;">
      <p style="font-size: 12px; color: #6b7280; margin: 0;">
        <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">알림 설정 변경</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

async function sendTelegramAlert(chatId: string, matches: MatchedNews[]): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN not set, skipping telegram alert');
    return;
  }

  const message = matches.map(match =>
    `🔔 *${match.matchedStock.name}* 관련 뉴스\n\n` +
    `📰 ${match.news.title}\n\n` +
    `${match.news.contentSnippet || ''}\n\n` +
    (match.news.link ? `[자세히 보기](${match.news.link})` : '')
  ).join('\n\n---\n\n');

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  });
}

export async function sendStockNewsAlerts(
  news: NewsItem[],
  stockMapping: Record<string, { name: string; englishName?: string; market: string }> = {}
): Promise<{ emailsSent: number; telegramsSent: number }> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ Supabase not configured, skipping stock news alerts');
    return { emailsSent: 0, telegramsSent: 0 };
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not set, skipping email alerts');
    return { emailsSent: 0, telegramsSent: 0 };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'FinBrief <noreply@finbrief.io>';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finbrief.vercel.app';

  let emailsSent = 0;
  let telegramsSent = 0;

  // Get all paid subscribers with their watchlists
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select(`
      id,
      email,
      unsubscribe_token,
      plans!inner(name)
    `)
    .eq('is_active', true)
    .in('plans.name', ['basic', 'pro']);

  if (!subscribers || subscribers.length === 0) {
    console.log('No paid subscribers found');
    return { emailsSent: 0, telegramsSent: 0 };
  }

  for (const subscriber of subscribers) {
    const planName = (subscriber as any).plans?.name || 'free';
    if (planName === 'free') continue;

    // Get user's watchlist
    const { data: watchlists } = await supabase
      .from('watchlists')
      .select('id, symbol, name')
      .eq('user_id', subscriber.id)
      .eq('is_active', true);

    if (!watchlists || watchlists.length === 0) continue;

    const watchlistItems: WatchlistItem[] = watchlists.map(w => ({
      ...w,
      user_id: subscriber.id,
    }));

    // Filter news by user's watchlist
    const matches = filterNewsByWatchlist(news, watchlistItems, stockMapping);
    if (matches.length === 0) continue;

    // Check for already sent alerts
    const newsUrls = matches.map(m => m.news.link).filter(Boolean);
    const { data: existingAlerts } = await supabase
      .from('stock_news_alerts')
      .select('news_url')
      .eq('user_id', subscriber.id)
      .in('news_url', newsUrls);

    const sentUrls = new Set(existingAlerts?.map(a => a.news_url) || []);
    const newMatches = matches.filter(m => m.news.link && !sentUrls.has(m.news.link));

    if (newMatches.length === 0) continue;

    // Send email alert (Basic and Pro)
    const unsubscribeUrl = `${baseUrl}/dashboard/settings`;
    const emailHtml = generateAlertEmailHtml(newMatches, unsubscribeUrl);

    try {
      await resend.emails.send({
        from: fromEmail,
        to: subscriber.email,
        subject: `🔔 FinBrief - ${newMatches.length}개의 관심종목 뉴스`,
        html: emailHtml,
      });
      emailsSent++;

      // Log sent alerts
      for (const match of newMatches) {
        if (match.news.link) {
          await supabase.from('stock_news_alerts').insert({
            user_id: subscriber.id,
            watchlist_id: match.matchedStock.id,
            news_title: match.news.title,
            news_url: match.news.link,
            channel: 'email',
          }).onConflict('user_id,news_url').ignore();
        }
      }
    } catch (error) {
      console.error(`Failed to send email alert to ${subscriber.email}:`, error);
    }

    // Send telegram alert (Pro only)
    if (planName === 'pro') {
      // Note: telegram_chat_id would need to be stored in subscribers table
      // For now, skip telegram alerts as the column doesn't exist
      // This can be added when telegram integration is fully set up
    }

    await delay(BATCH_DELAY_MS);
  }

  console.log(`📧 Sent ${emailsSent} email alerts, ${telegramsSent} telegram alerts`);
  return { emailsSent, telegramsSent };
}
