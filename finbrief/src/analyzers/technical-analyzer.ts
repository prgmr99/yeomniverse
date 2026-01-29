import { RSI, MACD, BollingerBands, SMA } from 'technicalindicators';
import type { HistoricalData } from '../collectors/stock-collector.js';

export interface TechnicalIndicators {
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
  sma: {
    sma5: number | null;
    sma20: number | null;
    sma60: number | null;
  };
  volumeRatio: number | null;
}

export function calculateTechnicalIndicators(historicalData: HistoricalData[]): TechnicalIndicators {
  if (historicalData.length < 60) {
    console.warn('Insufficient data for full technical analysis');
  }

  const closePrices = historicalData.map(d => d.close);
  const volumes = historicalData.map(d => d.volume);

  // RSI (14-period)
  let rsi: number | null = null;
  if (closePrices.length >= 14) {
    const rsiValues = RSI.calculate({
      period: 14,
      values: closePrices,
    });
    rsi = rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : null;
  }

  // MACD (12, 26, 9)
  let macd: TechnicalIndicators['macd'] = null;
  if (closePrices.length >= 26) {
    const macdValues = MACD.calculate({
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
      values: closePrices,
    });
    if (macdValues.length > 0) {
      const latest = macdValues[macdValues.length - 1];
      if (latest.MACD !== undefined && latest.signal !== undefined && latest.histogram !== undefined) {
        macd = {
          MACD: latest.MACD,
          signal: latest.signal,
          histogram: latest.histogram,
        };
      }
    }
  }

  // Bollinger Bands (20-period, 2 std dev)
  let bollingerBands: TechnicalIndicators['bollingerBands'] = null;
  if (closePrices.length >= 20) {
    const bbValues = BollingerBands.calculate({
      period: 20,
      stdDev: 2,
      values: closePrices,
    });
    if (bbValues.length > 0) {
      const latest = bbValues[bbValues.length - 1];
      bollingerBands = {
        upper: latest.upper,
        middle: latest.middle,
        lower: latest.lower,
      };
    }
  }

  // Simple Moving Averages
  const sma5Values = closePrices.length >= 5 ? SMA.calculate({ period: 5, values: closePrices }) : [];
  const sma20Values = closePrices.length >= 20 ? SMA.calculate({ period: 20, values: closePrices }) : [];
  const sma60Values = closePrices.length >= 60 ? SMA.calculate({ period: 60, values: closePrices }) : [];

  // Volume ratio (current vs 20-day average)
  let volumeRatio: number | null = null;
  if (volumes.length >= 20) {
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const currentVolume = volumes[volumes.length - 1];
    volumeRatio = avgVolume > 0 ? (currentVolume / avgVolume) * 100 : null;
  }

  return {
    rsi,
    macd,
    bollingerBands,
    sma: {
      sma5: sma5Values.length > 0 ? sma5Values[sma5Values.length - 1] : null,
      sma20: sma20Values.length > 0 ? sma20Values[sma20Values.length - 1] : null,
      sma60: sma60Values.length > 0 ? sma60Values[sma60Values.length - 1] : null,
    },
    volumeRatio,
  };
}

export function interpretIndicators(indicators: TechnicalIndicators, currentPrice: number): {
  signals: string[];
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
} {
  const signals: string[] = [];
  let bullishCount = 0;
  let bearishCount = 0;

  // RSI interpretation
  if (indicators.rsi !== null) {
    if (indicators.rsi < 30) {
      signals.push(`RSI ${indicators.rsi.toFixed(1)}: 과매도 구간 (매수 신호)`);
      bullishCount++;
    } else if (indicators.rsi > 70) {
      signals.push(`RSI ${indicators.rsi.toFixed(1)}: 과매수 구간 (매도 신호)`);
      bearishCount++;
    } else {
      signals.push(`RSI ${indicators.rsi.toFixed(1)}: 중립 구간`);
    }
  }

  // MACD interpretation
  if (indicators.macd) {
    if (indicators.macd.MACD > indicators.macd.signal) {
      signals.push('MACD: 시그널선 상향 돌파 (매수 신호)');
      bullishCount++;
    } else {
      signals.push('MACD: 시그널선 하향 (매도 신호)');
      bearishCount++;
    }
  }

  // Bollinger Bands interpretation
  if (indicators.bollingerBands) {
    const { upper, lower, middle } = indicators.bollingerBands;
    if (currentPrice >= upper) {
      signals.push('볼린저밴드: 상단 터치 (과매수 가능성)');
      bearishCount++;
    } else if (currentPrice <= lower) {
      signals.push('볼린저밴드: 하단 터치 (과매도 가능성)');
      bullishCount++;
    } else {
      signals.push('볼린저밴드: 중간 밴드 내 거래');
    }
  }

  // Moving Average interpretation
  const { sma5, sma20 } = indicators.sma;
  if (sma5 !== null && sma20 !== null) {
    if (sma5 > sma20) {
      signals.push('이동평균: 5일선 > 20일선 (단기 상승 추세)');
      bullishCount++;
    } else {
      signals.push('이동평균: 5일선 < 20일선 (단기 하락 추세)');
      bearishCount++;
    }
  }

  // Volume interpretation
  if (indicators.volumeRatio !== null) {
    if (indicators.volumeRatio > 150) {
      signals.push(`거래량: 평균 대비 ${indicators.volumeRatio.toFixed(0)}% (거래 활발)`);
    } else if (indicators.volumeRatio < 50) {
      signals.push(`거래량: 평균 대비 ${indicators.volumeRatio.toFixed(0)}% (거래 저조)`);
    }
  }

  // Determine overall sentiment
  let overallSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (bullishCount > bearishCount + 1) {
    overallSentiment = 'bullish';
  } else if (bearishCount > bullishCount + 1) {
    overallSentiment = 'bearish';
  }

  return { signals, overallSentiment };
}
