import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { articleSchema, seoHead } from "~/components/SEOHead";
import { BlogLayout } from "~/components/BlogLayout";

const TITLE = "The UFO Evidence Database: How a Living UAP Sightings Map Works";
const DESCRIPTION =
  "What a UFO evidence database can do that a static archive can't: a living UAP sightings map, cross-referenced evidence, and transparent, source-linked research.";
const PATH = "/blog/ufo-evidence-database";
const PUBLISHED = "2026-07-24";

export const Route = createFileRoute("/blog/ufo-evidence-database")({
  head: () => ({
    ...seoHead({
      title: TITLE,
      description: DESCRIPTION,
      path: PATH,
      type: "article",
      jsonLd: articleSchema({
        title: TITLE,
        description: DESCRIPTION,
        path: PATH,
        publishedAt: PUBLISHED,
        section: "Research Platform",
        tags: ["UFO evidence database", "UAP sightings map", "UFO sightings", "UAP research"],
      }),
    }),
  }),
  component: UfoEvidenceDatabase,
});

function UfoEvidenceDatabase() {
  return (
    <BlogLayout
      eyebrow="Research Platform"
      title={TITLE}
      lede="A UFO database used to mean a spreadsheet of sighting reports. A modern UAP evidence database is a living system: it discovers, verifies, connects, and maps evidence as it appears."
      publishedAt={PUBLISHED}
      tags={["UFO evidence database", "UAP sightings map", "UAP research"]}
    >
      <h2>What Is a UFO Evidence Database?</h2>
      <p>
        At its simplest, a UFO evidence database stores sighting reports: when, where,
        who, and what was seen. Traditional archives like NUFORC and MUFON have done
        that for decades with mixed quality. But a database is only as useful as its
        structure. When every report links to original sources, sensor data, official
        documents, and related sightings, a flat list becomes a research tool — and
        that's the difference between an archive and a UFO evidence database built for
        actual investigation.
      </p>

      <h2>From Static Archives to Living Intelligence</h2>
      <h3>Autonomous Discovery</h3>
      <p>
        The web changes daily: new sightings, FOIA releases, academic papers, and forum
        threads. A static archive captures none of it until someone manually updates it.
        A living database runs discovery agents around the clock, so new evidence is
        indexed and linked within hours of appearing online — not months later.
      </p>
      <h3>Cross-Referencing Everything</h3>
      <p>
        The real power is in the connections. A single Navy pilot UAP sighting may
        involve a location, two witnesses, radar data, a declassified video, and an
        official report. In a knowledge-graph database, all of those become nodes with
        edges between them. Researchers can follow a thread from a 2004 incident to a
        2019 shipboard sighting in the same region — patterns a row-and-column table
        hides.
      </p>

      <h2>The UAP Sightings Map</h2>
      <h3>Location Intelligence</h3>
      <p>
        Every case carries coordinates, which makes a UAP sightings map a natural layer
        of the database. Clusters, hotspots, and repeat-visit locations become visible
        at a glance — and each marker links back to its full case file with sources
        intact. Location pages also serve a practical SEO purpose: someone searching
        "UFO sightings near [city]" gets a structured, credible answer instead of a
        forum thread.
      </p>
      <h3>Time Series and Trends</h3>
      <p>
        The same evidence can be sliced by date: sighting rates before and after major
        events like the 2021 ODNI report, seasonal patterns, and long-term trends.
        Time-series views turn a map into an analytical dashboard for researchers and
        journalists alike.
      </p>

      <h2>What's Inside the Swamp Gas Explorer Evidence Archive</h2>
      <p>
        The archive organizes evidence into case files, documents, witnesses,
        locations, and multimedia — each with provenance and a confidence score. The
        Psychology Division adds clearly-labeled advisory analysis of witness
        narratives; the Intelligence Division handles discovery and multimedia
        hunting. Every entity is source-linked and auditable, and the whole system is
        visible on a public dashboard rather than hidden behind a login.
      </p>

      <h2>Why Transparency Matters</h2>
      <p>
        UFO research has a credibility problem, and the cure is structure, not secrecy.
        When every claim in a UFO evidence database carries a source, a date, and a
        confidence score, the database becomes something researchers, journalists, and
        the public can actually use — and something the topic has never really had:
        a trustworthy, current, and open intelligence layer.
      </p>
      <p>
        See it in action:{" "}
        <Link to="/dashboard" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          explore the live dashboard
        </Link>{" "}
        and watch the knowledge graph grow. Curious how the evidence gets there in the
        first place? Read about the{" "}
        <Link to="/blog/pentagon-uap-files" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          Pentagon UAP files
        </Link>{" "}
        and the{" "}
        <Link to="/blog/military-ufo-encounters" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          military UFO encounters
        </Link>{" "}
        that populate it.
      </p>
    </BlogLayout>
  );
}
