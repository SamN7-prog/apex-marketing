"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../../utils/supabase/client";

import {
  LayoutDashboard,
  Target,
  Megaphone,
  HeartPulse,
  Globe,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Strategy",
    href: "/results",
    icon: Target,
  },
  {
    name: "Ads",
    href: "/ads",
    icon: Megaphone,
  },
  {
    name: "Health",
    href: "/health",
    icon: HeartPulse,
  },
  {
    name: "Website Audit",
    href: "/audit",
    icon: Globe,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FolderOpen,
  },
  {
    name: "AI Coach",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* =========================
          MOBILE TOP BAR
      ========================== */}

      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#070b14]/95 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Sparkles size={18} className="text-white" />
          </div>

          <div>
            <p className="text-sm font-black tracking-tight text-white">
              APEX
            </p>

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Marketing OS
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/[0.1] hover:text-white"
        >
          <Menu size={21} />
        </button>
      </div>

      {/* =========================
          MOBILE BACKDROP
      ========================== */}

      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[290px]
          flex-col
          border-r
          border-white/10
          bg-[#070b14]
          text-white
          shadow-2xl
          transition-transform
          duration-300
          ease-out

          lg:static
          lg:min-h-screen
          lg:w-72
          lg:translate-x-0
          lg:shadow-none

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* BRAND */}

        <div className="border-b border-white/10 px-7 py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Sparkles size={21} className="text-white" />
              </div>

              <div>
                <h1 className="text-xl font-black tracking-tight">
                  APEX
                </h1>

                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Marketing OS
                </p>
              </div>
            </div>

            {/* MOBILE CLOSE */}

            <button
              onClick={closeMobileMenu}
              aria-label="Close navigation"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Workspace
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-white/15"
                        : "bg-white/[0.03] group-hover:bg-white/[0.07]"
                    }`}
                  >
                    <Icon size={19} />
                  </div>

                  <span className="text-sm font-semibold">
                    {item.name}
                  </span>
                </div>

                {active && (
                  <ChevronRight
                    size={16}
                    className="text-white/70"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* AI CTA */}

        <div className="hidden px-4 pb-4 lg:block">
          <div className="overflow-hidden rounded-2xl border border-blue-400/10 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/15 p-2">
                <Sparkles
                  size={16}
                  className="text-blue-300"
                />
              </div>

              <span className="text-xs font-bold text-blue-200">
                APEX AI
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-white">
              Need a growth move?
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Ask your AI marketing advisor what to do next.
            </p>

            <Link
              href="/chat"
              onClick={closeMobileMenu}
              className="mt-3 flex items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-white/[0.1]"
            >
              Open AI Coach
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="border-t border-white/10 p-4">
          <Link
            href="/settings"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
              pathname.startsWith("/settings")
                ? "bg-white/[0.07] text-white"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Settings size={19} />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}