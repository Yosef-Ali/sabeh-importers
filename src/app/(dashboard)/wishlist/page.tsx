import { getUserWishlist } from "@/lib/actions/wishlist";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Heart } from "lucide-react";

export const metadata = {
  title: "My Wishlist | Sabeh Market",
  description: "Your saved listings",
};

export default async function WishlistPage() {
  // In a real app, get userId from session
  const userId = "1";
  const wishlist = await getUserWishlist(userId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1a2d4a] flex items-center gap-3">
          <Heart className="h-8 w-8 fill-[#FCDD09] text-[#FCDD09]" />
          My Wishlist
        </h1>
        <p className="text-muted-foreground mt-2">
          {wishlist.length} {wishlist.length === 1 ? "listing" : "listings"} saved
        </p>
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf8f5] border border-[#FCDD09]/20">
            <Heart className="h-10 w-10 text-[#FCDD09]/60" />
          </div>
          <h3 className="text-xl font-bold text-[#1a2d4a] mb-2">No saved listings yet</h3>
          <p className="text-gray-600 max-w-sm">
            Start adding listings to your wishlist by clicking the heart icon on any listing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              price={Number(listing.price)}
              currency={listing.currency}
              image={listing.images && listing.images.length > 0 ? listing.images[0] : null}
              location={listing.city}
              condition={listing.condition || "USED_GOOD"}
              category={listing.category?.name || "Category"}
              negotiable={listing.negotiable ?? true}
              sellerName={listing.seller?.name}
              createdAt={listing.createdAt ? String(listing.createdAt) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
