'use client';

import type { Offer, Product } from '../../lib/types';
import { money } from '../../lib/format';
import { totalCost } from '../../lib/offers';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function MerchantRedirectModal({
  open,
  offer,
  product,
  onClose,
}: {
  open: boolean;
  offer: Offer | null;
  product: Product | null;
  onClose: () => void;
}) {
  if (!open || !offer || !product) return null;

  return (
    <Modal
      open={open}
      eyebrow="AI checkout handoff"
      title={`Ready to continue to ${offer.seller}?`}
      onClose={onClose}
      maxWidthClassName="max-w-xl"
      footer={
        <>
          <Button>Continue to merchant</Button>
          <Button variant="secondary" onClick={onClose}>
            Back to compare
          </Button>
        </>
      }
    >
      <p className="text-slate-300">
        In the live version, 2GoDeals AI routes the shopper to the merchant page with tracked attribution and pre-checked
        product details.
      </p>

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
    </Modal>
  );
}

export function MerchantDetailsModal({
  open,
  offer,
  product,
  onClose,
}: {
  open: boolean;
  offer: Offer | null;
  product: Product | null;
  onClose: () => void;
}) {
  if (!open || !offer || !product) return null;

  return (
    <Modal
      open={open}
      eyebrow="Store intelligence"
      title={offer.seller}
      onClose={onClose}
      footer={
        <>
          <Button>Proceed to store</Button>
          <Button variant="secondary" onClick={onClose}>
            Keep comparing
          </Button>
        </>
      }
    >
      <p className="text-slate-300">
        AI-normalized merchant details to help shoppers compare confidence, speed, and final cost.
      </p>
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
    </Modal>
  );
}

