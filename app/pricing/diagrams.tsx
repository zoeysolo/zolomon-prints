// Package diagrams — schematic print layouts, drawn as inline SVG so they
// stay crisp and inherit no external assets. Each has a unique filter id;
// duplicate ids across inlined SVGs would cross-wire the drop shadows.

const SHADOW = "#00000018";

function Shadow({ id, dark }: { id: string; dark?: boolean }) {
  return (
    <defs>
      <filter id={id}>
        <feDropShadow
          dx={dark ? 1.5 : 1}
          dy={dark ? 2 : 1.5}
          stdDeviation={dark ? 3 : 2}
          floodColor={dark ? "#00000060" : SHADOW}
        />
      </filter>
    </defs>
  );
}

const label = {
  fontFamily: "Helvetica,Arial,sans-serif",
  fill: "#767676"
} as const;

export function GardenCardsDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="dgc" />
      <rect width="210" height="140" fill="#f2f2f2" />
      <rect x="42" y="38" width="76" height="54" fill="#fafafa" stroke="#d5d5d5" strokeWidth="0.5" transform="rotate(-8 80 65)" filter="url(#dgc)" />
      <rect x="58" y="34" width="76" height="54" fill="#fcfcfc" stroke="#d5d5d5" strokeWidth="0.5" transform="rotate(-2 96 61)" filter="url(#dgc)" />
      <rect x="72" y="32" width="76" height="54" fill="#ffffff" stroke="#111111" strokeWidth="0.75" filter="url(#dgc)" />
      <text x="105" y="110" fontSize="7" textAnchor="middle" {...label}>
        5 × 7 · archival card stock
      </text>
    </svg>
  );
}

export function KeepsakeDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="dk" />
      <rect width="210" height="140" fill="#f2f2f2" />
      <rect x="75" y="18" width="60" height="80" fill="#ffffff" stroke="#111111" strokeWidth="0.75" filter="url(#dk)" />
      <text x="105" y="115" fontSize="7" textAnchor="middle" {...label}>
        8 × 10 archival giclée
      </text>
    </svg>
  );
}

export function PortraitDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="db" />
      <rect width="210" height="140" fill="#f2f2f2" />
      <rect x="60" y="14" width="90" height="112" fill="#ffffff" stroke="#111111" strokeWidth="0.75" filter="url(#db)" />
      <text x="105" y="136" fontSize="7" textAnchor="middle" {...label}>
        11 × 14 archival giclée
      </text>
    </svg>
  );
}

export function HeirloomDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="dc" />
      <rect width="210" height="140" fill="#f2f2f2" />
      <rect x="10" y="20" width="190" height="105" fill="#e8e8e8" stroke="#d5d5d5" strokeWidth="0.5" />
      <rect x="20" y="26" width="82" height="93" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#dc)" />
      <rect x="108" y="26" width="82" height="93" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#dc)" />
      <text x="105" y="136" fontSize="7" textAnchor="middle" {...label}>
        two 16×20 · linen folio
      </text>
    </svg>
  );
}

export function EstateDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="dd" />
      <rect width="210" height="140" fill="#f2f2f2" />
      <rect x="12" y="10" width="90" height="56" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#dd)" />
      <rect x="108" y="10" width="90" height="56" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#dd)" />
      <rect x="12" y="72" width="90" height="56" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#dd)" />
      <rect x="108" y="72" width="90" height="56" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#dd)" />
      <text x="105" y="137" fontSize="6.5" textAnchor="middle" {...label}>
        four prints · sizes up to 20×24 · archival box
      </text>
    </svg>
  );
}

export function StudyDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="d1" />
      <rect width="210" height="140" fill="#f2f2f2" />
      <rect x="18" y="16" width="82" height="108" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d1)" />
      <rect x="110" y="16" width="82" height="50" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d1)" />
      <rect x="110" y="74" width="82" height="50" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d1)" />
      <text x="105" y="135" fontSize="6.5" textAnchor="middle" {...label}>
        11×14 · 8×10 · 8×10
      </text>
    </svg>
  );
}

export function GardenDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="d2" />
      <rect width="210" height="140" fill="#f2f2f2" />
      <rect x="12" y="12" width="76" height="55" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d2)" />
      <rect x="96" y="12" width="50" height="55" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d2)" />
      <rect x="154" y="12" width="46" height="55" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d2)" />
      <rect x="12" y="74" width="50" height="55" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d2)" />
      <rect x="70" y="74" width="68" height="55" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d2)" />
      <rect x="146" y="74" width="54" height="55" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d2)" />
      <text x="105" y="137" fontSize="6" textAnchor="middle" {...label}>
        16×20 · 11×14 · 11×14 · 8×10 · 8×10 · 8×10
      </text>
    </svg>
  );
}

export function SalonDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="d3" />
      <rect width="210" height="140" fill="#f2f2f2" />
      <rect x="10" y="10" width="72" height="93" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d3)" />
      <rect x="90" y="10" width="55" height="42" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d3)" />
      <rect x="153" y="10" width="47" height="42" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d3)" />
      <rect x="90" y="59" width="110" height="44" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d3)" />
      <rect x="10" y="110" width="46" height="22" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d3)" />
      <rect x="63" y="110" width="46" height="22" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d3)" />
      <rect x="116" y="110" width="46" height="22" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d3)" />
      <rect x="169" y="110" width="31" height="22" fill="#ffffff" stroke="#111111" strokeWidth="0.6" filter="url(#d3)" />
      <text x="105" y="139" fontSize="6" textAnchor="middle" {...label}>
        20×24 · 11×14 (×3) · 8×10 (×5)
      </text>
    </svg>
  );
}

export function MonumentDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <Shadow id="d4" dark />
      <rect width="210" height="140" fill="#0a0a0a" />
      <rect x="10" y="8" width="88" height="124" fill="#1c1c1c" stroke="#e30613" strokeWidth="1" filter="url(#d4)" />
      <text x="54" y="73" fontSize="7.5" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fill="#ffffff">
        40 × 70&quot;
      </text>
      <rect x="108" y="8" width="48" height="36" fill="#1c1c1c" stroke="#3a3a3a" strokeWidth="0.5" filter="url(#d4)" />
      <rect x="162" y="8" width="38" height="36" fill="#1c1c1c" stroke="#3a3a3a" strokeWidth="0.5" filter="url(#d4)" />
      <rect x="108" y="50" width="48" height="36" fill="#1c1c1c" stroke="#3a3a3a" strokeWidth="0.5" filter="url(#d4)" />
      <rect x="162" y="50" width="38" height="36" fill="#1c1c1c" stroke="#3a3a3a" strokeWidth="0.5" filter="url(#d4)" />
      <rect x="108" y="92" width="48" height="40" fill="#1c1c1c" stroke="#3a3a3a" strokeWidth="0.5" filter="url(#d4)" />
      <rect x="162" y="92" width="38" height="40" fill="#1c1c1c" stroke="#3a3a3a" strokeWidth="0.5" filter="url(#d4)" />
    </svg>
  );
}

export function SingularDiagram() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="d5">
          <feDropShadow dx="2" dy="3" stdDeviation="5" floodColor="#00000070" />
        </filter>
      </defs>
      <rect width="210" height="140" fill="#0a0a0a" />
      <rect x="35" y="10" width="140" height="120" fill="#1c1c1c" stroke="#e30613" strokeWidth="1.25" filter="url(#d5)" />
      <text x="105" y="74" fontSize="8.5" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fill="#ffffff">
        40 × 70&quot;
      </text>
    </svg>
  );
}
