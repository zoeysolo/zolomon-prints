# content drafts

These are draft pages for review. Nothing here is live to the public yet.

Each `.md` file has frontmatter (`title`, `description`, `slug`, `route`, `type`, `noindex`) and a markdown body. The new page routes in the shop read these files directly, so editing the markdown here is how you edit the pages. While `noindex: true` is set, the page renders but tells search engines not to index it, and it is kept out of `sitemap.xml`.

## approval workflow

1. Read and edit the copy in each file. Fix anything that is wrong, and add real flower names, venue details, or specifics where I left them general.
2. When a page is ready to go live, set `noindex: false` in its frontmatter.
3. Tell me which pages are approved. I will add the approved routes to `app/sitemap.ts` so Google can find them.

## the files

Service and education:
- `scanography.md` — what bouquet scanography is, vs pressing and resin (`/scanography`)
- `wedding-preservation-notes.md` — notes on the existing `/commissions` page (not a new route)

Location pages (`/locations/<slug>`):
- `location-new-york.md`, `location-washington-dc.md`, `location-maryland.md`, `location-virginia.md`

Venue pages (`/venues/<slug>`):
- `venue-rust-manor.md` — first venue partner, and the template for more

Bouquet-type pages (`/bouquets/<slug>`):
- `bouquet-garden-roses.md`, `bouquet-ranunculus.md`, `bouquet-peonies.md`

## copy rules used in these drafts

No em dashes. Plain and direct. Reverent about the work but not flowery. No wedding-industry boilerplate. No invented client counts, testimonials, or statistics. The only outside facts referenced are the Washingtonian feature and the Rust Manor partnership, both real.
