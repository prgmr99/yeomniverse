import { QUESTIONS } from '@hyo/utils';
import { describe, expect, it } from 'vitest';
import { calculateResult } from './calculateResult';
import { RESULTS } from './resultData';

const noFlags = { tsundere: 0, sns: 0 };
const lowScores = { interest: 0, intimacy: 0, expression: 0 };
const unicornScores = { interest: 80, intimacy: 80, expression: 80 };

// 선택지를 실제로 골라가며 점수를 누적한다 (문항 데이터와 판정 로직을 함께 검증)
function play(pick: (questionIndex: number, optionCount: number) => number) {
  const scores = { interest: 0, intimacy: 0, expression: 0 };
  const flags = { tsundere: 0, sns: 0 };

  QUESTIONS.forEach((question, index) => {
    const effects =
      question.options[pick(index, question.options.length)].effects;
    scores.interest += effects.interest ?? 0;
    scores.intimacy += effects.intimacy ?? 0;
    scores.expression += effects.expression ?? 0;
    flags.tsundere += effects.tsundere ?? 0;
    flags.sns += effects.sns ?? 0;
  });

  return { scores, flags };
}

// "보여주기형" 응답자: sns를 최대로 올리되, 나머지는 친밀도가 가장 낮은 선택지를 고른다
function pickShowWindow(index: number) {
  const options = QUESTIONS[index].options;
  const rank = (o: (typeof options)[number]) =>
    (o.effects.sns ?? 0) * 1000 - (o.effects.intimacy ?? 0);

  let best = 0;
  options.forEach((option, i) => {
    if (rank(option) > rank(options[best])) best = i;
  });
  return best;
}

// 유형별 대표 표본 — 하나라도 도달 불가가 되면 그 유형은 조용히 죽은 콘텐츠가 된다
const SAMPLES: Record<string, Parameters<typeof calculateResult>> = {
  UNICORN: [unicornScores, noFlags],
  TSUNDERE: [
    { interest: 30, intimacy: 30, expression: 40 },
    { tsundere: 5, sns: 0 },
  ],
  FINANCIAL: [{ interest: 30, intimacy: 30, expression: 70 }, noFlags],
  SOULMATE: [{ interest: 40, intimacy: 70, expression: 30 }, noFlags],
  AI_BOT: [{ interest: 70, intimacy: 30, expression: 20 }, noFlags],
  K_LEADER: [{ interest: 50, intimacy: 50, expression: 20 }, noFlags],
  LODGER: [lowScores, noFlags],
  UNFILIAL: [lowScores, noFlags, { skippedBirthday: true }],
};

describe('결과 유형 도달 가능성', () => {
  it('쇼윈도 유형은 실제 문항 데이터만으로 도달할 수 있다', () => {
    const { scores, flags } = play(pickShowWindow);

    expect(flags.sns).toBeGreaterThanOrEqual(3);
    expect(scores.intimacy).toBeLessThan(50);
    expect(calculateResult(scores, flags).id).toBe('SHOW_WINDOW');
  });

  it('정의된 모든 결과 유형이 판정 로직에서 반환된다', () => {
    for (const [expected, args] of Object.entries(SAMPLES)) {
      expect(calculateResult(...args).id).toBe(expected);
    }
  });

  it('표본이 모든 결과 유형을 덮는다', () => {
    const showWindow = play(pickShowWindow);
    const covered = new Set([
      ...Object.keys(SAMPLES),
      calculateResult(showWindow.scores, showWindow.flags).id,
    ]);

    expect([...covered].sort()).toEqual(Object.keys(RESULTS).sort());
  });
});

describe('calculateResult', () => {
  it('점수 미달이면 하숙생을 반환한다', () => {
    expect(calculateResult(lowScores, noFlags).id).toBe('LODGER');
  });

  it('생신을 모른 채 응시하고 점수도 최하위면 불효자를 반환한다', () => {
    expect(
      calculateResult(lowScores, noFlags, { skippedBirthday: true }).id,
    ).toBe('UNFILIAL');
  });

  it('생신을 몰라도 상위 유형이면 결과를 덮어쓰지 않는다', () => {
    expect(
      calculateResult(unicornScores, noFlags, { skippedBirthday: true }).id,
    ).toBe('UNICORN');
  });

  it('context를 생략하면 기존 동작을 유지한다', () => {
    expect(calculateResult(lowScores, noFlags, {}).id).toBe('LODGER');
  });
});
