// 점수 타입 (Store와 동일하게 맞춤)
export type Effects = {
  interest?: number; // 관심도
  intimacy?: number; // 친밀도
  expression?: number; // 표현력
  tsundere?: number; // 츤데레 플래그
  sns?: number; // SNS/보여주기식 플래그
};

export interface Question {
  id: number;
  q: string; // 질문 텍스트
  options: {
    text: string; // 선택지 텍스트
    effects: Effects; // 선택 시 오르는 점수
  }[];
}

export const QUESTIONS: Question[] = [
  // --- PART 1. 기초 탐구 (관심도 위주) ---
  {
    id: 1,
    q: "부모님 성함의 '한자(漢字)' 뜻을 정확히 알고 있나요?",
    options: [
      {
        text: '두 분 다 정확히 안다 (ex. 옥 옥, 구슬 주)',
        effects: { interest: 20, expression: 5 },
      },
      { text: '한 분만 확실히 안다', effects: { interest: 10 } },
      {
        text: '대충 좋은 뜻이라고만 알고 있다',
        effects: { interest: 5, intimacy: -5 },
      },
      {
        text: '한글 이름인 줄 알았다... (모름)',
        effects: { interest: 0, intimacy: -10 },
      },
    ],
  },
  {
    id: 2,
    q: '지금 당장 부모님 옷/신발을 사드리려 합니다. 사이즈를 아나요?',
    options: [
      {
        text: '인간 줄자! 상의/하의/발볼까지 앎',
        effects: { interest: 20, expression: 10 },
      },
      {
        text: '대충 100이나 240 정도... 눈대중으로 앎',
        effects: { interest: 10 },
      },
      { text: '신발은 아는데 옷은 모름 (혹은 반대)', effects: { interest: 5 } },
      {
        text: '전혀 모름. 교환권 필수',
        effects: { interest: 0, expression: -5 },
      },
    ],
  },
  {
    id: 3,
    q: '부모님의 휴대폰 번호를 외우고 있나요?',
    options: [
      {
        text: '010... 자다가도 읊을 수 있다',
        effects: { intimacy: 10, interest: 10 },
      },
      {
        text: '손가락만 기억함 (키패드 감각)',
        effects: { intimacy: 5, interest: 5 },
      },
      { text: '검색해서 건다. 못 외운 지 오래됨', effects: { interest: 0 } },
      {
        text: '저장도 안 함 (보이스톡만 함)',
        effects: { interest: -5, intimacy: -5 },
      },
    ],
  },
  {
    id: 4,
    q: '부모님이 현재 드시는 약이나 지병을 알고 있나요?',
    options: [
      {
        text: '약 이름, 복용 시간, 병원까지 꿰뚫고 있다',
        effects: { interest: 20, expression: 5 },
      },
      { text: '고혈압, 당뇨 등 굵직한 병명만 안다', effects: { interest: 10 } },
      {
        text: '어디 안 좋으시다고 들은 것 같긴 한데...',
        effects: { interest: 0, intimacy: -5 },
      },
      {
        text: '건강하신 거 아니었어? 아예 모름',
        effects: { interest: -10, intimacy: -10 },
      },
    ],
  },
  {
    id: 5,
    q: '부모님의 결혼기념일은 언제인가요?',
    options: [
      {
        text: '로맨티스트! 날짜 알고 매년 챙겨드림',
        effects: { interest: 20, expression: 10, intimacy: 10 },
      },
      {
        text: '날짜는 아는데 딱히 챙기진 않음',
        effects: { interest: 10, expression: -5 },
      },
      { text: '계절 정도만 기억남 (봄이었나...)', effects: { interest: 5 } },
      {
        text: '금시초문. 두 분이 알아서 하시는 걸로...',
        effects: { interest: 0, intimacy: -5 },
      },
    ],
  },

  // --- PART 2. 관계 탐구 (친밀도/성향 위주) ---
  {
    id: 6,
    q: '부모님에게 전화가 왔을 때 당신의 리액션은?',
    options: [
      {
        text: '"어~ 엄마/아빠 왜~?" (하이텐션)',
        effects: { intimacy: 20, expression: 10 },
      },
      {
        text: '"어 왜." (3초 안에 받지만 무뚝뚝)',
        effects: { intimacy: 10, tsundere: 5 },
      },
      {
        text: "[거절] 누르고 '나중에 걸게' 문자",
        effects: { intimacy: 0, expression: -5 },
      },
      {
        text: '무음으로 돌리고 안 받은 척한다',
        effects: { intimacy: -20, interest: -10 },
      },
    ],
  },
  {
    id: 7,
    q: '부모님이 스마트폰 사용법을 물어보실 때 태도는?',
    options: [
      {
        text: '친절한 1타 강사 (웃으면서 알려드림)',
        effects: { intimacy: 20, expression: 10 },
      },
      {
        text: '"아 줘봐! 내가 할게!" (해주긴 하는데 짜증)',
        effects: { intimacy: 10, tsundere: 10, expression: -5 },
      },
      {
        text: '"유튜브 검색해봐" 하고 회피',
        effects: { intimacy: -5, expression: -5 },
      },
      { text: '"형/동생한테 물어봐" (도망)', effects: { intimacy: -10 } },
    ],
  },
  {
    id: 8,
    q: '평소 부모님과 카톡 대화 스타일은?',
    options: [
      {
        text: '이모티콘, 짤방, 사진 수시로 전송',
        effects: { intimacy: 15, expression: 15 },
      },
      {
        text: '"ㅇㅇ" "네" 단답형 AI',
        effects: { intimacy: 5, expression: -5, tsundere: 5 },
      },
      { text: '생신 때 기프티콘 보낼 때만 대화함', effects: { expression: 5 } }, // 금융치료 판독용
      {
        text: '가족 단톡방 읽고 대답 안 함 (유령)',
        effects: { intimacy: -10, expression: -10 },
      },
    ],
  },
  {
    id: 9,
    q: '부모님과 단둘이 1박 2일 여행을 가야 한다면?',
    options: [
      { text: '오히려 좋아! 맛집 내가 다 찾아놈', effects: { intimacy: 20 } },
      {
        text: '효도 관광... 어색하지만 모시고 간다',
        effects: { intimacy: 10, expression: 5 },
      },
      { text: '비용 전액 지원해 주면 고려해 봄', effects: { intimacy: 0 } }, // 자본주의
      { text: '절대 불가. 상상만 해도 숨 막힘', effects: { intimacy: -20 } },
    ],
  },
  {
    id: 10,
    q: '부모님이 뜬금없이 "사랑해"라고 카톡을 보내셨다.',
    options: [
      {
        text: '"나도 사랑해~❤️" (하트 답장)',
        effects: { expression: 20, intimacy: 10 },
      },
      {
        text: '"나도~" (쑥스럽지만 받아줌)',
        effects: { expression: 10, intimacy: 5 },
      },
      {
        text: '"술 드셨어?" or "돈 필요해?"',
        effects: { tsundere: 10, expression: -5 },
      },
      { text: '읽씹. (내일 아침 딴소리 함)', effects: { expression: -20 } },
    ],
  },

  // --- PART 3. 심화 탐구 (가치관) ---
  {
    id: 11,
    q: '부모님의 현재 카카오톡 프사 배경을 알고 있나요?',
    options: [
      { text: '나(자식) 혹은 손주 사진이다', effects: { intimacy: 10 } },
      { text: '꽃, 산, 자연 풍경, 명언이다', effects: { interest: 5 } },
      { text: '아무것도 없는 기본 프로필', effects: { interest: 5 } },
      {
        text: '본 지 오래돼서 모르겠다',
        effects: { interest: -10, intimacy: -10 },
      },
    ],
  },
  {
    id: 12,
    q: "부모님의 젊은 시절 '장래 희망'을 알고 있나요?",
    options: [
      {
        text: '정확히 알고, 사연도 들어봤다',
        effects: { interest: 20, intimacy: 20 },
      }, // 유니콘 필수
      { text: '얼핏 들은 것 같은데... 가물가물', effects: { interest: 10 } },
      { text: '전혀 모른다 (꿈이 있으셨나?)', effects: { interest: 0 } },
      { text: '"먹고살기 바빴겠지" 짐작만 함', effects: { intimacy: -5 } },
    ],
  },
  {
    id: 13,
    q: '부모님이 가장 행복해 보일 때는 언제인가요?',
    options: [
      { text: '두툼한 용돈/비싼 선물 드릴 때', effects: { expression: 10 } }, // 자본주의
      { text: '나랑 맛있는 거 먹고 수다 떨 때', effects: { intimacy: 15 } },
      { text: '내 승진/합격 소식 자랑하실 때', effects: { interest: 5 } },
      { text: '솔직히 잘 모르겠다', effects: { interest: -10, intimacy: -10 } },
    ],
  },
  {
    id: 14,
    q: '다음 생에도 가족으로 만난다면?',
    options: [
      {
        text: '다시 자식으로! 더 잘해드릴게요',
        effects: { intimacy: 10, expression: 10 },
      },
      {
        text: '내가 부모로! 받은 사랑 돌려줄래',
        effects: { intimacy: 20, expression: 20 },
      },
      {
        text: '이번 생으로 충분... 남으로 살자',
        effects: { intimacy: -10, tsundere: 5 },
      },
      { text: '친구로! 계급장 떼고 놀고 싶다', effects: { intimacy: 10 } },
    ],
  },
];
