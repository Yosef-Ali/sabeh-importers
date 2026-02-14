"use client";

export function FeaturesSection() {
  return (
    <section className="py-16 bg-card border-b border-border">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-foreground">
          <div className="p-12 border-b md:border-b-0 md:border-r border-foreground group hover:bg-foreground hover:text-background transition-colors">
            <div className="mb-8">
              <span className="material-symbols-outlined text-5xl text-foreground group-hover:text-accent">
                precision_manufacturing
              </span>
            </div>
            <h3 className="font-display text-2xl mb-4 font-bold uppercase">
              Industrial Retail
            </h3>
            <p className="text-muted-foreground group-hover:text-background/70 leading-relaxed">
              Direct access to verified factory-new equipment with full warranty coverage and
              chain-of-custody documentation.
            </p>
          </div>
          <div className="p-12 border-b md:border-b-0 md:border-r border-foreground group hover:bg-foreground hover:text-background transition-colors">
            <div className="mb-8">
              <span className="material-symbols-outlined text-5xl text-foreground group-hover:text-accent">
                hub
              </span>
            </div>
            <h3 className="font-display text-2xl mb-4 font-bold uppercase">Resale Network</h3>
            <p className="text-muted-foreground group-hover:text-background/70 leading-relaxed">
              A secondary market regulated by peer-reviews and institutional verification to
              ensure asset integrity across the fleet.
            </p>
          </div>
          <div className="p-12 group hover:bg-foreground hover:text-background transition-colors">
            <div className="mb-8">
              <span className="material-symbols-outlined text-5xl text-foreground group-hover:text-accent">
                verified_user
              </span>
            </div>
            <h3 className="font-display text-2xl mb-4 font-bold uppercase">Sabeh Verified</h3>
            <p className="text-muted-foreground group-hover:text-background/70 leading-relaxed">
              Every transaction is monitored by the Authority protocol, neutralizing risk through
              escrow and physical inspection tiers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
