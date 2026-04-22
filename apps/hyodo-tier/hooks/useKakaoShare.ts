import { useEffect } from 'react';

export const useKakaoShare = (
  resultType: string,
  resultTitle: string,
  scores: { interest: number; intimacy: number; expression: number },
) => {
  const shareKakao = async () => {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_DOMAIN_URL;

    const shareUrl = `${baseUrl}/result?result=${resultType}&interest=${scores.interest}&intimacy=${scores.intimacy}&expression=${scores.expression}`;
    const ogImageUrl = `${baseUrl}/api/og?result=${resultType}&interest=${scores.interest}&intimacy=${scores.intimacy}&expression=${scores.expression}`;
    const totalScore = scores.interest + scores.intimacy + scores.expression;
    const shareTitle = `[효도성적표] ${resultTitle}`;
    const shareText = `나의 효도 점수는 ${totalScore}점! 너는 몇 등급이야? #엄빠고사 #효도티어`;

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
      alert('링크가 복사되었습니다! 친구에게 붙여넣어 공유하세요.');
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
