import koreanStocks from '../../data/korean-stocks.json' assert { type: 'json' };

export interface SymbolValidationResult {
  isValid: boolean;
  symbol: string | null;
  name: string | null;
  market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ' | null;
  error?: string;
}

interface KoreanStockInfo {
  name: string;
  englishName: string;
  market: 'KOSPI' | 'KOSDAQ';
  sector: string;
}

const KOREAN_STOCK_MAPPING: Record<string, KoreanStockInfo> = koreanStocks as Record<string, KoreanStockInfo>;

/**
 * Normalize Korean stock code to 6 digits
 */
function normalizeKoreanStockCode(code: string): string {
  const numericCode = code.replace(/\D/g, '');
  return numericCode.padStart(6, '0');
}

/**
 * Add market suffix to Korean stock code
 */
function addMarketSuffix(code: string, market: 'KOSPI' | 'KOSDAQ'): string {
  const normalizedCode = normalizeKoreanStockCode(code);
  const suffix = market === 'KOSPI' ? '.KS' : '.KQ';
  return `${normalizedCode}${suffix}`;
}

/**
 * Validate and normalize a stock symbol input
 */
export function normalizeKoreanSymbol(input: string): SymbolValidationResult {
  const trimmed = input.trim();

  // 1. Already formatted symbol (e.g., 005930.KS)
  if (/^\d{6}\.(KS|KQ)$/.test(trimmed)) {
    const market = trimmed.endsWith('.KS') ? 'KOSPI' : 'KOSDAQ';
    const code = trimmed.slice(0, 6);
    const stockInfo = KOREAN_STOCK_MAPPING[code];
    return {
      isValid: true,
      symbol: trimmed,
      name: stockInfo?.name || null,
      market,
    };
  }

  // 2. Numeric code only (e.g., 5930 or 005930)
  if (/^\d+$/.test(trimmed)) {
    const normalizedCode = normalizeKoreanStockCode(trimmed);
    const stockInfo = KOREAN_STOCK_MAPPING[normalizedCode];

    if (stockInfo) {
      return {
        isValid: true,
        symbol: addMarketSuffix(normalizedCode, stockInfo.market),
        name: stockInfo.name,
        market: stockInfo.market,
      };
    }

    // Unknown code - try both markets
    return {
      isValid: false,
      symbol: null,
      name: null,
      market: null,
      error: `Unknown stock code: ${normalizedCode}`,
    };
  }

  // 3. Korean stock name (e.g., 삼성전자)
  const foundByName = Object.entries(KOREAN_STOCK_MAPPING).find(
    ([_, info]) => info.name === trimmed || info.englishName.toLowerCase() === trimmed.toLowerCase()
  );

  if (foundByName) {
    const [code, info] = foundByName;
    return {
      isValid: true,
      symbol: addMarketSuffix(code, info.market),
      name: info.name,
      market: info.market,
    };
  }

  // 4. US stock ticker (e.g., AAPL)
  if (/^[A-Z]{1,5}$/.test(trimmed.toUpperCase())) {
    return {
      isValid: true,
      symbol: trimmed.toUpperCase(),
      name: null,
      market: 'NYSE', // Default to NYSE, could be NASDAQ
    };
  }

  return {
    isValid: false,
    symbol: null,
    name: null,
    market: null,
    error: 'Invalid input format',
  };
}

/**
 * Search Korean stocks by name or code
 */
export function searchKoreanStocks(query: string): Array<{ symbol: string; name: string; market: string }> {
  const lowerQuery = query.toLowerCase();
  const results: Array<{ symbol: string; name: string; market: string }> = [];

  for (const [code, info] of Object.entries(KOREAN_STOCK_MAPPING)) {
    if (
      code.includes(query) ||
      info.name.includes(query) ||
      info.englishName.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        symbol: addMarketSuffix(code, info.market),
        name: info.name,
        market: info.market,
      });
    }

    if (results.length >= 20) break;
  }

  return results;
}

export { KOREAN_STOCK_MAPPING };
