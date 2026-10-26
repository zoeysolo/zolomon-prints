// Runs every 15 minutes from GitHub Actions.
//
// 1. Finds paid Squarespace orders that are still unfulfilled and contain
//    Open Edition items (SKUs starting with "OE-").
// 2. Sends those items to Artelo once (Artelo order id = "SQ-<order number>")
//    and releases the order to production.
// 3. When Artelo ships, marks the Squarespace order fulfilled with tracking,
//    which emails the customer their tracking link.
//
// Orders that also contain a Limited Edition are sent to Artelo for the
// Open Edition part only, and are left for you to mark fulfilled, since the
// Limited Edition ships from the studio.
//
// Set ARTELO_TEST_ORDERS=true to send everything to Artelo as test orders
// (Artelo records them but never prints them). Squarespace test-mode orders
// are always sent as Artelo test orders.

import { appendFileSync } from "node:fs";
import { sq, sqPaged, artelo, parseSku, printFileUrl, ARTELO_PRODUCT } from "./lib.mjs";

const FORCE_TEST = process.env.ARTELO_TEST_ORDERS === "true";
const notes = [];
const note = (s) => { console.log(s); notes.push(s); };
let failures = 0;

async function findArteloOrder(arteloOrderId) {
  const q = new URLSearchParams({ name: arteloOrderId, limit: "10", allOrders: "true" });
  const data = await artelo("GET", `/orders/get?${q}`);
  const list = Array.isArray(data) ? data : data?.orders || data?.data || [];
  return list.find((o) => o.orderId === arteloOrderId) || null;
}

function arteloAddress(order) {
  const a = order.shippingAddress || {};
  return {
    name: [a.firstName, a.lastName].filter(Boolean).join(" "),
    email: order.customerEmail || undefined,
    phone: a.phone || undefined,
    street1: a.address1,
    street2: a.address2 || undefined,
    city: a.city,
    state: a.state,
    zipcode: a.postalCode,
    country: a.countryCode
  };
}

async function sendToArtelo(order, oeLines, arteloOrderId) {
  const items = oeLines.map(({ line, item, size }) => {
    const url = printFileUrl(item);
    if (!url) throw new Error(`No print file set for ${item.name} (printFileDriveId in catalog.json)`);
    return {
      orderItemId: line.id,
      quantity: line.quantity,
      unitPrice: Number(line.unitPricePaid?.value ?? size.price),
      productInfo: {
        ...ARTELO_PRODUCT,
        size: size.artelo,
        orientation: item.orientation,
        designs: [{ sourceImage: { url }, fitOptions: { canvas: "Paper", style: "Outside" } }]
      }
    };
  });
  const isTest = FORCE_TEST || order.testmode === true;
  const created = await artelo("POST", "/orders/create", {
    orderId: arteloOrderId,
    createdAt: order.createdOn || new Date().toISOString(),
    currency: "USD",
    channelName: "ZolomonPrints",
    isTestOrder: isTest,
    customerAddress: arteloAddress(order),
    items,
    total: items.reduce((t, i) => t + i.unitPrice * i.quantity, 0)
  });
  note(`Order ${order.orderNumber}: sent ${items.length} item(s) to Artelo${isTest ? " as a TEST order" : ""}.`);
  return created;
}

async function releaseIfWaiting(order, ao) {
  if (ao?.status !== "PendingFulfillmentAction" || ao?.isTestOrder) return;
  try {
    await artelo("POST", "/orders/send-to-production", { orderId: ao.id });
    note(`Order ${order.orderNumber}: released to production at Artelo.`);
  } catch (e) {
    // 409 = Artelo is still processing the image; try again next run.
    if (e.status === 409) console.log(`Order ${order.orderNumber}: Artelo still processing images, will retry.`);
    else throw e;
  }
}

async function fulfillIfShipped(order, ao, onlyOpenEditions) {
  if (!ao || !["Shipped", "Delivered"].includes(ao.status)) return;
  const shipments = (ao.shipments || []).filter((s) => s.trackingNumber);
  if (!shipments.length) return;
  if (!onlyOpenEditions) {
    note(`Order ${order.orderNumber}: Open Edition part shipped (tracking ${shipments[0].trackingNumber}). ` +
      `It also has a Limited Edition, so mark it fulfilled in Squarespace once that ships.`);
    return;
  }
  await sq("POST", `/1.0/commerce/orders/${order.id}/fulfillments`, {
    shouldSendNotification: true,
    shipments: shipments.map((s) => ({
      shipDate: new Date().toISOString(),
      carrierName: s.carrierCode || "Carrier",
      service: "Standard",
      trackingNumber: s.trackingNumber,
      trackingUrl: s.trackingUrl || undefined
    }))
  });
  note(`Order ${order.orderNumber}: marked fulfilled, tracking emailed to the customer.`);
}

async function main() {
  if (!process.env.SQUARESPACE_API_KEY || !process.env.ARTELO_API_KEY) {
    console.log("API keys not added yet, nothing to do.");
    return;
  }
  const orders = await sqPaged("/1.0/commerce/orders?fulfillmentStatus=PENDING", "result");
  let touched = 0;
  for (const order of orders) {
    const lines = order.lineItems || [];
    const oeLines = lines
      .map((line) => ({ line, ...(parseSku(line.sku) || {}) }))
      .filter((x) => x.item);
    if (!oeLines.length) continue;
    touched++;
    const onlyOpenEditions = oeLines.length === lines.length;
    const arteloOrderId = `SQ-${order.orderNumber}`;
    try {
      let ao = await findArteloOrder(arteloOrderId);
      if (!ao) {
        ao = await sendToArtelo(order, oeLines, arteloOrderId);
        if (!onlyOpenEditions) {
          note(`Order ${order.orderNumber}: also has a Limited Edition. Ship that from the studio.`);
        }
      }
      await releaseIfWaiting(order, ao);
      await fulfillIfShipped(order, ao, onlyOpenEditions);
    } catch (e) {
      failures++;
      note(`Order ${order.orderNumber}: PROBLEM, ${e.message}`);
    }
  }
  console.log(`Checked ${orders.length} unfulfilled order(s), ${touched} with Open Editions.`);
}

main()
  .catch((e) => { failures++; note(`Bridge error: ${e.message}`); })
  .finally(() => {
    if (process.env.GITHUB_STEP_SUMMARY && notes.length) {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, notes.map((n) => `- ${n}`).join("\n") + "\n");
    }
    // A failed run makes GitHub email you, so real problems don't go unnoticed.
    if (failures) process.exit(1);
  });
