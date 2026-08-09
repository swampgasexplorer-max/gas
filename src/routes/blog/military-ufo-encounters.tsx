import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { articleSchema, seoHead } from "~/components/SEOHead";
import { BlogLayout } from "~/components/BlogLayout";

const TITLE =
  "Military UFO Encounters: Navy Pilot UAP Sightings That Changed the Debate";
const DESCRIPTION =
  "From the 2004 Nimitz tic-tac to the 2014–2015 East Coast encounters: the military UFO encounters and Navy pilot UAP sightings at the center of official UAP research.";
const PATH = "/blog/military-ufo-encounters";
const PUBLISHED = "2026-07-22";

export const Route = createFileRoute("/blog/military-ufo-encounters")({
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
        section: "Military Sightings",
        tags: ["military UFO encounters", "Navy pilot UAP", "Nimitz", "UFO sightings"],
      }),
    }),
  }),
  component: MilitaryUfoEncounters,
});

function MilitaryUfoEncounters() {
  return (
    <BlogLayout
      eyebrow="Military Sightings"
      title={TITLE}
      lede="The modern UAP debate didn't start with a rumor — it started with Navy pilots reporting objects their own sensors couldn't explain. These are the encounters that forced the Pentagon to pay attention."
      publishedAt={PUBLISHED}
      tags={["Military UFO encounters", "Navy pilot UAP", "Nimitz"]}
    >
      <h2>Why Military UFO Encounters Matter</h2>
      <p>
        Military UFO encounters carry a weight civilian sightings rarely get: trained
        observers, calibrated radar, and official reporting channels. When a Navy pilot
        UAP incident is filed, it isn't a blurry phone video — it's a formal report
        backed by sensor data and multiple witnesses. That's why the military cases,
        not the viral clips, anchor serious UAP research.
      </p>

      <h3>The 2004 Nimitz Encounter: The Tic-Tac</h3>
      <p>
        On November 14, 2004, F/A-18F pilots from the USS <em>Nimitz</em> carrier
        strike group intercepted a white, tic-tac-shaped object off the coast of San
        Diego, tracked by the USS <em>Princeton</em>'s radar. The object matched or
        exceeded the fighters' maneuvers, accelerated at speeds no known aircraft
        could sustain, and then departed. Commander David Fravor's testimony before
        Congress in 2023 made the Nimitz encounter the best-documented UAP case in
        modern history — and the first military UFO encounter most Americans ever
        heard of.
      </p>

      <h3>The 2014–2015 East Coast Encounters</h3>
      <p>
        A second cluster of Navy pilot UAP sightings occurred in 2014 and 2015 off the
        U.S. East Coast, reported by aircrew from the USS <em>Theodore Roosevelt</em>.
        Pilots described objects appearing at altitude, descending rapidly, and
        hovering near the carrier group for days. The FLIR, GIMBAL, and GOFAST videos
        later declassified by the Pentagon came from this period — the only official
        sensor footage ever released of a military UFO encounter.
      </p>

      <h3>The 2019 USS Omaha and USS Russell Incidents</h3>
      <p>
        In 2019, Navy ships reported spherical objects and what appeared to be a
        submerged craft. The USS <em>Omaha</em> incident produced a released video of a
        sphere over the water, and the USS <em>Russell</em> sighting involved an object
        that appeared to descend into the ocean. These cases expanded the military UFO
        encounter record beyond fighter aircraft to ship-based detection — a crucial
        detail for researchers mapping where and how UAP activity concentrates.
      </p>

      <h2>What Navy Pilot UAP Sightings Share in Common</h2>
      <p>
        Look across the documented cases and consistent patterns emerge: objects with no
        visible propulsion, performance beyond known aircraft, persistence over hours,
        and detection by independent sensor systems simultaneously. Those patterns are
        why the military cases — not the anecdotes — are the backbone of credible UAP
        research. The same incidents show up again and again in official reports, and
        tracking those connections is exactly what structured intelligence does best.
      </p>

      <h2>Where to Research Military UFO Encounters</h2>
      <p>
        Primary sources for these cases include the declassified Navy videos, AARO's
        annual reports, ODNI assessments, and congressional testimony. The{" "}
        <Link to="/dashboard" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          Swamp Gas Explorer database
        </Link>{" "}
        cross-references each military UFO encounter against witness accounts, radar
        data, and official documents, so you can trace a single case across every
        source in one place.
      </p>
      <p>
        Start with the source material: see how the{" "}
        <Link to="/blog/pentagon-uap-files" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          Pentagon UAP files and declassified UFO videos
        </Link>{" "}
        document these encounters, or learn how{" "}
        <Link to="/blog/ufo-evidence-database" className="font-semibold text-swamp underline decoration-swamp/40 underline-offset-2 hover:text-probe">
          a UFO evidence database
        </Link>{" "}
        organizes sightings like these.
      </p>
    </BlogLayout>
  );
}
