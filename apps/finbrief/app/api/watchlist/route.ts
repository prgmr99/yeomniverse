import { createServerClient } from '@hyo/services/supabase';
import { createServerAuthClient } from '@hyo/services/supabase/auth';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const addWatchlistSchema = z.object({
  symbol: z.string().min(1, 'Please enter a stock symbol.'),
  name: z.string().min(1, 'Please enter a stock name.'),
  market: z.enum(['KOSPI', 'KOSDAQ', 'NYSE', 'NASDAQ'], {
    message: 'Invalid market.',
  }),
});

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  market: string;
  is_active: boolean;
  alert_enabled: boolean;
  alert_price_above: number | null;
  alert_price_below: number | null;
  created_at: string;
  updated_at: string;
}

interface SuccessResponse {
  watchlists: WatchlistItem[];
  limit: number;
  count: number;
  planName: string;
}

interface ErrorResponse {
  error: string;
  upgrade?: boolean;
}

interface Plan {
  max_watchlist: number;
  name: string;
}

export async function GET(
  _request: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const authSupabase = await createServerAuthClient();
    const {
      data: { user },
      error: authError,
    } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 },
      );
    }

    const supabase = createServerClient();

    // Get user's subscriber record
    const { data: subscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (subscriberError || !subscriber) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    // Get user's plan
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_id, plans(max_watchlist, name)')
      .eq('user_id', subscriber.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let limit = 0;
    let planName = 'free';
    if (subscription?.plans) {
      const plan = subscription.plans as unknown as Plan;
      limit = plan.max_watchlist;
      planName = plan.name;
    }

    // Get user's watchlists
    const { data: watchlists, error: watchlistError } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', subscriber.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (watchlistError) {
      console.error('Watchlist fetch error:', watchlistError);
      return NextResponse.json(
        { error: 'Failed to load watchlist.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      watchlists: watchlists || [],
      limit,
      count: (watchlists || []).length,
      planName,
    });
  } catch (error) {
    console.error('Watchlist GET error:', error);
    return NextResponse.json(
      { error: 'A server error occurred.' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<{ success: true; watchlist: WatchlistItem } | ErrorResponse>
> {
  try {
    const authSupabase = await createServerAuthClient();
    const {
      data: { user },
      error: authError,
    } = await authSupabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validation = addWatchlistSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error:
            validation.error.issues[0]?.message ||
            'Invalid input.',
        },
        { status: 400 },
      );
    }

    const { symbol, name, market } = validation.data;

    const supabase = createServerClient();

    // Get user's subscriber record
    const { data: subscriber, error: subscriberError } = await supabase
      .from('subscribers')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (subscriberError || !subscriber) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 },
      );
    }

    // Get user's plan
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_id, plans(max_watchlist, name)')
      .eq('user_id', subscriber.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let limit = 0;
    if (subscription?.plans) {
      const plan = subscription.plans as unknown as Plan;
      limit = plan.max_watchlist;
    }

    // Check current watchlist count
    const { count, error: countError } = await supabase
      .from('watchlists')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', subscriber.id)
      .eq('is_active', true);

    if (countError) {
      console.error('Count error:', countError);
      return NextResponse.json(
        { error: 'An error occurred while checking watchlist.' },
        { status: 500 },
      );
    }

    if ((count || 0) >= limit) {
      return NextResponse.json(
        {
          error: `Watchlist is limited to ${limit} stocks. Please upgrade your plan.`,
          upgrade: true,
        },
        { status: 403 },
      );
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from('watchlists')
      .select('id')
      .eq('user_id', subscriber.id)
      .eq('symbol', symbol)
      .eq('is_active', true)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This stock is already in your watchlist.' },
        { status: 409 },
      );
    }

    // Add to watchlist
    const { data: newWatchlist, error: insertError } = await supabase
      .from('watchlists')
      .insert({
        user_id: subscriber.id,
        symbol,
        name,
        market,
      })
      .select()
      .single();

    if (insertError || !newWatchlist) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'An error occurred while adding to watchlist.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      watchlist: newWatchlist,
    });
  } catch (error) {
    console.error('Watchlist POST error:', error);
    return NextResponse.json(
      { error: 'A server error occurred.' },
      { status: 500 },
    );
  }
}
