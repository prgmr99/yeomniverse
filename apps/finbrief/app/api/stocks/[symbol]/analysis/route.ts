import { createServerClient } from '@hyo/services/supabase';
import { createServerAuthClient } from '@hyo/services/supabase/auth';
import { type NextRequest, NextResponse } from 'next/server';
import {
  getHistoricalData,
  getStockQuote,
} from '@/lib/finbrief/stock-collector';
import {
  calculateTechnicalIndicators,
  interpretIndicators,
} from '@/lib/finbrief/technical-analyzer';

interface Plan {
  name: string;
  features: {
    technical_analysis?: boolean;
    stock_analysis?: boolean;
  };
}

interface BasicAnalysisResponse {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  sma: {
    sma5: number | null;
    sma20: number | null;
    sma60: number | null;
  };
  signals: string[];
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
}

interface ProAnalysisResponse extends BasicAnalysisResponse {
  rsi: number | null;
  macd: {
    MACD: number;
    signal: number;
    histogram: number;
  } | null;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  } | null;
  volumeRatio: number | null;
}

interface ErrorResponse {
  error: string;
  upgrade?: boolean;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
): Promise<
  NextResponse<BasicAnalysisResponse | ProAnalysisResponse | ErrorResponse>
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

    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required.' },
        { status: 400 },
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
      .select('plan_id, plans(name, features)')
      .eq('user_id', subscriber.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!subscription || !subscription.plans) {
      return NextResponse.json(
        {
          error: 'Stock analysis is available on Basic or Pro plans.',
          upgrade: true,
        },
        { status: 403 },
      );
    }

    const plan = subscription.plans as unknown as Plan;
    const isPro = plan.name === 'pro';
    const hasStockAnalysis = plan.features?.stock_analysis === true;

    if (!hasStockAnalysis) {
      return NextResponse.json(
        {
          error: 'Stock analysis is available on Basic or Pro plans.',
          upgrade: true,
        },
        { status: 403 },
      );
    }

    // Fetch stock quote
    const quote = await getStockQuote(symbol);

    if (!quote) {
      return NextResponse.json(
        { error: 'Stock information not found.' },
        { status: 404 },
      );
    }

    // Fetch historical data (60 days for full analysis)
    const period1 = new Date();
    period1.setDate(period1.getDate() - 90); // 90 days to ensure we have enough data

    const historicalData = await getHistoricalData(symbol, period1);

    if (historicalData.length < 20) {
      return NextResponse.json(
        { error: 'Not enough historical data.' },
        { status: 404 },
      );
    }

    // Calculate technical indicators
    const indicators = calculateTechnicalIndicators(historicalData);
    const interpretation = interpretIndicators(
      indicators,
      quote.regularMarketPrice,
    );

    // Basic response (for Basic plan)
    const basicResponse: BasicAnalysisResponse = {
      symbol: quote.symbol,
      currentPrice: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      sma: indicators.sma,
      signals: interpretation.signals,
      overallSentiment: interpretation.overallSentiment,
    };

    // Pro response (includes full technical indicators)
    if (isPro) {
      const proResponse: ProAnalysisResponse = {
        ...basicResponse,
        rsi: indicators.rsi,
        macd: indicators.macd,
        bollingerBands: indicators.bollingerBands,
        volumeRatio: indicators.volumeRatio,
      };
      return NextResponse.json(proResponse);
    }

    return NextResponse.json(basicResponse);
  } catch (error) {
    console.error('Stock analysis error:', error);
    return NextResponse.json(
      { error: 'An error occurred during analysis.' },
      { status: 500 },
    );
  }
}
