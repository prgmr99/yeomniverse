import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'UNICORN'; // 기본값
    const score = searchParams.get('score') || '0';

    // 캐릭터별 데이터 매핑 (간단하게)
    const TITLES: Record<string, string> = {
      UNICORN: '전설의 유니콘 효자',
      FINANCIAL: '금융치료 전문의',
      K_LEADER: 'K-장녀/장남 리더십',
      TSUNDERE: '방구석 츤데레',
      SOULMATE: '영혼의 단짝',
      SHOW_WINDOW: '쇼윈도 기획자',
      AI_BOT: 'AI 음성 사서함',
      LODGER: '하숙집 장기 투숙객',
    };

    const COLORS: Record<string, string> = {
      UNICORN: '#d8b4fe', // purple
      FINANCIAL: '#fde047', // yellow
      K_LEADER: '#93c5fd', // blue
      TSUNDERE: '#86efac', // green
      SOULMATE: '#f9a8d4', // pink
      SHOW_WINDOW: '#fdba74', // orange
      AI_BOT: '#cbd5e1', // slate
      LODGER: '#d6d3d1', // stone
    };

    const title = TITLES[type] || '효도 등급 측정중...';
    const bg = COLORS[type] || '#FDFBF7';

    // 폰트 로드 (구글 폰트 fetch)
    // 실제 배포 시에는 로컬 폰트 파일을 ArrayBuffer로 읽어오는 것이 가장 안정적입니다.
    // 여기서는 MVP를 위해 fetch 방식을 사용합니다.
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
          backgroundColor: '#FDFBF7', // 갱지 배경
          position: 'relative',
        }}
      >
        {/* 테두리 장식 */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: '4px solid #1c1917',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 배경 컬러 박스 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              backgroundColor: bg,
              opacity: 0.5,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 24, color: '#DC2626', fontWeight: 900 }}>
              2025학년도 효도능력시험 성적표
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 900,
                  color: '#1c1917',
                  marginBottom: 10,
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: 30, color: '#374151' }}>
                나의 점수는?{' '}
                <span
                  style={{ fontWeight: 900, color: '#DC2626', marginLeft: 10 }}
                >
                  {score}점
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: 30,
                padding: '10px 30px',
                backgroundColor: '#1c1917',
                color: 'white',
                borderRadius: 50,
                fontSize: 24,
              }}
            >
              너도 테스트 하러가기 👉
            </div>
          </div>
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
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
