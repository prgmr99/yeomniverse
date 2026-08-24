export type OgMode = 'child' | 'parent';

/** 가로형(OG)·세로형(스토리) 템플릿이 공유하는 렌더 입력. */
export type OgTemplateProps = {
  mode: OgMode;
  title: string;
  subtitle: string;
  grade: string;
  bgColor: string;
  hasScores: boolean;
  scores: { interest: number; intimacy: number; expression: number };
};

// 점 패턴 배경 — 시험지 질감을 흉내낸다
export const DOT_BACKGROUND = `
  radial-gradient(circle at 25px 25px, rgba(0, 0, 0, 0.05) 2%, transparent 0%),
  radial-gradient(circle at 75px 75px, rgba(0, 0, 0, 0.05) 2%, transparent 0%)
`;

export function subtitleOf(mode: OgMode): string {
  return mode === 'parent'
    ? '2026학년도 효도능력시험 · 부모편'
    : '2026학년도 대국민 효도능력시험';
}

export function ctaOf(mode: OgMode): string {
  return mode === 'parent' ? '자식도 풀러가기 →' : '너도 테스트 하러가기 →';
}
