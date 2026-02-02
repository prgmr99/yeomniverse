import Parser from 'rss-parser';
import { NewsItem } from '../types/news.types';

/**
 * RSS 뉴스 수집기
 * 구글 뉴스, 네이버 증권 등에서 재테크 관련 뉴스를 수집합니다.
 */

const parser = new Parser();

/**
 * 구글 뉴스 금융 섹션에서 뉴스 수집
 */
export async function fetchGoogleFinanceNews(): Promise<NewsItem[]> {
  try {
    console.log('📰 구글 뉴스 수집 시작...');
    
    // 구글 뉴스 RSS: 재테크 관련 최근 1일 뉴스
    // URL 인코딩 처리
    const searchQuery = encodeURIComponent('재테크 OR 주식 OR 투자 when:1d');
    const rssUrl = `https://news.google.com/rss/search?q=${searchQuery}&hl=ko&gl=KR&ceid=KR:ko`;
    
    const feed = await parser.parseURL(rssUrl);
    
    const newsItems: NewsItem[] = feed.items.slice(0, 20).map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: item.contentSnippet || item.content,
      source: 'Google News'
    }));
    
    console.log(`✅ ${newsItems.length}개의 뉴스를 수집했습니다.`);
    return newsItems;
    
  } catch (error) {
    console.error('❌ 구글 뉴스 수집 실패:', error);
    throw error;
  }
}

/**
 * 네이버 증권 뉴스 수집 (현재 비활성화)
 * 네이버에서 RSS 서비스를 종료하여 비활성화됨
 */
export async function fetchNaverStockNews(): Promise<NewsItem[]> {
  // 네이버 증권 RSS가 더 이상 작동하지 않음 (HTML 페이지 반환)
  // 구글 뉴스가 이미 한국 금융 뉴스를 충분히 제공함
  console.log('📰 네이버 증권 뉴스: RSS 서비스 종료로 건너뜀');
  return [];
}

/**
 * 블로그 도메인 필터링
 * 개인 블로그 URL을 제거합니다.
 */
export function filterBlogNews(newsItems: NewsItem[]): NewsItem[] {
  const blogDomains = [
    'tistory.com',
    'blog.naver.com',
    'post.naver.com',
    'velog.io',
    'brunch.co.kr',
    'medium.com',
    'notion.site',
    'github.io',
    'wordpress.com',
    'blogspot.com',
    'daum.net/blog',
    'egloos.com'
  ];

  return newsItems.filter(item => {
    const hasBlogDomain = blogDomains.some(domain =>
      item.link.includes(domain)
    );
    return !hasBlogDomain;
  });
}

/**
 * 광고성 기사 필터링
 * 특정 키워드가 포함된 기사를 제거합니다.
 */
export function filterAdNews(newsItems: NewsItem[]): NewsItem[] {
  const adKeywords = [
    '이벤트',
    '할인',
    '쿠폰',
    '광고',
    '[PR]',
    '협찬',
    '제공:'
  ];

  return newsItems.filter(item => {
    const hasAdKeyword = adKeywords.some(keyword =>
      item.title.includes(keyword)
    );
    return !hasAdKeyword;
  });
}

/**
 * 신뢰할 수 있는 언론사 필터링
 * 구글 뉴스 RSS의 타이틀에서 출처명을 추출하여 필터링합니다.
 * 타이틀 형식: "뉴스 제목 - 출처명"
 */
export function filterReliableNews(newsItems: NewsItem[]): NewsItem[] {
  const reliableSources = [
    '한국경제', '한경',
    '매일경제', '매경',
    '조선비즈', '조선일보',
    '연합뉴스', '연합',
    '뉴스1',
    '이데일리',
    '머니투데이',
    '서울경제',
    '아시아경제',
    '파이낸셜뉴스',
    '뉴시스',
    'SBS', 'SBSCNBC',
    'MBC',
    'KBS',
    'JTBC',
    'YTN',
    '한국경제TV', '한경TV', '와우TV',
    'Bloomberg',
    'Reuters',
    '문화일보',
    '중앙일보',
    '동아일보',
    '헤럴드경제'
  ];

  return newsItems.filter(item => {
    // 타이틀에서 마지막 " - " 이후의 출처명 추출
    const lastDashIndex = item.title.lastIndexOf(' - ');
    if (lastDashIndex === -1) {
      return false; // 출처명이 없으면 제외
    }

    const sourceName = item.title.substring(lastDashIndex + 3).trim();

    // 신뢰할 수 있는 출처명에 포함되는지 확인 (대소문자 구분 없이)
    return reliableSources.some(reliable =>
      sourceName.toLowerCase().includes(reliable.toLowerCase())
    );
  });
}

/**
 * 모든 소스에서 뉴스 수집 (통합)
 */
export async function collectAllNews(): Promise<NewsItem[]> {
  const [googleNews] = await Promise.all([
    fetchGoogleFinanceNews(),
    // 추후 다른 소스 추가 가능
  ]);

  const allNews = [...googleNews];
  const withoutAds = filterAdNews(allNews);
  const reliableNews = filterReliableNews(withoutAds);

  console.log(`\n📊 총 ${allNews.length}개 수집 → 광고 필터: ${withoutAds.length}개 → 신뢰 언론사 필터: ${reliableNews.length}개\n`);

  return reliableNews;
}

// 테스트 실행 (이 파일을 직접 실행할 때)
if (require.main === module) {
  fetchGoogleFinanceNews().then(news => {
    console.log('\n=== 수집된 뉴스 목록 ===\n');
    news.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.title}`);
      console.log(`   🔗 링크: ${item.link}`);
      console.log(`   🕒 시간: ${item.pubDate}`);
      console.log(`   📌 출처: ${item.source}\n`);
    });
  }).catch(error => {
    console.error('실행 중 에러:', error);
    process.exit(1);
  });
}
