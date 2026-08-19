import { describe, expect, it } from 'vitest';
import { getDaysUntilParentsDay, getParentsDayBadge } from './parentsDay';

// KST 기준 자정에 해당하는 UTC 시각
const kst = (iso: string) => new Date(`${iso}+09:00`);

describe('getDaysUntilParentsDay', () => {
  it('어버이날 당일에는 0을 반환한다', () => {
    expect(getDaysUntilParentsDay(kst('2026-05-08T00:00:00'))).toBe(0);
  });

  it('어버이날 이전에는 남은 일수를 반환한다', () => {
    expect(getDaysUntilParentsDay(kst('2026-05-01T00:00:00'))).toBe(7);
  });

  it('어버이날이 지나면 내년 어버이날까지로 넘어간다', () => {
    expect(getDaysUntilParentsDay(kst('2026-05-09T00:00:00'))).toBe(364);
    expect(getDaysUntilParentsDay(kst('2026-08-19T00:00:00'))).toBe(262);
  });

  it('KST 기준으로 날짜를 계산한다 (UTC 전날 밤 = KST 당일)', () => {
    // 2026-05-07T15:00Z == 2026-05-08T00:00 KST
    expect(getDaysUntilParentsDay(new Date('2026-05-07T15:00:00Z'))).toBe(0);
    expect(getDaysUntilParentsDay(new Date('2026-05-07T14:59:00Z'))).toBe(1);
  });
});

describe('getParentsDayBadge', () => {
  it('당일에는 어버이날 문구를 노출한다', () => {
    expect(getParentsDayBadge(kst('2026-05-08T00:00:00'))).toBe(
      '오늘은 어버이날',
    );
  });

  it('D-30 이내에는 카운트다운을 노출한다', () => {
    expect(getParentsDayBadge(kst('2026-04-08T00:00:00'))).toBe(
      '어버이날 D-30',
    );
    expect(getParentsDayBadge(kst('2026-05-07T00:00:00'))).toBe('어버이날 D-1');
  });

  it('시즌이 아니면 배지를 노출하지 않는다', () => {
    expect(getParentsDayBadge(kst('2026-04-07T00:00:00'))).toBeNull();
    expect(getParentsDayBadge(kst('2026-08-19T00:00:00'))).toBeNull();
    expect(getParentsDayBadge(kst('2026-05-09T00:00:00'))).toBeNull();
  });
});
