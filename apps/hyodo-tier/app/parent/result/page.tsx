import type { Metadata } from 'next';
import { buildParentResultMetadata } from '@/lib/parentResultMetadata';
import ParentResultView from './ParentResultView';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 본인 응시 결과가 머무는 주소이자, 기존에 공유된 ?result=... 링크의 하위호환.
// 신규 유형 랜딩은 /parent/result/[type] 로 나간다.
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  return buildParentResultMetadata(params?.result as string | undefined);
}

export default function ParentResultPage() {
  return <ParentResultView />;
}
