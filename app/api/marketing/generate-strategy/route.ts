import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      businessName,
      industry,
      targetAudience,
      monthlyBudget,
    } = body;

    if (
      !businessName ||
      !industry ||
      !targetAudience ||
      !monthlyBudget
    ) {
      return NextResponse.json(
        { error: "Please provide all business information." },
        { status: 400 }
      );
    }

    // Get logged-in user
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

    // Generate strategy with Apex AI
    const response = await openai.responses.create({
      model: "gpt-5.2",

      instructions: `
You are Apex AI, an expert AI Chief Marketing Officer.

Your job is to create practical, specific, high-quality marketing
strategies for businesses.

Avoid vague marketing advice.

Create recommendations that are realistic for the business's
industry, target audience, and monthly marketing budget.

Focus on strategies that can generate measurable business growth.
      `,

      input: `
Create a complete marketing strategy for this business.

Business Name: ${businessName}
Industry: ${industry}
Target Audience: ${targetAudience}
Monthly Marketing Budget: $${monthlyBudget}

Include:

1. Executive Summary
2. Target Customer Strategy
3. Brand Positioning
4. Social Media Strategy
5. Content Strategy
6. Paid Advertising Strategy
7. Local/SEO Strategy
8. Email Marketing Strategy
9. Monthly Budget Allocation
10. 30-Day Action Plan
11. Key Metrics to Track
12. Three Immediate Growth Opportunities

Make the strategy detailed but easy for a business owner to understand.
      `,
    });

    const strategy = response.output_text;

    // Save campaign to Supabase
const { data: campaign, error: saveError } = await supabase
  .from("ad_campaigns")
  .insert({
    user_id: user.id,
    business_name: businessName,
    industry,
    target_audience: targetAudience,
    monthly_budget: Number(monthlyBudget),
    strategy: strategy,
  })
  .select()
  .single();

    if (saveError) {
      console.error("Failed to save campaign:", saveError);

      return NextResponse.json(
        {
          error: "Strategy generated, but Apex could not save it.",
          details: saveError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
      businessName,
      strategy,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Apex strategy generation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Apex AI failed to generate the strategy.",
      },
      { status: 500 }
    );
  }
}