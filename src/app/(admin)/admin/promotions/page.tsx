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
          <h1 className="text-3xl font-bold text-foreground">Listing Promotions</h1>
          <p className="text-muted-foreground mt-1">
            Control which listings are promoted or featured on the marketplace
          </p>
        </div>
        <Link
          href="/admin/listings"
          className="rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Promote a Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <TrendingUp className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Promoted</p>
            <p className="text-2xl font-bold text-foreground">{stats.promoted}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <Star className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Featured</p>
            <p className="text-2xl font-bold text-foreground">{stats.featured}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">With Expiry</p>
            <p className="text-2xl font-bold text-foreground">{stats.expiringSoon}</p>
          </div>
        </div>
      </div>

      {promoted.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-accent/20">
            <Star className="h-10 w-10 text-accent/60" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No promoted listings</h3>
          <p className="text-muted-foreground max-w-sm">
            Go to <Link href="/admin/listings" className="text-foreground font-bold underline">Listings</Link> to promote a listing.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 bg-muted border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
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
