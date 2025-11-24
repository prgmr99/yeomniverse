import type { Metadata } from "next";
import "./globals.css";
import { serif, sans } from "./fonts";

export const metadata: Metadata = {
  title: "효도티어 | 부모님 탐구영역",
  description: "당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-stone-200 flex justify-center min-h-screen font-sans antialiased">
        {/* 모바일 뷰 컨테이너 
          - max-w-[480px]: 모바일 너비 제한
          - bg-paper: 갱지 배경색 (Tailwind v4 변수)
          - text-ink: 기본 텍스트 색상
        */}
        <div className="w-full max-w-[480px] min-h-screen bg-paper text-ink shadow-2xl relative overflow-x-hidden">
           {children}
        </div>
      </body>
    </html>
  );
}