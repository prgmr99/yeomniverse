import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinBrief - 30초 AI 재테크 브리핑",
  description: "AI가 매일 아침 8시, 꼭 읽어야 할 재테크 뉴스 3가지를 골라드립니다. 텔레그램으로 받아보세요.",
  keywords: ["재테크", "뉴스", "AI", "자동화", "주식", "투자", "텔레그램"],
  authors: [{ name: "FinBrief" }],
  openGraph: {
    title: "FinBrief - 30초 AI 재테크 브리핑",
    description: "바쁜 당신을 위한 AI 뉴스 큐레이션",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinBrief",
    description: "30초 만에 읽는 AI 재테크 브리핑",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
