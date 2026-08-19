// lib/calculateResult.ts
import { RESULTS, type ResultType } from './resultData';

type Scores = {
  interest: number;
  intimacy: number;
  expression: number;
};

type Flags = {
  tsundere: number;
  sns: number;
};

type Context = {
  skippedBirthday?: boolean; // 랜딩에서 "부모님 생신을 모르겠어요"로 시작했는지
};

export function calculateResult(
  scores: Scores,
  flags: Flags,
  context: Context = {},
): ResultType {
  const { interest, intimacy, expression } = scores;
  const { tsundere, sns } = flags;

  // 총점 계산 (참고용)
  const _totalScore = interest + intimacy + expression;

  // 1. 특수 유형 우선 판별 (Flags & High Scores)

  // 🦄 유니콘: 모든 항목이 매우 높을 때 (기준점은 조정 가능)
  if (interest >= 70 && intimacy >= 70 && expression >= 70) {
    return RESULTS.UNICORN;
  }

  // 🎉 쇼윈도: SNS 성향이 강하고 친밀도가 낮을 때
  if (sns >= 3 && intimacy < 50) {
    return RESULTS.SHOW_WINDOW;
  }

  // 🌵 츤데레: 츤데레 플래그가 높고 표현력은 보통일 때
  if (tsundere >= 3 && expression >= 30) {
    return RESULTS.TSUNDERE;
  }

  // 2. 점수 비중 기반 판별 (가장 높은 점수 항목 따라가기)

  // 💳 금융치료: 표현력(돈)이 압도적으로 높을 때
  if (expression >= interest && expression >= intimacy && expression >= 60) {
    return RESULTS.FINANCIAL;
  }

  // 🥂 영혼의 단짝: 친밀도가 압도적으로 높을 때
  if (intimacy >= interest && intimacy >= expression && intimacy >= 60) {
    return RESULTS.SOULMATE;
  }

  // 🤖 AI 봇: 관심도(팩트)는 높은데 친밀도가 낮을 때
  if (interest >= 60 && intimacy < 40) {
    return RESULTS.AI_BOT;
  }

  // 🚩 K-장녀/장남: 친밀/관심은 있는데 표현이 낮거나 애매할 때
  if (intimacy >= 40 && interest >= 40) {
    return RESULTS.K_LEADER;
  }

  // 3. 그 외 (점수 미달) -> 하숙생
  // 단, 생신조차 모른 채 응시했고 점수도 최하위면 특수 엔딩으로 대체한다.
  // 좋은 점수를 받은 사람까지 덮어쓰지 않도록 최하위 구간에만 적용.
  if (context.skippedBirthday) {
    return RESULTS.UNFILIAL;
  }

  return RESULTS.LODGER;
}
