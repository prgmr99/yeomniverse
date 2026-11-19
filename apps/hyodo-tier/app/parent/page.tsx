'use client';

import { trackEvent } from '@hyo/ui';
import { PARENT_QUESTION_COUNT } from '@hyo/utils';
import {
  AlertCircle,
  ChevronRight,
  Flower2,
  Info,
  MessageCircleQuestion,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { digitsOnly, isValidYymmdd } from '@/lib/birthday';
import { getParentsDayBadge } from '@/lib/parentsDay';
import { useParentQuizStore } from '@/store/useParentQuizStore';

export default function ParentHome() {
  const router = useRouter();
  const { setChildProfile } = useParentQuizStore();
  const [childName, setChildName] = useState('');
  const [childBirthday, setChildBirthday] = useState('');
  const [error, setError] = useState('');

  // 프리렌더 시점에 날짜가 고정되지 않도록 클라이언트에서 계산한다.
  const [parentsDayBadge, setParentsDayBadge] = useState<string | null>(null);
  useEffect(() => {
    setParentsDayBadge(getParentsDayBadge());
  }, []);

  const handleStart = () => {
    if (childName.trim().length === 0) {
      setError('자녀 이름을 입력해주세요.');
      return;
    }
    if (!isValidYymmdd(childBirthday)) {
      setError('자녀 생년월일을 YYMMDD 6자리로 정확히 입력해주세요.');
      return;
    }

    setError('');
    setChildProfile(childName.trim(), childBirthday);
    trackEvent('quiz_start', { mode: 'parent', with_birthday: true });
    router.push('/parent/quiz');
  };

  const handleDontKnow = () => {
    trackEvent('quiz_start', { mode: 'parent', with_birthday: false });
    router.push('/parent/quiz');
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '부모용 시험은 자식용과 어떻게 다른가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${PARENT_QUESTION_COUNT}문항 구조는 동일하지만, 질문의 관점과 결과 유형이 다릅니다. 자식용(1교시)은 부모님에 대한 관심도를 측정하고, 부모용(2교시)은 자식에 대한 이해와 소통 방식을 분석하여 8가지 부모 유형 중 하나를 제시합니다.`,
        },
      },
      {
        '@type': 'Question',
        name: '결과를 자식에게 어떻게 보여주나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '카카오톡 공유 버튼을 누르면 자식에게 링크를 보낼 수 있습니다. 자식이 링크를 타고 들어와 자기 편 테스트를 마치면, 결과 화면에서 부모님 점수와 나란히 비교해볼 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '개인정보는 저장되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '아니요, 효도티어는 별도의 회원가입 없이 이용 가능합니다. 자녀 이름과 생년월일을 포함한 모든 답변 데이터는 세션 종료 후 즉시 휘발됩니다. 안심하고 테스트를 즐겨보세요.',
        },
      },
    ],
  };

  return (
    <main className="flex flex-col min-h-screen p-6 text-center animate-fade-in">
      <section className="flex flex-col items-center justify-center w-full pt-8">
        {/* 상단: 시험지 표제부 */}
        <div className="w-full border-b-[3px] border-ink pb-3 mb-6">
          <div className="min-h-[24px] mb-2">
            {parentsDayBadge && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-bold text-grading border border-grading/35 px-2 py-0.5 rounded-sheet">
                <Flower2 className="w-3 h-3" aria-hidden="true" />
                {parentsDayBadge}
              </span>
            )}
          </div>
          <p className="text-[13px] font-serif font-bold tracking-[0.4em] indent-[0.4em] text-ink-muted mb-1">
            제 2 교시
          </p>
          <h1 className="text-[2.6rem] leading-[1.1] font-serif font-black">
            자녀 탐구영역
          </h1>
          <div className="flex justify-between items-end mt-3">
            <span className="text-[11px] font-sans font-bold tracking-widest bg-omr text-paper px-2 py-1 rounded-sheet">
              홀수형
            </span>
            <span className="text-base font-serif font-bold text-ink-muted">
              효도티어
            </span>
          </div>
        </div>

        {/* 메인: 지시문 — 카드가 아니라 시험지에 인쇄된 블록이다 */}
        <div className="w-full py-2 mb-8">
          <div className="border-y border-ink/25 py-7 px-1 text-center">
            <h2 className="text-[1.35rem] leading-snug font-serif font-bold mb-4 whitespace-pre-line text-balance">
              {`"당신은 자식에 대해\n얼마나 알고 있습니까?"`}
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
              {`이 시험은 단순한 심리테스트가 아닙니다.\n자식을 얼마나 이해하는지 냉정하게 판독합니다.`}
            </p>
            {/* 채점자가 나중에 덧붙인 빨간 펜 주석처럼 */}
            <p className="mt-5 inline-block -rotate-1 border-b-2 border-grading/50 text-grading font-bold text-sm pb-0.5">
              ※ 주의: 자식 얼굴이 자꾸 아른거릴 수 있음
            </p>
          </div>
        </div>

        {/* 하단: 자녀 정보 입력 & 시작 버튼 */}
        <div className="w-full space-y-6">
          <fieldset className="w-full space-y-3 text-ink font-serif">
            <legend className="w-full text-center text-base font-bold mb-3">
              수험번호{' '}
              <span className="font-sans text-xs font-normal text-ink-muted">
                (자녀 정보)
              </span>
            </legend>

            <div className="flex items-end justify-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <label
                  htmlFor="child-name"
                  className="text-xs font-sans font-bold text-ink-muted"
                >
                  자녀 이름
                </label>
                {/* 이름은 자릿수가 정해져 있지 않아 칸이 아니라 한 줄 괘선으로 받는다 */}
                <input
                  id="child-name"
                  type="text"
                  autoComplete="off"
                  maxLength={10}
                  placeholder="홍길동"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'child-error' : 'child-help'}
                  className="w-[6.5em] py-2 bg-transparent border-b-2 border-ink text-center text-lg rounded-none placeholder:text-ink-faint focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-grading transition-colors"
                />
              </div>

              <span
                aria-hidden="true"
                className="pb-2 font-bold text-ink-faint"
              >
                –
              </span>

              <div className="flex flex-col items-center gap-1.5">
                <label
                  htmlFor="child-dob"
                  className="text-xs font-sans font-bold text-ink-muted"
                >
                  생년월일
                </label>
                <input
                  id="child-dob"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={6}
                  placeholder="YYMMDD"
                  value={childBirthday}
                  onChange={(e) =>
                    setChildBirthday(digitsOnly(e.target.value, 6))
                  }
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'child-error' : 'child-help'}
                  className="entry-cells tabular w-[8.4em] py-2 bg-transparent text-left text-lg tracking-[0.85em] indent-[0.425em] rounded-none placeholder:tracking-[0.42em] placeholder:text-ink-faint focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-grading transition-colors"
                />
              </div>
            </div>

            <p
              id="child-help"
              className="text-xs font-sans text-ink-faint text-center leading-relaxed"
            >
              생년월일은 6자리로 입력하세요 (예: 950412). 결과를 자녀에게 보낼
              때 쓰입니다.
            </p>

            {error && (
              <p
                id="child-error"
                role="alert"
                className="text-xs font-sans text-grading font-bold flex items-center justify-center gap-1 animate-fade-in"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </p>
            )}
          </fieldset>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleStart}
              className="relative w-full bg-ink text-paper py-4 rounded-sheet font-serif font-bold text-xl shadow-[0_1px_2px_rgba(0,0,0,0.2),0_6px_16px_-8px_rgba(0,0,0,0.5)] hover:bg-graphite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors flex items-center justify-center"
            >
              문제지 펼치기
              <ChevronRight className="absolute right-5 w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleDontKnow}
              className="group w-full min-h-[56px] px-4 py-3 rounded-sheet border border-ink/30 bg-sheet text-left flex items-center gap-3 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors"
            >
              {/* 체크박스를 찍어 스스로 신고하는 모양 — OMR 마킹과 같은 동작이다 */}
              <span
                aria-hidden="true"
                className="shrink-0 w-6 h-6 rounded-mark border-[1.5px] border-ink/40 group-hover:border-graphite group-hover:bg-graphite transition-colors"
              />
              <span className="flex flex-col">
                <span className="text-sm text-ink">
                  저는 자식 생일을 모릅니다
                </span>
                <span className="text-xs text-ink-faint mt-0.5">
                  사람이니까요 — 그대로 응시
                </span>
              </span>
            </button>
          </div>

          {/* 자식 편 역방향 링크 */}
          <div className="pt-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full border-y border-ink/20 text-ink-muted px-4 py-3.5 text-sm hover:text-ink hover:border-ink/40 transition-colors"
            >
              <Users className="w-4 h-4 text-grading shrink-0" />
              자식이세요? 1교시 부모님 탐구영역 응시하러 가기
            </Link>
          </div>

          <p className="text-xs text-ink-faint mt-4">
            Designed by Hyo-Do-Tier Committee · 부모편. 2026
          </p>
        </div>
      </section>

      <section className="mt-16 px-6 py-10 border-t border-ink/20 text-left space-y-8 bg-shade">
        {/* 서비스 소개 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2">
            <Info
              className="w-[18px] h-[18px] text-grading shrink-0"
              aria-hidden="true"
            />
            2교시 자녀 탐구영역이란?
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed break-keep">
            &apos;2교시 자녀 탐구영역&apos;은 부모님이 자식에 대해 얼마나 알고
            계신지를 {PARENT_QUESTION_COUNT}개의 문항으로 측정합니다. 자식의
            관심사, 생활 패턴, 소통 방식에 대한 이해를 종합적으로 분석하여 8가지
            부모 유형 중 하나를 제시합니다. 결과를 자식에게 공유하면, 자식도
            본인 편 테스트를 풀고 서로의 성적표를 비교해볼 수 있습니다.
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2">
            <MessageCircleQuestion
              className="w-[18px] h-[18px] text-grading shrink-0"
              aria-hidden="true"
            />
            자주 묻는 질문 (FAQ)
          </h3>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink">
              Q. 부모용 시험은 자식용과 어떻게 다른가요?
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              {PARENT_QUESTION_COUNT}문항 구조는 동일하지만, 질문의 관점과 결과
              유형이 다릅니다. 자식용(1교시)은 부모님에 대한 관심도를 측정하고,
              부모용(2교시)은 자식에 대한 이해와 소통 방식을 분석하여 8가지 부모
              유형 중 하나를 제시합니다.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink">
              Q. 결과를 자식에게 어떻게 보여주나요?
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              카카오톡 공유 버튼을 누르면 자식에게 링크를 보낼 수 있습니다.
              자식이 링크를 타고 들어와 자기 편 테스트를 마치면, 결과 화면에서
              부모님 점수와 나란히 비교해볼 수 있습니다.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink">
              Q. 개인정보는 저장되나요?
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              아니요, 효도티어는 별도의 회원가입 없이 이용 가능합니다. 자녀
              이름과 생년월일을 포함한 모든 답변 데이터는 세션 종료 후 즉시
              휘발됩니다. 안심하고 테스트를 즐겨보세요.
            </p>
          </div>
        </div>

        <p className="text-xs text-ink-faint pt-4 border-t border-ink/15">
          본 서비스는 엔터테인먼트 목적으로 제작되었으며, 전문적인 심리 상담
          결과를 대체할 수 없습니다.
        </p>
      </section>

      <Script
        id="parent-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
