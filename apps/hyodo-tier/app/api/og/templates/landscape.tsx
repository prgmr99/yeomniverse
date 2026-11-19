import {
  axesOf,
  ctaOf,
  OG,
  type OgTemplateProps,
  PAPER_BACKGROUND,
  subtitleOf,
} from './types';

/** 카카오·트위터 공유 미리보기용 1200×630. */
export function LandscapeCard({
  mode,
  title,
  subtitle,
  grade,
  hasScores,
  scores,
}: OgTemplateProps) {
  // "4등급" → 숫자와 '등급'을 따로 쌓는다 (웹 성적표의 도장과 같은 구성)
  const gradeNumber = grade.replace('등급', '');

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: OG.paper,
        backgroundImage: PAPER_BACKGROUND,
        padding: '52px 60px',
        fontFamily: 'NotoSansKR',
        color: OG.ink,
      }}
    >
      {/* 표제부 — 왼쪽은 발행 정보, 오른쪽은 날인란 */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: `3px solid ${OG.ink}`,
          paddingBottom: '22px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '22px',
              color: OG.inkMuted,
              letterSpacing: '0.22em',
              fontFamily: 'NotoSerifKR',
            }}
          >
            {subtitleOf(mode)}
          </div>
          <div
            style={{
              fontSize: '40px',
              marginTop: '10px',
              fontFamily: 'NotoSerifKR',
              color: OG.ink,
            }}
          >
            효도티어
          </div>
        </div>

        {/* 날인란 — 도장이 들어올 자리를 비워 둔 칸 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '150px',
            height: '150px',
            border: `2px dashed ${OG.rule}`,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '10px',
              fontSize: '15px',
              letterSpacing: '0.2em',
              color: OG.inkFaint,
            }}
          >
            날인
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '116px',
              height: '96px',
              marginTop: '16px',
              border: `5px solid ${OG.grading}`,
              borderRadius: '2px',
              color: OG.grading,
              transform: 'rotate(-9deg)',
              fontFamily: 'NotoSerifKR',
            }}
          >
            <div style={{ fontSize: '54px', lineHeight: 1 }}>{gradeNumber}</div>
            <div style={{ fontSize: '21px', lineHeight: 1, marginTop: '6px' }}>
              등급
            </div>
          </div>
        </div>
      </div>

      {/* 유형 — 카드에서 제일 먼저 읽혀야 하는 줄 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '8px',
        }}
      >
        <div
          style={{
            fontSize: '82px',
            lineHeight: 1.12,
            fontFamily: 'NotoSerifKR',
            color: OG.ink,
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '30px',
            color: OG.inkMuted,
            marginTop: '18px',
            maxWidth: '900px',
          }}
        >
          {`"${subtitle}"`}
        </div>
      </div>

      {/* 하단 — 성적 일람표와 CTA가 한 줄에 선다 */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderTop: `1px solid ${OG.rule}`,
          paddingTop: '22px',
        }}
      >
        {hasScores ? (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            {axesOf(scores).map((axis) => (
              <div
                key={axis.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: '44px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '19px',
                    color: OG.inkFaint,
                  }}
                >
                  {axis.label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    marginTop: '6px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '44px',
                      lineHeight: 1,
                      fontFamily: 'NotoSerifKR',
                      color: OG.ink,
                    }}
                  >
                    {axis.value}
                  </div>
                  {/* 축 색은 웹 성적표의 막대와 같은 잉크다 */}
                  <div
                    style={{
                      display: 'flex',
                      width: '52px',
                      height: '6px',
                      marginLeft: '10px',
                      marginBottom: '6px',
                      backgroundColor: axis.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex' }} />
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: OG.ink,
            color: OG.paper,
            padding: '18px 34px',
            borderRadius: '2px',
            fontSize: '24px',
          }}
        >
          {ctaOf(mode)}
        </div>
      </div>
    </div>
  );
}
