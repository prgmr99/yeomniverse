export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  source?: string;
}

export interface AnalysisResult {
  topNews: Array<{
    title: string;
    summary: string;
    sentiment: 'bull' | 'bear' | 'neutral';
    reason: string;
  }>;
  keywords: string[];
  marketSentiment: string;
}

export interface FearGreedIndex {
  score: number;
  rating: string;
  timestamp: string;
}
