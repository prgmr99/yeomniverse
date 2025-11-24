'use client';

import { useRouter } from 'next/navigation'; // 라우터
import { useEffect, useState } from 'react';
import ProgressBar from '@/components/quiz/ProgressBar';
import { type Effects, QUESTIONS } from '@/lib/constants'; // 데이터 불러오기
import { useQuizStore } from '@/store/useQuizStore'; // 스토어 불러오기

export default function QuizPage() {
  const router = useRouter();

  // Zustand에서 필요한 상태와 액션 꺼내오기
  const { currentStep, nextStep, setAnswer, resetQuiz } = useQuizStore();

  // 애니메이션 처리를 위한 로컬 상태 (슬라이드 효과용)
  const [isAnimating, setIsAnimating] = useState(false);

  // 현재 보여줄 질문 데이터
  const currentQuestion = QUESTIONS[currentStep];

  // 퀴즈가 모두 끝났는지 체크
  const isFinished = currentStep >= QUESTIONS.length;

  // 답변 클릭 핸들러
  const handleOptionClick = (index: number, effects: Effects) => {
    if (isAnimating) return; // 애니메이션 중 중복 클릭 방지

    setIsAnimating(true); // 슬라이드 아웃 애니메이션 시작

    // 1. 점수 저장
    setAnswer(index, effects);

    // 2. 약간의 딜레이 후 다음 문제로 (애니메이션 시간 고려)
    setTimeout(() => {
      nextStep();
      setIsAnimating(false); // 애니메이션 플래그 해제 (새 질문은 slide-in 됨)
    }, 300);
  };

  // 컴포넌트 마운트 시 퀴즈 초기화 (새로고침 했을 때 대비)
  useEffect(() => {
    if (currentStep === 0) {
      resetQuiz();
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
        {/* 애니메이션 래퍼 (문제가 바뀔 때마다 animate-slide-in 실행) */}
        {/* key={currentStep}을 주면 리액트가 다른 요소로 인식해서 애니메이션을 다시 실행함 */}
        <div
          key={currentStep}
          className={`space-y-8 ${isAnimating ? 'opacity-0 transition-opacity duration-300' : 'animate-slide-in'}`}
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
        </div>
      </div>
    </main>
  );
}
