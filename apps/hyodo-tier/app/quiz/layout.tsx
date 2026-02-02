import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문제풀기',
  description:
    '2026학년도 대국민 효도능력시험 문제를 풀어보세요. 14문항으로 당신의 효도 등급을 측정합니다.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://hyodo-tier.yeomniverse.com/quiz' },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
