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
 * public/data/latest.json 파일을 읽어 반환합니다.
 *
 * @returns BriefingData - 브리핑 데이터 (파일이 없으면 fallback 데이터 반환)
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

/**
 * analysis 객체를 BriefingData 형식으로 변환
 */
function transformToBriefingData(analysis: any): BriefingData {
  return {
    briefings: analysis.topNews.map((news: any) => ({
      title: news.title,
      description: news.summary,
      sentiment: mapSentiment(news.sentiment),
    })),
    tags: analysis.keywords,
    summary: analysis.marketSentiment,
  };
}

/**
 * 'bull' | 'bear' | 'neutral' 형식을 'bullish' | 'bearish' | 'neutral'로 변환
 */
function mapSentiment(sentiment: string): 'bullish' | 'bearish' | 'neutral' {
  if (sentiment === 'bull') return 'bullish';
  if (sentiment === 'bear') return 'bearish';
  return 'neutral';
}

/**
 * Fallback 더미 데이터
 */
function getFallbackData(): BriefingData {
  return {
    briefings: [
      {
        title: '오늘의 브리핑을 준비 중입니다',
        description:
          '최신 금융 뉴스를 분석하여 곧 브리핑을 제공해드릴 예정입니다. 잠시만 기다려주세요.',
        sentiment: 'neutral',
      },
    ],
    tags: ['#준비중', '#금융뉴스', '#브리핑'],
    summary: '브리핑 데이터를 불러오는 중입니다.',
  };
}
