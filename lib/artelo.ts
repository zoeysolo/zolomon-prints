// Artelo API client — https://www.artelo.io/artelo-api/documentation
// Auth: Bearer token from your Artelo account (Settings → API).

import { ARTELO_DEFAULTS, Print, PrintSize, printFileUrl } from "./catalog";

const ARTELO_BASE = "https://www.artelo.io/api/open";

export interface ShippingAddress {
  name: string;
  email?: string;
  phone?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string; // ISO 3166 code, e.g. "US"
}

export interface FulfillmentItem {
  print: Print;
  size: PrintSize;
  quantity: number;
}

export async function createArteloOrder(opts: {
  orderId: string;
  address: ShippingAddress;
  items: FulfillmentItem[];
  totalUsd: number;
  isTestOrder: boolean;
}) {
  const apiKey = process.env.ARTELO_API_KEY;
  if (!apiKey) throw new Error("ARTELO_API_KEY is not set");

  const body = {
    orderId: opts.orderId,
    createdAt: new Date().toISOString(),
    currency: "USD",
    channelName: "Zolomon Prints",
    isTestOrder: opts.isTestOrder,
    customerAddress: {
      name: opts.address.name,
      email: opts.address.email,
      phone: opts.address.phone,
      street1: opts.address.street1,
      street2: opts.address.street2,
      city: opts.address.city,
      state: opts.address.state,
      zipcode: opts.address.zipcode,
      country: opts.address.country
    },
    items: opts.items.map(({ print, size, quantity }) => ({
      orderItemId: `${print.id}-${size.id}`,
      quantity,
      unitPrice: size.priceUsd,
      productInfo: {
        ...ARTELO_DEFAULTS,
        orientation: print.orientation,
        size: size.arteloSize,
        designs: [
          {
            fitOptions: { canvas: "Paper", style: "Inside" },
            sourceImage: { url: printFileUrl(print.driveId) }
          }
        ]
      }
    })),
    total: opts.totalUsd
  };

  const res = await fetch(`${ARTELO_BASE}/orders/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Artelo order failed (${res.status}): ${text}`);
  }
  return JSON.parse(text);
}
