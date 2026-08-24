import { createShareId } from '@/lib/shareRef';

// 호출한 화면이 토스트를 띄울 수 있도록 결과를 돌려준다 (alert 금지)
export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

// shareId는 GA에서 이 공유 건이 데려온 방문자를 되짚기 위한 값이다.
export type ShareResult = { outcome: ShareOutcome; shareId: string };

export const useKakaoShare = (
  resultType: string,
  resultTitle: string,
  resultGrade: number,
  scores: { interest: number; intimacy: number; expression: number },
) => {
  const shareKakao = async (): Promise<ShareResult> => {
    const shareId = createShareId();
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (window.Kakao && !window.Kakao.isInitialized() && kakaoKey) {
      window.Kakao.init(kakaoKey);
    }

    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_DOMAIN_URL;

    // 유형이 경로에 있어야 정적 메타데이터·OG가 붙고 유형별 검색 유입도 쌓인다
    const shareUrl = `${baseUrl}/result/${resultType}?interest=${scores.interest}&intimacy=${scores.intimacy}&expression=${scores.expression}&ref=${shareId}`;
    const ogImageUrl = `${baseUrl}/api/og?result=${resultType}&interest=${scores.interest}&intimacy=${scores.intimacy}&expression=${scores.expression}`;
    const shareTitle = `[효도성적표] ${resultTitle}`;
    const shareText = `나의 효도 등급은 ${resultGrade}등급! 너는 몇 등급이야? #엄빠고사 #효도티어`;

    if (window.Kakao?.Share) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle,
          description: shareText,
          imageUrl: ogImageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '성적표 확인하러 가기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
      return { outcome: 'shared', shareId };
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return { outcome: 'shared', shareId };
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return { outcome: 'cancelled', shareId };
        }
        console.error('navigator.share failed:', err);
        return { outcome: 'failed', shareId };
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        return { outcome: 'copied', shareId };
      } catch (err) {
        console.error('clipboard write failed:', err);
        return { outcome: 'failed', shareId };
      }
    }

    return { outcome: 'failed', shareId };
  };

  return { shareKakao };
};
