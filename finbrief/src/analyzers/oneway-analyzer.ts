import { ADX, EMA, RSI, BollingerBands } from 'technicalindicators';
import { getHistoricalData } from '../collectors/stock-collector';
import type { OneWayIndex } from '../types/news.types';

// Component weights (must sum to 1.0)
const WEIGHTS = {
  adx: 0.25,
  maAlignment: 0.20,
  rsiTrend: 0.15,
  bbWidth: 0.15,
  vix: 0.10,
  volume: 0.10,
  fearGreed: 0.05,
};

/**
 * Score ADX value (0-100).
 * Higher ADX = stronger trend = higher one-way probability.
 */
function scoreAdx(adxValue: number): number {
  if (adxValue < 20) return 0;
  if (adxValue < 25) return 30;
  if (adxValue < 35) return 60;
  if (adxValue < 50) return 85;
  return 100;
}

/**
 * Score MA alignment (0-100).
 * Count how many EMA pairs are properly ordered (8 < 21 < 50 < 200 for bull, reverse for bear).
 * 6 possible pairs from 4 EMAs.
 */
function scoreMaAlignment(emas: { ema8: number; ema21: number; ema50: number; ema200: number }): {
  score: number;
  direction: 'bull' | 'bear' | 'neutral';
} {
  const { ema8, ema21, ema50, ema200 } = emas;
  const values = [ema8, ema21, ema50, ema200];

  // Count bullish pairs (shorter EMA > longer EMA)
  let bullPairs = 0;
  let bearPairs = 0;
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] > values[j]) bullPairs++;
      else if (values[i] < values[j]) bearPairs++;
    }
  }

  const alignedPairs = Math.max(bullPairs, bearPairs);
  const direction: 'bull' | 'bear' | 'neutral' =
    bullPairs > bearPairs ? 'bull' : bearPairs > bullPairs ? 'bear' : 'neutral';

  // 6 total pairs: 0→0, 3→50, 6→100
  const score = Math.round((alignedPairs / 6) * 100);
  return { score, direction };
}

/**
 * Score RSI trend zone (0-100).
 * Bull: RSI 55-75 is strong trend zone. Bear: RSI 25-45 is strong trend zone.
 * Extremes (>80 or <20) suggest exhaustion, not strong trend.
 */
function scoreRsiTrend(rsiValue: number, direction: 'bull' | 'bear' | 'neutral'): number {
  if (direction === 'bull') {
    if (rsiValue >= 55 && rsiValue <= 65) return 100;
    if (rsiValue >= 65 && rsiValue <= 75) return 80;
    if (rsiValue >= 50 && rsiValue < 55) return 50;
    if (rsiValue > 75 && rsiValue <= 80) return 40;
    if (rsiValue > 80) return 20; // overbought exhaustion
    return 10;
  } else if (direction === 'bear') {
    if (rsiValue >= 35 && rsiValue <= 45) return 100;
    if (rsiValue >= 25 && rsiValue < 35) return 80;
    if (rsiValue > 45 && rsiValue <= 50) return 50;
    if (rsiValue >= 20 && rsiValue < 25) return 40;
    if (rsiValue < 20) return 20; // oversold exhaustion
    return 10;
  }
  // Neutral — neither zone
  if (rsiValue >= 45 && rsiValue <= 55) return 20;
  return 10;
}

/**
 * Score Bollinger Band width (0-100).
 * Uses percentile of current width over history. Expanding from squeeze = high score.
 */
function scoreBbWidth(bbHistory: Array<{ upper: number; lower: number; middle: number }>): number {
  if (bbHistory.length < 20) return 50;

  const widths = bbHistory.map(bb => (bb.upper - bb.lower) / bb.middle);
  const currentWidth = widths[widths.length - 1];
  const sorted = [...widths].sort((a, b) => a - b);
  const rank = sorted.findIndex(w => w >= currentWidth);
  const percentile = (rank / sorted.length) * 100;

  // Check if expanding from a recent squeeze
  const recentWidths = widths.slice(-10);
  const minRecent = Math.min(...recentWidths);
  const isExpanding = currentWidth > minRecent * 1.2;

  if (percentile > 80 && isExpanding) return 100;
  if (percentile > 70 && isExpanding) return 85;
  if (percentile > 60) return 70;
  if (percentile > 40) return 50;
  if (percentile > 20) return 30;
  return 10;
}

/**
 * Score VIX level (0-100).
 * Bull context: Low VIX (12-16) = confident rally = high score.
 * Bear context: High VIX (>30) = panic selling = high score.
 */
function scoreVix(vixValue: number, direction: 'bull' | 'bear' | 'neutral'): number {
  if (direction === 'bull') {
    if (vixValue >= 12 && vixValue <= 16) return 90;
    if (vixValue > 16 && vixValue <= 20) return 60;
    if (vixValue > 20 && vixValue <= 25) return 40;
    if (vixValue > 25 && vixValue <= 30) return 25;
    if (vixValue > 30) return 20;
    return 70; // VIX < 12 complacency
  } else if (direction === 'bear') {
    if (vixValue > 35) return 90;
    if (vixValue > 30) return 80;
    if (vixValue > 25) return 65;
    if (vixValue > 20) return 45;
    return 20;
  }
  return 30;
}

/**
 * Score volume trend (0-100).
 * Rising volume MA confirms directional conviction.
 */
function scoreVolume(volumes: number[]): number {
  if (volumes.length < 50) return 50;

  const recent20 = volumes.slice(-20);
  const older50 = volumes.slice(-50);
  const avg20 = recent20.reduce((a, b) => a + b, 0) / recent20.length;
  const avg50 = older50.reduce((a, b) => a + b, 0) / older50.length;

  const ratio = avg20 / avg50;
  if (ratio > 1.5) return 100;
  if (ratio > 1.3) return 85;
  if (ratio > 1.1) return 65;
  if (ratio > 0.9) return 40;
  if (ratio > 0.7) return 20;
  return 10;
}

/**
 * Score Fear & Greed contribution (0-100).
 * Extreme values (>80 or <20) in the same direction as trend = high score.
 */
function scoreFearGreed(fgScore: number, direction: 'bull' | 'bear' | 'neutral'): number {
  if (direction === 'bull') {
    if (fgScore >= 75) return 90;
    if (fgScore >= 60) return 70;
    if (fgScore >= 45) return 40;
    return 15;
  } else if (direction === 'bear') {
    if (fgScore <= 25) return 90;
    if (fgScore <= 40) return 70;
    if (fgScore <= 55) return 40;
    return 15;
  }
  // Extreme values in neutral = still some signal
  if (fgScore > 80 || fgScore < 20) return 60;
  return 30;
}

/**
 * Returns a descriptive label for the one-way score.
 */
export function getOneWayLabel(score: number): string {
  if (score <= 20) return 'No Trend';
  if (score <= 40) return 'Weak Directional Bias';
  if (score <= 60) return 'Moderate Trend';
  if (score <= 80) return 'Strong One-Way Trend';
  return 'Extreme One-Way';
}

/**
 * Returns a Korean label for the one-way score.
 */
export function getOneWayLabelKo(score: number): string {
  if (score <= 20) return '횡보장';
  if (score <= 40) return '약한 방향성';
  if (score <= 60) return '보통 추세';
  if (score <= 80) return '강한 원웨이';
  return '극단적 원웨이장';
}

/**
 * Returns direction emoji based on direction and score intensity.
 */
export function getOneWayDirectionEmoji(direction: 'bull' | 'bear' | 'neutral', score: number): string {
  if (direction === 'bull') {
    if (score >= 80) return '📈📈';
    if (score >= 60) return '📈';
    return '↗️';
  } else if (direction === 'bear') {
    if (score >= 80) return '📉📉';
    if (score >= 60) return '📉';
    return '↘️';
  }
  return '➡️';
}

/**
 * Returns an emoji-based bar (10 blocks) for the one-way score.
 */
export function getOneWayBar(score: number): string {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;

  let emoji: string;
  if (score <= 20) emoji = '⬜';
  else if (score <= 40) emoji = '🟨';
  else if (score <= 60) emoji = '🟧';
  else if (score <= 80) emoji = '🟥';
  else emoji = '🟪';

  return `${emoji.repeat(filled)}${'⬜'.repeat(empty)}`;
}

/**
 * Main entry: calculates the One-Way Market Probability Index.
 * Fetches S&P 500 and VIX data, computes all sub-scores, and returns composite.
 */
export async function calculateOneWayIndex(fearGreedScore?: number): Promise<OneWayIndex | null> {
  try {
    console.log('[One-Way Index] Calculating...');

    // Fetch ~250 trading days of S&P 500 data + VIX quote
    const period1 = new Date();
    period1.setDate(period1.getDate() - 365);

    const [spxData, vixData] = await Promise.all([
      getHistoricalData('^GSPC', period1),
      getHistoricalData('^VIX', period1),
    ]);

    if (spxData.length < 60) {
      console.warn('[One-Way Index] Insufficient S&P 500 data');
      return null;
    }

    const closePrices = spxData.map(d => d.close);
    const highPrices = spxData.map(d => d.high);
    const lowPrices = spxData.map(d => d.low);
    const volumes = spxData.map(d => d.volume);

    // 1. ADX calculation
    const adxResults = ADX.calculate({
      high: highPrices,
      low: lowPrices,
      close: closePrices,
      period: 14,
    });

    const latestAdx = adxResults.length > 0 ? adxResults[adxResults.length - 1] : null;
    const adxValue = latestAdx?.adx ?? 0;
    const pdi = latestAdx?.pdi ?? 0;
    const mdi = latestAdx?.mdi ?? 0;

    // 2. EMA calculation (8, 21, 50, 200)
    const ema8 = EMA.calculate({ period: 8, values: closePrices });
    const ema21 = EMA.calculate({ period: 21, values: closePrices });
    const ema50 = EMA.calculate({ period: 50, values: closePrices });
    const ema200 = EMA.calculate({ period: 200, values: closePrices });

    const emas = {
      ema8: ema8.length > 0 ? ema8[ema8.length - 1] : 0,
      ema21: ema21.length > 0 ? ema21[ema21.length - 1] : 0,
      ema50: ema50.length > 0 ? ema50[ema50.length - 1] : 0,
      ema200: ema200.length > 0 ? ema200[ema200.length - 1] : 0,
    };

    // 3. RSI
    const rsiValues = RSI.calculate({ period: 14, values: closePrices });
    const rsiValue = rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : 50;

    // 4. Bollinger Bands history
    const bbResults = BollingerBands.calculate({
      period: 20,
      stdDev: 2,
      values: closePrices,
    });

    // 5. VIX
    const vixClose = vixData.length > 0 ? vixData[vixData.length - 1].close : 20;

    // Determine direction from ADX +DI/-DI and MA stack
    const maResult = scoreMaAlignment(emas);
    const adxDirection: 'bull' | 'bear' | 'neutral' =
      pdi > mdi ? 'bull' : mdi > pdi ? 'bear' : 'neutral';

    // Combine ADX direction and MA direction (ADX direction takes precedence when strong)
    let direction: 'bull' | 'bear' | 'neutral';
    if (adxValue >= 25) {
      direction = adxDirection;
    } else if (maResult.direction !== 'neutral') {
      direction = maResult.direction;
    } else {
      direction = adxDirection;
    }

    // Compute all sub-scores
    const components = {
      adx: scoreAdx(adxValue),
      maAlignment: maResult.score,
      rsiTrend: scoreRsiTrend(rsiValue, direction),
      bbWidth: scoreBbWidth(bbResults),
      vix: scoreVix(vixClose, direction),
      volume: scoreVolume(volumes),
      fearGreed: fearGreedScore != null ? scoreFearGreed(fearGreedScore, direction) : 50,
    };

    // Weighted composite score
    const score = Math.round(
      components.adx * WEIGHTS.adx +
      components.maAlignment * WEIGHTS.maAlignment +
      components.rsiTrend * WEIGHTS.rsiTrend +
      components.bbWidth * WEIGHTS.bbWidth +
      components.vix * WEIGHTS.vix +
      components.volume * WEIGHTS.volume +
      components.fearGreed * WEIGHTS.fearGreed
    );

    const label = getOneWayLabel(score);

    console.log(`[One-Way Index] Score: ${score}/100 (${label}) Direction: ${direction}`);
    console.log(`  ADX: ${adxValue.toFixed(1)} (${components.adx}) | MA: ${components.maAlignment} | RSI: ${rsiValue.toFixed(1)} (${components.rsiTrend}) | BB: ${components.bbWidth} | VIX: ${vixClose.toFixed(1)} (${components.vix}) | Vol: ${components.volume} | F&G: ${components.fearGreed}`);

    return { score, direction, label, components };
  } catch (error) {
    console.error('[One-Way Index] Calculation failed:', error);
    return null;
  }
}

/**
 * Recalculate with fear & greed score (called after F&G is resolved).
 */
export function recalcWithFearGreed(index: OneWayIndex, fearGreedScore: number): OneWayIndex {
  const fgComponent = scoreFearGreed(fearGreedScore, index.direction);
  const oldFgContribution = index.components.fearGreed * WEIGHTS.fearGreed;
  const newFgContribution = fgComponent * WEIGHTS.fearGreed;

  const newScore = Math.round(index.score - oldFgContribution + newFgContribution);

  return {
    ...index,
    score: Math.max(0, Math.min(100, newScore)),
    label: getOneWayLabel(newScore),
    components: {
      ...index.components,
      fearGreed: fgComponent,
    },
  };
}

// Standalone test
if (require.main === module) {
  require('dotenv').config();
  calculateOneWayIndex().then(result => {
    if (result) {
      console.log('\n[One-Way Index Result]');
      console.log(`  Score    : ${result.score}/100`);
      console.log(`  Direction: ${result.direction}`);
      console.log(`  Label    : ${result.label}`);
      console.log(`  Emoji    : ${getOneWayDirectionEmoji(result.direction, result.score)}`);
      console.log(`  Bar      : ${getOneWayBar(result.score)}`);
      console.log(`  Components:`, result.components);
    } else {
      console.log('[One-Way Index] Unavailable');
    }
  });
}
