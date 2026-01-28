import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import {
	GoogleAdSense,
	GoogleAnalytics,
} from '@hyo/ui';
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
const NAVER_VERIFICATION = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || '';
const ADSENSE_ACCOUNT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT || '';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  title: {
    default: 'Yeomniverse',
    template: '%s | Yeomniverse',
  },
  description: 'Yeomniverse - 디지털 서비스 포털. 효도티어, FinBrief 등 다양한 서비스를 만나보세요.',
  applicationName: 'Yeomniverse',
  icons: {
    icon: [
      { url: '/images/favicon/icon.svg', type: 'image/svg+xml' },
      { url: '/images/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/favicon/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/images/favicon/favicon.ico',
    apple: [
      { url: '/images/favicon/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
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
    title: 'Yeomniverse',
    description: 'Yeomniverse - 디지털 서비스 포털',
    url: DOMAIN_URL,
    siteName: 'Yeomniverse',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yeomniverse',
    description: 'Yeomniverse - 디지털 서비스 포털',
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
    description: 'Yeomniverse - 디지털 서비스 포털',
  };

  return (
    <html
      lang="ko"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
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
      </body>
    </html>
  );
}
