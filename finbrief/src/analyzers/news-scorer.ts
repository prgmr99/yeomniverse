import { NewsItem, ScoredNewsItem } from '../types/news.types';
import { significantWords } from '../collectors/rss-collector';

// ── Source Credibility Weights ──────────────────────────────────────
// Bloomberg/Reuters only appear via Google News sub-source extraction.
// The effective range across configured RSS feeds is 70-85.
const SOURCE_WEIGHTS: Record<string, number> = {
  Bloomberg: 95,
  Reuters: 95,
  CNBC: 85,
  'Investing.com': 80,
  MarketWatch: 75,
  'Google News': 70,
};
const DEFAULT_SOURCE_WEIGHT = 50;

// ── Content Signal Keywords ─────────────────────────────────────────
// English + Korean equivalents for each signal category.
const ANALYSIS_KEYWORDS = [
  'analysis', 'outlook', 'forecast', 'strategy', 'review', 'insight',
  'deep dive', 'explained', 'commentary', 'perspective',
  '분석', '전망', '전략', '리뷰', '해설', '진단', '시각',
];
const MARKET_MOVING_KEYWORDS = [
  'surge', 'plunge', 'crash', 'record', 'breakthrough', 'crisis',
  'halt', 'emergency', 'soar', 'tumble', 'collapse', 'rally',
  '급등', '급락', '폭락', '최고', '위기', '긴급', '중단', '폭등', '돌파', '사상최고',
];
const DATA_KEYWORDS = [
  'earnings', 'gdp', 'cpi', 'jobs', 'revenue', 'profit', 'rate decision',
  'payroll', 'inflation', 'unemployment',
  '실적', '매출', '이익', '고용', '금리', '물가',
];
const UPDATE_KEYWORDS = [
  'update', 'report', 'says', 'announces', 'plans',
  '발표', '보고서', '계획',
];

function scoreContentSignal(title: string): number {
  const lower = title.toLowerCase();
  if (ANALYSIS_KEYWORDS.some(k => lower.includes(k))) return 90;
  if (MARKET_MOVING_KEYWORDS.some(k => lower.includes(k))) return 85;
  if (DATA_KEYWORDS.some(k => lower.includes(k))) return 80;
  if (UPDATE_KEYWORDS.some(k => lower.includes(k))) return 60;
  return 50;
}

// ── Cross-Source Coverage ───────────────────────────────────────────
// Uses a 0.4 word-overlap threshold (lower than dedup's 0.6) to catch
// related coverage, not just near-duplicates.
function countCrossSources(
  item: NewsItem,
  allItems: NewsItem[]
): number {
  const words = significantWords(item.title);
  if (words.size === 0) return 0;

  const matchedSources = new Set<string>();

  for (const other of allItems) {
    if (other === item) continue;
    if (other.source === item.source) continue;

    const otherWords = significantWords(other.title);
    if (otherWords.size === 0) continue;

    const intersection = [...words].filter(w => otherWords.has(w)).length;
    const union = new Set([...words, ...otherWords]).size;
    if (union > 0 && intersection / union >= 0.4) {
      matchedSources.add(other.source || 'unknown');
    }
  }

  return matchedSources.size;
}

function crossSourceScore(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 50;
  if (count === 2) return 80;
  return 100;
}

// ── Recency ─────────────────────────────────────────────────────────
function scoreRecency(pubDate: string): number {
  try {
    const hoursAgo = (Date.now() - new Date(pubDate).getTime()) / (1000 * 60 * 60);
    return Math.max(0, Math.round(100 - hoursAgo * 4));
  } catch {
    return 50; // Default on parse failure
  }
}

// ── Source Credibility ──────────────────────────────────────────────
function scoreSourceCredibility(source: string | undefined): number {
  if (!source) return DEFAULT_SOURCE_WEIGHT;

  // Direct match
  if (SOURCE_WEIGHTS[source] !== undefined) return SOURCE_WEIGHTS[source];

  // Google News sub-source extraction: check if source contains a known name
  for (const [name, weight] of Object.entries(SOURCE_WEIGHTS)) {
    if (source.includes(name)) return weight;
  }

  return DEFAULT_SOURCE_WEIGHT;
}

// ── Composite Scoring ───────────────────────────────────────────────
// Weights: Credibility 25% | CrossSource 30% | Recency 25% | Content 20%
const W_CREDIBILITY = 0.25;
const W_CROSS_SOURCE = 0.30;
const W_RECENCY = 0.25;
const W_CONTENT = 0.20;

/**
 * Scores news articles by importance using 4 weighted factors.
 * Returns ScoredNewsItem[] sorted by importanceScore descending.
 *
 * @param deduplicatedItems - The deduplicated list to score and return
 * @param allItemsBeforeDedup - The pre-dedup (reliable-filtered) list for cross-source detection
 */
export function scoreNews(
  deduplicatedItems: NewsItem[],
  allItemsBeforeDedup: NewsItem[]
): ScoredNewsItem[] {
  const scored: ScoredNewsItem[] = deduplicatedItems.map(item => {
    const sourceCredibility = scoreSourceCredibility(item.source);
    const crossSourceCount = countCrossSources(item, allItemsBeforeDedup);
    const recencyScore = scoreRecency(item.pubDate);
    const contentSignal = scoreContentSignal(item.title);

    const importanceScore = Math.round(
      sourceCredibility * W_CREDIBILITY +
      crossSourceScore(crossSourceCount) * W_CROSS_SOURCE +
      recencyScore * W_RECENCY +
      contentSignal * W_CONTENT
    );

    return {
      ...item,
      importanceScore,
      crossSourceCount,
      sourceCredibility,
      recencyScore,
      contentSignal,
    };
  });

  scored.sort((a, b) => b.importanceScore - a.importanceScore);

  // Log top 10 for debugging
  console.log('[Scorer] Top scored articles:');
  scored.slice(0, 10).forEach((item, idx) => {
    console.log(
      `  ${idx + 1}. [${item.importanceScore}] ${item.source} | ` +
      `cred=${item.sourceCredibility} cross=${item.crossSourceCount} ` +
      `rec=${item.recencyScore} sig=${item.contentSignal} | ${item.title.slice(0, 60)}`
    );
  });

  return scored;
}
