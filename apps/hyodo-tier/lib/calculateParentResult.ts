// lib/calculateParentResult.ts
import { PARENT_RESULTS, type ParentResultType } from './parentResultData';

type Scores = {
  interest: number;
  intimacy: number;
  expression: number;
};

type Flags = {
  tsundere: number;
  sns: number;
};

export function calculateParentResult(
  scores: Scores,
  flags: Flags,
): ParentResultType {
  const { interest, intimacy, expression } = scores;
  const { tsundere, sns } = flags;

  // 총점 계산 (참고용)
  const _totalScore = interest + intimacy + expression;

  // 1. 특수 유형 우선 판별 (Flags & High Scores)

  // 🦄 슈퍼 부모: 모든 항목이 매우 높을 때 (기준점은 조정 가능)
  if (interest >= 70 && intimacy >= 70 && expression >= 70) {
    return PARENT_RESULTS.UNICORN_PARENT;
  }

  // 🎉 자식 자랑꾼: SNS 성향이 강하고 친밀도가 낮을 때
  if (sns >= 3 && intimacy < 50) {
    return PARENT_RESULTS.SHOW_WINDOW_PARENT;
  }

  // 🌵 돌부처: 츤데레 플래그가 높고 표현력은 보통일 때
  if (tsundere >= 3 && expression >= 30) {
    return PARENT_RESULTS.TSUNDERE_PARENT;
  }

  // 2. 점수 비중 기반 판별 (가장 높은 점수 항목 따라가기)

  // 💳 현금인출기: 표현력(용돈 포함)이 압도적으로 높을 때
  if (expression >= interest && expression >= intimacy && expression >= 60) {
    return PARENT_RESULTS.FINANCIAL_PARENT;
  }

  // 🥂 엄빠친구: 친밀도가 압도적으로 높을 때
  if (intimacy >= interest && intimacy >= expression && intimacy >= 60) {
    return PARENT_RESULTS.SOULMATE_PARENT;
  }

  // 🤖 안부콜 오퍼레이터: 관심도(팩트)는 높은데 친밀도가 낮을 때
  if (interest >= 60 && intimacy < 40) {
    return PARENT_RESULTS.AI_BOT_PARENT;
  }

  // 🚩 K-감독관: 친밀/관심은 있는데 표현이 낮거나 애매할 때
  if (intimacy >= 40 && interest >= 40) {
    return PARENT_RESULTS.K_LEADER_PARENT;
  }

  // 3. 그 외 (점수 미달) -> 방문 밖 손님
  return PARENT_RESULTS.LODGER_PARENT;
}
