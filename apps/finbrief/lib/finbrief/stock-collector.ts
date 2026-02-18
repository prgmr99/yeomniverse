import yahooFinance from 'yahoo-finance2';
import { normalizeKoreanSymbol } from './korean-stock-symbols';

export interface StockQuote {
  symbol: string;
  name: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  currency: string;
}

export interface HistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getStockQuote(
  symbol: string,
): Promise<StockQuote | null> {
  try {
    // Normalize Korean stock symbols
    const normalized = normalizeKoreanSymbol(symbol);
    const querySymbol = normalized.isValid
      ? (normalized.symbol ?? symbol)
      : symbol;

    const quote = (await yahooFinance.quote(querySymbol)) as Record<
      string,
      unknown
    >;

    if (!quote) {
      return null;
    }

    return {
      symbol: querySymbol,
      name:
        (quote.shortName as string) ||
        (quote.longName as string) ||
        querySymbol,
      regularMarketPrice: (quote.regularMarketPrice as number) || 0,
      regularMarketChange: (quote.regularMarketChange as number) || 0,
      regularMarketChangePercent:
        (quote.regularMarketChangePercent as number) || 0,
      regularMarketVolume: (quote.regularMarketVolume as number) || 0,
      regularMarketDayHigh: (quote.regularMarketDayHigh as number) || 0,
      regularMarketDayLow: (quote.regularMarketDayLow as number) || 0,
      fiftyTwoWeekHigh: (quote.fiftyTwoWeekHigh as number) || 0,
      fiftyTwoWeekLow: (quote.fiftyTwoWeekLow as number) || 0,
      currency: (quote.currency as string) || 'KRW',
    };
  } catch (error) {
    console.error(`Failed to fetch quote for ${symbol}:`, error);
    return null;
  }
}

export async function getHistoricalData(
  symbol: string,
  period1: Date,
  period2: Date = new Date(),
): Promise<HistoricalData[]> {
  try {
    const normalized = normalizeKoreanSymbol(symbol);
    const querySymbol = normalized.isValid
      ? (normalized.symbol ?? symbol)
      : symbol;

    const result = (await yahooFinance.historical(querySymbol, {
      period1,
      period2,
    })) as Record<string, unknown>[];

    return result.map((item: Record<string, unknown>) => ({
      date: item.date as Date,
      open: item.open as number,
      high: item.high as number,
      low: item.low as number,
      close: item.close as number,
      volume: item.volume as number,
    }));
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}:`, error);
    return [];
  }
}

export async function searchStocks(
  query: string,
): Promise<Array<{ symbol: string; name: string; exchange: string }>> {
  try {
    const results = (await yahooFinance.search(query)) as Record<
      string,
      unknown
    >;

    return (results.quotes as Record<string, unknown>[])
      .filter((q: Record<string, unknown>) => q.quoteType === 'EQUITY')
      .slice(0, 10)
      .map((q: Record<string, unknown>) => ({
        symbol: q.symbol as string,
        name:
          (q.shortname as string) ||
          (q.longname as string) ||
          (q.symbol as string),
        exchange: (q.exchange as string) || 'Unknown',
      }));
  } catch (error) {
    console.error(`Search failed for ${query}:`, error);
    return [];
  }
}
