"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { createClient } from "../../utils/supabase/client";

type StrategyRow = {
  id: string;
  business_name: string;
  industry: string;
  target_audience: string;
  monthly_budget: number;
  strategy: unknown;
  created_at: string;
};

type StrategyData = {
  success?: boolean;
  businessName?: string;
  strategy?: string;
  generatedAt?: string;
};

export default function ResultsPage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [strategyRow, setStrategyRow] =
    useState<StrategyRow | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadLatestStrategy();
  }, []);

  async function loadLatestStrategy() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error: strategyError } = await supabase
        .from("strategies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (strategyError) {
        throw new Error(strategyError.message);
      }

      if (!data) {
        setStrategyRow(null);
        return;
      }

      setStrategyRow(data);
    } catch (err) {
      console.error("Results loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load your strategy."
      );
    } finally {
      setLoading(false);
    }
  }

  const businessName =
    strategyRow?.business_name || "Your Business";

  const industry =
    strategyRow?.industry || "Business";

  const targetAudience =
    strategyRow?.target_audience || "Your target customers";

  const budgetNumber =
    Number(strategyRow?.monthly_budget) || 0;

  const strategyData = useMemo<StrategyData>(() => {
    if (!strategyRow?.strategy) {
      return {};
    }

    if (typeof strategyRow.strategy === "string") {
      return {
        strategy: strategyRow.strategy,
      };
    }

    if (
      typeof strategyRow.strategy === "object" &&
      strategyRow.strategy !== null
    ) {
      return strategyRow.strategy as StrategyData;
    }

    return {};
  }, [strategyRow]);

  const strategyText = strategyData.strategy || "";

  /*
   * Premium Apex Readiness Score
   *
   * This is intentionally based on information Apex actually has,
   * rather than pretending the number came from an unknown AI system.
   */
  const marketingScore = useMemo(() => {
    let score = 40;

    if (businessName.length >= 3) score += 10;

    if (industry.length >= 3) score += 10;

    if (targetAudience.length >= 10) score += 15;

    if (budgetNumber > 0) score += 10;

    if (budgetNumber >= 1000) score += 5;

    if (strategyText.length >= 500) score += 10;

    return Math.min(score, 100);
  }, [
    businessName,
    industry,
    targetAudience,
    budgetNumber,
    strategyText,
  ]);

  const scoreLabel = useMemo(() => {
    if (marketingScore >= 90) {
      return {
        title: "Excellent Foundation",
        description:
          "Your business profile gives Apex strong information to build from.",
      };
    }

    if (marketingScore >= 75) {
      return {
        title: "Strong Foundation",
        description:
          "Apex has enough information to create a focused growth strategy.",
      };
    }

    if (marketingScore >= 60) {
      return {
        title: "Good Foundation",
        description:
          "Your strategy can improve as you add more business information.",
      };
    }

    return {
      title: "More Information Needed",
      description:
        "Add more detail to your business profile for stronger recommendations.",
    };
  }, [marketingScore]);

  const generatedDate = strategyRow?.created_at
    ? new Date(strategyRow.created_at)
    : null;

  function downloadPDF() {
    if (!strategyRow || !strategyText) return;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 20;

    function addHeader() {
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("APEX MARKETING", 16, 12);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        "AI MARKETING GROWTH REPORT",
        16,
        20
      );
    }

    function addFooter() {
      doc.setDrawColor(220, 220, 220);
      doc.line(16, pageHeight - 15, pageWidth - 16, pageHeight - 15);

      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);

      doc.text(
        "Generated by Apex AI — Your AI Chief Marketing Officer",
        16,
        pageHeight - 8
      );

      doc.text(
        `${businessName}`,
        pageWidth - 16,
        pageHeight - 8,
        {
          align: "right",
        }
      );
    }

    function checkPageSpace(requiredHeight = 20) {
      if (y + requiredHeight > pageHeight - 25) {
        addFooter();
        doc.addPage();
        addHeader();
        y = 40;
      }
    }

    addHeader();

    y = 42;

    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Marketing Growth Report", 16, y);

    y += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Prepared exclusively for ${businessName}`,
      16,
      y
    );

    y += 18;

    doc.setFillColor(239, 246, 255);
    doc.roundedRect(
      16,
      y - 5,
      pageWidth - 32,
      42,
      4,
      4,
      "F"
    );

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("BUSINESS", 22, y + 4);
    doc.text("INDUSTRY", 80, y + 4);
    doc.text("MONTHLY BUDGET", 138, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(businessName, 22, y + 14);
    doc.text(industry, 80, y + 14);
    doc.text(
      `$${budgetNumber.toLocaleString()}`,
      138,
      y + 14
    );

    doc.setFont("helvetica", "bold");
    doc.text("TARGET AUDIENCE", 22, y + 27);

    doc.setFont("helvetica", "normal");

    const audienceLines = doc.splitTextToSize(
      targetAudience,
      pageWidth - 55
    );

    doc.text(audienceLines.slice(0, 2), 22, y + 34);

    y += 55;

    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);

    doc.text(
      `APEX READINESS SCORE: ${marketingScore}/100`,
      16,
      y
    );

    y += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(scoreLabel.title, 16, y);

    y += 15;

    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);

    doc.text("AI-GENERATED GROWTH STRATEGY", 16, y);

    y += 10;

    doc.setTextColor(55, 65, 81);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const strategyLines = doc.splitTextToSize(
      strategyText,
      pageWidth - 32
    );

    for (const line of strategyLines) {
      checkPageSpace(8);

      doc.text(line, 16, y);

      y += 5;
    }

    addFooter();

    doc.save(
      `${businessName.replace(
        /[^a-z0-9]/gi,
        "-"
      )}-Apex-Marketing-Report.pdf`
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600/20">
            <Sparkles
              size={38}
              className="text-blue-400 animate-pulse"
            />
          </div>

          <h1 className="text-4xl font-black">
            Apex is loading your strategy
          </h1>

          <p className="text-slate-400 mt-3">
            Pulling your latest AI marketing report...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <FileText
              size={30}
              className="text-red-600"
            />
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            We couldn't load your report
          </h1>

          <p className="mt-4 text-slate-500">
            {error}
          </p>

          <button
            onClick={loadLatestStrategy}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!strategyRow || !strategyText) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl rounded-3xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100">
            <Sparkles
              size={36}
              className="text-blue-600"
            />
          </div>

          <h1 className="text-4xl font-black text-slate-900">
            No Strategy Yet
          </h1>

          <p className="mt-4 leading-7 text-slate-500">
            Generate your first Apex AI marketing strategy
            to unlock your personalized growth report.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700"
          >
            Create Your Strategy
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">

          {/* HERO */}
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl lg:p-10">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[3px] text-blue-100">
                    APEX AI REPORT
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-4 py-2 text-xs font-bold text-emerald-100">
                    <CheckCircle2 size={14} />
                    STRATEGY READY
                  </span>
                </div>

                <h1 className="text-4xl font-black tracking-tight lg:text-6xl">
                  Marketing Growth Report
                </h1>

                <p className="mt-4 text-lg text-blue-100">
                  Prepared exclusively for
                </p>

                <h2 className="mt-1 text-2xl font-bold lg:text-3xl">
                  {businessName}
                </h2>

                {generatedDate && (
                  <p className="mt-4 text-sm text-blue-200">
                    Generated{" "}
                    {generatedDate.toLocaleString()}
                  </p>
                )}
              </div>

              <button
                onClick={downloadPDF}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1 hover:bg-blue-50"
              >
                <Download size={19} />
                Download Report
              </button>
            </div>
          </section>

          {/* BUSINESS OVERVIEW */}
          <section className="mt-8 grid gap-6 lg:grid-cols-5">

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-4">

              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-3">
                  <Target
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Business Intelligence
                  </p>

                  <h2 className="text-2xl font-black text-slate-900">
                    Business Overview
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Business
                  </p>

                  <p className="mt-2 text-lg font-black text-slate-900">
                    {businessName}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Industry
                  </p>

                  <p className="mt-2 text-lg font-black text-slate-900">
                    {industry}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <Users
                      size={16}
                      className="text-blue-600"
                    />

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Target Audience
                    </p>
                  </div>

                  <p className="mt-2 font-semibold leading-6 text-slate-700">
                    {targetAudience}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Monthly Marketing Budget
                  </p>

                  <p className="mt-2 text-2xl font-black text-emerald-600">
                    ${budgetNumber.toLocaleString()}
                  </p>
                </div>

              </div>
            </div>

            {/* SCORE */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Apex Readiness
                </p>

                <BarChart3
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <div className="mt-5">
                <span className="text-6xl font-black text-blue-600">
                  {marketingScore}
                </span>

                <span className="ml-2 text-slate-400">
                  /100
                </span>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                  style={{
                    width: `${marketingScore}%`,
                  }}
                />
              </div>

              <h3 className="mt-5 font-black text-slate-900">
                {scoreLabel.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {scoreLabel.description}
              </p>

            </div>
          </section>

          {/* EXECUTIVE SUMMARY */}
          <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl lg:p-10">

            <div className="flex items-start gap-4">

              <div className="rounded-2xl bg-white/10 p-3">
                <Sparkles size={24} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[3px] text-blue-200">
                  Executive Summary
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Your Apex Growth Direction
                </h2>

                <p className="mt-5 max-w-4xl text-lg leading-8 text-blue-100">
                  Apex analyzed your business profile,
                  target audience, industry, budget and
                  generated strategy to create a focused
                  marketing direction for your business.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    {industry}
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    ${budgetNumber.toLocaleString()} monthly
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    AI Personalized
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* STRATEGY */}
          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

            <div className="border-b border-slate-200 bg-slate-50 p-7 lg:p-8">

              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[3px] text-slate-400">
                    AI Generated Strategy
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Growth Blueprint
                  </h2>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                  <Sparkles size={15} />
                  Powered by Apex AI
                </div>

              </div>

            </div>

            <div className="p-7 lg:p-10">

              <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-600 p-2 text-white">
                    <Lightbulb size={18} />
                  </div>

                  <h3 className="font-black text-blue-800">
                    Apex Recommendation
                  </h3>
                </div>

                <p className="mt-4 leading-7 text-slate-700">
                  Execute the strategy below consistently,
                  measure the results, and use Apex to refine
                  your next marketing move based on what
                  actually happens.
                </p>

              </div>

              <div className="whitespace-pre-wrap text-[16px] leading-8 text-slate-700">
                {strategyText}
              </div>

            </div>
          </section>

          {/* PREMIUM INSIGHTS */}
          <section className="mt-8 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <TrendingUp
                  size={26}
                  className="text-blue-600"
                />
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Growth
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-900">
                Build Momentum
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Consistent execution gives your business
                the best chance of turning marketing activity
                into measurable growth.
              </p>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
                <Target
                  size={26}
                  className="text-purple-600"
                />
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Focus
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-900">
                Know Your Customer
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Your target audience is the foundation for
                stronger messaging, better offers and more
                focused customer acquisition.
              </p>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                <CheckCircle2
                  size={26}
                  className="text-emerald-600"
                />
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Execution
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-900">
                Turn Strategy Into Action
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                The strategy becomes valuable when your
                business actually executes, measures and
                improves the plan.
              </p>

            </div>

          </section>

          {/* ACTION CENTER */}
          <section className="mt-8 rounded-3xl bg-slate-950 p-8 text-white shadow-2xl lg:p-10">

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-600 p-2">
                    <Sparkles size={19} />
                  </div>

                  <p className="text-sm font-bold uppercase tracking-[3px] text-blue-300">
                    Apex Action Center
                  </p>
                </div>

                <h2 className="mt-3 text-3xl font-black">
                  Ready for the next move?
                </h2>

                <p className="mt-2 text-slate-400">
                  Turn your strategy into your next marketing action.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
                >
                  <Download size={17} />
                  PDF
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                >
                  Dashboard
                  <ArrowRight size={17} />
                </button>

              </div>

            </div>

          </section>

          {/* FOOTER */}
          <footer className="py-10">

            <div className="flex flex-col justify-between gap-5 border-t border-slate-200 pt-7 text-sm text-slate-400 md:flex-row">

              <p>
                © {new Date().getFullYear()} Apex Marketing
              </p>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  className="text-emerald-500"
                />

                <span>
                  Strategy successfully generated
                </span>
              </div>

              <p>
                Your AI Chief Marketing Officer
              </p>

            </div>

          </footer>

        </div>
      </main>
    </div>
  );
}