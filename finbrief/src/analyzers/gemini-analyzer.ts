import { GoogleGenerativeAI } from '@google/generative-ai';
import { NewsItem, AnalysisResult } from '../types/news.types';

/**
 * AI 뉴스 분석기 (Google Gemini)
 * 수집된 뉴스를 분석하여 핵심 인사이트를 추출합니다.
 */

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 뉴스 목록을 AI로 분석
 * 
 * @param newsItems 분석할 뉴스 아이템 배열
 * @returns 분석 결과 (상위 3개 뉴스, 키워드, 시장 분위기)
 */
export async function analyzeNews(newsItems: NewsItem[]): Promise<AnalysisResult> {
  try {
    console.log('🤖 AI 분석 시작...');
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    }
    
    // Gemini 2.5 Flash 모델 사용 (무료 티어, 빠르고 정확)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // 프롬프트 생성
    const prompt = generateAnalysisPrompt(newsItems);
    
    // AI 분석 요청
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('📝 AI 응답 받음');
    
    // JSON 파싱 (마크다운 코드 블록 제거)
    const analysisResult = parseAIResponse(response);
    
    console.log(`✅ 분석 완료: ${analysisResult.topNews.length}개 주요 뉴스 선정`);
    
    return analysisResult;
    
  } catch (error) {
    console.error('❌ AI 분석 실패:', error);
    throw error;
  }
}

/**
 * AI 분석용 프롬프트 생성
 */
function generateAnalysisPrompt(newsItems: NewsItem[]): string {
  const newsList = newsItems
    .map((item, idx) => `${idx + 1}. ${item.title}`)
    .join('\n');
  
  return `
You are a fund manager with 20 years of experience and a financial expert.
Your reader is a busy professional who needs to grasp the key points in 30 seconds.

**Mission:**
From the following news list, select only the **3 most important** items and analyze each one.

**News List:**
${newsList}

**Selection Criteria:**
1. Prioritize news that could influence investment decisions
2. Focus on timely, high-impact news
3. Exclude promotional or advertorial content

**Output Format:**
You MUST respond ONLY in the JSON format below. Do not include any other text.

{
  "topNews": [
    {
      "title": "Selected news headline",
      "summary": "A 3-sentence summary that anyone can understand (one sentence per line, 3 sentences total)",
      "sentiment": "one of: bull, bear, or neutral",
      "reason": "One sentence explaining why this news matters"
    }
  ],
  "keywords": ["#keyword1", "#keyword2", "#keyword3"],
  "marketSentiment": "A one-line summary of the overall market mood"
}

**Rules:**
- summary must be exactly 3 sentences
- sentiment must be one of "bull" (bullish factor), "bear" (bearish factor), or "neutral"
- keywords should be the 3 key investment keywords of the day (include #)
- Output ONLY JSON, no additional explanation
`;
}

/**
 * AI 응답을 파싱하여 AnalysisResult 객체로 변환
 */
function parseAIResponse(response: string): AnalysisResult {
  try {
    // JSON 코드 블록 제거 (```json ... ``` 형태)
    let jsonText = response.trim();
    
    const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // 코드 블록이 없으면 중괄호 사이 내용 추출
      const bracketMatch = jsonText.match(/{[\s\S]*}/);
      if (bracketMatch) {
        jsonText = bracketMatch[0];
      }
    }
    
    const parsed = JSON.parse(jsonText);
    
    // 유효성 검증
    if (!parsed.topNews || !Array.isArray(parsed.topNews)) {
      throw new Error('topNews가 배열이 아닙니다.');
    }
    
    if (!parsed.keywords || !Array.isArray(parsed.keywords)) {
      throw new Error('keywords가 배열이 아닙니다.');
    }
    
    return parsed as AnalysisResult;
    
  } catch (error) {
    console.error('AI 응답 파싱 실패:', error);
    console.error('원본 응답:', response);
    
    // 파싱 실패 시 기본값 반환
    return {
      topNews: [
        {
          title: 'Analysis Error',
          summary: 'An error occurred during AI analysis. Please try again later.',
          sentiment: 'neutral',
          reason: 'System error'
        }
      ],
      keywords: ['#finance', '#investing', '#news'],
      marketSentiment: 'Unable to retrieve analysis results.'
    };
  }
}

/**
 * 분석 결과를 사람이 읽기 좋은 형태로 포맷팅
 */
export function formatAnalysisResult(analysis: AnalysisResult): string {
  let output = '\n=== AI Analysis Results ===\n\n';

  analysis.topNews.forEach((news, idx) => {
    const emoji = news.sentiment === 'bull' ? '🐂' : news.sentiment === 'bear' ? '🐻' : '😐';
    output += `${idx + 1}. ${news.title} ${emoji}\n`;
    output += `   Summary: ${news.summary}\n`;
    output += `   💡 Why it matters: ${news.reason}\n\n`;
  });

  output += `🔑 Today's Keywords: ${analysis.keywords.join(' ')}\n`;
  output += `📈 Market Sentiment: ${analysis.marketSentiment}\n`;
  
  return output;
}

// 테스트 실행 (이 파일을 직접 실행할 때)
if (require.main === module) {
  // 테스트용 더미 데이터
  const dummyNews: NewsItem[] = [
    {
      title: '한국은행, 기준금리 동결 결정',
      link: 'https://example.com/1',
      pubDate: new Date().toISOString(),
      source: 'Test'
    },
    {
      title: '삼성전자, 반도체 수출 증가세',
      link: 'https://example.com/2',
      pubDate: new Date().toISOString(),
      source: 'Test'
    },
    {
      title: '비트코인 가격 급등, 5천만원 돌파',
      link: 'https://example.com/3',
      pubDate: new Date().toISOString(),
      source: 'Test'
    }
  ];
  
  analyzeNews(dummyNews).then(result => {
    console.log(formatAnalysisResult(result));
  }).catch(error => {
    console.error('테스트 실패:', error);
    process.exit(1);
  });
}
