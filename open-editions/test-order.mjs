// End-to-end test without a real payment:
// 1. Creates a Squarespace order with every Open Edition at 8x10 (or just
//    TEST_SLUG), addressed to the studio, through the Orders API.
// 2. Runs the normal sync with Artelo test mode forced on, so Artelo records
//    the order but never prints it.
// 3. Checks the order arrived at Artelo with the right size, paper and file.
// 4. Closes the test order in Squarespace quietly (no customer email).

import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { sq, sqPaged, artelo, CATALOG, SIZES, skuFor, HERE, bareSlug } from "./lib.mjs";

const TEST_SLUG = process.env.TEST_SLUG || "all";

async function createSquarespaceOrder() {
  const items = TEST_SLUG === "all" ? CATALOG : CATALOG.filter((c) => c.slug === TEST_SLUG);
  const size = SIZES[0];
  const products = await sqPaged("/v2/commerce/products?type=PHYSICAL", "products");
  const lines = items.map((item) => {
    const product = products.find((p) => bareSlug(p.urlSlug) === item.slug);
    if (!product) throw new Error(`Product ${item.slug} not found. Run create-products-hidden first.`);
    const variant = product.variants.find((v) => v.sku === skuFor(item, size));
    if (!variant) throw new Error(`Variant ${skuFor(item, size)} not found on ${item.slug}`);
    return { item, variant };
  });
  const total = size.price * lines.length;

  const address = {
    firstName: "ZolomonPrints", lastName: "Test Order",
    address1: "1 Test Street", city: "Rockville", state: "MD",
    countryCode: "US", postalCode: "20850", phone: "240-506-4044"
  };
  const money = (v) => ({ currency: "USD", value: v.toFixed(2) });
  const res = await fetch("https://api.squarespace.com/1.0/commerce/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SQUARESPACE_API_KEY}`,
      "User-Agent": "ZolomonPrints Open Editions bridge (zoey@zolomonprints.com)",
      "Idempotency-Key": randomUUID(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      channelName: "Open Editions test",
      externalOrderReference: `OE-TEST-${Date.now()}`,
      customerEmail: "zoey@zolomonprints.com",
      billingAddress: address,
      shippingAddress: address,
      inventoryBehavior: "SKIP",
      lineItems: lines.map(({ variant }) => ({ lineItemType: "PHYSICAL_PRODUCT", variantId: variant.id, quantity: 1, unitPricePaid: money(size.price) })),
      priceTaxInterpretation: "EXCLUSIVE",
      subtotal: money(total),
      shippingTotal: money(0),
      taxTotal: money(0),
      grandTotal: money(total),
      fulfillmentStatus: "PENDING",
      createdOn: new Date().toISOString()
    })
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Create test order failed (${res.status}): ${text}`);
  const order = JSON.parse(text);
  console.log(`1. Created Squarespace test order #${order.orderNumber}: ${lines.length} print(s) at ${size.label}.`);
  return { order, lines, size };
}

async function main() {
  const { order, lines, size } = await createSquarespaceOrder();

  const run = spawnSync("node", [join(HERE, "sync-orders.mjs")], {
    env: { ...process.env, ARTELO_TEST_ORDERS: "true" },
    encoding: "utf8"
  });
  console.log("2. Sync output:\n" + (run.stdout || "") + (run.stderr || ""));

  const q = new URLSearchParams({ name: `SQ-${order.orderNumber}`, limit: "5", allOrders: "true" });
  const found = await artelo("GET", `/orders/get?${q}`);
  const list = Array.isArray(found) ? found : found?.orders || found?.data || [];
  const ao = list.find((o) => o.orderId === `SQ-${order.orderNumber}`);
  if (!ao) throw new Error(`3. FAILED: no Artelo order SQ-${order.orderNumber}`);
  console.log(`3. Artelo has SQ-${order.orderNumber}: status ${ao.status}, production ${ao.productionStatus}`);
  // Check every line: same Squarespace line id -> same print file and size.
  const sqLines = new Map((order.lineItems || []).map((l) => [l.id, l]));
  let wrong = 0;
  for (const it of ao.items || []) {
    const sl = sqLines.get(it.orderItemId);
    const expect = lines.find((l) => l.variant.sku === sl?.sku)?.item;
    const url = JSON.stringify(it).match(/drive\.google\.com[^"]*id=([\w-]+)/)?.[1];
    const ok = expect && url === expect.printFileDriveId;
    if (!ok) wrong++;
    console.log(`   ${ok ? "OK " : "BAD"} ${sl?.productName || it.orderItemId} -> ${url || "no file found"}`);
  }
  if (!(ao.items || []).length) console.log(JSON.stringify(ao, null, 2).slice(0, 3000));

  await sq("POST", `/1.0/commerce/orders/${order.id}/fulfillments`, {
    shouldSendNotification: false,
    shipments: [{ shipDate: new Date().toISOString(), carrierName: "Test", service: "Test", trackingNumber: "TEST-ORDER" }]
  });
  console.log(`4. Closed test order #${order.orderNumber} in Squarespace (no email sent).`);
  if (run.status !== 0) throw new Error("Sync reported a problem, see above.");
  if (wrong) throw new Error(`${wrong} item(s) had the wrong print file.`);
  console.log(`PASS: ${lines.length} print(s) went from Squarespace to Artelo with the right files.`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
