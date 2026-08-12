import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { orgSchema, seoHead, SITE_NAME } from "~/components/SEOHead";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seoHead({
      title: `${SITE_NAME} — UFO Database, UAP Research & Evidence Archive`,
      description:
        "Explore the living UFO database. Swamp Gas Explorer is an autonomous UAP research platform that continuously discovers, cross-references, and organizes public UFO evidence, sightings, and declassified documents.",
      path: "/",
      type: "website",
      jsonLd: orgSchema(),
    }),
  }),
  component: Home,
});

const FEATURES = [
  {
    icon: "🛰️",
    title: "Autonomous Discovery",
    body: "Dozens of specialized agents scan the web 24/7 — news, FOIA releases, academic papers, forums, and multimedia — so new UFO evidence reaches the archive the day it appears.",
  },
  {
    icon: "🔗",
    title: "Cross-Referenced Knowledge Graph",
    body: "Cases aren't stored in isolation. Evidence, witnesses, locations, and documents are connected into a graph, so patterns and overlaps surface that static databases miss.",
  },
  {
    icon: "🕵️",
    title: "Transparent by Design",
    body: "Every entry links back to its source with confidence scoring and open methodology. A research archive you can audit, not a collection of claims.",
  },
];

const ARTICLES = [
  {
    href: "/blog/pentagon-uap-files",
    tag: "Declassified Documents",
    title: "Pentagon UAP Files: Every Declassified UFO Video & Document, Explained",
    desc: "FLIR, GIMBAL, GOFAST, and the AARO reports — what the Pentagon's declassified UFO videos actually show.",
  },
  {
    href: "/blog/military-ufo-encounters",
    tag: "Military Sightings",
    title: "Military UFO Encounters: Navy Pilot UAP Sightings That Changed the Debate",
    desc: "From the 2004 Nimitz tic-tac to the 2014–2015 East Coast encounters, the cases that forced the U.S. government to take UAP seriously.",
  },
  {
    href: "/blog/ufo-evidence-database",
    tag: "Research Platform",
    title: "The UFO Evidence Database: How a Living UAP Sightings Map Works",
    desc: "Why a living evidence archive beats a static list — autonomous indexing, cross-referencing, and a searchable UAP sightings map.",
  },
];

function Home() {
  return (
    <div className="min-h-dvh bg-void text-starlight">
      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 border-b border-nebula/50 bg-void/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-swamp shrink-0 whitespace-nowrap">
            <span>👽</span>
            {SITE_NAME}
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <Link to="/dashboard" className="text-starlight/70 hover:text-probe">
              Dashboard
            </Link>
            <Link to="/blog/pentagon-uap-files" className="text-starlight/70 hover:text-probe">
              Research
            </Link>
          </nav>
          <Link
            to="/dashboard"
            className="rounded-lg bg-swamp px-3 py-1.5 text-sm font-semibold text-void hover:bg-swamp/85 shrink-0 whitespace-nowrap"
          >
            Explore Database
          </Link>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-probe/20 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-swamp/40 bg-swamp/10 px-3 py-1 text-xs font-medium text-swamp">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-swamp" />
            24/7 Autonomous UAP Research · Updated Continuously
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            The Living <span className="text-swamp">UFO Database</span> for UAP Research
            &amp; Evidence
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-starlight/70 sm:text-xl">
            Swamp Gas Explorer is an autonomous research intelligence platform that
            continuously discovers, cross-references, and organizes public UFO/UAP
            evidence from across the web — into one searchable{" "}
            <strong className="text-starlight">UFO evidence archive</strong>. No static
            list. No dead links. A living intelligence agency for the topic, open to
            everyone.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-xl bg-swamp px-6 py-3 font-semibold text-void transition-colors hover:bg-swamp/85"
            >
              Explore the UFO Database →
            </Link>
            <Link
              to="/blog/pentagon-uap-files"
              className="rounded-xl border border-probe/50 px-6 py-3 font-semibold text-probe transition-colors hover:bg-probe/10"
            >
              Read the Latest Research
            </Link>
          </div>
          <p className="mt-6 text-xs text-starlight/40">
            Free to explore · Source-linked evidence · Transparent methodology
          </p>
        </div>
      </section>

      {/* ============ VALUE PROPS ============ */}
      <section className="border-t border-nebula/50 bg-nebula/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            A UFO Evidence Archive That Never Sleeps
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-starlight/60">
            Most UFO databases are frozen in time. Ours is a research operation — it
            finds, verifies, and connects evidence around the clock.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-nebula bg-void p-6 transition-colors hover:border-probe/40"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-swamp">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-starlight/70">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT'S INSIDE ============ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              What's Inside the UAP Research Archive
            </h2>
            <ul className="mt-6 space-y-4 text-starlight/80">
              {[
                ["📁", "Case files for sightings from Nimitz to the present — status, sources, and confidence scores."],
                ["🗺️", "Location intelligence: sighting patterns by region, built for a future interactive UAP sightings map."],
                ["📄", "Declassified documents, FOIA releases, and official reports, indexed and cross-linked."],
                ["🎥", "Multimedia evidence: videos, imagery, and satellite data with provenance tracked."],
                ["👤", "Witness and narrative analysis from the Psychology Division, clearly labeled as advisory."],
              ].map(([icon, text]) => (
                <li key={text} className="flex items-start gap-3">
                  <span>{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/dashboard"
            className="group relative overflow-hidden rounded-2xl border border-nebula bg-nebula/40 p-8 transition-colors hover:border-swamp/40"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-swamp/10 blur-2xl"
            />
            <p className="text-sm font-semibold uppercase tracking-widest text-probe">
              Live System
            </p>
            <p className="mt-3 text-xl font-semibold leading-snug">
              Watch the knowledge graph grow in real time on the public dashboard
            </p>
            <p className="mt-3 text-sm text-starlight/60">
              Departments, task queues, knowledge-graph nodes, and recent cases — all
              visible, all the time.
            </p>
            <span className="mt-5 inline-block font-semibold text-swamp group-hover:underline">
              Open the dashboard →
            </span>
          </Link>
        </div>
      </section>

      {/* ============ LATEST RESEARCH ============ */}
      <section className="border-t border-nebula/50 bg-nebula/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Latest UAP Research</h2>
          <p className="mt-3 max-w-2xl text-starlight/60">
            Deep dives into the evidence behind the headlines — written for researchers,
            journalists, and the curious.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {ARTICLES.map((a) => (
              <Link
                key={a.href}
                to={a.href}
                className="group flex flex-col rounded-2xl border border-nebula bg-void p-6 transition-colors hover:border-probe/50"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-probe">
                  {a.tag}
                </span>
                <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-swamp">
                  {a.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-starlight/70">
                  {a.desc}
                </p>
                <span className="mt-4 text-sm font-semibold text-swamp">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Start searching the evidence today
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-starlight/60">
          Join researchers, journalists, and enthusiasts using the most organized,
          up-to-date UFO database on the web.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-block rounded-xl bg-swamp px-8 py-3 font-semibold text-void transition-colors hover:bg-swamp/85"
        >
          Enter the UFO Database →
        </Link>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-nebula/50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-starlight/40 sm:flex-row sm:px-6">
          <span>👽 {SITE_NAME} — autonomous UAP research &amp; evidence archive</span>
          <span>Independent · Public-interest · Not affiliated with any agency</span>
        </div>
      </footer>
    </div>
  );
}
