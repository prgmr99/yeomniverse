interface ProgressBarProps {
  current: number; // 현재 문제 번호 (0부터)
  total: number; // 전체 문제 수
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  // 진행률 계산 (%)
  const progress = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full px-6 py-4">
      <div className="flex justify-between text-xs font-serif text-ink/50 mb-1">
        <span>제 {current + 1} 문항</span>
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
