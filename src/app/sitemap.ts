import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { guides } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticPages = [
    "",
    "/guides",
    "/groups",
    "/members",
    "/categories/general-preparedness",
    "/categories/power-outages",
    "/categories/water-filtration",
    "/categories/food-storage",
    "/categories/medical",
    "/categories/comms"
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly" as const,
    priority: path === "" ? 1 : 0.7
  }));

  const guideEntries = guides.map((guide) => ({
    url: `${base}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  return [...staticEntries, ...guideEntries];
}