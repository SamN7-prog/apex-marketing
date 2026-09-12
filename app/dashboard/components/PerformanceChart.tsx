"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Lightbulb,
  Loader2,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

type PerformanceTotals = {
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  spend: number;
  clickThroughRate: number;
  conversionRate: number;
  costPerLead: number;
};

type AIAnalysis = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

export default function PerformanceChart() {
  const [totals, setTotals] =
    useState<PerformanceTotals | null>(null);

  const [aiAnalysis, setAiAnalysis] =
    useState<AIAnalysis | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [analysisError, setAnalysisError] =
    useState("");

  useEffect(() => {
    loadPerformance();
  }, []);

  async function loadPerformance() {
    try {
      const response = await fetch(
        "/api/marketing/performance-data"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load performance data."
        );
      }

      const data = await response.json();

      if (data.success) {
        setTotals(data.totals);
      }
    } catch (error) {
      console.error(
        "Failed to load performance:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function analyzePerformance() {
    setAnalyzing(true);
    setAnalysisError("");

    try {
      const response = await fetch(
        "/api/marketing/analyze-performance",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Apex could not analyze your performance."
        );
      }

      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        throw new Error(
          "Apex returned an invalid analysis."
        );
      }
    } catch (error) {
      console.error(
        "Apex AI analysis error:",
        error
      );

      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Apex analysis failed."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  const hasData =
    !!totals &&
    (
      totals.impressions > 0 ||
      totals.clicks > 0 ||
      totals.leads > 0 ||
      totals.conversions > 0 ||
      totals.spend > 0
    );

  const metrics = useMemo(
    () => [
      {
        label: "Impressions",
        value: totals?.impressions ?? 0,
        icon: BarChart3,
        iconBg: "bg-blue-50",
        iconText: "text-blue-600",
      },
      {
        label: "Clicks",
        value: totals?.clicks ?? 0,
        icon: MousePointerClick,
        iconBg: "bg-violet-50",
        iconText: "text-violet-600",
      },
      {
        label: "Leads",
        value: totals?.leads ?? 0,
        icon: Users,
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
      },
      {
        label: "Conversions",
        value: totals?.conversions ?? 0,
        icon: TrendingUp,
        iconBg: "bg-orange-50",
        iconText: "text-orange-600",
      },
    ],
    [totals]
  );

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)]">

      {/* HEADER */}

      <div className="border-b border-slate-100 px-6 py-6 sm:px-8">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 shadow-lg">
              <BarChart3
                size={22}
                className="text-white"
              />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                  Performance Intelligence
                </p>

                {hasData && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>
                )}

              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Campaign Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                See what your marketing is actually producing.
              </p>

            </div>

          </div>

          {hasData && !aiAnalysis && (
            <button
              onClick={analyzePerformance}
              disabled={analyzing}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {analyzing ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Apex is thinking...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Analyze with Apex
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </>
              )}

            </button>
          )}

        </div>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="mt-5 h-9 w-24 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-20 rounded bg-slate-200" />
            </div>
          ))}

        </div>
      )}

      {/* METRICS */}

      {!loading && (
        <div className="grid gap-px border-b border-slate-100 bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">

          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="bg-white p-6 transition duration-300 hover:bg-slate-50"
              >

                <div className="flex items-center justify-between">

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.iconBg}`}
                  >
                    <Icon
                      size={19}
                      className={metric.iconText}
                    />
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                    {metric.label}
                  </span>

                </div>

                <p className="mt-5 text-3xl font-black tracking-tight text-slate-950">
                  {metric.value.toLocaleString()}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  {hasData
                    ? "Tracked activity"
                    : "Awaiting campaign data"}
                </p>

              </div>
            );
          })}

        </div>
      )}

      {/* PERFORMANCE DETAILS */}

      {!loading &&
        hasData &&
        totals && (
          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">

            <div className="rounded-2xl bg-slate-950 p-5 text-white">

              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Ad Spend
              </p>

              <p className="mt-3 text-3xl font-black">
                ${totals.spend.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Total tracked spend
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Click-Through Rate
              </p>

              <p className="mt-3 text-3xl font-black text-slate-950">
                {totals.clickThroughRate}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Impressions → clicks
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Cost Per Lead
              </p>

              <p className="mt-3 text-3xl font-black text-slate-950">
                ${totals.costPerLead.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Average acquisition cost
              </p>

            </div>

          </div>
        )}

      {/* EMPTY STATE */}

      {!loading && !hasData && (
        <div className="px-6 py-14 text-center sm:px-8">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <BarChart3
              size={28}
              className="text-slate-400"
            />
          </div>

          <h3 className="mt-5 text-xl font-black text-slate-950">
            Your marketing intelligence starts here.
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Connect campaign performance data and Apex will turn it into insights, opportunities, and recommendations.
          </p>

        </div>
      )}

      {/* AI ERROR */}

      {analysisError && (
        <div className="mx-6 mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:mx-8">

          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>

            <p className="text-sm font-black text-red-800">
              Apex couldn't complete the analysis.
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {analysisError}
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          APEX AI ANALYSIS
      ===================================================== */}

      {aiAnalysis && (
        <div className="border-t border-slate-100 bg-slate-950 p-6 sm:p-8">

          {/* AI HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <Sparkles
                  size={22}
                  className="text-white"
                />
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                    Apex Intelligence
                  </p>

                  <span className="rounded-full bg-white/10 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-slate-400">
                    AI Analysis
                  </span>

                </div>

                <h3 className="mt-1 text-2xl font-black tracking-tight text-white">
                  Here's what Apex sees.
                </h3>

              </div>

            </div>

            <button
              onClick={analyzePerformance}
              disabled={analyzing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
            >
              {analyzing ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Sparkles size={14} />
              )}

              Refresh Analysis
            </button>

          </div>

          {/* SUMMARY */}

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.05] p-6">

            <div className="flex gap-4">

              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <Lightbulb
                  size={16}
                  className="text-blue-400"
                />
              </div>

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Executive Summary
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {aiAnalysis.summary}
                </p>

              </div>

            </div>

          </div>

          {/* AI GRID */}

          <div className="mt-4 grid gap-4 lg:grid-cols-3">

            {/* STRENGTHS */}

            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.05] p-5">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={17}
                  className="text-emerald-400"
                />

                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400">
                  What's Working
                </p>

              </div>

              <div className="mt-4 space-y-3">

                {aiAnalysis.strengths
                  ?.slice(0, 3)
                  .map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex gap-3"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                      <p className="text-sm leading-6 text-slate-300">
                        {item}
                      </p>
                    </div>
                  ))}

              </div>

            </div>

            {/* WEAKNESSES */}

            <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.05] p-5">

              <div className="flex items-center gap-2">

                <AlertTriangle
                  size={17}
                  className="text-amber-400"
                />

                <p className="text-xs font-black uppercase tracking-[0.15em] text-amber-400">
                  Needs Attention
                </p>

              </div>

              <div className="mt-4 space-y-3">

                {aiAnalysis.weaknesses
                  ?.slice(0, 3)
                  .map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex gap-3"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />

                      <p className="text-sm leading-6 text-slate-300">
                        {item}
                      </p>
                    </div>
                  ))}

              </div>

            </div>

            {/* RECOMMENDATIONS */}

            <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.05] p-5">

              <div className="flex items-center gap-2">

                <TrendingUp
                  size={17}
                  className="text-blue-400"
                />

                <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-400">
                  Apex Recommends
                </p>

              </div>

              <div className="mt-4 space-y-3">

                {aiAnalysis.recommendations
                  ?.slice(0, 3)
                  .map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex gap-3"
                    >

                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-[10px] font-black text-blue-400">
                        {index + 1}
                      </span>

                      <p className="text-sm leading-6 text-slate-300">
                        {item}
                      </p>

                    </div>
                  ))}

              </div>

            </div>

          </div>

          {/* BOTTOM CTA */}

          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-black text-white">
                Ready to act on the recommendation?
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Apex has identified the next areas worth your attention.
              </p>

            </div>

            <button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-slate-100"
            >
              Review Dashboard
              <ArrowRight
                size={14}
                className="transition group-hover:translate-x-1"
              />
            </button>

          </div>

        </div>
      )}

    </section>
  );
}