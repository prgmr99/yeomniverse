import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';
import './globals.css';
import { GoogleAdSense, GoogleAnalytics } from '@hyo/ui';
import { SERVICES } from '@/lib/services';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { sans, serif } from './fonts';

const NAVER_VERIFICATION =
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || '';
const ADSENSE_ACCOUNT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT || 'ca-pub-7476208540300201';

const DESCRIPTION =
  'Yeomniverse는 개인이 만든 작은 웹 도구를 모아둔 사이트입니다. 부모님 탐구영역 테스트 효도티어, 매일 아침 AI 금융 브리핑 FinBrief, 거래 시뮬레이터 NeuroTrade, 세계 정세 지도 Argus, 치과 종사자 리뷰 치잡, 월세 안전도 비교 안심월세를 운영합니다.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Yeomniverse — 직접 만든 웹 도구 모음',
    template: '%s | Yeomniverse',
  },
  description: DESCRIPTION,
  keywords: [
    'Yeomniverse',
    '웹 도구',
    '무료 웹 서비스',
    '온라인 도구',
    '효도티어',
    '효도능력시험',
    '부모님 탐구영역',
    'FinBrief',
    '금융 뉴스 요약',
    'AI 브리핑',
    'NeuroTrade',
    '거래 시뮬레이터',
    '모의투자',
    'Argus',
    '세계 정세 지도',
    '치잡',
    '치과 취업',
    '치과 병원 리뷰',
  ],
  applicationName: SITE_NAME,
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
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
    title: 'Yeomniverse — 직접 만든 웹 도구 모음',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yeomniverse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yeomniverse — 직접 만든 웹 도구 모음',
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    other: {
      'naver-site-verification': NAVER_VERIFICATION,
    },
  },
  other: {
    'google-adsense-account': ADSENSE_ACCOUNT,
  },
};

// Viewport configuration for mobile optimization
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // middleware가 요청마다 발급한 값. nonce를 쓰려면 응답이 요청 시점에
  // 만들어져야 해서, 이 호출이 전체 라우트를 동적 렌더링으로 바꾼다.
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/favicon/icon-512.png`,
      width: 512,
      height: 512,
    },
    description: DESCRIPTION,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'ko-KR',
    description: DESCRIPTION,
  };

  // 사이트가 어떤 도구들로 구성되는지 구조화 데이터로도 알린다.
  const serviceListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Yeomniverse 서비스',
    itemListElement: SERVICES.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.title,
      description: service.tagline,
      url: `${SITE_URL}/services/${service.slug}`,
    })),
  };

  return (
    <html
      lang="ko"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen font-sans antialiased"
        suppressHydrationWarning
      >
        {children}

        <Analytics />
        <GoogleAnalytics nonce={nonce} />
        <GoogleAdSense nonce={nonce} />

        <Script
          id="organization-schema"
          type="application/ld+json"
          nonce={nonce}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <Script
          id="website-schema"
          type="application/ld+json"
          nonce={nonce}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <Script
          id="service-list-schema"
          type="application/ld+json"
          nonce={nonce}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceListSchema),
          }}
        />
      </body>
    </html>
  );
}
