'use client';

import { Loading } from '@hyo/ui';
import { normalizeScores, PARENT_SCORE_RANGES } from '@hyo/utils';
import { BookOpen, Heart, RotateCcw, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParentKakaoShare } from '@/hooks/useParentKakaoShare';
import { calculateParentResult } from '@/lib/calculateParentResult';
import { PARENT_RESULTS } from '@/lib/parentResultData';
import { useParentQuizStore } from '@/store/useParentQuizStore';

function ParentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    scores: storeScores,
    flags,
    resetQuiz,
    currentStep,
    childProfile,
  } = useParentQuizStore();
  const [isReady, setIsReady] = useState(false);

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

  const sharedResultId = searchParams.get('result');
  const sharedScores = useMemo(
    () => ({
      interest: Number(searchParams.get('interest')) || 0,
      intimacy: Number(searchParams.get('intimacy')) || 0,
      expression: Number(searchParams.get('expression')) || 0,
    }),
    [searchParams],
  );

  const scores = sharedResultId ? sharedScores : storeScores;

  const result = useMemo(() => {
    if (sharedResultId && PARENT_RESULTS[sharedResultId]) {
      return PARENT_RESULTS[sharedResultId];
    }
    return calculateParentResult(storeScores, flags);
  }, [sharedResultId, storeScores, flags]);

  const childName = childProfile.name || undefined;

  const { shareKakao } = useParentKakaoShare(
    result.id,
    result.title,
    scores,
    childName,
  );

  // 원점수는 축마다 도달 범위가 달라 그대로 그리면 그래프가 왜곡된다.
  // 판정 로직은 원점수를 쓰고, 표시할 때만 0~100으로 환산한다.
  const displayScores = useMemo(
    () => normalizeScores(scores, PARENT_SCORE_RANGES),
    [scores],
  );

  useEffect(() => {
    if (!hydrated) return;
    if (!sharedResultId && currentStep === 0) {
      router.replace('/parent');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(true);
    }
  }, [hydrated, currentStep, router, sharedResultId]);

  if (!isReady) return <Loading />;

  const displayName = childProfile.name
    ? `우리 ${childProfile.name}`
    : '우리 애';

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-6 animate-fade-in space-y-8 pb-20">
      {/* 1. 결과 등급 (도장 애니메이션) */}
      <div className="relative w-full text-center py-8 border-b-2 border-dashed border-ink/20">
        <span
          className="absolute top-3 right-3 text-2xl rotate-12 select-none"
          aria-hidden="true"
        >
          🌸
        </span>
        <p className="text-sm font-serif text-ink/60 mb-2 font-bold">
          2026학년도 효도능력시험 · 부모편 성적표
        </p>

        <h1 className="text-3xl font-serif font-black mb-2 text-ink break-keep leading-tight">
          {result.title}
        </h1>
        <p className="text-sm font-sans text-ink/70">
          &quot;{result.subtitle}&quot;
        </p>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="border-[6px] border-grading text-grading rounded-xl px-6 py-2 text-6xl font-black font-serif opacity-0 animate-stamp-move whitespace-nowrap bg-paper/90 backdrop-blur-sm shadow-xl">
            {result.grade}등급
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

      {/* 4. 점수 그래프 */}
      <div className="w-full space-y-2">
        <h4 className="text-sm font-bold opacity-70 ml-1">상세 점수</h4>
        <ScoreBar
          label="관심도 (지식)"
          score={displayScores.interest}
          color="bg-blue-400"
        />
        <ScoreBar
          label="친밀도 (마음)"
          score={displayScores.intimacy}
          color="bg-pink-400"
        />
        <ScoreBar
          label="표현력 (행동)"
          score={displayScores.expression}
          color="bg-yellow-400"
        />
      </div>

      {/* 5. 액션 버튼 */}
      <div className="w-full space-y-3 pt-4">
        <button
          type="button"
          className="w-full bg-[#FEE500] text-[#191919] py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all text-lg"
          onClick={shareKakao}
        >
          <Share2 className="w-5 h-5" /> 자식에게 성적표 공유하고, 테스트 넘기기
        </button>

        {!sharedResultId && (
          <button
            type="button"
            className="w-full bg-grading/10 text-grading border-2 border-grading/30 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-grading/20 transition-all"
            onClick={async () => {
              const message = `${displayName}, 엄마/아빠가 오늘 너에 대해 얼마나 아는지 테스트해봤어. 너도 한번 풀어보고 결과 보여줄래? 엄마/아빠는 너를 사랑해. 🌸`;
              await navigator.clipboard.writeText(message);
              alert(
                '마음을 담은 메시지가 복사됐어요. 자식에게 카톡으로 붙여넣어 보내보세요.',
              );
            }}
          >
            <Heart className="w-5 h-5" />{' '}
            {childProfile.name ? `${childProfile.name}에게` : '자식에게'} 마음
            전하기
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/parent"
            onClick={resetQuiz}
            className="bg-stone-800 text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <RotateCcw className="w-4 h-4" /> 재시험
          </Link>

          <Link
            href="/blog"
            className="bg-white border-2 border-stone-200 text-ink py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50"
          >
            <BookOpen className="w-4 h-4" /> 효도 블로그 보기
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ParentResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ParentResultContent />
    </Suspense>
  );
}

// score는 0~100으로 이미 환산된 값이다 (@hyo/utils normalizeScores)
function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  const percent = Math.min(Math.max(score, 0), 100);

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-24 font-bold opacity-70 text-right">{label}</span>
      <div className="flex-1 h-3 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 opacity-70 font-bold">{score}</span>
    </div>
  );
}
