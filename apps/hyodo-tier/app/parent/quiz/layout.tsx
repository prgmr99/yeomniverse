import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문제풀기 (부모편)',
  description: '2026학년도 대국민 효도능력시험 · 부모편 14문항.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyodo-tier.yeomniverse.com'}/parent/quiz`,
  },
};

export default function ParentQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
