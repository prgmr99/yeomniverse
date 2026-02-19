import Parser from 'rss-parser';
import { NewsItem } from '../types/news.types';

const parser = new Parser({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
});

// Source priority for deduplication (lower index = higher priority)
const SOURCE_PRIORITY = ['Bloomberg', 'Reuters', 'CNBC', 'Investing.com', 'MarketWatch', 'Google News'];

function sourcePriority(source: string): number {
  const idx = SOURCE_PRIORITY.findIndex(s => source.includes(s));
  return idx === -1 ? SOURCE_PRIORITY.length : idx;
}

// English stop words to strip before comparing titles
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'and', 'or', 'but', 'as', 'is', 'are', 'was', 'were', 'it', 'its',
  'this', 'that', 'from', 'up', 'be', 'has', 'have', 'had', 'not',
]);

function significantWords(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOP_WORDS.has(w))
  );
}

/**
 * Deduplicates news items across sources using title word-overlap.
 * When two titles share >60% of their significant words, keeps the higher-priority source.
 */
export function deduplicateNews(items: NewsItem[]): NewsItem[] {
  const kept: NewsItem[] = [];

  for (const item of items) {
    const words = significantWords(item.title);
    if (words.size === 0) {
      kept.push(item);
      continue;
    }

    const duplicateIdx = kept.findIndex(existing => {
      const existingWords = significantWords(existing.title);
      if (existingWords.size === 0) return false;
      const intersection = [...words].filter(w => existingWords.has(w)).length;
      const union = new Set([...words, ...existingWords]).size;
      return intersection / union >= 0.6;
    });

    if (duplicateIdx === -1) {
      kept.push(item);
    } else {
      // Keep the higher-priority source
      const existing = kept[duplicateIdx];
      if (sourcePriority(item.source || '') < sourcePriority(existing.source || '')) {
        kept[duplicateIdx] = item;
      }
    }
  }

  return kept;
}

/**
 * Generic RSS fetch helper. Sets source on every item.
 * Returns [] on failure so Promise.allSettled callers are unaffected.
 */
async function fetchRssFeed(
  url: string,
  sourceName: string,
  maxItems = 20
): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.slice(0, maxItems).map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: item.contentSnippet || item.content,
      source: sourceName,
    }));
  } catch (err) {
    console.warn(`[RSS] Failed to fetch ${sourceName}: ${(err as Error).message}`);
    return [];
  }
}

export async function fetchGoogleFinanceNews(): Promise<NewsItem[]> {
  console.log('[RSS] Fetching Google News...');
  const searchQuery = encodeURIComponent('재테크 OR 주식 OR 투자 when:1d');
  const url = `https://news.google.com/rss/search?q=${searchQuery}&hl=ko&gl=KR&ceid=KR:ko`;
  const items = await fetchRssFeed(url, 'Google News', 20);
  console.log(`[RSS] Google News: ${items.length} items`);
  return items;
}

export async function fetchInvestingComNews(): Promise<NewsItem[]> {
  console.log('[RSS] Fetching Investing.com...');
  // news_14.rss = economy/market analysis. news.rss returns SEC filings.
  const items = await fetchRssFeed('https://www.investing.com/rss/news_14.rss', 'Investing.com', 15);
  console.log(`[RSS] Investing.com: ${items.length} items`);
  return items;
}

export async function fetchCNBCNews(): Promise<NewsItem[]> {
  console.log('[RSS] Fetching CNBC...');
  const items = await fetchRssFeed(
    'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
    'CNBC',
    20
  );
  console.log(`[RSS] CNBC: ${items.length} items`);
  return items;
}

export async function fetchMarketWatchNews(): Promise<NewsItem[]> {
  console.log('[RSS] Fetching MarketWatch...');
  const items = await fetchRssFeed(
    'https://feeds.content.dowjones.io/public/rss/mw_topstories',
    'MarketWatch',
    15
  );
  console.log(`[RSS] MarketWatch: ${items.length} items`);
  return items;
}

export async function fetchNaverStockNews(): Promise<NewsItem[]> {
  // Naver RSS service terminated — returns HTML, not RSS
  return [];
}

/**
 * Filters ad/sponsored content by Korean keywords (Google News only).
 */
export function filterAdNews(newsItems: NewsItem[]): NewsItem[] {
  const adKeywords = ['이벤트', '할인', '쿠폰', '광고', '[PR]', '협찬', '제공:'];
  return newsItems.filter(
    item => !adKeywords.some(keyword => item.title.includes(keyword))
  );
}

export function filterBlogNews(newsItems: NewsItem[]): NewsItem[] {
  const blogDomains = [
    'tistory.com', 'blog.naver.com', 'post.naver.com', 'velog.io',
    'brunch.co.kr', 'medium.com', 'notion.site', 'github.io',
    'wordpress.com', 'blogspot.com', 'daum.net/blog', 'egloos.com',
  ];
  return newsItems.filter(
    item => !blogDomains.some(domain => item.link.includes(domain))
  );
}

/**
 * Filters to reliable sources.
 * - Non-Google-News items: source is set by the collector → trusted, pass through.
 * - Google News items: extract source from "Title - Source" format and check whitelist.
 */
export function filterReliableNews(newsItems: NewsItem[]): NewsItem[] {
  const reliableSources = [
    '한국경제', '한경', '매일경제', '매경', '조선비즈', '조선일보',
    '연합뉴스', '연합', '뉴스1', '이데일리', '머니투데이', '서울경제',
    '아시아경제', '파이낸셜뉴스', '뉴시스', 'SBS', 'SBSCNBC', 'MBC',
    'KBS', 'JTBC', 'YTN', '한국경제TV', '한경TV', '와우TV', 'Bloomberg',
    'Reuters', '문화일보', '중앙일보', '동아일보', '헤럴드경제',
    // International sources added via direct collectors
    'CNBC', 'MarketWatch', 'Investing.com',
  ];

  return newsItems.filter(item => {
    // Non-Google-News items come from trusted collectors directly — pass through
    if (item.source && item.source !== 'Google News') {
      return true;
    }

    // Google News: extract "Title - SourceName" format
    const lastDashIndex = item.title.lastIndexOf(' - ');
    if (lastDashIndex === -1) return false;

    const sourceName = item.title.substring(lastDashIndex + 3).trim();
    return reliableSources.some(reliable =>
      sourceName.toLowerCase().includes(reliable.toLowerCase())
    );
  });
}

/**
 * Collects news from all sources in parallel, filters, and deduplicates.
 */
export async function collectAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled([
    fetchGoogleFinanceNews(),
    fetchInvestingComNews(),
    fetchCNBCNews(),
    fetchMarketWatchNews(),
  ]);

  const allNews = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value);

  const withoutAds = filterAdNews(allNews);
  const reliable = filterReliableNews(withoutAds);
  const deduplicated = deduplicateNews(reliable);

  console.log(
    `\n[RSS] Collected: ${allNews.length} total` +
    ` → after ad filter: ${withoutAds.length}` +
    ` → after source filter: ${reliable.length}` +
    ` → after deduplication: ${deduplicated.length}\n`
  );

  return deduplicated;
}

// Standalone test
if (require.main === module) {
  collectAllNews().then(news => {
    console.log('\n=== Collected News ===\n');
    news.forEach((item, idx) => {
      console.log(`${idx + 1}. [${item.source}] ${item.title}`);
      console.log(`   ${item.link}\n`);
    });
  }).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
