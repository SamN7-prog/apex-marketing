"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  Copy,
  Loader2,
  Megaphone,
  Search,
  Share2,
  Sparkles,
  Target,
  Wand2,
  RefreshCw,
} from "lucide-react";

type CopilotCardProps = {
  businessName?: string;
  industry?: string;
  targetAudience?: string;
};

type Action = {
  label: string;
  description: string;
  icon: typeof Search;
  prompt: string;
};

export default function CopilotCard({
  businessName,
  industry,
  targetAudience,
}: CopilotCardProps) {
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const actions: Action[] = [
    {
      label: "Improve SEO",
      description: "Find your highest-impact search opportunity.",
      icon: Search,
      prompt: `
Analyze this business's SEO opportunity.

Identify the SINGLE highest-impact SEO improvement they should make right now.

Then provide:
1. What to change
2. Exactly how to do it
3. Why it matters
4. What result we should expect
5. A simple priority level

Do not give generic SEO advice. Make the recommendation specific to this business.
      `,
    },
    {
      label: "Create an Ad",
      description: "Build an advertising angle designed to convert.",
      icon: Megaphone,
      prompt: `
Create a practical advertising strategy for this business.

Recommend:
1. The best advertising platform
2. The ideal audience
3. The campaign objective
4. The core offer
5. The ad angle
6. A strong headline
7. A clear call to action
8. What the business should test first

Keep the recommendation realistic for the stated marketing budget.
      `,
    },
    {
      label: "Social Content",
      description: "Create a post customers would actually care about.",
      icon: Share2,
      prompt: `
Create one high-quality social media marketing asset for this business.

Give:
1. Platform
2. Post concept
3. Hook
4. Full post copy
5. Call to action
6. Why this should work

Make it specific to the business and target audience.
Do not use emojis.
      `,
    },
    {
      label: "Growth Plan",
      description: "Turn the biggest opportunities into a clear plan.",
      icon: Target,
      prompt: `
Build a practical 30-day growth plan for this business.

Give the business owner:
1. The #1 priority
2. The #2 priority
3. The #3 priority
4. What to do during week 1
5. What to do during weeks 2-3
6. What to do during week 4
7. What success should look like

Prioritize actions by expected impact and practicality.
Do not overwhelm the business owner with unnecessary tactics.
      `,
    },
  ];

  async function runCopilot(
    prompt: string,
    actionLabel: string
  ) {
    setLoading(true);
    setActiveAction(actionLabel);
    setError("");
    setRecommendation("");
    setCopied(false);

    try {
      const response = await fetch(
        "/api/marketing/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `
You are Apex Copilot — an AI Chief Marketing Officer.

Your job is to give business owners practical marketing decisions they can actually execute.

BUSINESS INFORMATION

Business Name:
${businessName || "Not provided"}

Industry:
${industry || "Not provided"}

Target Audience:
${targetAudience || "Not provided"}

TASK

${prompt}

IMPORTANT RULES

- Be specific.
- Be practical.
- Prioritize actions.
- Avoid generic filler.
- Do not invent business information.
- Do not use emojis.
- Use clear headings.
- Keep the response concise enough for a busy business owner.
- Focus on what should happen NEXT.
- If information is missing, clearly state the assumption instead of pretending you know it.

End with a short section called:

NEXT MOVE

Give the business owner one action they should take immediately.
            `,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to get recommendation."
        );
      }

      setRecommendation(
        data.reply ||
          "No recommendation was returned."
      );
    } catch (err) {
      console.error("Copilot error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
      setActiveAction("");
    }
  }

  async function copyRecommendation() {
    if (!recommendation) return;

    try {
      await navigator.clipboard.writeText(
        recommendation
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy recommendation:",
        error
      );
    }
  }

  function resetCopilot() {
    setRecommendation("");
    setError("");
    setCopied(false);
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-slate-900/10">

      {/* PREMIUM BACKGROUND */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

      {/* HEADER */}

      <div className="relative border-b border-white/10 p-6 sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-4">

            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-500/10">

              <Bot
                size={25}
                className="text-blue-300"
              />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />

            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-300">
                  Apex Intelligence
                </span>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">
                  Online
                </span>

              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Apex Copilot
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Your AI marketing advisor. Choose an objective
                and Apex will build the next move.
              </p>

            </div>

          </div>

          {/* BUSINESS CONTEXT */}

          {(businessName || industry) && (
            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 sm:block">

              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                Working on
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {businessName || industry}
              </p>

              {businessName && industry && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {industry}
                </p>
              )}

            </div>
          )}

        </div>

      </div>

      {/* BODY */}

      <div className="relative p-6 sm:p-8">

        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {!recommendation &&
          !loading &&
          !error && (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">

                <div className="flex items-start gap-4">

                  <div className="rounded-xl bg-blue-500/10 p-2.5">
                    <Wand2
                      size={19}
                      className="text-blue-300"
                    />
                  </div>

                  <div>

                    <p className="font-bold text-white">
                      What should Apex work on?
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-slate-400">
                      Pick an objective below. Apex will analyze
                      the business context and return a practical
                      recommendation.
                    </p>

                  </div>

                </div>

              </div>

              {/* ACTION GRID */}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                {actions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.label}
                      onClick={() =>
                        runCopilot(
                          action.prompt,
                          action.label
                        )
                      }
                      disabled={Boolean(activeAction)}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-500/[0.08] hover:shadow-xl hover:shadow-blue-950/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {/* hover glow */}

                      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/10 opacity-0 blur-2xl transition group-hover:opacity-100" />

                      <div className="relative flex items-start justify-between gap-4">

                        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5 transition group-hover:border-blue-400/20 group-hover:bg-blue-500/10">

                          <Icon
                            size={19}
                            className="text-slate-300 transition group-hover:text-blue-300"
                          />

                        </div>

                        <ArrowRight
                          size={16}
                          className="mt-1 text-slate-600 transition duration-300 group-hover:translate-x-1 group-hover:text-blue-300"
                        />

                      </div>

                      <div className="relative mt-5">

                        <p className="font-bold text-white">
                          {action.label}
                        </p>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500 transition group-hover:text-slate-400">
                          {action.description}
                        </p>

                      </div>

                    </button>
                  );
                })}

              </div>

              {/* MAIN CTA */}

              <button
                onClick={() =>
                  runCopilot(
                    `
Analyze this entire business from a marketing perspective.

Determine:
1. The biggest growth opportunity
2. The biggest marketing weakness
3. The highest-impact action to take next
4. What the business should NOT spend money on yet
5. A simple next step the owner can take today

Prioritize your recommendations.
                    `,
                    "Business Analysis"
                  )
                }
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50"
              >

                <Sparkles size={18} />

                Analyze My Business

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />

              </button>

              <p className="mt-3 text-center text-[11px] font-medium text-slate-600">
                Apex uses your business information to personalize
                its recommendations.
              </p>
            </>
          )}

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div className="animate-in fade-in">

            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.07] p-6 sm:p-7">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">

                  <Loader2
                    size={22}
                    className="animate-spin text-blue-300"
                  />

                </div>

                <div>

                  <p className="font-bold text-white">
                    Apex is thinking...
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Analyzing your business and building a
                    prioritized recommendation.
                  </p>

                </div>

              </div>

              {/* loading bars */}

              <div className="mt-7 space-y-3">

                <div className="h-2 animate-pulse rounded-full bg-white/10" />

                <div className="h-2 w-5/6 animate-pulse rounded-full bg-white/10" />

                <div className="h-2 w-2/3 animate-pulse rounded-full bg-white/10" />

              </div>

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && !loading && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.07] p-6">

            <div className="flex items-start gap-4">

              <div className="rounded-xl bg-red-500/10 p-2.5">

                <Bot
                  size={19}
                  className="text-red-300"
                />

              </div>

              <div className="min-w-0">

                <p className="font-bold text-red-100">
                  Apex couldn't complete that request.
                </p>

                <p className="mt-2 break-words text-sm leading-6 text-red-300/80">
                  {error}
                </p>

                <button
                  onClick={resetCopilot}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-bold text-red-200 transition hover:bg-red-400/15"
                >
                  <RefreshCw size={15} />
                  Try Again
                </button>

              </div>

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* RECOMMENDATION */}
        {/* ================================================= */}

        {recommendation && !loading && (
          <div>

            {/* RESULT HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

                  <Sparkles
                    size={19}
                    className="text-blue-300"
                  />

                </div>

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">
                    Apex Recommendation
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Personalized marketing intelligence
                  </p>

                </div>

              </div>

              <button
                onClick={copyRecommendation}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-blue-400/20 hover:bg-blue-500/10 hover:text-white"
              >

                {copied ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}

              </button>

            </div>

            {/* RESULT */}

            <div className="mt-5 rounded-2xl border border-blue-400/20 bg-white/[0.045] p-6 sm:p-7">

              <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {recommendation}
              </div>

            </div>

            {/* ACTION BAR */}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={resetCopilot}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >

                <ArrowRight
                  size={16}
                  className="rotate-180"
                />

                Choose Another Task

              </button>

              <button
                onClick={() =>
                  runCopilot(
                    `
Based on the previous recommendation, improve it.

Make the advice:
- More specific
- More actionable
- Easier for a business owner to execute
- Focused on measurable results

Then provide one immediate next action.
                    `,
                    "Refine Recommendation"
                  )
                }
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >

                <Sparkles size={16} />

                Refine With Apex

                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />

              </button>

            </div>

          </div>
        )}

      </div>

      {/* FOOTER */}

      <div className="relative border-t border-white/10 bg-white/[0.02] px-6 py-4 sm:px-8">

        <div className="flex flex-col gap-2 text-[10px] font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-between">

          <span>
            Powered by Apex Intelligence
          </span>

          <span className="flex items-center gap-1.5">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            AI system operational

          </span>

        </div>

      </div>

    </section>
  );
}