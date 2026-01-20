import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';

export const serif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-serif',
  display: 'optional',
  preload: true,
  adjustFontFallback: true,
});

export const sans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'optional',
  preload: true,
  adjustFontFallback: true,
});
