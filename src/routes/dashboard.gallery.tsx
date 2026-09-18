/**
 * Dashboard — Evidence gallery
 * Route: /dashboard/gallery
 *
 * Grid of every image (and video link) in the knowledge graph. Each tile shows
 * the media with its caption and links through to the case dossier it belongs
 * to at /dashboard/knowledge/<case_id>.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { DashboardLayout } from "~/components/DashboardLayout";
import { loadKnowledgeGraph } from "~/lib/kg";

// ============================================================
// SERVER FUNCTIONS
// ============================================================

interface GalleryItem {
  id: string;
  type: string;
  url?: string;
  extracted_text?: string;
  case_id?: string;
  case_title: string;
}

const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const kg = await loadKnowledgeGraph();

  const items: GalleryItem[] = [];
  for (const evId of kg.evidenceOrder) {
    const e = kg.evidence[evId];
    if (!e) continue;
    // Gallery shows images (rendered) and videos (linked) — the visual media.
    if (e.type !== "image" && e.type !== "video") continue;
    items.push({
      id: e.id,
      type: e.type,
      url: e.url,
      extracted_text: e.extracted_text,
      case_id: e.case_id,
      case_title: e.case_id && kg.cases[e.case_id] ? kg.cases[e.case_id].title : "Unknown case",
    });
  }

  // Group by case (stable order), not by evidence file order.
  items.sort((a, b) => (a.case_id ?? "").localeCompare(b.case_id ?? ""));

  return {
    items,
    imageCount: items.filter((i) => i.type === "image").length,
    videoCount: items.filter((i) => i.type === "video").length,
    caseCount: new Set(items.map((i) => i.case_id).filter(Boolean)).size,
  };
});

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/dashboard/gallery")({
  loader: () => getGallery(),
  component: GalleryPage,
});

function GalleryPage() {
  const data = Route.useLoaderData();

  return (
    <DashboardLayout current="/dashboard/gallery">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Evidence Gallery</h1>
          <p className="text-starlight/60 text-sm mt-1">
            {data.imageCount} images · {data.videoCount} videos · {data.caseCount} cases — click any tile to open its case dossier
          </p>
        </div>

        {data.items.length === 0 ? (
          <p className="text-starlight/40 text-sm">No visual evidence on file yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((item) => {
              const media = (
                <>
                  {item.type === "image" && item.url ? (
                    <div className="aspect-[4/3] overflow-hidden bg-void/60">
                      <img
                        src={item.url}
                        alt={item.extracted_text || item.id}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-void/60 text-4xl group-hover:scale-105 transition-transform">
                      🎬
                    </div>
                  )}
                </>
              );

              const caption = (
                <>
                  {item.extracted_text ? (
                    <p className="text-sm text-starlight/80 line-clamp-2">{item.extracted_text}</p>
                  ) : (
                    <p className="text-sm text-starlight/40 italic">No caption on file.</p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1.5 border-t border-nebula/50">
                    <span className="text-xs text-starlight/50 truncate">{item.case_title}</span>
                    {item.type === "video" && item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-probe hover:text-probe/80 shrink-0"
                      >
                        Watch ↗
                      </a>
                    )}
                    <span className="text-xs text-swamp shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">Open case ↗</span>
                  </div>
                </>
              );

              return item.case_id ? (
                <Link
                  key={item.id}
                  to="/dashboard/knowledge/$caseId"
                  params={{ caseId: item.case_id }}
                  className="rounded-xl overflow-hidden border border-nebula/50 bg-nebula/40 flex flex-col transition-colors hover:border-swamp/40 group"
                >
                  <div className="flex flex-col flex-1">
                    {media}
                    <div className="p-3 flex flex-col gap-1.5 flex-1">{caption}</div>
                  </div>
                </Link>
              ) : (
                <div key={item.id} className="rounded-xl overflow-hidden border border-nebula/50 bg-nebula/40 flex flex-col">
                  {media}
                  <div className="p-3 flex flex-col gap-1.5 flex-1">{caption}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}