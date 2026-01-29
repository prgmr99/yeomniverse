import { GoogleGenerativeAI } from '@google/generative-ai';
import type { StockQuote } from '../collectors/stock-collector.js';
import type { TechnicalIndicators } from './technical-analyzer.js';

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

  const prompt = `당신은 20년 경력의 기술적 분석 전문가입니다.

다음 주식의 기술적 지표를 분석하세요:
- 종목: ${quote.symbol} (${quote.name})
- 현재가: ${quote.regularMarketPrice.toLocaleString()}원 (${quote.regularMarketChangePercent >= 0 ? '+' : ''}${quote.regularMarketChangePercent.toFixed(2)}%)
- RSI(14): ${indicators.rsi?.toFixed(2) || 'N/A'}
- MACD: ${indicators.macd?.MACD.toFixed(2) || 'N/A'}, Signal: ${indicators.macd?.signal.toFixed(2) || 'N/A'}
- 볼린저밴드: 상단 ${indicators.bollingerBands?.upper.toFixed(0) || 'N/A'}, 하단 ${indicators.bollingerBands?.lower.toFixed(0) || 'N/A'}
- 5일선: ${indicators.sma.sma5?.toFixed(0) || 'N/A'}, 20일선: ${indicators.sma.sma20?.toFixed(0) || 'N/A'}, 60일선: ${indicators.sma.sma60?.toFixed(0) || 'N/A'}
- 거래량: 20일 평균 대비 ${indicators.volumeRatio?.toFixed(0) || 'N/A'}%

${relatedNews && relatedNews.length > 0 ? `관련 뉴스:
${relatedNews.map(n => `- ${n.title} (${n.sentiment})`).join('\n')}` : ''}

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "signal": "buy" | "hold" | "sell",
  "strength": 1-5,
  "summary": "한 줄 요약 (50자 이내)",
  "analysis": "3줄 상세 분석 (150자 이내)",
  "keyPoints": ["포인트1", "포인트2", "포인트3"]
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
      summary: parsed.summary?.slice(0, 100) || '분석 결과를 생성하지 못했습니다.',
      analysis: parsed.analysis?.slice(0, 300) || '',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 5) : [],
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      signal: 'hold',
      strength: 3,
      summary: '기술적 분석 중 오류가 발생했습니다.',
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
    if (indicators.rsi < 30) signals.push('RSI 과매도');
    else if (indicators.rsi > 70) signals.push('RSI 과매수');
  }

  if (indicators.macd) {
    if (indicators.macd.MACD > indicators.macd.signal) {
      signals.push('MACD 매수신호');
    } else {
      signals.push('MACD 매도신호');
    }
  }

  const trend = quote.regularMarketChangePercent >= 0 ? '상승' : '하락';

  return `${quote.name} ${quote.regularMarketPrice.toLocaleString()}원 (${trend} ${Math.abs(quote.regularMarketChangePercent).toFixed(1)}%) | ${signals.join(', ') || '중립'}`;
}
