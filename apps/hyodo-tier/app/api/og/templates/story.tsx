import {
  ctaOf,
  DOT_BACKGROUND,
  type OgTemplateProps,
  subtitleOf,
} from './types';

/** 스토리 업로드 시 상·하단이 앱 UI(프로필·답장창)에 가려지는 영역 */
const SAFE_TOP = 260;
const SAFE_BOTTOM = 280;

/** 인스타그램 스토리 업로드용 1080×1920. */
export function StoryCard({
  mode,
  title,
  subtitle,
  grade,
  bgColor,
  hasScores,
  scores,
}: OgTemplateProps) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: bgColor,
        backgroundImage: DOT_BACKGROUND,
        backgroundSize: '100px 100px',
        padding: `${SAFE_TOP}px 70px ${SAFE_BOTTOM}px`,
        fontFamily: 'NotoSansKR',
      }}
    >
      {/* 상단 브랜딩 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 900,
            color: '#292524',
            letterSpacing: '-0.02em',
          }}
        >
          효도티어
        </div>
        <div style={{ fontSize: '26px', color: '#78716c', fontWeight: 500 }}>
          {subtitleOf(mode)}
        </div>
      </div>

      {/* 중앙 컨텐츠 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
          textAlign: 'center',
        }}
      >
        {/* 등급 스탬프 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '10px solid #dc2626',
            borderRadius: '24px',
            padding: '24px 72px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transform: 'rotate(-4deg)',
          }}
        >
          <div
            style={{
              fontSize: '104px',
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
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '76px',
              fontWeight: 900,
              color: '#1c1917',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '34px',
              color: '#57534e',
              fontWeight: 500,
              lineHeight: 1.35,
              maxWidth: '860px',
            }}
          >
            {`"${subtitle}"`}
          </div>
        </div>

        {/* 점수 필 — 세 점수가 모두 0이면 숨김 */}
        {hasScores && (
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: '관심도', value: scores.interest },
              { label: '친밀도', value: scores.intimacy },
              { label: '표현력', value: scores.expression },
            ].map((pill) => (
              <div
                key={pill.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px 36px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  minWidth: '160px',
                }}
              >
                <span
                  style={{ fontSize: 52, fontWeight: 900, color: '#1c1917' }}
                >
                  {pill.value}
                </span>
                <span style={{ fontSize: 22, color: '#57534e', marginTop: 6 }}>
                  {pill.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 CTA — 스크린샷으로 퍼져도 찾아올 수 있게 주소를 같이 박는다 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '22px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#292524',
            color: 'white',
            padding: '26px 52px',
            borderRadius: '18px',
            fontSize: '32px',
            fontWeight: 700,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          }}
        >
          <span>{ctaOf(mode)}</span>
        </div>
        <div style={{ fontSize: '26px', color: '#78716c', fontWeight: 500 }}>
          hyodo-tier.yeomniverse.com
        </div>
      </div>
    </div>
  );
}
