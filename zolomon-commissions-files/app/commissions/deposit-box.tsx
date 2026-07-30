"use client";

import { useState } from "react";
import {
  DEPOSIT_TIERS,
  packagesInTier,
  formatUsd,
  CALENDLY_URL
} from "@/lib/commissions";

// Mirrors app/prints/[id]/buy-box.tsx: pick an option, POST to /api/checkout,
// follow the returned Stripe URL. The tier id is all that's sent — the amount
// is resolved server-side from lib/commissions.ts.

export default function DepositBox() {
  const [tierId, setTierId] = useState(DEPOSIT_TIERS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = DEPOSIT_TIERS.find((t) => t.id === tierId)!;

  async function reserve() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "deposit", tierId })
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
    <div className="deposit-box">
      <div className="deposit-grid">
        {DEPOSIT_TIERS.map((t) => {
          const isSelected = t.id === tierId;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => setTierId(t.id)}
              aria-pressed={isSelected}
              className={isSelected ? "deposit-card selected" : "deposit-card"}
            >
              <span className="deposit-amount">{formatUsd(t.depositUsd)}</span>
              <span className="deposit-name">
                {t.label}
                <span className="dot">.</span>
              </span>
              <span className="deposit-range">{t.rangeLabel}</span>
              <span className="deposit-packages">
                {packagesInTier(t.id)
                  .map((p) => p.name)
                  .join(" · ")}
              </span>
            </button>
          );
        })}
      </div>

      <p className="deposit-blurb">{selected.blurb}</p>

      <button className="buy-button" onClick={reserve} disabled={loading}>
        {loading
          ? "one moment…"
          : `reserve with ${formatUsd(selected.depositUsd)} deposit`}
      </button>

      {error && (
        <p className="note" style={{ color: "var(--red)" }}>
          {error}
        </p>
      )}

      <p className="note">
        Secure checkout via Stripe. Your deposit is credited in full toward the
        final commission price. Not sure which tier fits?{" "}
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="sw-inline-link">
          book a consult first
        </a>{" "}
        and reserve afterwards.
      </p>
    </div>
  );
}
