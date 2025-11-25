import { BookOpen, ChevronRight } from 'lucide-react'; // 아이콘
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-fade-in">
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

      {/* 하단: 수험번호 입력 흉내 & 시작 버튼 */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-center space-x-2 text-sm font-serif opacity-60">
          <span>성명: ______________</span>
          <span>수험번호: 1 2 3 4 5 6 7</span>
        </div>

        <Link
          href="/quiz"
          className="block w-full bg-omr text-white py-4 rounded-lg font-serif font-bold text-xl shadow-lg hover:bg-ink transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          문제지 펼치기 <ChevronRight className="w-5 h-5" />
        </Link>

        <p className="text-xs text-ink/40 mt-4">
          Designed by Hyo-Tier Committee. 2025
        </p>
      </div>
    </main>
  );
}
