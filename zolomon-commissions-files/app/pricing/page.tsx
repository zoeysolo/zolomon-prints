import type { Metadata } from "next";
import Link from "next/link";
import PackageCard from "./package-card";
import {
  GardenCardsDiagram,
  KeepsakeDiagram,
  PortraitDiagram,
  HeirloomDiagram,
  EstateDiagram,
  StudyDiagram,
  GardenDiagram,
  SalonDiagram,
  MonumentDiagram,
  SingularDiagram
} from "./diagrams";

export const metadata: Metadata = {
  title: "Commission Pricing & Partnership Guide — Zolomon Prints",
  description:
    "Full commission pricing for botanical scanography, from garden cards through the estate collection, plus the florist and planner partnership programme."
};

const STEPS = [
  {
    n: "01",
    title: "You mention it",
    body: (
      <>
        Tell your couples before the wedding:{" "}
        <strong>
          &ldquo;We partner with a botanical artist who can turn your bouquet
          into a permanent archival print. It&rsquo;s something we&rsquo;re
          really proud to offer.&rdquo;
        </strong>
      </>
    )
  },
  {
    n: "02",
    title: "Flowers are picked up",
    body: "Within 24 hours of the event, stems are collected, either by the couple or picked up directly by the studio. Flowers stay in water until then; no special prep needed on your end."
  },
  {
    n: "03",
    title: "The print is made",
    body: "Each arrangement is scanned at 1200 DPI and composed into an archival fine art print. The couple receives their finished piece within 10 to 28 business days depending on the package."
  },
  {
    n: "04",
    title: "You earn 15%",
    body: "On every completed commission that comes through your referral, you receive 15% of the order value, paid within 7 days of delivery via Venmo, Zelle, or check."
  }
];

const FLORIST_RECEIVES = [
  ["15% referral commission", "paid on all completed commissions, no minimum"],
  ["Preferred partner listing", "featured on zolomon.studio with backlink to your site"],
  ["Co-branded client materials", "cards and inserts for your welcome packets, at no cost"],
  ["Styled shoot collaboration", "portfolio content for both studios, complimentary"],
  ["Artist credit on prints", "your studio name appears on the certificate of authenticity"]
];

const CLIENT_RECEIVES = [
  ["A permanent object", "their flowers, exactly as arranged, on their wall forever"],
  ["Archival giclée print", "museum-quality paper, 100+ year fade resistance"],
  ["High-res digital files", "included with every commission for personal use"],
  ["Artist's signature", "signed and dated on all physical prints"],
  ["Certificate of authenticity", "documenting the flowers, date, and arrangement"]
];

const TIMELINE = [
  ["Wedding day", "Bouquet set aside after reception; kept in water overnight", "Couple or venue"],
  ["Morning after", "Flowers picked up or dropped at studio, stems still fresh", "Studio or couple"],
  ["Days 1–3", "Scanning session; compositions selected and approved", "Studio"],
  ["Week 2–4", "Print produced on archival paper; signed and packaged", "Studio"],
  ["Delivery", "Print shipped or hand-delivered; referral commission paid out", "Studio pays florist"]
];

const REFERRALS: [string, string, string, string, boolean][] = [
  ["Garden Cards", "Set of 25 · 5×7 cards", "$95", "$14", false],
  ["Keepsake", "One 8×10 print", "$295", "$44", false],
  ["Portrait", "One 11×14 print", "$895", "$134", false],
  ["Heirloom", "Two 16×20 prints + folio", "$1,350", "$203", true],
  ["Garden", "Six-print gallery wall", "$2,400", "$360", true],
  ["Salon", "Nine-print gallery wall", "$4,800", "$720", true]
];

const ADDONS = [
  ["Additional 8×10 print", null, "$145"],
  ["Additional 11×14 print", null, "$195"],
  ["Additional 16×20 print", null, "$285"],
  ["Additional 20×24 print", null, "$385"],
  ["Upgrade to 40×70", "replaces largest print in any package", "+$900"],
  ["Third arrangement", "added to any package", "+$525"],
  ["Custom mat + frame", "standard sizing", "from $295"],
  ["Rush delivery", "5 business day turnaround", "+$350"],
  ["Extended travel", "beyond 45 min from studio", "$1.75/mi"]
];

const B2B = [
  ["Referral commission", "paid on all completed commissions", "15%"],
  ["Wholesale / white-label rate", "for florists bundling into packages", "contact"],
  ["Preferred partner status", "priority scheduling, co-branded materials", "invite only"],
  ["Styled shoot collaboration", "portfolio builds for both parties", "complimentary"]
];

function AddonList({ items }: { items: (string | null)[][] }) {
  return (
    <div className="addon-list">
      {items.map(([name, note, price]) => (
        <div className="addon-item" key={name}>
          <div>
            <span className="addon-name">{name}</span>
            {note && <span className="addon-note">{note}</span>}
          </div>
          {price && <span className="addon-price">{price}</span>}
        </div>
      ))}
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="swiss-page">
      <div className="swiss-wrap">
        <header className="sw-header">
          <p className="sw-studio">
            ZolomonPrints Studio · <span className="live">Botanical Scanography</span>
          </p>
          <h1>
            partnership guide<span className="dot">.</span>
          </h1>
        </header>

        {/* ---- how it works ---- */}
        <section>
          <div className="sw-section-head">
            <p className="sw-label">The Partnership</p>
            <h2 className="sw-title">
              how it works<span className="dot">.</span>
            </h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>

          <hr className="sw-rule-light" />

          <div className="two-col" style={{ marginBottom: "32px" }}>
            <div>
              <p className="sw-label sw-label-gap">What you receive</p>
              <AddonList items={FLORIST_RECEIVES.map(([n, note]) => [n, note, null])} />
            </div>
            <div>
              <p className="sw-label sw-label-gap">What your clients receive</p>
              <AddonList items={CLIENT_RECEIVES.map(([n, note]) => [n, note, null])} />
            </div>
          </div>

          <div>
            <p className="sw-label sw-label-gap">Client timeline · what to tell couples</p>
            <table className="sw-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>What happens</th>
                  <th>Who handles it</th>
                </tr>
              </thead>
              <tbody>
                {TIMELINE.map(([when, what, who]) => (
                  <tr key={when}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span className="mix-label">{when}</span>
                    </td>
                    <td>
                      <span className="mix-sub">{what}</span>
                    </td>
                    <td>
                      <span className="mix-sub">{who}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "32px" }}>
            <p className="sw-label sw-label-gap">Referral earnings at a glance</p>
            <table className="sw-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Commission price</th>
                  <th style={{ textAlign: "right" }}>Your 15%</th>
                </tr>
              </thead>
              <tbody>
                {REFERRALS.map(([name, sub, price, cut, hi]) => (
                  <tr key={name}>
                    <td>
                      <span className="mix-label">{name}</span>
                      <span className="mix-sub">{sub}</span>
                    </td>
                    <td>
                      <span className="val-lg">{price}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className={hi ? "val-lg hi" : "val-lg"}>{cut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="sw-note">
              15% paid after confirmed delivery. No invoicing required; the studio
              pays out within 7 days of delivery confirmation. Payment via Venmo,
              Zelle, or check.
            </p>
          </div>
        </section>

        <hr className="sw-rule" />

        <section className="production-note">
          <p className="sw-label" style={{ marginBottom: "10px" }}>
            Print Production
          </p>
          <p>
            All prints are produced on archival giclée equipment using
            pigment-based inks on museum-quality paper, including Hahnemühle
            German Etching, Cotton Rag Hot Press, and Epson Somerset Velvet.
            Available sizes range from 8×10 up to 40×70 inches. Every print is
            produced to last 100+ years without fading.
          </p>
        </section>

        {/* ---- individual commissions ---- */}
        <section className="sw-mt">
          <div className="sw-section-head">
            <p className="sw-label">Service Packages</p>
            <h2 className="sw-title">
              individual commissions<span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              Arrangement-based commissions: one, two, or three bouquets captured
              as archival scans and delivered as prints.
            </p>
          </div>

          <PackageCard
            tier="Cards"
            name="garden cards"
            price="$95"
            priceNote="set of 25"
            desc="A crop from your bouquet scan printed as a set of 5×7 flat cards: thank-you notes, guest keepsakes, or mail for anyone who couldn't be there."
            includes={[
              "25 cards printed on archival flat card stock",
              "5×7 format, mailable without a large envelope",
              "Botanical scan crop curated from your arrangement",
              "Blank back for handwritten notes",
              "Set of 50 available for $165 · set of 100 for $275"
            ]}
            diagram={<GardenCardsDiagram />}
          />
          <PackageCard
            tier="Entry"
            name="keepsake"
            price="$295"
            priceNote="digital + print"
            desc="A single archival print from your florals."
            includes={[
              "One arrangement scanned",
              "Up to 3 compositions (high-res TIF/JPG)",
              "One 8×10 archival giclée print",
              "Personal use license",
              "Artist signature"
            ]}
            diagram={<KeepsakeDiagram />}
          />
          <PackageCard
            tier="Tier I"
            name="portrait"
            price="$895"
            priceNote="digital + print"
            desc="A full bouquet rendered in archival ink. Includes a signed giclée print suitable for framing: a permanent object made from a fleeting one."
            includes={[
              "Full bouquet scanned",
              "Up to 5 compositions",
              "All digital files",
              "One 11×14 archival giclée print",
              "Artist signature"
            ]}
            diagram={<PortraitDiagram />}
          />
          <PackageCard
            tier="Tier II"
            name="heirloom"
            price="$1,350"
            priceNote="two prints + folio"
            desc="Two arrangements, bouquet and a secondary piece, composed as a complete suite. Two large-format prints delivered in a presentation folio."
            includes={[
              "Bouquet + one secondary arrangement",
              "Up to 8 compositions",
              "All digital files",
              "Two 16×20 archival giclée prints",
              "Artist signature on each print"
            ]}
            diagram={<HeirloomDiagram />}
          />
          <PackageCard
            tier="Tier III"
            name="estate collection"
            price="$2,600"
            priceNote="full collection"
            desc="A comprehensive commission spanning up to three arrangements from your event. For couples who want a complete botanical record, something to pass down."
            includes={[
              "Up to three arrangements",
              "Unlimited compositions",
              "All digital files, full reproduction rights",
              "Four prints (your choice of sizes up to 20×24)",
              "Artist's written statement for each piece"
            ]}
            diagram={<EstateDiagram />}
            last
          />
        </section>

        <hr className="sw-rule" />

        {/* ---- gallery walls ---- */}
        <section>
          <div className="sw-section-head">
            <p className="sw-label">Gallery Wall Collections</p>
            <h2 className="sw-title">
              multiple compositions, one bouquet<span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              Each bouquet yields 10 to 15 distinct scan compositions: full
              arrangements, individual stems, close crops, abstract sections. You
              choose your wall size; the studio selects the strongest compositions
              to fill it.
            </p>
          </div>

          <PackageCard
            tier="Gallery Wall I"
            name="study"
            price="$495"
            priceNote="3 prints"
            desc="A focused triptych. Three compositions drawn from the same bouquet. Ideal for a bedroom, entryway, or smaller wall where the eye lands on one thing."
            includes={[
              "3 compositions curated from your bouquet",
              "All digital files (high-res TIF + JPG)",
              "One 11×14 + two 8×10 archival giclée prints",
              "Suggested hanging configuration"
            ]}
            diagram={<StudyDiagram />}
          />
          <PackageCard
            tier="Gallery Wall II"
            name="garden"
            price="$2,400"
            priceNote="6 prints"
            desc="A classic gallery wall: six compositions from a single bouquet filling a living or dining room with botanical depth. Mixed sizes create movement. The most versatile configuration."
            includes={[
              "6 compositions curated from your bouquet",
              "All digital files",
              "One 16×20 + two 11×14 + three 8×10 archival giclée prints",
              "Choice of two hanging configurations",
              "Artist signature on 16×20"
            ]}
            diagram={<GardenDiagram />}
          />
          <PackageCard
            tier="Gallery Wall III"
            name="salon"
            price="$4,800"
            priceNote="9 prints"
            desc="A full salon-style wall, nine compositions from your bouquet filling a statement space. The flowers become an environment."
            includes={[
              "9 compositions curated from your bouquet",
              "All digital files",
              "One 20×24 + three 11×14 + five 8×10 archival giclée prints",
              "Choice of three hanging configurations",
              "Artist signature on all prints"
            ]}
            diagram={<SalonDiagram />}
            last
          />
        </section>
      </div>

      {/* ---- large format, dark ---- */}
      <section className="dark-section">
        <div className="swiss-wrap">
          <div className="sw-section-head">
            <p className="sw-label">Large Format</p>
            <h2 className="sw-title">
              40 × 70 inches<span className="dot">.</span>
            </h2>
            <p className="sw-desc">
              A single scan composition printed at mural scale. At 40×70 inches,
              one botanical becomes the defining object in a room. Available as
              the anchor of a curated collection, or as a standalone commission.
            </p>
          </div>

          <PackageCard
            featured="Centerpiece Tier"
            tier="Large Format I"
            name="monument"
            price="$9,800"
            priceNote="hero + 6 prints"
            desc="One composition at 40×70 inches, paired with six supporting prints from the same bouquet. A complete room: statement and context together."
            includes={[
              "One 40×70 hero composition",
              "Six supporting prints (mix of 11×14 and 8×10)",
              "All digital files",
              "Custom layout consultation",
              "Artist signature on all pieces",
              "Written artist's statement"
            ]}
            diagram={<MonumentDiagram />}
          />
          <PackageCard
            tier="Large Format II"
            name="singular"
            price="$5,500"
            priceNote="one 40×70"
            desc="One composition, one print. 40 × 70 inches. For the couple who wants a single defining object."
            includes={[
              "One scan",
              "Digital file included",
              "One 40×70 archival large format print",
              "Artist signature",
              "Written artist's statement"
            ]}
            diagram={<SingularDiagram />}
            last
          />
        </div>
      </section>

      <div className="swiss-wrap">
        <section className="sw-mt">
          <div className="two-col">
            <div>
              <p className="sw-label sw-label-gap">Add-Ons</p>
              <AddonList items={ADDONS} />
            </div>
            <div>
              <p className="sw-label sw-label-gap">For Florists &amp; Planners</p>
              <AddonList items={B2B} />
            </div>
          </div>
        </section>

        <section className="sw-cta">
          <p className="sw-label sw-label-gap">Ready to begin</p>
          <p className="sw-desc" style={{ marginBottom: "20px" }}>
            Reserve your commission date with a deposit, credited in full toward
            your final price.
          </p>
          <Link href="/commissions" className="sw-btn">
            begin a commission<span className="dot">.</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
