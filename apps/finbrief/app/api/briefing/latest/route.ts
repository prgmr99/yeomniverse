import { NextResponse } from 'next/server';
import { getLatestBriefing } from '@/lib/briefing';

/**
 * GET /api/briefing/latest
 *
 * Reads and returns the most recent JSON file by date from the finbrief/data/ directory.
 * File format: YYYY-MM-DD.json (e.g. 2026-01-29.json)
 */
export const revalidate = 3600;

export async function GET() {
  const data = getLatestBriefing();
  return NextResponse.json(data);
}
