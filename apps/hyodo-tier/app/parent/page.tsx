'use client';

import { PARENT_QUESTION_COUNT } from '@hyo/utils';
import { AlertCircle, BookOpen, ChevronRight, Users } from 'lucide-react';
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
    router.push('/parent/quiz');
  };

  const handleDontKnow = () => {
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
        {/* 상단: 시험 정보 헤더 */}
        <div className="w-full border-b-2 border-ink pb-4 mb-4">
          <div className="min-h-[26px] mb-2">
            {parentsDayBadge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold bg-grading/10 text-grading px-2 py-0.5 rounded-full">
                🌸 {parentsDayBadge}
              </span>
            )}
          </div>
          <p className="text-sm font-serif font-bold tracking-widest mb-1">
            제2교시
          </p>
          <h1 className="text-4xl font-serif font-black tracking-tighter">
            자녀 탐구영역
          </h1>
          <div className="flex justify-between items-end mt-2 px-2">
            <span className="text-xs font-sans bg-omr text-white px-2 py-0.5 rounded-sm">
              홀수형
            </span>
            <span className="text-lg font-serif font-bold">효도티어</span>
          </div>
        </div>

        {/* 메인: 설명 텍스트 */}
        <div className="space-y-4 py-8">
          <div className="bg-white/50 border border-ink/10 p-6 rounded-lg shadow-sm backdrop-blur-sm">
            <BookOpen className="w-10 h-10 mx-auto mb-4 text-grading opacity-80" />
            <h2 className="text-xl font-serif font-bold mb-2 whitespace-pre-line">
              {`"당신은 자식에 대해\n얼마나 알고 있습니까?"`}
            </h2>
            <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line">
              {`이 시험은 단순한 심리테스트가 아닙니다.\n자식을 얼마나 이해하는지 냉정하게 판독합니다.\n\n`}
              <span className="text-grading font-bold">
                ※ 주의: 자식 얼굴이 자꾸 아른거릴 수 있음
              </span>
            </p>
          </div>
        </div>

        {/* 하단: 자녀 정보 입력 & 시작 버튼 */}
        <div className="w-full space-y-6">
          <fieldset className="w-full space-y-3 text-ink font-serif">
            <legend className="w-full text-center text-base font-bold mb-3">
              수험번호 (자녀 정보)
            </legend>

            <div className="flex items-end justify-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <label
                  htmlFor="child-name"
                  className="text-xs font-sans font-bold text-ink/60"
                >
                  자녀 이름
                </label>
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
                  className="w-32 py-2 bg-transparent border-b-2 border-ink text-center text-base rounded-sm placeholder:text-ink/25 focus:outline-none focus:border-grading focus-visible:ring-2 focus-visible:ring-grading/50 transition-colors"
                />
              </div>

              <span aria-hidden="true" className="pb-2 font-bold text-ink/40">
                –
              </span>

              <div className="flex flex-col items-center gap-1.5">
                <label
                  htmlFor="child-dob"
                  className="text-xs font-sans font-bold text-ink/60"
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
                  className="w-32 py-2 bg-transparent border-b-2 border-ink text-center text-base tracking-[0.2em] rounded-sm placeholder:text-ink/25 focus:outline-none focus:border-grading focus-visible:ring-2 focus-visible:ring-grading/50 transition-colors"
                />
              </div>
            </div>

            <p
              id="child-help"
              className="text-xs font-sans text-ink/50 text-center leading-relaxed"
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
              className="w-full bg-omr text-white py-4 rounded-lg font-serif font-bold text-xl shadow-lg hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-all flex items-center justify-center gap-2"
            >
              문제지 펼치기 <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleDontKnow}
              className="w-full min-h-[52px] px-4 rounded-lg border-2 border-ink/15 bg-white/50 text-ink/70 text-sm font-sans hover:bg-white/80 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-all"
            >
              자식 생일을 모릅니다 — 그래도 응시하기
            </button>
          </div>

          {/* 자식 편 역방향 링크 */}
          <div className="pt-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full border border-ink/20 bg-white/60 text-ink/70 px-4 py-3 rounded-lg text-sm hover:bg-white/80 hover:text-ink transition-all"
            >
              <Users className="w-4 h-4 text-grading" />
              자식이세요? → 1교시 부모님 탐구영역 응시하러 가기
            </Link>
          </div>

          <p className="text-xs text-ink/60 mt-4">
            Designed by Hyo-Do-Tier Committee · 부모편. 2026
          </p>
        </div>
      </section>

      <section className="mt-16 px-6 py-10 border-t border-ink/10 text-left space-y-8 bg-stone-100/50">
        {/* 서비스 소개 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-ink">
            📌 2교시 자녀 탐구영역이란?
          </h3>
          <p className="text-sm text-ink/70 leading-relaxed break-keep">
            &apos;2교시 자녀 탐구영역&apos;은 부모님이 자식에 대해 얼마나 알고
            계신지를 {PARENT_QUESTION_COUNT}개의 문항으로 측정합니다. 자식의
            관심사, 생활 패턴, 소통 방식에 대한 이해를 종합적으로 분석하여 8가지
            부모 유형 중 하나를 제시합니다. 결과를 자식에게 공유하면, 자식도
            본인 편 테스트를 풀고 서로의 성적표를 비교해볼 수 있습니다.
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-ink">
            자주 묻는 질문 (FAQ)
          </h3>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink/90">
              Q. 부모용 시험은 자식용과 어떻게 다른가요?
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed">
              {PARENT_QUESTION_COUNT}문항 구조는 동일하지만, 질문의 관점과 결과
              유형이 다릅니다. 자식용(1교시)은 부모님에 대한 관심도를 측정하고,
              부모용(2교시)은 자식에 대한 이해와 소통 방식을 분석하여 8가지 부모
              유형 중 하나를 제시합니다.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink/90">
              Q. 결과를 자식에게 어떻게 보여주나요?
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed">
              카카오톡 공유 버튼을 누르면 자식에게 링크를 보낼 수 있습니다.
              자식이 링크를 타고 들어와 자기 편 테스트를 마치면, 결과 화면에서
              부모님 점수와 나란히 비교해볼 수 있습니다.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink/90">
              Q. 개인정보는 저장되나요?
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed">
              아니요, 효도티어는 별도의 회원가입 없이 이용 가능합니다. 자녀
              이름과 생년월일을 포함한 모든 답변 데이터는 세션 종료 후 즉시
              휘발됩니다. 안심하고 테스트를 즐겨보세요.
            </p>
          </div>
        </div>

        <p className="text-xs text-ink/60 pt-4 border-t border-ink/5">
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
