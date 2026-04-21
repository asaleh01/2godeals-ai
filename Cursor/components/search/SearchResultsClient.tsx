'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, GitCompare, Sparkles, TrendingDown } from 'lucide-react';
import { apiGet, ApiError } from '../../lib/api';
import type { Product } from '../../lib/types';
import { Card, CardBody } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { EmptyNotice, ErrorNotice, LoadingNotice } from '../states/AsyncNotice';
import { money } from '../../lib/format';
import { withUpdatedParams } from '../../lib/searchParams';

type SearchApiResponse =
  | { products: Product[] }
  | { results: Product[] }
  | Product[]
  | { data: Product[] }
  | unknown;

function normalizeProducts(payload: SearchApiResponse): Product[] {
  if (Array.isArray(payload)) return payload as Product[];
  if (payload && typeof payload === 'object') {
    const anyPayload = payload as any;
    if (Array.isArray(anyPayload.products)) return anyPayload.products as Product[];
    if (Array.isArray(anyPayload.results)) return anyPayload.results as Product[];
    if (Array.isArray(anyPayload.data)) return anyPayload.data as Product[];
  }
  return [];
}

function getBestVisibleTotal(product: any): number | null {
  const offers = Array.isArray(product?.offers) ? product.offers : [];
  if (!offers.length) return null;
  let best: number | null = null;
  for (const o of offers) {
    const price = typeof o?.price === 'number' ? o.price : null;
    const shipping = typeof o?.shipping === 'number' ? o.shipping : 0;
    if (price === null) continue;
    const total = price + shipping;
    best = best === null ? total : Math.min(best, total);
  }
  return best;
}

export function SearchResultsClient({
  query,
  sortBy,
  filter,
  country,
}: {
  query: string;
  sortBy?: string;
  filter?: string;
  country?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'empty' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [staleProducts, setStaleProducts] = useState<Product[]>([]);
  const selectedFromUrl = params.get('selected');
  const [selectedId, setSelectedId] = useState<string | null>(selectedFromUrl);

  const run = useMemo(
    () => async () => {
      const q = query.trim();
      if (!q) {
        setProducts([]);
        setStaleProducts([]);
        setStatus('idle');
        setError(null);
        return;
      }

      const controller = new AbortController();
      if (products.length) setStaleProducts(products);
      setStatus('loading');
      setError(null);

      try {
        // Debounce for better UX while typing / changing filters quickly.
        await new Promise((r) => setTimeout(r, 200));
        const payload = await apiGet<SearchApiResponse>('/api/search', {
          params: {
            q,
            sort: sortBy,
            filter,
            country,
          },
          signal: controller.signal,
        });

        const next = normalizeProducts(payload);
        setProducts(next);
        setStaleProducts(next);
        setStatus(next.length ? 'ready' : 'empty');
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return;
        const msg = e instanceof ApiError ? e.message : 'Failed to load search results.';
        setError(msg);
        setStatus('error');
      }

      return () => controller.abort();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, sortBy, filter, country]
  );

  useEffect(() => {
    setSelectedId(selectedFromUrl);
  }, [selectedFromUrl]);

  useEffect(() => {
    let cleanup: void | (() => void);
    run().then((fn) => {
      cleanup = fn;
    });
    return () => cleanup?.();
  }, [run]);

  const suggestions = [
    'iPhone 15 Pro',
    'Dyson Airwrap',
    'Sony WH-1000XM5',
    'Nintendo Switch OLED',
    'Stanley Quencher 40oz',
    'AirPods Pro 2',
  ];

  const select = (id: string) => {
    setSelectedId(id);
    router.prefetch(`/product/${encodeURIComponent(id)}`);
    router.prefetch(`/compare?productId=${encodeURIComponent(id)}`);
    const next = withUpdatedParams(params, { selected: id });
    router.replace(`/search?${next.toString()}`);
  };

  const ResultsSkeletonGrid = () => (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="h-5 w-3/4 rounded bg-white/10" />
          <div className="mt-3 h-4 w-2/3 rounded bg-white/10" />
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-24 rounded-full bg-white/10" />
            <div className="h-7 w-28 rounded-full bg-white/10" />
          </div>
          <div className="mt-6 h-9 w-40 rounded-2xl bg-white/10" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <SectionHeader
        eyebrow="AI Search Results"
        title={query ? `Results for “${query}”` : 'Search'}
        text="Powered by your live API. Open a product to see AI normalization + offer intelligence."
      />

      <div className="mt-8">
        {status === 'idle' ? (
          <EmptyNotice
            title="Search to see live results"
            subtitle="Enter a product name, model, or SKU to fetch matches from `/api/search`."
            action={
              <Link href="/">
                <Button variant="secondary" size="sm">
                  Back to homepage
                </Button>
              </Link>
            }
          />
        ) : null}

        {status === 'loading' ? (
          <>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              <Sparkles className="inline h-4 w-4 -mt-0.5 mr-2" />
              Thinking… matching products and normalizing offers.
            </div>
            <ResultsSkeletonGrid />
          </>
        ) : null}

        {status === 'error' ? <ErrorNotice subtitle={error ?? undefined} onRetry={() => run()} /> : null}

        {status === 'empty' ? (
          <EmptyNotice
            title="No matches found"
            subtitle="Try a different query. Here are a few good examples to kick-start discovery:"
            action={
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      const next = withUpdatedParams(params, { q: s });
                      router.replace(`/search?${next.toString()}`);
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            }
          />
        ) : null}

        {status === 'ready' || (status === 'loading' && staleProducts.length) ? (
          <>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Showing{' '}
              <span className="font-semibold text-white">{(status === 'ready' ? products : staleProducts).length}</span>{' '}
              results. Use filters to refine
              without leaving the page.
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(status === 'ready' ? products : staleProducts).map((p) => {
                const bestTotal = getBestVisibleTotal(p as any);
                const active = selectedId === p.id;
                return (
                  <Card
                    key={p.id}
                    className={`transition hover:-translate-y-0.5 hover:bg-white/10 ${
                      active ? 'ring-2 ring-cyan-400/30' : ''
                    }`}
                    onClick={() => select(p.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') select(p.id);
                    }}
                  >
                    <CardBody>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-lg font-semibold tracking-tight line-clamp-2">{p.name}</div>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                            {p.brand ? (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{p.brand}</span>
                            ) : null}
                            {p.model ? (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{p.model}</span>
                            ) : null}
                            {p.category ? (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{p.category}</span>
                            ) : null}
                            {typeof p.confidence === 'number' ? (
                              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-100">
                                AI match {p.confidence}%
                              </span>
                            ) : null}
                            {bestTotal !== null ? (
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-emerald-100">
                                <TrendingDown className="inline h-3.5 w-3.5 -mt-0.5 mr-1" />
                                Best visible total {money(bestTotal)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {p.description ? (
                        <div className="mt-4 text-sm text-slate-300 line-clamp-3">{p.description}</div>
                      ) : null}

                      <div className="mt-6 flex flex-wrap gap-2">
                        <Link href={`/product/${encodeURIComponent(p.id)}`}>
                          <Button size="sm">
                            View product
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/compare?productId=${encodeURIComponent(p.id)}`}>
                          <Button variant="secondary" size="sm">
                            <GitCompare className="h-4 w-4" />
                            Compare
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

