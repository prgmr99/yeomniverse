import { useEffect } from 'react';

export const useParentKakaoShare = (
  resultType: string,
  resultTitle: string,
  scores: { interest: number; intimacy: number; expression: number },
  childName?: string,
) => {
  const shareKakao = async () => {
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
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('navigator.share failed:', err);
        }
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다! 자식에게 붙여넣어 공유하세요.');
    } else {
      alert(`링크를 복사해서 공유하세요: ${shareUrl}`);
    }
  };

  // 카카오 SDK 초기화
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (window.Kakao && !window.Kakao.isInitialized() && kakaoKey) {
      window.Kakao.init(kakaoKey);
    }
  }, []);

  return { shareKakao };
};
