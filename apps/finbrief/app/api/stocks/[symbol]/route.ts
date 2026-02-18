import { type NextRequest, NextResponse } from 'next/server';
import { getStockQuote } from '@/lib/finbrief/stock-collector';

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> },
): Promise<NextResponse> {
  try {
    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required.' },
        { status: 400 },
      );
    }

    const quote = await getStockQuote(symbol);

    if (!quote) {
      return NextResponse.json(
        { error: 'Stock information not found.' },
        { status: 404 },
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
      { error: 'An error occurred while fetching stock information.' },
      { status: 500 },
    );
  }
}
