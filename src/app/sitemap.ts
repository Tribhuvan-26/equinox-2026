import type { MetadataRoute } from "next";
import { canonicalSlugs } from "./events/eventsData";
import { SITE_ORIGIN } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_ORIGIN, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_ORIGIN}/register`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_ORIGIN}/events`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_ORIGIN}/gallery`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_ORIGIN}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    ...canonicalSlugs.map((slug) => ({
      url: `${SITE_ORIGIN}/events/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
