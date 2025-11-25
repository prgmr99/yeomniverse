import type { Metadata } from 'next';
import './globals.css';
import KakaoScript from '@/components/KakaoScript';
import { sans, serif } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://hyo-tier.vercel.app'),
  title: {
    default: '효도티어 | 부모님 탐구영역',
    template: '%s | 효도티어',
  },
  description:
    '당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험. 지금 바로 응시하고 효도 등급을 확인하세요!',
  keywords: [
    '효도티어',
    '부모님 탐구영역',
    '효도 테스트',
    '심리테스트',
    'MZ세대',
    '부모님 퀴즈',
  ],
  icons: {
    icon: '/icon.svg',
  },
  authors: [{ name: 'Hyo-Tier Committee' }],
  creator: 'Hyo-Tier Committee',
  publisher: 'Hyo-Tier Committee',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: '효도티어 | 부모님 탐구영역',
    description:
      '당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험',
    url: 'https://hyo-tier.vercel.app',
    siteName: '효도티어',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '효도티어 부모님 탐구영역 시험지 표지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '효도티어 | 부모님 탐구영역',
    description:
      '당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://hyo-tier.vercel.app',
  },
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

        <KakaoScript />
      </body>
    </html>
  );
}
