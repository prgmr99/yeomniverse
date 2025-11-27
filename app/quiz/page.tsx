'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation'; // 라우터
import { Suspense, useEffect, useState } from 'react';
import ProgressBar from '@/components/quiz/ProgressBar';
import { type Effects, QUESTIONS } from '@/lib/constants'; // 데이터 불러오기
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
  const [direction, setDirection] = useState(1); // 1: 다음, -1: 이전

  // Zustand에서 필요한 상태와 액션 꺼내오기
  const { currentStep, answers, nextStep, prevStep, setAnswer, resetQuiz } =
    useQuizStore();

  // 현재 보여줄 질문 데이터
  const currentQuestion = QUESTIONS[currentStep];

  // 퀴즈가 모두 끝났는지 체크
  const isFinished = currentStep >= QUESTIONS.length;

  // 답변 클릭 핸들러
  const handleOptionClick = (index: number, effects: Effects) => {
    // 1. 점수 저장 (answers 배열도 업데이트됨)
    setAnswer(index, effects);
    setDirection(1); // 앞으로 가기

    // 2. URL 업데이트 -> useEffect에서 감지하여 nextStep() 호출
    router.push(`/quiz?step=${currentStep + 1}`);
  };

  // URL 쿼리 파라미터와 스토어 상태 동기화
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const stepFromUrl = stepParam ? Number.parseInt(stepParam, 10) : 0;

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
      router.replace(`/quiz?step=${currentStep}`);
    }
  }, [searchParams, currentStep, answers.length, prevStep, nextStep, router]);

  // 컴포넌트 마운트 시 퀴즈 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: <컴포넌트 마운트>
  useEffect(() => {
    if (currentStep === 0) {
      resetQuiz();
      // URL도 초기화
      router.replace('/quiz?step=0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 결과 페이지 이동 처리
  useEffect(() => {
    if (isFinished) {
      router.push('/result'); // 결과 페이지로 자동 이동
    }
  }, [isFinished, router]);

  // 로딩 중이거나 완료된 상태면 빈 화면 (리다이렉트 대기)
  if (!currentQuestion || isFinished) return null;

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
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
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

            {/* 선택지 목록 */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleOptionClick(index, option.effects)}
                  className="w-full text-left p-5 rounded-xl border-2 border-stone-200 bg-white/60 hover:bg-stone-100 hover:border-omr active:scale-[0.98] active:bg-stone-200 transition-all group flex items-center justify-between shadow-sm"
                >
                  <span className="font-sans text-ink/90 text-lg group-hover:font-medium">
                    {option.text}
                  </span>
                  {/* OMR 마킹 느낌의 체크박스 */}
                  <div className="w-6 h-6 rounded-full border-2 border-stone-300 group-hover:border-grading group-hover:bg-grading transition-colors" />
                </button>
              ))}
            </div>
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
