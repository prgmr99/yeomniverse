import type { Locale, SupportedLanguage } from './types';
import en from './en';
import ko from './ko';

export type { Locale, SupportedLanguage };

const locales: Record<SupportedLanguage, Locale> = { en, ko };

/**
 * Returns the locale object for the given language code.
 * Falls back to English if the language is not supported.
 */
export function getLocale(lang?: string): Locale {
  if (lang && lang in locales) {
    return locales[lang as SupportedLanguage];
  }
  return locales.en;
}

/**
 * Returns a random inspirational quote for the given language.
 */
export function getRandomQuote(lang?: string): string {
  const locale = getLocale(lang);
  const index = Math.floor(Math.random() * locale.inspirationalQuotes.length);
  return locale.inspirationalQuotes[index];
}

/**
 * Returns the sentiment tag string for the given language.
 */
export function getSentimentTag(sentiment: 'bull' | 'bear' | 'neutral', lang?: string): string {
  const locale = getLocale(lang);
  switch (sentiment) {
    case 'bull': return locale.sentimentTagBull;
    case 'bear': return locale.sentimentTagBear;
    case 'neutral': return locale.sentimentTagNeutral;
    default: return '';
  }
}

/**
 * Returns the sentiment label (no brackets) for the given language.
 */
export function getSentimentLabel(sentiment: 'bull' | 'bear' | 'neutral', lang?: string): string {
  const locale = getLocale(lang);
  switch (sentiment) {
    case 'bull': return locale.bullish;
    case 'bear': return locale.bearish;
    case 'neutral': return locale.neutral;
    default: return '';
  }
}

/**
 * Returns the direction label for the given language.
 */
export function getDirectionLabel(direction: 'bull' | 'bear' | 'neutral', lang?: string): string {
  const locale = getLocale(lang);
  switch (direction) {
    case 'bull': return locale.directionBull;
    case 'bear': return locale.directionBear;
    case 'neutral': return locale.directionNeutral;
    default: return '';
  }
}

/**
 * Formats a date string using the locale's date format.
 */
export function formatDate(date: Date, lang?: string, options?: Intl.DateTimeFormatOptions): string {
  const locale = getLocale(lang);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  return date.toLocaleDateString(locale.dateLocale, options || defaultOptions);
}

/**
 * Formats a short date (no year) for email subjects.
 */
export function formatDateShort(date: Date, lang?: string): string {
  const locale = getLocale(lang);
  return date.toLocaleDateString(locale.dateLocale, {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}
