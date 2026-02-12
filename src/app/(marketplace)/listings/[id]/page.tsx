
import { notFound } from "next/navigation";
import { getListingById, getListings } from "@/lib/actions/marketplace";
import { ListingGallery } from "@/components/marketplace/listing-gallery";
import { ListingInfo } from "@/components/marketplace/listing-info";
import { ListingCard } from "@/components/marketplace/listing-card";

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

  // Fetch similar listings (placeholder logic: same category, exclude current)
  const { data: similarListings } = await getListings({
    categoryId: listing.categoryId,
    limit: 4
  });

  // Filter out the current listing from similar
  const related = similarListings.filter((l: any) => l.id !== listing.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <a href="/" className="hover:text-[#1a2d4a] transition-colors">Home</a>
          <span>/</span>
          <a href="/search" className="hover:text-[#1a2d4a] transition-colors">Marketplace</a>
          <span>/</span>
          <a href={`/search?category=${listing.categoryId}`} className="hover:text-[#1a2d4a] transition-colors">
            {listing.category?.name}
          </a>
          <span>/</span>
          <span className="text-[#1a2d4a] font-bold truncate max-w-[200px]">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
             <ListingGallery
              images={listing.images}
              title={listing.title}
              category={listing.category?.name}
             />
          </div>

          {/* Right Column: Info & Actions */}
          <div className="lg:col-span-5">
             <div className="sticky top-24">
                <ListingInfo listing={listing} />
             </div>
          </div>
        </div>

        {/* Similar Listings */}
        {related.length > 0 && (
          <section className="mt-16 pt-16 border-t border-gray-200">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1a2d4a] mb-2">Similar Items</h2>
              <p className="text-sm text-gray-600">More {listing.category?.name} listings you might like</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
