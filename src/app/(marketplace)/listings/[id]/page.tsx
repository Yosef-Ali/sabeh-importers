
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById, getListings, getSellerActiveListingCount } from "@/lib/actions/marketplace";
import { ListingGallery } from "@/components/marketplace/listing-gallery";
import { ListingInfo } from "@/components/marketplace/listing-info";
import { ListingCard } from "@/components/marketplace/listing-card";
import { SellerCard } from "@/components/marketplace/seller-card";
import { SpecificationsTable } from "@/components/marketplace/specifications-table";

interface ListingPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ListingPageProps) {
  const listing = await getListingById(params.id);
  if (!listing) return { title: "Listing Not Found" };
  
  return {
    title: `${listing.title} | Sabeh Market`,
    description: listing.description.substring(0, 160),
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  // Fetch similar listings and seller stats in parallel
  const [{ data: similarListings }, sellerTotalListings] = await Promise.all([
    getListings({ categoryId: listing.categoryId, limit: 5 }),
    listing.sellerId ? getSellerActiveListingCount(listing.sellerId) : Promise.resolve(0),
  ]);

  // Filter out the current listing from similar
  const related = similarListings.filter((l: any) => l.id !== listing.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background grid-blueprint selection:bg-accent/30">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-12 flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="/" className="hover:text-gold transition-colors">ROOT</Link>
          <span className="text-gold">/</span>
          <Link href="/search" className="hover:text-gold transition-colors">MANIFEST</Link>
          <span className="text-gold">/</span>
          <Link href={`/search?categoryId=${listing.categoryId}`} className="hover:text-gold transition-colors">
            {listing.category?.name.toUpperCase()}
          </Link>
          <span className="text-gold">/</span>
          <span className="text-foreground truncate max-w-[200px] bg-gold/10 px-2">{listing.title.toUpperCase()}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Page Title */}
            <div className="border-l-4 border-accent pl-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
                {listing.title}
              </h1>
              <p className="text-sm text-muted-foreground font-mono mt-2">
                {listing.category?.name}
              </p>
            </div>

            {/* Gallery */}
            <ListingGallery
              images={listing.images}
              title={listing.title}
              category={listing.category?.name}
            />

            {/* Listing Info Section */}
            <ListingInfo listing={listing} />

            {/* Specifications Table */}
            {listing.attributes && (
              <SpecificationsTable
                attributes={listing.attributes}
                language="en"
              />
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <SellerCard
              seller={{
                id: listing.seller?.id || listing.sellerId || "unknown",
                name: listing.seller?.name || "Unknown Seller",
                avatar: listing.seller?.avatar || null,
                verified: listing.seller?.verificationStatus === "VERIFIED",
                memberSince: listing.seller?.createdAt || null,
                location: listing.city || null,
                totalListings: sellerTotalListings || undefined,
              }}
              listingId={listing.id}
              language="en"
            />
          </div>
        </div>

        {/* Similar Listings */}
        {related.length > 0 && (
          <section className="mt-16 pt-16 border-t-2 border-border">
            <div className="mb-8 border-l-4 border-gold pl-6">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
                Similar Listings
              </h2>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                More items in {listing.category?.name}
              </p>
            </div>
            <div className="listing-grid">
              {related.map((item) => (
                <ListingCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={Number(item.price)}
                  currency={item.currency}
                  image={item.images && item.images.length > 0 ? item.images[0] : null}
                  location={item.city}
                  condition={item.condition || "USED"}
                  category={item.category?.name || "Category"}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
