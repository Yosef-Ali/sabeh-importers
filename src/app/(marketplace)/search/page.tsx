
import { Suspense } from "react";
import { Filters } from "@/components/marketplace/filters";
import { ListingCard } from "@/components/marketplace/listing-card";
import { SearchBar } from "@/components/marketplace/search-bar";
import { getListings, getCategories } from "@/lib/actions/marketplace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  SlidersHorizontal, X, Search, ArrowUpDown, ChevronRight, ChevronLeft,
} from "lucide-react";

export const metadata = {
  title: "Search | Sabeh Marketplace",
  description: "Search for cars, property, electronics, and more on Sabeh Market.",
};

interface SearchPageProps {
  searchParams: {
    query?: string;
    category?: string;   // slug from navbar/footer (e.g. "motors")
    categoryId?: string;  // UUID from homepage/filters
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    sort?: string;
    page?: string;
  };
}

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const CONDITION_LABELS: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  USED_GOOD: "Used (Good)",
  USED_FAIR: "Used (Fair)",
  FOR_PARTS: "For Parts",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Fetch categories first so we can resolve slug → id
  const categories = await getCategories();

  // Resolve category: accept either slug (?category=motors) or UUID (?categoryId=xxx)
  let resolvedCategoryId = searchParams.categoryId;
  if (!resolvedCategoryId && searchParams.category) {
    const found = categories.find(
      (c) => c.slug === searchParams.category || c.name.toLowerCase() === searchParams.category?.toLowerCase()
    );
    if (found) resolvedCategoryId = found.id;
  }

  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  const { data: results, total, totalPages } = await getListings({
    query: searchParams.query,
    categoryId: resolvedCategoryId,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    condition: searchParams.condition as any,
    sort: (searchParams.sort as any) || "newest",
    page: currentPage,
  });

  const activeCategory = resolvedCategoryId
    ? categories.find((c) => c.id === resolvedCategoryId)
    : null;

  const hasFilters = !!(
    searchParams.query ||
    resolvedCategoryId ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    searchParams.condition
  );

  const currentSort = searchParams.sort || "newest";

  // Build breadcrumb
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Search", href: "/search" },
  ];
  if (activeCategory) {
    breadcrumbs.push({ label: activeCategory.name, href: `/search?categoryId=${activeCategory.id}` });
  }
  if (searchParams.query) {
    breadcrumbs.push({ label: `"${searchParams.query}"`, href: "#" });
  }

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary/30">
      {/* ──── Top Bar ──── */}
      <div className="border-b border-border/60 bg-card">
        <div className="container py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Search + Sort Row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 w-full max-w-2xl">
              <SearchBar className="[&_input]:bg-muted/50" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Sort dropdown (simple links for server component) */}
              <div className="flex items-center gap-2 text-sm w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                <ArrowUpDown className="h-3.5 w-3.5 text-gold flex-shrink-0" />
                <span className="text-muted-foreground hidden sm:inline flex-shrink-0">Sort:</span>
                <div className="flex gap-2">
                  {SORT_OPTIONS.map((opt) => {
                    const params = new URLSearchParams();
                    if (searchParams.query) params.set("query", searchParams.query);
                    if (searchParams.category) params.set("category", searchParams.category);
                    if (searchParams.categoryId) params.set("categoryId", searchParams.categoryId);
                    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
                    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
                    if (searchParams.condition) params.set("condition", searchParams.condition);
                    params.set("sort", opt.value);

                    return (
                      <Link
                        key={opt.value}
                        href={`/search?${params.toString()}`}
                        className={`rounded-full px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${
                          currentSort === opt.value
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-card text-muted-foreground hover:text-primary border border-border"
                        }`}
                      >
                        {opt.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* ──── Active Filters + Result Count ──── */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-muted-foreground font-body">
                <span className="font-bold text-foreground text-lg font-montserrat tabular-nums">{total}</span>
                {" "}results
                {searchParams.query && (
                  <> for <span className="font-bold text-foreground">&ldquo;{searchParams.query}&rdquo;</span></>
                )}
              </p>
            </div>

            {hasFilters && (
               <Link href="/search" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors self-start sm:self-auto">
                Clear all filters
              </Link>
            )}
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2">
              {activeCategory && (
                <FilterPill
                  label={activeCategory.name}
                  searchParams={searchParams}
                  removeKey="category"
                  removeKeys={["category", "categoryId"]}
                />
              )}
              {searchParams.condition && (
                <FilterPill
                  label={CONDITION_LABELS[searchParams.condition] || searchParams.condition}
                  searchParams={searchParams}
                  removeKey="condition"
                />
              )}
              {searchParams.minPrice && (
                <FilterPill
                  label={`Min: ETB ${Number(searchParams.minPrice).toLocaleString()}`}
                  searchParams={searchParams}
                  removeKey="minPrice"
                />
              )}
              {searchParams.maxPrice && (
                <FilterPill
                  label={`Max: ETB ${Number(searchParams.maxPrice).toLocaleString()}`}
                  searchParams={searchParams}
                  removeKey="maxPrice"
                />
              )}
            </div>
          )}
        </div>

        {/* ──── Main Grid: Sidebar + Results ──── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-widest font-display">Filters</h3>
                </div>
                {hasFilters && (
                  <Link href="/search" className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60 hover:text-primary transition-colors">
                    Reset
                  </Link>
                )}
              </div>
              <Suspense fallback={<FilterSkeleton />}>
                <Filters categories={categories} />
              </Suspense>
            </div>
          </aside>

          {/* Results */}
          <div>
            {results.length === 0 && total === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-background border border-primary/20">
                  <Search className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-2xl font-display text-foreground mb-2">No results found</h3>
                <p className="mt-2 text-gray-500 font-light max-w-sm leading-relaxed">
                  Try adjusting your filters, checking your spelling, or searching for something else.
                </p>
                <Link href="/search" className="mt-8">
                  <Button variant="outline" className="rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all px-8 py-6 font-bold uppercase tracking-widest text-xs">
                    Clear Filters & Try Again
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
                  {results.map((listing) => (
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
                      negotiable={listing.negotiable ?? true}
                      sellerName={listing.seller?.name || undefined}
                      createdAt={listing.createdAt ? String(listing.createdAt) : undefined}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    searchParams={searchParams}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──── Filter Pill (removes one or more filter params) ──── */
function FilterPill({
  label,
  searchParams,
  removeKey,
  removeKeys,
}: {
  label: string;
  searchParams: Record<string, string | undefined>;
  removeKey: string;
  removeKeys?: string[];
}) {
  const keysToRemove = removeKeys || [removeKey];
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (!keysToRemove.includes(key) && value) {
      params.set(key, value);
    }
  });

  return (
    <Link href={`/search?${params.toString()}`}>
      <Badge
        variant="outline"
        className="gap-1.5 pl-3 pr-2 py-1.5 text-[10px] font-bold uppercase tracking-widest border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer bg-card/50 backdrop-blur-sm"
      >
        {label}
        <X className="h-3 w-3" />
      </Badge>
    </Link>
  );
}

/* ──── Pagination ──── */
function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  function buildPageUrl(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) params.set(key, value);
    });
    if (page > 1) params.set("page", String(page));
    return `/search?${params.toString()}`;
  }

  // Generate page numbers to show (show max 5 around current)
  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Search results pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/50 px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40 cursor-not-allowed">
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground/60">
              &hellip;
            </span>
          ) : (
            <Link
              key={p}
              href={buildPageUrl(p)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold font-montserrat tabular-nums transition-all ${
                p === currentPage
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "border border-border bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              }`}
            >
              {p}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/50 px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40 cursor-not-allowed">
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      )}
    </nav>
  );
}

/* ──── Filter Skeleton ──── */
function FilterSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}
