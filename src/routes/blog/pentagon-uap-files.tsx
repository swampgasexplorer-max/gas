import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { articleSchema, seoHead } from "~/components/SEOHead";
import { BlogLayout } from "~/components/BlogLayout";

const TITLE =
  "Pentagon UAP Files: Every Declassified UFO Video & Document, Explained";
const DESCRIPTION =
  "The Pentagon UAP files explained: what the declassified UFO videos (FLIR, GIMBAL, GOFAST) actually show, which documents are public, and how to search the full evidence archive.";
const PATH = "/blog/pentagon-uap-files";
const PUBLISHED = "2026-07-20";

export const Route = createFileRoute("/blog/pentagon-uap-files")({
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
        section: "Declassified Documents",
        tags: ["Pentagon UAP files", "UFO videos declassified", "AARO", "UFO documents"],
      }),
    }),
  }),
  component: PentagonUapFiles,
});

function PentagonUapFiles() {
  return (
    <BlogLayout
      eyebrow="Declassified Documents"
      title={TITLE}
      lede="For decades, the question was whether the Pentagon had files on UFOs. Now we know it does — and a growing stack of videos and documents is public. Here's what's actually in them."
      publishedAt={PUBLISHED}
      tags={["Pentagon UAP files", "Declassified UFO videos", "AARO"]}
    >
      <h2>What Are the Pentagon UAP Files?</h2>
      <p>
        The "Pentagon UAP files" is the umbrella term for U.S. Department of Defense
        material on Unidentified Anomalous Phenomena that has been released through
        official channels: declassified videos, inspector general and AARO reports,
        congressional briefings, and FOIA-released documents from programs like AATIP
        and AAWSAP. Together they form the single most authoritative body of UFO
        evidence a civilian researcher can access.
      </p>

      <h3>The Three Declassified Navy Videos: FLIR, GIMBAL, GOFAST</h3>
      <p>
        In 2020 the Pentagon officially declassified three infrared videos recorded by
        U.S. Navy aircraft — <strong>FLIR</strong> (2004, USS Nimitz carrier strike
        group), <strong>GIMBAL</strong> and <strong>GOFAST</strong> (2015, USS Theodore
        Roosevelt). The videos show objects with no visible wings, rotors, or exhaust,
        maneuvering in ways that defy easy explanation. The Pentagon labeled them
        "unidentified," and they remain the most-viewed declassified UFO videos ever
        released.
      </p>

      <h3>The AARO Reports and Official Assessments</h3>
      <p>
        In 2021 the Office of the Director of National Intelligence published a
        preliminary assessment of 144 UAP incidents reported by U.S. government
        sources, identifying only one with high confidence and classifying 143 as
        "unidentified." The All-domain Anomaly Resolution Office (AARO) followed with
        annual reports in 2023 and 2024, cataloging hundreds more cases — and
        establishing the term <em>Unidentified Anomalous Phenomena</em> as official
        language.
      </p>

      <h2>What the Pentagon UFO Videos Actually Show</h2>
      <p>
        The declassified videos are real sensor data, but they are not self-explanatory.
        Analysts still debate parallax effects, sensor artifacts, and whether the
        "tic-tac" shape in FLIR is a resolved object or a thermal signature. What makes
        the Pentagon files valuable is context: the same incidents were tracked by
        multiple sensors, radar, and human witnesses, and those cross-referenced
        accounts are exactly what an evidence archive preserves.
      </p>

      <h2>More Declassified UFO Documents to Explore</h2>
      <p>
        The video releases were just the beginning. The public record now includes:
      </p>
      <ul>
        <li>The 2021 ODNI Preliminary Assessment and subsequent AARO annual reports.</li>
        <li>FOIA-released AATIP / AAWSAP program documents and research contracts.</li>
        <li>Congressional hearing transcripts, including testimony from former Navy pilots.</li>
        <li>Historic archives such as Project Blue Book and U.S. Air Force case files.</li>
      </ul>

      <h2>Where to Search the Full Pentagon UAP Files</h2>
      <p>
        Official releases are scattered across agency sites, PDFs, and news archives —
        which is precisely why the{" "}
        <Link to="/dashboard" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          Swamp Gas Explorer database
        </Link>{" "}
        indexes each document, ties it to the relevant cases and witnesses, and keeps
        it searchable alongside related evidence. If you're tracking this topic, you
        don't need to re-scrape the web every week — the archive does it for you.
      </p>
      <p>
        Want the wider picture? Read about the{" "}
        <Link to="/blog/military-ufo-encounters" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          military UFO encounters and Navy pilot UAP sightings
        </Link>{" "}
        behind these files, or see how{" "}
        <Link to="/blog/ufo-evidence-database" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          a living UFO evidence database
        </Link>{" "}
        keeps all of it connected.
      </p>
    </BlogLayout>
  );
}
