'use client';

import { Loading } from '@hyo/ui';
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
      setAnswer(index, effects);
      setDirection(1);
      router.push(`/parent/quiz?step=${currentStep + 1}`);
    }, 280);
  };

  useEffect(() => {
    if (!hydrated) return;
    const stepParam = searchParams.get('step');
    const stepFromUrl = stepParam ? Number.parseInt(stepParam, 10) : 0;
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
      <ProgressBar current={currentStep} total={PARENT_QUESTIONS.length} />

      <div className="flex-1 flex flex-col justify-center px-6 pb-10 space-y-8 overflow-hidden">
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
            <div className="space-y-3">
              <span className="text-grading font-bold font-serif text-xl border-b-2 border-grading/20 inline-block pb-1">
                문제 {currentQuestion.id}
              </span>
              <h2 className="text-2xl font-serif font-bold leading-snug break-keep text-ink">
                {currentQuestion.q}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleOptionClick(index, option.effects)}
                    aria-pressed={index === selectedIndex}
                    aria-disabled={
                      selectedIndex !== null && index !== selectedIndex
                    }
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all group flex items-center justify-between shadow-sm ${
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
                    <div
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'bg-grading border-grading scale-110'
                          : 'border-stone-300 group-hover:border-grading group-hover:bg-grading'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function ParentQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <ParentQuizContent />
    </Suspense>
  );
}
