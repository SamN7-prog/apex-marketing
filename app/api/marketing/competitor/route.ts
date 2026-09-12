import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { website } = await req.json();

    const prompt = `
You are Apex AI.

Analyze this competitor:

${website}

Return ONLY valid JSON.

{
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "weaknesses": [
    "...",
    "...",
    "..."
  ],
  "opportunities": [
    "...",
    "...",
    "..."
  ],
  "actionPlan": [
    "...",
    "...",
    "..."
  ]
}

Requirements:

- Be specific.
- Think like an expert marketing consultant.
- Give practical advice.
- Do NOT explain anything outside the JSON.
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    const output = response.output_text.trim();
    const analysis = JSON.parse(output);

    return NextResponse.json(analysis);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to analyze competitor.",
      },
      {
        status: 500,
      }
    );
  }
}