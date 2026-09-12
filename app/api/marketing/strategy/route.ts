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
      budget,
      goal,
    } = await req.json();

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: `
You are Apex AI, the world's best Chief Marketing Officer.

Create a personalized marketing strategy for this business.

Business Name:
${businessName}

Industry:
${industry}

Target Audience:
${targetAudience}

Monthly Budget:
${budget}

Primary Goal:
${goal}

Return ONLY valid JSON in this format:

{
  "executiveSummary": "A short summary.",

  "seoStrategy": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ],

  "socialStrategy": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ],

  "paidAdvertising": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ],

  "priorityActions": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ],

  "roadmap": [
    {
      "phase": "Month 1",
      "task": "..."
    },
    {
      "phase": "Month 2",
      "task": "..."
    },
    {
      "phase": "Month 3",
      "task": "..."
    }
  ],

  "expectedResults": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}

Requirements:

- Return ONLY valid JSON.
- Tailor everything to the business.
- Make the recommendations realistic.
- Keep advice actionable.
`,
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const report = JSON.parse(response.output_text);

    return NextResponse.json(report);
  } catch (error) {
    console.error("Strategy Error:", error);

    return NextResponse.json(
      {
        executiveSummary:
          "Apex AI couldn't generate a strategy at this time.",

        seoStrategy: [
          "Optimize your homepage.",
          "Improve page speed.",
          "Target local keywords.",
          "Create service pages.",
          "Collect customer reviews.",
        ],

        socialStrategy: [
          "Post consistently.",
          "Share customer testimonials.",
          "Publish educational content.",
          "Use short-form video.",
          "Engage with followers daily.",
        ],

        paidAdvertising: [
          "Launch Google Search Ads.",
          "Test Meta Ads.",
          "Retarget website visitors.",
          "Track conversions.",
          "Scale winning campaigns.",
        ],

        priorityActions: [
          "Improve website.",
          "Strengthen SEO.",
          "Increase social activity.",
          "Launch paid ads.",
          "Measure results weekly.",
        ],

        roadmap: [
          {
            phase: "Month 1",
            task: "Build a strong online foundation.",
          },
          {
            phase: "Month 2",
            task: "Launch advertising campaigns.",
          },
          {
            phase: "Month 3",
            task: "Optimize and scale what performs best.",
          },
        ],

        expectedResults: [
          "Increase website traffic.",
          "Generate more qualified leads.",
          "Improve online visibility.",
          "Build brand awareness.",
          "Increase customer conversions.",
        ],
      },
      {
        status: 200,
      }
    );
  }
}