// FAQ content — single source of truth for both the rendered accordion and
// the FAQPage JSON-LD. Google requires the visible copy to match the schema,
// so these must never drift apart; render both from this array.

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "How soon after my wedding should I send my flowers?",
    a: "As soon as possible, ideally within 1 to 3 days. Fresh flowers produce the richest color and detail in the final print. That said, dried flowers are also accepted and can still yield beautiful results, especially for arrangements that have been carefully preserved."
  },
  {
    q: "What is the difference between pressed flower art and scanography?",
    a: "Pressed flower art physically flattens and dries the flowers, which are then mounted behind glass. Scanography captures the flowers at ultra-high resolution (1200 DPI) on a flatbed scanner while they are still fresh, preserving their three-dimensional shape, translucency, and color in a photographic archival print. The original flowers are not destroyed in scanography; only photographed."
  },
  {
    q: "How long does a wedding bouquet preservation commission take?",
    a: "Most commissions are completed within 3 to 4 weeks from the date your flowers arrive. Rush timelines may be available; reach out before your event to discuss options."
  },
  {
    q: "What print sizes are available?",
    a: "Prints are available from 4x6 inches up to 40x70 inches. All prints are produced on archival giclée paper. Framing is available for select sizes."
  },
  {
    q: "How much does a wedding flower preservation print cost?",
    a: "Print commissions begin at $295 for the Keepsake tier (one arrangement, one 8x10 print) and range up to $2,600 for the Estate Collection (up to three arrangements, four prints, full reproduction rights). A set of 25 botanical cards from your bouquet starts at $95, and gallery wall collections range from $495 to $4,800. Contact zoey@zolomonprints.com for a custom quote."
  },
  {
    q: "Do you work with flowers from events other than weddings?",
    a: "Yes. Zoey accepts commissions for memorial and sympathy arrangements, baby showers, graduation bouquets, milestone birthdays, and personal garden flowers. Any arrangement with meaning is welcome."
  },
  {
    q: "How does the deposit work?",
    a: "A flat deposit reserves your commission date: $95 for entry commissions, $250 for mid-tier commissions, and $500 for estate-tier commissions. The deposit is credited in full toward your final commission price, so it is not an additional cost. After paying you will be invited to book a consultation to plan the piece."
  }
];

// Schema.org FAQPage, generated from the same source as the visible copy.
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
}
