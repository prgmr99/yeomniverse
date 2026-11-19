import { ChevronLeft } from 'lucide-react';

interface ProgressBarProps {
  current: number; // 현재 문제 번호 (0부터)
  total: number; // 전체 문제 수
  onPrev?: () => void; // 있으면 이전 문항 버튼을 노출한다
}

export default function ProgressBar({
  current,
  total,
  onPrev,
}: ProgressBarProps) {
  // 진행률 계산 (%)
  const progress = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full px-6 pt-4 pb-3 border-b border-ink/15 bg-paper/95 backdrop-blur-[2px] sticky top-0 z-20">
      <div className="flex justify-between items-center text-xs font-serif text-ink-muted mb-2">
        <div className="flex items-center gap-2 -my-2">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="이전 문항으로 돌아가기"
              className="-ml-2 inline-flex items-center gap-0.5 min-h-[44px] px-2 rounded-sheet text-ink-muted hover:text-grading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading pressable"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              이전
            </button>
          )}
          <span className="tabular">제 {current + 1} 문항</span>
        </div>
        <span className="tabular tracking-wide">
          {current + 1} / {total}
        </span>
      </div>
      {/* 답안지 상단의 진행 괘선 — 채운 쪽은 연필(그래파이트)이다 */}
      <div className="w-full h-[6px] bg-shade border border-ink/15 overflow-hidden">
        <div
          className="h-full bg-graphite transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
