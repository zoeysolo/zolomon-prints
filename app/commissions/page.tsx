import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DepositBox from "./deposit-box";
import InquiryForm from "./inquiry-form";
import { FAQS, faqJsonLd } from "./faq-data";
import { CALENDLY_URL } from "@/lib/commissions";
import { PRINTS, galleryImage } from "@/lib/catalog";

export const metadata: Metadata = {
  title:
    "Wedding Flower Preservation Art | Bouquet Scanography Prints | Zoey Solomon",
  description:
    "Archival fine art created from your real flowers. Wedding bouquet preservation prints, memorial arrangements, and botanical scanography commissions by Zoey Solomon. Commissions from $95.",
  alternates: { canonical: "/commissions" }
};

// The source page shipped with local scanography-v2/*.jpg assets that aren't
// in this repo. These pull real scans from the shop catalog instead, so the
// page has no missing images and stays in sync with what's actually for sale.
const HERO = PRINTS.find((p) => p.id === "white-01") ?? PRINTS[0];
const STRIP = ["purple-01", "red-01", "blue-01", "pink-01", "mixed-01"]
  .map((id) => PRINTS.find((p) => p.id === id))
  .filter((p): p is (typeof PRINTS)[number] => Boolean(p));

const PROCESS = [
  ["01", "Reserve your date", "Reach out before your event to hold a commission slot. Wedding, memorial, graduation, any occasion works."],
  ["02", "Ship your flowers", "After your event, send your bouquet or arrangement overnight. Fresh or dried flowers are both accepted."],
  ["03", "Zoey scans & composes", "Each bloom is arranged directly on the scanner glass and captured at museum-grade resolution."],
  ["04", "Receive your print", "Delivered as archival giclée prints in your chosen size. Framing available for select sizes. Prints range from 4x6in to 40x70in."]
];

const OCCASIONS = [
  ["Weddings & Anniversaries", "Bridal bouquets, ceremony florals, and first-anniversary flowers preserved as archival keepsakes."],
  ["Memorial & Sympathy", "Funeral arrangements and remembrance pieces transformed into lasting art. A different kind of grief work."],
  ["Celebrations", "Baby showers, graduations, milestone birthdays; any flowers from a day worth remembering."],
  ["Personal Gardens", "Heirloom roses, a grandmother's peonies, a garden at the end of its season. Open commissions accepted year-round."]
];

const PLANNER_POINTS = [
  "Referral commission: 15% of booked value",
  "Planner and florist wholesale pricing available",
  "Works as a post-wedding gift or ceremony keepsake",
  "Highly shareable and distinctive, not generic"
];

export default function CommissionsPage() {
  return (
    <main className="swiss-page">
      {/* FAQPage schema — rendered from the same data as the visible FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      {/* ---- hero ---- */}
      <section className="cm-hero">
        <div className="cm-hero-content">
          <p className="sw-label">
            Commissions <span className="live">· Open</span>
          </p>
          <h1 className="cm-headline">
            bouquet
            <br />
            commissions<span className="dot">.</span>
          </h1>
          <p className="cm-hero-body">
            Archival fine art prints made from your real flowers. Wedding
            bouquets, memorial arrangements, and garden blooms, scanned at 1200
            DPI and printed on archival matte fine art paper.
          </p>
          <div className="cm-actions">
            <a href="#reserve" className="sw-btn">
              Reserve your date
            </a>
            <a href="#gallery" className="sw-btn-ghost">
              View the work
            </a>
          </div>
          <p className="cm-price-line">Commissions from $95 · prints from $295</p>
        </div>
        <figure className="cm-hero-figure">
          <Image
            src={galleryImage(HERO.driveId, 1000)}
            alt="Botanical scanography print of a wedding bouquet, scanned at 1200 DPI"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            unoptimized
          />
        </figure>
      </section>

      {/* ---- photo strip ---- */}
      <div className="cm-strip" aria-hidden="true">
        {STRIP.map((p) => (
          <div className="cm-strip-img" key={p.id}>
            <Image
              src={galleryImage(p.driveId, 500)}
              alt=""
              fill
              sizes="20vw"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* ---- statement ---- */}
      <section className="cm-statement">
        <p>
          Your flowers are scanned, not pressed.{" "}
          <span className="quiet">
            Each bloom is arranged on the scanner glass, captured at 1200 DPI,
            and printed on archival paper rated for 100+ years.
          </span>
        </p>
      </section>

      <div className="swiss-wrap">
        {/* ---- process ---- */}
        <section className="sw-mt" id="process">
          <p className="sw-label sw-label-gap">How it works</p>
          <div className="steps-grid">
            {PROCESS.map(([n, title, body]) => (
              <div className="step" key={n}>
                <div className="step-num">{n}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-body">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- deposit / reserve ---- */}
        <section className="sw-mt" id="reserve">
          <div className="sw-section-head">
            <p className="sw-label">Reserve</p>
            <h2 className="sw-title">
              hold your commission date<span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              A flat deposit reserves your slot and is credited in full toward
              your final commission price. Pick the band that matches the piece
              you have in mind — if you&rsquo;re between two, choose the lower
              one and we&rsquo;ll settle the balance after your consult. Full
              pricing is on the{" "}
              <Link href="/pricing" className="sw-inline-link">
                pricing page
              </Link>
              .
            </p>
          </div>
          <DepositBox />
        </section>

        {/* ---- consult booking ---- */}
        <section className="sw-mt" id="consult">
          <div className="sw-section-head">
            <p className="sw-label">Next step</p>
            <h2 className="sw-title">
              book your consult<span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              Every commission starts with a short conversation about your
              flowers, your space, and which package fits. Book before or after
              paying your deposit — either order works.
            </p>
          </div>
          <div className="cm-calendly">
            <iframe
              src={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=ffffff&text_color=111111&primary_color=e30613`}
              title="Book a commission consult with Zolomon Prints"
              loading="lazy"
            />
          </div>
          <p className="note">
            Calendar not loading?{" "}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sw-inline-link"
            >
              Open the booking page in a new tab
            </a>
            .
          </p>
        </section>

        {/* ---- gallery ---- */}
        <section className="sw-mt" id="gallery">
          <div className="sw-section-head">
            <p className="sw-label">Selected work</p>
            <h2 className="sw-title">
              the work<span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              Open-edition prints from past scans. Commission pieces are made
              from your own flowers and are never resold.
            </p>
          </div>
          <div className="grid">
            {PRINTS.slice(0, 8).map((p) => (
              <Link key={p.id} href={`/prints/${p.id}`} className="card">
                <div className="frame">
                  <Image
                    src={galleryImage(p.driveId, 800)}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
                <div className="meta">
                  <span className="title">{p.title}</span>
                  <span className="from">view</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---- occasions ---- */}
        <section className="sw-mt" id="occasions">
          <div className="sw-section-head">
            <p className="sw-label">Commissions</p>
            <h2 className="sw-title">
              for flowers that meant something<span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              Scanography works for any flowers from any occasion, including
              wedding bouquets, sympathy arrangements, baby showers, and any of
              life&rsquo;s special moments.
            </p>
          </div>
          <div className="steps-grid">
            {OCCASIONS.map(([name, desc]) => (
              <div className="step" key={name}>
                <h3 className="step-title">{name}</h3>
                <p className="step-body">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- planner, dark ---- */}
      <section className="dark-section" id="planners">
        <div className="swiss-wrap">
          <div className="sw-section-head">
            <p className="sw-label">For wedding planners &amp; florists</p>
            <h2 className="sw-title">
              a high-touch add-on your clients will post about
              <span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              Scanography commissions are available to wedding planners,
              florists, and studios as a white-label luxury add-on. Partner
              pricing lets you incorporate the artwork directly into your
              packages at your own markup, or refer clients directly for a
              referral fee.
            </p>
          </div>
          <ul className="pkg-includes cm-planner-points">
            {PLANNER_POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className="cm-actions">
            <Link href="/pricing" className="sw-btn-ghost on-dark">
              See partner pricing
            </Link>
            <a
              href="mailto:zoey@zolomonprints.com?subject=Planner Partnership"
              className="sw-btn-ghost on-dark"
            >
              Request partnership info
            </a>
          </div>
        </div>
      </section>

      <div className="swiss-wrap">
        {/* ---- faq ---- */}
        <section className="sw-mt" id="faq">
          <div className="sw-section-head">
            <p className="sw-label">Questions</p>
            <h2 className="sw-title">
              what you might want to know<span className="dot">.</span>
            </h2>
          </div>
          {FAQS.map((f) => (
            <div className="faq-item" key={f.q}>
              <div className="faq-q">{f.q}</div>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </section>

        {/* ---- inquiry ---- */}
        <section className="sw-mt sw-mb" id="commission">
          <div className="sw-section-head">
            <p className="sw-label">
              Commission <span className="live">· Open</span>
            </p>
            <h2 className="sw-title">
              begin a commission<span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              Send your bouquet within a few days of your event; fresh flowers
              create the most detail. Tiers range from a set of Garden Cards to
              the full Estate Collection.
            </p>
            <p className="cm-pricing-line">
              Garden Cards $95 · Keepsake $295 · Portrait $895 · Heirloom $1,350
              · Estate Collection $2,600
            </p>
          </div>
          <InquiryForm />
        </section>
      </div>
    </main>
  );
}
