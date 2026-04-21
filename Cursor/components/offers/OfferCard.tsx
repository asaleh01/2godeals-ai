import { ArrowRight } from 'lucide-react';
import type { Offer } from '../../lib/types';
import { money } from '../../lib/format';
import { totalCost } from '../../lib/offers';
import { Button } from '../ui/Button';

export function OfferCard({
  offer,
  onOpenMerchant,
  onViewDetails,
}: {
  offer: Offer;
  onOpenMerchant: () => void;
  onViewDetails: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{offer.seller}</h3>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">{offer.badge}</span>
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
            <Button onClick={onOpenMerchant} size="sm" className="rounded-2xl">
              {offer.urlLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button onClick={onViewDetails} variant="secondary" size="sm" className="rounded-2xl">
              View store details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

