import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getUserWishlist } from "@/lib/actions/wishlist";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Saved Listings | Sabeh Market",
  description: "Your saved listings",
};

export default async function WishlistPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/api/auth/clear-session");

  const wishlist = await getUserWishlist(currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Heart className="h-8 w-8 fill-accent text-accent" />
            Saved Listings
          </h1>
          <p className="text-muted-foreground mt-1">
            {wishlist.length} {wishlist.length === 1 ? "listing" : "listings"} saved
          </p>
        </div>
        <Link href="/">
          <Button variant="outline">Browse More</Button>
        </Link>
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-accent/20">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No saved listings yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Start adding listings to your saved list by clicking the heart icon on any listing.
          </p>
          <Link href="/">
            <Button>Browse Listings</Button>
          </Link>
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
