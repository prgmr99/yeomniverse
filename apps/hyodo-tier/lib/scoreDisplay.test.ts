import { normalizeScores, PARENT_SCORE_RANGES } from '@hyo/utils';
import { describe, expect, it } from 'vitest';

/**
 * 유형 랜딩(/result/[type], /parent/result/[type])은 응시 기록 없이 열린다.
 * 이때 원점수는 0인데, 환산 결과는 0이 아니다 — 축마다 도달 가능한 최저치가
 * 음수라 0점이 중간 어딘가로 매핑되기 때문이다. 그래서 화면에서는 환산값이
 * 아니라 "원점수가 전부 0인지"로 점수 표시 여부를 판단해야 한다.
 */
describe('점수 표시 판단', () => {
  const EMPTY = { interest: 0, intimacy: 0, expression: 0 };

  it('원점수가 0이어도 환산하면 0이 아니다 — 그대로 그리면 가짜 성적표가 된다', () => {
    const displayed = normalizeScores(EMPTY, PARENT_SCORE_RANGES);
    const total =
      displayed.interest + displayed.intimacy + displayed.expression;
    expect(total).toBeGreaterThan(0);
  });

  it('hasScores는 환산값이 아니라 원점수로 판단한다', () => {
    const hasScores = (s: typeof EMPTY) =>
      s.interest !== 0 || s.intimacy !== 0 || s.expression !== 0;

    expect(hasScores(EMPTY)).toBe(false);
    expect(hasScores({ ...EMPTY, intimacy: -10 })).toBe(true);
    expect(hasScores({ interest: 80, intimacy: 60, expression: 40 })).toBe(
      true,
    );
  });
});
