// hooks/useKakaoShare.ts
import { useEffect } from 'react';

export const useKakaoShare = (
  resultType: string,
  resultTitle: string,
  score: number,
) => {
  useEffect(() => {
    // 카카오 SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // ⚠️ 여기에 본인의 JavaScript 키를 넣어야 합니다! (환경변수 추천)
      window.Kakao.init(
        process.env.NEXT_PUBLIC_KAKAO_API_KEY || 'YOUR_KAKAO_JS_KEY',
      );
    }
  }, []);

  const shareKakao = () => {
    if (!window.Kakao) {
      alert('카카오톡 로딩 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const shareUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://hyo-tier.vercel.app';

    // 동적 썸네일 URL 생성
    const imageUrl = `${shareUrl}/api/og?type=${resultType}&score=${score}`;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `[효도성적표] ${resultTitle}`,
        description: `나의 효도 점수는 ${score}점! 너는 몇 등급이야? #엄빠고사 #효도티어`,
        imageUrl: imageUrl, // 우리가 만든 동적 이미지
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

  return { shareKakao };
};

// window 객체 타입 보강
declare global {
  interface Window {
    Kakao: any;
  }
}
