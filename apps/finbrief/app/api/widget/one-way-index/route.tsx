import { getLatestBriefing } from '@/lib/briefing';

const DOMAIN =
  process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://finbrief.yeomniverse.com';

function getScoreColor(score: number): string {
  if (score < 20) return '#86868B';
  if (score < 40) return '#FFD60A';
  if (score < 60) return '#FF9500';
  if (score < 80) return '#FF3B30';
  return '#AF52DE';
}

function getScoreLabel(score: number): string {
  if (score < 20) return 'No Trend';
  if (score < 40) return 'Weak';
  if (score < 60) return 'Moderate';
  if (score < 80) return 'Strong';
  return 'Extreme';
}

export async function GET() {
  const briefing = getLatestBriefing();
  const oneWay = briefing.oneWay;

  const score = oneWay?.score ?? null;
  const direction = oneWay?.direction ?? 'neutral';
  const label = oneWay?.label ?? 'Unavailable';

  const color = score != null ? getScoreColor(score) : '#86868B';
  const intensityLabel = score != null ? getScoreLabel(score) : '—';
  const fillWidth = score != null ? Math.round((score / 100) * 260) : 0;

  const directionArrow =
    direction === 'bull' ? '▲' : direction === 'bear' ? '▼' : '→';
  const directionColor =
    direction === 'bull'
      ? '#34C759'
      : direction === 'bear'
        ? '#FF3B30'
        : '#86868B';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="160" viewBox="0 0 300 160">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#0f0f1a"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="300" height="160" rx="12" fill="url(#bg)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

  <!-- Header label -->
  <text x="16" y="28" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" fill="rgba(255,255,255,0.4)" letter-spacing="1" text-anchor="start">ONE-WAY MARKET INDEX</text>

  <!-- Score -->
  <text x="16" y="76" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="48" font-weight="700" fill="${color}">${score ?? '—'}</text>

  <!-- Direction arrow + label -->
  <text x="82" y="68" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" fill="${directionColor}">${directionArrow}</text>
  <text x="100" y="68" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600" fill="${directionColor}" text-anchor="start">${direction === 'bull' ? 'Bull' : direction === 'bear' ? 'Bear' : 'Neutral'}</text>

  <!-- Intensity badge -->
  <rect x="82" y="75" width="60" height="18" rx="9" fill="${color}22"/>
  <text x="112" y="88" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="600" fill="${color}" text-anchor="middle">${intensityLabel}</text>

  <!-- Label -->
  <text x="16" y="106" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" fill="rgba(255,255,255,0.4)">${label}</text>

  <!-- Progress bar track -->
  <rect x="16" y="118" width="268" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>

  <!-- Progress bar fill -->
  <rect x="16" y="118" width="${fillWidth}" height="6" rx="3" fill="${color}"/>

  <!-- Scale -->
  <text x="16" y="136" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" fill="rgba(255,255,255,0.25)">0</text>
  <text x="284" y="136" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" fill="rgba(255,255,255,0.25)" text-anchor="end">100</text>

  <!-- Powered by link area -->
  <text x="150" y="153" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" fill="rgba(255,255,255,0.25)" text-anchor="middle">Powered by FinBrief — ${DOMAIN}/one-way-index</text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
