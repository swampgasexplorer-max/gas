/**
 * Dashboard — Knowledge Graph layout
 * Route: /dashboard/knowledge (layout)
 *
 * Pure layout route for the knowledge section. It renders whatever child route
 * is active via <Outlet /> and contains NO DashboardLayout of its own — every
 * child route (index list at /dashboard/knowledge, case detail at
 * /dashboard/knowledge/<case_id>) supplies its own DashboardLayout so the nav
 * bar renders exactly once per page. Same convention as /dashboard's parent
 * layout (see dashboard.tsx).
 */

import { Outlet, createFileRoute } from "@tanstack/react-router";

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard/knowledge")({
  component: KnowledgeLayoutRoute,
});

function KnowledgeLayoutRoute() {
  return <Outlet />;
}