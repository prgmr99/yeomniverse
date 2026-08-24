/**
 * 공유 문구 실험.
 *
 * 문구 한 줄이 공유 링크의 오픈률을 크게 가르는데, 지금까지는 한 종류만 있어서
 * 비교 자체가 불가능했다. shareId로 변형을 배정하고 GA에 variant를 함께 남겨
 * share_clicked ↔ shared_link_opened를 variant별로 갈라 볼 수 있게 한다.
 */

export type ShareCopyContext = {
  grade: number;
  title: string;
};

export type ShareCopyVariant = {
  /** GA에 남는 식별자. 한 번 쓴 id는 재사용하지 않는다 — 과거 데이터와 섞인다. */
  id: string;
  text: (ctx: ShareCopyContext) => string;
  buttonTitle: string;
};

// 자식이 부모/친구에게 보내는 문구
export const CHILD_SHARE_COPY: ShareCopyVariant[] = [
  {
    // 기존 문구 (대조군)
    id: 'grade_challenge',
    text: ({ grade }) =>
      `나의 효도 등급은 ${grade}등급! 너는 몇 등급이야? #엄빠고사 #효도티어`,
    buttonTitle: '성적표 확인하러 가기',
  },
  {
    // 등급 대신 캐릭터를 앞세운다 — 숫자보다 이름이 대화를 만든다
    id: 'character',
    text: ({ title }) =>
      `나 '${title}' 나왔어 😂 너는 뭐 나오는지 궁금하다 #효도티어`,
    buttonTitle: '내 유형 보고, 너도 해보기',
  },
  {
    // 자기고백형 — 자랑보다 반성이 공유 부담을 낮춘다
    id: 'confession',
    text: ({ grade }) =>
      `부모님에 대해 안다고 생각했는데 ${grade}등급 나왔다... 너는 자신 있어? #효도티어`,
    buttonTitle: '나도 시험 보기',
  },
];

// 부모가 자식에게 보내는 문구
export const PARENT_SHARE_COPY: ShareCopyVariant[] = [
  {
    // 기존 문구 (대조군)
    id: 'parent_quiz_back',
    text: ({ title }) =>
      `나는 ${title}! 너는 나를 얼마나 아니? 👉 자식 편 테스트 풀어보기 #효도티어 #엄빠편`,
    buttonTitle: '내 점수 보고, 너도 풀어보기',
  },
  {
    id: 'parent_turn',
    text: () =>
      '엄마아빠가 먼저 시험 봤다. 이제 네 차례야 👉 #효도티어 #엄빠편',
    buttonTitle: '내 차례 응시하기',
  },
  {
    id: 'parent_curious',
    text: ({ title }) =>
      `'${title}'래 😌 너는 나에 대해 몇 점 나올까? 👉 #효도티어 #엄빠편`,
    buttonTitle: '나는 몇 점인지 보기',
  },
];

/** 문자열을 고르게 흩어진 정수로 바꾼다 (djb2). */
function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * shareId로 변형을 배정한다.
 *
 * 랜덤이 아니라 해시라서, 같은 공유 건은 항상 같은 변형으로 재현된다 —
 * 나중에 로그만 보고 어떤 문구가 나갔는지 되짚을 수 있다.
 */
export function pickShareCopy(
  variants: ShareCopyVariant[],
  shareId: string,
): ShareCopyVariant {
  return variants[hash(shareId) % variants.length];
}
