export type Offer = {
  id: string;
  seller: string;
  sellerType: 'Official store' | 'Independent seller';
  country: string;
  price: number;
  shipping: number;
  taxes: string;
  eta: string;
  trust: number;
  returns: string;
  badge: string;
  urlLabel: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  confidence: number;
  description: string;
  highlights: string[];
  offers: Offer[];
};

export type OfferSort = 'Lowest total cost' | 'Highest trust' | 'Fastest delivery';
export type OfferFilter = 'All' | 'Official only' | 'Independent only' | 'Cross-border';

export type SearchFilters = {
  sortBy: OfferSort;
  filter: OfferFilter;
  country: string; // "All countries" | specific country
};

