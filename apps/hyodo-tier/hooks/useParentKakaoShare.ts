import { PARENT_SHARE_COPY, pickShareCopy } from '@/lib/shareCopy';
import { createShareId } from '@/lib/shareRef';

// 호출한 화면이 토스트를 띄울 수 있도록 결과를 돌려준다 (alert 금지)
export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

// shareId는 GA에서 이 공유 건이 데려온 방문자를 되짚기 위한 값이다.
export type ShareResult = {
  outcome: ShareOutcome;
  shareId: string;
  copyVariant: string;
};

export const useParentKakaoShare = (
  resultType: string,
  resultTitle: string,
  scores: { interest: number; intimacy: number; expression: number },
  childName?: string,
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

    // 자식이 링크를 누르면 자식용 퀴즈로 진입. 부모 결과는 쿼리로 동봉해
    // 자식이 테스트를 마친 뒤 /result에서 비교 화면을 띄울 수 있게 한다.
    const trimmedName = childName?.trim() ?? '';
    const nameQuery = trimmedName
      ? `&pname=${encodeURIComponent(trimmedName)}`
      : '';
    const shareUrl = `${baseUrl}/quiz?parent=${resultType}&pi=${scores.interest}&pn=${scores.intimacy}&pe=${scores.expression}${nameQuery}&ref=${shareId}`;
    const ogImageUrl = `${baseUrl}/api/og?result=${resultType}&interest=${scores.interest}&intimacy=${scores.intimacy}&expression=${scores.expression}&mode=parent`;
    const copy = pickShareCopy(PARENT_SHARE_COPY, shareId);
    const shareTitle = `[효도성적표 · 부모편] ${resultTitle}`;
    const shareText = copy.text({ grade: 0, title: resultTitle });

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
            title: copy.buttonTitle,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
      return { outcome: 'shared', shareId, copyVariant: copy.id };
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return { outcome: 'shared', shareId, copyVariant: copy.id };
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return { outcome: 'cancelled', shareId, copyVariant: copy.id };
        }
        console.error('navigator.share failed:', err);
        return { outcome: 'failed', shareId, copyVariant: copy.id };
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        return { outcome: 'copied', shareId, copyVariant: copy.id };
      } catch (err) {
        console.error('clipboard write failed:', err);
        return { outcome: 'failed', shareId, copyVariant: copy.id };
      }
    }

    return { outcome: 'failed', shareId, copyVariant: copy.id };
  };

  return { shareKakao };
};
