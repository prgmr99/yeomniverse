import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '서비스 소개',
  description:
    '효도티어는 MZ세대를 위한 재미있고 의미있는 효도 자가진단 서비스입니다. 관심도, 친밀도, 표현력 3가지 지표로 부모님과의 관계를 분석합니다.',
  keywords: [
    '효도티어 소개',
    '서비스 소개',
    '효도 진단',
    '부모님과의 관계',
    'MZ세대 효도',
  ],
  openGraph: {
    title: '효도티어 서비스 소개',
    description:
      '효도티어는 MZ세대를 위한 재미있고 의미있는 효도 자가진단 서비스입니다.',
    url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/about`,
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper p-6 animate-fade-in pb-20">
      <header className="mb-8 border-b-2 border-ink pb-4">
        <h1 className="text-3xl font-serif font-black text-ink mb-2">
          효도티어 서비스 소개
        </h1>
        <p className="text-sm text-ink/60 font-sans">
          About Hyo-Do-Tier Service
        </p>
      </header>

      <article className="space-y-10">
        {/* 1. 개발 배경 */}
        <section>
          <h2 className="text-xl font-serif font-bold text-ink mb-4 flex items-center gap-2">
            <span className="text-grading">01.</span> 개발 배경
          </h2>
          <div className="bg-white p-6 rounded-xl border border-ink/10 shadow-sm">
            <p className="text-ink/80 leading-relaxed text-sm whitespace-pre-line">
              {`"부모님께 마지막으로 사랑한다고 말한 게 언제인가요?"

현대 사회를 살아가는 우리는 너무나 바쁩니다. 학업, 취업, 직장 생활 등 치열한 경쟁 속에서 정작 가장 소중한 존재인 '부모님'은 우선순위에서 밀려나곤 합니다.

효도티어는 이러한 안타까운 현실에서 출발했습니다. 무겁고 진지한 '효도'라는 주제를 MZ세대가 좋아하는 '게임'과 '등급(Tier)' 시스템에 접목시켜, 누구나 쉽고 재미있게 자신의 효도 상태를 점검하고 반성할 수 있는 기회를 만들고자 했습니다.`}
            </p>
          </div>
        </section>

        {/* 2. 알고리즘 원리 */}
        <section>
          <h2 className="text-xl font-serif font-bold text-ink mb-4 flex items-center gap-2">
            <span className="text-grading">02.</span> 알고리즘 원리
          </h2>
          <div className="bg-white p-6 rounded-xl border border-ink/10 shadow-sm">
            <p className="text-ink/80 leading-relaxed text-sm mb-4">
              효도티어의 등급 산정 시스템은 심리학적 행동 분석 모델을 기반으로
              설계되었습니다. 단순히 연락 횟수만을 측정하는 것이 아니라, 다음
              3가지 핵심 지표를 종합적으로 분석합니다.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-grading min-w-[40px]">
                  관심도
                </span>
                <span className="text-ink/70">
                  부모님의 기호, 건강 상태, 일정 등을 얼마나 정확히 인지하고
                  있는지 측정 (Knowledge)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-grading min-w-[40px]">
                  친밀도
                </span>
                <span className="text-ink/70">
                  정서적 교류의 깊이와 대화의 질을 분석 (Intimacy)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-grading min-w-[40px]">
                  표현력
                </span>
                <span className="text-ink/70">
                  실질적인 행동(전화, 선물, 방문 등)으로 마음을 표현하는 빈도
                  측정 (Action)
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. 비전 */}
        <section>
          <h2 className="text-xl font-serif font-bold text-ink mb-4 flex items-center gap-2">
            <span className="text-grading">03.</span> 우리의 비전
          </h2>
          <div className="bg-stone-800 text-white p-6 rounded-xl shadow-md">
            <p className="leading-relaxed text-sm font-medium text-center">
              &quot;전 국민이 1등급 효자가 되는 그날까지&quot;
            </p>
            <p className="mt-4 text-xs text-stone-400 leading-relaxed text-center">
              효도티어는 단순한 일회성 테스트로 끝나지 않기를 바랍니다. 이
              서비스를 통해 단 한 명이라도 부모님께 전화를 걸고, 사랑한다고
              말하게 된다면 우리의 목표는 달성된 것입니다.
            </p>
          </div>
        </section>

        {/* 하단 링크 */}
        <div className="pt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-grading text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-all"
          >
            내 효도 등급 확인하러 가기
          </Link>
        </div>
      </article>
    </main>
  );
}
