"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Camera, ScanLine, Search, ShieldCheck, Sparkles, Globe, Zap, Star, CheckCircle2, BarChart3, Bell, Store, Plane } from "lucide-react";

const pageTabs = ["Home", "Search", "Product", "Compare", "Waitlist"];
const countryOptions = ["All countries", "United States", "United Kingdom", "Germany", "Canada", "Australia", "France"];

const catalog = [
  {
    id: "sony-headphones",
    name: "Sony WH-1000XM6 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    model: "WH-1000XM6",
    category: "Electronics",
    confidence: 96,
    description:
      "AI matched the product from text, image, and barcode inputs, then normalized seller listings across countries.",
    highlights: ["AI exact-match detection", "Cross-country offer ranking", "Official vs independent store labels"],
    offers: [
      {
        id: "official-us",
        seller: "Official Brand Store",
        sellerType: "Official store",
        country: "United States",
        price: 118,
        shipping: 0,
        taxes: "Calculated at checkout",
        eta: "2–4 days",
        trust: 98,
        returns: "30-day returns",
        badge: "Official",
        urlLabel: "Buy from store",
      },
      {
        id: "citytech-uk",
        seller: "CityTech Direct",
        sellerType: "Independent seller",
        country: "United Kingdom",
        price: 111,
        shipping: 9,
        taxes: "VAT may apply",
        eta: "4–7 days",
        trust: 94,
        returns: "14-day returns",
        badge: "Best visible price",
        urlLabel: "Go to merchant",
      },
      {
        id: "nova-de",
        seller: "Nova Imports",
        sellerType: "Independent seller",
        country: "Germany",
        price: 109,
        shipping: 14,
        taxes: "Import fees may apply",
        eta: "5–9 days",
        trust: 90,
        returns: "Seller policy",
        badge: "Cross-border",
        urlLabel: "View merchant",
      },
    ],
  },
];

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function totalCost(offer) {
  return offer.price + offer.shipping;
}

function getSortedOffers(product, sortBy, filter, country) {
  let list = [...product.offers];
  if (filter === "Official only") list = list.filter((o) => o.sellerType === "Official store");
  if (filter === "Independent only") list = list.filter((o) => o.sellerType === "Independent seller");
  if (filter === "Cross-border") list = list.filter((o) => o.country !== "United States");
  if (country && country !== "All countries") list = list.filter((o) => o.country === country);
  if (sortBy === "Lowest total cost") list.sort((a, b) => totalCost(a) - totalCost(b));
  if (sortBy === "Highest trust") list.sort((a, b) => b.trust - a.trust);
  if (sortBy === "Fastest delivery") list.sort((a, b) => a.eta.localeCompare(b.eta));
  return list;
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
        <Sparkles className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">{text}</p>
    </div>
  );
}

function Header({ page, setPage }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
        <button onClick={() => setPage("Home")} className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg shadow-white/10">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">2GoDeals AI</div>
            <div className="text-xs text-slate-400">AI search for shopping</div>
          </div>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {pageTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setPage(tab)}
              className={`rounded-full px-4 py-2 text-sm transition ${page === tab ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setPage("Waitlist")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Join waitlist
        </button>
      </div>
    </header>
  );
}

function OfferCard({ offer, onOpenMerchant, onViewDetails }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{offer.seller}</h3>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">
              {offer.badge}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {offer.country} • {offer.sellerType} • Trust {offer.trust}/100
          </p>
          <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            <div>Shipping: {money(offer.shipping)}</div>
            <div>Delivery: {offer.eta}</div>
            <div>Returns: {offer.returns}</div>
            <div>Total visible cost: {money(totalCost(offer))}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tracking-tight">{money(offer.price)}</div>
          <div className="text-sm text-slate-400">Taxes: {offer.taxes}</div>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={onOpenMerchant} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:scale-[1.02]">
              {offer.urlLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onViewDetails} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white">
              View store details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MerchantRedirectModal({ open, offer, product, onClose }) {
  if (!open || !offer || !product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">AI checkout handoff</div>
            <h3 className="mt-4 text-2xl font-bold">Ready to continue to {offer.seller}?</h3>
            <p className="mt-3 text-slate-300">In the live version, 2GoDeals AI would route the shopper to the merchant page with tracked attribution and pre-checked product details.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">Close</button>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-slate-400">Offer summary</div>
          <div className="mt-2 font-semibold">{product.name}</div>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
            <div>Seller: {offer.seller}</div>
            <div>Country: {offer.country}</div>
            <div>Price: {money(offer.price)}</div>
            <div>Shipping: {money(offer.shipping)}</div>
            <div>Total visible cost: {money(totalCost(offer))}</div>
            <div>Delivery: {offer.eta}</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950">Continue to merchant</button>
          <button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white">Back to compare</button>
        </div>
      </div>
    </div>
  );
}

function MerchantDetailsModal({ open, offer, product, onClose }) {
  if (!open || !offer || !product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">Store intelligence</div>
            <h3 className="mt-4 text-2xl font-bold">{offer.seller}</h3>
            <p className="mt-2 text-slate-300">AI-normalized merchant details to help shoppers compare confidence, speed, and final cost.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">Close</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-slate-400">Offer summary</div>
            <div className="mt-3 space-y-2 text-sm text-slate-200">
              <div>Product: {product.name}</div>
              <div>Seller type: {offer.sellerType}</div>
              <div>Country: {offer.country}</div>
              <div>Trust score: {offer.trust}/100</div>
              <div>Delivery window: {offer.eta}</div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-slate-400">Cost breakdown</div>
            <div className="mt-3 space-y-2 text-sm text-slate-200">
              <div>Item price: {money(offer.price)}</div>
              <div>Shipping: {money(offer.shipping)}</div>
              <div>Total visible cost: {money(totalCost(offer))}</div>
              <div>Taxes: {offer.taxes}</div>
              <div>Returns: {offer.returns}</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950">Proceed to store</button>
          <button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white">Keep comparing</button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ onSearch, setPage, product }) {
  const bestOffer = [...product.offers].sort((a, b) => totalCost(a) - totalCost(b))[0];
  const featureCards = [
    {
      icon: Search,
      title: "AI shopping search",
      text: "Search by text, image, or barcode and let AI find the exact product and likely variant.",
    },
    {
      icon: Globe,
      title: "Global merchant coverage",
      text: "Compare official stores and independent sellers across countries in one clean results view.",
    },
    {
      icon: ShieldCheck,
      title: "Trust-aware ranking",
      text: "Rank offers by visible cost, trust score, shipping speed, and return confidence — not just sticker price.",
    },
  ];

  return (
    <div>
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
              2GoDeals AI turns product discovery into an intelligent shopping workflow — scan, search, compare, trust, and buy with confidence across global stores.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onSearch} className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:scale-[1.02]">Start AI search</button>
              <button onClick={() => setPage("Waitlist")} className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10">Join waitlist</button>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Text, image, and barcode search</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Cross-country offer comparison</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Direct-to-merchant buying</div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5">
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm text-slate-950"><Search className="h-4 w-4" /> Sony WH-1000XM6</div>
                  <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-200"><Camera className="h-4 w-4" /> Upload image</div>
                  <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-200"><ScanLine className="h-4 w-4" /> Scan barcode</div>
                </div>
                <div className="mt-5 space-y-3">
                  {product.offers.map((offer) => (
                    <div key={offer.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{offer.seller}</div>
                            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">{offer.badge}</span>
                          </div>
                          <div className="mt-1 text-sm text-slate-400">{offer.country} • ETA {offer.eta} • Trust {offer.trust}/100</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{money(offer.price)}</div>
                          <div className="text-sm text-slate-400">Shipping {money(offer.shipping)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                  AI pick: {bestOffer.seller} currently offers the best visible total at {money(totalCost(bestOffer))}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-slate-300">{card.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <SectionTitle
                eyebrow="Why AI search wins"
                title="Built for shoppers who want answers, not tabs."
                text="2GoDeals AI is designed to feel like a shopping search engine. The user gives intent. AI finds the match. The app compares stores, highlights the safest path, and makes the decision easier."
              />
            </div>
            <div className="grid gap-4">
              {[
                { icon: Zap, title: "AI match engine", text: "Recognizes product names, variants, and seller naming differences." },
                { icon: BarChart3, title: "Price intelligence", text: "Ranks by visible total, not just item price alone." },
                { icon: Store, title: "Merchant transparency", text: "Shows official stores, private sellers, returns, and trust." },
                { icon: Plane, title: "Cross-border ready", text: "Helps shoppers compare international offers faster." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950"><Icon className="h-5 w-5" /></div>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-300">{item.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ["96%", "AI match confidence"],
            ["3x", "faster decision flow"],
            ["20+", "merchant data points per offer"],
            ["1", "shopping search experience"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <div className="text-4xl font-bold tracking-tight">{value}</div>
              <div className="mt-2 text-slate-300">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SearchPage({ product, sortBy, setSortBy, filter, setFilter, country, setCountry, setPage, onOpenMerchant, onViewMerchant }) {
  const sortedOffers = useMemo(() => getSortedOffers(product, sortBy, filter, country), [product, sortBy, filter, country]);
  const best = sortedOffers[0];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <SectionTitle
        eyebrow="AI Search Results"
        title={product.name}
        text={`AI matched this product with ${product.confidence}% confidence and ranked offers by visible total cost, trust, delivery speed, and store type.`}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold">AI filters</div>
          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-300">Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none">
              <option>Lowest total cost</option>
              <option>Highest trust</option>
              <option>Fastest delivery</option>
            </select>
          </div>
          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-300">Store filter</label>
            <div className="flex flex-wrap gap-2">
              {["All", "Official only", "Independent only", "Cross-border"].map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-3 py-2 text-sm transition ${filter === option ? "bg-white text-slate-950" : "border border-white/10 bg-white/5 text-white"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-300">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-white outline-none">
              {countryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          {best && (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              AI best match right now: {best.seller} at {money(totalCost(best))} visible total cost.
            </div>
          )}
        </aside>

        <div>
          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Product</div>
              <div className="mt-2 font-semibold">{product.brand} {product.model}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Category</div>
              <div className="mt-2 font-semibold">{product.category}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Match confidence</div>
              <div className="mt-2 font-semibold">{product.confidence}%</div>
            </div>
          </div>

          <div className="space-y-4">
            {sortedOffers.length > 0 ? (
              sortedOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} onOpenMerchant={() => onOpenMerchant(offer)} onViewDetails={() => onViewMerchant(offer)} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-slate-300">No offers match the current filters. Try changing country or seller type.</div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setPage("Product")} className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950">View product details</button>
            <button onClick={() => setPage("Compare")} className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white">Compare stores side by side</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPage({ product, setPage }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <SectionTitle eyebrow="Product Intelligence" title={product.name} text={product.description} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-sm text-slate-400">Brand</div>
              <div className="mt-2 font-semibold">{product.brand}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-sm text-slate-400">Model</div>
              <div className="mt-2 font-semibold">{product.model}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-sm text-slate-400">Category</div>
              <div className="mt-2 font-semibold">{product.category}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="text-sm text-slate-400">AI confidence</div>
              <div className="mt-2 font-semibold">{product.confidence}%</div>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-slate-400">Why this product matched</div>
          <div className="mt-4 space-y-3">
            {product.highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <Star className="mt-0.5 h-4 w-4 text-amber-300" />
                <div className="text-slate-200">{item}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setPage("Compare")} className="mt-6 rounded-2xl bg-white px-5 py-3 font-medium text-slate-950">See comparison engine</button>
        </div>
      </div>
    </div>
  );
}

function ComparePage({ product, setPage }) {
  const offers = [...product.offers].sort((a, b) => totalCost(a) - totalCost(b));
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <SectionTitle eyebrow="Compare Stores" title="Side-by-side merchant comparison" text="This page makes it easier for shoppers to compare final cost, trust, delivery, and store type in one fast decision view." />
      <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
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
        <button onClick={() => setPage("Search")} className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950">Back to search</button>
        <button onClick={() => setPage("Waitlist")} className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white">Get early access</button>
      </div>
    </div>
  );
}

function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 lg:px-12">
        <SectionTitle eyebrow="Waitlist" title="You're on the list" text="This polished confirmation state helps the live site feel more launch-ready while you build the backend and lead capture integrations." />
        <div className="mt-8 rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-8 text-emerald-100">
          Thanks for joining 2GoDeals AI. Early users will get first access to AI search, price alerts, merchant comparison, and future product tracking.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 lg:px-12">
      <SectionTitle eyebrow="Waitlist" title="Join the early access list" text="Capture shoppers, partners, merchants, and investors while you validate demand and sharpen the AI search experience." />
      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full name</label>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" placeholder="Jane Smith" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email address</label>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">I am joining as</label>
            <select className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
              <option>Shopper</option>
              <option>Merchant</option>
              <option>Affiliate partner</option>
              <option>Investor</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">What would make this indispensable for you?</label>
            <textarea className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" placeholder="Price alerts, barcode search, better trust scores, cross-country comparisons..." />
          </div>
          <button onClick={() => setSubmitted(true)} className="rounded-2xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:scale-[1.01]">Request early access</button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
        <div>© 2026 2GoDeals AI. Built for modern product search.</div>
        <div className="flex flex-wrap gap-4">
          <span>AI shopping search</span>
          <span>Cross-border comparison</span>
          <span>Merchant trust intelligence</span>
        </div>
      </div>
    </footer>
  );
}

export default function TwoGoDealsMVP() {
  const [page, setPage] = useState("Home");
  const [query, setQuery] = useState("Sony WH-1000XM6");
  const [currentProduct] = useState(catalog[0]);
  const [sortBy, setSortBy] = useState("Lowest total cost");
  const [filter, setFilter] = useState("All");
  const [country, setCountry] = useState("All countries");
  const [merchantOffer, setMerchantOffer] = useState(null);
  const [merchantDetailsOffer, setMerchantDetailsOffer] = useState(null);

  const handleSearch = () => {
    if (query.trim()) {
      setFilter("All");
      setCountry("All countries");
      setPage("Search");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header page={page} setPage={setPage} />

      {page === "Home" && <HomePage onSearch={handleSearch} setPage={setPage} product={currentProduct} />}
      {page === "Search" && (
        <SearchPage
          product={currentProduct}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filter={filter}
          setFilter={setFilter}
          country={country}
          setCountry={setCountry}
          setPage={setPage}
          onOpenMerchant={setMerchantOffer}
          onViewMerchant={setMerchantDetailsOffer}
        />
      )}
      {page === "Product" && <ProductPage product={currentProduct} setPage={setPage} />}
      {page === "Compare" && <ComparePage product={currentProduct} setPage={setPage} />}
      {page === "Waitlist" && <WaitlistPage />}

      <Footer />

      <MerchantRedirectModal open={Boolean(merchantOffer)} offer={merchantOffer} product={currentProduct} onClose={() => setMerchantOffer(null)} />
      <MerchantDetailsModal open={Boolean(merchantDetailsOffer)} offer={merchantDetailsOffer} product={currentProduct} onClose={() => setMerchantDetailsOffer(null)} />
    </div>
  );
}
