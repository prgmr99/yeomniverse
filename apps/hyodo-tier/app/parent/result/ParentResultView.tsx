'use client';

import { Loading, Toast, type ToastMessage, trackEvent } from '@hyo/ui';
import { normalizeScores, PARENT_SCORE_RANGES } from '@hyo/utils';
import {
  BookOpen,
  ChevronRight,
  Heart,
  ImageDown,
  RotateCcw,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useParentKakaoShare } from '@/hooks/useParentKakaoShare';
import { useResultCard } from '@/hooks/useResultCard';
import { calculateParentResult } from '@/lib/calculateParentResult';
import { PARENT_RESULTS } from '@/lib/parentResultData';
import { readShareRef } from '@/lib/shareRef';
import { useParentQuizStore } from '@/store/useParentQuizStore';

type ParentResultViewProps = {
  /** /parent/result/[type] 처럼 경로로 유형이 정해진 경우 */
  forcedResultId?: string;
};

function ParentResultContent({ forcedResultId }: ParentResultViewProps) {
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
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const trackedResult = useRef(false);

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

  const sharedResultId = forcedResultId ?? searchParams.get('result');
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

  const { saveCard, isSaving } = useResultCard({
    resultType: result.id,
    scores,
    mode: 'parent',
  });

  const handleSaveCard = async () => {
    const outcome = await saveCard();
    trackEvent('result_card_saved', {
      mode: 'parent',
      result_id: result.id,
      grade: result.grade,
      outcome,
      from_shared: Boolean(sharedResultId),
    });
    if (outcome === 'downloaded') {
      setToast({ message: '이미지를 저장했어요. 자랑해 보세요! 🌸' });
    } else if (outcome === 'failed') {
      setToast({
        message: '이미지를 만들지 못했어요. 잠시 후 다시 시도해주세요.',
        tone: 'error',
      });
    }
  };

  const handleShare = async () => {
    const { outcome, shareId, copyVariant } = await shareKakao();
    trackEvent('share_clicked', {
      mode: 'parent',
      result_id: result.id,
      grade: result.grade,
      outcome,
      from_shared: Boolean(sharedResultId),
      share_id: shareId,
      copy_variant: copyVariant,
    });
    if (outcome === 'copied') {
      setToast({ message: '링크를 복사했어요. 자식에게 붙여넣어 보내보세요.' });
    } else if (outcome === 'failed') {
      setToast({
        message: '공유에 실패했어요. 주소창의 링크를 복사해 보내주세요.',
        tone: 'error',
      });
    }
  };

  // 원점수는 축마다 도달 범위가 달라 그대로 그리면 그래프가 왜곡된다.
  // 판정 로직은 원점수를 쓰고, 표시할 때만 0~100으로 환산한다.
  const displayScores = useMemo(
    () => normalizeScores(scores, PARENT_SCORE_RANGES),
    [scores],
  );

  // 빈 원점수(0,0,0)도 환산하면 0이 아닌 값이 나온다. 유형 랜딩에서 그대로
  // 그리면 응시하지도 않은 점수가 성적표처럼 보인다.
  const hasScores =
    scores.interest !== 0 || scores.intimacy !== 0 || scores.expression !== 0;

  useEffect(() => {
    if (!hydrated) return;
    if (!sharedResultId && currentStep === 0) {
      router.replace('/parent');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(true);
    }
  }, [hydrated, currentStep, router, sharedResultId]);

  // 결과 도달 계측 (본인 응시 / 공유 링크 유입을 구분한다)
  useEffect(() => {
    if (!isReady || trackedResult.current) return;
    trackedResult.current = true;

    trackEvent(sharedResultId ? 'shared_link_opened' : 'quiz_complete', {
      mode: 'parent',
      result_id: result.id,
      grade: result.grade,
      ref: readShareRef(searchParams.get('ref')),
    });
  }, [isReady, sharedResultId, result, searchParams]);

  if (!isReady) return <Loading />;

  const displayName = childProfile.name
    ? `우리 ${childProfile.name}`
    : '우리 애';

  const handleCopyMessage = async () => {
    const message = `${displayName}, 엄마/아빠가 오늘 너에 대해 얼마나 아는지 테스트해봤어. 너도 한번 풀어보고 결과 보여줄래? 엄마/아빠는 너를 사랑해. 🌸`;
    try {
      await navigator.clipboard.writeText(message);
      setToast({
        message: '마음을 담은 메시지를 복사했어요. 카톡에 붙여넣어 보내보세요.',
      });
    } catch {
      setToast({
        message:
          '복사에 실패했어요. 브라우저 설정에서 복사 권한을 확인해주세요.',
        tone: 'error',
      });
    }
  };

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
      <div className={`w-full space-y-2 ${hasScores ? '' : 'hidden'}`}>
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
        {/* 유형 랜딩·공유 링크로 들어온 방문자에게는 응시가 1순위 행동이다. */}
        {sharedResultId && (
          <Link
            href="/parent"
            onClick={() => {
              trackEvent('retake_from_shared', {
                mode: 'parent',
                from_result_id: result.id,
              });
              resetQuiz();
            }}
            className="w-full bg-omr text-white py-4 rounded-xl font-serif font-bold text-xl shadow-lg hover:bg-ink transition-all flex items-center justify-center gap-2"
          >
            나도 응시하기 <ChevronRight className="w-5 h-5" />
          </Link>
        )}

        <button
          type="button"
          className="w-full bg-[#FEE500] text-[#191919] py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all text-lg"
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" /> 자식에게 성적표 공유하고, 테스트 넘기기
        </button>

        {/* 카톡 링크로는 안 닿는 채널(인스타 스토리 등)을 여는 경로 */}
        <button
          type="button"
          disabled={isSaving}
          className="w-full bg-ink text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all disabled:opacity-60"
          onClick={handleSaveCard}
        >
          <ImageDown className="w-5 h-5" />
          {isSaving ? '성적표 만드는 중...' : '성적표 이미지 저장'}
        </button>

        {!sharedResultId && (
          <button
            type="button"
            className="w-full bg-grading/10 text-grading border-2 border-grading/30 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-grading/20 transition-all"
            onClick={handleCopyMessage}
          >
            <Heart className="w-5 h-5" />{' '}
            {childProfile.name ? `${childProfile.name}에게` : '자식에게'} 마음
            전하기
          </button>
        )}

        <div className={sharedResultId ? '' : 'grid grid-cols-2 gap-3'}>
          {!sharedResultId && (
            <Link
              href="/parent"
              onClick={resetQuiz}
              className="bg-stone-800 text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-black transition-all"
            >
              <RotateCcw className="w-4 h-4" /> 재시험
            </Link>
          )}

          <Link
            href="/blog"
            className="bg-white border-2 border-stone-200 text-ink py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50"
          >
            <BookOpen className="w-4 h-4" /> 효도 블로그 보기
          </Link>
        </div>
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </main>
  );
}

export default function ParentResultView({
  forcedResultId,
}: ParentResultViewProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ParentResultContent forcedResultId={forcedResultId} />
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
