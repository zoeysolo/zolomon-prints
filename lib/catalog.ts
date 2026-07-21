// ---------------------------------------------------------------------------
// Zolomon Prints — catalog
//
// Every print references a file in your Google Drive (link-shared folders).
//   driveId       → used for both the gallery image and the high-res print
//                   file that gets sent to Artelo for fulfillment.
//   orientation   → "Vertical" | "Horizontal". Check each scan and correct
//                   if needed; Artelo uses this to pick the paper orientation.
//
// To add/remove prints or change prices, edit this file only.
// ---------------------------------------------------------------------------

export type Orientation = "Vertical" | "Horizontal";

// ---------------------------------------------------------------------------
// Drops — limited-edition releases.
//
// Every print belongs to a drop. The newest OPEN drop (highest number without
// a passed `closesAt`) is featured on the home page. A drop stays purchasable
// until you either set `closesAt` to a past/near date or mark `closed: true`.
// To release a new drop: add an entry here, assign prints to it via `dropId`.
// ---------------------------------------------------------------------------

export interface Drop {
  id: string;        // url-safe, e.g. "drop-01"
  number: number;    // 1, 2, 3…
  name: string;      // display name, e.g. "First Bloom"
  releaseDate: string; // ISO date, shown on the site
  closesAt?: string;   // ISO date — after this, prints in the drop can't be bought
  closed?: boolean;    // manual override, same effect as a passed closesAt
}

export const DROPS: Drop[] = [
  {
    id: "drop-01",
    number: 1,
    name: "First Bloom",
    releaseDate: "2026-07-15"
    // closesAt: "2026-08-15"  ← uncomment to give this drop a closing date
  }
  // Next month, add:
  // { id: "drop-02", number: 2, name: "…", releaseDate: "2026-08-15" },
  // then set `dropId: "drop-02"` on the new prints below.
];

export function isDropOpen(drop: Drop): boolean {
  if (drop.closed) return false;
  if (drop.closesAt && Date.now() > new Date(drop.closesAt).getTime()) return false;
  return true;
}

export function getDrop(id: string): Drop | undefined {
  return DROPS.find((d) => d.id === id);
}

// The featured drop: newest one that's still open (falls back to newest).
export function currentDrop(): Drop {
  const sorted = [...DROPS].sort((a, b) => b.number - a.number);
  return sorted.find(isDropOpen) ?? sorted[0];
}

export interface PrintSize {
  id: string;          // our id, used in Stripe metadata
  label: string;       // shown to buyers
  arteloSize: string;  // Artelo `size` enum value
  priceUsd: number;    // what the buyer pays (per unit)
}

export interface Print {
  id: string;          // url slug
  title: string;
  collection: string;
  dropId: string;      // which drop this print belongs to
  driveId: string;     // Google Drive file id of the high-res scan
  orientation: Orientation;
}

// Flat pricing, all prints. Adjust freely.
export const SIZES: PrintSize[] = [
  { id: "8x10",  label: "8 × 10 in",  arteloSize: "x8x10",  priceUsd: 40 },
  { id: "12x16", label: "12 × 16 in", arteloSize: "x12x16", priceUsd: 65 },
  { id: "18x24", label: "18 × 24 in", arteloSize: "x18x24", priceUsd: 95 }
];

// Artelo product defaults for every print (unframed archival paper print).
export const ARTELO_DEFAULTS = {
  catalogProductId: "IndividualArtPrint",
  paperType: "ArchivalMatteFineArt",
  includeFramingService: false,
  includeHangingPins: false,
  includeMats: false,
  frameColor: null,
  canvasDesignedFor: null,
  canvasBorderStyle: null
} as const;

export const COLLECTIONS = [
  "Pink", "Orange", "White", "Mixed Bouquets", "Purple",
  "Blue", "Green", "Yellow", "Red"
] as const;

export const PRINTS: Print[] = [
  // Pink
  { id: "pink-01",   title: "Pink No. 1",   collection: "Pink",           dropId: "drop-01", driveId: "1fMEdyR9dTKeHF_yqcG-qeW8uaR6m4pew", orientation: "Vertical" },
  { id: "pink-02",   title: "Pink No. 2",   collection: "Pink",           dropId: "drop-01", driveId: "1E7fZ-WjMSUO4SHPHj7H5ij1Jsvp94Att", orientation: "Vertical" },
  { id: "pink-03",   title: "Pink No. 3",   collection: "Pink",           dropId: "drop-01", driveId: "1fvdoFtiReYfwcQUeYFN6wnAdacJxslvM", orientation: "Vertical" },
  { id: "pink-04",   title: "Pink No. 4",   collection: "Pink",           dropId: "drop-01", driveId: "1OBMJZjxftx8gP50gY7oCrbFCdsCBDc8Y", orientation: "Vertical" },
  // Orange
  { id: "orange-01", title: "Orange No. 1", collection: "Orange",         dropId: "drop-01", driveId: "1tXjACW5kf4pBvqJ7ZmKYjVOMjUBUFsHX", orientation: "Vertical" },
  { id: "orange-02", title: "Orange No. 2", collection: "Orange",         dropId: "drop-01", driveId: "1WpJC0ZwYFaa5w8jfApF3kgyo7-NyN7Xd", orientation: "Vertical" },
  // White
  { id: "white-01",  title: "White No. 1",  collection: "White",          dropId: "drop-01", driveId: "1l00e8SWkauMvA-pNaS6f72l_NTlBXVaR", orientation: "Vertical" },
  // Mixed Bouquets
  { id: "mixed-01",  title: "Bouquet No. 1", collection: "Mixed Bouquets", dropId: "drop-01", driveId: "1IT4K_cA8t1tYk-ZKjETcIcVKtAgH7hkM", orientation: "Vertical" },
  { id: "mixed-02",  title: "Bouquet No. 2", collection: "Mixed Bouquets", dropId: "drop-01", driveId: "19WAHyLxC3XTTzX4qcJ6eocrV2g870zA2", orientation: "Vertical" },
  { id: "mixed-03",  title: "Bouquet No. 3", collection: "Mixed Bouquets", dropId: "drop-01", driveId: "1hKdnd3-Wj5tVnq31pRzj4QDVxWVhhAL4", orientation: "Vertical" },
  // Purple
  { id: "purple-01", title: "Purple No. 1", collection: "Purple",         dropId: "drop-01", driveId: "1uOK_3j8FcSxqO8PaasomlXxz0qCuvARY", orientation: "Vertical" },
  { id: "purple-02", title: "Purple No. 2", collection: "Purple",         dropId: "drop-01", driveId: "1NNIbFkWyqilhtMpxXEIVYpTIfPtU1XRv", orientation: "Vertical" },
  // Blue
  { id: "blue-01",   title: "Blue No. 1",   collection: "Blue",           dropId: "drop-01", driveId: "1c-iapFMMD26FXTsTGUcVDR-CWE7b0oKr", orientation: "Vertical" },
  { id: "blue-02",   title: "Blue No. 2",   collection: "Blue",           dropId: "drop-01", driveId: "1dGEUFnzgqSdQiV3lRQhu9TVYj6H64bRN", orientation: "Vertical" },
  { id: "blue-03",   title: "Blue No. 3",   collection: "Blue",           dropId: "drop-01", driveId: "111kkUTFsdA1oevCvcxTdYmVROYMwdTXD", orientation: "Vertical" },
  { id: "blue-04",   title: "Blue No. 4",   collection: "Blue",           dropId: "drop-01", driveId: "1BzHr9mh-ZpQhWKfnG-usEZLUu1iUqddy", orientation: "Vertical" },
  // Green
  { id: "green-01",  title: "Green No. 1",  collection: "Green",          dropId: "drop-01", driveId: "1k92eHdV_M7ijCssMq9FCltdDfYZI8k1f", orientation: "Vertical" },
  // Yellow
  { id: "yellow-01", title: "Yellow No. 1", collection: "Yellow",         dropId: "drop-01", driveId: "1JV615JUnk-W0kIdHL_Q9jQOtLM6JevFo", orientation: "Vertical" },
  { id: "yellow-02", title: "Yellow No. 2", collection: "Yellow",         dropId: "drop-01", driveId: "1RDgyQzGqWaNC_QZiyQAOoyIGj_aTpIWf", orientation: "Vertical" },
  { id: "yellow-03", title: "Yellow No. 3", collection: "Yellow",         dropId: "drop-01", driveId: "1bkB3Fj7_CpBnhtEIARDFpbL3Qk3_J6K9", orientation: "Vertical" },
  { id: "yellow-04", title: "Yellow No. 4", collection: "Yellow",         dropId: "drop-01", driveId: "1edyDOUX6V6_W4b2ufnF0FlS71LQxMOH6", orientation: "Vertical" },
  // Red
  { id: "red-01",    title: "Red No. 1",    collection: "Red",            dropId: "drop-01", driveId: "1xGycpMQ2ySGT14wLrg4E1VUQoU_lg7YU", orientation: "Vertical" },
  { id: "red-02",    title: "Red No. 2",    collection: "Red",            dropId: "drop-01", driveId: "1I4s9Y5yX7YxQynfwRVrvUWtblERf4Oa1", orientation: "Vertical" },
  { id: "red-03",    title: "Red No. 3",    collection: "Red",            dropId: "drop-01", driveId: "17iAApVBOoFj0d9nZ3GfvbCzAQKKrgUaH", orientation: "Vertical" },
  { id: "red-04",    title: "Red No. 4",    collection: "Red",            dropId: "drop-01", driveId: "1RXA_U1B2eLMTW6zPOMbCmu-3QTnCXJg7", orientation: "Vertical" },
  { id: "red-05",    title: "Red No. 5",    collection: "Red",            dropId: "drop-01", driveId: "1jUIaGOunW8qApInQoQMISGMSCZJHR-7J", orientation: "Vertical" }
];

// Web-optimized image served from Google's image CDN (works for link-shared files).
export function galleryImage(driveId: string, width = 1000): string {
  return `https://lh3.googleusercontent.com/d/${driveId}=w${width}`;
}

// Direct-download URL of the full-resolution file — this is what Artelo prints from.
export function printFileUrl(driveId: string): string {
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}

export function getPrint(id: string): Print | undefined {
  return PRINTS.find((p) => p.id === id);
}

export function getSize(id: string): PrintSize | undefined {
  return SIZES.find((s) => s.id === id);
}

export function printsInDrop(dropId: string): Print[] {
  return PRINTS.filter((p) => p.dropId === dropId);
}

// Is this print currently purchasable? (its drop must be open)
export function isPrintAvailable(print: Print): boolean {
  const drop = getDrop(print.dropId);
  return drop ? isDropOpen(drop) : false;
}
