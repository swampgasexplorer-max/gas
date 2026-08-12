/**
 * Dashboard — Departments
 * Route: /dashboard/departments
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { DashboardLayout, StatCard } from "~/components/DashboardLayout";

// ============================================================
// SERVER FUNCTIONS
// ============================================================

const getDepartmentsData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const raw = await readFile("/home/team/shared/departments.json", "utf-8");
    const data = JSON.parse(raw);
    return {
      departments: data.departments || [],
      updated_at: data.updated_at,
    };
  } catch {
    return { departments: [], updated_at: null };
  }
});

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard/departments")({
  loader: () => getDepartmentsData(),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const data = Route.useLoaderData();

  if (!data) return <DashboardLayout current="/dashboard/departments"><p className="text-starlight/60">Loading...</p></DashboardLayout>;

  const { departments } = data;
  const activeCount = departments.filter((d: any) => d.status === "active").length;

  const deptIcons: Record<string, string> = {
    intelligence: "🌍",
    psychology: "🧠",
    creative: "🎨",
    seo: "🔍",
    marketing: "📈",
    traffic: "🚀",
    operations: "⚙️",
  };

  const deptColors: Record<string, string> = {
    intelligence: "border-l-swamp",
    psychology: "border-l-probe",
    creative: "border-l-pink-500",
    seo: "border-l-blue-500",
    marketing: "border-l-amber-500",
    traffic: "border-l-cyan-500",
    operations: "border-l-starlight/40",
  };

  return (
    <DashboardLayout current="/dashboard/departments">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Department Registry</h1>
          <p className="text-starlight/60 text-sm mt-1">{activeCount} of {departments.length} departments active</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map((dept: any) => (
            <div
              key={dept.id}
              className={`bg-nebula/50 rounded-xl border border-nebula/50 border-l-4 ${deptColors[dept.id] || "border-l-starlight/30"} p-5 transition-colors hover:border-probe/40`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{deptIcons[dept.id] || "🤖"}</span>
                  <h3 className="font-semibold">{dept.name}</h3>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  dept.status === "active"
                    ? "bg-swamp/10 text-swamp"
                    : dept.status === "provisioning"
                    ? "bg-amber-950/60 text-amber-300"
                    : "bg-nebula text-starlight/40"
                }`}>
                  {dept.status}
                </span>
              </div>

              <p className="text-sm text-starlight/60 mb-4">{dept.description}</p>

              <div className="text-xs text-starlight/40 space-y-1">
                <div><span className="text-starlight/50">Director:</span> {dept.director_role}</div>
                <div><span className="text-starlight/50">Agents:</span> {(dept.agents || []).join(", ") || "none"}</div>
                <div><span className="text-starlight/50">Tasks completed:</span> {dept.metrics?.tasks_completed ?? 0}</div>
                <div><span className="text-starlight/50">Discoveries:</span> {dept.metrics?.discoveries_made ?? 0}</div>
                <div><span className="text-starlight/50">Uptime:</span> {dept.metrics?.uptime_percentage ?? 100}%</div>
              </div>
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <div className="text-center py-12 text-starlight/40">
            <p className="text-4xl mb-3">🏗️</p>
            <p>Department registry not found.</p>
            <p className="text-sm mt-1">Run the setup scripts to initialize departments.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
