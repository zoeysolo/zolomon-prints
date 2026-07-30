import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrint, getSize, galleryImage, isPrintAvailable } from "@/lib/catalog";
import { getDepositTier } from "@/lib/commissions";

// One checkout endpoint, two kinds of purchase:
//
//   kind: "print"    → an open-edition print, fulfilled via Artelo
//   kind: "deposit"  → a bouquet commission deposit, fulfilled by hand
//
// `kind` is written into session metadata so the webhook can tell them apart.
// Older clients omit `kind`; those are treated as prints for compatibility.
// Amounts are always derived server-side and never read from the request.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const origin =
      req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

    // ---------------------------------------------------------------------
    // Commission deposit
    // ---------------------------------------------------------------------
    if (body.kind === "deposit") {
      const tier = getDepositTier(body.tierId);
      if (!tier) {
        return NextResponse.json({ error: "Unknown deposit tier" }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              // Server-side amount, never trusted from client.
              unit_amount: tier.depositUsd * 100,
              product_data: {
                name: `Bouquet commission deposit — ${tier.label}`,
                description: `Reserves your commission date. Credited in full toward your final commission price (${tier.rangeLabel}).`
              }
            }
          }
        ],
        // No shipping: nothing physical ships for a deposit. The webhook's
        // print branch requires a shipping address; this branch must not.
        phone_number_collection: { enabled: true },
        metadata: {
          kind: "deposit",
          tierId: tier.id,
          tierLabel: tier.label,
          depositUsd: String(tier.depositUsd)
        },
        success_url: `${origin}/success?kind=deposit&tier=${tier.id}`,
        cancel_url: `${origin}/commissions`
      });

      return NextResponse.json({ url: session.url });
    }

    // ---------------------------------------------------------------------
    // Open-edition print (existing flow, unchanged behaviour)
    // ---------------------------------------------------------------------
    const { printId, sizeId } = body;
    const print = getPrint(printId);
    const size = getSize(sizeId);
    if (!print || !size) {
      return NextResponse.json({ error: "Unknown print or size" }, { status: 400 });
    }
    if (!isPrintAvailable(print)) {
      return NextResponse.json(
        { error: "This drop has closed and is no longer available" },
        { status: 410 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: size.priceUsd * 100, // server-side price, never trusted from client
            product_data: {
              name: `${print.title} — ${size.label}`,
              description: "Archival matte fine art print, unframed",
              images: [galleryImage(print.driveId, 600)]
            }
          }
        }
      ],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL", "IE", "NZ"]
      },
      phone_number_collection: { enabled: true },
      metadata: { kind: "print", printId: print.id, sizeId: size.id },
      success_url: `${origin}/success`,
      cancel_url: `${origin}/prints/${print.id}`
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("checkout error", e);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}
