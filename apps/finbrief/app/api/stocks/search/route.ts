import { NextRequest, NextResponse } from 'next/server';
import { searchKoreanStocks } from '@/lib/finbrief/korean-stock-symbols';
import { searchStocks as searchYahoo } from '@/lib/finbrief/stock-collector';

interface StockSearchResult {
  symbol: string;
  name: string;
  market: string;
}

interface SuccessResponse {
  results: StockSearchResult[];
}

interface ErrorResponse {
  error: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Search Korean stocks
    const koreanResults = searchKoreanStocks(trimmedQuery);

    // Search US stocks via Yahoo Finance
    let usResults: StockSearchResult[] = [];
    try {
      const yahooResults = await searchYahoo(trimmedQuery);
      usResults = yahooResults.map(r => ({
        symbol: r.symbol,
        name: r.name,
        market: r.exchange.includes('NASDAQ') ? 'NASDAQ' : 'NYSE',
      }));
    } catch (error) {
      console.error('Yahoo search error:', error);
      // Continue with Korean results only
    }

    // Combine results (Korean first, then US)
    const combinedResults = [...koreanResults, ...usResults].slice(0, 20);

    return NextResponse.json({
      results: combinedResults,
    });
  } catch (error) {
    console.error('Stock search error:', error);
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
