'use client';

import { AlertCircle, BookOpen, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [fatherDob, setFatherDob] = useState('');
  const [motherDob, setMotherDob] = useState('');
  const [error, setError] = useState('');

  const handleStart = (e: React.MouseEvent) => {
    if (!name.trim()) {
      e.preventDefault();
      setError('성명을 입력해주세요.');
      return;
    }
    if (fatherDob.length !== 6 || motherDob.length !== 6) {
      e.preventDefault();
      setError('부모님의 주민번호 앞자리(6자리)를 정확히 입력해주세요.');
      return;
    }
    setError('');
    router.push('/quiz');
  };

  const handleDontKnow = () => {
    router.push('/result?result=UNFILIAL');
  };

  return (
    <main className="flex flex-col min-h-screen p-6 text-center animate-fade-in">
      <section className="flex flex-col items-center justify-center w-full pt-8">
        {/* 상단: 시험 정보 헤더 */}
        <div className="w-full border-b-2 border-ink pb-4 mb-4">
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
            {/* 성명 입력 */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-m">성명:</span>
              <input
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-24 bg-transparent border-b-2 border-ink text-center text-lg placeholder:text-ink/20 focus:outline-none focus:border-grading transition-colors"
              />
            </div>

            {/* 수험번호 입력 */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-m">수험번호:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="앞 6자리"
                    value={fatherDob}
                    onChange={(e) =>
                      setFatherDob(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="w-24 bg-transparent border-b-2 border-ink text-center text-m tracking-widest placeholder:text-ink/20 focus:outline-none focus:border-grading transition-colors"
                  />
                  <span className="font-bold">-</span>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="뒤 6자리"
                    value={motherDob}
                    onChange={(e) =>
                      setMotherDob(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    className="w-24 bg-transparent border-b-2 border-ink text-center text-m tracking-widest placeholder:text-ink/20 focus:outline-none focus:border-grading transition-colors"
                  />
                </div>
              </div>
              {/* 힌트 텍스트 */}
              <div className="flex gap-4 text-[10px] opacity-50 pl-16">
                <span className="w-24 text-center">(父 생신)</span>
                <span className="w-24 text-center">(母 생신)</span>
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
              부모님 생신을 모르겠어요... (응시 포기)
            </button>
          </div>

          <p className="text-xs text-ink/40 mt-4">
            Designed by Hyo-Do-Tier Committee. 2025
          </p>
        </div>
      </section>

      {/* 구글 봇을 위한 긴 텍스트 섹션 (위키백과 스타일) */}
      <section className="mt-20 px-6 py-12 bg-white border-t-2 border-stone-200 text-left">
        <article className="prose prose-stone max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-stone-800">
            2025년, 현대 사회에서 재정의된 효(孝)의 가치
          </h2>

          <h3 className="text-xl font-bold mt-8 mb-4">
            1. 디지털 시대의 효도 트렌드 변화
          </h3>
          <p className="text-stone-600 leading-relaxed mb-4 text-sm">
            과거의 효도가 물리적인 봉양과 동거를 의미했다면, 2025년 현재의
            효도는 &apos;정서적 연결&apos;과 &apos;디지털 소통&apos;으로 그
            패러다임이 완전히 전환되었습니다. 통계청 자료에 따르면, 부모 세대가
            자녀에게 가장 원하는 것은 현금보다 &apos;자주 하는 안부 전화&apos;와
            &apos;공감&apos;인 것으로 나타났습니다. &apos;효도티어
            테스트&apos;는 이러한 사회적 흐름을 반영하여 설계되었습니다.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">
            2. 심리학적 관점에서 본 부모-자녀 관계
          </h3>
          <p className="text-stone-600 leading-relaxed mb-4 text-sm">
            부모와 자녀 사이의 유대감은 쌍방향적 소통에서 비롯됩니다. 단순히
            용돈을 드리는 행위보다, 부모님의 기호를 파악하고(예: 좋아하는 음식,
            취미 등) 사소한 일상을 공유하는 것이 관계 만족도를 300% 이상
            높인다는 연구 결과가 있습니다. 본 서비스는 14가지 정밀 질문을 통해
            당신의 행동 패턴을 분석합니다.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">
            3. 효도 등급(Tier) 시스템의 이해
          </h3>
          <p className="text-stone-600 leading-relaxed mb-4 text-sm">
            게임의 랭킹 시스템을 차용한 &apos;효도티어&apos;는 불효자(Iron)부터
            전설의 효자(Challenger)까지 총 8단계로 구분됩니다. 이는 타인과의
            경쟁을 위한 것이 아니라, 현재 나의 위치를 객관적으로 파악하고 더
            나은 관계를 맺기 위한 동기 부여를 제공하는 데 목적이 있습니다.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">
            4. 테스트 결과 활용 가이드
          </h3>
          <p className="text-stone-600 leading-relaxed mb-4 text-sm">
            결과 페이지에서는 단순한 등급 확인을 넘어, 유형별 맞춤 효도 솔루션을
            제공합니다. 무뚝뚝한 부모님에게 다가가는 법, 멀리 떨어져 사는 경우의
            소통법 등 실질적인 행동 지침(Action Plan)을 확인해 보세요.
          </p>
        </article>
      </section>

      <section className="mt-16 px-6 py-10 border-t border-ink/10 text-left space-y-8 bg-stone-100/50">
        {/* 서비스 소개 */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-ink">
            📌 효도티어란 무엇인가요?
          </h3>
          <p className="text-sm text-ink/70 leading-relaxed break-keep">
            &apos;2025학년도 대국민 효도능력시험&apos;은 단순한 심리 테스트를
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
        </div>

        <p className="text-xs text-ink/30 pt-4 border-t border-ink/5">
          본 서비스는 엔터테인먼트 목적으로 제작되었으며, 전문적인 심리 상담
          결과를 대체할 수 없습니다.
        </p>
      </section>
    </main>
  );
}
