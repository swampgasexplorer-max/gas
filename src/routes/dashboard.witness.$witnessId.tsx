/**
 * Dashboard — Witness profile
 * Route: /dashboard/witness/<witness_id>
 *
 * Profile for a single witness: name, role, credibility notes, and every case
 * they are linked to (via related_cases), each with its date and location and
 * a link to the case dossier.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { DashboardLayout } from "~/components/DashboardLayout";
import { resolveRefs, loadKnowledgeGraph, type KgWitness } from "~/lib/kg";

// ============================================================
// SERVER FUNCTIONS
// ============================================================

const getWitnessProfile = createServerFn({ method: "GET" }).handler(async ({ data: witnessId }: { data: string }) => {
  const kg = await loadKnowledgeGraph();
  const w: KgWitness | undefined = kg.witnesses[witnessId];
  if (!w) return null;

  const cases = resolveRefs(w.related_cases, kg.cases).map((c) => {
    const loc = c.location ? kg.locations[c.location] : undefined;
    return {
      id: c.id,
      title: c.title,
      date: c.date ?? null,
      status: c.status ?? null,
      location_name: loc?.name ?? null,
      confidence_score: typeof c.confidence_score === "number" ? c.confidence_score : null,
    };
  });

  return {
    witness: {
      id: w.id,
      name: w.name,
      role: w.role ?? null,
      credibility_notes: w.credibility_notes ?? null,
    },
    cases,
  };
});

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard/witness/$witnessId")({
  loader: ({ params }) => getWitnessProfile({ data: params.witnessId }),
  notFoundComponent: () => (
    <DashboardLayout current="/dashboard/knowledge">
      <p className="text-starlight/60">Witness not found.</p>
      <Link to="/dashboard/knowledge" className="text-swamp hover:underline mt-2 inline-block">← Back to Knowledge Graph</Link>
    </DashboardLayout>
  ),
  component: WitnessProfilePage,
});

function WitnessProfilePage() {
  const data = Route.useLoaderData();

  if (!data) {
    return (
      <DashboardLayout current="/dashboard/knowledge">
        <p className="text-starlight/60">Witness not found.</p>
        <Link to="/dashboard/knowledge" className="text-swamp hover:underline mt-2 inline-block">← Back to Knowledge Graph</Link>
      </DashboardLayout>
    );
  }

  const { witness, cases } = data;

  return (
    <DashboardLayout current="/dashboard/knowledge">
      <div className="space-y-6">
        <Link to="/dashboard/knowledge" className="text-sm text-starlight/50 hover:text-swamp transition-colors inline-flex items-center gap-1">
          ← Back to Knowledge Graph
        </Link>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold">🧑‍🚀 {witness.name}</h1>
            {witness.role && (
              <span className="text-xs px-2.5 py-1 rounded-full uppercase tracking-wide bg-probe/20 text-probe border border-probe/30">
                {witness.role}
              </span>
            )}
          </div>
          <p className="text-starlight/60 text-sm mt-2">
            {cases.length} linked case{cases.length === 1 ? "" : "s"} in the archive
          </p>
        </div>

        {/* Credibility notes */}
        {witness.credibility_notes && (
          <div className="bg-nebula/40 border border-nebula/50 rounded-xl p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-starlight/50 mb-2">Credibility Notes</h2>
            <p className="text-starlight/90 leading-relaxed">{witness.credibility_notes}</p>
          </div>
        )}

        {/* Linked cases */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Linked Cases ({cases.length})</h2>
          {cases.length === 0 ? (
            <p className="text-starlight/40 text-sm">No cases linked to this witness yet.</p>
          ) : (
            <div className="space-y-2">
              {cases.map((c) => (
                <Link
                  key={c.id}
                  to="/dashboard/knowledge/$caseId"
                  params={{ caseId: c.id }}
                  className="block bg-nebula/40 border border-nebula/50 rounded-xl p-4 hover:border-swamp/40 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-swamp group-hover:text-swamp/80 font-medium">{c.title} ↗</span>
                    {c.status && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-nebula text-starlight/60 uppercase tracking-wide border border-nebula/50">
                        {c.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-starlight/50 flex-wrap">
                    {c.date && <span>📅 {c.date}</span>}
                    {c.location_name && <span>📍 {c.location_name}</span>}
                    {typeof c.confidence_score === "number" && (
                      <span>🎯 {Math.round(c.confidence_score * 100)}% confidence</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}