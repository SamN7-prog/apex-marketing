import {
  Clock3,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type Activity = {
  id: string;
  business: string;
  industry: string;
  date: string;
};

type Props = {
  activities: Activity[];
};

export default function RecentActivity({
  activities,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-slate-500">
            Your latest AI-generated marketing strategies.
          </p>

        </div>

        <Sparkles
          className="text-blue-600"
          size={24}
        />

      </div>

      <div className="mt-8 space-y-5">

        {activities.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">

            <Clock3
              className="mx-auto text-slate-400"
              size={36}
            />

            <p className="mt-4 text-slate-500">
              No strategies generated yet.
            </p>

          </div>

        )}

        {activities.map((activity) => (

          <div
            key={activity.id}
            className="group flex items-center justify-between rounded-2xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
          >

            <div>

              <h3 className="text-lg font-bold text-slate-900">
                {activity.business}
              </h3>

              <p className="mt-1 text-slate-500">
                {activity.industry}
              </p>

              <p className="mt-3 text-sm text-slate-400">
                {new Date(activity.date).toLocaleString()}
              </p>

            </div>

            <ChevronRight
              className="text-slate-400 transition group-hover:text-blue-600 group-hover:translate-x-1"
              size={24}
            />

          </div>

        ))}

      </div>

    </div>
  );
}