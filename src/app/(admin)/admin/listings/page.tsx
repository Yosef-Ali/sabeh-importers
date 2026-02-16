import { getPendingListings } from "@/lib/actions/admin";
import { ListingModerationCard } from "@/components/admin/listing-moderation-card";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Listings Moderation | Admin",
  description: "Review and moderate listings",
};

export default async function AdminListingsPage() {
  const pendingListings = await getPendingListings(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Listings Moderation</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {pendingListings.length} listing{pendingListings.length !== 1 && "s"} pending review
        </p>
      </div>

      {pendingListings.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center bg-white dark:bg-card rounded-card border-2 border-dashed border-primary/20 p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-accent/20">
            <Package className="h-10 w-10 text-accent/60" />
          </div>
          <h3 className="text-xl font-display font-bold text-primary mb-2">All caught up!</h3>
          <p className="text-muted-foreground font-mono text-sm max-w-sm">
            No listings pending review at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingListings.map((listing) => (
            <ListingModerationCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
