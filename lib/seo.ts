// ---------------------------------------------------------------------------
// JSON-LD builders — one place for all structured data so it stays in sync
// with the catalog and the canonical host. Every value is pulled from real
// product data (lib/catalog.ts); nothing is hard-coded per-print, and no
// ratings or review counts are invented.
// ---------------------------------------------------------------------------
import { SITE_URL } from "./site";
import {
  Print,
  PRINTS,
  SIZES,
  galleryImage,
  getDrop,
  isPrintAvailable
} from "./catalog";

const CREATOR = {
  "@type": "Person",
  name: "Zoey Solomon",
  url: "https://zolomon.studio"
} as const;

const LOW_PRICE = Math.min(...SIZES.map((s) => s.priceUsd));
const HIGH_PRICE = Math.max(...SIZES.map((s) => s.priceUsd));

// Templated, honest description built from catalog fields. Deliberately does
// NOT name specific flowers — the catalog titles are colour-and-number only.
// When titles/descriptions are enriched (Phase 4), this improves automatically.
export function productDescription(print: Print): string {
  const drop = getDrop(print.dropId);
  const origin = drop ? `the ${drop.name} drop` : print.collection;
  return `${print.title}, an original botanical scanography print by Zoey Solomon from ${origin}. Archival matte fine art paper, printed to order. Available in three sizes from $${LOW_PRICE}.`;
}

export function productTitle(print: Print): string {
  return `${print.title} — botanical scanography print | Zolomon Prints`;
}

// Generic-but-honest alt text: names the piece and the technique (scanography),
// and differs per print via the title. Placeholder until per-print flower names
// are added, at which point alt should name the actual flowers.
export function imageAlt(print: Print): string {
  return `${print.title} — original botanical scanography fine art print by Zoey Solomon`;
}

// schema.org Product with an ImageObject (creator = Zoey) and an AggregateOffer
// that also carries the three individual size Offers.
export function productJsonLd(print: Print) {
  const url = `${SITE_URL}/prints/${print.id}`;
  const available = isPrintAvailable(print);
  const availability = available
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  return {
    "@type": "Product",
    name: print.title,
    description: productDescription(print),
    url,
    category: print.collection,
    brand: { "@type": "Brand", name: "Zolomon Prints" },
    image: {
      "@type": "ImageObject",
      contentUrl: galleryImage(print.driveId, 1400),
      caption: print.title,
      creator: CREATOR,
      creditText: "Zoey Solomon / Zolomon Prints",
      copyrightNotice: `© ${new Date().getFullYear()} Zoey Solomon`,
      representativeOfPage: true
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: LOW_PRICE.toFixed(2),
      highPrice: HIGH_PRICE.toFixed(2),
      offerCount: SIZES.length,
      availability,
      url,
      offers: SIZES.map((s) => ({
        "@type": "Offer",
        name: `${print.title} — ${s.label}`,
        price: s.priceUsd.toFixed(2),
        priceCurrency: "USD",
        availability,
        itemCondition: "https://schema.org/NewCondition",
        url
      }))
    }
  };
}

// Home > Print. There is no /prints index route, so this is a 2-level trail.
export function breadcrumbJsonLd(print: Print) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Shop",
        item: `${SITE_URL}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: print.title,
        item: `${SITE_URL}/prints/${print.id}`
      }
    ]
  };
}

// Combined graph for a product page: Product + BreadcrumbList in one script.
export function productPageGraph(print: Print) {
  return {
    "@context": "https://schema.org",
    "@graph": [productJsonLd(print), breadcrumbJsonLd(print)]
  };
}

// LocalBusiness / ProfessionalService for the homepage. Real fields only.
// No street address is set because this is a service-area studio, not a
// storefront.
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Zolomon Prints",
    description:
      "Fine art botanical scanography studio. Archival prints made from real wedding bouquets and flowers, plus commissioned wedding bouquet preservation.",
    url: SITE_URL,
    email: "zoey@zolomonprints.com",
    image: galleryImage(PRINTS[0].driveId, 1200),
    founder: {
      "@type": "Person",
      name: "Zoey Solomon",
      url: "https://zolomon.studio"
    },
    areaServed: [
      { "@type": "City", name: "Washington, DC" },
      { "@type": "State", name: "Maryland" },
      { "@type": "State", name: "Virginia" },
      { "@type": "State", name: "New York" }
    ],
    knowsAbout: [
      "botanical scanography",
      "wedding bouquet preservation",
      "fine art printing"
    ],
    telephone: "+1-240-506-4044",
    sameAs: ["https://www.instagram.com/zolomonprints"]
  };
}
