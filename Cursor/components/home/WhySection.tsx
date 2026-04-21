import { BarChart3, Plane, Store, Zap } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

const items = [
  { icon: Zap, title: 'AI match engine', text: 'Recognizes product names, variants, and seller naming differences.' },
  { icon: BarChart3, title: 'Price intelligence', text: 'Ranks by visible total, not just item price alone.' },
  { icon: Store, title: 'Merchant transparency', text: 'Shows official stores, private sellers, returns, and trust.' },
  { icon: Plane, title: 'Cross-border ready', text: 'Helps shoppers compare international offers faster.' },
] as const;

export function WhySection() {
  return (
    <section className="border-y border-white/10 bg-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeader
              eyebrow="Why AI search wins"
              title="Built for shoppers who want answers, not tabs."
              text="2GoDeals AI is designed to feel like a shopping search engine. The user gives intent. AI finds the match. The app compares stores, highlights the safest path, and makes the decision easier."
            />
          </div>
          <div className="grid gap-4">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>
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
  );
}

