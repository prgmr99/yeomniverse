import type * as React from "react";

interface WelcomeEmailProps {
	unsubscribeToken: string;
}

export function WelcomeEmail({
	unsubscribeToken,
}: WelcomeEmailProps): React.ReactElement {
	const baseUrl =
		process.env.NEXT_PUBLIC_DOMAIN_URL || "https://yeomniverse.com";
	const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`;
	const telegramUrl = "https://t.me/finbrief_news_bot";

	return (
		<html lang="ko">
			{/* biome-ignore lint/style/noHeadElement: Email template requires raw HTML head element */}
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body
				style={{
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
					backgroundColor: "#f5f5f7",
					margin: 0,
					padding: "40px 20px",
				}}
			>
				<div
					style={{
						maxWidth: "580px",
						margin: "0 auto",
						backgroundColor: "#ffffff",
						borderRadius: "16px",
						overflow: "hidden",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
					}}
				>
					{/* Header */}
					<div
						style={{
							background: "linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)",
							padding: "40px 30px",
							textAlign: "center" as const,
						}}
					>
						<h1
							style={{
								color: "#ffffff",
								fontSize: "28px",
								fontWeight: 700,
								margin: 0,
							}}
						>
							FinBrief
						</h1>
						<p
							style={{
								color: "rgba(255,255,255,0.9)",
								fontSize: "16px",
								margin: "8px 0 0",
							}}
						>
							30초 만에 읽는 AI 재테크 브리핑
						</p>
					</div>

					{/* Content */}
					<div style={{ padding: "40px 30px" }}>
						<h2
							style={{
								color: "#1D1D1F",
								fontSize: "24px",
								fontWeight: 600,
								margin: "0 0 16px",
							}}
						>
							환영합니다!
						</h2>
						<p
							style={{
								color: "#6E6E73",
								fontSize: "16px",
								lineHeight: 1.6,
								margin: "0 0 24px",
							}}
						>
							FinBrief 뉴스레터 구독을 신청해 주셔서 감사합니다.
							<br />
							<br />
							매일 아침 8시, AI가 엄선한 재테크 뉴스 3가지를 받아보실 수
							있습니다.
						</p>

						{/* Features */}
						<div
							style={{
								backgroundColor: "#f5f5f7",
								borderRadius: "12px",
								padding: "24px",
								marginBottom: "24px",
							}}
						>
							<p
								style={{
									color: "#1D1D1F",
									fontSize: "16px",
									fontWeight: 600,
									margin: "0 0 12px",
								}}
							>
								FinBrief와 함께라면:
							</p>
							<ul
								style={{
									color: "#6E6E73",
									fontSize: "15px",
									lineHeight: 1.8,
									margin: 0,
									paddingLeft: "20px",
								}}
							>
								<li>30초 만에 오늘의 시장 흐름 파악</li>
								<li>AI가 분석한 호재/악재 한눈에 확인</li>
								<li>불필요한 정보 없이 핵심만 전달</li>
							</ul>
						</div>

						{/* Telegram CTA */}
						<p
							style={{
								color: "#6E6E73",
								fontSize: "15px",
								lineHeight: 1.6,
								margin: "0 0 16px",
							}}
						>
							더 빠른 알림을 원하시면 텔레그램 봇도 이용해보세요:
						</p>
						<a
							href={telegramUrl}
							style={{
								display: "inline-block",
								backgroundColor: "#0077B6",
								color: "#ffffff",
								textDecoration: "none",
								padding: "14px 28px",
								borderRadius: "8px",
								fontSize: "16px",
								fontWeight: 600,
							}}
						>
							텔레그램 봇 시작하기
						</a>
					</div>

					{/* Footer */}
					<div
						style={{
							borderTop: "1px solid #E8E8ED",
							padding: "24px 30px",
							textAlign: "center" as const,
						}}
					>
						<p
							style={{ color: "#86868B", fontSize: "13px", margin: "0 0 8px" }}
						>
							이 이메일은 FinBrief 구독 신청에 의해 발송되었습니다.
						</p>
						<a
							href={unsubscribeUrl}
							style={{
								color: "#86868B",
								fontSize: "13px",
								textDecoration: "underline",
							}}
						>
							구독 취소
						</a>
					</div>
				</div>
			</body>
		</html>
	);
}

export default WelcomeEmail;
