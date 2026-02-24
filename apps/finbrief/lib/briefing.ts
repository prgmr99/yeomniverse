import fs from 'node:fs';
import path from 'node:path';

export interface BriefingData {
  briefings: Array<{
    title: string;
    description: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
  }>;
  tags: string[];
  summary: string;
  fearGreed?: {
    score: number;
    rating: string;
  };
  oneWay?: {
    score: number;
    direction: 'bull' | 'bear' | 'neutral';
    label: string;
    components?: {
      adx: number;
      maAlignment: number;
      rsiTrend: number;
      bbWidth: number;
      vix: number;
      volume: number;
    };
  };
}

/**
 * Reads and returns the public/data/latest.json file.
 *
 * @returns BriefingData - Briefing data (returns fallback data if file is not found)
 */
export function getLatestBriefing(): BriefingData {
  try {
    const filePath = path.join(process.cwd(), 'public/data/latest.json');

    if (!fs.existsSync(filePath)) {
      console.warn(`Data file not found: ${filePath}`);
      return getFallbackData();
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const briefing = transformToBriefingData(data.analysis);
    return {
      ...briefing,
      fearGreed: data.fearGreedIndex
        ? { score: data.fearGreedIndex.score, rating: data.fearGreedIndex.rating }
        : undefined,
      oneWay: data.oneWayIndex
        ? {
            score: data.oneWayIndex.score,
            direction: data.oneWayIndex.direction,
            label: data.oneWayIndex.label,
            components: data.oneWayIndex.components
              ? {
                  adx: data.oneWayIndex.components.adx,
                  maAlignment: data.oneWayIndex.components.maAlignment,
                  rsiTrend: data.oneWayIndex.components.rsiTrend,
                  bbWidth: data.oneWayIndex.components.bbWidth,
                  vix: data.oneWayIndex.components.vix,
                  volume: data.oneWayIndex.components.volume,
                }
              : undefined,
          }
        : undefined,
    };
  } catch (error) {
    console.error('Error loading briefing data:', error);
    return getFallbackData();
  }
}

interface AnalysisNews {
  title: string;
  summary: string;
  sentiment: string;
}

interface AnalysisData {
  topNews: AnalysisNews[];
  keywords: string[];
  marketSentiment: string;
}

/**
 * Transforms an analysis object into BriefingData format
 */
function transformToBriefingData(analysis: AnalysisData): BriefingData {
  return {
    briefings: analysis.topNews.map((news: AnalysisNews) => ({
      title: news.title,
      description: news.summary,
      sentiment: mapSentiment(news.sentiment),
    })),
    tags: analysis.keywords,
    summary: analysis.marketSentiment,
  };
}

/**
 * Converts 'bull' | 'bear' | 'neutral' format to 'bullish' | 'bearish' | 'neutral'
 */
function mapSentiment(sentiment: string): 'bullish' | 'bearish' | 'neutral' {
  if (sentiment === 'bull') return 'bullish';
  if (sentiment === 'bear') return 'bearish';
  return 'neutral';
}

/**
 * Fallback dummy data
 */
function getFallbackData(): BriefingData {
  return {
    briefings: [
      {
        title: "Preparing today's briefing",
        description:
          'We are analyzing the latest financial news and will provide a briefing shortly. Please wait.',
        sentiment: 'neutral',
      },
    ],
    tags: ['#preparing', '#financialnews', '#briefing'],
    summary: 'Loading briefing data.',
  };
}
