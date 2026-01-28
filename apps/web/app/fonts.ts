import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';

// 한국어 전용 폰트는 subset을 지정하지 않으면 모든 글리프를 포함합니다
export const serif = Noto_Serif_KR({
  weight: ['400', '700', '900'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const sans = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});
