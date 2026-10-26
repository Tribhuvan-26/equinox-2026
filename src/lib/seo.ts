import { contact, event, events } from "@/lib/content";

/**
 * Canonical origin for metadata, sitemap and structured data. SITE_URL already
 * configures emailed links; reuse it so both point at the same host, and fall
 * back to the production domain so a missing env var can't emit relative
 * canonicals or localhost URLs into a build.
 */
export const SITE_ORIGIN =
  process.env.SITE_URL?.trim().replace(/\/+$/, "") || "https://equinox-2.0.mlritcie.in";

export const SITE_NAME = `${event.name} ${event.edition}`;

export const SITE_DESCRIPTION =
  `${SITE_NAME} — the ${event.year} E-Summit by ${event.host}. ${event.datesFull} at ` +
  `${event.venue}. Twelve sub-events across strategy, startups, tech and entertainment: ` +
  `${events.slice(0, 5).map((e) => e.name).join(", ")} and more.`;

export const SITE_KEYWORDS = [
  "The Equinox 2.0",
  "Equinox 2026",
  "E-Summit 2026",
  "MLRIT",
  "MLR Institute of Technology",
  "CIE MLRIT",
  "entrepreneurship summit Hyderabad",
  "college fest Hyderabad 2026",
  "startup expo",
  "pitch deck competition",
  ...events.map((e) => e.name),
];

/** ISO start/end for the summit, used by the Event structured data. */
const EVENT_START = "2026-10-30T09:00:00+05:30";
const EVENT_END = "2026-10-31T18:00:00+05:30";

const organization = {
  "@type": "CollegeOrUniversity",
  name: event.venue,
  alternateName: event.institution,
  url: contact.websiteUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dundigal Police Station Road",
    addressLocality: "Hyderabad",
    postalCode: "500043",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
};

const place = {
  "@type": "Place",
  name: event.venue,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Centre for Innovation and Entrepreneurship, Dundigal Police Station Road",
    addressLocality: "Hyderabad",
    postalCode: "500043",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
};

/** Schema.org graph for the summit itself — emitted once, in the root layout. */
export function summitJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_ORIGIN}/#organizer` },
      },
      {
        ...organization,
        "@id": `${SITE_ORIGIN}/#organizer`,
        email: contact.email,
      },
      {
        "@type": "Event",
        "@id": `${SITE_ORIGIN}/#event`,
        name: `${SITE_NAME} — E-Summit ${event.year}`,
        description: SITE_DESCRIPTION,
        startDate: EVENT_START,
        endDate: EVENT_END,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: place,
        organizer: { "@id": `${SITE_ORIGIN}/#organizer` },
        image: [`${SITE_ORIGIN}/opengraph-image.png`],
        url: SITE_ORIGIN,
        offers: {
          "@type": "Offer",
          name: "Participant pass",
          price: "869",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${SITE_ORIGIN}/register`,
        },
        subEvent: events.map((sub) => ({
          "@type": "Event",
          name: sub.name,
          description: sub.tagline,
          url: `${SITE_ORIGIN}/events/${sub.slug}`,
          startDate: EVENT_START,
          endDate: EVENT_END,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: place,
          organizer: { "@id": `${SITE_ORIGIN}/#organizer` },
        })),
      },
    ],
  };
}

/** Schema.org Event for one sub-event page. */
export function subEventJsonLd(sub: { name: string; slug: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${sub.name} — ${SITE_NAME}`,
    description: sub.description,
    startDate: EVENT_START,
    endDate: EVENT_END,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: place,
    organizer: { "@id": `${SITE_ORIGIN}/#organizer` },
    superEvent: { "@id": `${SITE_ORIGIN}/#event` },
    image: [`${SITE_ORIGIN}/opengraph-image.png`],
    url: `${SITE_ORIGIN}/events/${sub.slug}`,
  };
}
