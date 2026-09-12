"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

type DayPlan = {
  day: string;
  platform: string;
  content: string;
};

type Week = {
  week: string;
  days: DayPlan[];
};

type Calendar = {
  weeks: Week[];
};

export default function CalendarPage() {
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateCalendar() {
    setLoading(true);

    const business = JSON.parse(
      localStorage.getItem("apexBusiness") || "{}"
    );

    try {
      const response = await fetch("/api/marketing/calendar", {
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
      setCalendar(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function copyCalendar() {
    if (!calendar) return;

    const text = calendar.weeks
      .map(
        (week) =>
          `${week.week}\n\n${week.days
            .map(
              (day) =>
                `${day.day}\n${day.platform}\n${day.content}`
            )
            .join("\n\n")}`
      )
      .join("\n\n====================\n\n");

    await navigator.clipboard.writeText(text);

    alert("Calendar copied!");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold text-blue-600">
              AI Content Calendar
            </h1>

            <p className="text-gray-500 mt-2">
              Generate a complete monthly content calendar in seconds.
            </p>
          </div>

          <button
            onClick={generateCalendar}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Generating..." : "📅 Generate Calendar"}
          </button>

        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8">

          <h2 className="text-2xl font-bold mb-3">
            Apex AI Content Planner
          </h2>

          <p className="text-blue-100">
            Let Apex build an entire month of marketing content for your business.
          </p>

        </div>

        {!calendar && !loading && (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Build Your Calendar
            </h3>

            <p className="text-gray-500">
              Click <strong>Generate Calendar</strong> to create your monthly marketing plan.
            </p>

          </div>

        )}

        {calendar && (

          <div className="space-y-8">

            {calendar.weeks.map((week, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 text-gray-900"
              >

                <h2 className="text-3xl font-bold text-blue-600 mb-6">
                  {week.week}
                </h2>

                <div className="space-y-4">

                  {week.days.map((day, i) => (

                    <div
                      key={i}
                      className="border rounded-xl p-5 bg-gray-50"
                    >

                      <div className="flex justify-between items-center mb-2">

                        <h3 className="font-bold text-lg">
                          {day.day}
                        </h3>

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {day.platform}
                        </span>

                      </div>

                      <p className="text-gray-700 leading-7">
                        {day.content}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            ))}

            <button
              onClick={copyCalendar}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition"
            >
              📋 Copy Full Calendar
            </button>

          </div>

        )}

      </main>
    </div>
  );
}