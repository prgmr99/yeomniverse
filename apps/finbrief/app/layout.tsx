import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './finbrief.css';
import { GoogleAnalytics } from '@hyo/ui';
import { sans, serif } from './fonts';

const DOMAIN_URL =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  title: {
    default: 'FinBrief | AI Financial Briefing',
    template: '%s | FinBrief',
  },
  description:
    'AI-powered financial briefing you can read in 30 seconds. Get the top 3 news picks from 100+ articles delivered to your Telegram every morning at 8 AM.',
  applicationName: 'FinBrief',
  keywords: [
    'AI financial news',
    'financial briefing',
    'news summary',
    'Telegram finance bot',
    'investment news AI',
    'stock news summary',
    'AI investing',
    'finance news',
    'financial AI',
    'news curation',
  ],
  icons: {
    icon: [
      { url: '/images/favicon/icon.svg', type: 'image/svg+xml' },
      {
        url: '/images/favicon/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/images/favicon/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: '/images/favicon/favicon.ico',
    apple: [
      {
        url: '/images/favicon/apple-icon-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  authors: [{ name: 'FinBrief Team' }],
  creator: 'FinBrief',
  publisher: 'FinBrief',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'FinBrief | AI Financial Briefing',
    description:
      'AI-powered financial briefing in 30 seconds. AI analyzes 100+ articles and picks the top 3.',
    url: DOMAIN_URL,
    siteName: 'FinBrief',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'FinBrief - AI Financial Briefing Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinBrief | AI Financial Briefing',
    description:
      'AI-powered financial briefing in 30 seconds. Top news delivered to your Telegram every morning at 8 AM.',
    images: ['/api/og'],
  },
  alternates: {
    canonical: DOMAIN_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'naver-site-verification':
        process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || '',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Organization schema for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FinBrief',
    url: DOMAIN_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${DOMAIN_URL}/images/favicon/icon-512.png`,
      width: 512,
      height: 512,
    },
    description: 'AI-powered financial briefing in 30 seconds',
  };

  // SoftwareApplication schema for the AI service (NO AggregateRating - Google penalizes fabricated ratings)
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FinBrief',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Telegram',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'AI-powered financial briefing in 30 seconds. Top news delivered to your Telegram every morning at 8 AM.',
  };

  // Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI Financial Briefing',
    provider: {
      '@type': 'Organization',
      name: 'FinBrief',
    },
    description:
      'AI analyzes 100+ financial news articles and delivers the top 3 picks to your Telegram every morning at 8 AM.',
    serviceType: 'AI News Curation',
    areaServed: 'KR',
  };

  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        {children}
        <GoogleAnalytics />

        {/* Structured Data Schemas */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="software-app-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppSchema),
          }}
        />
        <Script
          id="service-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
      </body>
    </html>
  );
}
