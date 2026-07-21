import Image from "next/image";
import { notFound } from "next/navigation";
import { PRINTS, getDrop, getPrint, galleryImage, isPrintAvailable } from "@/lib/catalog";
import BuyBox from "./buy-box";

export function generateStaticParams() {
  return PRINTS.map((p) => ({ id: p.id }));
}

export default function PrintPage({ params }: { params: { id: string } }) {
  const print = getPrint(params.id);
  if (!print) notFound();
  const drop = getDrop(print.dropId);
  const available = isPrintAvailable(print);

  return (
    <main className="container">
      <div className="detail">
        <div className="image">
          <Image
            src={galleryImage(print.driveId, 1400)}
            alt={print.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            unoptimized
          />
        </div>
        <div className="panel">
          <span className="crumb">
            {drop
              ? `drop ${String(drop.number).padStart(2, "0")} — ${drop.name}`
              : print.collection}
          </span>
          <h1>{print.title}</h1>
          <BuyBox printId={print.id} available={available} />
          <div className="spec" style={{ marginTop: "24px" }}>
            archival matte fine art paper · unframed
          </div>
          <div className="spec">printed to order · ships in 2–5 business days</div>
        </div>
      </div>
    </main>
  );
}
