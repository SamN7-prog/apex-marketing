import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Supabase auth error:", userError);

      return NextResponse.json(
        { error: "Authentication failed." },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("ad_campaigns")
      .select(
        "id, business_name, industry, target_audience, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase history error:", error);

      return NextResponse.json(
        { error: "Failed to load campaign history." },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("History API error:", error);

    return NextResponse.json(
      { error: "Failed to load history." },
      { status: 500 }
    );
  }
}