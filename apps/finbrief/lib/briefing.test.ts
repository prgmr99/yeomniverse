import { describe, expect, it } from 'vitest';
import {
  getAvailableBriefingDates,
  getBriefingByDate,
  getIndexableBriefingDates,
  isBriefingIndexable,
} from './briefing';

/**
 * 분석이 실패한 날을 걸러내는 센티넬은 별도 저장소(finbrief/src/analyzers)의
 * 폴백 문자열에 의존한다. 그쪽이 문구를 바꾸면 여기서 먼저 깨져야 한다.
 */
const KNOWN_ERROR_DATES = [
  '2026-03-03',
  '2026-03-05',
  '2026-03-11',
  '2026-06-14',
  '2026-07-07',
  '2026-07-29',
  '2026-09-07',
  '2026-09-21',
  '2026-10-14',
];

describe('isBriefingIndexable', () => {
  it('rejects every known failed-analysis day', () => {
    for (const date of KNOWN_ERROR_DATES) {
      const briefing = getBriefingByDate(date);
      expect(briefing, `${date} 데이터가 없다`).not.toBeNull();
      expect(
        briefing && isBriefingIndexable(briefing),
        `${date}는 색인 대상이 아니어야 한다`,
      ).toBe(false);
    }
  });

  it('accepts a day with real analysis', () => {
    const briefing = getBriefingByDate('2026-11-09');
    expect(briefing).not.toBeNull();
    expect(briefing && isBriefingIndexable(briefing)).toBe(true);
  });
});

describe('getIndexableBriefingDates', () => {
  it('excludes the known failed-analysis days', () => {
    const indexable = getIndexableBriefingDates();
    for (const date of KNOWN_ERROR_DATES) {
      expect(indexable, `${date}가 사이트맵에 남아 있다`).not.toContain(date);
    }
  });

  it('agrees with isBriefingIndexable on every available date', () => {
    const indexable = new Set(getIndexableBriefingDates());
    for (const date of getAvailableBriefingDates()) {
      const briefing = getBriefingByDate(date);
      const expected = briefing !== null && isBriefingIndexable(briefing);
      expect(indexable.has(date), `${date} 판정이 어긋난다`).toBe(expected);
    }
  });
});
