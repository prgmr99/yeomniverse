'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function GoogleAdSense() {
  const pathname = usePathname();

  // 퀴즈 페이지(/quiz)에서는 광고 노출 제외 (정책 위반 방지)
  if (pathname?.startsWith('/quiz')) {
    return null;
  }

  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT;

  if (!pId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
