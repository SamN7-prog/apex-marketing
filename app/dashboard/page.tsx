"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ChevronDown,
  History,
  Save,
  Sparkles,
  TrendingUp,
  UserCheck2,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { createClient } from "../../utils/supabase/client";

import OpportunityCard from "./components/OpportunityCard";
import CopilotCard from "./components/CopilotCard";
import RecentActivity from "./components/RecentActivity";
import PerformanceChart from "./components/PerformanceChart";

type Strategy = {
  id: string;
  business_name: string;
  industry: string;
  target_audience: string;
  monthly_budget: number;
  created_at: string;
};

type Campaign = {
  id: string;
  business_name: string;
  industry: string;
  target_audience: string;
  monthly_budget: number | null;
  strategy: string | null;
  facebook: unknown;
  google: unknown;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [budget, setBudget] = useState("");

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [marketingHealth, setMarketingHealth] =
    useState<number | null>(null);

  useEffect(() => {
    loadDashboard();
    loadMarketingHealth();
  }, []);

  async function loadDashboard() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadingDashboard(false);
        return;
      }

      const {
        data: strategyData,
        error: strategiesError,
      } = await supabase
        .from("strategies")
        .select(
          "id, business_name, industry, target_audience, monthly_budget, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (strategiesError) {
        console.error("Strategies error:", strategiesError);
      }

      setStrategies(strategyData || []);

      const {
        data: campaignData,
        error: campaignsError,
      } = await supabase
        .from("ad_campaigns")
        .select(
          "id, business_name, industry, target_audience, monthly_budget, strategy, facebook, google, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (campaignsError) {
        console.error("Campaigns error:", campaignsError);
      }

      setCampaigns(campaignData || []);

      const savedBusiness = localStorage.getItem(
        `apexBusiness_${user.id}`
      );

      if (savedBusiness) {
        try {
          const business = JSON.parse(savedBusiness);

          setBusinessName(business.businessName || "");
          setIndustry(business.industry || "");
          setTargetAudience(
            business.targetAudience || ""
          );
          setBudget(business.budget || "");
        } catch (error) {
          console.error(
            "Failed to load saved business:",
            error
          );
        }
      }

      if (
        !savedBusiness &&
        campaignData &&
        campaignData.length > 0
      ) {
        const latestCampaign = campaignData[0];

        setBusinessName(
          latestCampaign.business_name || ""
        );

        setIndustry(
          latestCampaign.industry || ""
        );

        setTargetAudience(
          latestCampaign.target_audience || ""
        );

        setBudget(
          latestCampaign.monthly_budget
            ? String(latestCampaign.monthly_budget)
            : ""
        );
      }
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoadingDashboard(false);
    }
  }

  async function loadMarketingHealth() {
    try {
      const response = await fetch(
        "/api/marketing/health"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load marketing health."
        );
      }

      const data = await response.json();

      setMarketingHealth(
        data.analyzed &&
          typeof data.score === "number"
          ? data.score
          : null
      );
    } catch (error) {
      console.error(
        "Failed to load marketing health:",
        error
      );

      setMarketingHealth(null);
    }
  }

  const totalStrategies = strategies.length;
  const totalCampaigns = campaigns.length;

  const totalBudget = campaigns.reduce(
    (sum, campaign) =>
      sum +
      Number(campaign.monthly_budget || 0),
    0
  );

  const averageBudget =
    totalCampaigns === 0
      ? 0
      : Math.round(
          totalBudget / totalCampaigns
        );

  function getHealthLabel(score: number | null) {
    if (score === null) return "Not analyzed";
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs attention";
    return "Critical";
  }

  function getHealthWidth(score: number | null) {
    if (score === null) return "0%";

    return `${Math.max(
      0,
      Math.min(score, 100)
    )}%`;
  }

  async function generateStrategy() {
    if (
      !businessName.trim() ||
      !industry.trim() ||
      !targetAudience.trim() ||
      !budget.trim()
    ) {
      setError(
        "Please fill out all business information."
      );

      return;
    }

    setError("");
    setIsGenerating(true);

    const businessData = {
      businessName,
      industry,
      targetAudience,
      budget,
    };

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error(
          "You must be signed in before generating a strategy."
        );
      }

      localStorage.setItem(
        `apexBusiness_${currentUser.id}`,
        JSON.stringify(businessData)
      );

      const response = await fetch(
        "/api/marketing/generate-strategy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessName,
            industry,
            targetAudience,
            monthlyBudget: budget,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to generate strategy."
        );
      }

      const { error: saveError } =
        await supabase
          .from("strategies")
          .insert({
            user_id: currentUser.id,
            business_name: businessName,
            industry,
            target_audience: targetAudience,
            monthly_budget: Number(budget),
            strategy: data,
          });

      if (saveError) {
        throw new Error(
          saveError.message
        );
      }

      await loadDashboard();
      await loadMarketingHealth();

      router.push("/results");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  const activityData = strategies
    .slice(0, 5)
    .map((strategy) => ({
      id: strategy.id,
      business: strategy.business_name,
      industry: strategy.industry,
      date: strategy.created_at,
    }));

  const quickWins = industry
    ? [
        `Improve your ${industry} Google Business Profile`,
        "Create one high-converting offer",
        "Set up instant lead follow-up",
      ]
    : [
        "Complete your business profile",
        "Create your first strategy",
        "Run your first marketing analysis",
      ];

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div
            className="
              mx-auto
              w-full
              max-w-[1380px]
              px-4
              py-5
              sm:px-7
              sm:py-8
              lg:px-10
              lg:py-10
            "
          >
            {/* ================================================= */}
            {/* TOP BAR */}
            {/* ================================================= */}

            <header
              className="
                mb-6
                flex
                flex-col
                gap-5
                sm:mb-8
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <Sparkles size={15} />
                  </div>

                  <span className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-blue-600 sm:text-xs sm:tracking-[0.2em]">
                    Apex Command Center
                  </span>
                </div>

                <h1
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-950
                    sm:text-3xl
                    lg:text-4xl
                  "
                >
                  Good to see you,{" "}
                  <span className="text-blue-600">
                    {businessName || "there"}
                  </span>
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Your marketing operation, simplified.
                </p>
              </div>

              <div className="flex w-full items-center gap-3 sm:w-auto">
                <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Apex Online
                </div>

                <button
                  onClick={() =>
                    router.push("/history")
                  }
                  className="
                    group
                    inline-flex
                    min-h-[46px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-slate-700
                    shadow-sm
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-blue-300
                    hover:text-blue-600
                    hover:shadow-md
                    sm:w-auto
                  "
                >
                  <History size={17} />

                  History

                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>
            </header>

            {/* ================================================= */}
            {/* HERO / COMMAND CARD */}
            {/* ================================================= */}

            <section
              className="
                relative
                mb-6
                overflow-hidden
                rounded-[24px]
                bg-slate-950
                p-5
                text-white
                shadow-2xl
                shadow-slate-900/10
                sm:mb-8
                sm:rounded-[28px]
                sm:p-8
                lg:p-10
              "
            >
              <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

              <div
                className="
                  relative
                  grid
                  gap-7
                  lg:grid-cols-[1fr_auto]
                  lg:items-center
                "
              >
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-blue-200 sm:mb-5 sm:text-[11px] sm:tracking-[0.18em]">
                    <Sparkles size={13} />
                    AI Marketing Intelligence
                  </div>

                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Your marketing.
                    <br />
                    <span className="text-blue-400">
                      Under control.
                    </span>
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                    Apex turns your marketing data into clear
                    priorities, opportunities, and actions so
                    you always know what to do next.
                  </p>

                  <div
                    className="
                      mt-6
                      flex
                      flex-col
                      gap-3
                      sm:mt-7
                      sm:flex-row
                      sm:flex-wrap
                    "
                  >
                    <button
                      onClick={() =>
                        router.push("/health")
                      }
                      className="
                        group
                        inline-flex
                        min-h-[48px]
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-black
                        text-slate-950
                        shadow-lg
                        transition
                        hover:-translate-y-0.5
                        hover:bg-blue-50
                        sm:w-auto
                      "
                    >
                      Analyze Marketing

                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById(
                            "apex-copilot"
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                          })
                      }
                      className="
                        group
                        inline-flex
                        min-h-[48px]
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-white/15
                        bg-white/10
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-white/15
                        sm:w-auto
                      "
                    >
                      Open Copilot

                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>

                {/* HEALTH */}

                <div className="flex justify-center lg:justify-end">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-inner sm:h-40 sm:w-40">
                    <div className="absolute inset-3 rounded-full border border-blue-400/20" />

                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Health
                      </p>

                      <p className="mt-1 text-4xl font-black tracking-tight sm:text-5xl">
                        {marketingHealth ?? "--"}
                      </p>

                      <p className="text-xs font-bold text-slate-400">
                        {getHealthLabel(
                          marketingHealth
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* TODAY'S PRIORITY */}
            {/* ================================================= */}

            <section className="mb-6 sm:mb-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 sm:text-[11px] sm:tracking-[0.2em]">
                    Today
                  </p>

                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    Your next best move
                  </h2>
                </div>

                <button
                  onClick={() =>
                    router.push("/health")
                  }
                  className="hidden items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 sm:flex"
                >
                  See analysis
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm sm:rounded-[26px]">
                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    p-5
                    sm:gap-6
                    sm:p-7
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                      <Zap size={22} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600">
                          Apex Priority
                        </span>

                        {marketingHealth !== null && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                            Health {marketingHealth}/100
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-lg font-black text-slate-950 sm:text-xl">
                        {industry
                          ? `Grow ${industry} visibility`
                          : "Complete your marketing profile"}
                      </h3>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {industry
                          ? "Strengthen your local presence and customer acquisition system before spreading your budget across too many channels."
                          : "Give Apex the information it needs to identify your biggest marketing opportunity."}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push("/health")
                    }
                    className="
                      group
                      inline-flex
                      min-h-[48px]
                      w-full
                      shrink-0
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-blue-600
                      px-5
                      py-3.5
                      text-sm
                      font-black
                      text-white
                      shadow-lg
                      shadow-blue-600/20
                      transition
                      hover:-translate-y-0.5
                      hover:bg-blue-700
                      sm:w-auto
                    "
                  >
                    See Opportunity

                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* SNAPSHOT */}
            {/* ================================================= */}

            <section className="mb-6 sm:mb-8">
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[11px] sm:tracking-[0.2em]">
                  At a Glance
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  Business Snapshot
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {/* HEALTH */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 sm:text-[11px]">
                      Marketing Health
                    </span>

                    <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                      <TrendingUp size={17} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-3xl font-black text-slate-950">
                      {marketingHealth ?? "--"}
                    </span>

                    <span className="mb-1 text-sm font-bold text-slate-400">
                      /100
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-700"
                      style={{
                        width:
                          getHealthWidth(
                            marketingHealth
                          ),
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    {getHealthLabel(
                      marketingHealth
                    )}
                  </p>
                </div>

                {/* STRATEGIES */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 sm:text-[11px]">
                      Strategies
                    </span>

                    <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
                      <Sparkles size={17} />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-black text-slate-950">
                    {totalStrategies}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    {totalStrategies === 0
                      ? "Ready to create"
                      : "Strategies created"}
                  </p>
                </div>

                {/* CAMPAIGNS */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 sm:text-[11px]">
                      Campaigns
                    </span>

                    <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                      <BarChart3 size={17} />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-black text-slate-950">
                    {totalCampaigns}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Active records
                  </p>
                </div>

                {/* BUDGET */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 sm:text-[11px]">
                      Avg. Budget
                    </span>

                    <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                      <span className="text-lg font-black">
                        $
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-black text-slate-950">
                    $
                    {averageBudget.toLocaleString()}
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Monthly
                  </p>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* PERFORMANCE */}
            {/* ================================================= */}

            <section className="mb-6 sm:mb-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 sm:text-[11px] sm:tracking-[0.2em]">
                    Intelligence
                  </p>

                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    Marketing Performance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    See what's happening across your campaigns.
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push("/performance")
                  }
                  className="hidden items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 sm:flex"
                >
                  Full analytics
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="min-w-0 overflow-hidden rounded-[24px] sm:rounded-[26px]">
                <PerformanceChart />
              </div>
            </section>

            {/* ================================================= */}
            {/* QUICK WINS */}
            {/* ================================================= */}

            <section className="mb-6 sm:mb-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600 sm:text-[11px] sm:tracking-[0.2em]">
                    Next Steps
                  </p>

                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    Quick Wins
                  </h2>
                </div>

                {marketingHealth !== null && (
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                    Health {marketingHealth}/100
                  </span>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {quickWins.map(
                  (win, index) => (
                    <div
                      key={win}
                      className="
                        group
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        transition
                        duration-300
                        hover:-translate-y-1
                        hover:border-blue-300
                        hover:shadow-lg
                      "
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-600">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Priority
                          </p>

                          <p className="mt-1 text-sm font-bold leading-6 text-slate-900">
                            {win}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* ================================================= */}
            {/* APEX COPILOT */}
            {/* ================================================= */}

            <section
              id="apex-copilot"
              className="mb-6 scroll-mt-6 sm:mb-8 sm:scroll-mt-8"
            >
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600 sm:text-[11px] sm:tracking-[0.2em]">
                  Apex Intelligence
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  Your AI Marketing Advisor
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tell Apex what you want to improve.
                </p>
              </div>

              <div className="min-w-0">
                <CopilotCard
                  businessName={businessName}
                  industry={industry}
                  targetAudience={targetAudience}
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* GROWTH OPPORTUNITY */}
            {/* ================================================= */}

            <section className="mb-6 sm:mb-8">
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[11px] sm:tracking-[0.2em]">
                  Growth Center
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  Your Biggest Opportunity
                </h2>
              </div>

              <OpportunityCard
                title={
                  industry
                    ? `Grow ${industry} Visibility`
                    : "Improve Your Local Marketing"
                }
                description={
                  industry
                    ? `Apex recommends focusing on your local visibility and customer acquisition strategy. Build a stronger presence where your ${industry} customers are already searching.`
                    : "Complete your business profile so Apex can identify your biggest marketing opportunity and build a personalized growth plan."
                }
                impact="High"
                buttonText={
                  industry
                    ? "Create Growth Plan"
                    : "Set Up Business"
                }
                onClick={() => {
                  if (!industry) {
                    document
                      .getElementById(
                        "business-profile"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  } else {
                    router.push("/health");
                  }
                }}
              />
            </section>

            {/* ================================================= */}
            {/* BUSINESS PROFILE */}
            {/* ================================================= */}

            <section className="mb-6 sm:mb-8">
              <details
                id="business-profile"
                className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm sm:rounded-[26px]"
              >
                <summary
                  className="
                    flex
                    cursor-pointer
                    list-none
                    items-center
                    justify-between
                    gap-4
                    p-5
                    sm:p-7
                  "
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="shrink-0 rounded-2xl bg-slate-100 p-3 text-slate-700">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:tracking-[0.2em]">
                        Settings
                      </p>

                      <h2 className="mt-1 text-lg font-black text-slate-950 sm:text-xl">
                        Business Profile
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Update the information Apex uses.
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    className="shrink-0 text-slate-400 transition duration-300 group-open:rotate-180"
                  />
                </summary>

                <div className="border-t border-slate-100 p-5 sm:p-7">
                  {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    {/* BUSINESS NAME */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-600">
                        Business Name
                      </label>

                      <input
                        value={businessName}
                        onChange={(e) =>
                          setBusinessName(
                            e.target.value
                          )
                        }
                        className="
                          min-h-[48px]
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          text-slate-900
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:border-blue-500
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                        placeholder="Apex Roofing"
                      />
                    </div>

                    {/* INDUSTRY */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-600">
                        Industry
                      </label>

                      <input
                        value={industry}
                        onChange={(e) =>
                          setIndustry(
                            e.target.value
                          )
                        }
                        className="
                          min-h-[48px]
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          text-slate-900
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:border-blue-500
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                        placeholder="Roofing"
                      />
                    </div>

                    {/* AUDIENCE */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-600">
                        Target Audience
                      </label>

                      <input
                        value={targetAudience}
                        onChange={(e) =>
                          setTargetAudience(
                            e.target.value
                          )
                        }
                        className="
                          min-h-[48px]
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          text-slate-900
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:border-blue-500
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                        placeholder="Homeowners"
                      />
                    </div>

                    {/* BUDGET */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-600">
                        Monthly Marketing Budget
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={budget}
                        onChange={(e) =>
                          setBudget(
                            e.target.value
                          )
                        }
                        className="
                          min-h-[48px]
                          w-full
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          text-slate-900
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:border-blue-500
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                        placeholder="2500"
                      />
                    </div>
                  </div>

                  <div
                    className="
                      mt-6
                      flex
                      flex-col
                      gap-4
                      border-t
                      border-slate-100
                      pt-6
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div className="flex items-start gap-2 text-sm leading-5 text-slate-500">
                      <UserCheck2
                        size={17}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <span>
                        Apex uses this information to personalize your marketing.
                      </span>
                    </div>

                    <button
                      onClick={
                        generateStrategy
                      }
                      disabled={isGenerating}
                      className="
                        inline-flex
                        min-h-[48px]
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-slate-950
                        px-5
                        py-3.5
                        text-sm
                        font-black
                        text-white
                        shadow-lg
                        transition
                        hover:-translate-y-0.5
                        hover:bg-slate-800
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        sm:w-auto
                      "
                    >
                      <Save size={17} />

                      {isGenerating
                        ? "Generating..."
                        : "Generate Strategy"}

                      {!isGenerating && (
                        <ArrowRight size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </details>
            </section>

            {/* ================================================= */}
            {/* RECENT ACTIVITY */}
            {/* ================================================= */}

            {activityData.length > 0 && (
              <section className="mb-6 sm:mb-8">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[11px] sm:tracking-[0.2em]">
                      History
                    </p>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                      Recent Activity
                    </h2>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        "/history"
                      )
                    }
                    className="hidden items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 sm:flex"
                  >
                    View All
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div className="min-w-0 overflow-hidden">
                  <RecentActivity
                    activities={activityData}
                  />
                </div>
              </section>
            )}

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <footer className="border-t border-slate-200 pt-6">
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-between
                  gap-3
                  text-center
                  text-xs
                  text-slate-400
                  sm:flex-row
                  sm:text-left
                "
              >
                <p>
                  Apex Marketing · Your AI Chief Marketing Officer
                </p>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span>
                    All systems operational
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}