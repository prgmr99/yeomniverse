import { describe, expect, it } from 'vitest';
import { PARENT_RESULTS } from './parentResultData';
import { RESULTS } from './resultData';

// 1등급부터 유형 수만큼, 구멍도 중복도 없이. 유형이 늘어도 이 규칙은 같다.
const contiguousFrom1 = (count: number) =>
  Array.from({ length: count }, (_, i) => i + 1);

const sortedGrades = (results: Record<string, { grade: number }>) =>
  Object.values(results)
    .map((r) => r.grade)
    .sort((a, b) => a - b);

describe('등급 체계', () => {
  it('자식편 등급이 1등급부터 빠짐없이 이어진다', () => {
    const grades = sortedGrades(RESULTS);
    expect(grades).toEqual(contiguousFrom1(grades.length));
  });

  it('부모편 등급이 1등급부터 빠짐없이 이어진다', () => {
    const grades = sortedGrades(PARENT_RESULTS);
    expect(grades).toEqual(contiguousFrom1(grades.length));
  });

  it('양쪽 최상위는 유니콘, 최하위는 포기 엔딩이다', () => {
    expect(RESULTS.UNICORN.grade).toBe(1);
    expect(RESULTS.UNFILIAL.grade).toBe(9);
    expect(PARENT_RESULTS.UNICORN_PARENT.grade).toBe(1);
    expect(PARENT_RESULTS.GIVE_UP_PARENT.grade).toBe(9);
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
