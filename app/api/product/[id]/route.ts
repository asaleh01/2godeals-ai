import { NextRequest, NextResponse } from "next/server";
import { normalizeOffer, normalizeProduct, sortOffers } from "lib/market";
import { createSupabaseServerClient } from "lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const country = request.nextUrl.searchParams.get("country")?.trim().toUpperCase() || "US";
  const sellerType = request.nextUrl.searchParams.get("sellerType")?.trim() || null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.rpc("product_detail_with_offers", {
      p_product_id: params.id,
      p_country_code: country,
      p_seller_type: sellerType,
    });

    if (error) throw error;

    const payload = Array.isArray(data) ? data[0] : data;
    const product = normalizeProduct(payload?.product || null);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const offers = sortOffers(
      (Array.isArray(payload?.offers) ? payload.offers : [])
        .map((row: Record<string, any>) => normalizeOffer(row, country))
        .filter(Boolean),
    );
    const bestOffer = normalizeOffer(payload?.best_offer || null, country);

    return NextResponse.json({ product, bestOffer, offers });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch product details.",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
