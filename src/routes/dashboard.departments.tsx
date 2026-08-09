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

  if (!data) return <DashboardLayout current="/dashboard/departments"><p className="text-gray-400">Loading...</p></DashboardLayout>;

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
    intelligence: "border-l-emerald-500",
    psychology: "border-l-violet-500",
    creative: "border-l-pink-500",
    seo: "border-l-blue-500",
    marketing: "border-l-amber-500",
    traffic: "border-l-cyan-500",
    operations: "border-l-gray-400",
  };

  return (
    <DashboardLayout current="/dashboard/departments">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Department Registry</h1>
          <p className="text-gray-400 text-sm mt-1">{activeCount} of {departments.length} departments active</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map((dept: any) => (
            <div
              key={dept.id}
              className={`bg-gray-900/50 rounded-xl border border-gray-800/50 border-l-4 ${deptColors[dept.id] || "border-l-gray-600"} p-5`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{deptIcons[dept.id] || "🤖"}</span>
                  <h3 className="font-semibold">{dept.name}</h3>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  dept.status === "active"
                    ? "bg-emerald-950 text-emerald-300"
                    : dept.status === "provisioning"
                    ? "bg-amber-950 text-amber-300"
                    : "bg-gray-800 text-gray-500"
                }`}>
                  {dept.status}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4">{dept.description}</p>

              <div className="text-xs text-gray-500 space-y-1">
                <div><span className="text-gray-400">Director:</span> {dept.director_role}</div>
                <div><span className="text-gray-400">Agents:</span> {(dept.agents || []).join(", ") || "none"}</div>
                <div><span className="text-gray-400">Tasks completed:</span> {dept.metrics?.tasks_completed ?? 0}</div>
                <div><span className="text-gray-400">Discoveries:</span> {dept.metrics?.discoveries_made ?? 0}</div>
                <div><span className="text-gray-400">Uptime:</span> {dept.metrics?.uptime_percentage ?? 100}%</div>
              </div>
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">🏗️</p>
            <p>Department registry not found.</p>
            <p className="text-sm mt-1">Run the setup scripts to initialize departments.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
