import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="container">
      <div className="success">
        <h1>
          thank you<span className="dot">.</span>
        </h1>
        <p>
          Your order is confirmed. It has been sent to the print studio and
          will ship to you shortly — you&apos;ll receive tracking by email.
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
