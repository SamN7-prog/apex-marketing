"use client";

import { useState } from "react";
import { CheckCircle2, CircleCheckBig } from "lucide-react";

type Task = {
  title: string;
  completed: boolean;
};

export default function TasksCard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      title: "Generate today's social media post",
      completed: false,
    },
    {
      title: "Review website audit",
      completed: false,
    },
    {
      title: "Generate a new Google Ad",
      completed: false,
    },
    {
      title: "Improve SEO",
      completed: false,
    },
  ]);

  function toggleTask(index: number) {
    const updated = [...tasks];

    updated[index].completed = !updated[index].completed;

    setTasks(updated);
  }

  const completed = tasks.filter((task) => task.completed).length;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black text-slate-900">
            Today's Tasks
          </h2>

          <p className="mt-1 text-slate-500">
            Stay on track with your daily marketing goals.
          </p>

        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 font-semibold text-blue-700">
          {completed} / {tasks.length}
        </div>

      </div>

      <div className="mt-8 space-y-4">

        {tasks.map((task, index) => (

          <button
            key={index}
            onClick={() => toggleTask(index)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
          >

            <div className="flex items-center gap-4">

              {task.completed ? (
                <CheckCircle2
                  className="text-green-600"
                  size={24}
                />
              ) : (
                <CircleCheckBig
                  className="text-slate-400"
                  size={24}
                />
              )}

              <span
                className={`text-left text-lg ${
                  task.completed
                    ? "line-through text-slate-400"
                    : "text-slate-800"
                }`}
              >
                {task.title}
              </span>

            </div>

          </button>

        ))}

      </div>

    </div>
  );
}