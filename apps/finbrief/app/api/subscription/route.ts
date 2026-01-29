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
      .select('*')
      .eq('auth_user_id', userId)
      .single();

    if (subscriberError || !subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 },
      );
    }

    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', subscriber.plan_id || '')
      .single();

    if (planError && subscriber.plan_id) {
      console.error('Failed to fetch plan:', planError);
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Failed to fetch subscription:', subscriptionError);
    }

    return NextResponse.json({
      subscriber,
      plan: plan || null,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
