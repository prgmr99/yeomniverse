import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult, NewsItem, ScoredNewsItem } from "../types/news.types";
import { DEFAULT_ARTICLE_COUNT } from "../config/briefing-config";

// Gemini API init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Analyzes news items using Gemini AI.
 * Accepts both plain NewsItem[] and ScoredNewsItem[] (backward-compatible).
 *
 * @param newsItems News items to analyze (optionally scored)
 * @param topNewsCount Number of top articles to select
 */
export async function analyzeNews(
	newsItems: NewsItem[],
	topNewsCount: number = DEFAULT_ARTICLE_COUNT,
): Promise<AnalysisResult> {
	try {
		console.log(`[AI] Starting analysis (selecting top ${topNewsCount})...`);

		if (!process.env.GEMINI_API_KEY) {
			throw new Error(
				"GEMINI_API_KEY is not set. Please check your .env file.",
			);
		}

		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
		const prompt = generateAnalysisPrompt(newsItems, topNewsCount);
		const result = await model.generateContent(prompt);
		const response = result.response.text();

		console.log("[AI] Response received");

		const analysisResult = parseAIResponse(response);

		console.log(
			`[AI] Analysis complete: ${analysisResult.topNews.length} top news items selected`,
		);

		return analysisResult;
	} catch (error) {
		console.error("[AI] Analysis failed:", error);
		throw error;
	}
}

/**
 * Generates the analysis prompt. If items have importanceScore (ScoredNewsItem),
 * includes source and score context for the AI.
 */
function generateAnalysisPrompt(newsItems: NewsItem[], topNewsCount: number): string {
	const hasScores = newsItems.length > 0 && 'importanceScore' in newsItems[0];

	const newsList = newsItems
		.map((item, idx) => {
			if (hasScores) {
				const scored = item as ScoredNewsItem;
				return `${idx + 1}. [${scored.source || 'Unknown'} | Score: ${scored.importanceScore}] ${scored.title}`;
			}
			return `${idx + 1}. ${item.title}`;
		})
		.join("\n");

	const scoreContext = hasScores
		? `
**Importance Scores:**
Each article has a pre-computed importance score (0-100) based on source credibility, cross-source corroboration, recency, and content depth. Use these as advisory input -- a high score suggests broad coverage and reliable sourcing, but your editorial judgment on materiality takes precedence.
`
		: '';

	return `
You are a senior market strategist with three decades on Wall Street. You have managed institutional portfolios through multiple market cycles. You write the way Warren Buffett writes shareholder letters: every word earns its place, conviction is expressed through clarity rather than superlatives, and you never waste your reader's time.

Your reader is a professional investor who needs the signal, not the noise.

**Task:**
From the news list below, select the ${topNewsCount} items with the greatest potential to move capital allocation decisions in the next 1-4 weeks. Analyze each one. Rank them in descending order of materiality -- the first item should be the most important.
${scoreContext}
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
- Write in the same language as the majority of the source articles. If most sources are Korean, write in Korean. If most sources are English, write in English. Do NOT force translation — accuracy in the source language is more valuable than a poor translation.
- topNews MUST contain exactly ${topNewsCount} items, ranked by materiality (most important first)
- summary must be exactly 3 sentences
- sentiment must be one of "bull", "bear", or "neutral"
- keywords: the 3 most investable themes of the day (include #)
- Write with authority. No "could potentially", no "it remains to be seen", no "investors should keep an eye on". State your view.
- Do NOT include the [Source | Score: N] prefix in your output titles or any output field. These annotations are input metadata only.
- Output ONLY valid JSON
`;
}

/**
 * Parses AI response to AnalysisResult.
 */
function parseAIResponse(response: string): AnalysisResult {
	try {
		let jsonText = response.trim();

		const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
		if (jsonMatch) {
			jsonText = jsonMatch[1];
		} else {
			const bracketMatch = jsonText.match(/{[\s\S]*}/);
			if (bracketMatch) {
				jsonText = bracketMatch[0];
			}
		}

		const parsed = JSON.parse(jsonText);

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
 * Formats analysis result for console output.
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

// Standalone test
if (require.main === module) {
	const dummyNews: NewsItem[] = [
		{
			title: "BOK holds rates steady amid global uncertainty",
			link: "https://example.com/1",
			pubDate: new Date().toISOString(),
			source: "Test",
		},
		{
			title: "Samsung semiconductor exports rise sharply",
			link: "https://example.com/2",
			pubDate: new Date().toISOString(),
			source: "Test",
		},
		{
			title: "Bitcoin surges past 50M KRW milestone",
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
