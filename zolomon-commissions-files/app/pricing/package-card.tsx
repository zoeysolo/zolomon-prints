import { ReactNode } from "react";

// A single commission package row: diagram on the left, spec on the right.
// Used by both the light sections and the dark large-format section.

export interface PackageCardProps {
  tier: string;
  name: string;
  price: string;
  priceNote: string;
  desc: string;
  includes: string[];
  diagram: ReactNode;
  featured?: string;
  last?: boolean;
}

export default function PackageCard({
  tier,
  name,
  price,
  priceNote,
  desc,
  includes,
  diagram,
  featured,
  last
}: PackageCardProps) {
  return (
    <div className="pkg" style={last ? { borderBottom: "none" } : undefined}>
      <div className="pkg-diagram">{diagram}</div>
      <div>
        {featured && <div className="pkg-featured">{featured}</div>}
        <div className="pkg-head">
          <div>
            <p className="pkg-tier">{tier}</p>
            <h3 className="pkg-name">{name}</h3>
          </div>
          <div>
            <div className="pkg-price">{price}</div>
            <div className="pkg-price-note">{priceNote}</div>
          </div>
        </div>
        <p className="pkg-desc">{desc}</p>
        <ul className="pkg-includes">
          {includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
