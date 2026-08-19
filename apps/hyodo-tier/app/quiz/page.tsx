'use client';

import { Loading } from '@hyo/ui';
import { type Effects, QUESTIONS } from '@hyo/utils'; // 데이터 불러오기
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation'; // 라우터
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import ProgressBar from '@/components/quiz/ProgressBar';
import { useQuizStore } from '@/store/useQuizStore'; // 스토어 불러오기

// 애니메이션 변형 정의
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const [direction, setDirection] = useState(1); // 1: 다음, -1: 이전
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedStep = useRef<number | null>(null);

  // Zustand에서 필요한 상태와 액션 꺼내오기
  const { currentStep, answers, nextStep, prevStep, setAnswer, resetQuiz } =
    useQuizStore();

  // 하이드레이션 완료 여부 추적
  const [hydrated, setHydrated] = useState(() =>
    useQuizStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useQuizStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  // 부모 결과 파라미터 (parent→child 공유 흐름 유지)
  const parentParams = useMemo(() => {
    const parent = searchParams.get('parent');
    if (!parent) return '';
    const entries = ['parent', 'pi', 'pn', 'pe', 'pname']
      .map((k) => {
        const v = searchParams.get(k);
        return v ? `${k}=${encodeURIComponent(v)}` : '';
      })
      .filter(Boolean);
    return entries.join('&');
  }, [searchParams]);

  // 현재 보여줄 질문 데이터
  const currentQuestion = QUESTIONS[currentStep];

  // 퀴즈가 모두 끝났는지 체크
  const isFinished = currentStep >= QUESTIONS.length;

  // 문제가 바뀌면 선택 상태 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset selection when step changes
  useEffect(() => {
    setSelectedIndex(null);
  }, [currentStep]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  // 답변 클릭 핸들러
  const handleOptionClick = (index: number, effects: Effects) => {
    // 이미 선택 중이면 무시 (double-advance 방지)
    if (selectedIndex !== null) return;

    setSelectedIndex(index);

    advanceTimer.current = setTimeout(() => {
      // 1. 점수 저장 (answers 배열도 업데이트됨)
      setAnswer(index, effects);
      setDirection(1); // 앞으로 가기

      // 2. URL 업데이트 -> useEffect에서 감지하여 nextStep() 호출
      const nextUrl = parentParams
        ? `/quiz?step=${currentStep + 1}&${parentParams}`
        : `/quiz?step=${currentStep + 1}`;
      router.push(nextUrl);
    }, 280);
  };

  // URL 쿼리 파라미터와 스토어 상태 동기화
  useEffect(() => {
    if (!hydrated) return;
    const stepParam = searchParams.get('step');
    const stepFromUrl = stepParam ? Number.parseInt(stepParam, 10) : 0;
    if (stepFromUrl === lastSyncedStep.current) return;
    lastSyncedStep.current = stepFromUrl;

    // 1. 뒤로가기 감지 (URL 스텝 < 현재 스텝)
    if (stepFromUrl < currentStep) {
      setDirection(-1); // 뒤로 가기
      prevStep();
    }
    // 2. 앞으로 가기 (정상적인 진행)
    // URL이 현재보다 1 크고, 답변이 이미 저장되어 있다면(answers.length) 이동 허용
    else if (stepFromUrl === currentStep + 1 && answers.length >= stepFromUrl) {
      setDirection(1); // 앞으로 가기
      nextStep();
    }
    // 3. 비정상적인 앞으로 가기 방지 (건너뛰기 등)
    else if (stepFromUrl > currentStep) {
      const fixedUrl = parentParams
        ? `/quiz?step=${currentStep}&${parentParams}`
        : `/quiz?step=${currentStep}`;
      router.replace(fixedUrl);
    }
  }, [
    searchParams,
    currentStep,
    answers.length,
    prevStep,
    nextStep,
    router,
    parentParams,
    hydrated,
  ]);

  // 컴포넌트 마운트 시 퀴즈 초기화 (하이드레이션 완료 후에만 실행)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-reset gated on hydration
  useEffect(() => {
    if (!hydrated) return;
    if (currentStep === 0) {
      resetQuiz();
      // URL 초기화 — 부모 공유 파라미터는 보존해야 함
      const initialUrl = parentParams
        ? `/quiz?step=0&${parentParams}`
        : '/quiz?step=0';
      router.replace(initialUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // 결과 페이지 이동 처리
  useEffect(() => {
    if (isFinished) {
      const resultUrl = parentParams ? `/result?${parentParams}` : '/result';
      router.push(resultUrl);
    }
  }, [isFinished, router, parentParams]);

  // 로딩 중이거나 완료된 상태면 로딩 화면 표시 (빈 화면 방지)
  if (!currentQuestion || isFinished) return <Loading />;

  return (
    <main className="min-h-screen flex flex-col bg-paper">
      {/* 상단 진행바 */}
      <ProgressBar current={currentStep} total={QUESTIONS.length} />

      {/* 질문 영역 */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-10 space-y-8 overflow-hidden">
        {/* 애니메이션 래퍼 */}
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial={prefersReducedMotion ? false : 'enter'}
            animate="center"
            exit="exit"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              ease: 'easeInOut',
            }}
            className="space-y-8"
          >
            {/* 질문 텍스트 */}
            <div className="space-y-3">
              <span className="text-grading font-bold font-serif text-xl border-b-2 border-grading/20 inline-block pb-1">
                문제 {currentQuestion.id}
              </span>
              <h2 className="text-2xl font-serif font-bold leading-snug break-keep text-ink">
                {currentQuestion.q}
              </h2>
            </div>

            {/* 선택지 목록 — 네이티브 라디오라 화살표 키 이동과 그룹 시맨틱이 따라온다 */}
            <fieldset className="space-y-3">
              <legend className="sr-only">{currentQuestion.q}</legend>
              {currentQuestion.options.map((option, index) => {
                const isSelected = index === selectedIndex;
                const optionId = `q${currentQuestion.id}-option${index}`;
                return (
                  <div key={index}>
                    <input
                      type="radio"
                      id={optionId}
                      name={`question-${currentQuestion.id}`}
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => handleOptionClick(index, option.effects)}
                    />
                    <label
                      htmlFor={optionId}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all group flex items-center justify-between shadow-sm cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-grading peer-focus-visible:ring-offset-2 ${
                        isSelected
                          ? 'border-grading bg-grading/10 active:scale-[0.98]'
                          : 'border-stone-200 bg-white/60 hover:bg-stone-100 hover:border-omr active:scale-[0.98] active:bg-stone-200'
                      }`}
                    >
                      <span
                        className={`font-sans text-lg ${isSelected ? 'text-ink font-medium' : 'text-ink/90 group-hover:font-medium'}`}
                      >
                        {option.text}
                      </span>
                      {/* OMR 마킹 느낌의 체크박스 */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all shrink-0 ml-3 ${
                          isSelected
                            ? 'bg-grading border-grading scale-110'
                            : 'border-stone-300 group-hover:border-grading group-hover:bg-grading'
                        }`}
                      />
                    </label>
                  </div>
                );
              })}
            </fieldset>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
