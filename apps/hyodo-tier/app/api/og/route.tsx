import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { PARENT_RESULTS } from '@/lib/parentResultData';
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
  'bg-gray-300': '#d1d5db',
};

// 등급 결정 함수
function getGrade(resultId: string, mode: string): string {
  if (mode === 'parent') {
    if (resultId === 'UNICORN_PARENT') return '1등급';
    if (resultId === 'LODGER_PARENT') return '9등급';
    return '등급외';
  }
  if (resultId === 'UNICORN') return '1등급';
  if (resultId === 'LODGER') return '9등급';
  if (resultId === 'UNFILIAL') return '등급외';
  return '등급외';
}

// 템플릿에 고정으로 들어가는 문자열 (폰트 서브셋 요청에 함께 넘긴다)
const OG_STATIC_TEXT = [
  '효도티어',
  '2026학년도 효도능력시험 · 부모편',
  '2026학년도 대국민 효도능력시험',
  '관심도친밀도표현력',
  '자식도 풀러가기 →',
  '너도 테스트 하러가기 →',
  '1등급9등급등급외',
  '0123456789"',
].join('');

// gstatic 직링크는 폰트 버전이 바뀌면 404가 되므로 CSS API로 매번 해석한다.
// satori는 woff2를 읽지 못해 truetype/opentype src만 사용한다.
async function loadNotoSansKr(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`;
  const css = await fetch(cssUrl).then((res) => res.text());
  const src = css.match(
    /src:\s*url\((\S+?)\)\s*format\('(?:truetype|opentype)'\)/,
  );

  if (!src) {
    throw new Error(
      `Noto Sans KR 폰트 URL을 찾지 못했습니다: ${css.slice(0, 200)}`,
    );
  }

  return fetch(src[1]).then((res) => res.arrayBuffer());
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resultId = searchParams.get('result') || 'UNICORN';
    const mode = searchParams.get('mode') === 'parent' ? 'parent' : 'child';

    const interest = Number(searchParams.get('interest')) || 0;
    const intimacy = Number(searchParams.get('intimacy')) || 0;
    const expression = Number(searchParams.get('expression')) || 0;
    const hasScores = interest !== 0 || intimacy !== 0 || expression !== 0;

    // 결과 데이터 가져오기 (mode에 따라 분기)
    const result =
      mode === 'parent' ? PARENT_RESULTS[resultId] : RESULTS[resultId];
    if (!result) {
      return new Response('Result not found', { status: 404 });
    }

    const bgColor = bgColorMap[result.imageColor] || '#f5f5f4';
    const grade = getGrade(resultId, mode);

    // 한글 폰트 로드 (이 이미지에 실제로 쓰이는 글자만 서브셋으로 받는다)
    const fontData = await loadNotoSansKr(
      OG_STATIC_TEXT + result.title + result.subtitle + grade,
    );

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
            {mode === 'parent'
              ? '2026학년도 효도능력시험 · 부모편'
              : '2026학년도 대국민 효도능력시험'}
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
              {`"${result.subtitle}"`}
            </div>

            {/* 점수 필 — 세 점수가 모두 0이면 숨김 */}
            {hasScores && (
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '24px',
                }}
              >
                {[
                  { label: '관심도', value: interest },
                  { label: '친밀도', value: intimacy },
                  { label: '표현력', value: expression },
                ].map((pill) => (
                  <div
                    key={pill.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '16px 28px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      minWidth: '120px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: '#1c1917',
                      }}
                    >
                      {pill.value}
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        color: '#57534e',
                        marginTop: 4,
                      }}
                    >
                      {pill.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
          <span>
            {mode === 'parent' ? '자식도 풀러가기 →' : '너도 테스트 하러가기 →'}
          </span>
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
