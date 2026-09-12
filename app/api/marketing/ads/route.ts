import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
  const supabase = await createClient();

  const {
   data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
   return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
   );
}
    const {
      businessName,
      industry,
      targetAudience,
    } = await req.json();

    const prompt = `
You are Apex AI.

Create professional advertising copy for this business.

Business Name:
${businessName}

Industry:
${industry}

Target Audience:
${targetAudience}

Return ONLY valid JSON.

{
  "facebook": {
    "primaryText": "",
    "headline": "",
    "description": "",
    "cta": ""
  },
  "google": {
    "headlines": [
      "",
      "",
      "",
      "",
      ""
    ],
    "descriptions": [
      "",
      "",
      ""
    ],
    "keywords": [
      "",
      "",
      "",
      "",
      ""
    ],
    "cta": ""
  }
}
`;

    const response = await openai.responses.create({
  model: "gpt-5",
  input: prompt,
});

const text = response.output_text.trim();

const json = JSON.parse(text);

await supabase.from("ad_campaigns").insert({
  user_id: user.id,
  business_name: businessName,
  industry,
  target_audience: targetAudience,
  facebook: json.facebook,
  google: json.google,
});

return NextResponse.json(json);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate ads.",
      },
      {
        status: 500,
      }
    );
  }
}