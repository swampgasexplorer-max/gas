/**
 * Dashboard — Task Queue Monitor
 * Route: /dashboard/tasks
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DashboardLayout, StatCard } from "~/components/DashboardLayout";

// ============================================================
// SERVER FUNCTIONS
// ============================================================

const getTaskQueueData = createServerFn({ method: "GET" }).handler(async () => {
  const TASKS = "/home/team/shared/tasks";

  const allTasks: Array<{
    id: string;
    department: string;
    agent: string;
    task_type: string;
    priority: number;
    status: string;
    created_at: string;
    retries: number;
    error?: string;
  }> = [];

  const counts: Record<string, number> = { pending: 0, running: 0, completed: 0, failed: 0 };

  for (const status of ["pending", "running", "completed", "failed"] as const) {
    const dirPath = join(TASKS, status);
    if (!existsSync(dirPath)) continue;
    const files = (await readdir(dirPath)).filter(f => f.endsWith(".json"));
    counts[status] = files.length;

    for (const file of files.slice(0, 50)) {
      try {
        const data = JSON.parse(await readFile(join(dirPath, file), "utf-8"));
        allTasks.push({
          id: data.id,
          department: data.department,
          agent: data.agent,
          task_type: data.task_type,
          priority: data.priority,
          status,
          created_at: data.created_at,
          retries: data.retries ?? 0,
          error: data.error,
        });
      } catch { /* skip */ }
    }
  }

  return { tasks: allTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), counts };
});

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard/tasks")({
  loader: () => getTaskQueueData(),
  component: TaskQueuePage,
});

function TaskQueuePage() {
  const data = Route.useLoaderData();

  if (!data) return <DashboardLayout current="/dashboard/tasks"><p className="text-gray-400">Loading...</p></DashboardLayout>;

  const { tasks, counts } = data;

  const statusColors: Record<string, string> = {
    pending: "bg-amber-950 text-amber-300 border-amber-800/30",
    running: "bg-blue-950 text-blue-300 border-blue-800/30",
    completed: "bg-emerald-950 text-emerald-300 border-emerald-800/30",
    failed: "bg-rose-950 text-rose-300 border-rose-800/30",
  };

  return (
    <DashboardLayout current="/dashboard/tasks">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Task Queue Monitor</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time view of all agent tasks across the system</p>
        </div>

        {/* Status counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Pending" value={counts.pending} color="amber" />
          <StatCard label="Running" value={counts.running} color="blue" />
          <StatCard label="Completed" value={counts.completed} color="emerald" />
          <StatCard label="Failed" value={counts.failed} color="rose" />
        </div>

        {/* Task list */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p>No tasks in the queue yet.</p>
              <p className="text-sm mt-1">Tasks will appear here when agents begin processing.</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-900/30 rounded-lg px-4 py-3 border border-gray-800/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[task.status]}`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-500">P{task.priority}</span>
                        <span className="text-sm font-medium text-gray-200 truncate">{task.task_type}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span>{task.department}</span>
                        <span>·</span>
                        <span>{task.agent}</span>
                        <span>·</span>
                        <span>{new Date(task.created_at).toLocaleString()}</span>
                        {task.retries > 0 && <span className="text-amber-400">({task.retries} retries)</span>}
                      </div>
                      {task.error && (
                        <p className="text-xs text-rose-400 mt-1 truncate">{task.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
