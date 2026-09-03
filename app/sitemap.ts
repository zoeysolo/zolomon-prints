import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PRINTS, getDrop } from "@/lib/catalog";

// ---------------------------------------------------------------------------
// sitemap.xml — served at /sitemap.xml, generated from the live catalog so it
// stays in sync as drops open/close and prints are added. Every one of the 26
// Drop 01 product pages is emitted here from lib/catalog.ts (never hand-listed).
//
// Deliberately excluded: /success and /api/* (transactional, disallowed in
// robots), and the new service/location/venue/bouquet pages, which stay out of
// the sitemap until Zol approves their copy.
// ---------------------------------------------------------------------------

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${SITE_URL}/commissions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    }
  ];

  const printPages: MetadataRoute.Sitemap = PRINTS.map((p) => {
    const drop = getDrop(p.dropId);
    const lastModified = drop ? new Date(`${drop.releaseDate}T00:00:00Z`) : now;
    return {
      url: `${SITE_URL}/prints/${p.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7
    };
  });

  return [...staticPages, ...printPages];
}
