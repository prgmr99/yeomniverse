'use client';

import { Home, RotateCcw, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useKakaoShare } from '@/hooks/useKakaoShare';
import { calculateResult } from '@/lib/calculateResult';
import { RESULTS } from '@/lib/resultData';
import { useQuizStore } from '@/store/useQuizStore';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { scores: storeScores, flags, resetQuiz, currentStep } = useQuizStore();
  const [isReady, setIsReady] = useState(false); // 클라이언트 렌더링 준비 여부

  // 1. 쿼리 파라미터 파싱 (공유된 결과인 경우)
  const sharedResultId = searchParams.get('result');
  const sharedScores = useMemo(
    () => ({
      interest: Number(searchParams.get('interest')) || 0,
      intimacy: Number(searchParams.get('intimacy')) || 0,
      expression: Number(searchParams.get('expression')) || 0,
    }),
    [searchParams],
  );

  // 2. 결과 계산 (공유된 결과 우선, 없으면 스토어 데이터 사용)
  const scores = sharedResultId ? sharedScores : storeScores;

  const result = useMemo(() => {
    if (sharedResultId && RESULTS[sharedResultId]) {
      return RESULTS[sharedResultId];
    }
    return calculateResult(storeScores, flags);
  }, [sharedResultId, storeScores, flags]);

  const { shareKakao } = useKakaoShare(result.id, result.title, scores);

  // 3. 예외 처리: 퀴즈를 안 풀고 접근했으면 홈으로 보냄 (단, 공유된 링크는 제외)
  useEffect(() => {
    // 공유된 결과가 없고, 푼 문제도 0개면 비정상 접근
    if (!sharedResultId && currentStep === 0) {
      router.replace('/');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(true);
    }
  }, [currentStep, router, sharedResultId]);

  if (!isReady) return null; // 리다이렉트 중 깜빡임 방지

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-6 animate-fade-in space-y-8 pb-20">
      {/* 1. 결과 등급 (도장 애니메이션) */}
      <div className="relative w-full text-center py-8 border-b-2 border-dashed border-ink/20">
        <p className="text-sm font-serif text-ink/60 mb-2 font-bold">
          2025학년도 효도능력시험 성적표
        </p>

        {/* 캐릭터 이름 */}
        <h1 className="text-3xl font-serif font-black mb-2 text-ink break-keep leading-tight">
          {result.title}
        </h1>
        <p className="text-sm font-sans text-ink/70">
          &quot;{result.subtitle}&quot;
        </p>

        {/* 1등급 도장 (유니콘일 때만 1등급, 나머지는 재치있게 변경 가능하지만 일단 통일) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="border-[6px] border-grading text-grading rounded-xl px-6 py-2 text-6xl font-black font-serif opacity-0 animate-stamp-bang -rotate-12 whitespace-nowrap bg-paper/90 backdrop-blur-sm shadow-xl">
            {result.id === 'UNICORN'
              ? '1등급'
              : result.id === 'LODGER'
                ? '9등급'
                : '등급외'}
          </div>
        </div>
      </div>

      {/* 2. 캐릭터 상세 설명 */}
      <div
        className={`w-full p-6 rounded-2xl border-2 border-ink/10 shadow-sm ${result.imageColor}`}
      >
        <p className="text-ink/80 leading-relaxed font-sans text-base whitespace-pre-wrap">
          {result.desc}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold bg-white/50 text-ink/60 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3. 닥터의 처방전 */}
      <div className="w-full bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-3">
        <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-ink">
          🩺 닥터의 처방전
        </h3>
        <p className="text-sm text-ink/80 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
          {result.solution}
        </p>
      </div>

      {/* 4. 점수 그래프 (Recharts - 일단 막대바로 간단히 구현) */}
      <div className="w-full space-y-2">
        <h4 className="text-sm font-bold opacity-70 ml-1">상세 점수</h4>
        <ScoreBar
          label="관심도 (지식)"
          score={scores.interest}
          max={100}
          color="bg-blue-400"
        />
        <ScoreBar
          label="친밀도 (마음)"
          score={scores.intimacy}
          max={100}
          color="bg-pink-400"
        />
        <ScoreBar
          label="표현력 (행동)"
          score={scores.expression}
          max={100}
          color="bg-yellow-400"
        />
      </div>

      {/* 5. 액션 버튼 */}
      {/* TODO: 부모님께 공유하기 */}
      <div className="w-full space-y-3 pt-4">
        <button
          type="button"
          className="w-full bg-[#FEE500] text-[#191919] py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all text-lg"
          onClick={shareKakao}
        >
          <Share2 className="w-5 h-5" /> 결과 공유하기
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/"
            onClick={resetQuiz} // 홈으로 갈 때 리셋
            className="bg-stone-800 text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <RotateCcw className="w-4 h-4" /> 재시험
          </Link>
          {/* 나중에 다른 기능(링크 복사 등) 넣을 자리 */}
          <button
            type="button"
            className="bg-white border-2 border-stone-200 text-ink py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50"
          >
            <Home className="w-4 h-4" /> 홈으로
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}

// 간단한 점수 게이지 컴포넌트
function ScoreBar({
  label,
  score,
  max,
  color,
}: {
  label: string;
  score: number;
  max: number;
  color: string;
}) {
  // 점수 정규화 (최대 100% 안 넘게)
  const percent = Math.min(Math.max((score / max) * 100, 5), 100);

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-20 font-bold opacity-70 text-right">{label}</span>
      <div className="flex-1 h-3 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 opacity-50">{score}</span>
    </div>
  );
}
