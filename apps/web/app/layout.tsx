import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import {
	Footer,
	GoogleAdSense,
	GoogleAnalytics,
	KakaoScript,
} from '@hyo/ui';
import { sans, serif } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN_URL as string),
  title: {
    default: '효도티어 | 부모님 탐구영역',
    template: '%s | 효도티어',
  },
  description:
    '당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험. 지금 바로 응시하고 효도 등급을 확인하세요!',
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
  authors: [{ name: 'Hyo-Tier Committee' }],
  creator: 'Hyo-Tier Committee',
  publisher: 'Hyo-Tier Committee',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    title: '효도티어',
    statusBarStyle: 'default',
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
      '당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험',
    url: process.env.NEXT_PUBLIC_DOMAIN_URL,
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
      '당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_DOMAIN_URL,
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
  // Enhanced JSON-LD with Quiz schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '효도티어',
    url: process.env.NEXT_PUBLIC_DOMAIN_URL,
    description:
      '당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Quiz schema for better SEO
  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: '2025학년도 대국민 효도능력시험',
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

  // Organization schema - Google이 사이트 소유자를 인식하도록 함
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '효도티어',
    alternateName: '효도티어 위원회',
    url: process.env.NEXT_PUBLIC_DOMAIN_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    description:
      'MZ세대를 위한 재미있고 의미있는 효도 자가진단 서비스. 2025학년도 대국민 효도능력시험을 통해 부모님과의 관계를 진단합니다.',
    foundingDate: '2025',
    sameAs: [
      // 소셜 미디어 링크가 있으면 여기에 추가
      // 'https://www.instagram.com/hyo_tier',
      // 'https://www.facebook.com/hyotier',
    ],
  };
  return (
    <html
      lang="ko"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-stone-200 flex justify-center min-h-screen font-sans antialiased">
        {/* 모바일 뷰 컨테이너 
          - max-w-[480px]: 모바일 너비 제한
          - bg-paper: 갱지 배경색 (Tailwind v4 변수)
          - text-ink: 기본 텍스트 색상
        */}
        <div className="w-full max-w-[480px] min-h-screen bg-paper text-ink shadow-2xl relative overflow-x-hidden">
          {children}
          <Footer />
        </div>

        <GoogleAnalytics />
        <KakaoScript />
        <GoogleAdSense />

        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="quiz-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
