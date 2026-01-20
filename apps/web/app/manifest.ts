import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '효도티어 | 부모님 탐구영역',
    short_name: '효도티어',
    description:
      '당신의 효도 등급은 몇 등급입니까? 2025학년도 대국민 효도능력시험',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfbf7',
    theme_color: '#fdfbf7',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon-180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
