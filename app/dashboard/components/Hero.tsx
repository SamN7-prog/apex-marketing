import { Sparkles, TrendingUp } from "lucide-react";

type HeroProps = {
  userName?: string;
  strategyCount: number;
  marketingHealth: number | null;
};

export default function Hero({
  userName = "there",
  strategyCount,
  marketingHealth,
}: HeroProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const hasAnalysis =
    strategyCount > 0 && marketingHealth !== null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-10 text-white shadow-xl">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="max-w-2xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Sparkles size={16} />
            Apex Command Center
          </div>

          <h1 className="text-5xl font-black leading-tight">
            {greeting},{" "}
            <span className="text-blue-300">
              {userName}
            </span>
            👋
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Welcome back to Apex.
            Here's your marketing briefing for today.
            Let's keep growing your business.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-5">

          {/* MARKETING HEALTH */}

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">

            <p className="text-sm uppercase tracking-wider text-slate-300">
              Marketing Health
            </p>

            <h2 className="mt-3 text-5xl font-black">
              {hasAnalysis ? marketingHealth : "—"}
            </h2>

            <p className="font-medium text-blue-300">
              {hasAnalysis
                ? "out of 100"
                : "Not analyzed yet"}
            </p>

          </div>

          {/* STRATEGIES */}

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">

            <div className="flex items-center gap-2 text-slate-300">
              <TrendingUp size={18} />

              <span className="text-sm uppercase tracking-wider">
                Strategies
              </span>
            </div>

            <h2 className="mt-3 text-5xl font-black">
              {strategyCount}
            </h2>

            <p className="font-medium text-green-300">
              {strategyCount === 0
                ? "Ready to create"
                : "Generated"}
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}