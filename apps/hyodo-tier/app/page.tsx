'use client';

import { AlertCircle, BookOpen, ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useMemo, useState } from 'react';
import { useQuizStore } from '@/store/useQuizStore';

export default function Home() {
  const router = useRouter();
  const { setBirthdays } = useQuizStore();
  const [fatherDob, setFatherDob] = useState('');
  const [motherDob, setMotherDob] = useState('');
  const [error, setError] = useState('');

  const daysUntilParentsDay = useMemo(() => {
    const target = new Date('2026-05-08T00:00:00+09:00');
    const now = new Date();
    return Math.max(
      0,
      Math.ceil((target.getTime() - now.getTime()) / 86400000),
    );
  }, []);

  const handleStart = (e: React.MouseEvent) => {
    if (fatherDob.length !== 6 || motherDob.length !== 6) {
      e.preventDefault();
      setError('부모님 생년월일 6자리(YYMMDD)를 정확히 입력해주세요.');
      return;
    }
    setError('');
    setBirthdays(fatherDob, motherDob);
    router.push('/quiz');
  };

  const handleDontKnow = () => {
    router.push('/quiz');
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '결과는 어떤 기준으로 산출되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '총 14개의 문항을 통해 사용자의 답변 패턴을 분석합니다. 단순히 연락 빈도뿐만 아니라, 부모님의 취향을 얼마나 파악하고 있는지, 감정적인 교류는 어떠한지 등을 입체적으로 평가하여 알고리즘이 등급을 매깁니다.',
        },
      },
      {
        '@type': 'Question',
        name: '정말 1등급이 존재하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "'전설의 유니콘 효자' 유형은 상위 1%에 해당하는 완벽한 밸런스를 가진 사용자에게만 부여됩니다. 하지만 등급보다 중요한 것은 이 테스트를 계기로 부모님께 전화 한 통 더 드리는 마음입니다.",
        },
      },
      {
        '@type': 'Question',
        name: '개인정보는 저장되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '아니요, 효도티어는 별도의 회원가입 없이 이용 가능하며, 입력하신 모든 답변 데이터는 결과 산출 후 즉시 휘발됩니다. 안심하고 테스트를 즐겨보세요.',
        },
      },
      {
        '@type': 'Question',
        name: '부모님도 이 시험을 볼 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네, 2교시 자녀 탐구영역을 만들었습니다. 부모님께서 자식에 대해 얼마나 아시는지 14문항으로 측정하고, 결과를 자식에게 공유하면 자식도 자기 점수를 볼 수 있어요. /parent에서 응시할 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '이 부모님 퀴즈를 부모님 자서전 만들기에 활용할 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네. 부모님 탐구영역 14문항은 그대로 부모님 자서전 인터뷰의 첫 질문지로 사용할 수 있습니다. 자식이 먼저 풀어 답을 적어보고, 같은 문항을 부모님께 다시 여쭤보면 답변에 자연스럽게 옛 이야기가 따라옵니다. 자세한 인터뷰 50문항과 녹음 가이드는 /blog/parent-autobiography 글을 참고하세요.',
        },
      },
    ],
  };

  return (
    <main className="flex flex-col min-h-screen p-6 text-center animate-fade-in">
      <section className="flex flex-col items-center justify-center w-full pt-8">
        {/* 상단: 시험 정보 헤더 */}
        <div className="w-full border-b-2 border-ink pb-4 mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold bg-grading/10 text-grading px-2 py-0.5 rounded-full mb-2">
            🌸{' '}
            {daysUntilParentsDay > 0
              ? `어버이날 D-${daysUntilParentsDay}`
              : '어버이날입니다'}
          </span>
          <p className="text-sm font-serif font-bold tracking-widest mb-1">
            제1교시
          </p>
          <h1 className="text-4xl font-serif font-black tracking-tighter">
            부모님 탐구영역
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
              {`"당신은 부모님에 대해\n얼마나 알고 있습니까?"`}
            </h2>
            <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line">
              {`이 시험은 단순한 심리테스트가 아닙니다.\n당신의 효도 등급을 냉정하게 판독합니다.\n\n`}
              <span className="text-grading font-bold">
                ※ 주의: 뼈 맞을 수 있음
              </span>
            </p>
          </div>
        </div>

        {/* 하단: 수험번호 입력 & 시작 버튼 */}
        <div className="w-full space-y-6">
          {/* 입력 폼: 시험지 스타일로 변경 */}
          <div className="flex flex-col items-center justify-center gap-3 text-ink font-serif">
            {/* 수험번호 입력 */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-m">수험번호:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="tel"
                    maxLength={6}
                    placeholder="父 YYMMDD"
                    value={fatherDob}
                    onChange={(e) =>
                      setFatherDob(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="w-24 bg-transparent border-b-2 border-ink text-center text-m tracking-widest placeholder:text-ink/20 focus:outline-none focus:border-grading transition-colors"
                  />
                  <span className="font-bold">-</span>
                  <input
                    type="tel"
                    maxLength={6}
                    placeholder="母 YYMMDD"
                    value={motherDob}
                    onChange={(e) =>
                      setMotherDob(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="w-24 bg-transparent border-b-2 border-ink text-center text-m tracking-widest placeholder:text-ink/20 focus:outline-none focus:border-grading transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="text-xs text-grading font-bold flex items-center gap-1 animate-fade-in mt-2">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleStart}
              className="w-full bg-omr text-white py-4 rounded-lg font-serif font-bold text-xl shadow-lg hover:bg-ink transition-all flex items-center justify-center gap-2"
            >
              문제지 펼치기 <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleDontKnow}
              className="text-xs text-ink/50 underline hover:text-grading transition-colors"
            >
              부모님 생신을 모르겠어요... 그래도 응시하기
            </button>
          </div>

          {/* 부모님 편 역방향 링크 */}
          <div className="pt-2">
            <Link
              href="/parent"
              className="flex items-center justify-center gap-2 w-full border border-ink/20 bg-white/60 text-ink/70 px-4 py-3 rounded-lg text-sm hover:bg-white/80 hover:text-ink transition-all"
            >
              <Users className="w-4 h-4 text-grading" />
              부모님이세요? 🌸 → 2교시 자녀 탐구영역 응시하러 가기
            </Link>
          </div>

          <p className="text-xs text-ink/60 mt-4">
            Designed by Hyo-Do-Tier Committee. 2026
          </p>
        </div>
      </section>

      <section className="mt-16 px-6 py-10 border-t border-ink/10 text-left space-y-8 bg-stone-100/50">
        {/* 서비스 소개 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-ink">
            📌 효도티어란 무엇인가요?
          </h3>
          <p className="text-sm text-ink/70 leading-relaxed break-keep">
            &apos;2026학년도 대국민 효도능력시험&apos;은 단순한 심리 테스트를
            넘어, 현대 사회에서 점차 잊혀가는 효(孝)의 가치를 재미있게 재해석한
            자기 진단 서비스입니다. 부모님에 대한 관심도, 친밀도, 그리고
            표현력을 종합적으로 분석하여 총 8가지의 독창적인 캐릭터 유형으로
            결과를 제공합니다.
          </p>
        </div>

        {/* FAQ 형태의 텍스트 콘텐츠 */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-ink">
            자주 묻는 질문 (FAQ)
          </h3>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink/90">
              Q. 결과는 어떤 기준으로 산출되나요?
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed">
              총 14개의 문항을 통해 사용자의 답변 패턴을 분석합니다. 단순히 연락
              빈도뿐만 아니라, 부모님의 취향을 얼마나 파악하고 있는지, 감정적인
              교류는 어떠한지 등을 입체적으로 평가하여 알고리즘이 등급을
              매깁니다.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink/90">
              Q. 정말 1등급이 존재하나요?
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed">
              네, 존재합니다. &apos;전설의 유니콘 효자&apos; 유형은 상위 1%에
              해당하는 완벽한 밸런스를 가진 사용자에게만 부여됩니다. 하지만
              등급보다 중요한 것은 이 테스트를 계기로 부모님께 전화 한 통 더
              드리는 마음입니다.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink/90">
              Q. 개인정보는 저장되나요?
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed">
              아니요, 효도티어는 별도의 회원가입 없이 이용 가능하며, 입력하신
              모든 답변 데이터는 결과 산출 후 즉시 휘발됩니다. 안심하고 테스트를
              즐겨보세요.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink/90">
              Q. 부모님도 이 시험을 볼 수 있나요?
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed">
              네, 2교시 &apos;자녀 탐구영역&apos;을 만들었습니다. 부모님께서
              자식에 대해 얼마나 아시는지 14문항으로 측정하고, 결과를 자식에게
              공유하면 자식도 자기 점수를 볼 수 있어요.{' '}
              <Link
                href="/parent"
                className="text-grading underline hover:text-ink transition-colors"
              >
                2교시 응시하러 가기 →
              </Link>
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-ink/90">
              Q. 이 부모님 퀴즈를 부모님 자서전 만들기에 활용할 수 있나요?
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed">
              네. &apos;부모님 탐구영역&apos; 14문항은 그대로 부모님 자서전
              인터뷰의 첫 질문지로 사용할 수 있습니다. 자식이 먼저 풀어 답을
              적어보고, 같은 문항을 부모님께 다시 여쭤보면 답변에 자연스럽게 옛
              이야기가 따라옵니다.{' '}
              <Link
                href="/blog/parent-autobiography"
                className="text-grading underline hover:text-ink transition-colors"
              >
                부모님 자서전 인터뷰 가이드 보기 →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-ink/60 pt-4 border-t border-ink/5">
          본 서비스는 엔터테인먼트 목적으로 제작되었으며, 전문적인 심리 상담
          결과를 대체할 수 없습니다.
        </p>
      </section>

      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
