import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';

// Korean-only fonts include all glyphs if no subset is specified
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
