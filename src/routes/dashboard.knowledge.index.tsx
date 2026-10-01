/**
 * Dashboard — Knowledge Graph list
 * Route: /dashboard/knowledge (index)
 *
 * Browse every entity in the knowledge graph (cases, witnesses, evidence,
 * organizations, locations, keywords, timeline) with search, type filter, and
 * sort. Every case row links to its case detail page at
 * /dashboard/knowledge/<case_id>.
 */

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { DashboardLayout, StatCard } from "~/components/DashboardLayout";
import { loadKnowledgeGraph } from "~/lib/kg";

// ============================================================
// CONSTANTS
// ============================================================

const categories = [
  { key: "cases", label: "Cases", dir: "cases" },
  { key: "evidence", label: "Evidence", dir: "evidence" },
  { key: "witnesses", label: "Witnesses", dir: "witnesses" },
  { key: "organizations", label: "Organizations", dir: "organizations" },
  { key: "locations", label: "Locations", dir: "locations" },
  { key: "keywords", label: "Keywords", dir: "keywords" },
  { key: "timeline", label: "Timeline Events", dir: "timeline" },
];

// ============================================================
// SERVER FUNCTIONS
// ============================================================

const getKnowledgeGraphData = createServerFn({ method: "GET" }).handler(async () => {
  const kg = await loadKnowledgeGraph();

  const nodes: Array<{ id: string; title: string; type: string; details: string; date?: string; confidence?: number }> = [];

  for (const cat of categories) {
    const records: Record<string, unknown> = (kg as unknown as Record<string, Record<string, unknown>>)[cat.key] ?? {};
    for (const data of Object.values(records) as Array<Record<string, unknown>>) {
      let details = "";
      if (data.status) details = `Status: ${data.status}`;
      else if (data.role) details = `Role: ${data.role}`;
      else if (typeof data.type === "string") details = `Type: ${data.type}`;
      nodes.push({
        id: String(data.id),
        title: String(data.title || data.name || data.id),
        type: cat.key,
        details,
        date: data.date ? String(data.date) : data.created_at ? String(data.created_at) : undefined,
        confidence: typeof data.confidence_score === "number" ? data.confidence_score : undefined,
      });
    }
  }

  // Get connections (edges) — each JSON file in the connections dir is one edge.
  //
  // The connection files use TWO schemas and both must be readable:
  //   • New schema:    source_id / target_id / relationship (+ source_type, target_type, confidence)
  //   • Legacy schema: from / to / type (older files, e.g. cn_colares_nimitz.json)
  // Falling back to the legacy keys keeps those edges from rendering as blank rows.
  let connections: Array<{ source: string; target: string; relationship: string }> = [];
  try {
    const connDir = join("/home/team/shared/knowledge_graph", "connections");
    if (existsSync(connDir)) {
      const connFiles = (await readdir(connDir)).filter(f => f.endsWith(".json") && f !== "_index.json");
      for (const file of connFiles) {
        const data = JSON.parse(await readFile(join(connDir, file), "utf-8"));
        connections.push({
          source: data.source_id ?? data.from,
          target: data.target_id ?? data.to,
          relationship: data.relationship ?? data.type,
        });
      }
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

export const Route = createFileRoute("/dashboard/knowledge/")({
  loader: () => getKnowledgeGraphData(),
  component: KnowledgeGraphPage,
});

function KnowledgeGraphPage() {
  const data = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"default" | "date" | "confidence">("default");

  if (!data) return <DashboardLayout current="/dashboard/knowledge"><p className="text-starlight/60">Loading...</p></DashboardLayout>;

  const { nodes, connections, counts, totalNodes, totalEdges } = data;

  // Build a map for quick node lookups
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Filter + sort nodes
  const filteredNodes = nodes.filter(n => {
    const q = query.trim().toLowerCase();
    const matchesQuery = q === "" ||
      n.title.toLowerCase().includes(q) ||
      n.details.toLowerCase().includes(q) ||
      n.id.toLowerCase().includes(q);
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    return matchesQuery && matchesType;
  });

  const sortedNodes = [...filteredNodes].sort((a, b) => {
    if (sortBy === "date") return (b.date ?? "").localeCompare(a.date ?? "");
    if (sortBy === "confidence") return (b.confidence ?? -1) - (a.confidence ?? -1);
    return 0;
  });

  const typeOptions = ["all", ...categories.map(c => c.key)];

  return (
    <DashboardLayout current="/dashboard/knowledge">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Graph</h1>
            <p className="text-starlight/60 text-sm mt-1">{totalNodes} nodes · {totalEdges} connections · click a case to open its full dossier</p>
          </div>
          <Link
            to="/dashboard/gallery"
            className="text-sm px-3 py-2 rounded-lg border border-probe/30 bg-probe/20 text-probe hover:bg-probe/30 transition-colors shrink-0"
          >
            🖼️ Open Image Gallery
          </Link>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search cases, witnesses, evidence…"
            className="flex-1 bg-nebula/40 border border-nebula/60 rounded-lg px-4 py-2 text-sm text-starlight placeholder:text-starlight/40 focus:outline-none focus:border-swamp"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-nebula/40 border border-nebula/60 rounded-lg px-3 py-2 text-sm text-starlight focus:outline-none focus:border-swamp"
          >
            {typeOptions.map(t => (
              <option key={t} value={t} className="bg-nebula">{t === "all" ? "All types" : t}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="bg-nebula/40 border border-nebula/60 rounded-lg px-3 py-2 text-sm text-starlight focus:outline-none focus:border-swamp"
          >
            <option value="default" className="bg-nebula">Default order</option>
            <option value="date" className="bg-nebula">Newest first</option>
            <option value="confidence" className="bg-nebula">Highest confidence</option>
          </select>
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
          <h2 className="text-lg font-semibold mb-3">
            {query.trim() || typeFilter !== "all" ? `Results (${sortedNodes.length})` : `All Entities (${totalNodes})`}
          </h2>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {sortedNodes.length === 0 ? (
              <p className="text-starlight/40 text-sm">No entities match your search.</p>
            ) : (
              sortedNodes.map(node => (
                <div key={node.id} className="flex items-center justify-between bg-nebula/40 rounded px-3 py-2 text-sm border border-nebula/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-nebula text-starlight/50 uppercase shrink-0">
                      {node.type.slice(0, 4)}
                    </span>
                    {node.type === "cases" ? (
                      <Link
                        to="/dashboard/knowledge/$caseId"
                        params={{ caseId: node.id }}
                        className="truncate text-swamp hover:text-swamp/80 hover:underline"
                        title={`Open case dossier: ${node.title}`}
                      >
                        {node.title} ↗
                      </Link>
                    ) : (
                      <span className="truncate">{node.title}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {node.confidence !== undefined && (
                      <span className="text-xs text-starlight/40">{Math.round(node.confidence * 100)}%</span>
                    )}
                    <span className="text-xs text-starlight/40">{node.details}</span>
                  </div>
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