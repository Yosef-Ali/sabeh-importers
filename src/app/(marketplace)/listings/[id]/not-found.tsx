import Link from "next/link";
import { Search, ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getListings } from "@/lib/actions/marketplace";

const QUICK_CATEGORIES = [
  { label: "Motors", slug: "motors" },
  { label: "Property", slug: "property" },
  { label: "Electronics", slug: "electronics" },
  { label: "Business", slug: "business" },
  { label: "Fashion", slug: "fashion" },
  { label: "Services", slug: "services" },
];

export default async function ListingNotFound() {
  // Fetch a few recent listings to suggest
  const { data: recent } = await getListings({ limit: 4 });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border bg-[#0A192F]">
        {/* Blueprint grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#FCDD09 1px, transparent 1px), linear-gradient(90deg, #FCDD09 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-[1440px] mx-auto px-8 py-20 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-none border border-[#FCDD09]/30 bg-[#FCDD09]/10 px-4 py-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-[#FCDD09]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#FCDD09]">
              Listing Not Found
            </span>
          </div>

          {/* 404 */}
          <div className="relative mb-4">
            <span
              className="select-none text-[160px] font-black leading-none text-[#FCDD09]/10 tracking-tighter"
              aria-hidden="true"
            >
              404
            </span>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[80px] font-black leading-none tracking-tighter text-[#FCDD09]">
              404
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-3">
            This Listing Has Sailed
          </h1>
          <p className="max-w-md text-base text-white/60 leading-relaxed mb-8">
            The listing you&apos;re looking for may have been sold, removed by the seller,
            or the link might be incorrect.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <Button className="bg-[#FCDD09] text-[#0A192F] hover:bg-[#FCDD09]/90 font-bold uppercase tracking-widest text-xs px-6 rounded-none h-11">
                <Home className="mr-2 h-4 w-4" />
                Back to Market
              </Button>
            </Link>
            <Link href="/search">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white font-bold uppercase tracking-widest text-xs px-6 rounded-none h-11"
              >
                <Search className="mr-2 h-4 w-4" />
                Browse All Listings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="mb-8 border-l-4 border-accent pl-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Or browse by category
          </p>
          <h2 className="text-xl font-display font-bold text-foreground tracking-tight">
            Find Something Similar
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex items-center justify-center rounded-none border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Recent Listings */}
        {recent.length > 0 && (
          <>
            <div className="mb-6 border-l-4 border-accent pl-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Recently added
              </p>
              <h2 className="text-xl font-display font-bold text-foreground tracking-tight">
                Fresh Listings
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recent.map((item) => (
                <Link
                  key={item.id}
                  href={`/listings/${item.id}`}
                  className="group block rounded-none border border-border bg-card overflow-hidden hover:border-accent transition-colors"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                          No Image
                        </span>
                      </div>
                    )}
                    {/* Category badge */}
                    <div className="absolute top-2 left-2 bg-[#0A192F]/80 px-2 py-0.5">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#FCDD09]">
                        {item.category?.name || "Other"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-base font-bold text-foreground font-mono tabular-nums">
                      {Number(item.price).toLocaleString()}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {item.currency}
                      </span>
                    </p>
                    {item.city && (
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {item.city}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Back link */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Sabeh Market
          </Link>
        </div>
      </div>
    </div>
  );
}
