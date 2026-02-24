import type { Metadata } from 'next';
import { getLatestBriefing } from '@/lib/briefing';
import OneWayGauge from '@/components/OneWayGauge';
import FearGreedGauge from '@/components/FearGreedGauge';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export const metadata: Metadata = {
  title: 'One-Way Market Index | Real-Time Trend Probability | FinBrief',
  description:
    'The One-Way Market Probability Index measures the likelihood of a sustained one-directional market trend using 7 technical indicators including ADX, moving averages, RSI, Bollinger Bands, VIX, volume, and Fear & Greed. Updated daily.',
  alternates: { canonical: `${DOMAIN}/one-way-index` },
  openGraph: {
    title: 'One-Way Market Index | Real-Time Trend Probability',
    description:
      'A composite indicator that scores how "one-way" the market is — are we in a strong trend or choppy noise? Updated daily from S&P 500 data.',
    url: `${DOMAIN}/one-way-index`,
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
};

const WEIGHTS = {
  adx: { weight: 0.25, label: 'ADX (Trend Strength)', description: 'Average Directional Index — measures how strong a trend is, regardless of direction. ADX above 25 signals a trending market; below 20 indicates consolidation.' },
  maAlignment: { weight: 0.20, label: 'MA Alignment', description: 'Measures how well the 8, 21, 50, and 200-period EMAs are stacked in bullish or bearish order. Perfect alignment (all EMAs in sequence) scores 100.' },
  rsiTrend: { weight: 0.15, label: 'RSI Trend Zone', description: 'RSI in the 55–65 range during a bull trend signals momentum without exhaustion. Extremes above 80 or below 20 actually reduce the score — they signal potential reversal, not continuation.' },
  bbWidth: { weight: 0.15, label: 'Bollinger Band Width', description: 'Measures volatility expansion from a recent squeeze. Markets that break out of a low-volatility period into expanding Bollinger Bands score highest.' },
  vix: { weight: 0.10, label: 'VIX (Volatility Index)', description: 'In a bull context, low VIX (12–16) means calm confidence — ideal for one-way uptrends. In a bear context, high VIX (>30) confirms panic-driven one-directional selling.' },
  volume: { weight: 0.10, label: 'Volume Conviction', description: 'Compares 20-day average volume to 50-day average. Rising volume confirms that market participants are increasingly committed to the trend direction.' },
  fearGreed: { weight: 0.05, label: 'Fear & Greed Calibration', description: 'A small weighting that aligns sentiment with price action. Extreme Greed during a bull trend or Extreme Fear during a bear trend adds directional confirmation.' },
};

const SCORE_ZONES = [
  { range: '0–20', label: 'No Trend', color: '#86868B', description: 'The market is in consolidation or chop. No clear directional bias. Wait for a breakout signal before taking trend-following positions.' },
  { range: '20–40', label: 'Weak Directional Bias', color: '#FFD60A', description: 'A mild lean exists but the trend is not yet confirmed. Early-stage moves often score here before momentum builds.' },
  { range: '40–60', label: 'Moderate Trend', color: '#FF9500', description: 'A confirmed trend is underway. Most trend-following strategies perform well in this zone.' },
  { range: '60–80', label: 'Strong One-Way Trend', color: '#FF3B30', description: 'Strong sustained directional movement. Multiple technical indicators align. High-conviction trend-following conditions.' },
  { range: '80–100', label: 'Extreme One-Way', color: '#AF52DE', description: 'Rare, powerful trending conditions — like a post-earnings breakout or macro shock. These periods are highly profitable for trend traders but can reverse sharply.' },
];

const FAQ_ITEMS = [
  {
    question: 'What does the One-Way Market Index measure?',
    answer: 'The One-Way Market Index measures the probability that the market is in a sustained, one-directional trend — as opposed to choppy, sideways movement. A score of 0 means no trend; a score of 100 means maximum directional conviction across all measured indicators.',
  },
  {
    question: 'How is the One-Way Index different from the Fear & Greed Index?',
    answer: 'The Fear & Greed Index measures market sentiment — how emotionally driven investors are. The One-Way Index measures trend structure — whether the market is technically trending in a single direction. They complement each other: Fear & Greed tells you the mood; the One-Way Index tells you the direction and conviction.',
  },
  {
    question: 'What does a score above 80 mean?',
    answer: 'A score above 80 indicates "Extreme One-Way" conditions — rare periods where nearly all technical indicators simultaneously point in the same direction. These can be exceptional opportunities for trend traders, but also carry elevated reversal risk once the extreme conditions unwind.',
  },
  {
    question: 'Which market does the One-Way Index track?',
    answer: 'The One-Way Index is calculated using S&P 500 (^GSPC) price and volume data, combined with VIX (^VIX) readings. While it reflects US equity market conditions, the composite nature of the index captures macro trend dynamics relevant to global markets.',
  },
  {
    question: 'How often is the index updated?',
    answer: 'The One-Way Index is updated once daily as part of the FinBrief morning briefing pipeline. The score reflects the most recent full trading day\'s closing data.',
  },
  {
    question: 'Can the One-Way Index be used as a trading signal?',
    answer: 'The One-Way Index is an analytical tool, not a trading signal. It describes current market conditions rather than predicting future price movements. FinBrief\'s analysis is for informational purposes only and does not constitute financial advice.',
  },
];

function ComponentBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score < 20) return '#86868B';
  if (score < 40) return '#FFD60A';
  if (score < 60) return '#FF9500';
  if (score < 80) return '#FF3B30';
  return '#AF52DE';
}

export default function OneWayIndexPage() {
  const briefing = getLatestBriefing();
  const oneWay = briefing.oneWay;
  const fearGreed = briefing.fearGreed;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'One-Way Market Index',
    description: 'A composite indicator measuring one-directional market trend probability using 7 technical indicators.',
    url: `${DOMAIN}/one-way-index`,
    about: {
      '@type': 'Thing',
      name: 'Market Trend Analysis',
      description: 'Technical analysis of market trend strength and directionality',
    },
  };

  return (
    <main className="min-h-screen text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Updated Daily
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            One-Way Market Index
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mb-12">
            A proprietary composite indicator that measures the probability of a sustained
            one-directional market trend — built from 7 technical signals across price,
            momentum, volatility, and sentiment.
          </p>

          {/* Live Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {oneWay ? (
              <OneWayGauge
                score={oneWay.score}
                direction={oneWay.direction}
                label={oneWay.label}
                components={oneWay.components}
              />
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center min-h-[200px]">
                <p className="text-white/40 text-sm">Index data unavailable — check back after 8 AM KST</p>
              </div>
            )}
            {fearGreed ? (
              <FearGreedGauge score={fearGreed.score} rating={fearGreed.rating} />
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center min-h-[200px]">
                <p className="text-white/40 text-sm">Fear & Greed data unavailable</p>
              </div>
            )}
          </div>
          <p className="text-white/40 text-xs text-right">
            Data reflects latest available trading day. Not financial advice.
          </p>
        </div>
      </section>

      {/* What is the One-Way Index? */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">What is the One-Way Market Index?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                Most market indicators answer the question <em>"which direction?"</em> — but
                the One-Way Market Index answers a different question: <strong className="text-white">"how
                strongly is the market committed to that direction?"</strong>
              </p>
              <p>
                Financial markets spend roughly 70% of their time in ranging, choppy conditions
                where trend-following strategies consistently lose money. The remaining 30% — the
                trending periods — is where the majority of market returns are captured.
              </p>
              <p>
                The One-Way Index was designed to identify those trending windows with high
                confidence, by requiring multiple independent technical signals to simultaneously
                confirm directional conviction.
              </p>
            </div>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                Unlike the Fear & Greed Index, which measures investor sentiment, the One-Way
                Index measures <strong className="text-white">structural trend quality</strong> — whether
                the price action itself is exhibiting the characteristics of a true one-directional
                move.
              </p>
              <p>
                A market can be in "Extreme Greed" sentiment while still being choppy and
                range-bound. Conversely, a strong downtrend can persist even as sentiment
                recovers. The One-Way Index captures the technical reality of what the market
                is actually doing, independent of emotional state.
              </p>
              <p>
                The index is calculated daily using S&P 500 historical price and volume data,
                combined with the CBOE Volatility Index (VIX) and CNN Fear & Greed data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Score Interpretation */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">How to Read the Score</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SCORE_ZONES.map((zone) => (
              <div
                key={zone.range}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-xs font-mono text-white/50">{zone.range}</span>
                </div>
                <p className="font-semibold text-sm" style={{ color: zone.color }}>
                  {zone.label}
                </p>
                <p className="text-xs text-white/50 leading-relaxed">{zone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Components */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">The 7 Components</h2>
          <p className="text-white/60 mb-10 max-w-2xl">
            Each component is scored 0–100 and weighted by its contribution to trend identification.
            The composite score is a weighted sum.
          </p>
          <div className="space-y-6">
            {Object.entries(WEIGHTS).map(([key, info]) => {
              const componentScore = oneWay?.components?.[key as keyof typeof oneWay.components];
              const color = componentScore != null ? getScoreColor(componentScore) : '#86868B';
              return (
                <div
                  key={key}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white">{info.label}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                          {Math.round(info.weight * 100)}% weight
                        </span>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed max-w-2xl">
                        {info.description}
                      </p>
                    </div>
                    {componentScore != null && (
                      <span
                        className="text-2xl font-bold flex-shrink-0"
                        style={{ color }}
                      >
                        {componentScore}
                      </span>
                    )}
                  </div>
                  {componentScore != null && (
                    <ComponentBar score={componentScore} color={color} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Data Sources</h3>
                <ul className="text-sm text-white/60 space-y-1.5">
                  <li>• S&P 500 (^GSPC) — price, high, low, volume (365-day history)</li>
                  <li>• CBOE VIX (^VIX) — current volatility reading</li>
                  <li>• CNN Fear & Greed Index — live sentiment score</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Update Schedule</h3>
                <p className="text-sm text-white/60">
                  Calculated once daily at 8:00 AM KST (23:00 UTC) using the previous trading
                  day's closing data. Distributed as part of the FinBrief morning briefing.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Direction Determination</h3>
                <p className="text-sm text-white/60">
                  Market direction (bull/bear) is determined by combining ADX +DI/-DI
                  differential with EMA stack alignment. When ADX exceeds 25, the +DI/-DI
                  comparison takes precedence. In weaker trend conditions, EMA alignment
                  determines direction.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Disclaimer</h3>
                <p className="text-sm text-white/60">
                  The One-Way Market Index is a technical analysis tool for informational
                  purposes only. It does not constitute financial advice. Past index readings
                  do not guarantee future market performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to FinBrief */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get the Index Delivered Daily</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            The One-Way Index is published every morning alongside AI-curated financial news.
            Subscribe to FinBrief to receive it directly in Telegram.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="px-8 py-3 rounded-full font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
            >
              Learn about FinBrief
            </a>
            <a
              href="/briefing"
              className="px-8 py-3 rounded-full font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
            >
              View Briefing Archive
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <h3 className="font-semibold text-white mb-3">{item.question}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
