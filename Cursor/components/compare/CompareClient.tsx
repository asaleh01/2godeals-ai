'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { apiGet, ApiError } from '../../lib/api';
import type { Offer } from '../../lib/types';
import { money } from '../../lib/format';
import { totalCost } from '../../lib/offers';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { EmptyNotice, ErrorNotice, LoadingNotice } from '../states/AsyncNotice';

type OffersApiResponse = { offers: Offer[] } | { data: Offer[] } | Offer[] | unknown;

function normalizeOffers(payload: OffersApiResponse): Offer[] {
  if (Array.isArray(payload)) return payload as Offer[];
  if (payload && typeof payload === 'object') {
    const anyPayload = payload as any;
    if (Array.isArray(anyPayload.offers)) return anyPayload.offers as Offer[];
    if (Array.isArray(anyPayload.data)) return anyPayload.data as Offer[];
  }
  return [];
}

export function CompareClient({ productId }: { productId?: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);

  const run = useMemo(
    () => async () => {
      const controller = new AbortController();
      setStatus('loading');
      setError(null);

      try {
        const payload = await apiGet<OffersApiResponse>('/api/offers', {
          params: productId ? { productId } : undefined,
          signal: controller.signal,
        });
        const next = normalizeOffers(payload).sort((a, b) => totalCost(a) - totalCost(b));
        setOffers(next);
        setStatus(next.length ? 'ready' : 'empty');
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return;
        const msg = e instanceof ApiError ? e.message : 'Failed to load offers.';
        setError(msg);
        setStatus('error');
      }

      return () => controller.abort();
    },
    [productId]
  );

  useEffect(() => {
    let cleanup: void | (() => void);
    run().then((fn) => {
      cleanup = fn;
    });
    return () => cleanup?.();
  }, [run]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <SectionHeader
        eyebrow="Compare Stores"
        title="Side-by-side merchant comparison"
        text="Pulls live offer rows from `/api/offers` and ranks by visible total cost."
      />

      <div className="mt-8">
        {status === 'loading' ? <LoadingNotice title="Loading offers…" subtitle="Fetching live compare rows." /> : null}
        {status === 'error' ? <ErrorNotice subtitle={error ?? undefined} onRetry={() => run()} /> : null}
        {status === 'empty' ? (
          <EmptyNotice
            title="No offers to compare"
            subtitle="This product may not have offers yet, or your query returned no rows."
            action={
              <Link href="/search">
                <Button variant="secondary" size="sm">
                  Back to search
                </Button>
              </Link>
            }
          />
        ) : null}

        {status === 'ready' ? (
          <>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
              <div className="grid grid-cols-5 border-b border-white/10 bg-slate-900/70 px-6 py-4 text-sm font-medium text-slate-300">
                <div>Seller</div>
                <div>Country</div>
                <div>Total visible cost</div>
                <div>Delivery</div>
                <div>Trust</div>
              </div>
              {offers.map((offer) => (
                <div key={offer.id} className="grid grid-cols-5 px-6 py-4 text-sm text-slate-200 even:bg-white/5">
                  <div>{offer.seller}</div>
                  <div>{offer.country}</div>
                  <div>{money(totalCost(offer))}</div>
                  <div>{offer.eta}</div>
                  <div>{offer.trust}/100</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search">
                <Button>Back to search</Button>
              </Link>
              {productId ? (
                <Link href={`/product/${encodeURIComponent(productId)}`}>
                  <Button variant="secondary">View product</Button>
                </Link>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

