import type { Metadata } from 'next';
import { buildResultMetadata } from '@/lib/resultMetadata';
import ResultView from './ResultView';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 기존에 공유된 /result?result=... 링크의 하위호환. 신규 공유는 /result/[type] 로 나간다.
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  return buildResultMetadata(params?.result as string | undefined);
}

export default function ResultPage() {
  return <ResultView />;
}
