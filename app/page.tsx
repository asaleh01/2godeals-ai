'use client';

import { ArrowRight, Barcode, Camera, Globe2, Search, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';

const offers = [
  {
    seller: 'Official Brand Store',
    country: 'United States',
    price: '$118.00',
    shipping: '$0',
    eta: '2–4 days',
    trust: '98/100',
    tag: 'Official',
  },
  {
    seller: 'CityTech Direct',
    country: 'United Kingdom',
    price: '$111.00',
    shipping: '$9',
    eta: '4–7 days',
    trust: '94/100',
    tag: 'Best visible price',
  },
  {
    seller: 'Nova Imports',
    country: 'Germany',
    price: '$109.00',
    shipping: '$14',
    eta: '5–9 days',
    trust: '90/100',
    tag: 'Cross-border',
  },
];

const features = [
  {
    title: 'Search any way',
    text: 'Type a product name, scan a barcode, or upload an image to find the right product faster.',
    icon: Search,
  },
  {
    title: 'Compare real offers',
    text: 'See official stores and independent sellers in one ranked view with shipping, taxes, and delivery estimates.',
    icon: Globe2,
  },
  {
    title: 'Buy direct',
    text: 'Open the merchant product page directly when you are ready, with trust details shown before you click.',
    icon: ShoppingBag,
  },
];

const steps = [
  {
    title: 'Search by text, barcode, or image',
    text: 'Use natural language, a product photo, or a barcode to start.',
  },
  {
    title: 'AI matches the exact product',
    text: 'The engine identifies likely variants and normalizes merchant listings.',
  },
  {
    title: 'Offers rank by true visible cost',
    text: 'Price, shipping, and confidence signals help surface the best choice.',
  },
  {
    title: 'Go straight to the merchant',
    text: 'Shoppers complete checkout on the seller website when they are ready.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:px-10 lg:px-12 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              <Sparkles className="h-4 w-4" />
              2GoDeals AI • smart product search across stores
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
              Search smarter. Compare real prices. Buy from the best store.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300 md:text-xl">
              Search by text, image, or barcode. Compare official stores and independent sellers across countries, then go directly to the merchant when you are ready to buy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 shadow-lg shadow-white/10 transition hover:scale-[1.02]">
                Start searching
              </button>
              <button className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10">
                See how it works
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-400">
              <span>✔ Text, image, and barcode search</span>
              <span>✔ Cross-country offer comparison</span>
              <span>✔ Direct-to-merchant buying</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur">
              <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-xl bg-white px-3 py-2 text-sm text-slate-900">🔍 Sony WH-1000XM6</div>
                  <div className="rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-200 inline-flex items-center gap-2"><Camera className="h-4 w-4" /> Upload image</div>
                  <div className="rounded-xl bg-white/10 px-3 py-2 text-sm text-slate-200 inline-flex items-center gap-2"><Barcode className="h-4 w-4" /> Scan barcode</div>
                </div>

                <div className="mt-4 grid gap-3">
                  {offers.map((offer) => (
                    <div key={offer.seller} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{offer.seller}</h3>
                            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">
                              {offer.tag}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-400">
                            {offer.country} • ETA {offer.eta} • Trust {offer.trust}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{offer.price}</div>
                          <div className="text-sm text-slate-400">Shipping {offer.shipping}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <div className="inline-flex rounded-2xl bg-white/10 p-3"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-slate-300">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-sm text-fuchsia-200">
                Why shoppers use 2GoDeals AI
              </div>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">From product search to best-offer decision in seconds.</h2>
              <p className="mt-4 max-w-xl text-slate-300">
                2GoDeals AI uses smart matching to identify the right product, clean messy merchant data, and rank offers by real total cost instead of just sticker price.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white font-bold text-slate-950">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <div className="mt-1 text-sm text-slate-400">{step.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-emerald-400/10 p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Launch fast with a focused first category.</h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Start in one strong category like electronics, beauty, books, or home goods. Then expand once product matching, affiliate coverage, and merchant trust scoring are strong.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Built to compare official stores, private sellers, and cross-border offers.
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:scale-[1.02] inline-flex items-center justify-center gap-2">
                Get early access
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10">
                Join waitlist
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
