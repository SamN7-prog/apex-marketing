import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type SocialResponse = {
  posts: {
    platform: string;
    title: string;
    caption: string;
    hashtags: string[];
    bestTime: string;
    cta: string;
  }[];
};

export async function POST(req: Request) {
  try {
    const {
      businessName,
      industry,
      targetAudience,
    } = await req.json();

    if (!businessName || !industry || !targetAudience) {
      return NextResponse.json(
        {
          error: "Missing required business information.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
You are Apex AI, an expert social media marketing strategist.

Create 5 HIGH-QUALITY social media posts for this business.

Business Name:
${businessName}

Industry:
${industry}

Target Audience:
${targetAudience}

Requirements:

- Each post should be unique.
- Write like an experienced marketing agency.
- Keep captions engaging.
- Include a strong call-to-action.
- Include relevant hashtags.
- Recommend the best posting time.
- Return ONLY valid JSON.

Return this exact structure:

{
  "posts":[
    {
      "platform":"Instagram",
      "title":"...",
      "caption":"...",
      "hashtags":[
        "#example",
        "#marketing"
      ],
      "bestTime":"6:00 PM",
      "cta":"..."
    }
  ]
}
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    const output = response.output_text.trim();

    let data: SocialResponse;

    try {
      data = JSON.parse(output);
    } catch {
      console.error("Invalid JSON returned:");
      console.error(output);

      return NextResponse.json(
        {
          error: "Apex AI returned an invalid response.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Social generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate social media content.",
      },
      {
        status: 500,
      }
    );
  }
}