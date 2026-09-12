import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const { data: performance, error } = await supabase
      .from("campaign_performance")
      .select(`
        impressions,
        clicks,
        leads,
        conversions,
        spend,
        recorded_at
      `)
      .eq("user_id", user.id)
      .order("recorded_at", {
        ascending: true,
      });

    if (error) {
      console.error("Performance query error:", error);

      return NextResponse.json(
        {
          error: "Failed to load performance data.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    const rows = performance ?? [];

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        analysis: {
          summary:
            "Apex needs campaign performance data before it can provide an AI analysis.",
          strengths: [],
          weaknesses: [],
          recommendations: [
            "Start tracking campaign performance.",
          ],
        },
      });
    }

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

    const clickThroughRate =
      totals.impressions > 0
        ? (totals.clicks / totals.impressions) * 100
        : 0;

    const conversionRate =
      totals.clicks > 0
        ? (totals.conversions / totals.clicks) * 100
        : 0;

    const costPerLead =
      totals.leads > 0
        ? totals.spend / totals.leads
        : 0;

    const prompt = `
You are Apex, an AI Chief Marketing Officer.

Analyze this business campaign performance data.

Metrics:
- Impressions: ${totals.impressions}
- Clicks: ${totals.clicks}
- Leads: ${totals.leads}
- Conversions: ${totals.conversions}
- Ad Spend: $${totals.spend.toFixed(2)}
- Click-through rate: ${clickThroughRate.toFixed(2)}%
- Conversion rate: ${conversionRate.toFixed(2)}%
- Cost per lead: $${costPerLead.toFixed(2)}

Return practical marketing advice.

Return ONLY valid JSON in this exact structure:

{
  "summary": "short overall assessment",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2"
  ],
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ]
}

Keep the advice specific to the numbers.
Do not invent metrics that were not provided.
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

    const output = response.output_text;

    let analysis;

    try {
      analysis = JSON.parse(output);
    } catch {
      console.error("AI returned invalid JSON:", output);

      return NextResponse.json(
        {
          error: "Apex received an invalid AI response.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      metrics: {
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

      analysis,
    });
  } catch (error) {
    console.error("Apex AI error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Apex AI analysis failed.",
      },
      { status: 500 }
    );
  }
}