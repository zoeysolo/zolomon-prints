# Zolomon Prints

A print shop in the International Typographic Style. Buyers pay with Stripe;
every completed order is automatically sent to Artelo for printing and
shipping. No inventory, no manual fulfillment.

## How it works

1. Buyer picks a print and size → Stripe Checkout collects payment + shipping address.
2. Stripe fires a webhook to `/api/stripe-webhook`.
3. The webhook verifies the payment and calls Artelo's `POST /orders/create`
   with the shipping address and the high-res scan URL from your Google Drive.
4. Artelo prints, ships, and bills your Artelo account. Your margin is the
   difference between the buyer's price and Artelo's production cost.

## Setup (once, ~20 minutes)

### 1. Install and run locally

```bash
npm install
cp .env.example .env.local   # then fill in the keys below
npm run dev
```

### 2. Stripe

- Get your secret key: dashboard.stripe.com → Developers → API keys → `STRIPE_SECRET_KEY`.
- Webhook (after deploying): Developers → Webhooks → Add endpoint
  - URL: `https://YOUR-DOMAIN/api/stripe-webhook`
  - Event: `checkout.session.completed`
  - Copy the signing secret → `STRIPE_WEBHOOK_SECRET`.
- For local testing: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
  (the CLI prints a temporary `whsec_...` to use).

### 3. Artelo

- In your Artelo account, create an API integration and copy the token → `ARTELO_API_KEY`.
- Leave `ARTELO_TEST_ORDERS=true` while testing — orders are created with
  status "Ignored" and never go to production or cost you anything.
- When a real test purchase (Stripe test card `4242 4242 4242 4242`) shows up
  in your Artelo dashboard looking correct, set `ARTELO_TEST_ORDERS=false`.

### 4. Deploy to Vercel

```bash
npx vercel
```

Add the four env vars in Vercel → Project → Settings → Environment Variables,
set `NEXT_PUBLIC_SITE_URL` to your live URL, then create the Stripe webhook
endpoint pointing at the live domain (step 2).

## Drops

The shop is organized as limited-edition drops (see `DROPS` in
`lib/catalog.ts`). The newest open drop is featured on the home page; older
drops are listed below it and stay purchasable until you close them.

**To release a new drop:**

1. Add an entry to `DROPS` (id, number, name, releaseDate).
2. Add the new prints to `PRINTS` with `dropId` set to the new drop's id.
3. Deploy. The new drop takes over the home page automatically.

**To close a drop** (stop sales): set `closed: true` on it, or give it a
`closesAt` date and it closes by itself at that moment. Closed drops stay
visible but show "closed" and can't be bought — the checkout API enforces
this server-side.

All 26 current prints are assigned to Drop 01 ("First Bloom"). Reassign them
however you like by changing each print's `dropId`.

## Editing the shop

Everything lives in `lib/catalog.ts`:

- **Prices/sizes** — edit the `SIZES` array.
- **Add a print** — upload the scan to one of your shared Drive folders, copy
  the file id from its share link, and add an entry to `PRINTS` with the
  current drop's `dropId`.
- **Orientation** — each print defaults to `Vertical`. If a scan is landscape,
  change its `orientation` to `"Horizontal"` so Artelo prints it correctly.
- **Paper/product type** — `ARTELO_DEFAULTS` (currently unframed archival
  matte fine art paper).

## Things to know

- **Images are served from Google Drive.** The Drive folders must stay
  link-shared ("anyone with the link can view") — both the gallery and Artelo's
  print files depend on it. For a long-term setup, consider moving the files to
  Vercel Blob or Artelo's own Uploads API; the only change needed is the two
  URL helpers at the bottom of `lib/catalog.ts`.
- **Screenshots were skipped.** The catalog uses the high-res scans from your
  folders; low-res screenshots weren't included since they'd print poorly.
- **DPI check.** Artelo rejects images below 150 DPI for the chosen size. If a
  large size fails for a smaller scan file, either remove that size for the
  print or re-scan at higher resolution.
- **The "Cedar+Lime Scans" folder** couldn't be read (owned by
  zoey@zolomonprints.com). Share it with your Gmail account or add those file
  ids to `lib/catalog.ts` manually and they'll appear in the shop.
- **Refunds/cancellations** aren't automated: if you refund in Stripe, cancel
  the matching order in Artelo (orders are named `ZP-<stripe-session-suffix>`).
