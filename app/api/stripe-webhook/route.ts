import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrint, getSize } from "@/lib/catalog";
import { createArteloOrder } from "@/lib/artelo";

// Stripe → Artelo fulfillment.
// Stripe calls this endpoint when a checkout completes; we verify the
// signature, look up what was bought, and create the Artelo print order.

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e) {
    console.error("webhook signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    const printId = session.metadata?.printId;
    const sizeId = session.metadata?.sizeId;
    const print = printId ? getPrint(printId) : undefined;
    const size = sizeId ? getSize(sizeId) : undefined;
    if (!print || !size) {
      throw new Error(`Unknown item in session ${session.id}: ${printId}/${sizeId}`);
    }

    // Shipping details location varies across Stripe API versions.
    const s = session as unknown as Record<string, any>;
    const shipping =
      s.shipping_details ?? s.collected_information?.shipping_details;
    const addr = shipping?.address;
    if (!shipping || !addr) {
      throw new Error(`No shipping address on session ${session.id}`);
    }

    const order = await createArteloOrder({
      // Derived from the Stripe session id so webhook retries reuse the
      // same order id and duplicates are easy to spot in Artelo.
      orderId: `ZP-${session.id.slice(-12)}`,
      address: {
        name: shipping.name ?? session.customer_details?.name ?? "Customer",
        email: session.customer_details?.email ?? undefined,
        phone: session.customer_details?.phone ?? undefined,
        street1: addr.line1 ?? "",
        street2: addr.line2 ?? undefined,
        city: addr.city ?? "",
        state: addr.state ?? "",
        zipcode: addr.postal_code ?? "",
        country: addr.country ?? "US"
      },
      items: [{ print, size, quantity: 1 }],
      totalUsd: (session.amount_total ?? size.priceUsd * 100) / 100,
      // Keep test mode ON until you've verified the flow end-to-end.
      // Set ARTELO_TEST_ORDERS=false in production to send real orders.
      isTestOrder: process.env.ARTELO_TEST_ORDERS !== "false"
    });

    console.log(`Artelo order created: ${order.id} (${order.orderId})`);
    return NextResponse.json({ received: true, arteloOrderId: order.id });
  } catch (e) {
    console.error("fulfillment error", e);
    // 500 makes Stripe retry the webhook, so a transient Artelo outage
    // doesn't lose the order.
    return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
  }
}
