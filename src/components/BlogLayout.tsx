/**
 * BlogLayout — shared shell for SEO blog posts.
 * Dark brand theme (void/nebula/swamp/probe), article typography,
 * and internal links back to the dashboard and sibling posts.
 */

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { to: "/" as const, label: "Home" },
  { to: "/dashboard" as const, label: "UFO Database" },
  { to: "/blog/pentagon-uap-files" as const, label: "Pentagon Files" },
  { to: "/blog/military-ufo-encounters" as const, label: "Military Encounters" },
  { to: "/blog/ufo-evidence-database" as const, label: "Evidence Database" },
];

export function BlogLayout({
  eyebrow,
  title,
  lede,
  publishedAt,
  tags = [],
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  publishedAt: string;
  tags?: string[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-void text-starlight">
      {/* Sticky top nav */}
      <header className="sticky top-0 z-50 border-b border-nebula/50 bg-void/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-swamp hover:text-swamp/80 shrink-0 whitespace-nowrap">
            <span>👽</span>
            <span className="hidden sm:inline">Swamp Gas Explorer</span>
            <span className="sm:hidden">SGE</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="shrink-0 whitespace-nowrap text-starlight/60 transition-colors hover:text-probe"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          to="/"
          className="text-sm text-starlight/50 transition-colors hover:text-swamp"
        >
          ← Back to home
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-probe">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-starlight/50">
          {publishedAt} · {tags.length > 0 ? tags.join(" · ") : "UAP Research"}
        </p>

        {lede && (
          <p className="mt-6 border-l-2 border-swamp/60 pl-4 text-lg leading-relaxed text-starlight/90">
            {lede}
          </p>
        )}

        <div className="article-body mt-8">{children}</div>
      </article>

      {/* Related / CTA footer */}
      <footer className="border-t border-nebula/50 bg-nebula/40">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <h2 className="text-lg font-semibold">Dig into the evidence yourself</h2>
          <p className="mt-2 text-sm text-starlight/60">
            Every case, document, and sighting on this page is indexed in the Swamp Gas
            Explorer knowledge graph — cross-referenced and searchable in real time.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg bg-swamp px-4 py-2 text-sm font-semibold text-void transition-colors hover:bg-swamp/85"
            >
              Explore the UFO Database →
            </Link>
            <Link
              to="/blog/ufo-evidence-database"
              className="rounded-lg border border-probe/50 px-4 py-2 text-sm font-semibold text-probe transition-colors hover:bg-probe/10"
            >
              How the evidence database works
            </Link>
          </div>
          <p className="mt-8 text-xs text-starlight/40">
            © {new Date().getFullYear()} Swamp Gas Explorer. Independent, public-interest
            UAP research. Not affiliated with any government agency.
          </p>
        </div>
      </footer>
    </div>
  );
}
