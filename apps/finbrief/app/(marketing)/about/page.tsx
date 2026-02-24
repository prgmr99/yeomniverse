import type { Metadata } from 'next';
import Link from 'next/link';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export const metadata: Metadata = {
  title: 'About FinBrief | AI Financial Briefing Service',
  description:
    'Learn about FinBrief — an AI-powered financial briefing service that analyzes 100+ news sources daily and delivers curated market insights via Telegram. Built with transparency about our AI methodology.',
  alternates: { canonical: `${DOMAIN}/about` },
  openGraph: {
    title: 'About FinBrief | AI Financial Briefing Service',
    description:
      'FinBrief uses Google Gemini AI to analyze financial news and the proprietary One-Way Market Index to quantify trend conditions. Read our methodology and editorial standards.',
    url: `${DOMAIN}/about`,
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About FinBrief | AI Financial Briefing Service',
    description:
      'Learn about FinBrief — an AI-powered financial briefing service that analyzes 100+ news sources daily and delivers curated market insights via Telegram. Built with transparency about our AI methodology.',
    images: ['/api/og'],
  },
};

const RSS_SOURCES = [
  { name: 'Bloomberg Markets', type: 'Global Financial News' },
  { name: 'Reuters Finance', type: 'Wire Service' },
  { name: 'CNBC Markets', type: 'Financial Media' },
  { name: 'MarketWatch', type: 'Financial News' },
  { name: 'Investing.com', type: 'Markets & Analysis' },
  { name: 'Yahoo Finance', type: 'Markets Data & News' },
  { name: 'Korean Financial News (Google News KR)', type: 'Korean Market Coverage' },
  { name: 'Naver Finance News', type: 'Korean Market Coverage' },
];

const ONE_WAY_COMPONENTS = [
  { name: 'ADX', weight: '25%', description: 'Average Directional Index — measures trend strength' },
  { name: 'MA Alignment', weight: '20%', description: 'EMA 8/21/50/200 stack order' },
  { name: 'RSI Trend Zone', weight: '15%', description: 'Momentum confirmation in trend zone' },
  { name: 'Bollinger Band Width', weight: '15%', description: 'Volatility expansion from squeeze' },
  { name: 'VIX Context', weight: '10%', description: 'Fear index alignment with direction' },
  { name: 'Volume Conviction', weight: '10%', description: '20-day vs 50-day volume ratio' },
  { name: 'Fear & Greed Calibration', weight: '5%', description: 'Sentiment alignment with price action' },
];

export default function AboutPage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Seungjun Yeom',
    url: 'https://github.com/yeomseungjun',
    sameAs: [
      'https://github.com/yeomseungjun',
    ],
    knowsAbout: [
      'Financial Technology',
      'Algorithmic Trading',
      'Technical Analysis',
      'AI Applications in Finance',
    ],
  };

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About FinBrief',
    description: 'FinBrief is an AI-powered financial briefing service delivering curated market insights via Telegram.',
    url: `${DOMAIN}/about`,
    author: personSchema,
  };

  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About FinBrief</h1>
        <p className="text-xl text-white/60 mb-16 max-w-2xl">
          An AI-powered financial briefing service built on transparency — about our sources,
          our methodology, and our use of artificial intelligence.
        </p>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What FinBrief Does</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <p className="text-white/70 leading-relaxed mb-4">
              FinBrief is a daily financial intelligence service. Every morning at 8:00 AM KST,
              our automated pipeline collects news from 8+ financial news sources, scores each
              article for importance and relevance, and uses Google Gemini AI to analyze and
              summarize the most material developments.
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              Alongside the news analysis, the pipeline calculates the{' '}
              <Link href="/one-way-index" className="text-white underline underline-offset-4 hover:text-white/80">
                One-Way Market Probability Index
              </Link>{' '}
              — a proprietary composite indicator measuring the strength and conviction of the
              current market trend using S&P 500 technical data and VIX readings.
            </p>
            <p className="text-white/70 leading-relaxed">
              The briefing is delivered via Telegram bot, with a web archive available at{' '}
              <Link href="/briefing" className="text-white underline underline-offset-4 hover:text-white/80">
                finbrief.yeomniverse.com/briefing
              </Link>.
            </p>
          </div>
        </section>

        {/* Editorial Methodology */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Methodology</h2>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Step 1 — News Collection</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                We collect news via RSS feeds from the following sources, with deduplication
                to ensure each story is counted once:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {RSS_SOURCES.map((src) => (
                  <div key={src.name} className="flex items-start gap-2 text-sm">
                    <span className="text-white/30 mt-0.5">•</span>
                    <span>
                      <span className="text-white/70">{src.name}</span>
                      <span className="text-white/30 ml-1">— {src.type}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Step 2 — Importance Scoring</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Each article is scored 0–100 based on four signals: source credibility (weighted
                by publication tier), cross-source corroboration (same story from multiple
                outlets scores higher), recency (articles within the last 6 hours score higher),
                and content depth (keyword signals for materiality: earnings, Fed, rate, GDP, etc.).
                Only the top-scored articles proceed to AI analysis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Step 3 — AI Analysis</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-3">
                Filtered articles are sent to <strong className="text-white">Google Gemini</strong>{' '}
                with a structured prompt that instructs the model to act as a senior market
                strategist, selecting the most materially significant news items and summarizing
                each in three sentences: what happened, the mechanism that makes it significant,
                and the likely second-order effect.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                The AI is given explicit criteria: materiality (would a portfolio manager adjust
                positions?), timeliness (is this actionable now?), and signal quality (exclude
                rumors and promotional content). The model is not given trading instructions and
                does not make buy/sell recommendations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">
                Step 4 — One-Way Market Index Calculation
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                In parallel with news analysis, we calculate the One-Way Market Probability Index
                using one year of S&P 500 (^GSPC) price/volume data and VIX (^VIX) readings.
                The composite score is a weighted average of 7 technical components:
              </p>
              <div className="space-y-2">
                {ONE_WAY_COMPONENTS.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 text-sm">
                    <span className="text-white/70 w-36 flex-shrink-0">{c.name}</span>
                    <span className="text-white/30 w-10 flex-shrink-0">{c.weight}</span>
                    <span className="text-white/40">{c.description}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-4">
                Full methodology:{' '}
                <Link href="/one-way-index" className="underline underline-offset-2 hover:text-white/60">
                  One-Way Index page
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* AI Disclosure */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">AI Usage Disclosure</h2>
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-white/80 leading-relaxed mb-4">
              <strong className="text-white">FinBrief uses artificial intelligence (Google Gemini)
              to analyze and summarize financial news.</strong> The AI-generated content is not
              reviewed by human editors before publication. The summaries represent the model's
              interpretation of source material and may contain errors, omissions, or
              mischaracterizations.
            </p>
            <p className="text-white/60 leading-relaxed mb-4">
              The One-Way Market Index is calculated algorithmically from public market data.
              It is a quantitative tool, not a prediction model, and does not incorporate
              fundamental analysis, macroeconomic forecasting, or human judgment.
            </p>
            <p className="text-white/60 leading-relaxed">
              All FinBrief content is provided for informational and educational purposes only.
              Nothing published by FinBrief constitutes financial, investment, legal, or tax
              advice. Always conduct your own research and consult qualified professionals
              before making investment decisions.
            </p>
          </div>
        </section>

        {/* Who Built It */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Who Built This</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-4">
              FinBrief is an independent project built and maintained by{' '}
              <strong className="text-white">Seungjun Yeom</strong>, a software engineer
              interested in the intersection of AI and financial markets. It is not affiliated
              with any financial institution, broker, or investment advisor.
            </p>
            <p className="text-white/70 leading-relaxed mb-6">
              The project is part of the{' '}
              <a
                href="https://yeomniverse.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-4 hover:text-white/80"
              >
                Yeomniverse
              </a>{' '}
              collection of independent digital projects.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/yeomseungjun"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-sm text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Contact & Feedback</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/60 leading-relaxed mb-4">
              For questions, data corrections, or feedback about the briefing quality or
              One-Way Index methodology, please reach out via GitHub Issues on the project
              repository, or contact via the Telegram bot.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://t.me/finbrief_news_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-sm text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                Telegram Bot
              </a>
              <a
                href="https://github.com/yeomseungjun"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-sm text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                GitHub Issues
              </a>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="text-xs text-white/30 border-t border-white/10 pt-6 space-y-2">
          <p>
            <strong className="text-white/40">Financial Disclaimer:</strong> All content on
            FinBrief is for informational purposes only. FinBrief is not a registered investment
            advisor, broker-dealer, or financial planner. Nothing on this site constitutes
            financial advice, investment advice, trading advice, or any other sort of advice.
            You should not treat any of FinBrief's content as such.
          </p>
          <p>
            FinBrief is not responsible for any investment decisions made based on information
            provided on this site. Past performance is not indicative of future results.
            Investing involves risk, including the possible loss of principal.
          </p>
        </div>
      </div>
    </main>
  );
}
