import type { Offer, OfferFilter, OfferSort, Product } from './types';

export function totalCost(offer: Offer): number {
  return offer.price + offer.shipping;
}

export function getSortedOffers(args: {
  product: Product;
  sortBy: OfferSort;
  filter: OfferFilter;
  country: string;
}): Offer[] {
  const { product, sortBy, filter, country } = args;

  let list = [...product.offers];
  if (filter === 'Official only') list = list.filter((o) => o.sellerType === 'Official store');
  if (filter === 'Independent only') list = list.filter((o) => o.sellerType === 'Independent seller');
  if (filter === 'Cross-border') list = list.filter((o) => o.country !== 'United States');
  if (country && country !== 'All countries') list = list.filter((o) => o.country === country);

  if (sortBy === 'Lowest total cost') list.sort((a, b) => totalCost(a) - totalCost(b));
  if (sortBy === 'Highest trust') list.sort((a, b) => b.trust - a.trust);
  if (sortBy === 'Fastest delivery') list.sort((a, b) => a.eta.localeCompare(b.eta));

  return list;
}

