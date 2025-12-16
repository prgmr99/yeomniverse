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
