import { getPendingListings } from "@/lib/actions/admin";
import { ListingModerationCard } from "@/components/admin/listing-moderation-card";
import { Package } from "lucide-react";

export const metadata = {
  title: "Listings Moderation | Admin",
  description: "Review and moderate listings",
};

export default async function AdminListingsPage() {
  const pendingListings = await getPendingListings(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1a2d4a]">Listings Moderation</h1>
        <p className="text-gray-600 mt-1">
          {pendingListings.length} listing{pendingListings.length !== 1 && "s"} pending review
        </p>
      </div>

      {pendingListings.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf8f5] border border-[#FCDD09]/20">
            <Package className="h-10 w-10 text-[#FCDD09]/60" />
          </div>
          <h3 className="text-xl font-bold text-[#1a2d4a] mb-2">All caught up!</h3>
          <p className="text-gray-600 max-w-sm">
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
