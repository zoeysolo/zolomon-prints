import Image from "next/image";
import Link from "next/link";
import {
  DROPS,
  Print,
  SIZES,
  currentDrop,
  galleryImage,
  isDropOpen,
  printsInDrop
} from "@/lib/catalog";

const minPrice = Math.min(...SIZES.map((s) => s.priceUsd));

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function PrintGrid({ prints, open }: { prints: Print[]; open: boolean }) {
  return (
    <div className="grid">
      {prints.map((p) => (
        <Link key={p.id} href={`/prints/${p.id}`} className="card">
          <div className="frame" style={open ? undefined : { opacity: 0.55 }}>
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
            <span className="from">{open ? `from $${minPrice}` : "closed"}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const featured = currentDrop();
  const past = [...DROPS]
    .sort((a, b) => b.number - a.number)
    .filter((d) => d.id !== featured.id);

  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="drop-label">
            drop {String(featured.number).padStart(2, "0")} —{" "}
            {isDropOpen(featured) ? (
              <span className="live">live now</span>
            ) : (
              "closed"
            )}
            {featured.closesAt && isDropOpen(featured) && (
              <> · closes {fmtDate(featured.closesAt)}</>
            )}
          </div>
          <h1>
            {featured.name.toLowerCase()}
            <em>.</em>
          </h1>
          <p>
            A limited release of original botanical scans, printed to order on
            archival matte fine art paper. Available until the next drop lands.
            Released {fmtDate(featured.releaseDate)}.
          </p>
        </div>
      </section>

      <section className="container">
        <PrintGrid prints={printsInDrop(featured.id)} open={isDropOpen(featured)} />
      </section>

      {past.map((drop) => {
        const open = isDropOpen(drop);
        return (
          <section key={drop.id}>
            <div className="filter-bar">
              <div className="container" style={{ justifyContent: "space-between" }}>
                <span>
                  drop {String(drop.number).padStart(2, "0")} —{" "}
                  {drop.name.toLowerCase()}
                </span>
                <span style={{ color: open ? "var(--black)" : "var(--grey)" }}>
                  {open ? "still available" : "closed"}
                </span>
              </div>
            </div>
            <div className="container">
              <PrintGrid prints={printsInDrop(drop.id)} open={open} />
            </div>
          </section>
        );
      })}
    </main>
  );
}
