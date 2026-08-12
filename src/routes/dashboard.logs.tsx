/**
 * Dashboard — Activity Logs
 * Route: /dashboard/logs
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DashboardLayout } from "~/components/DashboardLayout";

// ============================================================
// SERVER FUNCTIONS
// ============================================================

const getLogsData = createServerFn({ method: "GET" }).handler(async () => {
  const LOGS = "/home/team/shared/logs";
  const today = new Date().toISOString().slice(0, 10);

  // Get available dates
  let dates: string[] = [];
  if (existsSync(LOGS)) {
    const files = await readdir(LOGS);
    const dateSet = new Set<string>();
    for (const file of files) {
      const match = file.match(/(\d{4}-\d{2}-\d{2})/);
      if (match) dateSet.add(match[1]);
    }
    dates = Array.from(dateSet).sort().reverse();
  }

  // Get today's logs
  let entries: Array<{
    timestamp: string;
    department: string;
    agent: string;
    action: string;
    details: string;
    result: string;
    duration_ms: number;
  }> = [];

  if (existsSync(LOGS)) {
    const allFiles = await readdir(LOGS);
    const todayFiles = allFiles.filter(f => f.includes(today) && f.endsWith(".jsonl"));

    for (const file of todayFiles.slice(0, 5)) { // Limit to avoid memory pressure
      try {
        const raw = await readFile(join(LOGS, file), "utf-8");
        const lines = raw.trim().split("\n").filter(Boolean);
        const deptName = file.split("_")[0];
        for (const line of lines.slice(-50)) { // Last 50 entries per dept
          const entry = JSON.parse(line);
          entries.push({ ...entry, department: deptName });
        }
      } catch { /* skip */ }
    }
  }

  return {
    dates,
    entries: entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 100),
    totalEntries: entries.length,
    activeDate: today,
  };
});

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard/logs")({
  loader: () => getLogsData(),
  component: LogsPage,
});

function LogsPage() {
  const data = Route.useLoaderData();

  if (!data) return <DashboardLayout current="/dashboard/logs"><p className="text-starlight/60">Loading...</p></DashboardLayout>;

  const { entries, dates, totalEntries, activeDate } = data;

  const resultColors: Record<string, string> = {
    success: "text-emerald-400",
    failure: "text-rose-400",
    in_progress: "text-amber-400",
  };

  return (
    <DashboardLayout current="/dashboard/logs">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-starlight/60 text-sm mt-1">
            {totalEntries > 0
              ? `${totalEntries} entries for ${activeDate}`
              : "Agent activity logs — entries appear as departments operate"}
          </p>
        </div>

        {/* Date selector */}
        {dates.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {dates.slice(0, 7).map(d => (
              <span
                key={d}
                className={`px-3 py-1 rounded-full text-xs ${
                  d === activeDate
                    ? "bg-swamp/10 text-swamp border border-swamp/30"
                    : "bg-nebula/60 text-starlight/50 border border-nebula/50"
                }`}
              >
                {d}
              </span>
            ))}
          </div>
        )}

        {/* Log entries */}
        <div>
          {entries.length === 0 ? (
            <div className="text-center py-16 text-starlight/40">
              <p className="text-4xl mb-3">📋</p>
              <p>No activity logged yet for today.</p>
              <p className="text-sm mt-1">Logs will appear here once agents begin operations.</p>
            </div>
          ) : (
            <div className="space-y-0.5 font-mono text-xs max-h-[600px] overflow-auto">
              {entries.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5 px-3 hover:bg-nebula/50 rounded group">
                  <span className="text-starlight/30 shrink-0 w-20">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-starlight/40 shrink-0 w-16">{entry.department}</span>
                  <span className="text-starlight/40 shrink-0 w-20">{entry.agent}</span>
                  <span className="text-starlight/80 shrink-0 w-28">{entry.action}</span>
                  <span className="text-starlight/60 flex-1 truncate">{entry.details}</span>
                  <span className={`shrink-0 ${resultColors[entry.result] || "text-starlight/40"}`}>
                    {entry.result}
                  </span>
                  <span className="text-starlight/30 shrink-0 w-16 text-right">
                    {entry.duration_ms > 0 ? `${entry.duration_ms}ms` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
