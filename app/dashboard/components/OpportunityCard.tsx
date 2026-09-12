import { ArrowRight, Lightbulb, Sparkles } from "lucide-react";

type OpportunityCardProps = {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  buttonText: string;
  onClick?: () => void;
};

export default function OpportunityCard({
  title,
  description,
  impact,
  buttonText,
  onClick,
}: OpportunityCardProps) {
  const impactColor =
    impact === "High"
      ? "bg-green-100 text-green-700"
      : impact === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-blue-100 p-3">
            <Lightbulb className="text-blue-600" size={24} />
          </div>

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Biggest Opportunity
            </p>

            <h2 className="mt-1 text-3xl font-black text-slate-900">
              {title}
            </h2>

          </div>

        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${impactColor}`}
        >
          {impact} Impact
        </div>

      </div>

      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-between">

        <div className="flex items-center gap-2 text-blue-600 font-semibold">

          <Sparkles size={18} />

          AI Recommendation

        </div>

        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          {buttonText}

          <ArrowRight size={18} />
        </button>

      </div>

    </div>
  );
}