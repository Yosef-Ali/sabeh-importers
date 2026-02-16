import { getPromotedListings, getPromotionStats } from "@/lib/actions/admin";
import { PromotionToggleCard } from "@/components/admin/promotion-toggle-card";
import { Star, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Promotions | Admin",
};

export default async function AdminPromotionsPage() {
  const [promoted, stats] = await Promise.all([
    getPromotedListings(100),
    getPromotionStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Listing Promotions</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Control which listings are promoted or featured on the marketplace
          </p>
        </div>
        <Link
          href="/admin/listings"
          className="rounded-button bg-primary text-primary-foreground px-5 py-2.5 text-sm font-display font-bold hover:bg-primary/90 transition-colors"
        >
          Promote a Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-5 shadow-card hover:shadow-card-hover transition-all flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-button flex items-center justify-center shadow-sm">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase font-bold tracking-wide">Promoted</p>
            <p className="text-2xl font-display font-bold text-primary">{stats.promoted}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-5 shadow-card hover:shadow-card-hover transition-all flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-button flex items-center justify-center shadow-sm">
            <Star className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase font-bold tracking-wide">Featured</p>
            <p className="text-2xl font-display font-bold text-primary">{stats.featured}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-5 shadow-card hover:shadow-card-hover transition-all flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-button flex items-center justify-center shadow-sm">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase font-bold tracking-wide">With Expiry</p>
            <p className="text-2xl font-display font-bold text-primary">{stats.expiringSoon}</p>
          </div>
        </div>
      </div>

      {promoted.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center bg-white dark:bg-card rounded-card border-2 border-dashed border-primary/20 p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-accent/20">
            <Star className="h-10 w-10 text-accent/60" />
          </div>
          <h3 className="text-xl font-display font-bold text-primary mb-2">No promoted listings</h3>
          <p className="text-muted-foreground font-mono text-sm max-w-sm">
            Go to <Link href="/admin/listings" className="text-primary font-bold underline">Listings</Link> to promote a listing.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 overflow-hidden shadow-card">
          <div className="px-5 py-3 bg-primary/5 border-b-2 border-primary/10">
            <p className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
              {promoted.length} promoted listing{promoted.length !== 1 && "s"}
            </p>
          </div>
          <div className="divide-y divide-border">
            {promoted.map((listing) => (
              <PromotionToggleCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
