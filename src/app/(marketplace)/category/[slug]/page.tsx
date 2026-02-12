import { notFound } from "next/navigation";
import { getCategories, getListings } from "@/lib/actions/marketplace";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, TrendingUp, Clock, Star } from "lucide-react";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Sabeh Market`,
    description: `Browse ${category.name.toLowerCase()} listings on Sabeh Market. Find the best deals in Ethiopia.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  // Fetch listings for this category
  const { data: listings, total } = await getListings({
    categoryId: category.id,
    sort: "newest",
    limit: 12,
  });

  // Get category stats
  const { total: activeListings } = await getListings({
    categoryId: category.id,
    limit: 1,
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-[#1a2d4a] via-[#2d4a6f] to-[#1a2d4a]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 flex h-full flex-col justify-center">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/search" className="hover:text-white transition-colors">
                Marketplace
              </Link>
              <span>/</span>
              <span className="text-[#FCDD09]">{category.name}</span>
            </nav>

            {/* Category Header */}
            <div className="space-y-4">
              <Badge className="bg-[#FCDD09]/20 text-[#FCDD09] border-[#FCDD09]/30 uppercase tracking-widest text-xs font-bold">
                {category.name}
              </Badge>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Discover Amazing{" "}
                <span className="text-[#FCDD09]">{category.name}</span>
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                Browse {activeListings.toLocaleString()} active listings in {category.name.toLowerCase()}.
                Find quality products from verified sellers across Ethiopia.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCDD09]/20 backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-[#FCDD09]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white tabular-nums">{activeListings}</p>
                  <p className="text-sm text-white/60 uppercase tracking-wide">Active Listings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCDD09]/20 backdrop-blur-sm">
                  <Star className="h-6 w-6 text-[#FCDD09]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white tabular-nums">4.8</p>
                  <p className="text-sm text-white/60 uppercase tracking-wide">Avg Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCDD09]/20 backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-[#FCDD09]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white tabular-nums">24h</p>
                  <p className="text-sm text-white/60 uppercase tracking-wide">Avg Response</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link href={`/search?categoryId=${category.id}`}>
                <Button className="bg-[#FCDD09] hover:bg-[#e5c908] text-[#1a2d4a] font-bold uppercase tracking-wide px-8 py-6 text-sm shadow-xl">
                  View All {category.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf8f5] to-transparent"></div>
      </section>

      {/* Listings Section */}
      <section className="container py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1a2d4a]">Latest {category.name}</h2>
            <p className="text-gray-600 mt-1">Fresh arrivals from verified sellers</p>
          </div>
          {total > 12 && (
            <Link href={`/search?categoryId=${category.id}`}>
              <Button variant="outline" className="border-[#FCDD09] text-[#1a2d4a] hover:bg-[#FCDD09]/10">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {listings.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-12">
            <div className="text-center">
              <p className="text-lg text-gray-600">No listings found in this category yet.</p>
              <p className="text-sm text-gray-500 mt-2">Check back soon for new items!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                category={listing.category?.name || category.name}
                negotiable={listing.negotiable ?? true}
                sellerName={listing.seller?.name}
                createdAt={listing.createdAt ? String(listing.createdAt) : undefined}
              />
            ))}
          </div>
        )}
      </section>

      {/* Other Categories */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#1a2d4a] mb-8">Explore Other Categories</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories
              .filter((c) => c.slug !== params.slug)
              .slice(0, 6)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-gray-200 bg-[#faf8f5] p-6 transition-all hover:border-[#FCDD09] hover:shadow-lg"
                >
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                    {cat.icon || "📦"}
                  </div>
                  <p className="text-center text-sm font-bold text-[#1a2d4a] group-hover:text-[#FCDD09] transition-colors">
                    {cat.name}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
