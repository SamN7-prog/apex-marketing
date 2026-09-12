"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Eye,
  Megaphone,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { createClient } from "../../utils/supabase/client";

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

export default function PerformancePage() {
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("ad_campaigns")
        .select(
          "id, business_name, industry, target_audience, monthly_budget, strategy, facebook, google, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Campaign performance error:", error);
        return;
      }

      setCampaigns(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const totalCampaigns = campaigns.length;

  const totalBudget = campaigns.reduce(
    (sum, campaign) =>
      sum + Number(campaign.monthly_budget || 0),
    0
  );

  function openCampaign(campaign: Campaign) {
    localStorage.setItem(
      "apexSelectedCampaign",
      JSON.stringify(campaign)
    );

    router.push(`/performance/${campaign.id}`);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                <BarChart3 size={17} />
                Apex Intelligence
              </div>

              <h1 className="mt-3 text-5xl font-black text-slate-900">
                Campaign Performance
              </h1>

              <p className="mt-3 max-w-2xl text-lg text-slate-500">
                See how your campaigns are performing and identify
                opportunities to improve.
              </p>
            </div>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
            >
              <ArrowLeft size={18} />
              Back
            </button>

          </div>

          {/* STATS */}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <StatCard
              icon={<Megaphone size={22} />}
              label="Campaigns"
              value={String(totalCampaigns)}
              description="Saved campaigns"
            />

            <StatCard
              icon={<Eye size={22} />}
              label="Impressions"
              value="—"
              description="Awaiting platform data"
            />

            <StatCard
              icon={<MousePointerClick size={22} />}
              label="Clicks"
              value="—"
              description="Awaiting platform data"
            />

            <StatCard
              icon={<Users size={22} />}
              label="Leads"
              value="—"
              description="Awaiting conversion data"
            />

          </div>

          {/* APEX ENGINE */}

          <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 p-8 text-white shadow-xl">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="rounded-2xl bg-white/10 p-4">
                  <Sparkles
                    size={28}
                    className="text-blue-300"
                  />
                </div>

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                    Apex Performance Engine
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Your campaigns are ready to be analyzed.
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                    Apex already knows your campaigns. Once real
                    advertising data is connected, this page will
                    calculate performance and generate AI recommendations.
                  </p>

                </div>

              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-4">

                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Engine Status
                </p>

                <p className="mt-1 font-black">
                  Ready
                </p>

              </div>

            </div>

          </section>

          {/* CAMPAIGNS */}

          <section>

            <div className="mb-5">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Campaign Intelligence
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Your Campaigns
              </h2>

              <p className="mt-2 text-slate-500">
                Select a campaign to view its performance workspace.
              </p>

            </div>

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="font-semibold text-slate-500">
                  Loading campaigns...
                </p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                <Megaphone
                  size={50}
                  className="mx-auto text-blue-500"
                />

                <h3 className="mt-5 text-2xl font-black text-slate-900">
                  No Campaigns Yet
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-slate-500">
                  Create your first advertising campaign and Apex
                  will begin tracking it here.
                </p>

                <button
                  onClick={() => router.push("/ads")}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
                >
                  Create Campaign
                </button>

              </div>
            ) : (
              <div className="grid gap-5">

                {campaigns.map((campaign) => (

                  <button
                    key={campaign.id}
                    onClick={() => openCampaign(campaign)}
                    className="group w-full rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                  >

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex items-center gap-3">

                          <div className="rounded-2xl bg-blue-50 p-3">
                            <Megaphone
                              size={22}
                              className="text-blue-600"
                            />
                          </div>

                          <div>

                            <h3 className="text-2xl font-black text-slate-900">
                              {campaign.business_name}
                            </h3>

                            <p className="text-sm font-semibold text-slate-400">
                              {campaign.industry}
                            </p>

                          </div>

                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3">

                          <Info
                            label="Target Audience"
                            value={campaign.target_audience}
                          />

                          <Info
                            label="Monthly Budget"
                            value={
                              campaign.monthly_budget
                                ? `$${Number(
                                    campaign.monthly_budget
                                  ).toLocaleString()}`
                                : "Not provided"
                            }
                          />

                          <Info
                            label="Created"
                            value={new Date(
                              campaign.created_at
                            ).toLocaleDateString()}
                          />

                        </div>

                      </div>

                      <div className="flex shrink-0 items-center gap-4">

                        <div className="rounded-2xl bg-slate-50 p-5 text-center">

                          <TrendingUp
                            size={22}
                            className="mx-auto text-blue-600"
                          />

                          <p className="mt-2 text-sm font-black text-slate-900">
                            View Performance
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Open campaign
                          </p>

                        </div>

                        <ArrowRight
                          size={22}
                          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                        />

                      </div>

                    </div>

                  </button>

                ))}

              </div>
            )}

          </section>

          {/* BUDGET */}

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-emerald-50 p-3">
                <TrendingUp
                  size={23}
                  className="text-emerald-600"
                />
              </div>

              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  Campaign Budget
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Combined monthly budget across your saved campaigns.
                </p>

              </div>

            </div>

            <p className="mt-6 text-5xl font-black text-slate-900">
              ${totalBudget.toLocaleString()}
            </p>

          </section>

          {/* FUTURE OPTIMIZATION */}

          <section className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

            <div className="flex items-start gap-4">

              <div className="rounded-2xl bg-blue-600 p-3">
                <Sparkles
                  size={24}
                  className="text-white"
                />
              </div>

              <div>

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  Next Generation
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Apex Optimization Engine
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  Once real platform data is connected, Apex will
                  compare campaigns, identify winners and
                  underperformers, explain what is happening, and
                  recommend what to change.
                </p>

              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 w-fit">
        {icon}
      </div>

      <p className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-400">
        {label}
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

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}