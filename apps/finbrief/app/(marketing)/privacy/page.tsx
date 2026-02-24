import type { Metadata } from 'next';
import Link from 'next/link';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export const metadata: Metadata = {
  title: 'Privacy Policy | FinBrief',
  description:
    'FinBrief Privacy Policy — how we collect, use, and protect your personal information when you use our AI-powered financial briefing service.',
  alternates: { canonical: `${DOMAIN}/privacy` },
  openGraph: {
    title: 'Privacy Policy | FinBrief',
    description:
      'Learn how FinBrief handles your personal data, what we collect, and how we protect your information.',
    url: `${DOMAIN}/privacy`,
  },
};

const LAST_UPDATED = 'February 24, 2026';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-xl text-white/60 mb-4 max-w-2xl">
          How FinBrief collects, uses, and protects your personal information.
        </p>
        <p className="text-sm text-white/30 mb-16">Last updated: {LAST_UPDATED}</p>

        {/* Overview */}
        <section className="mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-4">
              FinBrief ("we", "our", or "us") is an AI-powered financial briefing service operated
              by Seungjun Yeom as part of the Yeomniverse project. This Privacy Policy explains
              what information we collect when you use our website at{' '}
              <span className="text-white">finbrief.yeomniverse.com</span> and our Telegram bot,
              how we use that information, and the choices you have.
            </p>
            <p className="text-white/60 leading-relaxed">
              By using FinBrief, you agree to the collection and use of information in accordance
              with this policy. We do not sell your personal data to third parties.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Information We Collect</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Account Information</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                When you subscribe to FinBrief, we collect your email address and payment
                information (processed securely via Lemon Squeezy — we do not store your
                payment card details). Your email is used to manage your subscription and
                deliver service communications.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Telegram Data</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                When you interact with the FinBrief Telegram bot, Telegram provides us with
                your Telegram user ID and username. This is used solely to deliver briefings
                to your account. We do not access your Telegram messages beyond bot interactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Usage Data</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We collect anonymized usage data such as pages visited and time on site via
                Google Analytics. This data is aggregated and cannot be used to identify you
                individually. You can opt out using browser-level tracking controls or a
                content blocker.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-white mb-3">Log Data</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Our servers automatically collect standard log information including IP address,
                browser type, referring URL, and timestamps. This data is used for security,
                debugging, and operational purposes, and is retained for up to 90 days.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How We Use Your Information</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <ul className="space-y-3 text-sm text-white/70">
              {[
                'Deliver daily financial briefings to your Telegram account',
                'Manage your subscription and process payments',
                'Send transactional emails (subscription confirmation, renewal notices)',
                'Monitor and improve service performance and reliability',
                'Investigate and prevent abuse or unauthorized access',
                'Comply with applicable legal obligations',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-white/30 mt-0.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-xs mt-6">
              We do not use your data for advertising, profiling, or sale to third parties.
            </p>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Third-Party Services</h2>
          <div className="space-y-4">
            {[
              {
                name: 'Supabase',
                purpose: 'Database and authentication',
                link: 'https://supabase.com/privacy',
                notes:
                  'Your email and subscription status are stored in a Supabase PostgreSQL database. Supabase is SOC 2 Type 2 certified.',
              },
              {
                name: 'Lemon Squeezy',
                purpose: 'Payment processing and subscription management',
                link: 'https://www.lemonsqueezy.com/privacy',
                notes:
                  'All payment processing is handled by Lemon Squeezy. We receive confirmation of payment status but do not store card numbers or banking details.',
              },
              {
                name: 'Telegram',
                purpose: 'Briefing delivery channel',
                link: 'https://telegram.org/privacy',
                notes:
                  "Briefings are delivered via the Telegram Bot API. Telegram's privacy policy governs how Telegram handles your data on their platform.",
              },
              {
                name: 'Google Gemini AI',
                purpose: 'AI-powered news analysis',
                link: 'https://policies.google.com/privacy',
                notes:
                  'News articles are processed by Google Gemini to generate briefing summaries. No personal user data is sent to Gemini — only publicly available news content.',
              },
              {
                name: 'Google Analytics',
                purpose: 'Anonymized website usage analytics',
                link: 'https://policies.google.com/privacy',
                notes:
                  'We use Google Analytics with IP anonymization enabled. No personally identifiable information is collected through analytics.',
              },
              {
                name: 'Vercel',
                purpose: 'Website hosting and deployment',
                link: 'https://vercel.com/legal/privacy-policy',
                notes:
                  'This website is hosted on Vercel. Vercel may process request data (IP, user agent) as part of serving the site.',
              },
            ].map((service) => (
              <div key={service.name} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{service.name}</h3>
                  <span className="text-xs text-white/30">{service.purpose}</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-3">{service.notes}</p>
                <a
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/40 underline underline-offset-2 hover:text-white/60"
                >
                  {service.name} Privacy Policy →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Data Retention</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-4">
              We retain your account data (email, Telegram ID, subscription status) for as long
              as your subscription is active. If you cancel your subscription, your account data
              is retained for 30 days to support potential reactivation, after which it is deleted.
            </p>
            <p className="text-white/60 leading-relaxed">
              Server log data is retained for up to 90 days. Anonymized analytics data is
              retained by Google Analytics under their standard retention settings (up to 14 months).
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Rights</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-6">
              You have the right to access, correct, or delete the personal data we hold about
              you. To exercise any of these rights, contact us via the Telegram bot or GitHub.
              We will respond within 30 days.
            </p>
            <ul className="space-y-3 text-sm text-white/60">
              {[
                'Access — request a copy of the data we hold about you',
                'Correction — request correction of inaccurate data',
                'Deletion — request deletion of your account and associated data',
                'Portability — request your data in a machine-readable format',
                'Opt-out — unsubscribe from non-transactional communications at any time',
              ].map((right) => (
                <li key={right} className="flex items-start gap-3">
                  <span className="text-white/30 mt-0.5 flex-shrink-0">•</span>
                  <span>{right}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Cookies</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed mb-4">
              FinBrief uses cookies for authentication (to keep you logged in) and analytics
              (Google Analytics). We do not use advertising cookies or third-party tracking
              pixels beyond those listed above.
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              You can control cookies through your browser settings. Disabling authentication
              cookies will prevent you from accessing your dashboard. Disabling analytics
              cookies will not affect your ability to use the service.
            </p>
          </div>
        </section>

        {/* Changes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Changes to This Policy</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/70 leading-relaxed">
              We may update this Privacy Policy periodically. When we make material changes, we
              will update the "Last updated" date at the top of this page and notify active
              subscribers via Telegram or email at least 7 days before changes take effect.
              Continued use of the service after changes constitute acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Contact</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/60 leading-relaxed mb-6">
              For privacy-related questions or to exercise your data rights, contact us through:
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
            <Link href="/terms" className="underline underline-offset-2 hover:text-white/50">
              Terms of Service
            </Link>
            {' · '}
            <Link href="/about" className="underline underline-offset-2 hover:text-white/50">
              About FinBrief
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
