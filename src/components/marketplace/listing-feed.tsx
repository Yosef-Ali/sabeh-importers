import { getListings } from "@/lib/actions/marketplace";
import { ListingCard } from "./listing-card";

export async function ListingFeed() {
  const { data: listings } = await getListings({ limit: 20, sort: "newest" });

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No active listings found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          id={listing.id}
          title={listing.title}
          price={Number(listing.price)}
          currency={listing.currency}
          image={listing.images && listing.images.length > 0 ? listing.images[0] : null}
          location={listing.city}
          condition={listing.condition || "USED_GOOD"}
          category={listing.category?.name || "Uncategorized"}
          sellerName={listing.seller?.name || undefined}
          sellerVerified={listing.seller?.verificationStatus === "VERIFIED"}
          createdAt={listing.createdAt ? String(listing.createdAt) : undefined}
        />
      ))}
    </div>
  );
}
