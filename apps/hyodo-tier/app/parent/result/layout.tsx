import { KakaoScript } from '@hyo/ui';

// 메타데이터는 page 단위에서 만든다 — 레이아웃의 generateMetadata는
// searchParams를 받지 못해 유형별 OG를 붙일 수 없다.
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
