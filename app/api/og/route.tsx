import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { RESULTS } from '@/lib/resultData';

export const runtime = 'edge';

// 배경색 매핑 (Tailwind 클래스를 hex로 변환)
const bgColorMap: Record<string, string> = {
  'bg-purple-100': '#f3e8ff',
  'bg-yellow-100': '#fef9c3',
  'bg-blue-100': '#dbeafe',
  'bg-green-100': '#dcfce7',
  'bg-pink-100': '#fce7f3',
  'bg-orange-100': '#ffedd5',
  'bg-slate-200': '#e2e8f0',
  'bg-stone-200': '#e7e5e4',
  'bg-gray-400': '#9ca3af',
};

// 등급 결정 함수
function getGrade(resultId: string): string {
  if (resultId === 'UNICORN') return '1등급';
  if (resultId === 'LODGER') return '9등급';
  if (resultId === 'UNFILIAL') return '등급외';
  return '등급외';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resultId = searchParams.get('result') || 'UNICORN';

    // 결과 데이터 가져오기
    const result = RESULTS[resultId];
    if (!result) {
      return new Response('Result not found', { status: 404 });
    }

    const bgColor = bgColorMap[result.imageColor] || '#f5f5f4';
    const grade = getGrade(resultId);

    // 한글 폰트 로드
    const fontData = await fetch(
      new URL(
        'https://fonts.gstatic.com/s/notosanskr/v27/PbykFmXiEBPT4ITbgNA5Cgm207zl4z0.ttf',
        import.meta.url,
      ),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgColor,
          backgroundImage: `
              radial-gradient(circle at 25px 25px, rgba(0, 0, 0, 0.05) 2%, transparent 0%),
              radial-gradient(circle at 75px 75px, rgba(0, 0, 0, 0.05) 2%, transparent 0%)
            `,
          backgroundSize: '100px 100px',
          padding: '60px',
          position: 'relative',
          fontFamily: 'NotoSansKR',
        }}
      >
        {/* 상단 브랜딩 */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#292524',
              letterSpacing: '-0.02em',
            }}
          >
            효도티어
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#78716c',
              fontWeight: 500,
            }}
          >
            2025학년도 대국민 효도능력시험
          </div>
        </div>

        {/* 중앙 컨텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          {/* 등급 스탬프 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '8px solid #dc2626',
              borderRadius: '20px',
              padding: '20px 60px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transform: 'rotate(-4deg)',
            }}
          >
            <div
              style={{
                fontSize: '80px',
                fontWeight: 900,
                color: '#dc2626',
                letterSpacing: '-0.02em',
              }}
            >
              {grade}
            </div>
          </div>

          {/* 캐릭터 타이틀 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '68px',
                fontWeight: 900,
                color: '#1c1917',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              {result.title}
            </div>
            <div
              style={{
                fontSize: '32px',
                color: '#57534e',
                fontWeight: 500,
                lineHeight: 1.3,
                maxWidth: '800px',
              }}
            >
              &quot;{result.subtitle}&quot;
            </div>
          </div>
        </div>

        {/* 하단 CTA */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#292524',
            color: 'white',
            padding: '18px 36px',
            borderRadius: '14px',
            fontSize: '22px',
            fontWeight: 700,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          }}
        >
          <span>너도 테스트 하러가기 →</span>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'NotoSansKR',
            data: fontData,
            style: 'normal',
          },
        ],
      },
    );
  } catch (e: unknown) {
    console.error('OG Image generation error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
