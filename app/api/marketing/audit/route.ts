import OpenAI from "openai";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { website } = await req.json();

    // Fetch the website HTML
    const response = await fetch(website, {
      headers: {
        "User-Agent": "Mozilla/5.0 Apex Marketing Audit",
      },
    });

    if (!response.ok) {
      throw new Error("Unable to fetch website.");
    }

    const html = await response.text();

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    const title = $("title").text();

    const metaDescription =
      $('meta[name="description"]').attr("content") || "";

    const headings = $("h1,h2,h3")
      .map((_, el) => $(el).text().trim())
      .get()
      .join("\n");

    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .slice(0, 6000);

    const ai = await openai.responses.create({
      model: "gpt-4.1",
      input: `
You are Apex AI.

Analyze this REAL website.

Website:
${website}

TITLE:
${title}

META DESCRIPTION:
${metaDescription}

HEADINGS:
${headings}

BODY:
${bodyText}

Return ONLY valid JSON.

{
  "overallScore": 85,
  "websiteScore": 90,
  "seoScore": 82,
  "conversionScore": 74,
  "trustScore": 86,
  "mobileScore": 91,

  "strengths": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ],

  "improvements": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ],

  "revenueOpportunities": [
    {
      "title":"...",
      "impact":"High"
    },
    {
      "title":"...",
      "impact":"Medium"
    },
    {
      "title":"...",
      "impact":"High"
    },
    {
      "title":"...",
      "impact":"Low"
    }
  ]
}

Requirements:

- Base every recommendation on the ACTUAL webpage content.
- Keep scores between 50-100.
- Return ONLY JSON.
`,
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    return NextResponse.json(
      JSON.parse(ai.output_text)
    );
  } catch (error) {

console.error("AUDIT ERROR:", error);

return NextResponse.json(
  {
    error: String(error),
  },
  {
    status: 500,
    }
   );
  }
}