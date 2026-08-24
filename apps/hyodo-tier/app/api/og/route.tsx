import {
  CHILD_SCORE_RANGES,
  normalizeScores,
  PARENT_SCORE_RANGES,
} from '@hyo/utils';
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { PARENT_RESULTS } from '@/lib/parentResultData';
import { RESULTS } from '@/lib/resultData';
import { LandscapeCard } from './templates/landscape';
import { StoryCard } from './templates/story';
import type { OgTemplateProps } from './templates/types';

export const runtime = 'edge';

// 배경색 매핑 (Tailwind 클래스를 hex로 변환)
const bgColorMap: Record<string, string> = {
  'bg-purple-100': '#f3e8ff',
  'bg-yellow-100': '#fef9c3',
  'bg-blue-100': '#dbeafe',
  'bg-green-100': '#dcfce7',
  'bg-pink-100': '#fce7f3',
  'bg-orange-100': '#ffedd5',
  'bg-slate-200': '#e2e8f0',
  'bg-stone-200': '#e7e5e4',
  'bg-gray-300': '#d1d5db',
};

const RATIOS = {
  og: { width: 1200, height: 630 },
  story: { width: 1080, height: 1920 },
} as const;

type Ratio = keyof typeof RATIOS;

// 템플릿에 고정으로 들어가는 문자열 (폰트 서브셋 요청에 함께 넘긴다).
// 세로형에만 있는 도메인 문자도 포함해야 스토리 카드에서 글자가 빠지지 않는다.
const OG_STATIC_TEXT = [
  '효도티어',
  '2026학년도 효도능력시험 · 부모편',
  '2026학년도 대국민 효도능력시험',
  '관심도친밀도표현력',
  '자식도 풀러가기 →',
  '너도 테스트 하러가기 →',
  '등급',
  '0123456789"',
  'hyodo-tier.yeomniverse.com',
].join('');

// gstatic 직링크는 폰트 버전이 바뀌면 404가 되므로 CSS API로 매번 해석한다.
// satori는 woff2를 읽지 못해 truetype/opentype src만 사용한다.
async function loadNotoSansKr(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl).then((res) => res.text());
  const src = css.match(
    /src:\s*url\((\S+?)\)\s*format\('(?:truetype|opentype)'\)/,
  );

  if (!src?.[1]) {
    throw new Error('Noto Sans KR truetype src not found in CSS response');
  }

  return fetch(src[1]).then((res) => res.arrayBuffer());
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resultId = searchParams.get('result') || 'UNICORN';
    const mode = searchParams.get('mode') === 'parent' ? 'parent' : 'child';
    const ratio: Ratio = searchParams.get('ratio') === 'story' ? 'story' : 'og';

    const rawScores = {
      interest: Number(searchParams.get('interest')) || 0,
      intimacy: Number(searchParams.get('intimacy')) || 0,
      expression: Number(searchParams.get('expression')) || 0,
    };
    const hasScores =
      rawScores.interest !== 0 ||
      rawScores.intimacy !== 0 ||
      rawScores.expression !== 0;

    // 공유 URL은 원점수를 그대로 실어 나르므로, 결과 페이지와 같은 기준으로 환산한다.
    const scores = normalizeScores(
      rawScores,
      mode === 'parent' ? PARENT_SCORE_RANGES : CHILD_SCORE_RANGES,
    );

    // 결과 데이터 가져오기 (mode에 따라 분기)
    const result =
      mode === 'parent' ? PARENT_RESULTS[resultId] : RESULTS[resultId];
    if (!result) {
      return new Response('Result not found', { status: 404 });
    }

    const props: OgTemplateProps = {
      mode,
      title: result.title,
      subtitle: result.subtitle,
      grade: `${result.grade}등급`,
      bgColor: bgColorMap[result.imageColor] || '#f5f5f4',
      hasScores,
      scores,
    };

    // 한글 폰트 로드 (이 이미지에 실제로 쓰이는 글자만 서브셋으로 받는다)
    const fontData = await loadNotoSansKr(
      OG_STATIC_TEXT + props.title + props.subtitle + props.grade,
    );

    return new ImageResponse(
      ratio === 'story' ? (
        <StoryCard {...props} />
      ) : (
        <LandscapeCard {...props} />
      ),
      {
        ...RATIOS[ratio],
        fonts: [{ name: 'NotoSansKR', data: fontData, style: 'normal' }],
      },
    );
  } catch (e: unknown) {
    console.error('OG Image generation error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
