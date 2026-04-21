'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, Clock, ScanLine, Search, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { withUpdatedParams } from '../../lib/searchParams';
import { useRecentSearches } from './useRecentSearches';

export function SearchBar({
  placeholder = 'Search products, models, SKUs…',
  defaultQuery,
  autoFocus,
  size = 'lg',
  instant = true,
  debounceMs = 350,
}: {
  placeholder?: string;
  defaultQuery?: string;
  autoFocus?: boolean;
  size?: 'lg' | 'md';
  instant?: boolean;
  debounceMs?: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = useMemo(() => defaultQuery ?? params.get('q') ?? '', [defaultQuery, params]);
  const [q, setQ] = useState(initial);
  const [focused, setFocused] = useState(false);
  const editingRef = useRef(false);
  const debounceRef = useRef<number | null>(null);
  const recent = useRecentSearches(8);

  useEffect(() => {
    const next = defaultQuery ?? params.get('q') ?? '';
    // Avoid clobbering the input while the user is actively typing.
    if (!editingRef.current && next !== q) setQ(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultQuery, params]);

  const inputClass =
    size === 'lg'
      ? 'w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none focus:ring-2 focus:ring-cyan-400/30'
      : 'w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/30';

  const submit = (nextQuery?: string, mode: 'push' | 'replace' = 'push') => {
    const trimmed = (nextQuery ?? q).trim();
    if (!trimmed) return;
    const next = withUpdatedParams(params, { q: trimmed });
    if (mode === 'replace') router.replace(`/search?${next.toString()}`);
    else router.push(`/search?${next.toString()}`);
    recent.add(trimmed);
  };

  const scheduleInstant = (nextValue: string) => {
    if (!instant) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const trimmed = nextValue.trim();
      const next = withUpdatedParams(params, { q: trimmed });
      router.replace(`/search?${next.toString()}`);
      if (trimmed) recent.add(trimmed);
    }, debounceMs);
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2">
          <Search className="h-5 w-5 text-slate-300" />
          <input
            autoFocus={autoFocus}
            value={q}
            onFocus={() => {
              setFocused(true);
              editingRef.current = true;
            }}
            onBlur={() => {
              setFocused(false);
              window.setTimeout(() => {
                editingRef.current = false;
              }, 150);
            }}
            onChange={(e) => {
              const next = e.target.value;
              setQ(next);
              scheduleInstant(next);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit(undefined, 'push');
            }}
            placeholder={placeholder}
            className={inputClass}
          />
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ('');
                const next = withUpdatedParams(params, { q: '' });
                router.replace(`/search?${next.toString()}`);
              }}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button onClick={() => submit(undefined, 'push')} disabled={!q.trim()}>
            Search
          </Button>
          <Button variant="secondary" type="button">
            <Camera className="h-4 w-4" />
            Image
          </Button>
          <Button variant="secondary" type="button">
            <ScanLine className="h-4 w-4" />
            Barcode
          </Button>
        </div>
      </div>

      {focused && !q.trim() && recent.items.length ? (
        <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-300">Recent</div>
            <button
              type="button"
              onClick={() => recent.clear()}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {recent.items.map((item) => (
              <button
                key={item}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => submit(item, 'push')}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
              >
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 text-xs text-slate-400">
          {instant ? `Instant AI search updates as you type (${debounceMs}ms).` : 'Tip: Use filters to refine results.'}
        </div>
      )}
    </div>
  );
}

