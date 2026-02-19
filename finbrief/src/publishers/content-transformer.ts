import { MetaGenerator } from "../seo/meta-generator";
import { SchemaGenerator } from "../seo/schema-generator";
import type { BlogPost } from "./types";

interface TransformOptions {
	addFooter?: boolean;
	addHeader?: boolean;
	telegramLink?: string;
	siteUrl?: string;
}

export class ContentTransformer {
	private metaGenerator: MetaGenerator;
	private schemaGenerator: SchemaGenerator;

	constructor(siteUrl: string = "https://finbrief.yeomniverse.com") {
		this.metaGenerator = new MetaGenerator(siteUrl);
		this.schemaGenerator = new SchemaGenerator(siteUrl);
	}

	/**
	 * Generate blog title from briefing content
	 */
	generateTitle(date: Date = new Date()): string {
		const dateStr = date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		return `오늘의 금융 브리핑 - ${dateStr}`;
	}

	/**
	 * Extract summary from briefing for meta description
	 */
	extractSummary(briefing: string): string {
		// Remove emojis
		const text = briefing.replace(
			/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
			"",
		);

		// Get first paragraph or first 200 characters
		const lines = text.split("\n").filter((line) => line.trim().length > 0);
		const firstLine = lines[0] || "";

		if (firstLine.length > 150) {
			return `${firstLine.substring(0, 147)}...`;
		}

		return firstLine;
	}

	/**
	 * Convert Telegram briefing to blog HTML
	 */
	telegramToBlog(briefing: string, options: TransformOptions = {}): string {
		const {
			addFooter = true,
			addHeader = true,
			telegramLink = "https://t.me/finbrief_bot",
			siteUrl: _siteUrl = "https://finbrief.io",
		} = options;

		let html = "";

		// Add header
		if (addHeader) {
			const date = new Date();
			const dateStr = date.toLocaleDateString("ko-KR", {
				year: "numeric",
				month: "long",
				day: "numeric",
				weekday: "long",
			});

			html += `
<header>
  <p class="date">${dateStr}</p>
</header>
`;
		}

		// Process main content
		const sections = briefing.split("\n\n");

		for (const section of sections) {
			if (!section.trim()) continue;

			const lines = section.split("\n");

			for (const line of lines) {
				const trimmed = line.trim();

				if (!trimmed) continue;

				// Convert headings (lines starting with emojis or all caps)
				if (
					trimmed.match(/^(?:[📈📉💰🌏₿🏠📰]|⚡️)/u) ||
					trimmed === trimmed.toUpperCase()
				) {
					// Remove emoji and create heading
					const text = trimmed
						.replace(
							/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
							"",
						)
						.trim();
					html += `<h2>${this.escapeHtml(text)}</h2>\n`;
				}
				// Convert bullet points
				else if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
					const text = trimmed.substring(1).trim();
					html += `<li>${this.escapeHtml(text)}</li>\n`;
				}
				// Regular paragraph
				else {
					html += `<p>${this.escapeHtml(trimmed)}</p>\n`;
				}
			}
		}

		// Wrap lists
		html = html.replace(/(<li>.*?<\/li>\n)+/gs, (match) => {
			return `<ul>\n${match}</ul>\n`;
		});

		// Add footer
		if (addFooter) {
			html += `
<footer>
  <hr />
  <p><strong>📱 매일 아침 텔레그램으로 받아보세요</strong></p>
  <p>👉 <a href="${telegramLink}" target="_blank" rel="noopener">${telegramLink}</a></p>
  <p><em>※ 본 자료는 투자 권유가 아닙니다. 투자에 대한 최종 결정은 본인의 판단과 책임하에 하시기 바랍니다.</em></p>
</footer>
`;
		}

		return html;
	}

	/**
	 * Create complete blog post from Telegram briefing
	 */
	createBlogPost(
		briefing: string,
		options: {
			visibility?: "public" | "private";
			thumbnail?: string;
			category?: string;
		} = {},
	): BlogPost {
		const title = this.generateTitle();
		const content = this.telegramToBlog(briefing);
		const _summary = this.extractSummary(briefing);

		// Extract tags from content
		const tags = this.extractTags(briefing);

		return {
			title,
			content,
			tags,
			category: options.category || "금융",
			visibility: options.visibility || "public",
			thumbnail: options.thumbnail,
			publishedAt: new Date(),
		};
	}

	/**
	 * Extract tags from content
	 */
	private extractTags(content: string): string[] {
		const tags: string[] = ["금융브리핑", "경제뉴스"];

		const keywords = [
			{ keyword: "코스피", tag: "주식" },
			{ keyword: "코스닥", tag: "주식" },
			{ keyword: "나스닥", tag: "미국증시" },
			{ keyword: "다우", tag: "미국증시" },
			{ keyword: "달러", tag: "환율" },
			{ keyword: "엔화", tag: "환율" },
			{ keyword: "비트코인", tag: "암호화폐" },
			{ keyword: "이더리움", tag: "암호화폐" },
			{ keyword: "부동산", tag: "부동산" },
			{ keyword: "금리", tag: "금리" },
		];

		for (const { keyword, tag } of keywords) {
			if (content.includes(keyword) && !tags.includes(tag)) {
				tags.push(tag);
			}
		}

		return tags;
	}

	/**
	 * Escape HTML special characters
	 */
	private escapeHtml(text: string): string {
		const map: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#039;",
		};

		return text.replace(/[&<>"']/g, (char) => map[char]);
	}

	/**
	 * Generate complete HTML with SEO meta tags
	 */
	generateCompleteHtml(post: BlogPost, postUrl: string): string {
		const metaTags = this.metaGenerator.generateMetaTags(post, postUrl);
		const articleSchema = this.schemaGenerator.generateArticleSchema(
			post.title,
			metaTags.description,
			post.thumbnail || "",
			post.publishedAt || new Date(),
		);

		return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
  
  ${this.metaGenerator.toHtmlString(metaTags)}
  ${this.schemaGenerator.toScriptTag(articleSchema)}
</head>
<body>
  <article>
    ${post.content}
  </article>
</body>
</html>`;
	}
}
