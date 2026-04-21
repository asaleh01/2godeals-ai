import Link from 'next/link';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0),rgba(15,23,42,1))]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Built for AI search in commerce
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
            Search smarter. Compare real prices. Buy from the best store.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            2GoDeals AI turns product discovery into an intelligent shopping workflow — scan, search, compare, trust, and
            buy with confidence across global stores.
          </p>
          <div className="mt-8">
            <SearchBar autoFocus />
          </div>
          <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Text, image, and barcode search
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Cross-country offer comparison
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Direct-to-merchant buying
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5">
              <div className="text-sm text-slate-300">
                Live search results and product intelligence render below in the Search experience.
              </div>
              <div className="mt-5 grid gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-full">
                        <div className="h-4 w-40 rounded bg-white/10" />
                        <div className="mt-3 h-3 w-72 rounded bg-white/10" />
                      </div>
                      <div className="h-10 w-20 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                AI picks and offer comparisons are calculated from your live Supabase data.
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <Link href="/search" className="underline underline-offset-4 hover:text-slate-300">
              Or explore search results
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

