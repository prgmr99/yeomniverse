import { KakaoScript } from '@hyo/ui';

// 메타데이터는 각 page 에서 만든다.
// 레이아웃의 generateMetadata 는 searchParams 를 받지 못해,
// 여기서 유형별 메타데이터를 만들던 기존 코드는 한 번도 동작한 적이 없었다.
export default function ResultLayout({
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
