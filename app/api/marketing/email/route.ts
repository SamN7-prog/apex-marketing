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
You are Apex AI.

Create a professional email marketing campaign for this business.

Business Name:
${businessName}

Industry:
${industry}

Target Audience:
${targetAudience}

Return ONLY valid JSON.

{
  "subject": "",
  "preview": "",
  "body": "",
  "cta": ""
}
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    const text = response.output_text;

    const json = JSON.parse(text);

    return NextResponse.json(json);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate email campaign.",
      },
      {
        status: 500,
      }
    );
  }
}