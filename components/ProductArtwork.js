import { useId } from 'react';

const ART = [
  { test: /jetson|raspberry|single.board|developer kit|edge ai/i, kind: 'board', label: 'EDGE AI' },
  { test: /lock|deadbolt|mortise/i, kind: 'lock', label: 'SMART SECURITY' },
  { test: /sdr|radio|ubertooth|flipper|cyber|sniffer/i, kind: 'radio', label: 'WIRELESS TOOLS' },
  { test: /vacuum|robot vacuum/i, kind: 'vacuum', label: 'HOME ROBOTICS' },
  { test: /matter|thread|gateway|hub|smart home/i, kind: 'hub', label: 'CONNECTED HOME' },
  { test: /drone|aerial|gimbal|robotics/i, kind: 'drone', label: 'AERIAL TECH' },
  { test: /thermal|camera|surveillance|doorbell/i, kind: 'camera', label: 'SMART SECURITY' },
  { test: /wearable|headset|glasses|ring|tracker/i, kind: 'wearable', label: 'EVERYDAY TECH' },
  { test: /caliper|solder|probe|sensor|lab|workshop/i, kind: 'tool', label: 'PRECISION TOOLS' },
];

function Device({ kind }) {
  const common = { stroke: '#C9D8E8', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'board': return <g {...common}>
      <rect x="286" y="190" width="228" height="188" rx="22" fill="#18334B" stroke="#50728C" />
      <rect x="356" y="236" width="88" height="80" rx="10" fill="#102338" stroke="#FFC21A" />
      <path d="M369 250h62m-62 14h62m-62 14h62m-62 14h62" stroke="#6CC6AE" strokeWidth="4" />
      <rect x="306" y="214" width="32" height="20" rx="4" fill="#9AAFC0" /><rect x="460" y="214" width="32" height="20" rx="4" fill="#9AAFC0" />
      <path d="M316 378v20m24-20v20m24-20v20m24-20v20m24-20v20m24-20v20m24-20v20m24-20v20m24-20v20" stroke="#FFC21A" />
      <circle cx="325" cy="274" r="7" fill="#FFC21A" stroke="none" /><circle cx="475" cy="304" r="7" fill="#6CC6AE" stroke="none" />
    </g>;
    case 'lock': return <g {...common}>
      <rect x="320" y="160" width="160" height="235" rx="28" fill="#DCE8EF" stroke="#91A9B9" />
      <rect x="337" y="178" width="126" height="199" rx="20" fill="#22384A" stroke="#C9D8E8" />
      <rect x="353" y="206" width="94" height="60" rx="13" fill="#102338" stroke="#536F83" />
      <circle cx="400" cy="235" r="15" fill="none" stroke="#FFC21A" strokeWidth="4" /><path d="M400 220v30m-15-15h30" stroke="#6CC6AE" />
      <circle cx="400" cy="315" r="23" fill="#101F2D" stroke="#FFC21A" /><circle cx="400" cy="315" r="6" fill="#FFC21A" stroke="none" />
      <path d="M400 338v17" />
    </g>;
    case 'radio': return <g {...common}>
      <rect x="330" y="150" width="140" height="250" rx="28" fill="#111C27" stroke="#536F83" />
      <rect x="348" y="172" width="104" height="112" rx="12" fill="#18334B" stroke="#56768C" />
      <path d="M365 251l17-33 17 18 22-38 15 53" fill="none" stroke="#6CC6AE" strokeWidth="5" />
      <circle cx="370" cy="319" r="8" fill="#FFC21A" stroke="none" /><circle cx="400" cy="319" r="8" fill="#6CC6AE" stroke="none" /><circle cx="430" cy="319" r="8" fill="#FFC21A" stroke="none" />
      <path d="M360 357h80m-65 18h50" stroke="#829BAE" />
      <path d="M400 150V119m-18 31 18-32 18 32" fill="none" stroke="#FFC21A" strokeWidth="4" />
    </g>;
    case 'vacuum': return <g {...common}>
      <ellipse cx="400" cy="303" rx="126" ry="90" fill="#E9EFF2" stroke="#A9BBC5" strokeWidth="5" />
      <ellipse cx="400" cy="291" rx="91" ry="62" fill="#D3DEE3" stroke="#A9BBC5" />
      <circle cx="400" cy="267" r="22" fill="#18334B" stroke="#FFC21A" strokeWidth="4" /><circle cx="400" cy="267" r="8" fill="#6CC6AE" stroke="none" />
      <path d="M292 320l-25 18m241-18 25 18" stroke="#18334B" strokeWidth="8" />
      <path d="M310 355l-18 22m196-22 18 22" stroke="#FFC21A" strokeWidth="7" />
      <rect x="477" y="213" width="72" height="104" rx="14" fill="#344E60" stroke="#7893A3" /><path d="M490 234h46m-46 14h46" stroke="#6CC6AE" />
    </g>;
    case 'drone': return <g {...common}>
      <path d="M400 264l44-20 34 23-48 28z" fill="#20394b" stroke="#879ead" />
      <path d="M400 264l-44-20-34 23 48 28z" fill="#20394b" stroke="#879ead" />
      <path d="M430 283l18 46-25 32-22-58z" fill="#20394b" stroke="#879ead" />
      <path d="M370 283l-18 46 25 32 22-58z" fill="#20394b" stroke="#879ead" />
      <path d="M362 255l-70-24m108 22-48-49m86 49 48-49m-48 51 70-24m-109 80-48 40m86-40 48 40" stroke="#C9D8E8" strokeWidth="6" />
      <ellipse cx="278" cy="228" rx="45" ry="8" fill="#18334B" stroke="#6CC6AE" /><ellipse cx="348" cy="198" rx="38" ry="7" fill="#18334B" stroke="#6CC6AE" />
      <ellipse cx="452" cy="198" rx="38" ry="7" fill="#18334B" stroke="#6CC6AE" /><ellipse cx="522" cy="228" rx="45" ry="8" fill="#18334B" stroke="#6CC6AE" />
      <rect x="377" y="260" width="46" height="44" rx="15" fill="#DCE8EF" stroke="#91A9B9" />
      <circle cx="400" cy="280" r="11" fill="#101F2D" stroke="#FFC21A" strokeWidth="4" />
      <path d="M388 304v31m24-31v31" stroke="#FFC21A" strokeWidth="4" />
    </g>;
    case 'hub': return <g {...common}>
      <rect x="296" y="206" width="208" height="142" rx="35" fill="#EAF0F4" stroke="#A5B7C1" strokeWidth="4" />
      <rect x="313" y="222" width="174" height="110" rx="27" fill="#18334B" stroke="#617D90" />
      <circle cx="400" cy="277" r="28" fill="#102338" stroke="#6CC6AE" strokeWidth="4" />
      <circle cx="400" cy="277" r="8" fill="#FFC21A" stroke="none" />
      <path d="M376 254q24-23 48 0m-62-15q38-38 76 0m-62 64q24 23 48 0" fill="none" stroke="#93B3C5" strokeWidth="3" />
      <circle cx="341" cy="309" r="5" fill="#FFC21A" stroke="none" /><circle cx="459" cy="309" r="5" fill="#6CC6AE" stroke="none" />
    </g>;
    case 'camera': return <g {...common}>
      <path d="M346 196h108l25 35v153H321V231z" fill="#E6EDF1" stroke="#A5B7C1" strokeWidth="4" />
      <rect x="337" y="226" width="126" height="111" rx="17" fill="#18334B" stroke="#6B8698" />
      <circle cx="400" cy="280" r="42" fill="#101F2D" stroke="#FFC21A" strokeWidth="5" /><circle cx="400" cy="280" r="22" fill="#34566D" stroke="#6CC6AE" strokeWidth="4" /><circle cx="400" cy="280" r="8" fill="#D9F5F4" stroke="none" />
      <path d="M353 384h94m-67 0v25m40-25v25" />
    </g>;
    case 'wearable': return <g {...common}>
      <path d="M318 248q82-63 164 0l-11 30q-71-48-142 0z" fill="#172D40" stroke="#7893A3" />
      <path d="M335 265q65-28 130 0l-19 28q-46-20-92 0z" fill="#101F2D" stroke="#FFC21A" strokeWidth="3" />
      <path d="M335 272h130m-105 20-38 83m108-83 38 83" fill="none" stroke="#B8C8D2" strokeWidth="10" />
      <circle cx="400" cy="353" r="28" fill="#18334B" stroke="#6CC6AE" strokeWidth="5" />
    </g>;
    default: return <g {...common}>
      <rect x="312" y="211" width="178" height="58" rx="14" fill="#172D40" stroke="#7893A3" />
      <path d="M326 225h150m-150 12h150m-150 12h150" stroke="#526E80" />
      <path d="M338 238h122" stroke="#FFC21A" strokeWidth="5" />
      <rect x="397" y="266" width="22" height="134" rx="8" fill="#AABBC5" stroke="#6E8797" />
      <path d="M408 276v110" stroke="#18334B" strokeWidth="3" />
      <rect x="387" y="338" width="42" height="16" rx="4" fill="#6CC6AE" stroke="#B8C8D2" />
      <path d="M379 400h58" stroke="#FFC21A" strokeWidth="5" />
    </g>;
  }
}

export default function ProductArtwork({ product }) {
  const gradientId = useId().replace(/:/g, '');
  const text = `${product?.name || ''} ${product?.category || ''} ${product?.description || ''}`;
  const art = ART.find(({ test }) => test.test(text));
  if (!art) return null;

  return (
    <div className={`product-art product-art-${art.kind}`} role="img" aria-label={`${art.label} product illustration`}>
      <svg viewBox="0 0 800 600" aria-hidden="true">
        <defs>
          <linearGradient id={`${gradientId}-bg`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#16324A" /><stop offset="1" stopColor="#0D1B2A" /></linearGradient>
          <radialGradient id={`${gradientId}-glow`}><stop stopColor="#2F6D78" stopOpacity=".72" /><stop offset="1" stopColor="#102338" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="800" height="600" rx="24" fill={`url(#${gradientId}-bg)`} />
        <circle cx="400" cy="286" r="232" fill={`url(#${gradientId}-glow)`} />
        <circle cx="400" cy="286" r="190" fill="none" stroke="#B9D4E0" strokeOpacity=".11" strokeWidth="2" />
        <circle cx="400" cy="286" r="150" fill="none" stroke="#B9D4E0" strokeOpacity=".1" strokeWidth="2" strokeDasharray="5 12" />
        <path d="M40 460h720" stroke="#B9D4E0" strokeOpacity=".12" />
        <Device kind={art.kind} />
        <text x="42" y="526" fill="#FFC21A" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="700" letterSpacing="3">NAIJA GADGETS  /  {art.label}</text>
        <circle cx="730" cy="72" r="4" fill="#FFC21A" /><circle cx="750" cy="72" r="4" fill="#6CC6AE" />
      </svg>
    </div>
  );
}

export function hasProductArtwork(product) {
  const text = `${product?.name || ''} ${product?.category || ''} ${product?.description || ''}`;
  return ART.some(({ test }) => test.test(text));
}

