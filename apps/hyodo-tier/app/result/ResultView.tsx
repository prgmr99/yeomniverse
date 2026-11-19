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
  Scale,
  Share2,
  Stethoscope,
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
    const { outcome, shareId, copyVariant } = await shareKakao();
    trackEvent('share_clicked', {
      mode: 'child',
      result_id: result.id,
      grade: result.grade,
      outcome,
      from_shared: Boolean(sharedResultId),
      share_id: shareId,
      copy_variant: copyVariant,
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
        <p className="w-full text-center text-xs text-ink-muted bg-shade border border-ink/20 rounded-sheet py-2 px-4 break-keep">
          누군가 공유한 성적표입니다 · 내 등급은 {QUESTION_COUNT}문항이면
          나옵니다
        </p>
      )}

      {/* 1. 성적표 표제부 — 도장은 제목 위가 아니라 날인란 안에 찍힌다 */}
      <div className="w-full border-b-2 border-ink pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-xs font-serif font-bold tracking-[0.25em] text-ink-muted mb-3">
              2026학년도 효도능력시험
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
              <span className="font-serif font-black leading-none text-center">
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
      <section className="w-full">
        <h2 className="text-xs font-sans font-bold tracking-[0.18em] text-ink-muted mb-2">
          총평
        </h2>
        <div className="bg-sheet border border-ink/25 p-5 rounded-sheet">
          <p className="text-ink-muted leading-[1.75] font-sans text-[15px] whitespace-pre-wrap break-keep">
            {result.desc}
          </p>

          {/* 태그 */}
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

      {/* 2-b. 부모님 vs 나 비교 카드 (parent 파라미터가 있을 때만) */}
      {parentResult && (
        <div className="w-full bg-sheet border border-ink/25 rounded-sheet p-5 space-y-4">
          <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
            <Scale
              className="w-4 h-4 text-grading shrink-0"
              aria-hidden="true"
            />
            부모님 vs 나
            {parentName && (
              <span className="text-xs text-ink-faint font-sans font-normal">
                ({parentName}님 부모님)
              </span>
            )}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-paper rounded-sheet p-3 border border-ink/20 space-y-1 text-center">
              <p className="text-[10px] text-ink-faint font-bold tracking-[0.15em]">
                부모님
              </p>
              <p className="text-sm font-serif font-bold text-ink leading-snug break-keep">
                {parentResult.title}
              </p>
              <div className="space-y-1 mt-2">
                <MiniBar
                  label="관심"
                  score={displayParentScores.interest}
                  color="bg-axis-interest"
                />
                <MiniBar
                  label="친밀"
                  score={displayParentScores.intimacy}
                  color="bg-axis-intimacy"
                />
                <MiniBar
                  label="표현"
                  score={displayParentScores.expression}
                  color="bg-axis-expression"
                />
              </div>
            </div>
            <div className="bg-paper rounded-sheet p-3 border border-ink/20 space-y-1 text-center">
              <p className="text-[10px] text-ink-faint font-bold tracking-[0.15em]">
                나
              </p>
              <p className="text-sm font-serif font-bold text-ink leading-snug break-keep">
                {result.title}
              </p>
              <div className="space-y-1 mt-2">
                <MiniBar
                  label="관심"
                  score={displayScores.interest}
                  color="bg-axis-interest"
                />
                <MiniBar
                  label="친밀"
                  score={displayScores.intimacy}
                  color="bg-axis-intimacy"
                />
                <MiniBar
                  label="표현"
                  score={displayScores.expression}
                  color="bg-axis-expression"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed text-center break-keep">
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
      <section className="w-full">
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
      <section className={`w-full ${hasScores ? '' : 'hidden'}`}>
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
      <div className="w-full space-y-3 pt-4">
        {/* 1순위 — 공유로 들어온 방문자는 '응시', 본인 응시자는 '공유'가 할 일이다 */}
        {sharedResultId ? (
          <Link
            href="/"
            onClick={() => {
              trackEvent('retake_from_shared', {
                mode: 'child',
                from_result_id: result.id,
              });
              resetQuiz();
            }}
            className="w-full bg-ink text-paper py-4 rounded-sheet font-serif font-bold text-xl shadow-[0_1px_2px_rgba(0,0,0,0.2),0_6px_16px_-8px_rgba(0,0,0,0.5)] hover:bg-graphite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors flex items-center justify-center gap-2"
          >
            나도 응시하기 <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <button
            type="button"
            className="w-full bg-[#FEE500] text-[#191919] py-4 rounded-sheet font-bold text-lg flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.14),0_6px_16px_-8px_rgba(0,0,0,0.4)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink transition-all"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" /> 부모님께 공유하기
          </button>
        )}

        {/* 2순위 — 윤곽선. 1순위와 같은 폭이되 무게가 다르다 */}
        <div className="w-full space-y-2.5">
          {sharedResultId && (
            <button
              type="button"
              className="w-full bg-[#FEE500] text-[#191919] py-3.5 rounded-sheet font-bold text-[15px] flex items-center justify-center gap-2 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink transition-all"
              onClick={handleShare}
            >
              <Share2 className="w-[18px] h-[18px]" /> 이 성적표 공유하기
            </button>
          )}

          {!sharedResultId && (
            <button
              type="button"
              className="w-full bg-sheet border border-grading/50 text-grading py-3.5 rounded-sheet font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-grading-soft hover:border-grading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors"
              onClick={handleCopyMessage}
            >
              <Heart className="w-[18px] h-[18px]" /> 어머니·아버지께 마음
              전하기
            </button>
          )}

          {/* 카톡 링크로는 안 닿는 채널(인스타 스토리 등)을 여는 경로 */}
          <button
            type="button"
            disabled={isSaving}
            className="w-full bg-sheet border border-ink/30 text-ink py-3.5 rounded-sheet font-bold text-[15px] flex items-center justify-center gap-2 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSaveCard}
          >
            <ImageDown className="w-[18px] h-[18px]" />
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
              className="w-full bg-sheet border border-ink/30 text-ink py-3.5 rounded-sheet font-bold text-[15px] flex items-center justify-center gap-2 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors"
            >
              <Users className="w-[18px] h-[18px] text-grading" /> 부모님께
              2교시 보내기
            </Link>
          )}
        </div>

        {/* 3순위 — 성적표 뒷면의 안내란. 버튼이 아니라 목록이다 */}
        <ul className="w-full border-y border-ink/20 divide-y divide-ink/12 pt-1">
          {!sharedResultId &&
            birthdays.father.length === 6 &&
            birthdays.mother.length === 6 && (
              <li>
                <button
                  type="button"
                  className="w-full py-3.5 flex items-center gap-3 text-left text-sm text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors"
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
                  <CalendarPlus
                    className="w-4 h-4 shrink-0 text-ink-faint"
                    aria-hidden="true"
                  />
                  <span className="flex-1">부모님 생신 캘린더에 저장</span>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 text-ink-faint"
                    aria-hidden="true"
                  />
                </button>
              </li>
            )}

          {/* 응시 이력이 없는 방문자에게 "재시험"은 누를 이유가 없는 라벨이다. */}
          {!sharedResultId && (
            <li>
              <Link
                href="/"
                onClick={resetQuiz}
                className="w-full py-3.5 flex items-center gap-3 text-sm text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors"
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
              className="w-full py-3.5 flex items-center gap-3 text-sm text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors"
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
    <div className="flex items-center gap-1.5 text-[10px]">
      <span className="w-6 text-right text-ink-faint font-bold">{label}</span>
      <div className="flex-1 h-1.5 bg-shade border border-ink/12 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="w-5 text-right text-ink-muted font-bold tabular">
        {score}
      </span>
    </div>
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
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right text-[15px] font-serif font-bold text-ink tabular">
        {score}
      </span>
    </div>
  );
}
