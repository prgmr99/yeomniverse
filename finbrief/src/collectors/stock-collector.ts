import yahooFinance from 'yahoo-finance2';
import { normalizeKoreanSymbol, type SymbolValidationResult } from '../utils/korean-stock-symbols.js';

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

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    // Normalize Korean stock symbols
    const normalized = normalizeKoreanSymbol(symbol);
    const querySymbol = normalized.isValid ? normalized.symbol! : symbol;

    const quote = await yahooFinance.quote(querySymbol);

    if (!quote) {
      return null;
    }

    return {
      symbol: querySymbol,
      name: quote.shortName || quote.longName || querySymbol,
      regularMarketPrice: quote.regularMarketPrice || 0,
      regularMarketChange: quote.regularMarketChange || 0,
      regularMarketChangePercent: quote.regularMarketChangePercent || 0,
      regularMarketVolume: quote.regularMarketVolume || 0,
      regularMarketDayHigh: quote.regularMarketDayHigh || 0,
      regularMarketDayLow: quote.regularMarketDayLow || 0,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      currency: quote.currency || 'KRW',
    };
  } catch (error) {
    console.error(`Failed to fetch quote for ${symbol}:`, error);
    return null;
  }
}

export async function getHistoricalData(
  symbol: string,
  period1: Date,
  period2: Date = new Date()
): Promise<HistoricalData[]> {
  try {
    const normalized = normalizeKoreanSymbol(symbol);
    const querySymbol = normalized.isValid ? normalized.symbol! : symbol;

    const result = await yahooFinance.historical(querySymbol, {
      period1,
      period2,
    });

    return result.map((item) => ({
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  } catch (error) {
    console.error(`Failed to fetch historical data for ${symbol}:`, error);
    return [];
  }
}

export async function searchStocks(query: string): Promise<Array<{ symbol: string; name: string; exchange: string }>> {
  try {
    const results = await yahooFinance.search(query);

    return results.quotes
      .filter((q: any) => q.quoteType === 'EQUITY')
      .slice(0, 10)
      .map((q: any) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exchange: q.exchange || 'Unknown',
      }));
  } catch (error) {
    console.error(`Search failed for ${query}:`, error);
    return [];
  }
}
