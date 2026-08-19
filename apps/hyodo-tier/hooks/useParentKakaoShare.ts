// 호출한 화면이 토스트를 띄울 수 있도록 결과를 돌려준다 (alert 금지)
export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

export const useParentKakaoShare = (
  resultType: string,
  resultTitle: string,
  scores: { interest: number; intimacy: number; expression: number },
  childName?: string,
) => {
  const shareKakao = async (): Promise<ShareOutcome> => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (window.Kakao && !window.Kakao.isInitialized() && kakaoKey) {
      window.Kakao.init(kakaoKey);
    }

    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_DOMAIN_URL;

    // 자식이 링크를 누르면 자식용 퀴즈로 진입. 부모 결과는 쿼리로 동봉해
    // 자식이 테스트를 마친 뒤 /result에서 비교 화면을 띄울 수 있게 한다.
    const trimmedName = childName?.trim() ?? '';
    const nameQuery = trimmedName
      ? `&pname=${encodeURIComponent(trimmedName)}`
      : '';
    const shareUrl = `${baseUrl}/quiz?parent=${resultType}&pi=${scores.interest}&pn=${scores.intimacy}&pe=${scores.expression}${nameQuery}`;
    const ogImageUrl = `${baseUrl}/api/og?result=${resultType}&interest=${scores.interest}&intimacy=${scores.intimacy}&expression=${scores.expression}&mode=parent`;
    const shareTitle = `[효도성적표 · 부모편] ${resultTitle}`;
    const shareText = `나는 ${resultTitle}! 너는 나를 얼마나 아니? 👉 자식 편 테스트 풀어보기 #효도티어 #엄빠편`;

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
            title: '내 점수 보고, 너도 풀어보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
      return 'shared';
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return 'shared';
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return 'cancelled';
        }
        console.error('navigator.share failed:', err);
        return 'failed';
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        return 'copied';
      } catch (err) {
        console.error('clipboard write failed:', err);
        return 'failed';
      }
    }

    return 'failed';
  };

  return { shareKakao };
};
