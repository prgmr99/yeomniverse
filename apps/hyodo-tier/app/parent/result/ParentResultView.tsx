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
  Stethoscope,
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
    <main className="min-h-screen flex flex-col items-center py-10 px-6 space-y-8 pb-20">
      {/* 1. 성적표 표제부 — 도장은 제목 위가 아니라 날인란 안에 찍힌다 */}
      <div
        className="rise-in w-full border-b-2 border-ink pb-6"
        style={{ '--rise': 0 } as React.CSSProperties}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 pt-1">
            {/* 날인란이 폭을 가져가 두 줄이 된다. 끊기더라도 '부모편' 안에서는 끊기지 않게 */}
            <p className="text-xs font-serif font-bold tracking-[0.25em] text-ink-muted mb-3 break-keep">
              2026학년도 효도능력시험 · 부모편
            </p>
            <h1 className="text-[1.75rem] font-serif font-black text-ink break-keep leading-tight text-balance">
              {result.title}
            </h1>
          </div>

          {/* 날인란 — 도장이 들어올 자리를 미리 비워 둔다.
              회전한 도장의 외접 사각형(약 74×66)이 칸 안에 들어와야 한다. */}
          <div className="shrink-0 w-24 h-24 border border-dashed border-ink/30 grid place-items-center relative">
            <span className="absolute top-1.5 left-0 right-0 text-center text-[9px] font-sans tracking-[0.2em] text-ink-faint">
              날인
            </span>
            <div className="mt-2 border-[2.5px] border-grading text-grading rounded-sheet w-[64px] h-[54px] grid place-items-center opacity-0 animate-stamp-land shadow-[1px_2px_0_rgba(200,30,30,0.16)]">
              {/* 숫자와 '등급'이 두 줄로 쪼개져 있어 그대로 읽히면 따로 발음된다 */}
              <span className="sr-only">{result.grade}등급</span>
              <span
                aria-hidden="true"
                className="font-serif font-black leading-none text-center"
              >
                <span className="block text-[24px] tabular">
                  {result.grade}
                </span>
                <span className="block text-[10px] mt-1">등급</span>
              </span>
            </div>
          </div>
        </div>

        {/* 부제는 날인란 옆에 끼지 않고 지면 폭을 그대로 쓴다 */}
        <p className="text-sm font-sans text-ink-muted mt-3 break-keep">
          &quot;{result.subtitle}&quot;
        </p>
      </div>

      {/* 2. 총평 — 채점자가 적어 넣은 칸 */}
      <section
        className="rise-in w-full"
        style={{ '--rise': 1 } as React.CSSProperties}
      >
        <h2 className="text-xs font-sans font-bold tracking-[0.18em] text-ink-muted mb-2">
          총평
        </h2>
        <div className="bg-sheet border border-ink/25 p-5 rounded-sheet">
          <p className="text-ink-muted leading-[1.75] font-sans text-[15px] whitespace-pre-wrap break-keep">
            {result.desc}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-ink/12">
            {result.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-bold text-ink-faint border border-ink/20 px-2 py-0.5 rounded-sheet"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 닥터의 처방전 */}
      <section
        className="rise-in w-full"
        style={{ '--rise': 2 } as React.CSSProperties}
      >
        <h2 className="text-xs font-sans font-bold tracking-[0.18em] text-ink-muted mb-2 flex items-center gap-1.5">
          <Stethoscope
            className="w-3.5 h-3.5 text-grading"
            aria-hidden="true"
          />
          닥터의 처방전
        </h2>
        <div className="bg-sheet border border-ink/25 p-5 rounded-sheet">
          <p className="text-[15px] text-ink leading-[1.75] break-keep">
            {result.solution}
          </p>
        </div>
      </section>

      {/* 4. 성적 일람표 — 점수 없이 들어온 유형 랜딩에서는 감춘다 */}
      <section
        className={`rise-in w-full ${hasScores ? '' : 'hidden'}`}
        style={{ '--rise': 3 } as React.CSSProperties}
      >
        <h2 className="text-xs font-sans font-bold tracking-[0.18em] text-ink-muted mb-2">
          영역별 성적
        </h2>
        <div className="border border-ink/25 rounded-sheet divide-y divide-ink/12 bg-sheet">
          <ScoreBar
            label="관심도"
            note="지식"
            score={displayScores.interest}
            color="bg-axis-interest"
          />
          <ScoreBar
            label="친밀도"
            note="마음"
            score={displayScores.intimacy}
            color="bg-axis-intimacy"
          />
          <ScoreBar
            label="표현력"
            note="행동"
            score={displayScores.expression}
            color="bg-axis-expression"
          />
        </div>
      </section>

      {/* 5. 액션 버튼 */}
      <div
        className="rise-in w-full space-y-3 pt-4"
        style={{ '--rise': 4 } as React.CSSProperties}
      >
        {/* 1순위 — 유형 랜딩·공유 링크로 들어온 방문자는 '응시',
            본인 응시자는 자식에게 넘기는 '공유'가 할 일이다. */}
        {sharedResultId ? (
          <Link
            href="/parent"
            onClick={() => {
              trackEvent('retake_from_shared', {
                mode: 'parent',
                from_result_id: result.id,
              });
              resetQuiz();
            }}
            className="relative w-full bg-ink text-paper py-4 rounded-sheet font-serif font-bold text-xl shadow-[0_1px_2px_rgba(0,0,0,0.2),0_6px_16px_-8px_rgba(0,0,0,0.5)] hover:bg-graphite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading pressable flex items-center justify-center"
          >
            나도 응시하기
            <ChevronRight className="absolute right-5 w-5 h-5" />
          </Link>
        ) : (
          <button
            type="button"
            className="relative w-full bg-[#FEE500] text-[#191919] py-4 rounded-sheet font-bold text-[17px] flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.14),0_6px_16px_-8px_rgba(0,0,0,0.4)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink pressable"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 shrink-0" /> 자식에게 보내고 시험 넘기기
          </button>
        )}

        {/* 2순위 — 윤곽선. 1순위와 같은 폭이되 무게가 다르다 */}
        <div className="w-full space-y-2.5">
          {sharedResultId && (
            <button
              type="button"
              className="relative w-full bg-[#FEE500] text-[#191919] py-3.5 rounded-sheet font-bold text-[15px] flex items-center justify-center hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink pressable"
              onClick={handleShare}
            >
              <Share2 className="w-[18px] h-[18px] shrink-0" /> 이 성적표
              공유하기
            </button>
          )}

          {!sharedResultId && (
            <button
              type="button"
              className="relative w-full bg-sheet border border-grading/50 text-grading py-3.5 rounded-sheet font-bold text-[15px] flex items-center justify-center hover:bg-grading-soft hover:border-grading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading pressable"
              onClick={handleCopyMessage}
            >
              <Heart className="w-[18px] h-[18px] shrink-0" />{' '}
              {childProfile.name ? `${childProfile.name}에게` : '자식에게'} 마음
              전하기
            </button>
          )}

          {/* 카톡 링크로는 안 닿는 채널(인스타 스토리 등)을 여는 경로 */}
          <button
            type="button"
            disabled={isSaving}
            className="relative w-full bg-sheet border border-ink/30 text-ink py-3.5 rounded-sheet font-bold text-[15px] flex items-center justify-center hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading pressable disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSaveCard}
          >
            <ImageDown className="w-[18px] h-[18px] shrink-0" />
            {isSaving ? '성적표 만드는 중...' : '성적표 이미지 저장'}
          </button>
        </div>

        {/* 3순위 — 성적표 뒷면의 안내란. 버튼이 아니라 목록이다 */}
        <ul className="w-full border-y border-ink/20 divide-y divide-ink/12 pt-1">
          {/* 응시 이력이 없는 방문자에게 "재시험"은 누를 이유가 없는 라벨이다. */}
          {!sharedResultId && (
            <li>
              <Link
                href="/parent"
                onClick={resetQuiz}
                className="w-full py-3.5 flex items-center gap-3 text-sm text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading pressable"
              >
                <RotateCcw
                  className="w-4 h-4 shrink-0 text-ink-faint"
                  aria-hidden="true"
                />
                <span className="flex-1">재시험 보기</span>
                <ChevronRight
                  className="w-4 h-4 shrink-0 text-ink-faint"
                  aria-hidden="true"
                />
              </Link>
            </li>
          )}

          <li>
            <Link
              href="/blog"
              className="w-full py-3.5 flex items-center gap-3 text-sm text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading pressable"
            >
              <BookOpen
                className="w-4 h-4 shrink-0 text-ink-faint"
                aria-hidden="true"
              />
              <span className="flex-1">효도 블로그 보기</span>
              <ChevronRight
                className="w-4 h-4 shrink-0 text-ink-faint"
                aria-hidden="true"
              />
            </Link>
          </li>
        </ul>
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

// 성적 일람표의 한 행 — score는 0~100으로 이미 환산된 값이다 (@hyo/utils normalizeScores)
function ScoreBar({
  label,
  note,
  score,
  color,
}: {
  label: string;
  note: string;
  score: number;
  color: string;
}) {
  const percent = Math.min(Math.max(score, 0), 100);

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="w-[4.5rem] shrink-0 text-[13px] font-bold text-ink">
        {label}
        <span className="block text-[10px] font-normal text-ink-faint">
          {note}
        </span>
      </span>
      <div className="flex-1 h-2 bg-shade border border-ink/12 overflow-hidden">
        <div
          className={`h-full origin-left animate-bar-fill ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-[15px] font-serif font-bold text-ink tabular">
        {score}
      </span>
    </div>
  );
}
