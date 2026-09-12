"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

type Campaign = {
  id: string;
  business_name: string;
  industry: string;
  target_audience: string;
  created_at: string;
};

export default function HistoryPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const response = await fetch("/api/marketing/history");

      if (!response.ok) {
        throw new Error("Failed to load history");
      }

      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
    <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-5xl font-black text-blue-600">
          Campaign History
        </h1>

        <p className="text-gray-500 mt-3 mb-8">
          Every AI campaign you've generated.
        </p>

        {loading && (
          <div className="bg-white rounded-3xl shadow-lg p-10">
            Loading...
          </div>
        )}

        {!loading && campaigns.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-10">
            No campaigns yet.
          </div>
        )}

        <div className="space-y-6">

          {campaigns.map((campaign) => (

            <Link
              key={campaign.id}
              href={`/history/${campaign.id}`}
            >

              <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition p-8 cursor-pointer">

                <div className="flex justify-between items-center">

                  <div>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      📢 Ad Campaign
                    </span>

                    <h2 className="text-3xl font-black mt-4">
                      {campaign.business_name}
                    </h2>

                    <p className="text-blue-600 font-semibold mt-2">
                      {campaign.industry}
                    </p>

                    <p className="text-gray-500 mt-4">
                      👥 {campaign.target_audience}
                    </p>

                  </div>

                  <div className="text-5xl">
                    →
                  </div>

                </div>

                <p className="text-gray-400 mt-6">
                  {new Date(campaign.created_at).toLocaleString()}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </main>
    </div>
  );
}