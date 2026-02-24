'use client';
import { useEffect, useState } from 'react';
import type { BriefingData } from '@/lib/briefing';

export function useBriefingData() {
  const [data, setData] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/briefing/latest')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, error };
}
