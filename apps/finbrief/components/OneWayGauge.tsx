'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface OneWayGaugeProps {
  score: number;
  direction: 'bull' | 'bear' | 'neutral';
  label: string;
  components?: {
    adx: number;
    maAlignment: number;
    rsiTrend: number;
    bbWidth: number;
    vix: number;
    volume: number;
  };
}

function getIntensityColor(score: number): string {
  if (score < 20) return '#86868B';
  if (score < 40) return '#FFD60A';
  if (score < 60) return '#FF9500';
  if (score < 80) return '#FF3B30';
  return '#AF52DE';
}

function getIntensityLabel(score: number): string {
  if (score < 20) return 'No Trend';
  if (score < 40) return 'Weak';
  if (score < 60) return 'Moderate';
  if (score < 80) return 'Strong';
  return 'Extreme';
}

const INTENSITY_ZONES = [
  { label: 'No Trend', color: 'var(--gauge-no-trend)' },
  { label: 'Weak', color: 'var(--gauge-weak)' },
  { label: 'Moderate', color: 'var(--gauge-moderate)' },
  { label: 'Strong', color: 'var(--gauge-strong)' },
  { label: 'Extreme', color: 'var(--gauge-extreme)' },
];

function DirectionArrow({ direction }: { direction: 'bull' | 'bear' | 'neutral' }) {
  if (direction === 'bull') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-label="Bullish"
      >
        <path d="M12 5L19 12H5L12 5Z" fill="#34C759" />
        <rect x="10" y="12" width="4" height="7" fill="#34C759" />
      </svg>
    );
  }
  if (direction === 'bear') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-label="Bearish"
      >
        <path d="M12 19L5 12H19L12 19Z" fill="#FF3B30" />
        <rect x="10" y="5" width="4" height="7" fill="#FF3B30" />
      </svg>
    );
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Neutral"
    >
      <path d="M5 12H19M14 7L19 12L14 17" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OneWayGauge({ score, direction, label }: OneWayGaugeProps) {
  const fillPercent = Math.max(0, Math.min(100, score));
  const activeColor = getIntensityColor(score);
  const intensityLabel = getIntensityLabel(score);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const directionColor =
    direction === 'bull' ? '#34C759' : direction === 'bear' ? '#FF3B30' : '#86868B';

  return (
    <div ref={ref} className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-finbrief-gray-500 text-sm font-medium tracking-wide uppercase">
          One-Way Market Index
        </p>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ color: activeColor, backgroundColor: `${activeColor}22` }}
        >
          {intensityLabel}
        </span>
      </div>

      <div className="flex items-end gap-4">
        <span
          className="font-bold leading-none"
          style={{ fontSize: '56px', color: activeColor }}
        >
          {score}
        </span>
        <div className="flex items-center gap-2 mb-2">
          <DirectionArrow direction={direction} />
          <span style={{ color: directionColor, fontSize: '14px', fontWeight: 600 }}>
            {direction === 'bull' ? 'Bull' : direction === 'bear' ? 'Bear' : 'Neutral'}
          </span>
        </div>
      </div>

      <p className="text-finbrief-gray-500 text-sm -mt-2">{label}</p>

      <div className="mt-auto flex flex-col gap-5">
        {/* 5-segment gauge bar */}
        <div className="relative h-3 rounded-full overflow-hidden flex gap-0.5">
          {INTENSITY_ZONES.map((zone) => (
            <div
              key={zone.label}
              className="flex-1 rounded-full"
              style={{ backgroundColor: `${zone.color}33` }}
            />
          ))}
          {/* Fill overlay */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: activeColor }}
            initial={{ width: 0 }}
            animate={{ width: isInView ? `${fillPercent}%` : 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-finbrief-gray-500">
          <span>0</span>
          <span>No Trend</span>
          <span>Moderate</span>
          <span>Extreme</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
