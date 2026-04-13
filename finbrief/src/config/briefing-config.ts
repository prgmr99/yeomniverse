import type { SupportedLanguage } from '../i18n/types';

export const BRIEFING_LANGUAGE: SupportedLanguage = (process.env.BRIEFING_LANGUAGE as SupportedLanguage) || 'en';

/** Tier-based article count defaults */
export const TIER_ARTICLE_COUNT = {
  free: 3,
  basic: 5,
  pro: 10,
} as const;

/** Default article count for non-tier contexts (Telegram, legacy email) */
export const DEFAULT_ARTICLE_COUNT = 3;

/**
 * Maximum article count requested from Gemini.
 * The pipeline runs once with this count, then slices for lower tiers.
 */
export const MAX_ARTICLE_COUNT = TIER_ARTICLE_COUNT.pro;

export type PlanTier = keyof typeof TIER_ARTICLE_COUNT;
