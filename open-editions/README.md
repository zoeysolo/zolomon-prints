# Open Editions: Squarespace to Artelo

Open Editions are sold on zolomonprints.com (Squarespace) and printed and shipped by Artelo. This folder connects the two. It runs from GitHub Actions every 15 minutes, so there's no server to maintain.

## What it does

- Finds paid, unfulfilled Squarespace orders with Open Edition items (SKUs starting `OE-`).
- Sends those items to Artelo once, as order `SQ-<order number>`, and releases them to production.
- When Artelo ships, marks the Squarespace order fulfilled and emails the customer their tracking link.
- If an order also has a Limited Edition, only the Open Edition part goes to Artelo. Mark that order fulfilled yourself once the Limited Edition ships from the studio.
- If something fails, the run fails and GitHub emails you.

## Products

17 prints, each in three sizes on matte poster paper (unframed):

| Size | Price |
|---|---|
| 8 × 10 in | $24 |
| 12 × 15 in | $36 |
| 16 × 20 in | $48 |

Sizes and prices live in `lib.mjs`. Names and copy live in `catalog.json`. Product photos are in `images/` (the print alone first, then the wall mockup).

## Setup

1. **Keys.** In GitHub, go to Settings → Secrets and variables → Actions and add:
   - `SQUARESPACE_API_KEY`: Squarespace → Settings → Developer Tools → Developer API Keys, with Products and Orders set to Read and Write.
   - `ARTELO_API_KEY`: Artelo → Integrations → API.
2. **Store page.** In Squarespace, add a Store page titled exactly **Open Editions**.
3. **Print files.** Each print in `catalog.json` points at its original full-resolution scan in Google Drive (`printFileDriveId`, link sharing on). Artelo crops it to 4:5 from the center.
4. **Test mode.** Under Settings → Secrets and variables → Actions → Variables, add `ARTELO_TEST_ORDERS` = `true`.
5. **Run it.** Go to Actions → Open Editions → Run workflow and run these in order:
   - `check-setup`: confirms both keys work, the store page exists, and Artelo accepts the sizes.
   - `create-products-hidden`: creates all 17 products, hidden, with photos.
   - `test-order` places a Squarespace order through the API, checks it reaches Artelo as a test order, then closes it quietly.
   - Look them over in Squarespace, then run `publish-products`.
6. **Go live.** Place a test order. If it appears in Artelo as a test order, set `ARTELO_TEST_ORDERS` to `false`.
