import type { Metadata } from 'next';

const PARENT_DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyodo-tier.yeomniverse.com';

export const metadata: Metadata = {
  title: '제2교시 자녀 탐구영역 · 부모님 퀴즈',
  description:
    '부모님이 직접 푸는 부모님 퀴즈 14문항. 자식에 대해 얼마나 알고 계신지 확인하고, 결과 공유로 부모님 자서전 인터뷰의 시작점을 만들어보세요.',
  keywords: [
    '부모님 퀴즈',
    '부모님 탐구영역',
    '자녀 탐구영역',
    '부모님 자서전',
    '부모님 자서전 만들기',
    '부모님 인터뷰 질문',
    '효도티어 부모편',
    '부모님 심리테스트',
  ],
  openGraph: {
    title: '제2교시 자녀 탐구영역 | 부모님 퀴즈 · 효도티어',
    description:
      '부모님이 직접 푸는 부모님 퀴즈 14문항. 자식에 대해 얼마나 알고 계신지 확인하고, 부모님 자서전을 시작할 인터뷰 질문지를 받아보세요.',
    url: `${PARENT_DOMAIN}/parent`,
    siteName: '효도티어',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '효도티어 자녀 탐구영역 - 부모님 퀴즈',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '제2교시 자녀 탐구영역 | 부모님 퀴즈 · 효도티어',
    description:
      '부모님이 직접 푸는 부모님 퀴즈 14문항. 부모님 자서전 인터뷰의 시작점을 만들어보세요.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: `${PARENT_DOMAIN}/parent`,
  },
};

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
