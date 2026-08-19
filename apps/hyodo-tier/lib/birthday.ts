const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * YYMMDD 6자리 생년월일이 실제로 존재하는 날짜인지 확인한다.
 * 연도 두 자리만으로는 세기를 알 수 없어 윤년은 따지지 않고 2월을 29일까지 허용한다.
 */
export function isValidYymmdd(value: string): boolean {
  if (!/^\d{6}$/.test(value)) return false;

  const month = Number(value.slice(2, 4));
  const day = Number(value.slice(4, 6));

  if (month < 1 || month > 12) return false;
  return day >= 1 && day <= DAYS_IN_MONTH[month - 1];
}

export function digitsOnly(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}
