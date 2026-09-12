"use client";

import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

type DailyBriefingProps = {
  businessName?: string;
  industry?: string;
  targetAudience?: string;
  budget?: string;
};

export default function DailyBriefing({
  businessName,
  industry,
  targetAudience,
  budget,
}: DailyBriefingProps) {
  const [briefing, setBriefing] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState("");

  async function generateBriefing() {
    setLoading(true);
    setError("");
    setBriefing("");
    setActionPlan("");

    try {
      const response = await fetch("/api/marketing/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `
You are Apex AI, the Chief Marketing Officer for this business.

Create a DAILY MARKETING BRIEFING.

Business Name:
${businessName || "Not provided"}

Industry:
${industry || "Not provided"}

Target Audience:
${targetAudience || "Not provided"}

Monthly Marketing Budget:
${budget || "Not provided"}

Give the business owner:

1. Today's #1 marketing priority.
2. Why this should be the priority.
3. One specific action they should take today.
4. What result this action is intended to improve.

Keep the briefing concise, practical, and specific.

Do not use emojis.
Do not make up statistics.
Do not promise guaranteed results.

Format it with clear headings.
          `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to generate daily briefing."
        );
      }

      setBriefing(
        data.reply || "No briefing was returned."
      );
    } catch (err) {
      console.error("Daily Briefing Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function buildActionPlan() {
    setBuilding(true);
    setError("");
    setActionPlan("");

    try {
      const response = await fetch("/api/marketing/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `
You are Apex AI, an expert Chief Marketing Officer.

The business owner received this daily marketing briefing:

${briefing}

Business Name:
${businessName || "Not provided"}

Industry:
${industry || "Not provided"}

Target Audience:
${targetAudience || "Not provided"}

Monthly Marketing Budget:
${budget || "Not provided"}

Now BUILD the recommended action.

Create a practical step-by-step action plan that the business owner can execute today.

Include:
1. Objective
2. Exact steps
3. Suggested copy or content when appropriate
4. What to measure
5. What to do next

Do not use emojis.
Do not invent performance numbers.
Do not promise guaranteed results.

Make the plan specific to this business.
          `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to build action plan."
        );
      }

      setActionPlan(
        data.reply || "No action plan was returned."
      );
    } catch (err) {
      console.error("Action Plan Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setBuilding(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg">

      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />

      {/* Header */}

      <div className="relative border-b border-blue-100 p-8 md:p-10">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-5">

            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 shadow-lg shadow-blue-600/20">
              <BrainCircuit
                size={30}
                className="text-white"
              />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white">
                  Today's Priority
                </span>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                  Apex Intelligence
                </span>

              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Daily Marketing Briefing
              </h2>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Apex identifies the most important marketing
                opportunity for your business today.
              </p>

            </div>

          </div>

          <button
            onClick={generateBriefing}
            disabled={loading || building}
            className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-slate-950 px-7 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />
                Analyzing...
              </>
            ) : (
              <>
                Generate Today's Briefing
                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>

        </div>

      </div>

      {/* Empty State */}

      {!briefing && !loading && !error && (
        <div className="relative p-8 md:p-10">

          <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-100 p-3">
                  <Target
                    size={21}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    One Clear Priority
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Know exactly what deserves attention first.
                  </p>
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-emerald-100 p-3">
                  <CheckCircle2
                    size={21}
                    className="text-emerald-600"
                  />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Build It For Me
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Turn the recommendation into an action plan.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="relative p-8 md:p-10">

          <div className="rounded-2xl border border-blue-200 bg-white p-7 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-blue-100 p-3">
                <Loader2
                  size={24}
                  className="animate-spin text-blue-600"
                />
              </div>

              <div>

                <p className="font-bold text-slate-900">
                  Apex is analyzing your business...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Building today's personalized marketing priority.
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Error */}

      {error && (
        <div className="relative p-8 md:p-10">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

            <p className="font-bold text-red-700">
              Apex couldn't complete that request.
            </p>

            <p className="mt-2 text-sm leading-6 text-red-600">
              {error}
            </p>

          </div>

        </div>
      )}

      {/* Briefing */}

      {briefing && !loading && (
        <div className="relative p-8 md:p-10">

          <div className="rounded-2xl border border-blue-200 bg-white p-7 shadow-sm md:p-8">

            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-100 p-3">
                  <Sparkles
                    size={21}
                    className="text-blue-600"
                  />
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    Apex Recommendation
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-950">
                    Your priority for today
                  </h3>

                </div>

              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                AI Generated
              </span>

            </div>

            <div className="mt-7 whitespace-pre-wrap rounded-2xl bg-slate-50 p-6 text-sm leading-8 text-slate-700">
              {briefing}
            </div>

            {/* Build This For Me */}

            {!actionPlan && (
              <button
                onClick={buildActionPlan}
                disabled={building}
                className="group mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {building ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Apex Is Building It...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />

                    Build This For Me

                    <ArrowRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            )}

            {/* Action Plan */}

            {actionPlan && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200">

                <div className="flex items-center gap-3 bg-emerald-50 px-6 py-4">

                  <div className="rounded-xl bg-emerald-100 p-2">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-600"
                    />
                  </div>

                  <div>

                    <p className="font-black text-emerald-900">
                      Apex Built Your Action Plan
                    </p>

                    <p className="text-sm text-emerald-700">
                      Here's exactly what to do next.
                    </p>

                  </div>

                </div>

                <div className="whitespace-pre-wrap bg-white p-6 text-sm leading-8 text-slate-700">
                  {actionPlan}
                </div>

              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={generateBriefing}
                disabled={loading || building}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-60"
              >
                <RefreshCw size={16} />
                Refresh Briefing
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}