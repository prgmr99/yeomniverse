import { GoogleGenerativeAI } from '@google/generative-ai';
import type { StockQuote } from '../collectors/stock-collector';
import type { TechnicalIndicators } from './technical-analyzer';

export interface AIAnalysisResult {
  signal: 'buy' | 'hold' | 'sell';
  strength: number; // 1-5
  summary: string;
  analysis: string;
  keyPoints: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeStockWithAI(
  quote: StockQuote,
  indicators: TechnicalIndicators,
  relatedNews?: Array<{ title: string; sentiment: string }>
): Promise<AIAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a technical analysis expert with 20 years of experience.

Analyze the following stock's technical indicators:
- Symbol: ${quote.symbol} (${quote.name})
- Current Price: ${quote.regularMarketPrice.toLocaleString()} (${quote.regularMarketChangePercent >= 0 ? '+' : ''}${quote.regularMarketChangePercent.toFixed(2)}%)
- RSI(14): ${indicators.rsi?.toFixed(2) || 'N/A'}
- MACD: ${indicators.macd?.MACD.toFixed(2) || 'N/A'}, Signal: ${indicators.macd?.signal.toFixed(2) || 'N/A'}
- Bollinger Bands: Upper ${indicators.bollingerBands?.upper.toFixed(0) || 'N/A'}, Lower ${indicators.bollingerBands?.lower.toFixed(0) || 'N/A'}
- SMA 5: ${indicators.sma.sma5?.toFixed(0) || 'N/A'}, SMA 20: ${indicators.sma.sma20?.toFixed(0) || 'N/A'}, SMA 60: ${indicators.sma.sma60?.toFixed(0) || 'N/A'}
- Volume: ${indicators.volumeRatio?.toFixed(0) || 'N/A'}% vs 20-day average

${relatedNews && relatedNews.length > 0 ? `Related News:\n${relatedNews.map(n => `- ${n.title} (${n.sentiment})`).join('\n')}` : ''}

Respond ONLY in the following JSON format (no other text):
{
  "signal": "buy" | "hold" | "sell",
  "strength": 1-5,
  "summary": "One-line summary (under 100 characters)",
  "analysis": "3-line detailed analysis (under 300 characters)",
  "keyPoints": ["point1", "point2", "point3"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as AIAnalysisResult;

    // Validate and sanitize
    return {
      signal: ['buy', 'hold', 'sell'].includes(parsed.signal) ? parsed.signal : 'hold',
      strength: Math.min(5, Math.max(1, parsed.strength || 3)),
      summary: parsed.summary?.slice(0, 100) || 'Failed to generate analysis results.',
      analysis: parsed.analysis?.slice(0, 300) || '',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 5) : [],
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      signal: 'hold',
      strength: 3,
      summary: 'An error occurred during technical analysis.',
      analysis: '',
      keyPoints: [],
    };
  }
}

export async function generateBriefAnalysis(
  quote: StockQuote,
  indicators: TechnicalIndicators
): Promise<string> {
  // Generate a brief one-liner for email
  const signals: string[] = [];

  if (indicators.rsi !== null) {
    if (indicators.rsi < 30) signals.push('RSI Oversold');
    else if (indicators.rsi > 70) signals.push('RSI Overbought');
  }

  if (indicators.macd) {
    if (indicators.macd.MACD > indicators.macd.signal) {
      signals.push('MACD Buy Signal');
    } else {
      signals.push('MACD Sell Signal');
    }
  }

  const trend = quote.regularMarketChangePercent >= 0 ? 'Up' : 'Down';

  return `${quote.name} ${quote.regularMarketPrice.toLocaleString()} (${trend} ${Math.abs(quote.regularMarketChangePercent).toFixed(1)}%) | ${signals.join(', ') || 'Neutral'}`;
}
