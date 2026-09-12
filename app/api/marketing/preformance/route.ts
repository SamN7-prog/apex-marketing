import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required." },
        { status: 400 }
      );
    }

    const { data: campaign, error } = await supabase
      .from("ad_campaigns")
      .select(
        "id, business_name, industry, target_audience, monthly_budget, strategy, facebook, google"
      )
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (error || !campaign) {
      console.error("Campaign lookup error:", error);

      return NextResponse.json(
        { error: "Campaign not found." },
        { status: 404 }
      );
    }

    const prompt = `
You are Apex AI, an expert marketing optimization engine.

Analyze this advertising campaign.

IMPORTANT:
There is currently NO real advertising-platform performance data.
Do NOT invent impressions, clicks, leads, conversions, revenue,
ROAS, CTR, CPC, or other performance numbers.

Instead, analyze the campaign's current setup and identify:
1. Campaign strengths
2. Campaign weaknesses
3. Biggest growth opportunity
4. Three recommended actions
5. Creative recommendation
6. Audience recommendation
7. What Apex should monitor once real platform data is connected

Business:
${campaign.business_name}

Industry:
${campaign.industry}

Target Audience:
${campaign.target_audience}

Monthly Budget:
$${campaign.monthly_budget || 0}

Marketing Strategy:
${campaign.strategy || "No strategy provided."}

Facebook Ad:
${JSON.stringify(campaign.facebook || null)}

Google Ad:
${JSON.stringify(campaign.google || null)}

Return ONLY valid JSON using exactly this structure:

{
  "status": "Ready for Optimization",
  "summary": "short summary",
  "biggestOpportunity": "biggest opportunity",
  "strengths": [
    "strength",
    "strength",
    "strength"
  ],
  "weaknesses": [
    "weakness",
    "weakness",
    "weakness"
  ],
  "recommendations": [
    "recommendation",
    "recommendation",
    "recommendation"
  ],
  "creativeRecommendation": "creative recommendation",
  "audienceRecommendation": "audience recommendation",
  "monitoringPlan": [
    "metric or signal to monitor",
    "metric or signal to monitor",
    "metric or signal to monitor"
  ]
}
`;

    const response = await openai.responses.create({
      model: "gpt-5.2",
      instructions:
        "You are Apex AI. Give practical, specific marketing recommendations. Never invent performance data.",
      input: prompt,
    });

    const text = response.output_text?.trim();

    if (!text) {
      throw new Error("Apex returned an empty analysis.");
    }

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch {
      console.error("Apex returned invalid JSON:", text);

      return NextResponse.json(
        {
          error: "Apex generated an invalid analysis response.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      businessName: campaign.business_name,
      analysis,
      hasRealPerformanceData: false,
    });
  } catch (error) {
    console.error("Apex performance engine error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Apex Performance Engine failed.",
      },
      { status: 500 }
    );
  }
}