'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FearGreedGaugeProps {
  score: number;
  rating: string;
}

function getZoneColor(score: number): string {
  if (score < 25) return '#FF3B30';
  if (score < 45) return '#FF9500';
  if (score < 56) return '#FFD60A';
  if (score < 75) return '#34C759';
  return '#007AFF';
}

function getZoneLabel(score: number): string {
  if (score < 25) return 'Extreme Fear';
  if (score < 45) return 'Fear';
  if (score < 56) return 'Neutral';
  if (score < 75) return 'Greed';
  return 'Extreme Greed';
}

const ZONES = [
  { label: 'Extreme Fear', color: 'var(--gauge-extreme-fear)' },
  { label: 'Fear', color: 'var(--gauge-fear)' },
  { label: 'Neutral', color: 'var(--gauge-neutral)' },
  { label: 'Greed', color: 'var(--gauge-greed)' },
  { label: 'Extreme Greed', color: 'var(--gauge-extreme-greed)' },
];

export default function FearGreedGauge({ score, rating }: FearGreedGaugeProps) {
  const fillPercent = Math.max(0, Math.min(100, score));
  const activeColor = getZoneColor(score);
  const activeZoneLabel = getZoneLabel(score);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-finbrief-gray-500 text-sm font-medium tracking-wide uppercase">
          Fear & Greed Index
        </p>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ color: activeColor, backgroundColor: `${activeColor}22` }}
        >
          {activeZoneLabel}
        </span>
      </div>

      <div className="flex items-end gap-4">
        <span
          className="font-bold leading-none"
          style={{ fontSize: '56px', color: activeColor }}
        >
          {score}
        </span>
        <span className="text-finbrief-gray-500 text-base mb-2">{rating}</span>
      </div>

      <div className="mt-auto flex flex-col gap-5">
        {/* 5-segment gauge bar */}
        <div className="relative h-3 rounded-full overflow-hidden flex gap-0.5">
          {ZONES.map((zone) => (
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
          <span>Extreme Fear</span>
          <span>Neutral</span>
          <span>Extreme Greed</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
