'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/landing';

type BriefingData = {
  briefings: Array<{
    title: string;
    description: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
  }>;
  tags: string[];
  summary: string;
};

export default function BriefingSample() {
  const [data, setData] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/briefing/latest')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {
        setData({
          briefings: [
            {
              title: '데이터를 불러올 수 없습니다',
              description: '잠시 후 다시 시도해주세요.',
              sentiment: 'neutral',
            },
          ],
          tags: [],
          summary: '',
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const sentimentStyles = {
    bullish: {
      label: 'BULLISH',
      color: '#3182F6',
      bg: 'rgba(49, 130, 246, 0.1)',
      border: 'rgba(49, 130, 246, 0.2)',
    },
    bearish: {
      label: 'BEARISH',
      color: '#FF3B30',
      bg: 'rgba(255, 59, 48, 0.1)',
      border: 'rgba(255, 59, 48, 0.2)',
    },
    neutral: {
      label: 'NEUTRAL',
      color: '#86868B',
      bg: 'rgba(134, 134, 139, 0.1)',
      border: 'rgba(134, 134, 139, 0.2)',
    },
  };

  if (isLoading) {
    return (
      <section
        className="px-6 bg-white/50 backdrop-blur-sm"
        style={{ padding: 'clamp(80px, 12vh, 150px) 24px' }}
      >
        <div className="max-w-[980px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-finbrief-gray-500 text-base font-medium tracking-wide uppercase mb-4">
              미리보기
            </p>
            <h2
              className="text-finbrief-black font-semibold"
              style={{ fontSize: '36px' }}
            >
              오늘의 브리핑 샘플
            </h2>
          </div>
          <div className="max-w-2xl mx-auto bg-finbrief-white rounded-3xl shadow-xl p-8 md:p-10">
            <p className="text-center text-finbrief-gray-500">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section
      className="px-6 bg-white/50 backdrop-blur-sm"
      style={{ padding: 'clamp(80px, 12vh, 150px) 24px' }}
    >
      <div className="max-w-[980px] mx-auto">
        <ScrollReveal className="text-center mb-10">
          <p className="text-finbrief-gray-500 text-base font-medium tracking-wide uppercase mb-4">
            미리보기
          </p>
          <h2
            className="text-finbrief-black font-semibold"
            style={{ fontSize: '36px' }}
          >
            오늘의 브리핑 샘플
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="max-w-2xl mx-auto bg-finbrief-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="space-y-6">
              {data.briefings.map((item, index) => {
                const style = sentimentStyles[item.sentiment];
                return (
                  <div
                    key={index}
                    className="p-5 rounded-2xl border"
                    style={{
                      backgroundColor: style.bg,
                      borderColor: style.border,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4 className="font-semibold text-lg text-finbrief-black">
                        {item.title}
                      </h4>
                      <span
                        className="flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          color: style.color,
                          backgroundColor: style.bg,
                        }}
                      >
                        {style.label}
                      </span>
                    </div>
                    <p className="text-finbrief-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-finbrief-gray-200">
              <div className="flex flex-wrap gap-2 mb-4">
                {data.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-finbrief-blue-500 bg-finbrief-blue-500/10 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-finbrief-gray-500">{data.summary}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
