import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
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

    const { data: campaign, error } = await supabase
      .from("ad_campaigns")
      .select(
        "business_name, industry, target_audience, monthly_budget, strategy, facebook, google"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Health query error:", error);

      return NextResponse.json(
        { error: "Failed to analyze marketing health." },
        { status: 500 }
      );
    }

    if (!campaign) {
      return NextResponse.json({
        analyzed: false,
        score: null,
        businessName: null,
        areas: [],
        priority: "Generate your first strategy to begin.",
        priorityDescription:
          "Create your first strategy so Apex can analyze your business.",
      });
    }

    let score = 0;

    const areas = [];

    // TARGET AUDIENCE
    if (
      campaign.target_audience &&
      campaign.target_audience.trim().length >= 10
    ) {
      score += 20;

      areas.push({
        name: "Target Audience",
        score: 20,
        max: 20,
        status: "Strong",
        color: "green",
        description:
          "Your target audience is clearly defined.",
      });
    } else {
      score += 8;

      areas.push({
        name: "Target Audience",
        score: 8,
        max: 20,
        status: "Needs Attention",
        color: "red",
        description:
          "Your audience needs to be more specific.",
      });
    }

    // BUDGET
    const budget = Number(campaign.monthly_budget || 0);

    if (budget >= 1000) {
      score += 20;

      areas.push({
        name: "Marketing Budget",
        score: 20,
        max: 20,
        status: "Strong",
        color: "green",
        description:
          "Your monthly budget gives Apex room to build multiple growth channels.",
      });
    } else if (budget > 0) {
      score += 12;

      areas.push({
        name: "Marketing Budget",
        score: 12,
        max: 20,
        status: "Average",
        color: "yellow",
        description:
          "Your budget can work, but channel selection will need to be focused.",
      });
    } else {
      score += 5;

      areas.push({
        name: "Marketing Budget",
        score: 5,
        max: 20,
        status: "Needs Attention",
        color: "red",
        description:
          "Add a monthly marketing budget so Apex can build a realistic plan.",
      });
    }

    // STRATEGY
    if (
      campaign.strategy &&
      campaign.strategy.trim().length >= 100
    ) {
      score += 25;

      areas.push({
        name: "Marketing Strategy",
        score: 25,
        max: 25,
        status: "Strong",
        color: "green",
        description:
          "Apex has generated a complete marketing strategy for your business.",
      });
    } else {
      score += 5;

      areas.push({
        name: "Marketing Strategy",
        score: 5,
        max: 25,
        status: "Needs Attention",
        color: "red",
        description:
          "Generate a strategy to give your marketing a clear direction.",
      });
    }

    // GOOGLE
    if (campaign.google) {
      score += 15;

      areas.push({
        name: "Google Presence",
        score: 15,
        max: 15,
        status: "Strong",
        color: "green",
        description:
          "Google is included as a growth channel.",
      });
    } else {
      score += 5;

      areas.push({
        name: "Google Presence",
        score: 5,
        max: 15,
        status: "Needs Attention",
        color: "red",
        description:
          "Google Search and Google Maps can help capture high-intent customers.",
      });
    }

    // FACEBOOK
    if (campaign.facebook) {
      score += 20;

      areas.push({
        name: "Social Advertising",
        score: 20,
        max: 20,
        status: "Strong",
        color: "green",
        description:
          "Facebook is included as a marketing channel.",
      });
    } else {
      score += 5;

      areas.push({
        name: "Social Advertising",
        score: 5,
        max: 20,
        status: "Opportunity",
        color: "yellow",
        description:
          "Social advertising could give your business another way to reach potential customers.",
      });
    }

    score = Math.min(score, 100);

    let status = "Needs Attention";

    if (score >= 85) {
      status = "Excellent";
    } else if (score >= 70) {
      status = "Good";
    } else if (score >= 50) {
      status = "Fair";
    }

    // Find weakest area
    const weakest = [...areas].sort(
      (a, b) =>
        a.score / a.max - b.score / b.max
    )[0];

    // --------------------------------------------------
    // AI DIAGNOSIS
    // --------------------------------------------------

    let diagnosis = {
      title: weakest.name,
      description: weakest.description,
      action: `Improve your ${weakest.name.toLowerCase()} to strengthen your marketing foundation.`,
      priority: weakest.status === "Needs Attention"
        ? "High"
        : "Medium",
      impact: "High",
    };

    try {
      const aiResponse = await openai.responses.create({
        model: "gpt-5.2",

        instructions: `
You are Apex AI, an expert AI Chief Marketing Officer.

Analyze the business information and marketing health data provided.

Your job is NOT to recalculate the health score.

Instead, diagnose the single most important marketing opportunity
for this specific business.

Be practical, specific, and realistic.

Do not use emojis.

Return ONLY valid JSON with exactly these fields:

{
  "title": "short diagnosis title",
  "description": "2-4 sentence explanation of why this matters for this specific business",
  "action": "specific action the business should take next",
  "priority": "High or Medium or Low",
  "impact": "High or Medium or Low"
}
        `,

        input: `
BUSINESS

Business Name:
${campaign.business_name}

Industry:
${campaign.industry}

Target Audience:
${campaign.target_audience || "Not provided"}

Monthly Marketing Budget:
$${budget}

CURRENT MARKETING HEALTH:
${score}/100

HEALTH STATUS:
${status}

WEAKEST AREA:
${weakest.name}

WEAKEST AREA STATUS:
${weakest.status}

WEAKEST AREA DESCRIPTION:
${weakest.description}

CURRENT STRATEGY:
${campaign.strategy || "No strategy available"}

GOOGLE:
${campaign.google ? "Present" : "Not currently configured"}

FACEBOOK:
${campaign.facebook ? "Present" : "Not currently configured"}

Based on all of this information, identify the single highest-impact
marketing opportunity for this business and explain exactly what
they should do next.
        `,
      });

      const raw = aiResponse.output_text.trim();

      const cleaned = raw
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      diagnosis = {
        title:
          typeof parsed.title === "string"
            ? parsed.title
            : diagnosis.title,

        description:
          typeof parsed.description === "string"
            ? parsed.description
            : diagnosis.description,

        action:
          typeof parsed.action === "string"
            ? parsed.action
            : diagnosis.action,

        priority:
          parsed.priority === "High" ||
          parsed.priority === "Medium" ||
          parsed.priority === "Low"
            ? parsed.priority
            : diagnosis.priority,

        impact:
          parsed.impact === "High" ||
          parsed.impact === "Medium" ||
          parsed.impact === "Low"
            ? parsed.impact
            : diagnosis.impact,
      };
    } catch (aiError) {
      console.error(
        "Apex AI diagnosis failed:",
        aiError
      );

      // Keep the health page working even if AI diagnosis fails.
    }

    return NextResponse.json({
      analyzed: true,

      score,

      status,

      businessName: campaign.business_name,

      industry: campaign.industry,

      priority: weakest.name,

      priorityDescription: weakest.description,

      areas,

      diagnosis,
    });
  } catch (error) {
    console.error(
      "Marketing health error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Apex could not calculate marketing health.",
      },
      { status: 500 }
    );
  }
}