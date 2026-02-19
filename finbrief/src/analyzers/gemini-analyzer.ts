import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult, NewsItem } from "../types/news.types";

/**
 * AI 뉴스 분석기 (Google Gemini)
 * 수집된 뉴스를 분석하여 핵심 인사이트를 추출합니다.
 */

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * 뉴스 목록을 AI로 분석
 *
 * @param newsItems 분석할 뉴스 아이템 배열
 * @returns 분석 결과 (상위 3개 뉴스, 키워드, 시장 분위기)
 */
export async function analyzeNews(
	newsItems: NewsItem[],
): Promise<AnalysisResult> {
	try {
		console.log("🤖 Starting AI analysis...");

		if (!process.env.GEMINI_API_KEY) {
			throw new Error(
				"GEMINI_API_KEY is not set. Please check your .env file.",
			);
		}

		// Gemini 2.5 Flash 모델 사용 (무료 티어, 빠르고 정확)
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		// 프롬프트 생성
		const prompt = generateAnalysisPrompt(newsItems);

		// AI 분석 요청
		const result = await model.generateContent(prompt);
		const response = result.response.text();

		console.log("📝 AI response received");

		// JSON 파싱 (마크다운 코드 블록 제거)
		const analysisResult = parseAIResponse(response);

		console.log(
			`✅ Analysis complete: ${analysisResult.topNews.length} top news items selected`,
		);

		return analysisResult;
	} catch (error) {
		console.error("❌ AI analysis failed:", error);
		throw error;
	}
}

/**
 * AI 분석용 프롬프트 생성
 */
function generateAnalysisPrompt(newsItems: NewsItem[]): string {
	const newsList = newsItems
		.map((item, idx) => `${idx + 1}. ${item.title}`)
		.join("\n");

	return `
You are a senior market strategist with three decades on Wall Street. You have managed institutional portfolios through multiple market cycles. You write the way Warren Buffett writes shareholder letters: every word earns its place, conviction is expressed through clarity rather than superlatives, and you never waste your reader's time.

Your reader is a professional investor who needs the signal, not the noise.

**Task:**
From the news list below, select the 3 items with the greatest potential to move capital allocation decisions in the next 1-4 weeks. Analyze each one.

**News List:**
${newsList}

**Selection Criteria:**
1. Materiality -- would a portfolio manager adjust positions based on this?
2. Timeliness -- is this actionable now, not stale?
3. Signal quality -- exclude promotional content, rumors without sources, and repackaged press releases

**Output Format:**
Respond ONLY with the JSON below. No preamble, no commentary.

{
  "topNews": [
    {
      "title": "Concise, factual headline (rewrite if the original is clickbait)",
      "summary": "Three sentences. First sentence: what happened. Second sentence: the mechanism or context that makes it significant. Third sentence: the likely second-order effect. No filler words. No hedging unless genuinely uncertain.",
      "sentiment": "bull | bear | neutral",
      "reason": "One sentence: the specific investment implication. Be precise -- name the asset class, sector, or instrument affected."
    }
  ],
  "keywords": ["#keyword1", "#keyword2", "#keyword3"],
  "marketSentiment": "One sentence capturing the dominant market regime today. State it like a Bloomberg terminal headline -- terse, factual, no adjectives that don't add information."
}

**Rules:**
- All text fields MUST be in English
- summary must be exactly 3 sentences
- sentiment must be one of "bull", "bear", or "neutral"
- keywords: the 3 most investable themes of the day (include #)
- Write with authority. No "could potentially", no "it remains to be seen", no "investors should keep an eye on". State your view.
- Output ONLY valid JSON
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
			throw new Error("topNews is not an array.");
		}

		if (!parsed.keywords || !Array.isArray(parsed.keywords)) {
			throw new Error("keywords is not an array.");
		}

		return parsed as AnalysisResult;
	} catch (error) {
		console.error("AI response parsing failed:", error);
		console.error("Original response:", response);

		// 파싱 실패 시 기본값 반환
		return {
			topNews: [
				{
					title: "Analysis Error",
					summary:
						"An error occurred during AI analysis. Please try again later.",
					sentiment: "neutral",
					reason: "System error",
				},
			],
			keywords: ["#finance", "#investing", "#news"],
			marketSentiment: "Unable to retrieve analysis results.",
		};
	}
}

/**
 * 분석 결과를 사람이 읽기 좋은 형태로 포맷팅
 */
export function formatAnalysisResult(analysis: AnalysisResult): string {
  let output = '\n=== FinBrief Analysis Results ===\n\n';

  analysis.topNews.forEach((news, idx) => {
    const tag = news.sentiment === 'bull' ? 'BULLISH'
      : news.sentiment === 'bear' ? 'BEARISH'
      : 'NEUTRAL';
    output += `${idx + 1}. ${news.title} [${tag}]\n`;
    output += `   Summary: ${news.summary}\n`;
    output += `   Significance: ${news.reason}\n\n`;
  });

  output += `Key Themes: ${analysis.keywords.join(' | ')}\n`;
  output += `Market Outlook: ${analysis.marketSentiment}\n`;

  return output;
}

// 테스트 실행 (이 파일을 직접 실행할 때)
if (require.main === module) {
	// 테스트용 더미 데이터
	const dummyNews: NewsItem[] = [
		{
			title: "한국은행, 기준금리 동결 결정",
			link: "https://example.com/1",
			pubDate: new Date().toISOString(),
			source: "Test",
		},
		{
			title: "삼성전자, 반도체 수출 증가세",
			link: "https://example.com/2",
			pubDate: new Date().toISOString(),
			source: "Test",
		},
		{
			title: "비트코인 가격 급등, 5천만원 돌파",
			link: "https://example.com/3",
			pubDate: new Date().toISOString(),
			source: "Test",
		},
	];

	analyzeNews(dummyNews)
		.then((result) => {
			console.log(formatAnalysisResult(result));
		})
		.catch((error) => {
			console.error("Test failed:", error);
			process.exit(1);
		});
}
