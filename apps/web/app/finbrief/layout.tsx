import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FinBrief | AI 재테크 브리핑',
  description: '30초 만에 읽는 AI 재테크 브리핑. 매일 아침 8시, 핵심 뉴스만 텔레그램으로 받아보세요.',
  openGraph: {
    title: 'FinBrief | AI 재테크 브리핑',
    description: '30초 만에 읽는 AI 재테크 브리핑. 매일 아침 8시, 핵심 뉴스만 텔레그램으로 받아보세요.',
    type: 'website',
  },
};

export default function FinBriefLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
