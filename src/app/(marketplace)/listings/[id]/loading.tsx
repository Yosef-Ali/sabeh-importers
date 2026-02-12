export default function ListingDetailLoading() {
  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-64 bg-muted rounded animate-pulse mb-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Gallery skeleton */}
        <div className="lg:col-span-7">
          <div className="aspect-[4/3] bg-muted rounded-xl animate-pulse" />
          <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-10 w-40 bg-muted rounded animate-pulse mt-4" />
          </div>
          <div className="h-px bg-border" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-5 w-28 bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-px bg-border" />
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="h-12 w-full bg-muted rounded-lg animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-muted rounded-lg animate-pulse" />
              <div className="h-10 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
