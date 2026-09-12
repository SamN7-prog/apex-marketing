"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

type Analysis = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  actionPlan: string[];
};

export default function CompetitorPage() {
  const [website, setWebsite] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeCompetitor() {
    if (!website) {
      alert("Please enter a competitor website.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/marketing/competitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website,
        }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="max-w-6xl mx-auto">

          <div className="mb-8">

            <h1 className="text-4xl font-bold text-blue-600">
              Competitor Analysis
            </h1>

            <p className="text-gray-500 mt-2">
              Discover strengths, weaknesses and opportunities in your competitors.
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

            <label className="font-bold text-gray-700">
              Competitor Website
            </label>

            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://competitor.com"
              className="w-full mt-3 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={analyzeCompetitor}
              disabled={loading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition"
            >
              {loading
                ? "Analyzing..."
                : "🔍 Analyze Competitor"}
            </button>

          </div>

          {!analysis && (

            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

              <div className="text-6xl mb-6">
                🏆
              </div>

              <h2 className="text-3xl font-bold">
                Ready to Analyze
              </h2>

              <p className="text-gray-500 mt-4">
                Enter any competitor's website to receive an AI-powered SWOT analysis and growth recommendations.
              </p>

            </div>

          )}

          {analysis && (

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  ✅ Strengths
                </h2>

                <ul className="space-y-3">
                  {analysis.strengths.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  ❌ Weaknesses
                </h2>

                <ul className="space-y-3">
                  {analysis.weaknesses.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  🚀 Opportunities
                </h2>

                <ul className="space-y-3">
                  {analysis.opportunities.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">
                  📈 Action Plan
                </h2>

                <ul className="space-y-3">
                  {analysis.actionPlan.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}