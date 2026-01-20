import { create } from 'zustand';
import { QUESTIONS } from '@hyo/utils';

type Scores = {
  interest: number; // 관심도
  intimacy: number; // 친밀도
  expression: number; // 표현력
};

type Flags = {
  tsundere: number; // 츤데레 플래그
  sns: number; // SNS 플래그
};

interface QuizState {
  // State
  currentStep: number; // 현재 문제 번호 (0부터 시작)
  answers: number[]; // 사용자가 고른 선택지 인덱스 배열
  scores: Scores; // 누적 점수
  flags: Flags; // 누적 플래그

  // Actions
  setAnswer: (choiceIndex: number, effects: Partial<Scores & Flags>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // 초기 상태
  currentStep: 0,
  answers: [],
  scores: { interest: 0, intimacy: 0, expression: 0 },
  flags: { tsundere: 0, sns: 0 },

  // 답변 선택 시 점수 누적 로직
  setAnswer: (choiceIndex, effects) =>
    set((state) => ({
      answers: [...state.answers, choiceIndex],
      scores: {
        interest: state.scores.interest + (effects.interest || 0),
        intimacy: state.scores.intimacy + (effects.intimacy || 0),
        expression: state.scores.expression + (effects.expression || 0),
      },
      flags: {
        tsundere: state.flags.tsundere + (effects.tsundere || 0),
        sns: state.flags.sns + (effects.sns || 0),
      },
    })),

  // 다음 단계로 이동
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  // 이전 단계로 이동 (뒤로가기 지원)
  prevStep: () => {
    const state = get();
    if (state.currentStep <= 0) return;

    const prevStepIndex = state.currentStep - 1;
    const lastAnswerIndex = state.answers[prevStepIndex];
    const question = QUESTIONS[prevStepIndex];

    // 예외 처리: 데이터가 없으면 그냥 스텝만 줄임
    if (!question || lastAnswerIndex === undefined) {
      set((state) => ({ currentStep: state.currentStep - 1 }));
      return;
    }

    const effects = question.options[lastAnswerIndex].effects;

    set((state) => ({
      currentStep: state.currentStep - 1,
      answers: state.answers.slice(0, -1),
      scores: {
        interest: state.scores.interest - (effects.interest || 0),
        intimacy: state.scores.intimacy - (effects.intimacy || 0),
        expression: state.scores.expression - (effects.expression || 0),
      },
      flags: {
        tsundere: state.flags.tsundere - (effects.tsundere || 0),
        sns: state.flags.sns - (effects.sns || 0),
      },
    }));
  },

  // 퀴즈 초기화 (다시 풀기용)
  resetQuiz: () =>
    set({
      currentStep: 0,
      answers: [],
      scores: { interest: 0, intimacy: 0, expression: 0 },
      flags: { tsundere: 0, sns: 0 },
    }),
}));
