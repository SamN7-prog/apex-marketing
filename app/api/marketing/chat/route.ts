import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "A message is required.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
You are Apex Copilot, an expert AI Chief Marketing Officer.

Help the user make better marketing decisions and grow their business.

Focus on:
- Marketing strategy
- SEO
- Google Ads
- Meta Ads
- Social media
- Lead generation
- Local marketing
- Branding
- Website optimization
- Customer acquisition
- Business growth

Rules:
- Give specific, practical advice.
- Prioritize the highest-impact actions.
- Avoid unnecessary explanations.
- Use simple language.
- Do not use emojis.
- Do not repeat the user's question.
- Do not add unnecessary introductions.
- Make the answer easy for a business owner to act on.

User request:
${message}
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    const reply = response.output_text?.trim();

    return NextResponse.json({
      success: true,
      reply:
        reply ||
        "Apex couldn't generate a recommendation. Please try again.",
    });
  } catch (error) {
    console.error("Apex Chat Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate response.",
      },
      {
        status: 500,
      }
    );
  }
}