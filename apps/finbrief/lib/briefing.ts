import fs from 'node:fs';
import path from 'node:path';

interface BriefingData {
  briefings: Array<{
    title: string;
    description: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
  }>;
  tags: string[];
  summary: string;
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

    return transformToBriefingData(data.analysis);
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
