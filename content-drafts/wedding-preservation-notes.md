# notes on the wedding preservation page (/commissions)

The wedding preservation service page already exists at `/commissions` and is in good shape, so this is a restructure, not a new page. It already has a strong, unique title and meta description, a canonical tag, eight real FAQs, and valid `FAQPage` structured data. I did not duplicate it.

Suggested improvements to make once the new pages are approved (I can do these in a follow-up, they touch real page copy so I did not change it unasked):

1. Cross-link to the new supporting pages. Add inline links from `/commissions` to `/scanography` (the explainer), to the relevant location pages, and to the bouquet-type pages. This builds an internal link structure around the preservation service, which is what helps these pages rank as a set rather than in isolation.

2. Add a short "how it compares" line. The `/scanography` page explains scanography vs pressing vs resin in full. A one or two sentence version on `/commissions`, linking out to the full explainer, would capture people searching "wedding flowers pressed vs preserved" without bloating the page.

3. Keep the H1 focused. The page targets "wedding flower preservation" and "bouquet scanography," which is right. When you edit, keep the H1 as the single clearest statement of the service.

4. Consider a `Service` or `ProfessionalService` JSON-LD block here in addition to the FAQ schema, describing the preservation commission with its price range and service area. I left this for Phase 3 once you confirm the LocalBusiness details (social profiles, whether to list a phone, and the Silver Spring locality), since the two schemas should share the same business identity.

Nothing on the live `/commissions` page was changed. These are recommendations for your review.
