import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "lib/supabase/server";

function isDuplicateError(error: any) {
  return error?.code === "23505" || String(error?.message || "").toLowerCase().includes("duplicate");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const fullName = String(body?.fullName || "").trim();
    const role = String(body?.role || "").trim();
    const message = String(body?.message || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    const { error } = await supabase.from("waitlist").insert({
      full_name: fullName,
      email,
      join_as: role,
      requested_features: message,
    });

    if (!error) {
      return NextResponse.json({ ok: true, status: "joined", message: "You're on the list." });
    }

    if (isDuplicateError(error)) {
      return NextResponse.json({
        ok: true,
        status: "already_joined",
        message: "You're already on the list.",
      });
    }

    return NextResponse.json(
      {
        error: "Failed to submit waitlist form.",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to submit waitlist form.",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
