/**
 * Filters out Pro-only signals (RSI, MACD, Bollinger) for Basic plan users.
 * Keeps only SMA-based signals.
 */

// Keywords that indicate Pro-only signals
const PRO_ONLY_KEYWORDS = [
  'RSI',
  'MACD',
  '볼린저밴드',
  'Bollinger',
  '과매수',
  '과매도',
];

// Keywords that indicate Basic-allowed signals
const BASIC_ALLOWED_KEYWORDS = [
  '이동평균',
  '5일선',
  '20일선',
  '60일선',
  'SMA',
  '거래량',
  '골든크로스',
  '데드크로스',
];

/**
 * Filter signals to only include Basic-plan appropriate signals
 * @param signals Array of signal strings from technical analysis
 * @returns Filtered array with only SMA-based signals
 */
export function filterBasicSignals(signals: string[]): string[] {
  return signals.filter(signal => {
    const upperSignal = signal.toUpperCase();

    // Exclude if contains Pro-only keywords
    const hasProKeyword = PRO_ONLY_KEYWORDS.some(keyword =>
      upperSignal.includes(keyword.toUpperCase())
    );

    if (hasProKeyword) {
      return false;
    }

    return true;
  });
}

/**
 * Check if a plan allows technical indicators
 * @param planName The user's plan name
 * @returns Whether the plan includes technical analysis
 */
export function hasTechnicalAnalysis(planName: 'free' | 'basic' | 'pro'): boolean {
  return planName === 'pro';
}

/**
 * Check if a plan allows stock analysis
 * @param planName The user's plan name
 * @returns Whether the plan includes stock analysis
 */
export function hasStockAnalysis(planName: 'free' | 'basic' | 'pro'): boolean {
  return planName === 'basic' || planName === 'pro';
}
