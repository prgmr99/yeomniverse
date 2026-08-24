import { describe, expect, it } from 'vitest';
import { createShareId, readShareRef } from './shareRef';

describe('createShareId', () => {
  it('8자리 식별자를 만든다', () => {
    expect(createShareId()).toHaveLength(8);
  });

  it('호출할 때마다 다른 값을 준다', () => {
    const ids = new Set(Array.from({ length: 50 }, () => createShareId()));
    expect(ids.size).toBe(50);
  });
});

describe('readShareRef', () => {
  it('값이 없으면 null', () => {
    expect(readShareRef(null)).toBeNull();
    expect(readShareRef('')).toBeNull();
  });

  it('정상 값은 그대로 돌려준다', () => {
    expect(readShareRef('a1b2c3d4')).toBe('a1b2c3d4');
  });

  // 공유 URL은 사용자가 임의로 편집할 수 있어서, 긴 값이 그대로 GA로 새지 않게 자른다
  it('16자를 넘으면 잘라낸다', () => {
    expect(readShareRef('x'.repeat(100))).toHaveLength(16);
  });
});
