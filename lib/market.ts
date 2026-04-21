export type Merchant = {
  id: string;
  name: string;
  countryCode: string;
  sellerType: string;
  trustScore: number;
  returnPolicy: string;
  websiteUrl: string;
};

export type Offer = {
  id: string;
  productId: string;
  merchantId: string;
  seller: string;
  sellerType: string;
  country: string;
  countryCode: string;
  price: number;
  shipping: number;
  currency: string;
  taxes: string;
  eta: string;
  trust: number;
  returns: string;
  badge: string;
  urlLabel: string;
  merchantUrl: string;
  rank: number;
  merchant: Merchant | null;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  confidence: number;
  highlights: string[];
  imageUrl: string;
};

export type SearchResult = Product & {
  bestOffer: Offer | null;
  matchScore: number;
  matchType: string;
  searchableText: string;
};

export type SearchOfferSummary = {
  id: string;
  seller: string;
  sellerType: string;
  country: string;
  countryCode: string;
  price: number;
  shipping: number;
  currency: string;
  totalVisibleCost: number;
  trust: number;
  eta: string;
  badge: string;
};

export type SearchApiResult = Product & {
  matchScore: number;
  matchType: string;
  searchableText: string;
  productSummary: {
    title: string;
    subtitle: string;
  };
  bestOffer: SearchOfferSummary | null;
};

export type SearchApiResponse = {
  query: string;
  normalizedQuery: string;
  resultCount: number;
  filters: {
    brands: string[];
    categories: string[];
  };
  results: SearchApiResult[];
};

type RawRecord = Record<string, any>;

const DEFAULT_HIGHLIGHTS = [
  "AI exact-match detection",
  "Cross-country offer ranking",
  "Official vs independent store labels",
];

type SearchRankingInput = {
  brand?: string;
  model?: string;
  name?: string;
  category?: string;
  keywords?: string[] | string;
  bestOffer?: Offer | null;
};

export function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function totalCost(offer: Pick<Offer, "price" | "shipping">) {
  return (offer.price || 0) + (offer.shipping || 0);
}

function pickFirst(raw: RawRecord | null | undefined, keys: string[], fallback: any = undefined) {
  if (!raw) return fallback;
  for (const key of keys) {
    const value = raw[key];
    if (value !== null && value !== undefined && value !== "") return value;
  }
  return fallback;
}

function toNumber(value: any, fallback = 0) {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toStringArray(value: any, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[|\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return fallback;
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeSellerType(value: any) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "Independent seller";
  if (raw.includes("official")) return "Official store";
  if (raw.includes("brand")) return "Official store";
  return "Independent seller";
}

function normalizeCountryCode(value: any) {
  const code = String(value || "").trim().toUpperCase();
  if (!code) return "US";
  return code;
}

function buildBadge(sellerType: string, countryCode: string, referenceCountryCode?: string) {
  if (sellerType === "Official store") return "Official";
  if (referenceCountryCode && countryCode && countryCode !== referenceCountryCode) return "Cross-border";
  return "Best visible price";
}

function etaToScore(eta: string) {
  const match = eta.match(/(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueWords(value: string) {
  return Array.from(new Set(normalizeText(value).split(" ").filter(Boolean)));
}

function includesLoose(haystack: string, needle: string) {
  if (!haystack || !needle) return false;
  return haystack.includes(needle);
}

function startsWithLoose(haystack: string, needle: string) {
  if (!haystack || !needle) return false;
  return haystack.startsWith(needle);
}

export function sortOffers(offers: Offer[], sortBy = "Lowest total cost") {
  const sorted = [...offers];

  if (sortBy === "Highest trust") {
    sorted.sort((a, b) => b.trust - a.trust || totalCost(a) - totalCost(b));
  } else if (sortBy === "Fastest delivery") {
    sorted.sort((a, b) => etaToScore(a.eta) - etaToScore(b.eta) || totalCost(a) - totalCost(b));
  } else {
    sorted.sort((a, b) => totalCost(a) - totalCost(b) || b.trust - a.trust);
  }

  return sorted.map((offer, index) => ({
    ...offer,
    rank: index + 1,
  }));
}

export function normalizeSearchQuery(query: string) {
  return normalizeText(query);
}

export function extractRpcResultsArray(payload: any): RawRecord[] {
  const firstRow = Array.isArray(payload) ? payload[0] : payload;
  const results = firstRow?.results;

  if (Array.isArray(results)) return results;
  if (typeof results === "string") {
    try {
      const parsed = JSON.parse(results);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function buildSearchableText(input: SearchRankingInput) {
  const keywordText = Array.isArray(input.keywords)
    ? input.keywords.join(" ")
    : String(input.keywords || "");

  return normalizeText(
    [input.brand, input.model, input.name, input.category, keywordText].filter(Boolean).join(" "),
  );
}

export function scoreSearchResult(
  query: string,
  input: SearchRankingInput,
) {
  const normalizedQuery = normalizeSearchQuery(query);
  const brand = normalizeText(String(input.brand || ""));
  const model = normalizeText(String(input.model || ""));
  const name = normalizeText(String(input.name || ""));
  const category = normalizeText(String(input.category || ""));
  const searchableText = buildSearchableText(input);
  const queryWords = uniqueWords(normalizedQuery);
  const joinedBrandModel = normalizeText([brand, model].filter(Boolean).join(" "));

  let score = 0;
  let matchType = "loose";

  if (!normalizedQuery) {
    return { score, matchType, searchableText };
  }

  if (normalizedQuery === joinedBrandModel && joinedBrandModel) {
    score += 1000;
    matchType = "exact_brand_model";
  } else if (normalizedQuery === model && model) {
    score += 940;
    matchType = "exact_model";
  } else if (normalizedQuery === name && name) {
    score += 900;
    matchType = "exact_name";
  } else if (startsWithLoose(joinedBrandModel, normalizedQuery) && joinedBrandModel) {
    score += 840;
    matchType = "prefix_brand_model";
  } else if (startsWithLoose(name, normalizedQuery) && name) {
    score += 800;
    matchType = "prefix_name";
  } else if (includesLoose(model, normalizedQuery) && model) {
    score += 760;
    matchType = "partial_model";
  } else if (includesLoose(name, normalizedQuery) && name) {
    score += 700;
    matchType = "partial_name";
  } else if (includesLoose(searchableText, normalizedQuery)) {
    score += 620;
    matchType = "keyword_phrase";
  }

  for (const word of queryWords) {
    if (word === brand && brand) score += 80;
    if (word === model && model) score += 90;
    if (includesLoose(name, word)) score += 45;
    if (includesLoose(category, word)) score += 25;
    if (includesLoose(searchableText, word)) score += 15;
  }

  const wordCoverage = queryWords.filter((word) => includesLoose(searchableText, word)).length;
  score += wordCoverage * 20;

  return { score, matchType, searchableText };
}

export function sortSearchResults(results: SearchResult[]) {
  return [...results].sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;

    const aTotal = a.bestOffer ? totalCost(a.bestOffer) : Number.MAX_SAFE_INTEGER;
    const bTotal = b.bestOffer ? totalCost(b.bestOffer) : Number.MAX_SAFE_INTEGER;
    if (aTotal !== bTotal) return aTotal - bTotal;

    const aTrust = a.bestOffer?.trust || 0;
    const bTrust = b.bestOffer?.trust || 0;
    if (bTrust !== aTrust) return bTrust - aTrust;

    const aEta = etaToScore(a.bestOffer?.eta || "");
    const bEta = etaToScore(b.bestOffer?.eta || "");
    return aEta - bEta;
  });
}

export function normalizeMerchant(raw: RawRecord | null | undefined): Merchant | null {
  if (!raw) return null;

  return {
    id: String(pickFirst(raw, ["id", "merchant_id"], "")),
    name: String(pickFirst(raw, ["name", "merchant_name", "seller"], "Merchant")),
    countryCode: normalizeCountryCode(pickFirst(raw, ["country_code", "country"], "US")),
    sellerType: normalizeSellerType(pickFirst(raw, ["seller_type", "type"], "independent")),
    trustScore: toNumber(pickFirst(raw, ["trust_score", "trust", "merchant_trust_score"], 0)),
    returnPolicy: String(pickFirst(raw, ["return_policy", "returns", "returns_policy"], "Seller policy")),
    websiteUrl: String(pickFirst(raw, ["website_url", "url", "merchant_url"], "")),
  };
}

export function normalizeOffer(raw: RawRecord | null | undefined, referenceCountryCode?: string): Offer | null {
  if (!raw) return null;

  const merchantSource = (raw.merchants || raw.merchant || raw.merchant_info || null) as RawRecord | null;
  const merchant = normalizeMerchant(merchantSource);
  const countryCode = normalizeCountryCode(
    pickFirst(raw, ["country_code", "offer_country_code", "country"], merchant?.countryCode || "US"),
  );
  const sellerType = normalizeSellerType(
    pickFirst(raw, ["seller_type", "offer_seller_type"], merchant?.sellerType || "independent"),
  );
  const trust = toNumber(
    pickFirst(raw, ["trust_score", "trust", "offer_trust_score"], merchant?.trustScore || 0),
  );

  return {
    id: String(pickFirst(raw, ["id", "offer_id"], "")),
    productId: String(pickFirst(raw, ["product_id", "id_product"], "")),
    merchantId: String(pickFirst(raw, ["merchant_id"], merchant?.id || "")),
    seller: String(pickFirst(raw, ["merchant_name", "seller", "seller_name"], merchant?.name || "Merchant")),
    sellerType,
    country: String(pickFirst(raw, ["country_name", "country"], countryCode)),
    countryCode,
    price: toNumber(pickFirst(raw, ["price", "offer_price", "amount"], 0)),
    shipping: toNumber(pickFirst(raw, ["shipping_cost", "shipping", "delivery_cost"], 0)),
    currency: String(pickFirst(raw, ["currency", "currency_code"], "USD")),
    taxes: String(pickFirst(raw, ["taxes", "tax_note", "taxes_note"], "Calculated at checkout")),
    eta: String(
      pickFirst(raw, ["delivery_estimate", "eta", "shipping_window", "estimated_delivery"], "Check merchant"),
    ),
    trust,
    returns: String(
      pickFirst(raw, ["return_policy", "returns", "returns_policy"], merchant?.returnPolicy || "Seller policy"),
    ),
    badge: buildBadge(sellerType, countryCode, referenceCountryCode),
    urlLabel: sellerType === "Official store" ? "Buy from store" : "View merchant",
    merchantUrl: String(pickFirst(raw, ["product_url", "merchant_url", "url"], merchant?.websiteUrl || "")),
    rank: toNumber(pickFirst(raw, ["rank"], 0)),
    merchant,
  };
}

export function normalizeProduct(raw: RawRecord | null | undefined): Product | null {
  if (!raw) return null;

  const brand = String(pickFirst(raw, ["brand", "product_brand"], ""));
  const model = String(pickFirst(raw, ["model", "product_model"], ""));
  const name =
    String(pickFirst(raw, ["name", "product_name", "title"], "")) ||
    [brand, model].filter(Boolean).join(" ") ||
    "Unknown product";

  return {
    id: String(pickFirst(raw, ["id", "product_id"], "")),
    name,
    brand,
    model,
    category: String(pickFirst(raw, ["category", "product_category"], "General")),
    description: String(
      pickFirst(
        raw,
        ["description", "product_description", "summary"],
        "AI matched the product and ranked merchant offers across countries.",
      ),
    ),
    confidence: toNumber(pickFirst(raw, ["confidence", "match_confidence", "score"], 92)),
    highlights: toStringArray(
      pickFirst(raw, ["highlights", "ai_highlights", "key_points"], DEFAULT_HIGHLIGHTS),
      DEFAULT_HIGHLIGHTS,
    ),
    imageUrl: String(pickFirst(raw, ["image_url", "thumbnail_url"], "")),
  };
}

export function normalizeSearchResult(raw: RawRecord | null | undefined, referenceCountryCode?: string): SearchResult | null {
  if (!raw) return null;
  const product = normalizeProduct(raw);
  if (!product) return null;
  const bestOffer = normalizeOffer(raw, referenceCountryCode);

  return {
    ...product,
    bestOffer,
    matchScore: 0,
    matchType: "unranked",
    searchableText: buildSearchableText({
      brand: product.brand,
      model: product.model,
      name: product.name,
      category: product.category,
      keywords: raw.keywords || raw.product_keywords || raw.tags || [],
      bestOffer,
    }),
  };
}

export function toSearchOfferSummary(offer: Offer | null): SearchOfferSummary | null {
  if (!offer) return null;

  return {
    id: offer.id,
    seller: offer.seller,
    sellerType: offer.sellerType,
    country: offer.country,
    countryCode: offer.countryCode,
    price: offer.price,
    shipping: offer.shipping,
    currency: offer.currency,
    totalVisibleCost: totalCost(offer),
    trust: offer.trust,
    eta: offer.eta,
    badge: offer.badge,
  };
}

export function toSearchApiResult(result: SearchResult): SearchApiResult {
  return {
    id: result.id,
    name: result.name,
    brand: result.brand,
    model: result.model,
    category: result.category,
    description: result.description,
    confidence: result.confidence,
    highlights: result.highlights,
    imageUrl: result.imageUrl,
    matchScore: result.matchScore,
    matchType: result.matchType,
    searchableText: result.searchableText,
    productSummary: {
      title: result.name,
      subtitle: [result.brand, result.model, result.category].filter(Boolean).join(" • "),
    },
    bestOffer: toSearchOfferSummary(result.bestOffer),
  };
}

export function sellerTypeToDbValue(filter: string) {
  if (filter === "Official only") return "official";
  if (filter === "Independent only") return "independent";
  return null;
}

export function countryCodeToLabel(code: string) {
  const normalized = normalizeCountryCode(code);
  const labels: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    DE: "Germany",
    CA: "Canada",
    AU: "Australia",
    FR: "France",
  };
  return labels[normalized] || titleCase(normalized);
}
