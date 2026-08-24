import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CHILD_SHARE_COPY, pickShareCopy } from '@/lib/shareCopy';
import { useKakaoShare } from './useKakaoShare';

type FeedPayload = {
  content: { title: string; description: string; imageUrl: string };
  buttons: { title: string; link: { webUrl: string } }[];
};

const SCORES = { interest: 120, intimacy: 90, expression: 70 };

function mockKakao() {
  const sendDefault = vi.fn();
  vi.stubGlobal('window', {
    ...globalThis.window,
    location: { origin: 'https://hyodo-tier.yeomniverse.com' },
    Kakao: {
      isInitialized: () => true,
      init: vi.fn(),
      Share: { sendDefault },
    },
  });
  return sendDefault;
}

const share = async () => {
  const { result } = renderHook(() =>
    useKakaoShare('TSUNDERE', '방구석 츤데레', 5, SCORES),
  );
  return result.current.shareKakao();
};

describe('useKakaoShare', () => {
  let sendDefault: ReturnType<typeof mockKakao>;

  beforeEach(() => {
    sendDefault = mockKakao();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('배정된 변형의 문구와 버튼을 그대로 카카오에 싣는다', async () => {
    const { shareId, copyVariant } = await share();

    const payload = sendDefault.mock.calls[0][0] as FeedPayload;
    const expected = pickShareCopy(CHILD_SHARE_COPY, shareId);

    expect(copyVariant).toBe(expected.id);
    expect(payload.content.description).toBe(
      expected.text({ grade: 5, title: '방구석 츤데레' }),
    );
    expect(payload.buttons[0].title).toBe(expected.buttonTitle);
  });

  // 공유 링크에 ref가 빠지면 유입 계측이 통째로 끊긴다
  it('공유 URL에 유형 경로와 ref를 모두 담는다', async () => {
    const { shareId } = await share();
    const payload = sendDefault.mock.calls[0][0] as FeedPayload;
    const url = payload.buttons[0].link.webUrl;

    expect(url).toContain('/result/TSUNDERE');
    expect(url).toContain(`ref=${shareId}`);
    expect(url).toContain('interest=120');
  });

  it('공유할 때마다 새 shareId를 발급한다', async () => {
    const ids = new Set<string>();
    for (let i = 0; i < 10; i++) ids.add((await share()).shareId);
    expect(ids.size).toBe(10);
  });

  it('OG 이미지에는 결과 유형과 점수가 실린다', async () => {
    await share();
    const payload = sendDefault.mock.calls[0][0] as FeedPayload;

    expect(payload.content.imageUrl).toContain('result=TSUNDERE');
    expect(payload.content.imageUrl).toContain('intimacy=90');
  });
});
