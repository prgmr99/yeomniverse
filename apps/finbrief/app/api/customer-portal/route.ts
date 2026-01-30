import { getCustomerPortalUrl } from '@hyo/services/lemonsqueezy';
import { createServerClient } from '@hyo/services/supabase';
import { createServerAuthClient } from '@hyo/services/supabase/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authSupabase = await createServerAuthClient();
    const { data: { user }, error: authError } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const userId = user.id;
    const supabase = createServerClient();

    // Get subscription with Lemon Squeezy subscription ID
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('ls_subscription_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 },
      );
    }

    if (!subscription.ls_subscription_id) {
      return NextResponse.json(
        { error: 'Subscription not linked to payment provider' },
        { status: 400 },
      );
    }

    // Get customer portal URL from Lemon Squeezy
    const portalUrl = await getCustomerPortalUrl(subscription.ls_subscription_id);

    return NextResponse.json({ portalUrl });
  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json(
      { error: 'Failed to get customer portal URL' },
      { status: 500 },
    );
  }
}
