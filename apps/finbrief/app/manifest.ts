import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FinBrief - AI Financial Briefing',
    short_name: 'FinBrief',
    description:
      'AI-powered financial briefing you can read in 30 seconds. Top news delivered to your Telegram every morning.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0077B6',
    theme_color: '#0077B6',
    icons: [
      {
        src: '/images/favicon/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/favicon/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
