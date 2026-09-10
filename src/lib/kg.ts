/**
 * Knowledge Graph loader — shared server-side data access layer.
 *
 * The knowledge graph lives OUTSIDE the repo at
 * /home/team/shared/knowledge_graph/ as flat JSON files (one per entity, plus a
 * `_index.json` per directory). It is READ-ONLY here — nothing in this module
 * ever writes to it.
 *
 * IMPORTANT: this module uses node:fs and must ONLY ever be imported from
 * server function handlers (or other server-side code). TanStack Start strips
 * server function bodies from the client bundle, so importing this from a
 * route's `.handler()` is safe — never import it directly from a React
 * component body.
 */

import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

// ============================================================
// TYPES (mirror the JSON schema in /home/team/shared/knowledge_graph)
// ============================================================

export interface KgCase {
  id: string;
  title: string;
  description: string;
  date?: string;
  /** ref id into the locations dir */
  location?: string;
  /** array of ref ids into the witnesses dir */
  witnesses?: string[];
  /** array of ref ids into the evidence dir */
  evidence?: string[];
  /** array of raw source URLs */
  sources?: string[];
  confidence_score?: number;
  status?: "unexplained" | "explained" | "disputed" | "ongoing" | string;
  created_at?: string;
  updated_at?: string;
}

export interface KgWitness {
  id: string;
  name: string;
  role?: string;
  credibility_notes?: string;
  /** array of case ids */
  related_cases?: string[];
}

export interface KgEvidence {
  id: string;
  type: string; // "image" | "video" | "report" | "radar" | ...
  url?: string;
  source_url?: string;
  case_id?: string;
  hash?: string;
  extracted_text?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface KgLocation {
  id: string;
  name: string;
  coordinates?: { lat: number; lng: number };
  related_cases?: string[];
}

/** Full knowledge graph snapshot returned by the loader. */
export interface KgData {
  cases: Record<string, KgCase>;
  witnesses: Record<string, KgWitness>;
  evidence: Record<string, KgEvidence>;
  locations: Record<string, KgLocation>;
  /** other entity types (organizations, keywords, timeline events) */
  organizations: Record<string, Record<string, unknown>>;
  keywords: Record<string, Record<string, unknown>>;
  timeline: Record<string, Record<string, unknown>>;
  /** stable id ordering, taken from each dir's _index.json */
  caseOrder: string[];
  witnessOrder: string[];
  evidenceOrder: string[];
  locationOrder: string[];
}

// ============================================================
// LOADER
// ============================================================

const SHARED = "/home/team/shared";
const KG_DIR = join(SHARED, "knowledge_graph");

/**
 * Read one entity directory into { id -> entity } plus a stable id order
 * derived from the directory's _index.json (falls back to readdir order).
 */
async function readDir(
  dir: string,
): Promise<{ map: Record<string, unknown>; order: string[] }> {
  const dirPath = join(KG_DIR, dir);
  const map: Record<string, unknown> = {};
  let order: string[] = [];

  if (!existsSync(dirPath)) return { map, order };

  // Prefer the canonical ordering from _index.json.
  try {
    const idx = JSON.parse(await readFile(join(dirPath, "_index.json"), "utf-8"));
    if (Array.isArray(idx)) order = idx.map((x) => x?.id).filter(Boolean);
  } catch { /* no index — fall back below */ }

  const files = (await readdir(dirPath)).filter(
    (f) => f.endsWith(".json") && f !== "_index.json",
  );
  for (const file of files) {
    try {
      const data = JSON.parse(await readFile(join(dirPath, file), "utf-8"));
      if (data && typeof data.id === "string") map[data.id] = data;
    } catch { /* skip malformed file */ }
  }

  if (order.length === 0) order = Object.keys(map);
  return { map, order };
}

/**
 * Load the entire knowledge graph (all cases, witnesses, evidence, locations).
 * Reads from disk on every call — cheap for the current dataset and always
 * reflects the latest data written by the Intelligence agents.
 */
export async function loadKnowledgeGraph(): Promise<KgData> {
  const [cases, witnesses, evidence, locations, organizations, keywords, timeline] =
    await Promise.all([
      readDir("cases"),
      readDir("witnesses"),
      readDir("evidence"),
      readDir("locations"),
      readDir("organizations"),
      readDir("keywords"),
      readDir("timeline"),
    ]);

  return {
    cases: cases.map as Record<string, KgCase>,
    witnesses: witnesses.map as Record<string, KgWitness>,
    evidence: evidence.map as Record<string, KgEvidence>,
    locations: locations.map as Record<string, KgLocation>,
    organizations: organizations.map as Record<string, Record<string, unknown>>,
    keywords: keywords.map as Record<string, Record<string, unknown>>,
    timeline: timeline.map as Record<string, Record<string, unknown>>,
    caseOrder: cases.order,
    witnessOrder: witnesses.order,
    evidenceOrder: evidence.order,
    locationOrder: locations.order,
  };
}

// ============================================================
// RESOLUTION HELPERS (used inside server handlers)
// ============================================================

/** Resolve a list of ref ids against a map, skipping missing refs. */
export function resolveRefs<T>(
  refs: string[] | undefined,
  map: Record<string, T>,
): T[] {
  if (!refs) return [];
  const out: T[] = [];
  for (const ref of refs) {
    const entity = map[ref];
    if (entity) out.push(entity);
  }
  return out;
}