/**
 * 공유 링크에 실어 보내는 발신 식별자.
 *
 * GA에서 share_clicked(발신)와 shared_link_opened(수신)를 잇는 용도로만 쓴다.
 * 서버에 저장하지 않고 개인정보도 담지 않는다.
 */
export function createShareId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

/** 공유 URL에서 되돌아온 ref 값. 길이를 제한해 계측 파라미터 오염을 막는다. */
export function readShareRef(raw: string | null): string | null {
  if (!raw) return null;
  return raw.slice(0, 16) || null;
}
