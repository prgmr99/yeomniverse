import type { Metadata } from 'next';
import { RESULTS } from '@/lib/resultData';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const resultId = params?.result as string | undefined;

  // 기본 메타데이터
  const baseMetadata: Metadata = {
    title: '나의 효도 등급 결과',
    description:
      '2025학년도 대국민 효도능력시험 결과를 확인하세요. 당신의 효도 등급과 상세한 분석 결과를 제공합니다.',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/result`,
    },
  };

  // 공유된 결과가 있으면 동적 메타데이터 생성
  if (resultId && RESULTS[resultId]) {
    const result = RESULTS[resultId];
    const interest = (params?.interest as string) || '0';
    const intimacy = (params?.intimacy as string) || '0';
    const expression = (params?.expression as string) || '0';

    return {
      title: `나는 ${result.title}!`,
      description: `${result.subtitle} - 효도티어 진단 결과를 확인하세요!`,
      keywords: [...result.tags, '효도티어 결과', '효도 등급'],
      openGraph: {
        title: `나는 ${result.title}! | 효도티어`,
        description: result.subtitle,
        url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/result?result=${resultId}&interest=${interest}&intimacy=${intimacy}&expression=${expression}`,
        type: 'website',
        images: [
          {
            url: `/api/og?result=${resultId}`,
            width: 1200,
            height: 630,
            alt: `${result.title} - 효도티어 결과`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `나는 ${result.title}!`,
        description: result.subtitle,
        images: [`/api/og?result=${resultId}`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/result`,
      },
    };
  }

  return baseMetadata;
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
