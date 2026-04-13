import { FearGreedIndex, OneWayIndex } from '../types/news.types';
import { getFearGreedLabel } from '../collectors/fear-greed-collector';
import { getOneWayLabel } from '../analyzers/oneway-analyzer';
import { getLocale, getDirectionLabel, getRandomQuote } from '../i18n';

/**
 * Shared HTML escape utility — single source of truth for all email templates.
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Generates a Fear & Greed gauge card for HTML email templates.
 * Returns an empty string when data is unavailable.
 */
export function generateFearGreedHtmlCard(fearGreed: FearGreedIndex | null | undefined, lang?: string): string {
  if (!fearGreed) return '';

  const locale = getLocale(lang);
  const score = fearGreed.score;
  const label = getFearGreedLabel(score);
  const pct = score; // score is already 0-100

  // Color zones: red → orange → yellow → light green → green
  const zoneColor = (zone: number): string => {
    const active = pct >= zone * 20;
    const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
    return active ? colors[zone] : '#e5e7eb';
  };

  const segments = [0, 1, 2, 3, 4]
    .map(
      z =>
        `<td style="padding: 0; width: 20%;"><div style="height: 8px; background-color: ${zoneColor(z)}; border-radius: ${z === 0 ? '4px 0 0 4px' : z === 4 ? '0 4px 4px 0' : '0'};"></div></td>`
    )
    .join('');

  const scaleLabels = locale.fearGreedScaleLabels
    .map(
      lbl =>
        `<td style="padding: 0; width: 20%; text-align: center; font-size: 10px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${lbl}</td>`
    )
    .join('');

  return `
    <div style="margin-bottom: 32px; padding: 20px 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #1e293b; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;">
        <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${escapeHtml(locale.fearGreedTitle)}</span>
        <span style="font-size: 22px; font-weight: 700; color: #1e293b; font-family: Georgia, 'Times New Roman', serif;">${score} <span style="font-size: 13px; font-weight: 500; color: #475569;">&mdash; ${escapeHtml(label)}</span></span>
      </div>
      <table width="100%" cellpadding="0" cellspacing="2" style="border-collapse: separate; border-spacing: 2px; margin-bottom: 4px;">
        <tr>${segments}</tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>${scaleLabels}</tr>
      </table>
    </div>
  `.trim();
}

/**
 * Generates a One-Way Index gauge card for HTML email templates.
 * Returns an empty string when data is unavailable.
 */
export function generateOneWayHtmlCard(oneWay: OneWayIndex | null | undefined, lang?: string): string {
  if (!oneWay) return '';

  const locale = getLocale(lang);
  const score = oneWay.score;
  const label = getOneWayLabel(score);
  const dirArrow = oneWay.direction === 'bull' ? '&#x2191;' : oneWay.direction === 'bear' ? '&#x2193;' : '&#x2192;';
  const dirLabel = getDirectionLabel(oneWay.direction, lang);

  // 5-segment intensity gauge: gray → yellow → orange → red → deep red
  const zoneColor = (zone: number): string => {
    const threshold = zone * 20;
    const active = score >= threshold;
    const colors = ['#d1d5db', '#eab308', '#f97316', '#ef4444', '#7c2d12'];
    return active ? colors[zone] : '#e5e7eb';
  };

  const segments = [0, 1, 2, 3, 4]
    .map(
      z =>
        `<td style="padding: 0; width: 20%;"><div style="height: 8px; background-color: ${zoneColor(z)}; border-radius: ${z === 0 ? '4px 0 0 4px' : z === 4 ? '0 4px 4px 0' : '0'};"></div></td>`
    )
    .join('');

  const scaleLabels = locale.oneWayScaleLabels
    .map(
      lbl =>
        `<td style="padding: 0; width: 20%; text-align: center; font-size: 10px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${lbl}</td>`
    )
    .join('');

  const componentItems = [
    { name: 'ADX', value: oneWay.components.adx },
    { name: 'MA', value: oneWay.components.maAlignment },
    { name: 'RSI', value: oneWay.components.rsiTrend },
    { name: 'BB', value: oneWay.components.bbWidth },
    { name: 'VIX', value: oneWay.components.vix },
    { name: 'Vol', value: oneWay.components.volume },
  ];

  const componentHtml = componentItems
    .map(c => `<span style="font-size: 11px; color: #64748b;">${c.name}: ${c.value}</span>`)
    .join(' &nbsp;&middot;&nbsp; ');

  return `
    <div style="margin-bottom: 32px; padding: 20px 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #7c2d12; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;">
        <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${escapeHtml(locale.oneWayTitle)}</span>
        <span style="font-size: 22px; font-weight: 700; color: #1e293b; font-family: Georgia, 'Times New Roman', serif;">${dirArrow} ${score} <span style="font-size: 13px; font-weight: 500; color: #475569;">&mdash; ${escapeHtml(label)} (${dirLabel})</span></span>
      </div>
      <table width="100%" cellpadding="0" cellspacing="2" style="border-collapse: separate; border-spacing: 2px; margin-bottom: 4px;">
        <tr>${segments}</tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 10px;">
        <tr>${scaleLabels}</tr>
      </table>
      <div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
        ${componentHtml}
      </div>
    </div>
  `.trim();
}

export function getRandomInspirationalQuote(): string {
  return getRandomQuote('en');
}

export function getContextualAffiliateLinks(keywords: string[], lang?: string): { text: string; url: string }[] {
  const locale = getLocale(lang);
  const links: { text: string; url: string }[] = [];

  if (keywords.some(k => k.includes('금리') || k.includes('예금') || k.includes('rate') || k.includes('savings'))) {
    links.push({ text: locale.affiliateSavings, url: 'https://example.com/parking-account' });
  }
  if (keywords.some(k => k.includes('주식') || k.includes('투자') || k.includes('AI') || k.includes('stock') || k.includes('invest'))) {
    links.push({ text: locale.affiliateBooks, url: 'https://example.com/books' });
  }
  if (keywords.some(k => k.includes('부동산') || k.includes('real estate') || k.includes('property'))) {
    links.push({ text: locale.affiliateRealEstate, url: 'https://example.com/realestate' });
  }
  if (links.length === 0) {
    links.push({ text: locale.affiliateChecklist, url: 'https://example.com/checklist' });
  }

  return links;
}
