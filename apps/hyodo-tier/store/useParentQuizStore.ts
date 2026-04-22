import { PARENT_QUESTIONS } from '@hyo/utils';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Scores = {
  interest: number; // 자식에 대한 지식
  intimacy: number; // 자식과의 친밀도
  expression: number; // 애정 표현력
};

type Flags = {
  tsundere: number; // 돌부처 플래그
  sns: number; // 자식 자랑꾼 플래그
};

type ChildProfile = {
  name: string; // 자식 이름 (공유 메시지/호격 조사 처리에 사용)
  birthday: string; // 자식의 6자리 생년월일 (YYMMDD)
};

interface ParentQuizState {
  // State
  currentStep: number; // 현재 문제 번호 (0부터 시작)
  answers: number[]; // 부모님이 고른 선택지 인덱스 배열
  scores: Scores; // 누적 점수
  flags: Flags; // 누적 플래그
  childProfile: ChildProfile; // 자식 이름 + 생년월일

  // Actions
  setAnswer: (choiceIndex: number, effects: Partial<Scores & Flags>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetQuiz: () => void;
  setChildProfile: (name: string, birthday: string) => void;
}

export const useParentQuizStore = create<ParentQuizState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      currentStep: 0,
      answers: [],
      scores: { interest: 0, intimacy: 0, expression: 0 },
      flags: { tsundere: 0, sns: 0 },
      childProfile: { name: '', birthday: '' },

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
        const question = PARENT_QUESTIONS[prevStepIndex];

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

      // 퀴즈 초기화 (다시 풀기용) — 랜딩에서 수집한 childProfile은
      // 보존해야 공유 시 pname 파라미터와 결과 페이지 호칭 처리가 작동한다.
      resetQuiz: () => {
        set((state) => ({
          currentStep: 0,
          answers: [],
          scores: { interest: 0, intimacy: 0, expression: 0 },
          flags: { tsundere: 0, sns: 0 },
          childProfile: state.childProfile,
        }));
      },

      // 자식 이름·생년월일 저장 (공유 메시지 + 동갑내기 로직용)
      setChildProfile: (name, birthday) =>
        set({ childProfile: { name, birthday } }),
    }),
    {
      name: 'hyo-parent-quiz',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        answers: state.answers,
        scores: state.scores,
        flags: state.flags,
        childProfile: state.childProfile,
      }),
    },
  ),
);
