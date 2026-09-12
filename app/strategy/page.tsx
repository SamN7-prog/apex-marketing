"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

type StrategyReport = {
  executiveSummary: string;
  seoStrategy: string[];
  socialStrategy: string[];
  paidAdvertising: string[];
  roadmap: {
    phase: string;
    task: string;
  }[];
  priorityActions: string[];
  expectedResults: string[];
};

export default function StrategyPage() {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<StrategyReport | null>(null);

  async function generateStrategy() {
    if (
      !businessName ||
      !industry ||
      !targetAudience ||
      !budget ||
      !goal
    ) {
      alert("Please complete every field.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/marketing/strategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          industry,
          targetAudience,
          budget,
          goal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate strategy.");
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

  function Card({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-5xl font-black text-blue-600">
            AI Marketing Strategy
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Let Apex AI build your complete growth strategy.
          </p>

          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

            <div className="grid md:grid-cols-2 gap-6">

              <input
                placeholder="Business Name"
                className="border rounded-xl p-4"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <input
                placeholder="Industry"
                className="border rounded-xl p-4"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />

              <input
                placeholder="Target Audience"
                className="border rounded-xl p-4"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />

              <input
                placeholder="Monthly Budget"
                className="border rounded-xl p-4"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />

              <input
                placeholder="Primary Goal"
                className="border rounded-xl p-4 md:col-span-2"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />

            </div>

            <button
              onClick={generateStrategy}
              disabled={loading}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold"
            >
              {loading
                ? "Apex AI is building your strategy..."
                : "🚀 Generate Strategy"}
            </button>

          </div>

          {!report ? (
            <div className="bg-white rounded-3xl shadow-lg p-12 mt-8 text-center">

              <div className="text-6xl mb-5">
                🧠
              </div>

              <h2 className="text-3xl font-bold">
                Ready to Build Your Strategy
              </h2>

              <p className="text-gray-500 mt-4">
                Fill out the form above and Apex AI will generate a personalized marketing strategy.
              </p>

            </div>
          ) : (
            <div className="grid gap-8 mt-8">

              <Card title="🎯 Executive Summary">
                <p>{report.executiveSummary}</p>
              </Card>

              <Card title="📈 SEO Strategy">
                <ul className="space-y-3">
                  {report.seoStrategy.map((item, index) => (
                    <li key={index}>✅ {item}</li>
                  ))}
                </ul>
              </Card>

              <Card title="📱 Social Media Strategy">
                <ul className="space-y-3">
                  {report.socialStrategy.map((item, index) => (
                    <li key={index}>✅ {item}</li>
                  ))}
                </ul>
              </Card>

              <Card title="💰 Paid Advertising">
                <ul className="space-y-3">
                  {report.paidAdvertising.map((item, index) => (
                    <li key={index}>✅ {item}</li>
                  ))}
                </ul>
              </Card>

              <Card title="⭐ Priority Actions">
                <ul className="space-y-3">
                  {report.priorityActions.map((item, index) => (
                    <li key={index}>⭐ {item}</li>
                  ))}
                </ul>
              </Card>

              <Card title="📅 90-Day Roadmap">
                <div className="space-y-5">
                  {report.roadmap.map((item, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-600 pl-5"
                    >
                      <p className="font-bold">{item.phase}</p>
                      <p>{item.task}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="📊 Expected Results">
                <ul className="space-y-3">
                  {report.expectedResults.map((item, index) => (
                    <li key={index}>📈 {item}</li>
                  ))}
                </ul>
              </Card>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}