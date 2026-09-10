// ---------------------------------------------------------------------------
// Canonical site URL — single source of truth for SEO output.
//
// Used by robots.txt, sitemap.xml, metadataBase, and JSON-LD so they can never
// drift from each other. This is deliberately hard-coded rather than read from
// NEXT_PUBLIC_SITE_URL, because that env var is the checkout redirect origin
// (which can legitimately be localhost in dev or a preview URL) and must not
// leak into the canonical/sitemap host.
//
// Domain decision (Sep 2026): the shop stays on prints.zolomon.studio. If you
// migrate to zolomonprints.com later, change this one line.
// ---------------------------------------------------------------------------
export const SITE_URL = "https://prints.zolomon.studio";
