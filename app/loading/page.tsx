"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/results");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg text-center">

        <h1 className="text-3xl font-bold text-blue-600">
          🧠 Apex AI
        </h1>

        <p className="mt-4 text-gray-600">
          Analyzing your business...
        </p>

        <div className="w-full bg-gray-200 rounded-full h-4 mt-8">
          <div className="bg-blue-600 h-4 rounded-full w-3/4 animate-pulse"></div>
        </div>

        <div className="mt-8 space-y-3 text-left">
          <p>✅ Understanding your industry</p>
          <p>✅ Finding your ideal customers</p>
          <p>⏳ Building marketing strategy</p>
          <p>⏳ Calculating ad budget</p>
        </div>

      </div>
    </main>
  );
}