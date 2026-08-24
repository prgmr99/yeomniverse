import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PARENT_RESULTS } from '@/lib/parentResultData';
import { buildParentResultMetadata } from '@/lib/parentResultMetadata';
import ParentResultView from '../ParentResultView';

type Props = { params: Promise<{ type: string }> };

// 유형 수가 고정이라 전부 정적 생성한다
export function generateStaticParams() {
  return Object.keys(PARENT_RESULTS).map((type) => ({ type }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  return buildParentResultMetadata(type);
}

export default async function TypedParentResultPage({ params }: Props) {
  const { type } = await params;
  if (!PARENT_RESULTS[type]) notFound();

  return <ParentResultView forcedResultId={type} />;
}
