"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  Film,
  Lightbulb,
  Megaphone,
  MousePointerClick,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import { createClient } from "../../../utils/supabase/client";

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

type PerformanceAnalysis = {
  status: string;
  summary: string;
  biggestOpportunity: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  creativeRecommendation: string;
  audienceRecommendation: string;
  monitoringPlan: string[];
};

export default function CampaignPerformancePage() {
  const { id } = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const [analysis, setAnalysis] =
    useState<PerformanceAnalysis | null>(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    loadCampaign();
  }, [id]);

async function runApexAnalysis() {
  if (!campaign) return;

  setAnalyzing(true);
  setAnalysisError("");

  try {
    const response = await fetch(
      `/api/marketing/performance?campaignId=${campaign.id}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Apex failed to analyze the campaign."
      );
    }

    setAnalysis(data.analysis);
  } catch (error) {
    console.error(error);

    setAnalysisError(
      error instanceof Error
        ? error.message
        : "Apex analysis failed."
    );
  } finally {
    setAnalyzing(false);
  }
}

  useEffect(() => {
    loadCampaign();
  }, [id]);

  async function loadCampaign() {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("ad_campaigns")
        .select(
          "id, business_name, industry, target_audience, monthly_budget, strategy, facebook, google, created_at"
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Campaign load error:", error);
        return;
      }

      setCampaign(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function sendToVideoStudio() {
    if (!campaign) return;

    const videoCampaign = {
      businessName: campaign.business_name,
      industry: campaign.industry,
      targetAudience: campaign.target_audience,
      facebookAd: campaign.facebook,
      googleAd: campaign.google,
      source: "performance",
      campaignId: campaign.id,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "apexVideoCampaign",
      JSON.stringify(videoCampaign)
    );

    router.push("/video-studio");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-6xl rounded-3xl bg-white p-10 shadow-sm">
            <p className="font-semibold text-slate-500">
              Loading campaign...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-6xl text-center">

            <div className="rounded-3xl bg-white p-12 shadow-sm">

              <Megaphone
                size={52}
                className="mx-auto text-blue-600"
              />

              <h1 className="mt-5 text-3xl font-black text-slate-900">
                Campaign Not Found
              </h1>

              <p className="mt-3 text-slate-500">
                Apex couldn't find this campaign.
              </p>

              <button
                onClick={() => router.push("/performance")}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
              >
                Back to Performance
              </button>

            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* BACK */}

          <button
            onClick={() => router.push("/performance")}
            className="inline-flex items-center gap-2 font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Campaign Performance
          </button>

          {/* HERO */}

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 p-10 text-white shadow-xl">

            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                <BarChart3 size={17} />
                Campaign Intelligence
              </div>

              <h1 className="mt-4 text-5xl font-black">
                {campaign.business_name}
              </h1>

              <p className="mt-3 text-lg text-slate-300">
                {campaign.industry}
                {" • "}
                {campaign.target_audience}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                  Campaign Active
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                  Budget: $
                  {Number(
                    campaign.monthly_budget || 0
                  ).toLocaleString()}
                  /month
                </span>

              </div>

            </div>

          </section>

          {/* PERFORMANCE METRICS */}

          <section>

            <div className="mb-5">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Performance Overview
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Campaign Metrics
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <MetricCard
                icon={<Eye size={22} />}
                title="Impressions"
                value="—"
                description="Awaiting platform data"
              />

              <MetricCard
                icon={<MousePointerClick size={22} />}
                title="Clicks"
                value="—"
                description="Awaiting platform data"
              />

              <MetricCard
                icon={<Users size={22} />}
                title="Leads"
                value="—"
                description="Awaiting conversion data"
              />

              <MetricCard
                icon={<TrendingUp size={22} />}
                title="ROAS"
                value="—"
                description="Awaiting revenue data"
              />

            </div>

          </section>

          {/* APEX ANALYSIS */}

          <section className="grid gap-6 lg:grid-cols-3">

            <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">

              <div className="flex items-center gap-3">

                <div className="rounded-2xl bg-blue-50 p-3">
                  <Sparkles
                    size={24}
                    className="text-blue-600"
                  />
                </div>

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                    Apex AI
                  </p>

                  <h2 className="text-2xl font-black text-slate-900">
                    Campaign Analysis
                  </h2>

                </div>

              </div>

              <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                <div className="flex items-start gap-4">

                  <Lightbulb
                    size={24}
                    className="mt-1 shrink-0 text-blue-600"
                  />

                  <div>

                    <h3 className="text-lg font-black text-slate-900">
                      Waiting for real performance data
                    </h3>

                    <p className="mt-2 leading-7 text-slate-600">
                      Apex has the campaign strategy and creative,
                      but it needs actual advertising-platform data
                      before it can honestly determine what is working.
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <AnalysisItem
                  icon={<Target size={19} />}
                  title="Audience"
                  value={campaign.target_audience}
                />

                <AnalysisItem
                  icon={<Megaphone size={19} />}
                  title="Industry"
                  value={campaign.industry}
                />

                <AnalysisItem
                  icon={<TrendingUp size={19} />}
                  title="Budget"
                  value={`$${Number(
                    campaign.monthly_budget || 0
                  ).toLocaleString()}`}
                />

              </div>

            </div>

            {/* STATUS */}

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm">

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={24}
                  className="text-green-400"
                />

                <h2 className="text-xl font-black">
                  Campaign Ready
                </h2>

              </div>

              <p className="mt-5 leading-7 text-slate-300">
                Your campaign is saved and ready for real
                performance tracking.
              </p>

              <div className="mt-6 space-y-3">

                <StatusItem text="Campaign saved" />

                <StatusItem text="Audience defined" />

                <StatusItem text="Budget defined" />

                <StatusItem text="Creative available" />

              </div>

            </div>

          </section>

          {/* CREATIVE */}

          <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="rounded-2xl bg-indigo-600 p-4">
                  <Film
                    size={27}
                    className="text-white"
                  />
                </div>

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                    Apex Creative Studio
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Turn This Campaign Into a Video
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                    Take this campaign's audience, messaging, and
                    advertising creative directly into Video Studio.
                  </p>

                </div>

              </div>

              <button
                onClick={sendToVideoStudio}
                className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-slate-900 px-7 py-4 font-black text-white shadow-lg transition hover:bg-blue-700"
              >
                <Film size={21} />

                Open Video Studio

                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-1"
                />
              </button>

            </div>

          </section>

          {/* CAMPAIGN INFORMATION */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-slate-100 p-3">
                <Megaphone
                  size={23}
                  className="text-slate-700"
                />
              </div>

              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  Campaign Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Details Apex is currently using for this campaign.
                </p>

              </div>

            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-2">

              <InfoCard
                title="Business"
                value={campaign.business_name}
              />

              <InfoCard
                title="Industry"
                value={campaign.industry}
              />

              <InfoCard
                title="Target Audience"
                value={campaign.target_audience}
              />

              <InfoCard
                title="Monthly Budget"
                value={`$${Number(
                  campaign.monthly_budget || 0
                ).toLocaleString()}`}
              />

              <InfoCard
                title="Created"
                value={new Date(
                  campaign.created_at
                ).toLocaleDateString()}
              />

              <InfoCard
                title="Campaign ID"
                value={campaign.id}
              />

            </div>

          </section>

          {/* FUTURE ENGINE */}

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="rounded-2xl bg-blue-600 p-3">
                <Sparkles
                  size={24}
                  className="text-white"
                />
              </div>

              <div>

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  Coming Next
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Apex Optimization
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  Once Meta, Google, TikTok, or another advertising
                  platform provides real campaign metrics, Apex can
                  compare performance, identify patterns, and recommend
                  actions based on the data.
                </p>

              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>

      <p className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-4xl font-black text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
}

function AnalysisItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">

      <div className="flex items-center gap-2 text-blue-600">
        {icon}

        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {title}
        </p>
      </div>

      <p className="mt-3 truncate font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function StatusItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">

      <CheckCircle2
        size={18}
        className="shrink-0 text-green-400"
      />

      <span className="text-sm font-semibold text-slate-200">
        {text}
      </span>

    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-2 break-words font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}
function AnalysisList({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <h3 className="text-xl font-black text-slate-900">
        {title}
      </h3>

      <div className="mt-5 space-y-3">

        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 rounded-xl bg-slate-50 p-4"
          >

            <CheckCircle2
              size={19}
              className={
                positive
                  ? "mt-1 shrink-0 text-green-500"
                  : "mt-1 shrink-0 text-yellow-500"
              }
            />

            <p className="leading-6 text-slate-700">
              {item}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

function InsightCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          {icon}
        </div>

        <h3 className="text-xl font-black text-slate-900">
          {title}
        </h3>

      </div>

      <p className="mt-5 leading-7 text-slate-600">
        {text}
      </p>

    </div>
  );
}