import type { MetadataRoute } from "next";
import { buildPageContent } from "@/lib/content";
import { getPublishedPages } from "@/lib/pages";
import {
  SITE_URL,
  buildCanonicalUrl,
  buildDetailOgImageUrl,
  buildHomeOgImageUrl,
} from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = await getPublishedPages();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [buildHomeOgImageUrl()],
    },
    ...pages.map((page) => {
      const content = buildPageContent(page);

      return {
        url: buildCanonicalUrl(page.slug),
        lastModified: parseLastModified(page.created_at, now),
        changeFrequency: "monthly" as const,
        priority: page.page_type === "location" ? 0.8 : 0.7,
        images: [buildDetailOgImageUrl(page, content.metadata)],
      };
    }),
  ];
}

function parseLastModified(value: string, fallback: Date): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date;
}
