"use client";

import { useState } from "react";
import { SIZES } from "@/lib/catalog";

export default function BuyBox({
  printId,
  available
}: {
  printId: string;
  available: boolean;
}) {
  const [sizeId, setSizeId] = useState(SIZES[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = SIZES.find((s) => s.id === sizeId)!;

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printId, sizeId })
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <ul className="size-list">
        {SIZES.map((s) => (
          <li key={s.id} className={s.id === sizeId ? "selected" : ""}>
            <button type="button" onClick={() => setSizeId(s.id)}>
              <span>
                <span className="mark">—</span>
                {s.label}
              </span>
              <span>${s.priceUsd}</span>
            </button>
          </li>
        ))}
      </ul>
      <button className="buy-button" onClick={buy} disabled={loading || !available}>
        {!available
          ? "drop closed"
          : loading
            ? "one moment…"
            : `buy — $${selected.priceUsd}`}
      </button>
      {error && (
        <p className="note" style={{ color: "var(--red)" }}>
          {error}
        </p>
      )}
      <p className="note">
        {available
          ? "Secure checkout via Stripe. Ships worldwide."
          : "This drop has ended and is no longer available."}
      </p>
    </div>
  );
}
