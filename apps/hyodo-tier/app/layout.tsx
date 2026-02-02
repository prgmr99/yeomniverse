import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Footer, GoogleAdSense, GoogleAnalytics } from '@hyo/ui';
import { sans, serif } from './fonts';

const DOMAIN_URL =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyo-tier.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  title: {
    default: '효도티어 | 부모님 탐구영역',
    template: '%s | 효도티어',
  },
  description:
    '당신의 효도 등급은 몇 등급입니까? 2026학년도 대국민 효도능력시험. 지금 바로 응시하고 효도 등급을 확인하세요!',
  applicationName: '효도티어',
  keywords: [
    '효도티어',
    '부모님 탐구영역',
    '효도 테스트',
    '심리테스트',
    'MZ세대',
    '부모님 퀴즈',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  authors: [{ name: '효도티어 위원회' }],
  creator: '효도티어 위원회',
  publisher: '효도티어',
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
    title: '효도티어 | 부모님 탐구영역',
    description:
      '당신의 효도 등급은 몇 등급입니까? 2026학년도 대국민 효도능력시험',
    url: DOMAIN_URL,
    siteName: '효도티어',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '효도티어 부모님 탐구영역 시험지 표지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '효도티어 | 부모님 탐구영역',
    description:
      '당신의 효도 등급은 몇 등급입니까? 2026학년도 대국민 효도능력시험',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: DOMAIN_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'naver-site-verification': process.env
        .NEXT_PUBLIC_NAVER_SITE_VERIFICATION as string,
    },
  },
  other: {
    'google-adsense-account': process.env
      .NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT as string,
  },
  manifest: '/manifest.json',
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
    name: '효도티어',
    url: DOMAIN_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${DOMAIN_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    description: '2026학년도 대국민 효도능력시험',
  };

  // Quiz schema for better SEO
  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: '2026학년도 대국민 효도능력시험',
    description:
      '부모님에 대한 관심도, 친밀도, 표현력을 측정하는 심리 진단 테스트',
    educationalLevel: 'All ages',
    numberOfQuestions: 14,
    quiz: {
      '@type': 'Question',
      name: '부모님 탐구영역',
      text: '당신은 부모님에 대해 얼마나 알고 있습니까?',
    },
  };

  return (
    <html
      lang="ko"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <div className="flex justify-center bg-stone-200 min-h-screen">
          <div className="w-full max-w-[480px] min-h-screen bg-paper text-ink shadow-2xl relative overflow-x-hidden">
            {children}
            <Footer />
          </div>
        </div>

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
          id="quiz-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
        />
      </body>
    </html>
  );
}
