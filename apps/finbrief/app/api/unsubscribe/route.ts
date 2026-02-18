import { createServerClient } from '@hyo/services/supabase';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Unsubscribe API endpoint
 *
 * GET /api/unsubscribe?token=xxx
 *
 * When a user clicks the unsubscribe link in an email, this endpoint
 * sets the subscriber's is_active to false and returns a confirmation page.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  // No token provided
  if (!token) {
    return new NextResponse(
      generateHtmlPage({
        title: 'Invalid Request',
        message: 'The unsubscribe link is not valid.',
        status: 'error',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  }

  try {
    const supabase = createServerClient();

    // Look up subscriber by token
    const { data: subscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('id, email, is_active')
      .eq('unsubscribe_token', token)
      .single();

    // Subscriber not found
    if (fetchError || !subscriber) {
      console.error('Subscriber not found for token:', token);
      return new NextResponse(
        generateHtmlPage({
          title: 'Subscriber Not Found',
          message: 'This unsubscribe link is invalid or has expired.',
          status: 'error',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        },
      );
    }

    // Already unsubscribed
    if (!subscriber.is_active) {
      return new NextResponse(
        generateHtmlPage({
          title: 'Already Unsubscribed',
          message: `${subscriber.email} has already been unsubscribed.`,
          status: 'info',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        },
      );
    }

    // Process unsubscription
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Failed to unsubscribe:', updateError);
      return new NextResponse(
        generateHtmlPage({
          title: 'An Error Occurred',
          message:
            'An error occurred while processing your unsubscription. Please try again later.',
          status: 'error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        },
      );
    }

    // Success
    console.log(`✅ Unsubscribed: ${subscriber.email}`);
    return new NextResponse(
      generateHtmlPage({
        title: 'Successfully Unsubscribed',
        message: `${subscriber.email} has been successfully unsubscribed from FinBrief. You will no longer receive briefing emails.`,
        status: 'success',
        showResubscribeLink: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return new NextResponse(
      generateHtmlPage({
        title: 'Server Error',
        message: 'A server error occurred. Please try again later.',
        status: 'error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  }
}

/**
 * HTML page generator
 */
interface HtmlPageOptions {
  title: string;
  message: string;
  status: 'success' | 'error' | 'info';
  showResubscribeLink?: boolean;
}

function generateHtmlPage(options: HtmlPageOptions): string {
  const { title, message, status, showResubscribeLink = false } = options;

  const statusColors = {
    success: { bg: '#dcfce7', border: '#16a34a', text: '#166534' },
    error: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' },
    info: { bg: '#dbeafe', border: '#2563eb', text: '#1e40af' },
  };

  const colors = statusColors[status];

  const statusEmojis = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  const emoji = statusEmojis[status];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - FinBrief</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      width: 100%;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 32px;
      text-align: center;
      color: white;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .content {
      padding: 40px 32px;
    }
    .status-box {
      background-color: ${colors.bg};
      border-left: 4px solid ${colors.border};
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .status-box h2 {
      color: ${colors.text};
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .status-box p {
      color: ${colors.text};
      font-size: 16px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    .footer {
      padding: 24px 32px;
      text-align: center;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 FinBrief</h1>
      <p>AI-curated financial news</p>
    </div>

    <div class="content">
      <div class="status-box">
        <h2><span>${emoji}</span> ${title}</h2>
        <p>${message}</p>
      </div>

      ${
        showResubscribeLink
          ? `
      <div style="text-align: center; margin-top: 32px;">
        <p style="color: #6b7280; margin-bottom: 16px;">Want to resubscribe?</p>
        <a href="/" class="button">Resubscribe</a>
      </div>
      `
          : `
      <div style="text-align: center; margin-top: 32px;">
        <a href="/" class="button">Go to Home</a>
      </div>
      `
      }
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} FinBrief. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
