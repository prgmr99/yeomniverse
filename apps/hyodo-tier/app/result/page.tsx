'use client';

import { Loading } from '@hyo/ui';
import { BookOpen, CalendarPlus, Heart, RotateCcw, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useKakaoShare } from '@/hooks/useKakaoShare';
import { calculateResult } from '@/lib/calculateResult';
import { PARENT_RESULTS } from '@/lib/parentResultData';
import { RESULTS } from '@/lib/resultData';
import { useQuizStore } from '@/store/useQuizStore';

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

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    scores: storeScores,
    flags,
    resetQuiz,
    currentStep,
    birthdays,
  } = useQuizStore();
  const [isReady, setIsReady] = useState(false); // 클라이언트 렌더링 준비 여부

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

  if (!isReady) return <Loading />; // 리다이렉트 중 깜빡임 방지 및 푸터 점프 방지

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
          2026학년도 효도능력시험 성적표
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
          <div className="border-[6px] border-grading text-grading rounded-xl px-6 py-2 text-6xl font-black font-serif opacity-0 animate-stamp-move whitespace-nowrap bg-paper/90 backdrop-blur-sm shadow-xl">
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
                  score={parentScores.interest}
                  color="bg-blue-300"
                />
                <MiniBar
                  label="친밀"
                  score={parentScores.intimacy}
                  color="bg-pink-300"
                />
                <MiniBar
                  label="표현"
                  score={parentScores.expression}
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
                  score={scores.interest}
                  color="bg-blue-300"
                />
                <MiniBar
                  label="친밀"
                  score={scores.intimacy}
                  color="bg-pink-300"
                />
                <MiniBar
                  label="표현"
                  score={scores.expression}
                  color="bg-yellow-300"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-ink/60 leading-relaxed text-center">
            {(() => {
              const childTotal =
                scores.interest + scores.intimacy + scores.expression;
              const parentTotal =
                parentScores.interest +
                parentScores.intimacy +
                parentScores.expression;
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
      <div className="w-full space-y-3 pt-4">
        <button
          type="button"
          className="w-full bg-[#FEE500] text-[#191919] py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all text-lg"
          onClick={shareKakao}
        >
          <Share2 className="w-5 h-5" /> 부모님께 공유하기
        </button>

        {!sharedResultId && (
          <div className="w-full space-y-3 pt-2">
            <button
              type="button"
              className="w-full bg-grading/10 text-grading border-2 border-grading/30 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-grading/20 transition-all"
              onClick={async () => {
                const message =
                  '엄마, 아빠. 오늘 효도티어 테스트를 해봤어요. 평소에 표현은 잘 못했지만, 두 분께 정말 감사하고 사랑한다고 꼭 전하고 싶었어요. 항상 건강하세요. 🌸';
                await navigator.clipboard.writeText(message);
                alert(
                  '마음을 담은 메시지가 복사됐어요. 부모님께 카톡으로 붙여넣어 보내보세요.',
                );
              }}
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

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/"
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

export default function ResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultContent />
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
  const percent = Math.min(Math.max((score / 100) * 100, 5), 100);
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
