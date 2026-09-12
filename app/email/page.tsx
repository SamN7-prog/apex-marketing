"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

type EmailCampaign = {
  subject: string;
  preview: string;
  body: string;
  cta: string;
};

export default function EmailPage() {
  const [email, setEmail] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateEmail() {
    setLoading(true);

    const business = JSON.parse(
      localStorage.getItem("apexBusiness") || "{}"
    );

    try {
      const response = await fetch("/api/marketing/email", {
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

      setEmail(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function copyEmail() {
    if (!email) return;

    const text = `Subject: ${email.subject}

Preview: ${email.preview}

${email.body}

CTA:
${email.cta}`;

    await navigator.clipboard.writeText(text);

    alert("Email copied!");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-4xl font-bold text-blue-600">
              AI Email Campaign Generator
            </h1>

            <p className="text-gray-500 mt-2">
              Generate high-converting marketing emails in seconds.
            </p>

          </div>

          <button
            onClick={generateEmail}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Generating..." : "📧 Generate Email"}
          </button>

        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8">

          <h2 className="text-2xl font-bold mb-3">
            Apex AI Email Assistant
          </h2>

          <p className="text-blue-100">
            Generate professional marketing emails personalized for your business.
          </p>

        </div>

        {!email && !loading && (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <h3 className="text-2xl font-bold mb-2">
              Ready to Create an Email
            </h3>

            <p className="text-gray-500">
              Click <strong>Generate Email</strong> and Apex AI will build a
              professional email campaign for your business.
            </p>

          </div>

        )}

        {email && (

          <div className="bg-white rounded-2xl shadow-xl p-8">

            <div className="mb-6">

              <h2 className="text-sm font-bold text-gray-400 uppercase">
                Subject Line
              </h2>

              <p className="text-2xl font-bold text-blue-600">
                {email.subject}
              </p>

            </div>

            <div className="mb-6">

              <h2 className="text-sm font-bold text-gray-400 uppercase">
                Preview Text
              </h2>

              <p className="text-gray-700">
                {email.preview}
              </p>

            </div>

            <div className="mb-6">

              <h2 className="text-sm font-bold text-gray-400 uppercase">
                Email
              </h2>

             <div className="bg-gray-50 rounded-xl p-6 text-gray-800 whitespace-pre-wrap leading-8">
              {email.body}
             </div> 

            </div>

            <div className="mb-8">

              <h2 className="text-sm font-bold text-gray-400 uppercase">
                Call To Action
              </h2>

              <div className="bg-blue-50 rounded-xl p-5 text-blue-700 font-semibold">
                {email.cta}
              </div>

            </div>

            <button
              onClick={copyEmail}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition"
            >
              📋 Copy Complete Email
            </button>

          </div>

        )}

      </main>
    </div>
  );
}