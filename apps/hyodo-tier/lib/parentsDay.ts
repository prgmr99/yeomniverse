const PARENTS_DAY_MONTH = 4; // 0-based (5월)
const PARENTS_DAY_DATE = 8;
const BADGE_WINDOW_DAYS = 30;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// 서버(UTC)와 국내 사용자의 '오늘'이 어긋나지 않도록 KST 기준 날짜로 환산한다.
function toKstYmd(now: Date) {
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  return {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth(),
    date: kst.getUTCDate(),
  };
}

export function getDaysUntilParentsDay(now: Date = new Date()): number {
  const { year, month, date } = toKstYmd(now);
  const today = Date.UTC(year, month, date);
  const thisYear = Date.UTC(year, PARENTS_DAY_MONTH, PARENTS_DAY_DATE);
  const target =
    thisYear >= today
      ? thisYear
      : Date.UTC(year + 1, PARENTS_DAY_MONTH, PARENTS_DAY_DATE);

  return Math.round((target - today) / DAY_MS);
}

export function getParentsDayBadge(now: Date = new Date()): string | null {
  const days = getDaysUntilParentsDay(now);

  if (days === 0) return '오늘은 어버이날';
  if (days <= BADGE_WINDOW_DAYS) return `어버이날 D-${days}`;
  return null;
}
