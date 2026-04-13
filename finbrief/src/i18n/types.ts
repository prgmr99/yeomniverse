export interface Locale {
  // Common
  brandName: string;
  morningBrief: string;
  personalizedMorningBrief: string;
  tagline: string;
  readTime: string;

  // Date formatting
  dateLocale: string;

  // Sentiment
  bullish: string;
  bearish: string;
  neutral: string;
  sentimentTagBull: string;
  sentimentTagBear: string;
  sentimentTagNeutral: string;

  // Fear & Greed
  fearGreedTitle: string;
  fearGreedScaleLabels: [string, string, string, string, string];

  // One-Way Index
  oneWayTitle: string;
  oneWayScaleLabels: [string, string, string, string, string];
  directionBull: string;
  directionBear: string;
  directionNeutral: string;

  // Sections
  keyThemes: string;
  marketOutlook: string;
  furtherReading: string;
  significance: string;
  topNews: string;
  myWatchlist: string;
  viewDashboard: string;
  unsubscribe: string;

  // Plan badges
  planFree: string;
  planBasic: string;
  planPro: string;

  // Technical
  macdBuySignal: string;
  macdSellSignal: string;
  uptrendSma: string;
  downtrendSma: string;

  // Affiliate defaults
  affiliateSavings: string;
  affiliateBooks: string;
  affiliateRealEstate: string;
  affiliateChecklist: string;

  // Quotes
  inspirationalQuotes: string[];
}

export type SupportedLanguage = 'en' | 'ko';
