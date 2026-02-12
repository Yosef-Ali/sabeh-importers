export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar skeleton */}
      <div className="border-b border-border/60 bg-card">
        <div className="container py-4 space-y-4">
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          <div className="flex gap-4 items-center">
            <div className="flex-1 max-w-2xl h-12 bg-muted rounded-full animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="h-6 w-24 bg-muted rounded animate-pulse mb-6" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block">
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                </div>
              ))}
              <div className="h-11 w-full bg-muted rounded-lg animate-pulse" />
            </div>
          </aside>

          {/* Results skeleton */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-28 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
