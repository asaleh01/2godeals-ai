'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { apiGet, ApiError } from '../../lib/api';
import type { Product } from '../../lib/types';
import { SectionHeader } from '../ui/SectionHeader';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmptyNotice, ErrorNotice, LoadingNotice } from '../states/AsyncNotice';

type ProductApiResponse = Product | { product: Product } | { data: Product } | unknown;

function normalizeProduct(payload: ProductApiResponse): Product | null {
  if (!payload || typeof payload !== 'object') return null;
  const anyPayload = payload as any;
  if (typeof anyPayload.id === 'string') return anyPayload as Product;
  if (anyPayload.product && typeof anyPayload.product?.id === 'string') return anyPayload.product as Product;
  if (anyPayload.data && typeof anyPayload.data?.id === 'string') return anyPayload.data as Product;
  return null;
}

export function ProductDetailsClient({ productId }: { productId: string }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  const run = useMemo(
    () => async () => {
      const controller = new AbortController();
      setStatus('loading');
      setError(null);

      try {
        const payload = await apiGet<ProductApiResponse>(`/api/product/${encodeURIComponent(productId)}`, {
          signal: controller.signal,
        });
        const p = normalizeProduct(payload);
        setProduct(p);
        setStatus(p ? 'ready' : 'empty');
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return;
        const msg = e instanceof ApiError ? e.message : 'Failed to load product details.';
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

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
        <LoadingNotice title="Loading product…" subtitle="Fetching `/api/product/[id]`." />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
        <ErrorNotice subtitle={error ?? undefined} onRetry={() => run()} />
      </div>
    );
  }

  if (status === 'empty' || !product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
        <EmptyNotice title="Product not found" subtitle="This product ID returned no data from the API." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <SectionHeader eyebrow="Product Intelligence" title={product.name} text={product.description ?? ''} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardBody>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-sm text-slate-400">Brand</div>
                <div className="mt-2 font-semibold">{product.brand ?? '—'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-sm text-slate-400">Model</div>
                <div className="mt-2 font-semibold">{product.model ?? '—'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-sm text-slate-400">Category</div>
                <div className="mt-2 font-semibold">{product.category ?? '—'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-sm text-slate-400">AI confidence</div>
                <div className="mt-2 font-semibold">
                  {typeof product.confidence === 'number' ? `${product.confidence}%` : '—'}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-sm text-slate-400">Why this product matched</div>
            <div className="mt-4 space-y-3">
              {(product.highlights ?? []).length ? (
                product.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <Star className="mt-0.5 h-4 w-4 text-amber-300" />
                    <div className="text-slate-200">{item}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
                  No highlights available yet for this product.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/compare?productId=${encodeURIComponent(product.id)}`}>
                <Button>
                  Compare stores
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/search?q=${encodeURIComponent(product.brand ?? product.name)}`}>
                <Button variant="secondary">Back to search</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

