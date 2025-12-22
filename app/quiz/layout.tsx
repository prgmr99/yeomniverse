import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '효도 능력 시험 문제풀이',
  description:
    '부모님에 대해 얼마나 알고 계신가요? 14개의 문제를 풀고 당신의 효도 등급을 확인하세요. 관심도, 친밀도, 표현력을 종합적으로 진단합니다.',
  keywords: ['효도티어 퀴즈', '부모님 퀴즈', '효도 테스트 문제', '심리테스트'],
  openGraph: {
    title: '효도 능력 시험 문제풀이 | 효도티어',
    description: '14개의 문제로 당신의 효도 등급을 확인하세요',
    url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/quiz`,
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/quiz`,
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
