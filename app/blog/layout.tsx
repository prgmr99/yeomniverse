import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '효도 블로그',
  description:
    '부모님과의 관계를 개선하는 효도 팁, 대화 주제, 실천 방법 등 유익한 정보를 제공합니다. MZ세대를 위한 현실적인 효도 가이드.',
  keywords: [
    '효도 블로그',
    '효도 방법',
    '부모님 대화',
    '효도 팁',
    '효도 가이드',
    'MZ세대 효도',
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
  openGraph: {
    title: '효도 블로그 | 효도티어',
    description: '부모님과의 관계를 개선하는 효도 팁과 가이드',
    url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/blog`,
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/blog`,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
