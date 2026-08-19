import { describe, expect, it } from 'vitest';
import { digitsOnly, isValidYymmdd } from './birthday';

describe('isValidYymmdd', () => {
  it('실제로 존재하는 날짜를 통과시킨다', () => {
    expect(isValidYymmdd('580315')).toBe(true);
    expect(isValidYymmdd('991231')).toBe(true);
    expect(isValidYymmdd('000229')).toBe(true);
  });

  it('6자리 숫자가 아니면 거부한다', () => {
    expect(isValidYymmdd('58031')).toBe(false);
    expect(isValidYymmdd('5803155')).toBe(false);
    expect(isValidYymmdd('58031a')).toBe(false);
    expect(isValidYymmdd('')).toBe(false);
  });

  // 기존에는 자릿수만 검사해서 999999 같은 값이 그대로 통과했다
  it('존재하지 않는 월/일을 거부한다', () => {
    expect(isValidYymmdd('999999')).toBe(false);
    expect(isValidYymmdd('581315')).toBe(false);
    expect(isValidYymmdd('580015')).toBe(false);
    expect(isValidYymmdd('580300')).toBe(false);
    expect(isValidYymmdd('580332')).toBe(false);
    expect(isValidYymmdd('580230')).toBe(false);
    expect(isValidYymmdd('580431')).toBe(false);
  });
});

describe('digitsOnly', () => {
  it('숫자만 남기고 길이를 자른다', () => {
    expect(digitsOnly('58-03-15', 6)).toBe('580315');
    expect(digitsOnly('5803155555', 6)).toBe('580315');
    expect(digitsOnly('abc', 6)).toBe('');
  });
});
