import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      businessName,
      industry,
      targetAudience,
    } = await req.json();

    const prompt = `
You are Apex AI, an expert marketing strategist.

Create a complete 4-week marketing content calendar for this business.

Business Name:
${businessName}

Industry:
${industry}

Target Audience:
${targetAudience}

Requirements:

- Create 4 weeks.
- Each week should contain 7 days.
- Each day should include:
  - day
  - platform
  - content
- Vary the platforms (Facebook, Instagram, Google Business Profile, LinkedIn, TikTok, Email, Blog).
- Make every content idea unique and actionable.

Return ONLY valid JSON.

{
  "weeks": [
    {
      "week": "Week 1",
      "days": [
        {
          "day": "Monday",
          "platform": "Instagram",
          "content": "..."
        }
      ]
    }
  ]
}
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    const output = response.output_text.trim();

    const calendar = JSON.parse(output);

    return NextResponse.json(calendar);
  } catch (error) {
    console.error("Calendar generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate content calendar.",
      },
      {
        status: 500,
      }
    );
  }
}