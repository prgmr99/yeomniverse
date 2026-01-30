import { createServerClient } from '@hyo/services/supabase';
import { createServerAuthClient } from '@hyo/services/supabase/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authSupabase = await createServerAuthClient();
    const { data: { user }, error: authError } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const supabase = createServerClient();

    const { data: subscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .select('news_alerts_enabled, email_notifications, telegram_notifications')
      .eq('auth_user_id', userId)
      .single();

    if (subscriberError || !subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      newsAlertsEnabled: subscriber.news_alerts_enabled ?? true,
      emailNotifications: subscriber.email_notifications ?? true,
      telegramNotifications: subscriber.telegram_notifications ?? false,
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authSupabase = await createServerAuthClient();
    const { data: { user }, error: authError } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const body = await request.json();
    const { newsAlertsEnabled, emailNotifications, telegramNotifications } = body;

    const supabase = createServerClient();

    // Get subscriber info
    const { data: subscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .select('id, plan_id')
      .eq('auth_user_id', userId)
      .single();

    if (subscriberError || !subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 },
      );
    }

    // Check if user has Pro plan for Telegram notifications
    if (telegramNotifications) {
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('name')
        .eq('id', subscriber.plan_id || '')
        .single();

      if (planError || plan?.name !== 'pro') {
        return NextResponse.json(
          { error: 'Telegram notifications require Pro plan' },
          { status: 403 },
        );
      }
    }

    // Update settings
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        news_alerts_enabled: newsAlertsEnabled,
        email_notifications: emailNotifications,
        telegram_notifications: telegramNotifications,
      })
      .eq('auth_user_id', userId);

    if (updateError) {
      console.error('Failed to update settings:', updateError);
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      newsAlertsEnabled,
      emailNotifications,
      telegramNotifications,
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
