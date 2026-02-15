import Link from "next/link";
export const dynamic = 'force-dynamic';
import { getListings } from "@/lib/actions/marketplace";
import { EnhancedFooter } from "@/components/homepage/enhanced-footer";

export const metadata = {
  title: "Sabeh Authority | Maritime Commerce Excellence",
  description: "Authoritative commerce for the modern seafarer. High-trust trading platform for verified industrial and maritime assets.",
};

import { HeroSearch } from "@/components/marketplace/hero-search";
import { CategoryStrip } from "@/components/marketplace/category-strip";
import { SidebarFilters } from "@/components/marketplace/sidebar-filters";
import { MarketplaceListingCard } from "@/components/marketplace/marketplace-listing-card";
import { FeaturesSection } from "@/components/marketplace/features-section";
import { PricingTiers } from "@/components/marketplace/pricing-tiers";
import { AppFeaturesSection } from "@/components/marketplace/app-features-section";
import { PartnerLogos } from "@/components/marketplace/partner-logos";
import { StatsSection } from "@/components/marketplace/stats-section";
import { CtaBanner } from "@/components/marketplace/cta-banner";
import { Button } from "@/components/ui/button";

export default async function MarketplacePage() {
  let verifiedListings: any[] = [];
  let recentListings: any[] = [];

  try {
    // Fetch "Verified Partners" (Premium/Featured) listings
    const [verifiedResult, freshResult] = await Promise.all([
      getListings({ limit: 3, sort: "newest", featured: true }),
      getListings({ limit: 12, sort: "newest" }),
    ]);

    verifiedListings = verifiedResult.data;
    recentListings = freshResult.data;
  } catch (error) {
    console.error("Homepage: Failed to fetch listings:", error);
    // Render page with empty listings instead of crashing
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">

      {/* ──── 1. HERO SECTION ──── */}
      <HeroSearch />

      {/* ──── 2. CATEGORY STRIP ──── */}
      <CategoryStrip />

      {/* ──── 3. PARTNER LOGOS (Social Proof) ──── */}
      <PartnerLogos />

      {/* ──── 4. STATS (Authority Numbers) ──── */}
      <StatsSection />

      {/* ──── 5. LISTINGS (Products First) ──── */}
      <main className="max-w-[1440px] mx-auto w-full px-6 py-12 grid grid-cols-12 gap-10 animate-fade-in-up">

        {/* Sidebar Filters (Sticky) */}
        <aside className="col-span-3 hidden lg:block sticky top-24 h-fit">
          <SidebarFilters />
        </aside>

        {/* Main Feed Area */}
        <div className="col-span-12 lg:col-span-9 space-y-16">

          {/* Verified Partners Carousel (Premium) */}
          {verifiedListings.length > 0 && (
            <section className="bg-accent/5 p-6 rounded-xl border border-accent/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display font-bold text-3xl text-foreground flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent text-3xl">stars</span>
                  Verified Partners
                </h2>
                <Link href="/search?featured=true" className="text-sm font-bold text-muted-foreground uppercase tracking-widest hover:text-accent transition-colors">
                  View All Partners
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                {verifiedListings.map((listing) => (
                  <MarketplaceListingCard
                    key={listing.id}
                    listing={listing}
                    variant="premium"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Fresh Feed (Standard Inventory) */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b-2 border-border/50 pb-4">
              <h2 className="font-display font-bold text-3xl text-foreground">Fresh Feed</h2>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">SORT BY:</span>
                <select className="border-none text-sm font-bold text-foreground focus:ring-0 cursor-pointer bg-transparent p-0 pr-8 hover:text-accent transition-colors">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 stagger-children">
              {recentListings.map((listing) => (
                <MarketplaceListingCard
                  key={listing.id}
                  listing={listing}
                  variant="standard"
                />
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <Link href="/search">
                <Button className="bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-bold uppercase tracking-widest text-sm px-10 py-6 rounded-sm shadow-none hover:shadow-lg transition-all duration-300 hover-lift">
                  Load More Listings
                </Button>
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* ──── 6. CTA BANNER ──── */}
      <CtaBanner />

      {/* ──── 7. TRUST FEATURES ──── */}
      <FeaturesSection />

      {/* ──── 8. PRICING TIERS ──── */}
      <PricingTiers />

      {/* ──── 9. MOBILE APP (Secondary CTA) ──── */}
      <AppFeaturesSection />

      {/* ──── 10. FOOTER ──── */}
      <EnhancedFooter />
    </div>
  );
}

