import type { Metadata } from 'next';
import Link from 'next/link';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export const metadata: Metadata = {
  title: 'Terms of Service | FinBrief',
  description:
    'FinBrief Terms of Service — the rules and conditions for using our AI-powered financial briefing service.',
  alternates: { canonical: `${DOMAIN}/terms` },
  openGraph: {
    title: 'Terms of Service | FinBrief',
    description:
      'Read the Terms of Service for FinBrief, including subscription terms, financial disclaimers, and usage conditions.',
    url: `${DOMAIN}/terms`,
  },
};

const LAST_UPDATED = 'February 24, 2026';

export default function TermsPage() {
  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
        <p className="text-xl text-white/60 mb-4 max-w-2xl">
          The terms and conditions governing your use of FinBrief.
        </p>
        <p className="text-sm text-white/30 mb-16">Last updated: {LAST_UPDATED}</p>

        {/* Overview */}
        <section className="mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your access to and use of FinBrief,
              including the website at <span className="text-white">finbrief.yeomniverse.com</span>{' '}
              and the FinBrief Telegram bot, operated by Seungjun Yeom ("we", "us", or "our").
            </p>
            <p className="text-white/60 leading-relaxed">
              By accessing or using FinBrief, you agree to be bound by these Terms. If you do not
              agree to these Terms, do not use the service. We reserve the right to update these
              Terms at any time; continued use after changes constitutes acceptance.
            </p>
          </div>
        </section>

        {/* Financial Disclaimer — prominent */}
        <section className="mb-12">
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <h2 className="text-xl font-bold text-white mb-4">
              Important: Not Financial Advice
            </h2>
            <p className="text-white/80 leading-relaxed mb-4">
              <strong className="text-white">FinBrief is an informational service only.</strong>{' '}
              Nothing published by FinBrief — including daily briefings, the One-Way Market Index,
              market analysis, or any other content — constitutes financial advice, investment
              advice, trading recommendations, or any other type of professional advice.
            </p>
            <p className="text-white/60 leading-relaxed mb-4">
              FinBrief is not a registered investment advisor, broker-dealer, or financial planner.
              The content is generated in part by artificial intelligence (Google Gemini) and may
              contain errors, omissions, or mischaracterizations of source material.
            </p>
            <p className="text-white/60 leading-relaxed">
              <strong className="text-white/80">Always conduct your own research and consult
              qualified financial professionals before making any investment decisions.</strong>{' '}
              Past market conditions described in briefings are not indicative of future results.
              Investing involves risk, including the possible loss of principal.
            </p>
          </div>
        </section>

        {/* Service Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">The Service</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">What FinBrief Provides</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                FinBrief is a subscription service that delivers daily AI-generated financial news
                summaries and the One-Way Market Index via Telegram. Briefings are generated
                automatically each morning at approximately 08:00 KST using publicly available
                RSS news feeds processed by Google Gemini AI.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Service Availability</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We aim to deliver briefings daily on weekdays. We do not guarantee uninterrupted
                delivery. Briefings may be delayed or unavailable due to upstream API outages
                (Telegram, Google Gemini, financial data sources), technical failures, or
                scheduled maintenance. No service credit is provided for individual missed
                briefings unless a pattern of failure persists over multiple days.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">AI-Generated Content</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Briefing content is generated by artificial intelligence without real-time human
                editorial review. AI summaries may contain factual errors, hallucinations, or
                inaccurate characterizations. The One-Way Market Index is calculated
                algorithmically and represents a quantitative snapshot, not a trading signal
                or forward prediction.
              </p>
            </div>
          </div>
        </section>

        {/* Subscription Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Subscription Terms</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Billing</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Subscriptions are billed on a recurring basis (monthly or annually, depending
                on the plan you select). Billing is handled by Lemon Squeezy. By subscribing,
                you authorize us to charge your payment method on a recurring basis until you
                cancel. Prices are listed in USD and are subject to change with 30 days notice.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Cancellation</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                You may cancel your subscription at any time through your account dashboard or
                by contacting us. Cancellation takes effect at the end of the current billing
                period. We do not provide prorated refunds for partial billing periods, except
                where required by applicable law.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Refunds</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We offer a 7-day refund for first-time subscribers if you are not satisfied with
                the service. Refund requests must be submitted within 7 days of your initial
                payment by contacting us via Telegram or GitHub. Refunds for subsequent billing
                periods are granted at our discretion.
              </p>
            </div>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Acceptable Use</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Your subscription is for personal use only. You agree not to:
            </p>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                'Share your subscription credentials or Telegram access with others',
                'Republish, redistribute, or resell FinBrief content commercially',
                'Scrape, crawl, or automate access to the FinBrief website or Telegram bot',
                'Use the service to engage in market manipulation or fraudulent activity',
                'Reverse-engineer or attempt to extract the underlying AI prompts or algorithms',
                'Misrepresent AI-generated content as independent human analysis',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-white/30 mt-0.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-xs mt-6">
              Violation of these terms may result in immediate termination of your subscription
              without refund.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Intellectual Property</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-4">
              The FinBrief name, logo, website design, and proprietary methodology (including the
              One-Way Market Index formula and weighting) are owned by Seungjun Yeom. All rights
              reserved.
            </p>
            <p className="text-white/60 leading-relaxed">
              Briefing content summarizes publicly available news. The underlying news articles
              belong to their respective publishers. AI-generated summaries are produced as
              transformative commentary and are not intended to substitute for original reporting.
              You may share individual briefing excerpts for personal, non-commercial purposes
              with attribution to FinBrief.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Limitation of Liability</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-4">
              To the fullest extent permitted by applicable law, FinBrief and its operator shall
              not be liable for any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to financial losses, arising out of or related
              to your use of the service or reliance on any content provided.
            </p>
            <p className="text-white/60 leading-relaxed mb-4">
              In no event shall our total liability to you for any claim arising out of or
              related to these Terms or the service exceed the amount you paid us in the three
              months preceding the claim.
            </p>
            <p className="text-white/60 leading-relaxed">
              The service is provided "as is" and "as available" without warranties of any kind,
              express or implied, including warranties of merchantability, fitness for a particular
              purpose, or non-infringement.
            </p>
          </div>
        </section>

        {/* Termination */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Termination</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your access to FinBrief at any time,
              with or without cause. Grounds for termination include violation of these Terms,
              fraudulent or abusive behavior, or circumstances outside our control that make
              continued service impossible.
            </p>
            <p className="text-white/60 leading-relaxed">
              We may also discontinue the service entirely with 30 days notice. In such event,
              we will issue a prorated refund for any prepaid subscription period remaining.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Governing Law</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/60 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the
              Republic of Korea, without regard to conflict of law principles. Any disputes
              arising from these Terms or your use of FinBrief shall be subject to the exclusive
              jurisdiction of the courts of Korea.
            </p>
          </div>
        </section>

        {/* Changes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Changes to These Terms</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed">
              We may update these Terms from time to time. Material changes will be communicated
              to active subscribers via Telegram or email at least 7 days before taking effect.
              The "Last updated" date at the top of this page reflects the most recent revision.
              Continued use of the service after changes take effect constitutes your acceptance
              of the updated Terms.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Contact</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/60 leading-relaxed mb-6">
              Questions about these Terms? Contact us through:
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
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-xs text-white/30 border-t border-white/10 pt-6 space-y-2">
          <p>
            See also:{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-white/50">
              Privacy Policy
            </Link>
            {' · '}
            <Link href="/about" className="underline underline-offset-2 hover:text-white/50">
              About FinBrief
            </Link>
          </p>
          <p>
            <strong className="text-white/40">Financial Disclaimer:</strong> All content on
            FinBrief is for informational purposes only. Nothing on this site constitutes
            financial, investment, legal, or tax advice. Always consult qualified professionals
            before making investment decisions.
          </p>
        </div>
      </div>
    </main>
  );
}
