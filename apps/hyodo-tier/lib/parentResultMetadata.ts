import type { Metadata } from 'next';
import { PARENT_RESULTS } from './parentResultData';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyodo-tier.yeomniverse.com';

const BASE: Metadata = {
  title: '나의 효도 등급 결과 (부모편)',
  description:
    '2026학년도 효도능력시험 · 부모편 결과를 확인하세요. 자식에 대한 이해도와 소통 유형을 분석한 결과입니다.',
  alternates: { canonical: `${DOMAIN}/parent/result` },
};

/**
 * 부모편 결과 유형별 메타데이터.
 *
 * 자식편과 같은 이유로 유형이 URL 경로에 있어야 한다 — 레이아웃의
 * generateMetadata는 searchParams를 받지 못해서, 쿼리로 유형을 넘기면
 * 공유된 링크가 전부 기본 메타데이터로 노출된다. (lib/resultMetadata.ts 참고)
 */
export function buildParentResultMetadata(resultId?: string): Metadata {
  const result = resultId ? PARENT_RESULTS[resultId] : undefined;
  if (!result) return BASE;

  const url = `${DOMAIN}/parent/result/${result.id}`;
  const title = `나는 ${result.title}! (${result.grade}등급)`;
  const ogImage = `/api/og?result=${result.id}&mode=parent`;

  return {
    title,
    description: `${result.subtitle} — 효도티어 부모편 ${result.grade}등급. 우리 아이는 나를 얼마나 알까요?`,
    keywords: [...result.tags, '효도티어 부모편', '부모 유형', result.title],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | 효도티어 부모편`,
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
          alt: `${result.title} - 효도티어 부모편 결과`,
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
