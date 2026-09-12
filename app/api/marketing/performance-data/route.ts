import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("AUTH ERROR:", authError);

      return NextResponse.json(
        {
          success: false,
          error: "Authentication failed.",
          details: authError.message,
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    console.log("Loading performance for user:", user.id);

    // Load campaign performance
    const {
      data: performance,
      error: performanceError,
    } = await supabase
      .from("campaign_performance")
      .select(`
        id,
        campaign_id,
        recorded_at,
        impressions,
        clicks,
        leads,
        conversions,
        spend
      `)
      .eq("user_id", user.id)
      .order("recorded_at", {
        ascending: true,
      });

    // IMPORTANT:
    // Return the actual Supabase error so we can see
    // exactly what needs fixing.
    if (performanceError) {
      console.error(
        "CAMPAIGN PERFORMANCE ERROR:",
        performanceError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Failed to load campaign performance.",
          details: performanceError.message,
          code: performanceError.code,
          hint: performanceError.hint,
        },
        { status: 500 }
      );
    }

    const rows = performance ?? [];

    // Calculate totals
    const totals = rows.reduce(
      (acc, item) => {
        acc.impressions += Number(item.impressions ?? 0);
        acc.clicks += Number(item.clicks ?? 0);
        acc.leads += Number(item.leads ?? 0);
        acc.conversions += Number(item.conversions ?? 0);
        acc.spend += Number(item.spend ?? 0);

        return acc;
      },
      {
        impressions: 0,
        clicks: 0,
        leads: 0,
        conversions: 0,
        spend: 0,
      }
    );

    // Calculate CTR
    const clickThroughRate =
      totals.impressions > 0
        ? (totals.clicks / totals.impressions) * 100
        : 0;

    // Calculate conversion rate
    const conversionRate =
      totals.clicks > 0
        ? (totals.conversions / totals.clicks) * 100
        : 0;

    // Calculate CPL
    const costPerLead =
      totals.leads > 0
        ? totals.spend / totals.leads
        : 0;

    console.log("Performance totals:", totals);

    return NextResponse.json({
      success: true,

      totals: {
        impressions: totals.impressions,
        clicks: totals.clicks,
        leads: totals.leads,
        conversions: totals.conversions,
        spend: Number(totals.spend.toFixed(2)),
        clickThroughRate: Number(
          clickThroughRate.toFixed(2)
        ),
        conversionRate: Number(
          conversionRate.toFixed(2)
        ),
        costPerLead: Number(
          costPerLead.toFixed(2)
        ),
      },

      performance: rows,
    });
  } catch (error) {
    console.error("PERFORMANCE API CRASH:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Apex could not load performance data.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}