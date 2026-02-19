import { FearGreedIndex } from '../types/news.types';
import { getFearGreedLabel } from '../collectors/fear-greed-collector';

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
export function generateFearGreedHtmlCard(fearGreed: FearGreedIndex | null | undefined): string {
  if (!fearGreed) return '';

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

  const scaleLabels = ['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed']
    .map(
      lbl =>
        `<td style="padding: 0; width: 20%; text-align: center; font-size: 10px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${lbl}</td>`
    )
    .join('');

  return `
    <div style="margin-bottom: 32px; padding: 20px 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #1e293b; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;">
        <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">FEAR &amp; GREED INDEX</span>
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

const INSPIRATIONAL_QUOTES: string[] = [
  '"Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1." — Warren Buffett',
  '"The stock market is a device for transferring money from the impatient to the patient." — Warren Buffett',
  '"Invert, always invert: Turn a situation or problem upside down." — Charlie Munger',
  '"Know what you own, and know why you own it." — Peter Lynch',
  '"The individual investor should act consistently as an investor and not as a speculator." — Benjamin Graham',
  '"The four most dangerous words in investing are: \'This time it\'s different.\'" — John Templeton',
  '"The game of speculation is the most uniformly fascinating game in the world." — Jesse Livermore',
  '"It\'s not whether you\'re right or wrong, but how much money you make when you\'re right." — George Soros',
  '"He who lives by the crystal ball will eat shattered glass." — Ray Dalio',
  '"You can\'t predict. You can prepare." — Howard Marks',
  '"Wealth is what you don\'t see." — Morgan Housel',
  '"A goal is a dream with a deadline." — Napoleon Hill',
  '"Success is not final, failure is not fatal: it is the courage to continue that counts." — Winston Churchill',
  '"Compound interest is the eighth wonder of the world." — Albert Einstein',
  '"Our greatest glory is not in never falling, but in rising every time we fall." — Confucius',
  '"You have power over your mind – not outside events. Realize this, and you will find strength." — Marcus Aurelius',
  '"Luck is what happens when preparation meets opportunity." — Seneca',
  '"Buy value and wait." — Jim Rogers',
  '"The secret to being successful from a trading perspective is to have an indefatigable and an undying and unquenchable thirst for information and knowledge." — Paul Tudor Jones',
  '"In life and business, there are two cardinal sins. The first is to act precipitously without thought and the second is to not act at all." — Carl Icahn',
];

export function getRandomInspirationalQuote(): string {
  const index = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
  return INSPIRATIONAL_QUOTES[index];
}

export function getContextualAffiliateLinks(keywords: string[]): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];

  if (keywords.some(k => k.includes('금리') || k.includes('예금') || k.includes('rate') || k.includes('savings'))) {
    links.push({ text: 'Compare leading savings rates', url: 'https://example.com/parking-account' });
  }
  if (keywords.some(k => k.includes('주식') || k.includes('투자') || k.includes('AI') || k.includes('stock') || k.includes('invest'))) {
    links.push({ text: 'Recommended: The Psychology of Money', url: 'https://example.com/books' });
  }
  if (keywords.some(k => k.includes('부동산') || k.includes('real estate') || k.includes('property'))) {
    links.push({ text: 'Real estate investment guide', url: 'https://example.com/realestate' });
  }
  if (links.length === 0) {
    links.push({ text: 'Essential finance checklist', url: 'https://example.com/checklist' });
  }

  return links;
}
