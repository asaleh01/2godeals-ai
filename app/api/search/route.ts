import { NextRequest, NextResponse } from "next/server";
import {
  extractRpcResultsArray,
  normalizeSearchQuery,
  normalizeSearchResult,
  scoreSearchResult,
  sortSearchResults,
  toSearchApiResult,
} from "lib/market";
import { createSupabaseServerClient } from "lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim();
  const country = (searchParams.get("country") || "US").trim().toUpperCase();
  const sellerType = searchParams.get("sellerType")?.trim() || null;
  const mode = searchParams.get("mode") === "autocomplete" ? "autocomplete" : "search";
  const limitParam = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0
    ? Math.min(limitParam, mode === "autocomplete" ? 12 : 48)
    : mode === "autocomplete"
      ? 8
      : 20;

  if (!q) {
    return NextResponse.json({ error: "Missing q query parameter." }, { status: 400 });
  }

  try {
    const normalizedQuery = normalizeSearchQuery(q);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.rpc(mode === "autocomplete" ? "autocomplete_products" : "search_products", {
      p_q: normalizedQuery || q,
      p_country_code: country,
      p_seller_type: sellerType,
      p_limit: limit,
    });

    if (error) {
      throw error;
    }

    const rankedResults = sortSearchResults(
      extractRpcResultsArray(data)
        .map((row: Record<string, any>) => {
          const normalized = normalizeSearchResult(row, country);
          if (!normalized) return null;

          const ranking = scoreSearchResult(normalizedQuery, {
            brand: normalized.brand,
            model: normalized.model,
            name: normalized.name,
            category: normalized.category,
            keywords: row.keywords || row.product_keywords || row.tags || [],
            bestOffer: normalized.bestOffer,
          });

          return {
            ...normalized,
            matchScore: ranking.score,
            matchType: ranking.matchType,
            searchableText: ranking.searchableText,
          };
        })
        .filter(Boolean),
    );

    const brands = Array.from(new Set(rankedResults.map((result) => result.brand).filter(Boolean))).sort();
    const categories = Array.from(new Set(rankedResults.map((result) => result.category).filter(Boolean))).sort();

    return NextResponse.json({
      mode,
      query: q,
      normalizedQuery,
      resultCount: rankedResults.length,
      filters: {
        brands,
        categories,
      },
      results: rankedResults.map(toSearchApiResult),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to search products.",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
