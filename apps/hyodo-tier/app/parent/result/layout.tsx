import { KakaoScript } from '@hyo/ui';
import type { Metadata } from 'next';
import { PARENT_RESULTS } from '@/lib/parentResultData';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const resultId = params?.result as string | undefined;

  const baseMetadata: Metadata = {
    title: '나의 효도 등급 결과 (부모편)',
    description:
      '2026학년도 효도능력시험 · 부모편 결과를 확인하세요. 자식에 대한 이해도와 소통 유형을 분석한 결과입니다.',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/parent/result`,
    },
  };

  if (resultId && PARENT_RESULTS[resultId]) {
    const result = PARENT_RESULTS[resultId];
    const interest = (params?.interest as string) || '0';
    const intimacy = (params?.intimacy as string) || '0';
    const expression = (params?.expression as string) || '0';

    return {
      title: `나는 ${result.title}!`,
      description: `${result.subtitle} - 효도티어 부모편 진단 결과를 확인하세요!`,
      keywords: [...result.tags, '효도티어 부모편', '부모 유형'],
      openGraph: {
        title: `나는 ${result.title}! | 효도티어 부모편`,
        description: result.subtitle,
        url: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/parent/result?result=${resultId}&interest=${interest}&intimacy=${intimacy}&expression=${expression}`,
        type: 'website',
        images: [
          {
            url: `/api/og?result=${resultId}&mode=parent`,
            width: 1200,
            height: 630,
            alt: `${result.title} - 효도티어 부모편 결과`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `나는 ${result.title}!`,
        description: result.subtitle,
        images: [`/api/og?result=${resultId}&mode=parent`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/parent/result`,
      },
    };
  }

  return baseMetadata;
}

export default function ParentResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <KakaoScript />
    </>
  );
}
