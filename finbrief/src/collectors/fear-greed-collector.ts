import axios from 'axios';
import { FearGreedIndex } from '../types/news.types';

const CNN_ENDPOINT = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata';

/**
 * Fetches the CNN Fear & Greed Index.
 * CNN blocks requests without a browser User-Agent (returns HTTP 418).
 * Returns null gracefully on any failure so the pipeline continues.
 */
export async function fetchFearGreedIndex(): Promise<FearGreedIndex | null> {
  try {
    const response = await axios.get(CNN_ENDPOINT, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
        Referer: 'https://money.cnn.com/data/fear-and-greed/',
      },
    });

    const fg = response.data?.fear_and_greed;
    if (!fg || typeof fg.score !== 'number') {
      console.warn('[Fear & Greed] Unexpected response structure from CNN.');
      return null;
    }

    return {
      score: Math.round(fg.score),
      rating: fg.rating as string,
      timestamp: fg.timestamp as string,
    };
  } catch (err) {
    console.warn('[Fear & Greed] Failed to fetch CNN index:', (err as Error).message);
    return null;
  }
}

/**
 * Returns the label for a given score.
 * 0-24: Extreme Fear | 25-44: Fear | 45-55: Neutral | 56-74: Greed | 75-100: Extreme Greed
 */
export function getFearGreedLabel(score: number): string {
  if (score <= 24) return 'Extreme Fear';
  if (score <= 44) return 'Fear';
  if (score <= 55) return 'Neutral';
  if (score <= 74) return 'Greed';
  return 'Extreme Greed';
}

/**
 * Returns the zone emoji for a given score.
 */
export function getFearGreedZoneEmoji(score: number): string {
  if (score <= 24) return '🔴';
  if (score <= 44) return '🟠';
  if (score <= 55) return '🟡';
  if (score <= 74) return '🟢';
  return '🔵';
}

/**
 * Returns an emoji-based progress bar for Telegram.
 * Example: 🟢🟢🟢🟢🟢🟢🟢🟢⬜⬜
 */
export function getFearGreedBar(score: number): string {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  const emoji = getFearGreedZoneEmoji(score);
  return `${emoji.repeat(filled)}${'⬜'.repeat(empty)}`;
}

// Standalone test
if (require.main === module) {
  fetchFearGreedIndex().then(data => {
    if (data) {
      console.log(`[Fear & Greed Index]`);
      console.log(`  Score : ${data.score}`);
      console.log(`  Rating: ${data.rating}`);
      console.log(`  Bar   : ${getFearGreedBar(data.score)}`);
    } else {
      console.log('[Fear & Greed Index] Unavailable');
    }
  });
}
