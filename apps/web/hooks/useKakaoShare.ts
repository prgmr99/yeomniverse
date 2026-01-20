import { useEffect } from 'react';

export const useKakaoShare = (
  resultType: string,
  resultTitle: string,
  scores: { interest: number; intimacy: number; expression: number },
) => {
  const shareKakao = () => {
    if (!window.Kakao) {
      alert('카카오톡 로딩 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_DOMAIN_URL;

    const shareUrl = `${baseUrl}/result?result=${resultType}&interest=${scores.interest}&intimacy=${scores.intimacy}&expression=${scores.expression}`;
    const totalScore = scores.interest + scores.intimacy + scores.expression;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `[효도성적표] ${resultTitle}`,
        description: `나의 효도 점수는 ${totalScore}점! 너는 몇 등급이야? #엄빠고사 #효도티어`,
        imageUrl: '/og-image.png',
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
  };

  // 카카오 SDK 초기화
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  }, []);

  return { shareKakao };
};

// window 객체 타입 보강
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}
