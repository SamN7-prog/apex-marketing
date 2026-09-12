import {
  BarChart3,
  Activity,
  DollarSign,
  TrendingUp,
} from "lucide-react";

type StatsGridProps = {
  strategyCount: number;
  averageBudget: number;
  marketingHealth: number | null;
  campaigns: number;
};

export default function StatsGrid({
  strategyCount,
  averageBudget,
  marketingHealth,
  campaigns,
}: StatsGridProps) {
  const hasAnalysis = marketingHealth !== null;

  const health = marketingHealth ?? 0;

  const stats = [
    {
      title: "Strategies",
      value: strategyCount,
      subtitle:
        strategyCount === 0
          ? "Ready to create"
          : "Generated",
      icon: BarChart3,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Avg Budget",
      value: `$${averageBudget.toLocaleString()}`,
      subtitle: "Monthly",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Health",
      value: hasAnalysis ? `${health}/100` : "—",
      subtitle: hasAnalysis
        ? health >= 80
          ? "Excellent"
          : health >= 60
          ? "Good"
          : health >= 40
          ? "Needs Work"
          : "Needs Attention"
        : "Not analyzed yet",
      icon: Activity,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Campaigns",
      value: campaigns,
      subtitle:
        campaigns === 0
          ? "Ready to launch"
          : "Completed",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {stat.title}
                </p>

                <h3 className="mt-3 text-4xl font-black text-slate-900">
                  {stat.value}
                </h3>

                <p className="mt-2 text-slate-500">
                  {stat.subtitle}
                </p>
              </div>

              <div className={`rounded-2xl p-4 ${stat.color}`}>
                <Icon size={28} />
              </div>
            </div>

            {/* MARKETING HEALTH PROGRESS */}
            {stat.title === "Health" && hasAnalysis && (
              <div className="mt-5">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        Math.max(health, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            )}

            {/* EMPTY HEALTH STATE */}
            {stat.title === "Health" && !hasAnalysis && (
              <div className="mt-5 h-2.5 w-full rounded-full bg-slate-100" />
            )}
          </div>
        );
      })}
    </div>
  );
}