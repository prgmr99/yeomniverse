import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
          }}
        >
          FinBrief
        </div>
        <div
          style={{
            fontSize: 36,
            color: 'white',
            marginBottom: 16,
          }}
        >
          30초 만에 읽는 AI 재테크 브리핑
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          매일 아침 8시 텔레그램 배달
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
