import type { Metadata } from 'next';
import { RESULTS } from './resultData';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyodo-tier.yeomniverse.com';

const BASE: Metadata = {
  title: '나의 효도 등급 결과',
  description:
    '2026학년도 대국민 효도능력시험 결과를 확인하세요. 당신의 효도 등급과 상세한 분석 결과를 제공합니다.',
  alternates: { canonical: `${DOMAIN}/result` },
};

/**
 * 결과 유형별 메타데이터.
 *
 * 이전에는 layout.tsx의 generateMetadata에서 searchParams를 읽으려 했지만
 * 레이아웃은 searchParams를 받지 않는다. 그래서 공유된 링크가 전부 기본
 * 메타데이터로 노출됐다. 유형이 URL 경로에 있으면 이 문제가 사라진다.
 */
export function buildResultMetadata(resultId?: string): Metadata {
  const result = resultId ? RESULTS[resultId] : undefined;
  if (!result) return BASE;

  const url = `${DOMAIN}/result/${result.id}`;
  const title = `나는 ${result.title}! (${result.grade}등급)`;
  const ogImage = `/api/og?result=${result.id}`;

  return {
    title,
    description: `${result.subtitle} — 효도티어 ${result.grade}등급. 나의 효도 등급도 확인해보세요.`,
    keywords: [...result.tags, '효도티어 결과', '효도 등급', result.title],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | 효도티어`,
      description: result.subtitle,
      url,
      siteName: '효도티어',
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${result.title} - 효도티어 결과`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: result.subtitle,
      images: [ogImage],
    },
  };
}
