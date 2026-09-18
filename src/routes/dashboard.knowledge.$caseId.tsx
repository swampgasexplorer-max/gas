/**
 * Dashboard — Case detail dossier
 * Route: /dashboard/knowledge/<case_id>
 *
 * Full dossier for a single case: hero image, status, confidence, date, full
 * description, resolved location, witnesses (linked to their profiles), every
 * evidence item (images rendered, videos/documents/radar linked), and the
 * original source URLs. All data is resolved at runtime from the shared
 * knowledge graph in /home/team/shared/knowledge_graph.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { DashboardLayout } from "~/components/DashboardLayout";
import {
  loadKnowledgeGraph,
  resolveRefs,
  type KgCase,
  type KgEvidence,
  type KgLocation,
  type KgWitness,
} from "~/lib/kg";

// ============================================================
// SERVER FUNCTIONS
// ============================================================

const getCaseDetail = createServerFn({ method: "GET" }).handler(async ({ data: caseId }: { data: string }) => {
  const kg = await loadKnowledgeGraph();
  const c: KgCase | undefined = kg.cases[caseId];
  if (!c) return null;

  const location: (Pick<KgLocation, "name" | "coordinates">) | null = c.location
    ? kg.locations[c.location]
      ? { name: kg.locations[c.location].name, coordinates: kg.locations[c.location].coordinates }
      : null
    : null;

  const witnesses: Array<Pick<KgWitness, "id" | "name" | "role" | "credibility_notes">> =
    resolveRefs(c.witnesses, kg.witnesses).map((w) => ({
      id: w.id,
      name: w.name,
      role: w.role,
      credibility_notes: w.credibility_notes,
    }));

  const evidence: Array<Pick<KgEvidence, "id" | "type" | "url" | "source_url" | "extracted_text" | "metadata">> =
    resolveRefs(c.evidence, kg.evidence).map((e) => ({
      id: e.id,
      type: e.type,
      url: e.url,
      source_url: e.source_url,
      extracted_text: e.extracted_text,
      metadata: e.metadata,
    }));

  return {
    case: {
      id: c.id,
      title: c.title,
      description: c.description,
      date: c.date,
      status: c.status ?? null,
      confidence_score: c.confidence_score ?? null,
      sources: c.sources ?? [],
    },
    location,
    witnesses,
    evidence,
  };
});

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard/knowledge/$caseId")({
  loader: ({ params }) => getCaseDetail({ data: params.caseId }),
  notFoundComponent: () => (
    <DashboardLayout current="/dashboard/knowledge">
      <p className="text-starlight/60">Case not found.</p>
      <Link to="/dashboard/knowledge" className="text-swamp hover:underline mt-2 inline-block">← Back to Knowledge Graph</Link>
    </DashboardLayout>
  ),
  component: CaseDetailPage,
});

// ============================================================
// UI HELPERS
// ============================================================

const STATUS_STYLES: Record<string, string> = {
  unexplained: "bg-emerald-950/60 text-emerald-300 border border-emerald-700/40",
  explained: "bg-blue-950/60 text-blue-300 border border-blue-700/40",
  disputed: "bg-rose-950/60 text-rose-300 border border-rose-700/40",
  ongoing: "bg-amber-950/60 text-amber-300 border border-amber-700/40",
};

/** Icon + label styling per evidence type. */
function evidenceTypeMeta(type: string): { icon: string; label: string } {
  switch (type) {
    case "image": return { icon: "🖼️", label: "Image" };
    case "video": return { icon: "🎬", label: "Video" };
    case "audio": return { icon: "🎙️", label: "Audio" };
    case "radar": case "radar_record": return { icon: "📡", label: "Radar record" };
    default: return { icon: "📄", label: "Document" };
  }
}

function CaseDetailPage() {
  const data = Route.useLoaderData();

  if (!data) {
    return (
      <DashboardLayout current="/dashboard/knowledge">
        <p className="text-starlight/60">Case not found.</p>
        <Link to="/dashboard/knowledge" className="text-swamp hover:underline mt-2 inline-block">← Back to Knowledge Graph</Link>
      </DashboardLayout>
    );
  }

  const { case: c, location, witnesses, evidence } = data;
  const images = evidence.filter((e) => e.type === "image");
  const heroImage = images[0];
  const statusStyle = c.status ? STATUS_STYLES[c.status] ?? STATUS_STYLES.disputed : STATUS_STYLES.disputed;

  return (
    <DashboardLayout current="/dashboard/knowledge">
      <div className="space-y-6">
        {/* Back link */}
        <Link to="/dashboard/knowledge" className="text-sm text-starlight/50 hover:text-swamp transition-colors inline-flex items-center gap-1">
          ← Back to Knowledge Graph
        </Link>

        {/* Hero image */}
        {heroImage?.url && (
          <div className="rounded-xl overflow-hidden border border-nebula/50 bg-nebula/40">
            <img
              src={heroImage.url}
              alt={heroImage.extracted_text || c.title}
              className="w-full max-h-[420px] object-cover"
              loading="eager"
            />
            {heroImage.extracted_text && (
              <p className="text-xs text-starlight/50 px-4 py-2 border-t border-nebula/50">{heroImage.extracted_text}</p>
            )}
          </div>
        )}

        {/* Title + meta */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold">{c.title}</h1>
            {c.status && (
              <span className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wide ${statusStyle}`}>{c.status}</span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-starlight/60 flex-wrap">
            {c.date && <span>📅 {c.date}</span>}
            {typeof c.confidence_score === "number" && (
              <span>🎯 Confidence {Math.round(c.confidence_score * 100)}%</span>
            )}
            {location && <span>📍 {location.name}</span>}
          </div>
        </div>

        {/* Description */}
        {c.description && (
          <div className="bg-nebula/40 border border-nebula/50 rounded-xl p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-starlight/50 mb-2">Case Summary</h2>
            <p className="text-starlight/90 leading-relaxed">{c.description}</p>
          </div>
        )}

        {/* Witnesses */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Witnesses ({witnesses.length})</h2>
          {witnesses.length === 0 ? (
            <p className="text-starlight/40 text-sm">No named witnesses on file.</p>
          ) : (
            <div className="space-y-2">
              {witnesses.map((w) => (
                <div key={w.id} className="bg-nebula/40 border border-nebula/50 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <Link
                      to="/dashboard/witness/$witnessId"
                      params={{ witnessId: w.id }}
                      className="text-swamp hover:text-swamp/80 hover:underline font-medium"
                    >
                      {w.name} ↗
                    </Link>
                    {w.role && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-probe/20 text-probe border border-probe/30 uppercase tracking-wide">
                        {w.role}
                      </span>
                    )}
                  </div>
                  {w.credibility_notes && <p className="text-sm text-starlight/60 mt-1.5">{w.credibility_notes}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Evidence */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Evidence ({evidence.length})</h2>
          {evidence.length === 0 ? (
            <p className="text-starlight/40 text-sm">No evidence on file.</p>
          ) : (
            <div className="space-y-4">
              {evidence.map((e) => {
                const meta = evidenceTypeMeta(e.type);
                return (
                  <div key={e.id} className="bg-nebula/40 border border-nebula/50 rounded-xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm">{meta.icon}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-nebula text-starlight/60 uppercase tracking-wide border border-nebula/50">
                          {meta.label}
                        </span>
                        {e.source_url && (
                          <a
                            href={e.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-starlight/40 hover:text-probe transition-colors ml-auto"
                          >
                            source ↗
                          </a>
                        )}
                      </div>

                      {/* Media body */}
                      {e.type === "image" && e.url ? (
                        <a href={e.url} target="_blank" rel="noopener noreferrer" className="block">
                          <img
                            src={e.url}
                            alt={e.extracted_text || e.id}
                            className="w-full max-h-80 object-contain bg-void/60 rounded-lg"
                            loading="lazy"
                          />
                        </a>
                      ) : (
                        e.url && (
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-probe hover:text-probe/80 border border-probe/30 bg-probe/10 rounded-lg px-3 py-2 transition-colors"
                          >
                            <span>{meta.icon}</span> Open {meta.label.toLowerCase()} ↗
                          </a>
                        )
                      )}

                      {e.extracted_text && <p className="text-sm text-starlight/70 mt-3">{e.extracted_text}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sources */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Sources ({c.sources.length})</h2>
          {c.sources.length === 0 ? (
            <p className="text-starlight/40 text-sm">No sources on file.</p>
          ) : (
            <ul className="space-y-1.5">
              {c.sources.map((src) => (
                <li key={src} className="text-sm">
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-swamp hover:text-swamp/80 hover:underline break-all"
                  >
                    {src} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}