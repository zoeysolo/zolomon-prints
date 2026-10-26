// One-time setup: creates the Open Edition products on the Squarespace
// "Open Editions" store page, with three sizes each and two photos
// (the print alone, then the wall mockup).
//
//   node open-editions/setup-products.mjs            create missing products, hidden
//   node open-editions/setup-products.mjs --publish  make every Open Edition visible
//   node open-editions/setup-products.mjs --check    only check keys, page and sizes
//
// Safe to run more than once: products that already exist (same URL slug)
// are left alone.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CATALOG, SIZES, ARTELO_PRODUCT, STORE_PAGE_TITLE, HERE,
  sq, sqPaged, artelo, skuFor, printFileUrl
} from "./lib.mjs";

const args = new Set(process.argv.slice(2));
const PUBLISH = args.has("--publish");
const CHECK_ONLY = args.has("--check");

function descriptionHtml(item) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return [
    `<p>${esc(item.line)}</p>`,
    `<p>${esc(item.body)}</p>`,
    "<ul>",
    "<li>Unframed print on matte paper</li>",
    "<li>Three sizes: 8 × 10, 12 × 15, or 16 × 20 in</li>",
    "<li>Open edition, printed to order and shipped in about a week</li>",
    "<li>Frame in the photo is for styling and not included</li>",
    "<li>Free shipping within the US</li>",
    "</ul>"
  ].join("");
}

async function findStorePage() {
  const pages = await sqPaged("/1.0/commerce/store_pages", "storePages");
  const page = pages.find((p) => p.title.trim().toLowerCase() === STORE_PAGE_TITLE.toLowerCase());
  if (!page) {
    const names = pages.map((p) => `"${p.title}"`).join(", ") || "none";
    throw new Error(
      `No Store page titled "${STORE_PAGE_TITLE}". Store pages found: ${names}. ` +
      `In Squarespace, add a Store page named "${STORE_PAGE_TITLE}" (it can replace the coming-soon page), then run again.`
    );
  }
  return page;
}

async function checkArteloSizes() {
  const res = await artelo("POST", "/orders/price-check", {
    orderId: "size-check",
    currency: "USD",
    customerAddress: {
      name: "Size Check", street1: "1 Main St", city: "Rockville",
      state: "MD", zipcode: "20850", country: "US"
    },
    items: SIZES.map((s) => ({
      orderItemId: s.code,
      quantity: 1,
      unitPrice: s.price,
      productInfo: {
        ...ARTELO_PRODUCT, size: s.artelo, orientation: "Vertical",
        designs: [{ sourceImage: { url: printFileUrl(CATALOG[0]) }, fitOptions: { canvas: "Paper", style: "Outside" } }]
      }
    }))
  });
  console.log("Artelo costs (production + shipping per size):");
  for (const c of res.orderItemCosts || []) {
    const s = SIZES.find((x) => x.code === c.orderItemId);
    const cost = Number(c.productionCost || 0) + Number(c.arteloShipping || 0);
    console.log(`  ${s?.label}: cost $${cost.toFixed(2)}, price $${s?.price}`);
  }
}

async function waitForImage(productId, imageId) {
  for (let i = 0; i < 40; i++) {
    const s = await sq("GET", `/1.0/commerce/products/${productId}/images/${imageId}/status`);
    if (s.status === "READY") return;
    if (s.status === "ERROR") throw new Error(`Image ${imageId} failed to process`);
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Image ${imageId} still processing after 80s`);
}

async function uploadImage(productId, file, alt) {
  const buf = readFileSync(join(HERE, "images", file));
  const form = new FormData();
  form.append("file", new Blob([buf], { type: "image/jpeg" }), file);
  const { imageId } = await sq("POST", `/1.0/commerce/products/${productId}/images`, form);
  await waitForImage(productId, imageId);
  await sq("POST", `/1.0/commerce/products/${productId}/images/${imageId}`, { altText: alt });
  return imageId;
}

async function main() {
  const page = await findStorePage();
  console.log(`Store page: "${page.title}" (${page.id})`);
  await checkArteloSizes();
  if (CHECK_ONLY) return console.log("Check passed.");

  const all = await sqPaged("/v2/commerce/products?type=PHYSICAL", "products");
  const onPage = all.filter((p) => p.storePageId === page.id);
  const bySlug = new Map(onPage.map((p) => [p.urlSlug, p]));

  for (const item of CATALOG) {
    let product = bySlug.get(item.slug);
    if (!product) {
      product = await sq("POST", "/v2/commerce/products", {
        type: "PHYSICAL",
        storePageId: page.id,
        name: `${item.name}, ${item.kind}`,
        description: descriptionHtml(item),
        urlSlug: item.slug,
        tags: ["Open Edition"],
        isVisible: PUBLISH,
        variantAttributes: ["Size"],
        variants: SIZES.map((s) => ({
          sku: skuFor(item, s),
          pricing: { basePrice: { currency: "USD", value: s.price.toFixed(2) } },
          stock: { quantity: 0, unlimited: true },
          attributes: { Size: s.label },
          shippingMeasurements: {
            weight: { unit: "POUND", value: 1 },
            dimensions: { unit: "INCH", length: 22, width: 18, height: 1 }
          }
        }))
      });
      console.log(`Created ${item.name}`);
      await uploadImage(product.id, `${item.slug}-scanography-print.jpg`,
        `${item.name}, scanography print of ${item.line.replace(/\.$/, "").toLowerCase()}`);
      await uploadImage(product.id, `${item.slug}-framed-on-wall.jpg`,
        `${item.name} print in a walnut frame with a cream mat, on a paneled wall above a walnut console`);
      console.log(`  added photos`);
    } else if (PUBLISH && !product.isVisible) {
      await sq("POST", `/v2/commerce/products/${product.id}`, { isVisible: true });
      console.log(`Published ${item.name}`);
    } else {
      console.log(`Already there: ${item.name}`);
    }
  }
  console.log(PUBLISH ? "Done. Open Editions are live." : "Done. Products are hidden until you run with --publish.");
}

main().catch((e) => { console.error(e.message); process.exit(1); });
