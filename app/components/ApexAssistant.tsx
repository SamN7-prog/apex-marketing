"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Bot,
  Check,
  Megaphone,
  Minus,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Business = {
  businessName?: string;
  industry?: string;
  targetAudience?: string;
  budget?: string | number;
};

const quickActions = [
  {
    label: "Growth Strategy",
    icon: Target,
    prompt:
      "Analyze my business and identify the single biggest growth opportunity I should focus on right now. Give me a clear action plan.",
  },
  {
    label: "Improve SEO",
    icon: Search,
    prompt:
      "Give me the most important SEO improvement my business should make right now. Explain exactly what to do.",
  },
  {
    label: "Create an Ad",
    icon: Megaphone,
    prompt:
      "Create a high-impact advertising strategy for my business. Tell me the platform, audience, offer, and messaging.",
  },
];

export default function ApexAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Apex AI. I can help you find your next best marketing move.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<Business>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedBusiness = localStorage.getItem("apexBusiness");

      if (savedBusiness) {
        setBusiness(JSON.parse(savedBusiness));
      }
    } catch (error) {
      console.error("Failed to load Apex business:", error);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(messageOverride?: string) {
    const message = messageOverride ?? input;

    if (!message.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/marketing/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `
Business Name:
${business.businessName || "Unknown"}

Industry:
${business.industry || "Unknown"}

Target Audience:
${business.targetAudience || "Unknown"}

Monthly Budget:
${business.budget || "Unknown"}

User Request:
${message}

Use the business information above when relevant.
Give specific, practical marketing advice.
Do not use emojis.
Keep the answer concise but valuable.
`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Apex AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't complete that request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickAction(prompt: string) {
    sendMessage(prompt);
  }

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING ASK APEX BUTTON                                  */}
      {/* ========================================================= */}

      <button
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        aria-label="Open Apex AI"
        className={`
          fixed
          bottom-4 right-4
          sm:bottom-6 sm:right-6
          z-[100]
          flex items-center gap-3
          rounded-full
          border border-blue-400/30
          bg-slate-950/95
          px-4 py-3
          sm:px-5 sm:py-3.5
          text-white
          shadow-2xl shadow-blue-950/40
          backdrop-blur-xl
          transition-all duration-500
          hover:-translate-y-1
          hover:border-blue-300/60
          hover:shadow-blue-900/60
          ${
            open
              ? "pointer-events-none scale-75 opacity-0"
              : "scale-100 opacity-100"
          }
        `}
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
          <Sparkles size={18} />

          <span className="absolute inset-0 animate-ping rounded-full bg-blue-400/20" />
        </span>

        <span className="text-left">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
            Apex AI
          </span>

          <span className="block text-sm font-bold">
            Ask Apex
          </span>
        </span>
      </button>

      {/* ========================================================= */}
      {/* APEX AI WINDOW                                            */}
      {/* ========================================================= */}

      <div
        className={`
          fixed
          bottom-4 right-4
          sm:bottom-6 sm:right-6
          z-[101]

          w-[calc(100vw-2rem)]
          sm:w-[410px]
          max-w-[410px]

          overflow-hidden
          rounded-[26px] sm:rounded-[28px]

          border border-white/10
          bg-slate-950/95
          text-white

          shadow-2xl shadow-blue-950/50
          backdrop-blur-2xl

          origin-bottom-right

          transition-all duration-500
          ease-[cubic-bezier(0.16,1,0.3,1)]

          ${
            !open
              ? "pointer-events-none translate-y-6 scale-90 opacity-0"
              : "translate-y-0 scale-100 opacity-100"
          }

          ${
            minimized
              ? "h-[72px]"
              : "h-[min(680px,calc(100vh-2rem))] sm:h-[min(680px,calc(100vh-3rem))]"
          }
        `}
      >
        {/* ======================================================= */}
        {/* HEADER                                                   */}
        {/* ======================================================= */}

        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 px-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Sparkles size={20} />

              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-blue-600" />
            </div>

            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                Apex Intelligence
              </p>

              <h2 className="text-lg font-black">
                Apex AI
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="rounded-xl p-2.5 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Minimize Apex AI"
            >
              {minimized ? (
                <ArrowUp size={17} />
              ) : (
                <Minus size={17} />
              )}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-2.5 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Close Apex AI"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ======================================================= */}
        {/* CONTENT                                                  */}
        {/* ======================================================= */}

        <div
          className={`
            flex h-[calc(100%-72px)] flex-col
            transition-all duration-300
            ${
              minimized
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            }
          `}
        >
          {/* ===================================================== */}
          {/* SCROLLABLE CHAT AREA                                   */}
          {/* ===================================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
            {/* =================================================== */}
            {/* GREETING — FIRST                                    */}
            {/* =================================================== */}

            {messages.length === 1 && (
              <div className="mb-5">
                <div className="mb-4 flex justify-start">
                  <div className="max-w-[92%] rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 shadow-lg shadow-blue-950/10">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                      <Bot size={13} />
                      Apex AI
                    </div>

                    <p className="text-sm leading-6 text-slate-200">
                      Hi, I'm Apex AI. I can help you find your next best marketing move.
                    </p>
                  </div>
                </div>

                {/* ================================================= */}
                {/* QUICK ACTIONS — UNDER GREETING                    */}
                {/* ================================================= */}

                <div className="mt-5">
                  <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Quick actions
                  </p>

                  <div className="grid gap-2">
                    {quickActions.map((action) => {
                      const Icon = action.icon;

                      return (
                        <button
                          key={action.label}
                          onClick={() =>
                            handleQuickAction(action.prompt)
                          }
                          disabled={loading}
                          className="
                            group
                            flex items-center gap-3
                            rounded-2xl
                            border border-white/10
                            bg-white/[0.04]
                            p-3
                            text-left

                            transition-all duration-300

                            hover:-translate-y-0.5
                            hover:border-blue-400/30
                            hover:bg-blue-500/10

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          <div className="shrink-0 rounded-xl bg-blue-500/10 p-2.5 text-blue-300 transition group-hover:bg-blue-500/20">
                            <Icon size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-white">
                              {action.label}
                            </p>

                            <p className="text-[11px] text-slate-500">
                              Ask Apex
                            </p>
                          </div>

                          <ArrowUp
                            size={15}
                            className="shrink-0 rotate-45 text-slate-600 transition group-hover:text-blue-300"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================== */}
            {/* MESSAGES                                             */}
            {/* =================================================== */}

            <div className="space-y-4">
              {messages.slice(messages.length === 1 ? 1 : 0).map(
                (message, index) => {
                  const isAssistant =
                    message.role === "assistant";

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isAssistant
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`
                          max-w-[90%]
                          rounded-2xl
                          px-4 py-3
                          text-sm
                          leading-6
                          transition-all

                          ${
                            isAssistant
                              ? "border border-white/10 bg-white/[0.06] text-slate-200"
                              : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/30"
                          }
                        `}
                      >
                        {isAssistant && (
                          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                            <Bot size={13} />
                            Apex AI
                          </div>
                        )}

                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>

                        {!isAssistant && (
                          <div className="mt-1 flex justify-end">
                            <Check
                              size={13}
                              className="text-blue-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}

              {/* ================================================= */}
              {/* PREMIUM THINKING ANIMATION                       */}
              {/* ================================================= */}

              {loading && (
                <div className="flex justify-start">
                  <div className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-white/[0.06] px-4 py-3 shadow-lg shadow-blue-950/20">
                    {/* Soft moving glow */}
                    <div className="absolute -inset-8 animate-pulse bg-blue-500/10 blur-3xl" />

                    <div className="relative flex items-center gap-3">
                      <div className="relative flex h-8 w-8 items-center justify-center">
                        <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/10" />

                        <Sparkles
                          size={16}
                          className="animate-pulse text-blue-300"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-300">
                          Apex is thinking
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />

                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />

                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ===================================================== */}
          {/* INPUT                                                  */}
          {/* ===================================================== */}

          <div className="shrink-0 border-t border-white/10 bg-slate-950/95 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 transition-all duration-300 focus-within:border-blue-400/40 focus-within:bg-white/[0.06] focus-within:shadow-lg focus-within:shadow-blue-950/20">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={loading}
                placeholder="Ask Apex..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-3 py-2.5
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-slate-600
                  disabled:opacity-50
                "
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-gradient-to-br from-blue-500 to-indigo-600
                  text-white
                  shadow-lg shadow-blue-950/30
                  transition-all duration-200
                  hover:scale-105
                  hover:shadow-blue-500/20
                  active:scale-95
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Send message"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}