/**
 * Dashboard — Layout
 * Route: /dashboard
 *
 * Pure layout route. It renders whatever child route is active via <Outlet />
 * and contains NO DashboardLayout and NO content of its own. Every child route
 * (index overview, knowledge graph, task queue, departments, logs) supplies its
 * own DashboardLayout, so the nav bar renders exactly once per page — wrapping
 * here too would produce duplicate nav bars. The overview content lives in
 * dashboard.index.tsx.
 */

import { Outlet, createFileRoute } from "@tanstack/react-router";

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutRoute,
});

function DashboardLayoutRoute() {
  return <Outlet />;
}
