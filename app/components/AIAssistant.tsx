"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const quickActions = {
  dashboard: [
    "Summarize my business",
    "Give me marketing ideas",
    "Create a growth plan",
    "What should I do next?",
  ],

  health: [
    "Explain my Health Score",
    "Improve my SEO",
    "Increase my Google ranking",
    "Create a 30-day plan",
  ],

  ads: [
    "Rewrite my ad",
    "Improve my headline",
    "Generate more ads",
    "Improve my CTA",
  ],

  audit: [
    "Explain these issues",
    "Fix my homepage",
    "Improve conversions",
    "Increase SEO",
  ],

  strategy: [
    "Improve this strategy",
    "Give me more ideas",
    "Make this cheaper",
    "Build a 90-day roadmap",
  ],
};

type AIAssistantProps = {
  page?: "dashboard" | "health" | "ads" | "audit" | "strategy";
};

export default function AIAssistant({
  page = "dashboard",
}: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm Apex AI. Ask me anything about marketing, advertising, SEO, social media, or growing your business.",
    },
  ]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`/api/marketing/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          page,
        }),
      });

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl border-l transform transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-16 bg-blue-600 text-white flex items-center px-6 text-xl font-bold">
          Apex AI
        </div>

        <div className="h-[calc(100%-140px)] overflow-y-auto p-5 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`rounded-2xl p-4 max-w-[90%] ${
                message.role === "assistant"
                  ? "bg-white shadow text-gray-800"
                  : "bg-blue-600 text-white ml-auto"
              }`}
            >
              {message.content}
            </div>
          ))}

          {loading && (
            <div className="bg-white shadow rounded-xl p-4 text-gray-500">
              Apex AI is thinking...
            </div>
          )}
        </div>

        <div className="absolute bottom-0 w-full border-t bg-white p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask Apex AI..."
            className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}