"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { ArrowRight, Film, Sparkles } from "lucide-react";

type Ads = {
  facebook: {
    primaryText: string;
    headline: string;
    description: string;
    cta: string;
  };
  google: {
    headlines: string[];
    descriptions: string[];
    keywords: string[];
    cta: string;
  };
};

export default function AdsPage() {
  const router = useRouter();

  const [ads, setAds] = useState<Ads | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateAds() {
    setLoading(true);

    const business = JSON.parse(
      localStorage.getItem("apexBusiness") || "{}"
    );

    try {
      const response = await fetch("/api/marketing/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: business.businessName,
          industry: business.industry,
          targetAudience: business.targetAudience,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to generate ads."
        );
      }

      setAds(data);
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function sendToVideoStudio() {
    if (!ads) return;

    const business = JSON.parse(
      localStorage.getItem("apexBusiness") || "{}"
    );

    const videoCampaign = {
      businessName: business.businessName || "",
      industry: business.industry || "",
      targetAudience: business.targetAudience || "",

      facebookAd: ads.facebook,

      googleAd: ads.google,

      source: "ads-generator",

      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "apexVideoCampaign",
      JSON.stringify(videoCampaign)
    );

    router.push("/video-studio");
  }

  async function copyAds() {
    if (!ads) return;

    const text = `
FACEBOOK AD

Primary Text:
${ads.facebook.primaryText}

Headline:
${ads.facebook.headline}

Description:
${ads.facebook.description}

CTA:
${ads.facebook.cta}

--------------------------------

GOOGLE SEARCH AD

Headlines:
${ads.google.headlines.join("\n")}

Descriptions:
${ads.google.descriptions.join("\n")}

Keywords:
${ads.google.keywords.join(", ")}

CTA:
${ads.google.cta}
`;

    await navigator.clipboard.writeText(text);

    alert("Ads copied!");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-blue-600">
              AI Ad Generator
            </h1>

            <p className="mt-2 text-gray-500">
              Create high-converting Facebook and Google Ads
              instantly.
            </p>

          </div>

          <button
            onClick={generateAds}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Generating..."
              : "🚀 Generate Ads"}
          </button>

        </div>

        {/* HERO */}

        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-xl">

          <h2 className="mb-3 text-2xl font-bold">
            Apex AI Advertising Assistant
          </h2>

          <p className="text-blue-100">
            Generate professional Facebook and Google
            advertisements in seconds.
          </p>

        </div>

        {/* EMPTY STATE */}

        {!ads && !loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg">

            <Sparkles
              size={48}
              className="mx-auto text-blue-600"
            />

            <h3 className="mb-2 mt-5 text-2xl font-bold text-gray-900">
              Ready to Generate Ads
            </h3>

            <p className="text-gray-500">
              Click{" "}
              <strong>Generate Ads</strong>{" "}
              and Apex AI will build complete ad campaigns
              for your business.
            </p>

          </div>
        )}

        {/* RESULTS */}

        {ads && (
          <div className="space-y-8">

            {/* FACEBOOK */}

            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-xl">

              <h2 className="mb-6 text-3xl font-bold text-blue-600">
                📘 Facebook Ad
              </h2>

              <div className="space-y-5">

                <div>
                  <h3 className="text-sm font-bold uppercase text-gray-500">
                    Primary Text
                  </h3>

                  <p className="whitespace-pre-wrap leading-7 text-gray-800">
                    {ads.facebook.primaryText}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase text-gray-500">
                    Headline
                  </h3>

                  <p className="text-xl font-bold text-gray-900">
                    {ads.facebook.headline}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase text-gray-500">
                    Description
                  </h3>

                  <p className="leading-7 text-gray-800">
                    {ads.facebook.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase text-gray-500">
                    CTA
                  </h3>

                  <div className="rounded-xl bg-blue-50 p-4 font-semibold text-blue-700">
                    {ads.facebook.cta}
                  </div>
                </div>

              </div>

            </div>

            {/* GOOGLE */}

            <div className="rounded-2xl bg-white p-8 text-gray-900 shadow-xl">

              <h2 className="mb-6 text-3xl font-bold text-green-600">
                🔍 Google Search Ad
              </h2>

              <div className="mb-6">

                <h3 className="mb-3 text-sm font-bold uppercase text-gray-500">
                  Headlines
                </h3>

                <ul className="ml-6 list-disc space-y-2 text-gray-900">
                  {ads.google.headlines.map(
                    (headline, index) => (
                      <li key={index}>
                        {headline}
                      </li>
                    )
                  )}
                </ul>

              </div>

              <div className="mb-6">

                <h3 className="mb-3 text-sm font-bold uppercase text-gray-500">
                  Descriptions
                </h3>

                <ul className="ml-6 list-disc space-y-2 text-gray-800">
                  {ads.google.descriptions.map(
                    (description, index) => (
                      <li key={index}>
                        {description}
                      </li>
                    )
                  )}
                </ul>

              </div>

              <div className="mb-6">

                <h3 className="mb-3 text-sm font-bold uppercase text-gray-500">
                  Keywords
                </h3>

                <div className="flex flex-wrap gap-2">

                  {ads.google.keywords.map(
                    (keyword, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-3 py-2 font-medium text-gray-900"
                      >
                        {keyword}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div>

                <h3 className="mb-2 text-sm font-bold uppercase text-gray-500">
                  CTA
                </h3>

                <div className="rounded-xl bg-green-50 p-4 font-semibold text-green-700">
                  {ads.google.cta}
                </div>

              </div>

            </div>

            {/* VIDEO BRIDGE */}

            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 p-8 text-white shadow-xl">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">

                    <Film size={18} />

                    Apex Creative Studio

                  </div>

                  <h2 className="mt-3 text-3xl font-black">
                    Turn This Ad Into a Video
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                    Take this campaign into Video Studio and
                    let Apex build the creative around your
                    advertising message.
                  </p>

                </div>

                <button
                  onClick={sendToVideoStudio}
                  className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-black text-slate-900 transition hover:bg-blue-50"
                >
                  <Film size={21} />

                  Turn Into Video

                  <ArrowRight
                    size={20}
                    className="transition group-hover:translate-x-1"
                  />
                </button>

              </div>

            </div>

            {/* COPY */}

            <button
              onClick={copyAds}
              className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700"
            >
              📋 Copy Complete Ad Campaign
            </button>

          </div>
        )}

      </main>
    </div>
  );
}