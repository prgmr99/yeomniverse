export type OgMode = 'child' | 'parent';

/** 가로형(OG)·세로형(스토리) 템플릿이 공유하는 렌더 입력. */
export type OgTemplateProps = {
  mode: OgMode;
  title: string;
  subtitle: string;
  grade: string;
  seal: string; // 유형 인장에 새길 한자 한 글자
  hasScores: boolean;
  scores: { interest: number; intimacy: number; expression: number };
};

/**
 * satori는 CSS 변수를 읽지 못해 globals.css 의 토큰을 쓸 수 없다.
 * 웹과 같은 값을 여기 한 벌 더 두고, 두 템플릿이 이것만 참조한다.
 */
export const OG = {
  paper: '#fbf7ef',
  sheet: '#fffdf8',
  shade: '#f2ece0',
  ink: '#1b1714',
  inkMuted: '#57504a',
  inkFaint: '#6f675f',
  rule: '#ddd4c4',
  grading: '#c81e1e',
  graphite: '#3f3a35',
  axis: {
    interest: '#2563a8',
    intimacy: '#b23a6a',
    expression: '#9a6c15',
  },
} as const;

/** 종이의 미세한 색 변화. satori가 그릴 수 있는 건 그라디언트까지다. */
export const PAPER_BACKGROUND =
  'linear-gradient(170deg, #fffdf8 0%, #fbf7ef 45%, #f6f1e6 100%)';

export function subtitleOf(mode: OgMode): string {
  return mode === 'parent'
    ? '2026학년도 효도능력시험 · 부모편'
    : '2026학년도 대국민 효도능력시험';
}

export function ctaOf(mode: OgMode): string {
  return mode === 'parent' ? '자식도 풀러가기 →' : '너도 테스트 하러가기 →';
}

/** 성적 일람표의 세 축 — 두 템플릿이 같은 순서·같은 색을 쓴다. */
export function axesOf(scores: OgTemplateProps['scores']) {
  return [
    { label: '관심도', value: scores.interest, color: OG.axis.interest },
    { label: '친밀도', value: scores.intimacy, color: OG.axis.intimacy },
    { label: '표현력', value: scores.expression, color: OG.axis.expression },
  ];
}
