/**
 * SEOHead — shared SEO utilities for Swamp Gas Explorer.
 *
 * Everything a page needs to be discoverable, in one place:
 *  - `seoHead()`  — head() config for a route: title, meta description, canonical,
 *                   Open Graph, Twitter cards, and optional JSON-LD structured data.
 *  - `articleSchema()` — schema.org Article JSON-LD builder for blog posts.
 *  - `orgSchema()`     — schema.org Organization JSON-LD for the landing page.
 *  - `JsonLd`     — inline `<script type="application/ld+json">` component
 *                   (useful when structured data must live in the body).
 *
 * Usage in a route:
 *   export const Route = createFileRoute("/about")({
 *     head: () => ({
 *       ...seoHead({
 *         title: "...",
 *         description: "...",
 *         path: "/about",
 *         type: "website",
 *         jsonLd: orgSchema(),
 *       }),
 *     }),
 *     component: About,
 *   });
 */

import type { LinkDescriptor, MetaDescriptor } from "@tanstack/react-router";

/**
 * Production origin used for canonical URLs and Open Graph.
 * TODO: swap for the real production domain when the site goes live
 * (SITE.md — `bun run go-live`). Keeping it centralized makes that a one-line change.
 */
export const SITE_URL = "https://swampgasexplorer.com";
export const SITE_NAME = "Swamp Gas Explorer";

/** Fallback OG image — add a branded /public/og-cover.png before go-live. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.png`;

export interface SEOOptions {
  /** <title> — aim for ~60 chars, keyword near the front. */
  title: string;
  /** Meta description — aim for ~150-160 chars with the primary keyword. */
  description: string;
  /** URL path of the page, e.g. "/blog/pentagon-uap-files". */
  path: string;
  /** Open Graph type. */
  type?: "website" | "article";
  /** Absolute OG image URL. Falls back to DEFAULT_OG_IMAGE. */
  image?: string;
  /** Optional JSON-LD structured data injected into the head. */
  jsonLd?: Record<string, unknown>;
}

/**
 * Returns `meta` + `links` objects to spread into a route's `head()`.
 * Includes: title, description, robots, canonical, Open Graph, and Twitter cards.
 */
export function seoHead(opts: SEOOptions) {
  const url = `${SITE_URL}${opts.path}`;
  const image = opts.image ?? DEFAULT_OG_IMAGE;

  const meta: MetaDescriptor[] = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { name: "robots", content: "index, follow" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:url", content: url },
    { property: "og:type", content: opts.type ?? "website" },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
  ];

  if (opts.jsonLd) {
    // TanStack Router renders `script:ld+json` descriptors as JSON-LD in <head>.
    meta.push({ "script:ld+json": opts.jsonLd } as MetaDescriptor);
  }

  const links: LinkDescriptor[] = [{ rel: "canonical", href: url }];

  return { meta, links };
}

/** Builds a schema.org Article JSON-LD object for blog posts. */
export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  section?: string;
  tags?: string[];
}) {
  const url = `${SITE_URL}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt ?? opts.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    articleSection: opts.section ?? "UAP Research",
    keywords: opts.tags?.join(", ") ?? "UFO, UAP, UFO sightings, UAP research",
    inLanguage: "en",
  };
}

/** Builds a schema.org Organization JSON-LD object (landing page). */
export function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "An autonomous UAP research platform that continuously discovers, cross-references, and organizes public UFO/UAP evidence into a living, searchable database.",
    sameAs: [],
  };
}

/** Renders JSON-LD structured data inline in the page body. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
