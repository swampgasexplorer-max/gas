/**
 * Dashboard — Knowledge Graph
 * Route: /dashboard/knowledge
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

const getKnowledgeGraphData = createServerFn({ method: "GET" }).handler(async () => {
  const SHARED = "/home/team/shared";
  const KG = join(SHARED, "knowledge_graph");

  const categories = [
    { key: "cases", label: "Cases", dir: "cases" },
    { key: "evidence", label: "Evidence", dir: "evidence" },
    { key: "witnesses", label: "Witnesses", dir: "witnesses" },
    { key: "organizations", label: "Organizations", dir: "organizations" },
    { key: "locations", label: "Locations", dir: "locations" },
    { key: "keywords", label: "Keywords", dir: "keywords" },
    { key: "timeline", label: "Timeline Events", dir: "timeline" },
  ];

  const nodes: Array<{ id: string; title: string; type: string; details: string }> = [];

  for (const cat of categories) {
    const dirPath = join(KG, cat.dir);
    if (!existsSync(dirPath)) continue;
    const files = (await readdir(dirPath)).filter(f => f.endsWith(".json") && f !== "_index.json");
    for (const file of files) {
      try {
        const data = JSON.parse(await readFile(join(dirPath, file), "utf-8"));
        let details = "";
        if (data.status) details = `Status: ${data.status}`;
        else if (data.role) details = `Role: ${data.role}`;
        else if (data.type && cat.key === "organizations") details = `Type: ${data.type}`;
        else if (data.type && cat.key === "evidence") details = `Type: ${data.type}`;
        nodes.push({
          id: data.id,
          title: data.title || data.name || data.id,
          type: cat.key,
          details,
        });
      } catch { /* skip */ }
    }
  }

  // Get connections
  let connections: Array<{ source: string; target: string; relationship: string }> = [];
  try {
    const connDir = join(KG, "connections");
    const connFiles = (await readdir(connDir)).filter(f => f.endsWith(".json") && f !== "_index.json");
    for (const file of connFiles) {
      const data = JSON.parse(await readFile(join(connDir, file), "utf-8"));
      connections.push({
        source: data.source_id,
        target: data.target_id,
        relationship: data.relationship,
      });
    }
  } catch { /* skip */ }

  // Counts per category
  const counts = categories.map(cat => ({
    key: cat.key,
    label: cat.label,
    count: nodes.filter(n => n.type === cat.key).length,
  }));

  return { nodes, connections, counts, totalNodes: nodes.length, totalEdges: connections.length };
});

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard/knowledge")({
  loader: () => getKnowledgeGraphData(),
  component: KnowledgeGraphPage,
});

function KnowledgeGraphPage() {
  const data = Route.useLoaderData();

  if (!data) return <DashboardLayout current="/dashboard/knowledge"><p className="text-starlight/60">Loading...</p></DashboardLayout>;

  const { nodes, connections, counts, totalNodes, totalEdges } = data;

  // Build a map for quick node lookups
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <DashboardLayout current="/dashboard/knowledge">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Graph</h1>
          <p className="text-starlight/60 text-sm mt-1">{totalNodes} nodes · {totalEdges} connections</p>
        </div>

        {/* Category Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {counts.map(c => (
            <StatCard key={c.key} label={c.label} value={c.count} color={
              c.key === "cases" ? "emerald" :
              c.key === "evidence" ? "blue" :
              c.key === "witnesses" ? "amber" :
              c.key === "organizations" ? "purple" :
              c.key === "locations" ? "rose" :
              "gray"
            } />
          ))}
        </div>

        {/* Nodes list */}
        <div>
          <h2 className="text-lg font-semibold mb-3">All Entities ({totalNodes})</h2>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {nodes.length === 0 ? (
              <p className="text-starlight/40 text-sm">No entities in the knowledge graph yet.</p>
            ) : (
              nodes.map(node => (
                <div key={node.id} className="flex items-center justify-between bg-nebula/40 rounded px-3 py-2 text-sm border border-nebula/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-nebula text-starlight/50 uppercase shrink-0">
                      {node.type.slice(0, 4)}
                    </span>
                    <span className="truncate">{node.title}</span>
                  </div>
                  <span className="text-xs text-starlight/40 shrink-0 ml-2">{node.details}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Connections list */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Connections ({totalEdges})</h2>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {connections.length === 0 ? (
              <p className="text-starlight/40 text-sm">No connections yet.</p>
            ) : (
              connections.slice(0, 30).map((conn, i) => {
                const sourceNode = nodeMap.get(conn.source);
                const targetNode = nodeMap.get(conn.target);
                return (
                  <div key={i} className="flex items-center gap-2 bg-nebula/40 rounded px-3 py-2 text-sm border border-nebula/40">
                    <span className="text-xs text-probe shrink-0">{conn.relationship}</span>
                    <span className="text-starlight/30">·</span>
                    <span className="text-starlight/80 truncate min-w-0">{sourceNode?.title ?? conn.source}</span>
                    <span className="text-starlight/30 shrink-0">→</span>
                    <span className="text-starlight/80 truncate min-w-0">{targetNode?.title ?? conn.target}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
