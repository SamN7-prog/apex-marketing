"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

type Post = {
  platform: string;
  title: string;
  caption: string;
  hashtags: string[];
  bestTime: string;
  cta: string;
};

export default function SocialPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generatePosts() {
    setLoading(true);
    setError("");

    const business = JSON.parse(
      localStorage.getItem("apexBusiness") || "{}"
    );

    try {
      const response = await fetch("/api/marketing/social", {
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
          data.error || "Failed to generate social posts."
        );
      }

      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyCaption(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-blue-600 font-semibold text-sm">
              APEX AI
            </p>

            <h1 className="text-4xl font-bold text-gray-900">
              Social Media Generator
            </h1>

            <p className="text-gray-500 mt-2">
              Generate high-converting AI content for your business.
            </p>
          </div>

          <button
            onClick={generatePosts}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition text-white font-bold px-6 py-3 rounded-xl"
          >
            {loading
              ? "🧠 Apex AI is creating content..."
              : "🚀 Generate 5 Posts"}
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <h2 className="text-3xl font-bold">
            AI Social Assistant
          </h2>

          <p className="text-blue-100 mt-3 leading-7">
            Apex creates engaging social media content based on your
            business, audience and industry.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 font-semibold">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-6">

          {!loading && posts.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <div className="text-6xl mb-4">
                🚀
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                Ready to Create Content
              </h2>

              <p className="text-gray-500 mt-4 leading-7 max-w-xl mx-auto">
                Generate professional social media posts customized
                for your business in seconds.
              </p>
            </div>
          )}

          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                    {post.platform}
                  </span>

                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    {post.title}
                  </h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 mb-5">
                  <p className="text-gray-700 whitespace-pre-wrap leading-8">
                    {post.caption}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">

                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs uppercase font-semibold text-green-700 mb-2">
                    Best Time
                  </p>

                  <p className="font-bold text-gray-900">
                    {post.bestTime}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 md:col-span-2">
                  <p className="text-xs uppercase font-semibold text-purple-700 mb-2">
                    Call To Action
                  </p>

                  <p className="font-semibold text-gray-900">
                    {post.cta}
                  </p>
                </div>

              </div>

              <div className="bg-blue-50 rounded-xl p-5 mb-6">
                <p className="text-xs uppercase font-semibold text-blue-700 mb-3">
                  Hashtags
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  copyCaption(
                    `${post.title}

${post.caption}

${post.hashtags.join(" ")}

${post.cta}`
                  )
                }
                className="w-full bg-green-600 hover:bg-green-700 transition text-white font-bold py-4 rounded-xl"
              >
                📋 Copy Complete Post
              </button>
            </div>
          ))}

          {loading && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-6">
                🧠
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Apex AI is Thinking...
              </h2>

              <p className="text-gray-500">
                Creating high-converting social media content...
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}