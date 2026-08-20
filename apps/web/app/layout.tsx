import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { GoogleAdSense, GoogleAnalytics } from '@hyo/ui';
import { sans, serif } from './fonts';

// Validate required environment variables
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const DOMAIN_URL = getRequiredEnv('NEXT_PUBLIC_DOMAIN_URL');
const NAVER_VERIFICATION =
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || '';
const ADSENSE_ACCOUNT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT || 'ca-pub-7476208540300201';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  title: {
    default: 'Yeomniverse',
    template: '%s | Yeomniverse',
  },
  description:
    '어버이날 특집! 나는 효자일까 효녀일까? 효도능력시험으로 나의 효도 티어를 확인해보세요. Yeomniverse - 효도티어, FinBrief, NeuroTrade, Argus 등 다양한 디지털 서비스를 만나보세요.',
  keywords: [
    'Yeomniverse',
    '효도티어',
    '효도능력시험',
    '어버이날',
    '어버이날 테스트',
    '어버이날 선물',
    '효도 테스트',
    '효자',
    '효녀',
    '부모님께 효도',
    '카네이션',
    '5월 어버이날',
    'Hyo-Tier',
    'FinBrief',
    'AI financial briefing',
    'Argus',
    '아르고스',
    '세계 정세 지도',
    'NeuroTrade',
    'geopolitics dashboard',
    'personality quiz',
    'digital services',
    'online tools',
  ],
  applicationName: 'Yeomniverse',
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
  authors: [{ name: 'Yeomniverse' }],
  creator: 'Yeomniverse',
  publisher: 'Yeomniverse',
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
    title: '어버이날 효도능력시험 | 효도티어 - Yeomniverse',
    description:
      '어버이날 특집! 나는 효자일까 효녀일까? 효도능력시험으로 나의 효도 티어를 확인해보세요.',
    url: DOMAIN_URL,
    siteName: 'Yeomniverse',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '어버이날 효도능력시험 - 효도티어 | Yeomniverse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '어버이날 효도능력시험 | 효도티어 - Yeomniverse',
    description:
      '어버이날 특집! 나는 효자일까 효녀일까? 효도능력시험으로 나의 효도 티어를 확인해보세요.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: DOMAIN_URL,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Yeomniverse',
    url: DOMAIN_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${DOMAIN_URL}/images/favicon/icon-512.png`,
      width: 512,
      height: 512,
    },
    description:
      'Yeomniverse is a digital services company building AI-powered tools and apps, including FinBrief (AI financial briefing), Hyo-Tier (personality quiz), NeuroTrade (trading simulator) and Argus (global situation map).',
  };

  // WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Yeomniverse',
    url: DOMAIN_URL,
    description:
      'Yeomniverse - A digital services portal. Discover FinBrief for daily AI financial briefings, Hyo-Tier for personality quizzes, NeuroTrade for trading simulation and Argus for a live map of world affairs.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${DOMAIN_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
        {/* Spline hero: warm up CDN connections and prefetch the scene file
            so the 3D canvas can paint as soon as the runtime hydrates.
            React 19 hoists these resource hints into <head> automatically. */}
        <link
          rel="preconnect"
          href="https://prod.spline.design"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
        <link
          rel="preload"
          as="fetch"
          href="https://prod.spline.design/yEWkAjJuCo873kcF/scene.splinecode"
          crossOrigin=""
        />

        {children}

        <Analytics />
        <GoogleAnalytics />
        <GoogleAdSense />

        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </body>
    </html>
  );
}
