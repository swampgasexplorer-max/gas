/**
 * Dashboard Layout — shared navigation for all dashboard pages.
 * Dark theme with UFO/space aesthetic.
 */

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "🛸" },
  { href: "/dashboard/knowledge", label: "Knowledge Graph", icon: "🔬" },
  { href: "/dashboard/tasks", label: "Task Queue", icon: "⚡" },
  { href: "/dashboard/departments", label: "Departments", icon: "🏛️" },
  { href: "/dashboard/logs", label: "Activity Logs", icon: "📋" },
];

export function DashboardLayout({ children, current }: { children: ReactNode; current: string }) {
  return (
    <div className="min-h-dvh bg-void text-starlight">
      {/* Top nav bar */}
      <header className="border-b border-nebula/50 bg-nebula/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-swamp hover:text-swamp/80 transition-colors">
            <span className="text-xl">👽</span>
            <span className="hidden sm:inline">Swamp Gas Explorer</span>
            <span className="sm:hidden">SGE</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-swamp animate-pulse" />
            <span className="text-starlight/60">System Active</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:flex md:gap-6 pt-6">
        {/* Side nav */}
        <nav className="hidden md:block w-52 shrink-0" aria-label="Dashboard sections">
          <div className="space-y-1 sticky top-20">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                aria-current={current === item.href ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-swamp ${
                  current === item.href
                    ? "bg-swamp/10 text-swamp border border-swamp/30"
                    : "text-starlight/50 hover:text-starlight/80 hover:bg-nebula/80"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t border-nebula/50">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-starlight/40 hover:text-probe transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-probe"
              >
                <span>←</span>
                Back to Site
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile nav — sticky horizontal pill bar */}
        <nav
          aria-label="Dashboard sections"
          className="md:hidden sticky top-14 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto border-b border-nebula/50 bg-void/90 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-1 py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                aria-current={current === item.href ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-swamp ${
                  current === item.href
                    ? "bg-swamp/10 text-swamp border border-swamp/30"
                    : "text-starlight/50 border border-nebula/50 hover:text-starlight/80 hover:bg-nebula/80"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}

/** Reusable stat card */
export function StatCard({ label, value, sub, color = "emerald" }: {
  label: string;
  value: string | number;
  sub?: string;
  color?: "emerald" | "amber" | "blue" | "purple" | "rose" | "gray";
}) {
  const colors: Record<string, string> = {
    emerald: "border-swamp/30 bg-swamp/10",
    amber: "border-amber-800/30 bg-amber-950/20",
    blue: "border-blue-800/30 bg-blue-950/20",
    purple: "border-probe/30 bg-probe/20",
    rose: "border-rose-800/30 bg-rose-950/20",
    gray: "border-nebula/30 bg-nebula/50",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="text-xs text-starlight/60 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-starlight/40 mt-1">{sub}</div>}
    </div>
  );
}

/** Loading skeleton */
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-nebula rounded w-1/3" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-nebula rounded-xl" />
        ))}
      </div>
    </div>
  );
}
