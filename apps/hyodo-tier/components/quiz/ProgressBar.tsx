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
    <div className="w-full px-6 py-4">
      <div className="flex justify-between items-center text-xs font-serif text-ink/70 mb-1">
        <div className="flex items-center gap-2 -my-2">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="이전 문항으로 돌아가기"
              className="-ml-2 inline-flex items-center gap-0.5 min-h-[44px] px-2 rounded-md text-ink/60 hover:text-grading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grading transition-colors"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              이전
            </button>
          )}
          <span>제 {current + 1} 문항</span>
        </div>
        <span>
          {current + 1} / {total}
        </span>
      </div>
      {/* 트랙 (회색 배경) */}
      <div className="w-full h-3 bg-stone-300 rounded-full overflow-hidden">
        {/* 게이지 (빨간색 - grading color) */}
        <div
          className="h-full bg-grading transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
