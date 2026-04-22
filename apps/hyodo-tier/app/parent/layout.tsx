import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '제2교시 자녀 탐구영역',
  description:
    '부모님용 효도티어 — 자식에 대해 얼마나 알고 계신가요? 결과를 자식에게 공유하고 서로의 성적표를 맞춰보세요.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://hyodo-tier.yeomniverse.com'}/parent`,
  },
};

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
