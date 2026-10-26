// 루트 도메인. Vercel 환경변수가 비거나 잘못 설정되어도 canonical이
// 엉뚱한 호스트를 가리키지 않도록 기본값을 박아둔다.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://yeomniverse.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Yeomniverse';

export const CONTACT_EMAIL = 'johnyeom24@naver.com';

export const GITHUB_URL = 'https://github.com/prgmr99';

/** 운영 주체 표기 — 개인정보처리방침·이용약관에서 공통으로 쓴다. */
export const OPERATOR = {
  name: 'Yeomniverse',
  email: CONTACT_EMAIL,
} as const;

/** 정책 문서 기준일. 내용을 고치면 함께 올린다. */
export const POLICY_EFFECTIVE_DATE = '2026-10-26';
