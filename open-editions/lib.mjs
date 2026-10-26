// Shared helpers for the Open Editions bridge (Squarespace <-> Artelo).
// Plain Node 20+, no dependencies.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const CATALOG = JSON.parse(readFileSync(join(HERE, "catalog.json"), "utf8"));

// ---- Sizes and prices. Edit here to change them everywhere. ----------------
// `artelo` is Artelo's size enum. Horizontal prints use the same enum with
// orientation "Horizontal".
export const SIZES = [
  { label: "8 × 10 in", code: "8X10", artelo: "x8x10", price: 24 },
  { label: "12 × 15 in", code: "12X15", artelo: "x12x15", price: 36 },
  { label: "16 × 20 in", code: "16X20", artelo: "x16x20", price: 48 }
];

// Unframed print on Artelo's matte poster paper.
export const ARTELO_PRODUCT = {
  catalogProductId: "IndividualArtPrint",
  paperType: "MattePoster",
  frameColor: null,
  includeFramingService: false,
  includeHangingPins: false,
  includeMats: false,
  canvasDesignedFor: null,
  canvasBorderStyle: null
};

export const SKU_PREFIX = "OE-";
export const STORE_PAGE_TITLE = "Open Editions";

export function skuFor(item, size) {
  // e.g. OE-LULLABY-IN-BLUE-8X10 (Squarespace caps SKUs at 60 chars)
  return `${SKU_PREFIX}${item.slug.toUpperCase()}-${size.code}`.slice(0, 60);
}

export function parseSku(sku) {
  if (!sku || !sku.startsWith(SKU_PREFIX)) return null;
  for (const item of CATALOG) {
    for (const size of SIZES) {
      if (skuFor(item, size) === sku) return { item, size };
    }
  }
  return null;
}

export function printFileUrl(item) {
  if (!item.printFileDriveId) return null;
  return `https://drive.google.com/uc?export=download&id=${item.printFileDriveId}`;
}

// ---- HTTP -----------------------------------------------------------------
function need(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Add it as a GitHub Actions secret.`);
  return v;
}

const UA = "ZolomonPrints Open Editions bridge (zoey@zolomonprints.com)";

async function call(base, token, method, path, body, extraHeaders = {}) {
  const headers = { Authorization: `Bearer ${token}`, "User-Agent": UA, ...extraHeaders };
  let payload = body;
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  let last = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(base + path, { method, headers, body: payload });
    if (res.status === 429 || res.status >= 500) {
      last = `${res.status}: ${(await res.text()).slice(0, 300)}`;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      continue;
    }
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const err = new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 600)}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }
  throw new Error(`${method} ${path} kept failing (last response ${last})`);
}

export const sq = (method, path, body) =>
  call("https://api.squarespace.com", need("SQUARESPACE_API_KEY"), method, path, body);

export const artelo = (method, path, body) =>
  call("https://www.artelo.com/api/open", need("ARTELO_API_KEY"), method, path, body);

export async function sqPaged(path, key) {
  const out = [];
  let url = path;
  while (url) {
    const data = await sq("GET", url);
    out.push(...(data[key] || []));
    const c = data.pagination?.hasNextPage ? data.pagination.nextPageCursor : null;
    url = c ? `${path.split("?")[0]}?cursor=${encodeURIComponent(c)}` : null;
  }
  return out;
}
