import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

const DOMAIN_URL =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'FinBrief offers flexible pricing for every investor. Start free and upgrade for personalized watchlist, technical analysis, and AI deep analysis reports.',
  keywords: [
    'FinBrief pricing',
    'AI financial briefing subscription',
    'stock watchlist plan',
    'investment news subscription',
    'Telegram finance bot plan',
    'AI stock analysis plan',
  ],
  openGraph: {
    title: 'FinBrief Pricing | Plans for Every Investor',
    description:
      'Start free with daily AI financial briefings. Upgrade for personalized watchlist, RSI/MACD analysis, and AI deep analysis reports.',
    url: `${DOMAIN_URL}/pricing`,
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'FinBrief Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinBrief Pricing | Plans for Every Investor',
    description:
      'Start free with daily AI financial briefings. Upgrade for personalized watchlist, RSI/MACD analysis, and AI deep analysis.',
    images: ['/api/og'],
  },
  alternates: {
    canonical: `${DOMAIN_URL}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'en',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I cancel my subscription anytime?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can cancel anytime. You will continue to have access until the end of your billing period.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens when I upgrade from Free to a paid plan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You get instant access to all paid features including watchlist, technical analysis, and more.',
        },
      },
      {
        '@type': 'Question',
        name: 'What payment methods are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept credit and debit cards via Lemon Squeezy, our secure payment provider.',
        },
      },
      {
        '@type': 'Question',
        name: "What's the difference between Basic and Pro?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Basic includes 3 watchlist stocks and standard analysis. Pro includes 10 watchlist stocks with RSI, MACD, Bollinger Bands, and AI deep analysis.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I get a refund?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can request a refund within 7 days of purchase. Refunds may be limited in cases of excessive usage.',
        },
      },
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'FinBrief',
    description:
      'AI-powered financial briefing delivered to your Telegram every morning.',
    brand: {
      '@type': 'Brand',
      name: 'FinBrief',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Plan',
        price: '0',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        url: `${DOMAIN_URL}/pricing`,
        description: 'Daily financial briefing with 3 key news summaries.',
      },
      {
        '@type': 'Offer',
        name: 'Basic Plan',
        price: '7',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        url: `${DOMAIN_URL}/pricing`,
        description:
          'Personalized investment insights with 3 watchlist stocks.',
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan',
        price: '20',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        url: `${DOMAIN_URL}/pricing`,
        description:
          'Expert-level deep analysis with 10 watchlist stocks, RSI, MACD, and AI reports.',
      },
    ],
  };

  return (
    <>
      {children}
      <JsonLd data={faqSchema} />
      <JsonLd data={productSchema} />
    </>
  );
}
