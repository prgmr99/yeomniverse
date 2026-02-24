import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBriefingByDate, getAvailableBriefingDates } from '@/lib/briefing';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export const dynamicParams = true; // Allow new dates via ISR

export async function generateStaticParams() {
  const dates = getAvailableBriefingDates();
  return dates.map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const briefing = getBriefingByDate(date);
  if (!briefing) return { title: 'Briefing Not Found | FinBrief' };

  const title = `Market Briefing ${date} | FinBrief`;
  const description =
    briefing.summary ||
    `Daily AI financial market briefing for ${date}. Includes One-Way Market Index, Fear & Greed analysis, and top news picks.`;

  return {
    title,
    description,
    alternates: { canonical: `${DOMAIN}/briefing/${date}` },
    openGraph: {
      title,
      description,
      url: `${DOMAIN}/briefing/${date}`,
      images: [{ url: '/api/og', width: 1200, height: 630 }],
    },
  };
}

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

function getSentimentColor(sentiment: string): string {
  if (sentiment === 'bullish') return '#34C759';
  if (sentiment === 'bearish') return '#FF3B30';
  return '#86868B';
}

function getSentimentLabel(sentiment: string): string {
  if (sentiment === 'bullish') return 'Bullish';
  if (sentiment === 'bearish') return 'Bearish';
  return 'Neutral';
}

function getOneWayContextText(score: number, direction: string): string {
  const dirLabel = direction === 'bull' ? 'bullish' : direction === 'bear' ? 'bearish' : 'neutral';
  if (score >= 80) return `The market is in extreme one-way ${dirLabel} conditions — a rare, high-conviction trending environment. Multiple technical indicators are simultaneously aligned. While these conditions can produce exceptional returns for trend followers, they also carry elevated reversal risk.`;
  if (score >= 60) return `A strong ${dirLabel} one-way trend is active. Technical indicators are broadly aligned, confirming directional conviction. Trend-following strategies historically perform well in this zone.`;
  if (score >= 40) return `A moderate ${dirLabel} trend is underway. The market shows directional bias but with some conflicting signals. This is a confirmed trending environment, though not at peak conviction.`;
  if (score >= 20) return `A weak ${dirLabel} directional bias is present. The market is not clearly trending, and some indicators conflict. Caution is warranted for trend-following approaches.`;
  return 'The market is in consolidation with no clear directional trend. Choppy, range-bound conditions are unfavorable for trend-following strategies.';
}

export default async function BriefingDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const briefing = getBriefingByDate(date);
  if (!briefing) notFound();

  const oneWay = briefing.oneWay;
  const fearGreed = briefing.fearGreed;
  const oneWayColor = oneWay ? getScoreColor(oneWay.score) : '#86868B';
  const fearGreedColor = fearGreed ? getFearGreedColor(fearGreed.score) : '#86868B';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: `Market Briefing ${date}`,
    description: briefing.summary,
    datePublished: `${date}T08:00:00+09:00`,
    dateModified: `${date}T08:00:00+09:00`,
    author: {
      '@type': 'Organization',
      name: 'FinBrief AI',
      url: DOMAIN,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FinBrief',
      url: DOMAIN,
      logo: { '@type': 'ImageObject', url: `${DOMAIN}/images/favicon/icon-512.png` },
    },
    mainEntityOfPage: `${DOMAIN}/briefing/${date}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: DOMAIN },
      { '@type': 'ListItem', position: 2, name: 'Briefing Archive', item: `${DOMAIN}/briefing` },
      { '@type': 'ListItem', position: 3, name: `Briefing ${date}`, item: `${DOMAIN}/briefing/${date}` },
    ],
  };

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/briefing" className="hover:text-white/70 transition-colors">Briefing Archive</Link>
          <span>/</span>
          <span className="text-white/70">{date}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <p className="text-white/40 font-mono text-sm mb-3">{date}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Market Briefing</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            AI-curated analysis of top financial news with One-Way Market Index and sentiment indicators.
          </p>
        </div>

        {/* Market Pulse Header */}
        {(oneWay || fearGreed) && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-5 text-white/80">Market Pulse</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {oneWay && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-3">One-Way Market Index</p>
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-4xl font-bold" style={{ color: oneWayColor }}>
                      {oneWay.score}
                    </span>
                    <span
                      className="text-sm font-medium mb-1 px-2.5 py-1 rounded-full"
                      style={{ color: oneWayColor, backgroundColor: `${oneWayColor}22` }}
                    >
                      {oneWay.label}
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ width: `${oneWay.score}%`, backgroundColor: oneWayColor }}
                    />
                  </div>
                  <p className="text-xs text-white/40 capitalize">{oneWay.direction} direction</p>
                </div>
              )}
              {fearGreed && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-3">Fear & Greed Index</p>
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-4xl font-bold" style={{ color: fearGreedColor }}>
                      {fearGreed.score}
                    </span>
                    <span
                      className="text-sm font-medium mb-1 px-2.5 py-1 rounded-full"
                      style={{ color: fearGreedColor, backgroundColor: `${fearGreedColor}22` }}
                    >
                      {fearGreed.rating}
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ width: `${fearGreed.score}%`, backgroundColor: fearGreedColor }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* One-Way Context */}
        {oneWay && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-white/80">Market Context</h2>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white/70 leading-relaxed mb-4">
                {getOneWayContextText(oneWay.score, oneWay.direction)}
              </p>
              {oneWay.components && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  {Object.entries(oneWay.components).map(([key, val]) => {
                    const labels: Record<string, string> = {
                      adx: 'ADX', maAlignment: 'MA Stack', rsiTrend: 'RSI Zone',
                      bbWidth: 'BB Width', vix: 'VIX', volume: 'Volume',
                    };
                    if (!(key in labels)) return null;
                    const color = getScoreColor(val);
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">{labels[key]}</span>
                          <span style={{ color }}>{val}</span>
                        </div>
                        <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ width: `${val}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Top News */}
        {briefing.briefings.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-5 text-white/80">Top News Analysis</h2>
            <div className="space-y-4">
              {briefing.briefings.map((item, i) => {
                const sentColor = getSentimentColor(item.sentiment);
                return (
                  <article
                    key={i}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-white leading-snug">{item.title}</h3>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ color: sentColor, backgroundColor: `${sentColor}22` }}
                      >
                        {getSentimentLabel(item.sentiment)}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Market Summary */}
        {briefing.summary && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-white/80">Overall Market Sentiment</h2>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-white/70 leading-relaxed">{briefing.summary}</p>
            </div>
          </section>
        )}

        {/* Keywords */}
        {briefing.tags.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-white/80">Key Themes</h2>
            <div className="flex flex-wrap gap-2">
              {briefing.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-sm text-white/60 bg-white/5 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* One-Way Index link */}
        <section className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="font-semibold mb-2">About the One-Way Market Index</h2>
          <p className="text-sm text-white/60 mb-4">
            The One-Way Market Index is a proprietary composite indicator measuring trend
            strength across 7 technical signals. Learn how it's calculated and what each
            score range means.
          </p>
          <Link
            href="/one-way-index"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors underline underline-offset-4"
          >
            Read the full methodology →
          </Link>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-white/30 border-t border-white/10 pt-6">
          This briefing is generated by AI for informational purposes only. It does not
          constitute financial advice. Past market conditions do not predict future performance.
          Always conduct your own research before making investment decisions.
        </p>
      </div>
    </main>
  );
}
