import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Section,
	Text,
} from "@react-email/components";

interface WatchlistItem {
	symbol: string;
	name: string;
	price: number;
	changePercent: number;
	aiSignal?: "buy" | "hold" | "sell";
	aiSummary?: string;
	rsi?: number;
	macdSignal?: string;
}

interface NewsItem {
	title: string;
	summary: string;
	sentiment: "bull" | "bear" | "neutral";
	link?: string;
}

interface PersonalizedBriefingProps {
	date: string;
	planName: "free" | "basic" | "pro";
	watchlist?: WatchlistItem[];
	topNews: NewsItem[];
	keywords: string[];
	marketSentiment: string;
	unsubscribeToken: string;
	dashboardUrl: string;
}

export function PersonalizedBriefing({
	date,
	planName,
	watchlist,
	topNews,
	keywords,
	marketSentiment,
	unsubscribeToken,
	dashboardUrl,
}: PersonalizedBriefingProps) {
	const isPaid = planName !== "free";
	const isPro = planName === "pro";

	return (
		<Html>
			<Head />
			<Body style={styles.body}>
				<Container style={styles.container}>
					{/* Header */}
					<Section style={styles.header}>
						<Heading style={styles.title}>📊 FinBrief - 맞춤 브리핑</Heading>
						<Text style={styles.date}>{date}</Text>
					</Section>

					{/* Watchlist Section (Paid users only) */}
					{isPaid && watchlist && watchlist.length > 0 && (
						<Section style={styles.section}>
							<Heading as="h2" style={styles.sectionTitle}>
								🎯 내 관심종목
							</Heading>
							<Hr style={styles.hr} />
							{watchlist.map((stock, index) => (
								<Section key={index} style={styles.stockItem}>
									<Text style={styles.stockName}>
										{stock.name} {stock.price.toLocaleString()}원
										<span
											style={
												stock.changePercent >= 0
													? styles.positive
													: styles.negative
											}
										>
											{" "}
											({stock.changePercent >= 0 ? "+" : ""}
											{stock.changePercent.toFixed(1)}%)
										</span>
										{stock.changePercent >= 1
											? " 🐂"
											: stock.changePercent <= -1
												? " 🐻"
												: ""}
									</Text>
									{isPro && stock.rsi && (
										<Text style={styles.indicators}>
											RSI {stock.rsi.toFixed(0)} |{" "}
											{stock.macdSignal || "MACD 중립"}
										</Text>
									)}
									{stock.aiSummary && (
										<Text style={styles.aiSummary}>
											→ AI: "{stock.aiSummary}"
										</Text>
									)}
								</Section>
							))}
						</Section>
					)}

					{/* Main News Section */}
					<Section style={styles.section}>
						<Heading as="h2" style={styles.sectionTitle}>
							📰 오늘의 주요 뉴스
						</Heading>
						<Hr style={styles.hr} />
						{topNews.map((news, index) => (
							<Section key={index} style={styles.newsItem}>
								<Text style={styles.newsTitle}>
									{news.sentiment === "bull"
										? "🟢"
										: news.sentiment === "bear"
											? "🔴"
											: "⚪"}{" "}
									{news.title}
								</Text>
								<Text style={styles.newsSummary}>{news.summary}</Text>
							</Section>
						))}
					</Section>

					{/* Keywords */}
					<Section style={styles.section}>
						<Text style={styles.keywords}>
							<strong>키워드:</strong> {keywords.join(" · ")}
						</Text>
					</Section>

					{/* Market Sentiment */}
					<Section style={styles.section}>
						<Text style={styles.sentiment}>
							<strong>시장 분위기:</strong> {marketSentiment}
						</Text>
					</Section>

					{/* Footer */}
					<Hr style={styles.hr} />
					<Section style={styles.footer}>
						{isPaid && (
							<Link href={dashboardUrl} style={styles.link}>
								대시보드 바로가기
							</Link>
						)}
						<Text style={styles.footerText}>
							<Link
								href={`${dashboardUrl}/../api/unsubscribe?token=${unsubscribeToken}`}
								style={styles.unsubscribe}
							>
								구독 해지
							</Link>
							{" | "}
							<Link href={`${dashboardUrl}/../pricing`} style={styles.link}>
								요금제 관리
							</Link>
						</Text>
						<Text style={styles.copyright}>
							© 2026 FinBrief. All rights reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

const styles = {
	body: {
		backgroundColor: "#1e293b",
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		margin: 0,
		padding: "20px",
	},
	container: {
		backgroundColor: "#0f172a",
		borderRadius: "12px",
		padding: "32px",
		maxWidth: "600px",
		margin: "0 auto",
	},
	header: {
		textAlign: "center" as const,
		marginBottom: "24px",
	},
	title: {
		color: "#f8fafc",
		fontSize: "24px",
		fontWeight: "bold",
		margin: "0 0 8px 0",
	},
	date: {
		color: "#94a3b8",
		fontSize: "14px",
		margin: 0,
	},
	section: {
		marginBottom: "24px",
	},
	sectionTitle: {
		color: "#10b981",
		fontSize: "18px",
		fontWeight: "600",
		margin: "0 0 12px 0",
	},
	hr: {
		borderColor: "#334155",
		margin: "16px 0",
	},
	stockItem: {
		backgroundColor: "#1e293b",
		borderRadius: "8px",
		padding: "12px",
		marginBottom: "8px",
	},
	stockName: {
		color: "#f8fafc",
		fontSize: "16px",
		fontWeight: "500",
		margin: "0 0 4px 0",
	},
	positive: {
		color: "#10b981",
	},
	negative: {
		color: "#ef4444",
	},
	indicators: {
		color: "#94a3b8",
		fontSize: "13px",
		margin: "4px 0",
	},
	aiSummary: {
		color: "#a78bfa",
		fontSize: "14px",
		fontStyle: "italic",
		margin: "4px 0 0 0",
	},
	newsItem: {
		marginBottom: "16px",
	},
	newsTitle: {
		color: "#f8fafc",
		fontSize: "15px",
		fontWeight: "500",
		margin: "0 0 4px 0",
	},
	newsSummary: {
		color: "#cbd5e1",
		fontSize: "14px",
		lineHeight: "1.5",
		margin: 0,
	},
	keywords: {
		color: "#94a3b8",
		fontSize: "14px",
		margin: 0,
	},
	sentiment: {
		color: "#f8fafc",
		fontSize: "15px",
		margin: 0,
	},
	footer: {
		textAlign: "center" as const,
		marginTop: "24px",
	},
	footerText: {
		color: "#64748b",
		fontSize: "13px",
		margin: "12px 0",
	},
	link: {
		color: "#10b981",
		textDecoration: "none",
	},
	unsubscribe: {
		color: "#64748b",
		textDecoration: "underline",
	},
	copyright: {
		color: "#475569",
		fontSize: "12px",
		margin: "16px 0 0 0",
	},
};

export default PersonalizedBriefing;
