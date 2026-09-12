"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

type Area = {
  name: string;
  score: number;
  max: number;
  status: string;
  color: string;
  description: string;
};

type Diagnosis = {
  title: string;
  description: string;
  action: string;
  priority: "High" | "Medium" | "Low";
  impact: "High" | "Medium" | "Low";
};

type HealthData = {
  analyzed: boolean;
  score: number | null;
  status?: string;
  businessName?: string;
  industry?: string;
  priority?: string;
  priorityDescription?: string;
  areas: Area[];
  diagnosis?: Diagnosis;
};

export default function HealthPage() {
  const router = useRouter();

  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHealth() {
      try {
        const response = await fetch("/api/marketing/health");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to load health."
          );
        }

        setData(result);
      } catch (error) {
        console.error("Health loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHealth();
  }, []);

  function getFixRoute(priority: string) {
    const value = priority.toLowerCase();

    if (
      value.includes("google") ||
      value.includes("search")
    ) {
      return "/ads";
    }

    if (
      value.includes("social") ||
      value.includes("facebook")
    ) {
      return "/social";
    }

    if (value.includes("email")) {
      return "/email";
    }

    if (
      value.includes("strategy") ||
      value.includes("audience")
    ) {
      return "/dashboard";
    }

    return "/dashboard";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">

            <div className="rounded-3xl bg-white p-10 shadow-sm">

              <div className="flex items-center gap-3">
                <Sparkles
                  size={22}
                  className="animate-pulse text-blue-600"
                />

                <p className="font-semibold text-slate-600">
                  Apex is analyzing your marketing...
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>
    );
  }

  if (!data?.analyzed) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">

            <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-blue-900 p-10 text-white shadow-xl">

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
                Apex Intelligence
              </p>

              <h1 className="mt-4 text-5xl font-black">
                Marketing Health
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                Apex will analyze your marketing setup and
                identify the biggest opportunities for growth.
              </p>

            </section>

            <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">

              <Activity
                size={56}
                className="mx-auto text-blue-600"
              />

              <h2 className="mt-5 text-3xl font-black text-slate-900">
                No Analysis Yet
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-slate-500">
                Generate your first marketing strategy and Apex
                will automatically analyze your business.
              </p>

              <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700"
              >
                Create Your Strategy
                <ArrowRight size={18} />
              </button>

            </div>

          </div>
        </main>
      </div>
    );
  }

  const score = data.score ?? 0;

  /*
   * Use the REAL AI diagnosis returned by the API.
   * Keep a fallback so the page never breaks if AI
   * temporarily fails.
   */
  const diagnosis: Diagnosis = data.diagnosis ?? {
    title: data.priority || "Improve Your Marketing",
    description:
      data.priorityDescription ||
      "Apex found an opportunity to improve your marketing setup.",
    action:
      "Review your marketing strategy and address the weakest area first.",
    priority: "Medium",
    impact: "Medium",
  };

  const fixRoute = getFixRoute(
    data.priority || diagnosis.title
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 p-10 text-white shadow-xl">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-blue-300">
                <Sparkles size={16} />
                Apex Intelligence
              </div>

              <h1 className="mt-4 text-5xl font-black">
                Marketing Health
              </h1>

              <p className="mt-4 text-lg text-slate-300">
                AI-powered analysis for{" "}
                <span className="font-bold text-white">
                  {data.businessName}
                </span>
              </p>

            </div>

          </section>

          {/* SCORE + PRIORITY */}

          <section className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* SCORE */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <div className="flex items-center gap-3">

                <Activity className="text-blue-600" />

                <p className="font-bold uppercase tracking-wide text-slate-400">
                  Overall Health
                </p>

              </div>

              <div className="mt-8 flex items-end gap-3">

                <span className="text-7xl font-black text-slate-900">
                  {score}
                </span>

                <span className="mb-3 text-xl font-semibold text-slate-400">
                  /100
                </span>

              </div>

              <p className="mt-3 text-2xl font-black text-blue-600">
                {data.status}
              </p>

              <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-700"
                  style={{
                    width: `${score}%`,
                  }}
                />

              </div>

            </div>

            {/* FIX THIS FIRST */}

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm lg:col-span-2">

              <div className="flex items-center gap-3">

                <Lightbulb
                  size={22}
                  className="text-yellow-300"
                />

                <p className="font-bold uppercase tracking-wide text-blue-300">
                  Fix This First
                </p>

              </div>

              <h2 className="mt-6 text-3xl font-black">
                {diagnosis.title}
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                {diagnosis.description}
              </p>

              <button
                onClick={() => router.push(fixRoute)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-500"
              >
                Fix With Apex
                <ArrowRight size={18} />
              </button>

            </div>

          </section>

          {/* AI DIAGNOSIS */}

          <section className="mt-8 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

            <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-8">

              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                <div>

                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">

                    <Sparkles size={18} />

                    Apex AI Diagnosis

                  </div>

                  <h2 className="mt-3 text-3xl font-black text-slate-900">
                    {diagnosis.title}
                  </h2>

                </div>

                <div className="flex gap-3">

                  <div className="rounded-2xl bg-red-50 px-5 py-3 text-center">

                    <p className="text-xs font-bold uppercase tracking-wide text-red-400">
                      Priority
                    </p>

                    <p className="mt-1 font-black text-red-600">
                      {diagnosis.priority}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-green-50 px-5 py-3 text-center">

                    <p className="text-xs font-bold uppercase tracking-wide text-green-500">
                      Impact
                    </p>

                    <p className="mt-1 font-black text-green-600">
                      {diagnosis.impact}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="grid gap-8 p-8 lg:grid-cols-2">

              {/* WHY */}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-blue-100 p-2">
                    <Target
                      size={20}
                      className="text-blue-600"
                    />
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    Why This Matters
                  </h3>

                </div>

                <p className="mt-4 leading-8 text-slate-600">
                  {diagnosis.description}
                </p>

              </div>

              {/* ACTION */}

              <div className="rounded-2xl border border-green-100 bg-green-50/50 p-6">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-green-100 p-2">
                    <TrendingUp
                      size={20}
                      className="text-green-600"
                    />
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    Recommended Action
                  </h3>

                </div>

                <p className="mt-4 leading-8 text-slate-600">
                  {diagnosis.action}
                </p>

              </div>

            </div>

            {/* ACTION BUTTON */}

            <div className="border-t border-slate-100 bg-slate-50 p-6">

              <button
                onClick={() => router.push(fixRoute)}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-lg font-black text-white transition hover:bg-blue-600"
              >

                <Sparkles
                  size={20}
                  className="transition group-hover:rotate-12"
                />

                Let Apex Fix This

                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-1"
                />

              </button>

            </div>

          </section>

          {/* BREAKDOWN */}

          <section className="mt-10">

            <div className="mb-5">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Apex Analysis
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Your Marketing Breakdown
              </h2>

              <p className="mt-2 text-slate-500">
                Apex evaluates the major pieces of your marketing
                foundation and identifies where you can improve.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {data.areas.map((area) => {

                const percentage =
                  (area.score / area.max) * 100;

                const isStrong =
                  area.status === "Strong";

                return (
                  <div
                    key={area.name}
                    className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="text-xl font-black text-slate-900">
                          {area.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {area.description}
                        </p>

                      </div>

                      {isStrong ? (
                        <CheckCircle2
                          className="shrink-0 text-green-500"
                          size={25}
                        />
                      ) : (
                        <AlertTriangle
                          className="shrink-0 text-yellow-500"
                          size={25}
                        />
                      )}

                    </div>

                    <div className="mt-6">

                      <div className="flex justify-between text-sm font-bold">

                        <span className="text-slate-400">
                          Health
                        </span>

                        <span className="text-slate-900">
                          {area.score}/{area.max}
                        </span>

                      </div>

                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                    <p
                      className={`mt-4 text-sm font-bold ${
                        isStrong
                          ? "text-green-600"
                          : area.status === "Opportunity"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {area.status}
                    </p>

                  </div>
                );
              })}

            </div>

          </section>

          {/* FOOTER */}

          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center">

            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-700">

              <Sparkles size={16} />

              Powered by Apex AI

            </div>

            <p className="mt-1 text-sm text-blue-600/70">
              Your diagnosis is personalized using your business
              information and current marketing health.
            </p>

          </div>

        </div>
      </main>
    </div>
  );
}