import {
  axesOf,
  ctaOf,
  OG,
  type OgTemplateProps,
  PAPER_BACKGROUND,
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
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: OG.paper,
        backgroundImage: PAPER_BACKGROUND,
        padding: `${SAFE_TOP}px 70px ${SAFE_BOTTOM}px`,
        fontFamily: 'NotoSansKR',
        color: OG.ink,
      }}
    >
      {/* 표제부 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          borderBottom: `4px solid ${OG.ink}`,
          paddingBottom: '28px',
        }}
      >
        <div
          style={{
            fontSize: '28px',
            color: OG.inkMuted,
            letterSpacing: '0.22em',
            fontFamily: 'NotoSerifKR',
          }}
        >
          {subtitleOf(mode)}
        </div>
        <div
          style={{
            fontSize: '56px',
            marginTop: '14px',
            fontFamily: 'NotoSerifKR',
            color: OG.ink,
          }}
        >
          효도티어
        </div>
      </div>

      {/* 중앙 — 도장과 유형 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* 날인란 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '260px',
            height: '260px',
            border: `3px dashed ${OG.rule}`,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '18px',
              fontSize: '24px',
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
              width: '200px',
              height: '166px',
              marginTop: '26px',
              border: `8px solid ${OG.grading}`,
              borderRadius: '3px',
              color: OG.grading,
              transform: 'rotate(-9deg)',
              fontFamily: 'NotoSerifKR',
            }}
          >
            <div style={{ fontSize: '94px', lineHeight: 1 }}>{gradeNumber}</div>
            <div style={{ fontSize: '36px', lineHeight: 1, marginTop: '10px' }}>
              등급
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '92px',
            lineHeight: 1.15,
            marginTop: '72px',
            fontFamily: 'NotoSerifKR',
            color: OG.ink,
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '36px',
            color: OG.inkMuted,
            lineHeight: 1.35,
            marginTop: '26px',
            maxWidth: '860px',
          }}
        >
          {`"${subtitle}"`}
        </div>

        {/* 성적 일람표 */}
        {hasScores && (
          <div
            style={{
              display: 'flex',
              marginTop: '64px',
              borderTop: `2px solid ${OG.rule}`,
              paddingTop: '32px',
            }}
          >
            {axesOf(scores).map((axis) => (
              <div
                key={axis.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '200px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '26px',
                    color: OG.inkFaint,
                  }}
                >
                  {axis.label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '62px',
                    lineHeight: 1,
                    marginTop: '10px',
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
                    width: '74px',
                    height: '8px',
                    marginTop: '16px',
                    backgroundColor: axis.color,
                  }}
                />
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
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: OG.ink,
            color: OG.paper,
            padding: '26px 52px',
            borderRadius: '2px',
            fontSize: '34px',
          }}
        >
          {ctaOf(mode)}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '26px',
            color: OG.inkFaint,
            marginTop: '24px',
          }}
        >
          hyodo-tier.yeomniverse.com
        </div>
      </div>
    </div>
  );
}
