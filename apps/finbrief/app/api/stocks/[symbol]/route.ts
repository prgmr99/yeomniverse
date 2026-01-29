import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote } from '@/lib/finbrief/stock-collector';

export const revalidate = 300; // Revalidate every 5 minutes

interface ErrorResponse {
  error: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
): Promise<NextResponse> {
  try {
    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json(
        { error: '종목 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    const quote = await getStockQuote(symbol);

    if (!quote) {
      return NextResponse.json(
        { error: '종목 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(quote, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Stock quote error:', error);
    return NextResponse.json(
      { error: '종목 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
