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
    default: 'FinBrief | AI 재테크 브리핑',
    template: '%s | FinBrief',
  },
  description:
    '30초 만에 읽는 AI 재테크 브리핑. 매일 아침 8시, 핵심 금융 뉴스만 텔레그램으로 받아보세요. AI가 100개 뉴스를 분석하고 3가지만 선별합니다.',
  applicationName: 'FinBrief',
  keywords: [
    'AI 금융 뉴스',
    '재테크 브리핑',
    '금융 뉴스 요약',
    '텔레그램 금융 봇',
    '투자 뉴스 AI',
    '주식 뉴스 요약',
    'AI 투자',
    '재테크 뉴스',
    '금융 AI',
    '뉴스 큐레이션',
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
    title: 'FinBrief | AI 재테크 브리핑',
    description:
      '30초 만에 읽는 AI 재테크 브리핑. AI가 100개 뉴스를 분석하고 3가지만 선별합니다.',
    url: DOMAIN_URL,
    siteName: 'FinBrief',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'FinBrief - AI 재테크 브리핑 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinBrief | AI 재테크 브리핑',
    description:
      '30초 만에 읽는 AI 재테크 브리핑. 매일 아침 8시, 핵심 금융 뉴스만 텔레그램으로.',
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
    description: '30초 만에 읽는 AI 재테크 브리핑',
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
      priceCurrency: 'KRW',
    },
    description:
      '30초 만에 읽는 AI 재테크 브리핑. 매일 아침 8시 텔레그램으로 핵심 금융 뉴스를 받아보세요.',
  };

  // Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI 재테크 브리핑',
    provider: {
      '@type': 'Organization',
      name: 'FinBrief',
    },
    description:
      'AI가 100개의 금융 뉴스를 분석하고 가장 중요한 3가지만 선별하여 매일 아침 8시 텔레그램으로 전송합니다.',
    serviceType: 'AI News Curation',
    areaServed: 'KR',
  };

  return (
    <html
      lang="ko"
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
