'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '2godeals.recentSearches.v1';

function safeParse(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function useRecentSearches(limit = 8) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setItems(safeParse(window.localStorage.getItem(STORAGE_KEY)).slice(0, limit));
  }, [limit]);

  const persist = useCallback(
    (next: string[]) => {
      setItems(next.slice(0, limit));
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, limit)));
    },
    [limit]
  );

  const add = useCallback(
    (query: string) => {
      const q = query.trim();
      if (!q) return;
      const next = [q, ...items.filter((x) => x.toLowerCase() !== q.toLowerCase())];
      persist(next);
    },
    [items, persist]
  );

  const remove = useCallback(
    (query: string) => {
      persist(items.filter((x) => x !== query));
    },
    [items, persist]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  return useMemo(() => ({ items, add, remove, clear }), [items, add, remove, clear]);
}

