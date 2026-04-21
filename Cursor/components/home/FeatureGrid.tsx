import { Globe, Search, ShieldCheck } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';

const featureCards = [
  {
    icon: Search,
    title: 'AI shopping search',
    text: 'Search by text, image, or barcode and let AI find the exact product and likely variant.',
  },
  {
    icon: Globe,
    title: 'Global merchant coverage',
    text: 'Compare official stores and independent sellers across countries in one clean results view.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust-aware ranking',
    text: 'Rank offers by visible cost, trust score, shipping speed, and return confidence — not just sticker price.',
  },
] as const;

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
      <div className="grid gap-6 md:grid-cols-3">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardBody>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-slate-300">{card.text}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

