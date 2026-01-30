import type { NewsItem } from '../types/news.types';
import { KOREAN_STOCK_MAPPING } from '../utils/korean-stock-symbols';

interface KoreanStockInfo {
  name: string;
  englishName: string;
  market: 'KOSPI' | 'KOSDAQ';
  sector: string;
}

type StockMapping = Record<string, KoreanStockInfo>;

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  user_id: string;
}

export interface MatchedNews {
  news: NewsItem;
  matchedStock: WatchlistItem;
  matchType: 'symbol' | 'korean_name' | 'english_name';
}

/**
 * Filter news items by matching against user's watchlist stocks
 * @param news Array of news items from RSS collection
 * @param watchlist User's watchlist items
 * @param stockMapping Korean stock symbol to name mapping
 * @returns Array of matched news with stock association
 */
export function filterNewsByWatchlist(
  news: NewsItem[],
  watchlist: WatchlistItem[],
  stockMapping: StockMapping = KOREAN_STOCK_MAPPING
): MatchedNews[] {
  const matches: MatchedNews[] = [];

  for (const newsItem of news) {
    const searchText = `${newsItem.title} ${newsItem.contentSnippet || ''}`.toLowerCase();

    for (const stock of watchlist) {
      // 1. Exact symbol match (case-insensitive, without .KS/.KQ suffix)
      const cleanSymbol = stock.symbol.toLowerCase().replace(/\.(ks|kq)$/i, '');
      const symbolMatch = searchText.includes(cleanSymbol);

      // 2. Korean name match (direct string match)
      const koreanNameMatch = stock.name && searchText.includes(stock.name.toLowerCase());

      // 3. English name match (from stockMapping lookup)
      const stockInfo = stockMapping[stock.symbol.replace(/\.(ks|kq)$/i, '').toUpperCase()];
      const englishNameMatch = stockInfo?.englishName &&
        searchText.includes(stockInfo.englishName.toLowerCase());

      if (symbolMatch || koreanNameMatch || englishNameMatch) {
        matches.push({
          news: newsItem,
          matchedStock: stock,
          matchType: symbolMatch ? 'symbol' : koreanNameMatch ? 'korean_name' : 'english_name'
        });
        break; // One match per news item
      }
    }
  }

  return matches;
}

/**
 * Group matched news by user for efficient notification sending
 * @param matches Array of matched news
 * @returns Map of user_id to their matched news
 */
export function groupMatchesByUser(matches: MatchedNews[]): Map<string, MatchedNews[]> {
  const userMatches = new Map<string, MatchedNews[]>();

  for (const match of matches) {
    const userId = match.matchedStock.user_id;
    const existing = userMatches.get(userId) || [];
    existing.push(match);
    userMatches.set(userId, existing);
  }

  return userMatches;
}
