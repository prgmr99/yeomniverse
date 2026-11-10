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
        ? {
            score: data.fearGreedIndex.score,
            rating: data.fearGreedIndex.rating,
          }
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
 * Reads and returns a specific date's briefing from public/data/{date}.json.
 *
 * @returns BriefingData | null - Briefing data or null if not found
 */
export function getBriefingByDate(date: string): BriefingData | null {
  try {
    const filePath = path.join(process.cwd(), `public/data/${date}.json`);
    if (!fs.existsSync(filePath)) return null;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const briefing = transformToBriefingData(data.analysis);
    return {
      ...briefing,
      fearGreed: data.fearGreedIndex
        ? {
            score: data.fearGreedIndex.score,
            rating: data.fearGreedIndex.rating,
          }
        : undefined,
      oneWay: data.oneWayIndex
        ? {
            score: data.oneWayIndex.score,
            direction: data.oneWayIndex.direction,
            label: data.oneWayIndex.label,
            components: data.oneWayIndex.components,
          }
        : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Sentinels written by the analyzer when a day's AI analysis fails.
 *
 * finbrief/src/analyzers/gemini-analyzer.ts의 폴백과 일치해야 한다. 그쪽은
 * 별도 저장소의 Node 서비스라 상수를 import할 수 없어 문자열을 다시 적는다.
 */
const ANALYSIS_ERROR_TITLE = 'Analysis Error';
const ANALYSIS_ERROR_SUMMARY = 'Unable to retrieve analysis results.';

/**
 * Returns whether a briefing has real analysis and may be indexed.
 *
 * 분석이 실패한 날도 파이프라인은 정상 결과와 같은 모양의 JSON을 커밋하므로,
 * 센티넬을 보고 걸러내지 않으면 에러 문구가 본문인 페이지가 색인된다.
 */
export function isBriefingIndexable(briefing: BriefingData): boolean {
  if (briefing.summary === ANALYSIS_ERROR_SUMMARY) return false;
  return !briefing.briefings.some(
    (item) => item.title === ANALYSIS_ERROR_TITLE,
  );
}

/**
 * Returns all available briefing dates (YYYY-MM-DD) from public/data/.
 */
export function getAvailableBriefingDates(): string[] {
  try {
    const dataDir = path.join(process.cwd(), 'public/data');
    if (!fs.existsSync(dataDir)) return [];
    return fs
      .readdirSync(dataDir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.replace('.json', ''))
      .sort((a, b) => b.localeCompare(a)); // newest first
  } catch {
    return [];
  }
}

/**
 * Returns briefing dates that may be indexed. Used by the sitemap.
 *
 * isBriefingIndexable과 같은 기준이어야 한다. 한쪽만 바꾸면 noindex인
 * 페이지가 사이트맵에 남는다.
 */
export function getIndexableBriefingDates(): string[] {
  return getAvailableBriefingDates().filter((date) => {
    const briefing = getBriefingByDate(date);
    return briefing !== null && isBriefingIndexable(briefing);
  });
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
