// ---------------------------------------------------------------------------
// Zolomon Prints — bouquet commissions
//
// Commission packages and the deposit tiers that reserve them.
//
// A deposit is a flat, fixed amount that reserves a date and is credited in
// full toward the final commission price. It is NOT a print order: deposits
// never touch Artelo fulfillment. See app/api/stripe-webhook/route.ts, which
// branches on `metadata.kind` before doing anything else.
//
// To change pricing or move a package between deposit tiers, edit this file
// only — the checkout route derives amounts from here and never trusts the
// client.
// ---------------------------------------------------------------------------

export type DepositTierId = "entry" | "mid" | "estate";

export interface CommissionPackage {
  id: string;
  name: string;
  priceUsd: number;
  spec: string; // short format description, e.g. "One 8×10 print"
  // Which deposit reserves this package. `null` means the package is paid in
  // full and has no deposit path — see `garden-cards` below.
  tier: DepositTierId | null;
}

export interface DepositTier {
  id: DepositTierId;
  label: string; // lowercase display name, Swiss style
  depositUsd: number;
  blurb: string;
  // Inclusive commission price range this deposit covers, for display.
  rangeLabel: string;
}

// ---------------------------------------------------------------------------
// Deposit tiers — three fixed Stripe Checkout amounts.
// ---------------------------------------------------------------------------

export const DEPOSIT_TIERS: DepositTier[] = [
  {
    id: "entry",
    label: "entry commission",
    depositUsd: 95,
    rangeLabel: "$295 – $495 commissions",
    blurb:
      "Reserves a keepsake or study commission. Credited in full toward your final price."
  },
  {
    id: "mid",
    label: "mid tier",
    depositUsd: 250,
    rangeLabel: "$895 – $2,400 commissions",
    blurb:
      "Reserves a portrait, heirloom, or garden wall commission. Credited in full toward your final price."
  },
  {
    id: "estate",
    label: "estate tier",
    depositUsd: 500,
    rangeLabel: "$2,600 – $9,800 commissions",
    blurb:
      "Reserves an estate collection, salon wall, or large-format commission. Credited in full toward your final price."
  }
];

// ---------------------------------------------------------------------------
// Commission packages.
//
// NOTE ON GARDEN CARDS: at $95 it costs exactly the entry deposit, so a
// deposit would be 100% of the price. It is therefore `tier: null` — a
// pay-in-full item with no reservation flow. Give it a tier here if you'd
// rather it behaved like the others.
// ---------------------------------------------------------------------------

export const COMMISSION_PACKAGES: CommissionPackage[] = [
  { id: "garden-cards", name: "garden cards",     priceUsd: 95,   spec: "Set of 25 · 5×7 cards",        tier: null },
  { id: "keepsake",     name: "keepsake",         priceUsd: 295,  spec: "One 8×10 print",               tier: "entry" },
  { id: "study",        name: "study",            priceUsd: 495,  spec: "Gallery wall · 3 prints",      tier: "entry" },
  { id: "portrait",     name: "portrait",         priceUsd: 895,  spec: "One 11×14 print",              tier: "mid" },
  { id: "heirloom",     name: "heirloom",         priceUsd: 1350, spec: "Two 16×20 + folio",            tier: "mid" },
  { id: "garden",       name: "garden",           priceUsd: 2400, spec: "Gallery wall · 6 prints",      tier: "mid" },
  { id: "estate",       name: "estate collection", priceUsd: 2600, spec: "Four prints · 3 arrangements", tier: "estate" },
  { id: "salon",        name: "salon",            priceUsd: 4800, spec: "Gallery wall · 9 prints",      tier: "estate" },
  { id: "singular",     name: "singular",         priceUsd: 5500, spec: "Large format · 40×70",         tier: "estate" },
  { id: "monument",     name: "monument",         priceUsd: 9800, spec: "40×70 hero + 6 prints",        tier: "estate" }
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function getDepositTier(id: string): DepositTier | undefined {
  return DEPOSIT_TIERS.find((t) => t.id === id);
}

export function packagesInTier(id: DepositTierId): CommissionPackage[] {
  return COMMISSION_PACKAGES.filter((p) => p.tier === id);
}

export function getPackage(id: string): CommissionPackage | undefined {
  return COMMISSION_PACKAGES.find((p) => p.id === id);
}

// Where to send clients to book the commission consult.
export const CALENDLY_URL = "https://calendly.com/zolomonprints";

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
