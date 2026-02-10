import { getListings } from '@/actions/marketplace';
import { ListingCard } from './listing-card';

export async function ListingFeed() {
  const { listings, error } = await getListings();

  if (error) {
    return <div className="text-red-500">Error loading listings: {error}</div>;
  }

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
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
