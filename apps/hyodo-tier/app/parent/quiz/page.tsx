'use client';

import { Loading, trackEvent } from '@hyo/ui';
import { type Effects, PARENT_QUESTIONS } from '@hyo/utils';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import ProgressBar from '@/components/quiz/ProgressBar';
import { useParentQuizStore } from '@/store/useParentQuizStore';

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

function ParentQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedStep = useRef<number | null>(null);
  // 프로그램적으로 이동시킨 목표 step. URL이 여기 도달하기 전까지의 중간 상태를
  // 동기화 로직이 "뒤로가기"로 오해하지 않도록 표시해 둔다.
  const pendingStep = useRef<number | null>(null);

  const { currentStep, answers, nextStep, prevStep, setAnswer, resetQuiz } =
    useParentQuizStore();

  // 하이드레이션 완료 여부 추적
  const [hydrated, setHydrated] = useState(() =>
    useParentQuizStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useParentQuizStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  const currentQuestion = PARENT_QUESTIONS[currentStep];
  const isFinished = currentStep >= PARENT_QUESTIONS.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset selection when step changes
  useEffect(() => {
    setSelectedIndex(null);
  }, [currentStep]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const handleOptionClick = (index: number, effects: Effects) => {
    if (selectedIndex !== null) return;

    setSelectedIndex(index);

    advanceTimer.current = setTimeout(() => {
      // 스토어를 먼저 진행시킨다. URL만 밀어 놓고 useEffect가 answers.length 를
      // 읽어 nextStep() 하던 방식은, 되감기 직후 그 값이 아직 갱신되지 않아
      // 진행이 롤백되고 currentStep 이 그대로 남아(=selectedIndex 리셋 안 됨)
      // 이후 모든 선택이 가드에 막히는 교착을 만들었다.
      setAnswer(index, effects);
      nextStep();
      setDirection(1);

      trackEvent('question_answered', {
        mode: 'parent',
        step: currentStep + 1,
        question_id: PARENT_QUESTIONS[currentStep].id,
        option_index: index,
      });

      // 마지막 문항이면 결과 페이지 이동(isFinished)에 맡긴다
      if (currentStep + 1 >= PARENT_QUESTIONS.length) return;

      pendingStep.current = currentStep + 1;
      router.push(`/parent/quiz?step=${currentStep + 1}`);
    }, 280);
  };

  // 이전 문항으로. router.back() 을 써야 히스토리가 늘어나지 않고,
  // 되감기 로직도 브라우저 뒤로가기와 완전히 같은 경로를 탄다.
  const handlePrev = () => {
    if (currentStep <= 0) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    pendingStep.current = null;
    router.back();
  };

  useEffect(() => {
    if (!hydrated) return;
    const stepParam = searchParams.get('step');
    const stepFromUrl = stepParam ? Number.parseInt(stepParam, 10) : 0;

    // 진행 중인 프로그램적 이동: 스토어는 이미 앞서 있으므로 URL이 목표에
    // 도달할 때까지 아무것도 하지 않는다. (이 가드가 없으면 URL이 아직 이전
    // step인 순간을 뒤로가기로 오해해 prevStep() 이 호출된다)
    if (pendingStep.current !== null) {
      if (stepFromUrl !== pendingStep.current) return;
      pendingStep.current = null;
      lastSyncedStep.current = stepFromUrl;
      return;
    }

    if (stepFromUrl === lastSyncedStep.current) return;
    lastSyncedStep.current = stepFromUrl;

    if (stepFromUrl < currentStep) {
      setDirection(-1);
      prevStep();
    } else if (
      stepFromUrl === currentStep + 1 &&
      answers.length >= stepFromUrl
    ) {
      setDirection(1);
      nextStep();
    } else if (stepFromUrl > currentStep) {
      router.replace(`/parent/quiz?step=${currentStep}`);
    }
  }, [
    searchParams,
    currentStep,
    answers.length,
    prevStep,
    nextStep,
    router,
    hydrated,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-reset gated on hydration
  useEffect(() => {
    if (!hydrated) return;
    if (currentStep === 0) {
      resetQuiz();
      router.replace('/parent/quiz?step=0');
    }
  }, [hydrated]);

  useEffect(() => {
    if (isFinished) {
      router.push('/parent/result');
    }
  }, [isFinished, router]);

  if (!currentQuestion || isFinished) return <Loading />;

  return (
    <main className="min-h-screen flex flex-col bg-paper">
      <ProgressBar
        current={currentStep}
        total={PARENT_QUESTIONS.length}
        onPrev={currentStep > 0 ? handlePrev : undefined}
      />

      <div className="flex-1 flex flex-col justify-center px-6 pb-10 space-y-8 overflow-hidden">
        {/* initial={false}: 첫 문항은 화면 밖에서 밀려들어오지 않고 바로 보인다 */}
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
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

export default function ParentQuizPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ParentQuizContent />
    </Suspense>
  );
}
