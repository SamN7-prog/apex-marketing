"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

type AuditReport = {
  overallScore: number;
  websiteScore: number;
  seoScore: number;
  conversionScore: number;
  trustScore: number;
  mobileScore: number;

  strengths: string[];
  improvements: string[];

  revenueOpportunities: {
    title: string;
    impact: string;
  }[];
};

export default function AuditPage() {
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);

  async function analyzeWebsite() {
    if (!website) {
      alert("Enter a website.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/marketing/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          website,
        }),
      });

  if (!response.ok) { 
   const err = await response.json();
   console.log("API ERROR:", err);
   alert(JSON.stringify(err));
   return;
  }

      const data = await response.json();

      setReport(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function ScoreCard({
    title,
    score,
  }: {
    title: string;
    score: number;
  }) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <p className="text-gray-500 font-semibold">
          {title}
        </p>

        <h2 className="text-5xl font-black text-blue-600 mt-4">
          {score}
        </h2>

        <div className="bg-gray-200 h-3 rounded-full mt-5 overflow-hidden">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{
              width: `${score}%`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-5xl font-black text-blue-600">
            AI Website Audit
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Let Apex inspect your website and discover opportunities.
          </p>

          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

            <input
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="border rounded-xl p-4 w-full"
            />

            <button
              onClick={analyzeWebsite}
              disabled={loading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold"
            >
              {loading
                ? "Analyzing Website..."
                : "🌐 Analyze Website"}
            </button>

          </div>

          {!report ? (

            <div className="bg-white rounded-3xl shadow-lg mt-8 p-12 text-center">

              <div className="text-6xl">
                🌐
              </div>

              <h2 className="text-3xl font-bold mt-6">
                Ready for an AI Website Audit
              </h2>

            </div>

          ) : (

            <>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white p-8 mt-8">

                <p className="uppercase tracking-wider">
                  Overall Website Score
                </p>

                <h2 className="text-7xl font-black mt-4">
                  {report.overallScore}/100
                </h2>

              </div>

              <div className="grid lg:grid-cols-3 gap-6 mt-8">

                <ScoreCard
                  title="Website"
                  score={report.websiteScore}
                />

                <ScoreCard
                  title="SEO"
                  score={report.seoScore}
                />

                <ScoreCard
                  title="Conversions"
                  score={report.conversionScore}
                />

                <ScoreCard
                  title="Trust"
                  score={report.trustScore}
                />

                <ScoreCard
                  title="Mobile"
                  score={report.mobileScore}
                />

              </div>

              <div className="grid lg:grid-cols-2 gap-8 mt-8">

                <div className="bg-white rounded-3xl shadow-lg p-8">

                  <h2 className="text-2xl font-bold mb-6">
                    ✅ Strengths
                  </h2>

                  <ul className="space-y-4">
                    {report.strengths.map((item, index) => (
                      <li key={index}>
                        ✅ {item}
                      </li>
                    ))}
                  </ul>

                </div>

                <div className="bg-white rounded-3xl shadow-lg p-8">

                  <h2 className="text-2xl font-bold mb-6">
                    🚀 Improvements
                  </h2>

                  <ul className="space-y-4">
                    {report.improvements.map((item, index) => (
                      <li key={index}>
                        🚀 {item}
                      </li>
                    ))}
                  </ul>

                </div>

              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

                <h2 className="text-2xl font-bold mb-6">
                  💰 Revenue Opportunities
                </h2>

                <div className="space-y-5">

                  {report.revenueOpportunities.map((item, index) => (

                    <div
                      key={index}
                      className="border-l-4 border-blue-600 pl-5"
                    >

                      <p className="font-bold">
                        {item.title}
                      </p>

                      <p className="text-gray-500">
                        Impact: {item.impact}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </>

          )}

        </div>

      </main>

    </div>
  );
}