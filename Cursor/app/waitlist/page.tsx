'use client';

import { useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 lg:px-12">
        <SectionHeader
          eyebrow="Waitlist"
          title="You're on the list"
          text="This polished confirmation state helps the live site feel more launch-ready while you build the backend and lead capture integrations."
        />
        <div className="mt-8 rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-8 text-emerald-100">
          Thanks for joining 2GoDeals AI. Early users will get first access to AI search, price alerts, merchant comparison,
          and future product tracking.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 lg:px-12">
      <SectionHeader
        eyebrow="Waitlist"
        title="Join the early access list"
        text="Capture shoppers, partners, merchants, and investors while you validate demand and sharpen the AI search experience."
      />
      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full name</label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email address</label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/30"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">I am joining as</label>
            <select className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/30">
              <option>Shopper</option>
              <option>Merchant</option>
              <option>Affiliate partner</option>
              <option>Investor</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">What would make this indispensable for you?</label>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400/30"
              placeholder="Price alerts, barcode search, better trust scores, cross-country comparisons..."
            />
          </div>
          <Button onClick={() => setSubmitted(true)}>Request early access</Button>
        </div>
      </div>
    </div>
  );
}

