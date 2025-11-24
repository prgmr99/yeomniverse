"use client";

import ProgressBar from "@/components/quiz/ProgressBar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function QuizPage() {
  // UI 테스트용 임시 상태
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 12;

  // 임시 더미 데이터
  const dummyQuestion = {
    q: "부모님의 정확한 '생신'을 기억하고 있나요?",
    options: [
      "당연하지! 양력/음력까지 완벽 암기",
      "날짜는 아는데 음력인지 헷갈림",
      "카카오톡 생일 알림 뜨면 안다",
      "솔직히 기억 안 난다 (불효자 ㅠㅠ)"
    ]
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* 1. 상단 진행바 */}
      <ProgressBar current={currentStep} total={totalSteps} />

      {/* 2. 문제 카드 영역 */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-10 space-y-8 animate-slide-in">
        
        {/* 질문 텍스트 */}
        <div className="space-y-2">
          <span className="text-grading font-bold font-serif text-lg">Q{currentStep + 1}.</span>
          <h2 className="text-2xl font-serif font-bold leading-normal break-keep">
            {dummyQuestion.q}
          </h2>
        </div>

        {/* 선택지 목록 */}
        <div className="space-y-3">
          {dummyQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep((prev) => prev < totalSteps - 1 ? prev + 1 : prev)} // 임시: 다음 단계로 이동
              className="w-full text-left p-4 rounded-lg border-2 border-stone-300 bg-white/50 hover:bg-stone-100 hover:border-omr active:bg-stone-200 transition-all group flex items-center justify-between"
            >
              <span className="font-sans text-ink/90 group-hover:font-bold">
                {option}
              </span>
              {/* 선택 시 체크 아이콘 (나중에 조건부 렌더링) */}
              <div className="w-5 h-5 rounded-full border-2 border-stone-300 group-hover:border-grading group-hover:bg-grading/10" />
            </button>
          ))}
        </div>

      </div>

      {/* (임시) 결과 페이지 확인용 버튼 - 나중엔 자동 이동됨 */}
      <div className="text-center pb-6">
        <Link href="/result" className="text-xs text-stone-400 underline">
          (개발용) 결과 페이지 미리보기
        </Link>
      </div>
    </main>
  );
}