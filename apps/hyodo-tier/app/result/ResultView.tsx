'use client';

import { Loading, Toast, type ToastMessage, trackEvent } from '@hyo/ui';
import {
  CHILD_SCORE_RANGES,
  normalizeScores,
  PARENT_SCORE_RANGES,
  QUESTION_COUNT,
} from '@hyo/utils';
import {
  BookOpen,
  CalendarPlus,
  ChevronRight,
  Heart,
  ImageDown,
  RotateCcw,
  Share2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useKakaoShare } from '@/hooks/useKakaoShare';
import { useResultCard } from '@/hooks/useResultCard';
import { calculateResult } from '@/lib/calculateResult';
import { PARENT_RESULTS } from '@/lib/parentResultData';
import { RESULTS } from '@/lib/resultData';
import { readShareRef } from '@/lib/shareRef';
import { useQuizStore } from '@/store/useQuizStore';

type ResultViewProps = {
  /** /result/[type] 처럼 경로로 유형이 정해진 경우 */
  forcedResultId?: string;
};

function buildICS(fatherDob: string, motherDob: string): string {
  const toEvent = (label: string, yymmdd: string) => {
    const mm = yymmdd.slice(2, 4);
    const dd = yymmdd.slice(4, 6);
    const year = new Date().getFullYear();
    const dtStart = `${year}${mm}${dd}`;
    return [
      'BEGIN:VEVENT',
      `SUMMARY:${label} 생신 🌸`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      'RRULE:FREQ=YEARLY',
      'DESCRIPTION:효도티어에서 저장한 부모님 생신 알림',
      'END:VEVENT',
    ].join('\r\n');
  };
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hyo-Tier//Parents Birthday//KO',
    toEvent('아버지', fatherDob),
    toEvent('어머니', motherDob),
    'END:VCALENDAR',
  ].join('\r\n');
}

function ResultContent({ forcedResultId }: ResultViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    scores: storeScores,
    flags,
    resetQuiz,
    currentStep,
    birthdays,
    skippedBirthday,
  } = useQuizStore();
  const [isReady, setIsReady] = useState(false); // 클라이언트 렌더링 준비 여부
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const trackedResult = useRef(false);

  // 하이드레이션 완료 여부 추적 (세션스토리지 → Zustand 복원 완료 전에 리다이렉트 방지)
  const [hydrated, setHydrated] = useState(() =>
    useQuizStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useQuizStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  // 1. 쿼리 파라미터 파싱 (공유된 결과인 경우)
  // 경로에 유형이 박힌 /result/[type] 에서는 그 값을 우선한다
  const sharedResultId = forcedResultId ?? searchParams.get('result');
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
    return calculateResult(storeScores, flags, { skippedBirthday });
  }, [sharedResultId, storeScores, flags, skippedBirthday]);

  const { shareKakao } = useKakaoShare(
    result.id,
    result.title,
    result.grade,
    scores,
  );

  const { saveCard, isSaving } = useResultCard({
    resultType: result.id,
    scores,
  });

  const handleSaveCard = async () => {
    const outcome = await saveCard();
    trackEvent('result_card_saved', {
      mode: 'child',
      result_id: result.id,
      grade: result.grade,
      outcome,
      from_shared: Boolean(sharedResultId),
    });
    if (outcome === 'downloaded') {
      setToast({ message: '이미지를 저장했어요. 스토리에 올려보세요! 🌸' });
    } else if (outcome === 'failed') {
      setToast({
        message: '이미지를 만들지 못했어요. 잠시 후 다시 시도해주세요.',
        tone: 'error',
      });
    }
  };

  const handleShare = async () => {
    const { outcome, shareId } = await shareKakao();
    trackEvent('share_clicked', {
      mode: 'child',
      result_id: result.id,
      grade: result.grade,
      outcome,
      from_shared: Boolean(sharedResultId),
      share_id: shareId,
    });
    if (outcome === 'copied') {
      setToast({ message: '링크를 복사했어요. 부모님께 붙여넣어 보내보세요.' });
    } else if (outcome === 'failed') {
      setToast({
        message: '공유에 실패했어요. 주소창의 링크를 복사해 보내주세요.',
        tone: 'error',
      });
    }
  };

  const handleCopyMessage = async () => {
    const message =
      '엄마, 아빠. 오늘 효도티어 테스트를 해봤어요. 평소에 표현은 잘 못했지만, 두 분께 정말 감사하고 사랑한다고 꼭 전하고 싶었어요. 항상 건강하세요. 🌸';
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

  // 원점수는 축마다 도달 범위가 달라(친밀도 -115~175 등) 그대로 그리면 그래프가 왜곡된다.
  // 판정 로직은 계속 원점수를 쓰고, 표시할 때만 0~100으로 환산한다.
  const displayScores = useMemo(
    () => normalizeScores(scores, CHILD_SCORE_RANGES),
    [scores],
  );

  const hasScores =
    scores.interest !== 0 || scores.intimacy !== 0 || scores.expression !== 0;

  // 부모 결과 비교 (parent 파라미터가 있을 때)
  const parentResultId = searchParams.get('parent');
  const parentResult = parentResultId ? PARENT_RESULTS[parentResultId] : null;
  const parentScores = useMemo(
    () => ({
      interest: Number(searchParams.get('pi')) || 0,
      intimacy: Number(searchParams.get('pn')) || 0,
      expression: Number(searchParams.get('pe')) || 0,
    }),
    [searchParams],
  );
  const parentName = (searchParams.get('pname') || '').slice(0, 10) || null;

  // 이 방문자를 데려온 공유 건 (Phase 0 계측 — share_clicked와 짝을 이룬다)
  const shareRef = readShareRef(searchParams.get('ref'));

  // 부모편은 축 범위 자체가 달라서(친밀도 최대 190) 원점수끼리 비교하면 불공평하다.
  const displayParentScores = useMemo(
    () => normalizeScores(parentScores, PARENT_SCORE_RANGES),
    [parentScores],
  );

  // 3. 예외 처리: 퀴즈를 안 풀고 접근했으면 홈으로 보냄 (단, 공유된 링크는 제외)
  useEffect(() => {
    if (!hydrated) return;
    // 공유된 결과가 없고, 푼 문제도 0개면 비정상 접근
    if (!sharedResultId && currentStep === 0) {
      router.replace('/');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(true);
    }
  }, [hydrated, currentStep, router, sharedResultId]);

  // 결과 도달 계측 (본인 응시 / 공유 링크 유입을 구분한다)
  useEffect(() => {
    if (!isReady || trackedResult.current) return;
    trackedResult.current = true;

    if (sharedResultId) {
      trackEvent('shared_link_opened', {
        mode: 'child',
        result_id: result.id,
        grade: result.grade,
        has_parent_compare: Boolean(parentResultId),
        ref: shareRef,
      });
    } else {
      trackEvent('quiz_complete', {
        mode: 'child',
        result_id: result.id,
        grade: result.grade,
        skipped_birthday: skippedBirthday,
        ref: shareRef,
      });
    }
  }, [
    isReady,
    sharedResultId,
    result,
    parentResultId,
    skippedBirthday,
    shareRef,
  ]);

  if (!isReady) return <Loading />; // 리다이렉트 중 깜빡임 방지 및 푸터 점프 방지

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-6 animate-fade-in space-y-8 pb-20">
      {/* 0. 공유로 들어온 방문자 오리엔테이션 */}
      {sharedResultId && (
        <p className="w-full text-center text-xs text-ink/60 bg-white/60 border border-ink/10 rounded-full py-2 px-4">
          누군가 공유한 성적표입니다 · 내 등급은 {QUESTION_COUNT}문항이면
          나옵니다
        </p>
      )}

      {/* 1. 결과 등급 (도장 애니메이션) */}
      <div className="relative w-full text-center py-8 border-b-2 border-dashed border-ink/20">
        <span
          className="absolute top-3 right-3 text-2xl rotate-12 select-none"
          aria-hidden="true"
        >
          🌸
        </span>
        <p className="text-sm font-serif text-ink/60 mb-2 font-bold">
          2026학년도 효도능력시험 성적표
        </p>

        {/* 캐릭터 이름 */}
        <h1 className="text-3xl font-serif font-black mb-2 text-ink break-keep leading-tight">
          {result.title}
        </h1>
        <p className="text-sm font-sans text-ink/70">
          &quot;{result.subtitle}&quot;
        </p>

        {/* 등급 도장 — 등급 값은 resultData의 grade가 단일 출처 */}
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

      {/* 2-b. 부모님 vs 나 비교 카드 (parent 파라미터가 있을 때만) */}
      {parentResult && (
        <div className="w-full bg-amber-50/60 border border-ink/10 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
            🧐 부모님 vs 나
            {parentName && (
              <span className="text-xs text-ink/50 font-sans font-normal">
                ({parentName}님 부모님)
              </span>
            )}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/70 rounded-xl p-3 border border-ink/10 space-y-1 text-center">
              <p className="text-[10px] text-ink/50 font-bold">부모님</p>
              <p className="text-sm font-serif font-bold text-ink leading-snug break-keep">
                {parentResult.title}
              </p>
              <div className="space-y-1 mt-2">
                <MiniBar
                  label="관심"
                  score={displayParentScores.interest}
                  color="bg-blue-300"
                />
                <MiniBar
                  label="친밀"
                  score={displayParentScores.intimacy}
                  color="bg-pink-300"
                />
                <MiniBar
                  label="표현"
                  score={displayParentScores.expression}
                  color="bg-yellow-300"
                />
              </div>
            </div>
            <div className="bg-white/70 rounded-xl p-3 border border-ink/10 space-y-1 text-center">
              <p className="text-[10px] text-ink/50 font-bold">나</p>
              <p className="text-sm font-serif font-bold text-ink leading-snug break-keep">
                {result.title}
              </p>
              <div className="space-y-1 mt-2">
                <MiniBar
                  label="관심"
                  score={displayScores.interest}
                  color="bg-blue-300"
                />
                <MiniBar
                  label="친밀"
                  score={displayScores.intimacy}
                  color="bg-pink-300"
                />
                <MiniBar
                  label="표현"
                  score={displayScores.expression}
                  color="bg-yellow-300"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-ink/60 leading-relaxed text-center">
            {(() => {
              const childTotal =
                displayScores.interest +
                displayScores.intimacy +
                displayScores.expression;
              const parentTotal =
                displayParentScores.interest +
                displayParentScores.intimacy +
                displayParentScores.expression;
              if (childTotal > parentTotal) {
                return '당신이 부모님보다 서로를 더 잘 알고 있어요. 놀라운 결과네요.';
              }
              if (parentTotal - childTotal > 20) {
                return '부모님은 당신에 대해 이만큼 알고 계셨어요. 당신은...?';
              }
              return '서로 비슷한 온도로 아시는군요. 나란히 한 발씩 더 가까워져 봐요.';
            })()}
          </p>
          <div className="text-center">
            <Link
              href="/parent"
              className="text-xs text-grading underline hover:text-ink transition-colors"
            >
              부모님도 시험 보러 보내기 →
            </Link>
          </div>
        </div>
      )}

      {/* 3. 닥터의 처방전 */}
      <div className="w-full bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-3">
        <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-ink">
          🩺 닥터의 처방전
        </h3>
        <p className="text-sm text-ink/80 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
          {result.solution}
        </p>
      </div>

      {/* 4. 점수 그래프 — 점수 없이 들어온 유형 랜딩에서는 감춘다 */}
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
        {/* 공유 링크로 들어온 방문자에게는 응시가 1순위 행동이다. */}
        {sharedResultId && (
          <Link
            href="/"
            onClick={() => {
              trackEvent('retake_from_shared', {
                mode: 'child',
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
          className={`w-full bg-[#FEE500] text-[#191919] py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all ${
            sharedResultId ? 'text-base' : 'text-lg'
          }`}
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" />{' '}
          {sharedResultId ? '이 성적표 공유하기' : '부모님께 공유하기'}
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

        {/* 부모↔자식 비교가 이 서비스의 가장 강한 성장 동선인데,
            그동안 랜딩 하단 링크 하나로만 닿을 수 있었다. */}
        {!parentResult && (
          <Link
            href="/parent"
            onClick={() =>
              trackEvent('parent_quiz_cta', {
                from: sharedResultId ? 'shared_result' : 'own_result',
                result_id: result.id,
              })
            }
            className="w-full bg-white border-2 border-ink/20 text-ink py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50 hover:border-ink/40 transition-all"
          >
            <Users className="w-5 h-5 text-grading" /> 부모님께 2교시 보내기
          </Link>
        )}

        {!sharedResultId && (
          <div className="w-full space-y-3 pt-2">
            <button
              type="button"
              className="w-full bg-grading/10 text-grading border-2 border-grading/30 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-grading/20 transition-all"
              onClick={handleCopyMessage}
            >
              <Heart className="w-5 h-5" /> 어머니/아버지께 마음 전하기
            </button>

            {birthdays.father.length === 6 && birthdays.mother.length === 6 && (
              <button
                type="button"
                className="w-full bg-white border-2 border-stone-300 text-ink py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-all"
                onClick={() => {
                  const ics = buildICS(birthdays.father, birthdays.mother);
                  const blob = new Blob([ics], {
                    type: 'text/calendar;charset=utf-8',
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = '부모님생신.ics';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <CalendarPlus className="w-5 h-5" /> 부모님 생신 캘린더에 저장
              </button>
            )}
          </div>
        )}

        {/* 응시 이력이 없는 방문자에게 "재시험"은 누를 이유가 없는 라벨이다. */}
        <div className={sharedResultId ? '' : 'grid grid-cols-2 gap-3'}>
          {!sharedResultId && (
            <Link
              href="/"
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

export default function ResultView({ forcedResultId }: ResultViewProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ResultContent forcedResultId={forcedResultId} />
    </Suspense>
  );
}

// 비교 카드용 미니 점수 게이지
function MiniBar({
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
    <div className="flex items-center gap-1 text-[10px]">
      <span className="w-6 text-right text-ink/50 font-bold">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-6 text-ink/50 font-bold">{score}</span>
    </div>
  );
}

// 점수 게이지 — score는 0~100으로 이미 환산된 값이다 (@hyo/utils normalizeScores)
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
