import type { Metadata } from 'next';
import Link from 'next/link';
import { getAvailableBriefingDates, getBriefingByDate } from '@/lib/briefing';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export const metadata: Metadata = {
  title: 'Daily Market Briefing Archive | FinBrief',
  description:
    'Browse the complete archive of AI-curated daily financial briefings. Each entry includes top market news analysis, Fear & Greed Index, and One-Way Market Index readings.',
  alternates: { canonical: `${DOMAIN}/briefing` },
  openGraph: {
    title: 'Daily Market Briefing Archive | FinBrief',
    description:
      'AI-curated daily financial briefings with Fear & Greed Index and One-Way Market Index readings. Browse the full archive.',
    url: `${DOMAIN}/briefing`,
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Market Briefing Archive | FinBrief',
    description:
      'AI-curated daily financial briefings with Fear & Greed Index and One-Way Market Index readings.',
    images: ['/api/og'],
  },
};

function getScoreColor(score: number): string {
  if (score < 20) return '#86868B';
  if (score < 40) return '#FFD60A';
  if (score < 60) return '#FF9500';
  if (score < 80) return '#FF3B30';
  return '#AF52DE';
}

function getFearGreedColor(score: number): string {
  if (score < 25) return '#FF3B30';
  if (score < 45) return '#FF9500';
  if (score < 56) return '#FFD60A';
  if (score < 75) return '#34C759';
  return '#007AFF';
}

export default function BriefingArchivePage() {
  const dates = getAvailableBriefingDates();

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Daily Briefing Archive</h1>
        <p className="text-white/60 mb-12 text-lg max-w-2xl">
          AI-curated market analysis delivered every morning at 8 AM KST. Each briefing
          includes the One-Way Market Index, Fear & Greed reading, and top financial news.
        </p>

        {dates.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-white/40">No briefings available yet. Check back after the first daily run.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dates.map((date) => {
              const briefing = getBriefingByDate(date);
              return (
                <Link
                  key={date}
                  href={`/briefing/${date}`}
                  className="block p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-white/50 text-sm">{date}</span>
                      {briefing?.oneWay && (
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            color: getScoreColor(briefing.oneWay.score),
                            backgroundColor: `${getScoreColor(briefing.oneWay.score)}22`,
                          }}
                        >
                          One-Way {briefing.oneWay.score}
                        </span>
                      )}
                      {briefing?.fearGreed && (
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            color: getFearGreedColor(briefing.fearGreed.score),
                            backgroundColor: `${getFearGreedColor(briefing.fearGreed.score)}22`,
                          }}
                        >
                          F&G {briefing.fearGreed.score}
                        </span>
                      )}
                    </div>
                    <span className="text-white/30 group-hover:text-white/60 transition-colors text-sm">
                      View →
                    </span>
                  </div>
                  {briefing?.summary && (
                    <p className="text-white/40 text-sm mt-2 line-clamp-1">
                      {briefing.summary}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
