import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './finbrief.css';
import { GoogleAnalytics } from '@hyo/ui';
import { sans, serif } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com'),
  title: {
    default: 'FinBrief | AI 재테크 브리핑',
    template: '%s | FinBrief',
  },
  description: '30초 만에 읽는 AI 재테크 브리핑. 매일 아침 8시, 핵심 뉴스만 텔레그램으로 받아보세요.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'FinBrief',
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Organization schema for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FinBrief',
    url: process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com'}/images/favicon/icon-512.png`,
      width: 512,
      height: 512,
    },
    description: '30초 만에 읽는 AI 재테크 브리핑',
  };

  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <GoogleAnalytics />

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
