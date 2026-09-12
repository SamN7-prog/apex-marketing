"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import Sidebar from "../../components/Sidebar";

type Campaign = {
  id: string;
  business_name: string;
  industry: string;
  target_audience: string;
  monthly_budget: number | null;
  strategy: string | null;
  created_at: string;
};

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaign() {
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
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Failed to load campaign:", error);
      } else {
        console.log("Loaded campaign:", data);
        setCampaign(data);
      }

      setLoading(false);
    }

    loadCampaign();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xl font-semibold text-slate-600">
          Loading campaign...
        </p>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Campaign not found
          </h1>

          <button
            onClick={() => router.push("/history")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            ← Back to History
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl">

          <button
            onClick={() => router.push("/history")}
            className="mb-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow hover:bg-blue-700"
          >
            ← Back to History
          </button>

          {/* HERO */}
          <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 p-10 text-white shadow-xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
              Apex AI Strategy
            </p>

            <h1 className="mt-4 text-5xl font-black">
              {campaign.business_name}
            </h1>

            <p className="mt-3 text-xl font-semibold text-blue-200">
              {campaign.industry}
            </p>

          </section>

          {/* BUSINESS INFO */}
          <section className="mt-6 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Industry
              </p>

              <p className="mt-3 text-2xl font-black text-slate-900">
                {campaign.industry}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Target Audience
              </p>

              <p className="mt-3 text-xl font-bold text-slate-900">
                {campaign.target_audience}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Monthly Budget
              </p>

              <p className="mt-3 text-2xl font-black text-green-600">
                {campaign.monthly_budget
                  ? `$${Number(campaign.monthly_budget).toLocaleString()}`
                  : "Not provided"}
              </p>
            </div>

          </section>

          {/* STRATEGY */}
          <section className="mt-8 rounded-3xl bg-white p-10 shadow-xl">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              AI Generated Strategy
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-900">
              Growth Blueprint
            </h2>

            <div className="mt-6 border-t border-slate-200 pt-8">

              {campaign.strategy ? (
                <div className="whitespace-pre-wrap text-lg leading-8 text-slate-700">
                  {campaign.strategy}
                </div>
              ) : (
                <div className="rounded-2xl bg-red-50 p-6 text-red-600">
                  No strategy was saved for this campaign.
                </div>
              )}

            </div>

          </section>

          <p className="mt-6 text-center text-sm text-slate-400">
            Generated{" "}
            {new Date(campaign.created_at).toLocaleString()}
          </p>

        </div>
      </main>
    </div>
  );
}