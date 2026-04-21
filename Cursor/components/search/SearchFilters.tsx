'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { countryOptions } from '../../lib/constants';
import { withUpdatedParams } from '../../lib/searchParams';
import { Card, CardBody } from '../ui/Card';
import { FilterChip } from '../ui/FilterChip';

const storeFilters = ['All', 'Official only', 'Independent only', 'Cross-border'] as const;
const sortOptions = ['Lowest total cost', 'Highest trust', 'Fastest delivery'] as const;

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const state = useMemo(() => {
    const sortBy = params.get('sort') ?? 'Lowest total cost';
    const filter = params.get('filter') ?? 'All';
    const country = params.get('country') ?? 'All countries';
    return { sortBy, filter, country };
  }, [params]);

  const update = (patch: Record<string, string>) => {
    const next = withUpdatedParams(params, patch);
    router.replace(`/search?${next.toString()}`);
  };

  return (
    <Card className="h-fit">
      <CardBody className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <SlidersHorizontal className="h-5 w-5 text-slate-300" />
            AI filters
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <Filter className="inline h-3.5 w-3.5 -mt-0.5 mr-1" />
            Live
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm text-slate-300">Sort by</label>
          <select
            value={state.sortBy}
            onChange={(e) => update({ sort: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/30"
          >
            {sortOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm text-slate-300">Store filter</label>
          <div className="flex flex-wrap gap-2">
            {storeFilters.map((option) => (
              <FilterChip
                key={option}
                active={state.filter === option}
                onClick={() => update({ filter: option })}
                type="button"
              >
                {option}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm text-slate-300">Country</label>
          <select
            value={state.country}
            onChange={(e) => update({ country: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/30"
          >
            {countryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
          Filters update results instantly and are shareable via URL.
        </div>
      </CardBody>
    </Card>
  );
}

