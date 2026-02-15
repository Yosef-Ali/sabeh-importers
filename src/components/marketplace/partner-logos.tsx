"use client";

const partners = [
  { name: "Ethiopian Shipping Lines", abbr: "ESL" },
  { name: "Moha Soft Drinks", abbr: "MOHA" },
  { name: "Dangote Industries", abbr: "DNG" },
  { name: "MIDROC Technology", abbr: "MTG" },
  { name: "BGI Ethiopia", abbr: "BGI" },
  { name: "Anbessa Shoe", abbr: "ANB" },
  { name: "Habesha Breweries", abbr: "HBR" },
  { name: "Ethio Telecom", abbr: "ET" },
  { name: "Commercial Bank", abbr: "CBE" },
  { name: "Awash Bank", abbr: "AWB" },
  { name: "Dashen Brewery", abbr: "DSH" },
  { name: "Sunshine Construction", abbr: "SCC" },
];

function LogoCard({ name, abbr }: { name: string; abbr: string }) {
  return (
    <div className="flex items-center gap-3 px-8 shrink-0">
      <div className="h-10 w-10 rounded-md bg-foreground/5 border border-border flex items-center justify-center">
        <span className="text-xs font-bold text-foreground/60 font-mono">
          {abbr}
        </span>
      </div>
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export function PartnerLogos() {
  // Duplicate the list for seamless infinite scroll
  const items = [...partners, ...partners];

  return (
    <section className="py-10 bg-card border-y border-border overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 mb-6">
        <p className="text-center text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by leading Ethiopian businesses
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex animate-marquee">
          {items.map((p, i) => (
            <LogoCard key={`${p.abbr}-${i}`} name={p.name} abbr={p.abbr} />
          ))}
        </div>
      </div>
    </section>
  );
}
