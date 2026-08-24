import {
  ctaOf,
  DOT_BACKGROUND,
  type OgTemplateProps,
  subtitleOf,
} from './types';

/** 카카오·트위터 공유 미리보기용 1200×630. */
export function LandscapeCard({
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
        justifyContent: 'center',
        backgroundColor: bgColor,
        backgroundImage: DOT_BACKGROUND,
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
        <div style={{ fontSize: '16px', color: '#78716c', fontWeight: 500 }}>
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
            {title}
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
            {`"${subtitle}"`}
          </div>

          {/* 점수 필 — 세 점수가 모두 0이면 숨김 */}
          {hasScores && (
            <div style={{ display: 'flex', gap: '20px', marginTop: '24px' }}>
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
                    padding: '16px 28px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    minWidth: '120px',
                  }}
                >
                  <span
                    style={{ fontSize: 36, fontWeight: 900, color: '#1c1917' }}
                  >
                    {pill.value}
                  </span>
                  <span
                    style={{ fontSize: 16, color: '#57534e', marginTop: 4 }}
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
        <span>{ctaOf(mode)}</span>
      </div>
    </div>
  );
}
