import { describe, expect, it } from 'vitest';
import {
  CHILD_SHARE_COPY,
  PARENT_SHARE_COPY,
  pickShareCopy,
  type ShareCopyVariant,
} from './shareCopy';
import { createShareId } from './shareRef';

const ALL: [string, ShareCopyVariant[]][] = [
  ['자식편', CHILD_SHARE_COPY],
  ['부모편', PARENT_SHARE_COPY],
];

describe.each(ALL)('%s 공유 문구', (_label, variants) => {
  it('변형 id가 서로 겹치지 않는다 — 겹치면 GA에서 구분이 안 된다', () => {
    const ids = variants.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('모든 변형이 문구와 버튼 문구를 만든다', () => {
    for (const v of variants) {
      const text = v.text({ grade: 3, title: '방구석 츤데레' });
      expect(text.trim().length).toBeGreaterThan(0);
      expect(v.buttonTitle.trim().length).toBeGreaterThan(0);
    }
  });

  // 카카오 피드 설명은 길면 잘린다
  it('문구가 카카오 설명 길이를 넘지 않는다', () => {
    for (const v of variants) {
      const text = v.text({
        grade: 9,
        title: '호적에서 파일 뻔한 불효자',
      });
      expect(text.length).toBeLessThanOrEqual(80);
    }
  });

  it('#효도티어 해시태그가 빠지지 않는다', () => {
    for (const v of variants) {
      expect(v.text({ grade: 1, title: '전설의 유니콘 효자' })).toContain(
        '#효도티어',
      );
    }
  });
});

describe('pickShareCopy', () => {
  it('같은 shareId는 항상 같은 변형을 준다', () => {
    for (const id of ['a1b2c3d4', 'ffffffff', '00000000']) {
      const first = pickShareCopy(CHILD_SHARE_COPY, id);
      for (let i = 0; i < 20; i++) {
        expect(pickShareCopy(CHILD_SHARE_COPY, id).id).toBe(first.id);
      }
    }
  });

  it('실제 shareId 분포에서 모든 변형이 고르게 나온다', () => {
    const counts = new Map<string, number>();
    const N = 3000;

    for (let i = 0; i < N; i++) {
      const v = pickShareCopy(CHILD_SHARE_COPY, createShareId());
      counts.set(v.id, (counts.get(v.id) ?? 0) + 1);
    }

    expect(counts.size).toBe(CHILD_SHARE_COPY.length);

    // 균등 배정이 깨지면 variant 간 비교가 무의미해진다. ±30% 안이면 충분하다.
    const expected = N / CHILD_SHARE_COPY.length;
    for (const count of counts.values()) {
      expect(count).toBeGreaterThan(expected * 0.7);
      expect(count).toBeLessThan(expected * 1.3);
    }
  });

  it('변형이 하나뿐이어도 동작한다', () => {
    const only = [CHILD_SHARE_COPY[0]];
    expect(pickShareCopy(only, createShareId()).id).toBe(only[0].id);
  });
});
