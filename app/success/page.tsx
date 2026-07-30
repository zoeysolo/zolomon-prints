import Link from "next/link";
import { CALENDLY_URL, getDepositTier, formatUsd } from "@/lib/commissions";

// Two kinds of checkout land here. A print order ships; a commission deposit
// does not — sending "will ship to you shortly" to someone who just reserved
// a commission date would be wrong, so branch on the kind set by the
// checkout route's success_url.

export default function SuccessPage({
  searchParams
}: {
  searchParams: { kind?: string; tier?: string };
}) {
  const isDeposit = searchParams.kind === "deposit";
  const tier = searchParams.tier ? getDepositTier(searchParams.tier) : undefined;

  if (isDeposit) {
    return (
      <main className="container">
        <div className="success">
          <h1>
            your date is held<span className="dot">.</span>
          </h1>
          <p>
            {tier
              ? `Your ${formatUsd(tier.depositUsd)} ${tier.label} deposit is confirmed. `
              : "Your deposit is confirmed. "}
            It is credited in full toward your final commission price — it is
            not an extra charge. A receipt is on its way to your email.
          </p>
          <p>
            <strong>Next step:</strong> book your commission consult so we can
            plan the piece, confirm the package, and time the arrival of your
            flowers.
          </p>
          <p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sw-btn"
            >
              book your consult<span className="dot">.</span>
            </a>
          </p>
          <p>
            <Link href="/commissions" style={{ color: "var(--black)", fontWeight: 700 }}>
              ← back to commissions
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="success">
        <h1>
          thank you<span className="dot">.</span>
        </h1>
        <p>
          Your order is confirmed. It has been sent to the print studio and will
          ship to you shortly — you&apos;ll receive tracking by email.
        </p>
        <p>
          <Link href="/" style={{ color: "var(--black)", fontWeight: 700 }}>
            ← back to the shop
          </Link>
        </p>
      </div>
    </main>
  );
}
