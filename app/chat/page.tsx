"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <h1 className="text-lg font-bold text-gray-900">
          Opening Apex AI...
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Your Apex AI assistant is opening.
        </p>
      </div>
    </main>
  );
}