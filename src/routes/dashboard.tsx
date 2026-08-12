/**
 * Dashboard — Main Overview
 * Route: /dashboard
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DashboardLayout, StatCard } from "~/components/DashboardLayout";

// ============================================================
// SERVER FUNCTIONS
// ============================================================

/** Get system health & stats from the filesystem */
const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  const SHARED = "/home/team/shared";

  // Count knowledge graph entities
  const kgDirs = ["cases", "evidence", "witnesses", "organizations", "locations", "keywords", "timeline"];
  let kgNodes = 0;
  for (const dir of kgDirs) {
    const indexPath = join(SHARED, "knowledge_graph", dir, "_index.json");
    try {
      const raw = await readFile(indexPath, "utf-8");
      kgNodes += Object.keys(JSON.parse(raw)).length;
    } catch { /* skip */ }
  }

  // Count connections
  let kgEdges = 0;
  try {
    const connIndex = join(SHARED, "knowledge_graph", "connections", "_index.json");
    kgEdges = Object.keys(JSON.parse(await readFile(connIndex, "utf-8"))).length;
  } catch { /* skip */ }

  // Count tasks
  let tasksPending = 0, tasksRunning = 0;
  for (const status of ["pending", "running"] as const) {
    const dir = join(SHARED, "tasks", status);
    if (existsSync(dir)) {
      const files = (await readdir(dir)).filter(f => f.endsWith(".json"));
      if (status === "pending") tasksPending = files.length;
      else tasksRunning = files.length;
    }
  }

  // Department status
  let departments: Array<{ id: string; name: string; status: string; tasks_completed: number; active_agents: number }> = [];
  try {
    const deptRaw = await readFile(join(SHARED, "departments.json"), "utf-8");
    const deptData = JSON.parse(deptRaw);
    departments = (deptData.departments || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      status: d.status,
      tasks_completed: d.metrics?.tasks_completed ?? 0,
      active_agents: d.agents?.length ?? 0,
    }));
  } catch { /* skip */ }

  // Recent cases
  let recentCases: Array<{ id: string; title: string; date: string; status: string }> = [];
  try {
    const casesDir = join(SHARED, "knowledge_graph", "cases");
    const caseFiles = (await readdir(casesDir)).filter(f => f.endsWith(".json") && f !== "_index.json");
    const casesData = [];
    for (const file of caseFiles.slice(0, 10)) {
      try {
        const data = JSON.parse(await readFile(join(casesDir, file), "utf-8"));
        casesData.push({ id: data.id, title: data.title, date: data.date, status: data.status });
      } catch { /* skip */ }
    }
    recentCases = casesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  } catch { /* skip */ }

  return {
    health: {
      departments_active: departments.filter(d => d.status === "active").length,
      departments_total: departments.length,
      tasks_pending: tasksPending,
      tasks_running: tasksRunning,
      knowledge_graph_nodes: kgNodes,
      knowledge_graph_edges: kgEdges,
      last_updated: new Date().toISOString(),
    },
    departments,
    recentCases,
  };
});

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard")({
  loader: () => getDashboardStats(),
  component: DashboardHome,
});

function DashboardHome() {
  const data = Route.useLoaderData();
  const h = data?.health;
  const depts = data?.departments ?? [];
  const cases = data?.recentCases ?? [];

  return (
    <DashboardLayout current="/dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">System Dashboard</h1>
          <p className="text-starlight/60 text-sm mt-1">Real-time overview of the Swamp Gas Explorer autonomous research system</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="Active Departments" value={`${h?.departments_active ?? 0}/${h?.departments_total ?? 0}`} color="emerald" />
          <StatCard label="KG Nodes" value={h?.knowledge_graph_nodes ?? 0} sub="entities indexed" color="blue" />
          <StatCard label="KG Edges" value={h?.knowledge_graph_edges ?? 0} sub="connections mapped" color="purple" />
          <StatCard label="Pending Tasks" value={h?.tasks_pending ?? 0} color="amber" />
          <StatCard label="Running Tasks" value={h?.tasks_running ?? 0} color="emerald" />
          <StatCard label="Last Updated" value={h?.last_updated ? new Date(h.last_updated).toLocaleTimeString() : "—"} color="gray" />
        </div>

        {/* Department Status */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Department Status</h2>
          <div className="space-y-2">
            {depts.map((d) => (
              <div key={d.id} className="flex items-center justify-between bg-nebula/50 rounded-lg px-4 py-3 border border-nebula/60">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    d.status === "active" ? "bg-swamp animate-pulse" : "bg-starlight/25"
                  }`} />
                  <span className="font-medium text-sm">{d.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-starlight/50">
                  <span>{d.active_agents} agents</span>
                  <span>{d.tasks_completed} tasks</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    d.status === "active" ? "bg-swamp/10 text-swamp" : "bg-nebula text-starlight/40"
                  }`}>{d.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cases */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Cases in Knowledge Graph</h2>
          <div className="space-y-2">
            {cases.map((c) => (
              <div key={c.id} className="bg-nebula/50 rounded-lg px-4 py-3 border border-nebula/60">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{c.title}</h3>
                    <p className="text-xs text-starlight/50 mt-1">{c.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.status === "unexplained" ? "bg-amber-950/60 text-amber-300" :
                    c.status === "explained" ? "bg-nebula text-starlight/50" :
                    "bg-blue-950/60 text-blue-300"
                  }`}>{c.status.replace(/_/g, " ")}</span>
                </div>
              </div>
            ))}
            {cases.length === 0 && (
              <p className="text-starlight/40 text-sm">No cases indexed yet. Seed data being deployed.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
