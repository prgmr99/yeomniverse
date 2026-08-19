import { describe, expect, it } from 'vitest';
import { PARENT_RESULTS } from './parentResultData';
import { RESULTS } from './resultData';

describe('등급 체계', () => {
  it('자식편 9유형이 1~9등급을 빠짐없이 채운다', () => {
    const grades = Object.values(RESULTS)
      .map((r) => r.grade)
      .sort((a, b) => a - b);
    expect(grades).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('부모편 8유형이 1~8등급을 빠짐없이 채운다', () => {
    const grades = Object.values(PARENT_RESULTS)
      .map((r) => r.grade)
      .sort((a, b) => a - b);
    expect(grades).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('최상위는 유니콘, 최하위는 불효자다', () => {
    expect(RESULTS.UNICORN.grade).toBe(1);
    expect(RESULTS.UNFILIAL.grade).toBe(9);
    expect(PARENT_RESULTS.UNICORN_PARENT.grade).toBe(1);
  });

  it('id를 키로 쓰는 Record와 각 항목의 id가 일치한다', () => {
    for (const [key, result] of Object.entries(RESULTS)) {
      expect(result.id).toBe(key);
    }
    for (const [key, result] of Object.entries(PARENT_RESULTS)) {
      expect(result.id).toBe(key);
    }
  });
});
