import crypto from 'node:crypto';
import { createServerClient } from '@hyo/services/supabase';
import { type NextRequest, NextResponse } from 'next/server';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat: {
      id: number;
      type: string;
      username?: string;
      first_name?: string;
    };
    from?: {
      id: number;
      username?: string;
      first_name?: string;
    };
    text?: string;
    entities?: Array<{
      type: string;
      offset: number;
      length: number;
    }>;
  };
}

function validateSecretToken(request: NextRequest): boolean {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Missing TELEGRAM_WEBHOOK_SECRET');
    return false;
  }

  const header = request.headers.get('x-telegram-bot-api-secret-token');
  if (!header) {
    return false;
  }

  try {
    const secretBuffer = Buffer.from(secret);
    const headerBuffer = Buffer.from(header);

    if (secretBuffer.length !== headerBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(secretBuffer, headerBuffer);
  } catch {
    return false;
  }
}

async function sendTelegramMessage(
  chatId: number,
  text: string,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('Missing TELEGRAM_BOT_TOKEN');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('Telegram sendMessage failed:', response.status, body);
  }
}

async function sendDiscordNotification(
  subscriberName: string,
  subscriberNumber: number,
): Promise<void> {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!discordWebhookUrl) {
    return;
  }

  const payload = {
    embeds: [
      {
        title: '🎉 새 텔레그램 구독자!',
        color: 5763719,
        fields: [
          { name: '구독자', value: subscriberName, inline: true },
          { name: '플랜', value: 'Free', inline: true },
          {
            name: '순번',
            value: `${subscriberNumber}번째 구독자`,
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('Discord webhook failed:', response.status, body);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!validateSecretToken(request)) {
    console.error('Invalid or missing Telegram webhook secret token');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const update: TelegramUpdate = await request.json();

    const message = update.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text?.trim() ?? '';
    const isStartCommand =
      text === '/start' ||
      text === `/start@finbrief_news_bot` ||
      (message.entities?.some(
        (e) => e.type === 'bot_command' && e.offset === 0,
      ) &&
        text.startsWith('/start'));

    if (!isStartCommand) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const username = message.from?.username ?? message.chat.username ?? null;
    const firstName =
      message.from?.first_name ?? message.chat.first_name ?? null;

    const supabase = createServerClient();

    const { error: upsertError } = await supabase
      .from('telegram_subscribers')
      .upsert(
        {
          chat_id: chatId,
          username,
          first_name: firstName,
          started_at: new Date().toISOString(),
        },
        { onConflict: 'chat_id' },
      );

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError);
    }

    const { count, error: countError } = await supabase
      .from('telegram_subscribers')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Supabase count error:', countError);
    }

    const subscriberNumber = count ?? 1;
    const subscriberName = username ? `@${username}` : (firstName ?? 'Unknown');

    await Promise.all([
      sendDiscordNotification(subscriberName, subscriberNumber),
      sendTelegramMessage(
        chatId,
        '🎉 Welcome to FinBrief!\n\nGet your AI-powered financial briefing every morning at 8 AM.\n\n✅ You are now subscribed.',
      ),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook processing error:', error);
    return NextResponse.json({ ok: true });
  }
}
