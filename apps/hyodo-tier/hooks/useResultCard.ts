'use client';

import { useCallback, useState } from 'react';

export type SaveOutcome = 'shared' | 'downloaded' | 'cancelled' | 'failed';

type Params = {
  resultType: string;
  scores: { interest: number; intimacy: number; expression: number };
  mode?: 'child' | 'parent';
};

/**
 * 결과 카드(세로형 이미지)를 만들어 공유하거나 저장한다.
 *
 * 이미지는 공유 미리보기와 같은 /api/og 템플릿에서 뽑는다 — 클라이언트에서
 * 캡처하지 않으므로 기기·브라우저에 따라 폰트나 레이아웃이 달라지지 않는다.
 */
export function useResultCard({ resultType, scores, mode = 'child' }: Params) {
  const [isSaving, setIsSaving] = useState(false);

  const saveCard = useCallback(async (): Promise<SaveOutcome> => {
    setIsSaving(true);
    try {
      const query = new URLSearchParams({
        result: resultType,
        interest: String(scores.interest),
        intimacy: String(scores.intimacy),
        expression: String(scores.expression),
        ratio: 'story',
      });
      if (mode === 'parent') query.set('mode', 'parent');

      const res = await fetch(`/api/og?${query}`);
      if (!res.ok) return 'failed';
      const blob = await res.blob();

      // 파일명은 ASCII로 — 한글 파일명을 못 받는 인앱 브라우저가 있다
      const filename = `hyodo-tier-${resultType.toLowerCase()}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      // 1순위: 파일 공유 시트 (인스타 스토리로 바로 넘길 수 있다)
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          return 'shared';
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            return 'cancelled';
          }
          // 공유 시트가 실패하면 아래 다운로드로 흘려보낸다
          console.error('file share failed:', err);
        }
      }

      // 2순위: 다운로드 — 카카오톡 인앱 브라우저처럼 파일 공유가 막힌 환경
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
      return 'downloaded';
    } catch (err) {
      console.error('result card save failed:', err);
      return 'failed';
    } finally {
      setIsSaving(false);
    }
  }, [resultType, scores, mode]);

  return { saveCard, isSaving };
}
