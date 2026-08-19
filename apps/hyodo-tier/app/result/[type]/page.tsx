import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RESULTS } from '@/lib/resultData';
import { buildResultMetadata } from '@/lib/resultMetadata';
import ResultView from '../ResultView';

type Props = { params: Promise<{ type: string }> };

// 유형 수가 고정이라 전부 정적 생성한다
export function generateStaticParams() {
  return Object.keys(RESULTS).map((type) => ({ type }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  return buildResultMetadata(type);
}

export default async function TypedResultPage({ params }: Props) {
  const { type } = await params;
  if (!RESULTS[type]) notFound();

  return <ResultView forcedResultId={type} />;
}
