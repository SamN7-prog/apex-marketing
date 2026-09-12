import Link from "next/link";
import Features from "./components/Features";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">

        {/* HERO */}

        <section className="relative overflow-hidden px-6 pb-24 pt-32">

          {/* Background glow */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="relative mx-auto max-w-6xl text-center">

            <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              AI-POWERED MARKETING FOR YOUR BUSINESS
            </div>

            <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
              Your AI Marketing
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Department.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-400 sm:text-xl">
              Apex turns your business information into marketing strategies,
              ads, social content, SEO recommendations, and actionable growth
              plans — all from one place.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/dashboard"
                className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-500"
              >
                Start Growing
              </Link>

              <a
                href="#features"
                className="rounded-2xl border border-slate-700 bg-slate-900 px-8 py-4 text-lg font-bold text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                See How It Works
              </a>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Built for businesses that want to stop guessing and start growing.
            </p>

          </div>

        </section>

        {/* PRODUCT PREVIEW */}

        <section className="px-6 pb-24">

          <div className="mx-auto max-w-6xl">

            <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-950/30">

              {/* Browser bar */}

              <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">

                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />

                <div className="ml-4 flex-1 rounded-lg bg-slate-800 px-4 py-2 text-left text-xs text-slate-500">
                  app.apexmarketing.ai/dashboard
                </div>

              </div>

              {/* Dashboard preview */}

              <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-[1.4fr_0.6fr]">

                <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 p-7">

                  <div className="text-sm font-semibold text-blue-200">
                    APEX COMMAND CENTER
                  </div>

                  <h2 className="mt-3 text-3xl font-black">
                    Your marketing.
                    <br />
                    Under control.
                  </h2>

                  <p className="mt-4 max-w-xl leading-7 text-blue-100">
                    See your marketing health, strategies, priorities, and
                    AI recommendations from one dashboard.
                  </p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Marketing Health
                    </p>

                    <p className="mt-2 text-4xl font-black">
                      84
                      <span className="ml-2 text-sm font-semibold text-emerald-400">
                        / 100
                      </span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      AI Strategies
                    </p>

                    <p className="mt-2 text-4xl font-black">
                      4
                    </p>

                    <p className="mt-1 text-sm text-emerald-400">
                      Generated
                    </p>
                  </div>

                </div>

              </div>

              {/* AI preview */}

              <div className="border-t border-slate-800 p-6 md:p-10">

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>

                      <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                        Apex Intelligence
                      </div>

                      <h3 className="mt-2 text-2xl font-black">
                        Daily Marketing Briefing
                      </h3>

                      <p className="mt-2 max-w-2xl text-slate-400">
                        Apex identifies the most important marketing
                        opportunity and gives you a clear action to take.
                      </p>

                    </div>

                    <div className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950">
                      Build This For Me →
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* VALUE PROPOSITION */}

        <section className="border-y border-slate-900 bg-slate-950 px-6 py-24">

          <div className="mx-auto max-w-5xl text-center">

            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-400">
              One platform
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Your entire marketing operation.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Stop jumping between different tools and wondering what to do
              next. Apex gives you one place to plan, create, and improve your
              marketing.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  title: "SEO",
                  description: "Find opportunities to improve your visibility.",
                },
                {
                  title: "Ads",
                  description: "Create campaigns designed around your business.",
                },
                {
                  title: "Social",
                  description: "Generate content your audience can actually use.",
                },
                {
                  title: "Growth",
                  description: "Turn marketing data into your next move.",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:-translate-y-1 hover:border-blue-500/40"
                >

                  <h3 className="text-xl font-black">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section id="features" className="bg-white text-slate-950">

          <Features />

        </section>

        {/* CTA */}

        <section className="bg-slate-950 px-6 py-24">

          <div className="mx-auto max-w-4xl rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-center shadow-2xl shadow-blue-950/40 md:p-16">

            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100">
              Stop guessing
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Start growing with Apex.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Give your business an AI marketing department that is ready to
              help you make smarter marketing decisions.
            </p>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-black text-blue-700 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
            >
              Get Started →
            </Link>

          </div>

        </section>

        {/* PRICING */}

        <section className="bg-white text-slate-950">

          <Pricing />

        </section>

      </main>
    </>
  );
}