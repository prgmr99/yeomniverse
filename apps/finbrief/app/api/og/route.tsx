import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
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
        AI Financial Briefing in 30 Seconds
      </div>
      <div
        style={{
          fontSize: 24,
          color: 'rgba(255,255,255,0.8)',
        }}
      >
        Delivered to Telegram every morning at 8 AM
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
