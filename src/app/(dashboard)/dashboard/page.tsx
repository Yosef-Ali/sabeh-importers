import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getUserListingsWithStats } from "@/lib/actions/marketplace";
import { getUserConversations } from "@/lib/actions/messages";
import Link from "next/link";
import {
  Package,
  Eye,
  MessageCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dashboard | Sabeh Market",
  description: "Your seller dashboard",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-200",
  EXPIRED: "bg-gray-100 text-gray-600 border-gray-200",
  SOLD: "bg-blue-100 text-blue-700 border-blue-200",
  DRAFT: "bg-purple-100 text-purple-700 border-purple-200",
};

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  // Redirect through the clear-session route so stale cookies are wiped
  // before hitting /login — prevents a middleware redirect loop.
  if (!currentUser) redirect("/api/auth/clear-session");

  const [{ listings, stats }, conversations] = await Promise.all([
    getUserListingsWithStats(currentUser.id),
    getUserConversations(currentUser.id),
  ]);

  // Unread message count
  const unreadCount = conversations.reduce((acc, c) => {
    const isBuyer = c.buyerId === currentUser.id;
    return acc + (isBuyer ? (c.buyerUnread ?? 0) : (c.sellerUnread ?? 0));
  }, 0);

  // Recent 5 listings
  const recentListings = listings.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-[0.2em]">
            <span>Seller Dashboard</span>
            <div className="h-px w-12 bg-accent/20" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary">
            Welcome back, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Here&apos;s what&apos;s happening with your listings.
          </p>
        </div>
        <Link href="/marketplace/create">
          <Button className="gap-2 font-display font-bold">
            <Plus className="h-4 w-4" />
            Post a Listing
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/5 shadow-sm hover:shadow-card transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Total Listings</p>
                <p className="text-3xl font-display font-bold mt-1 tabular-nums text-primary">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-button bg-primary/5 text-2xl">
                📦
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/5 shadow-sm hover:shadow-card transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Active</p>
                <p className="text-3xl font-display font-bold mt-1 tabular-nums text-green-600">{stats.active}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-button bg-green-500/10 text-2xl">
                ✅
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/5 shadow-sm hover:shadow-card transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Total Views</p>
                <p className="text-3xl font-display font-bold mt-1 tabular-nums text-primary">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-button bg-blue-500/10 text-2xl">
                👁️
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/5 shadow-sm hover:shadow-card transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Unread Messages</p>
                <p className={cn("text-3xl font-display font-bold mt-1 tabular-nums", unreadCount > 0 ? "text-accent" : "text-primary")}>
                  {unreadCount}
                </p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-button text-2xl", unreadCount > 0 ? "bg-accent/10" : "bg-primary/5")}>
                💬
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Listings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Recent Listings</CardTitle>
              <Link href="/my-listings">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <Package className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <p className="font-medium text-sm">No listings yet</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">Create your first listing to start selling</p>
                  <Link href="/marketplace/create">
                    <Button size="sm" className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> Create Listing
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentListings.map((listing) => (
                    <div key={listing.id} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors">
                      {/* Image */}
                      <div className="h-12 w-12 rounded-md bg-muted overflow-hidden flex-shrink-0 border border-border">
                        {listing.images && listing.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${listing.id}`} className="font-medium text-sm hover:text-accent transition-colors line-clamp-1">
                          {listing.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs font-mono text-muted-foreground">
                            {listing.currency} {parseFloat(listing.price).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" /> {listing.viewCount ?? 0}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex-shrink-0",
                        STATUS_COLORS[listing.status] || "bg-muted text-muted-foreground border-border"
                      )}>
                        {listing.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions + Status Summary */}
        <div className="space-y-4">
          {/* Status breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Active", count: stats.active, color: "bg-green-500" },
                {
                  label: "Pending Review",
                  count: listings.filter((l) => l.status === "PENDING_REVIEW").length,
                  color: "bg-yellow-500",
                },
                {
                  label: "Sold",
                  count: listings.filter((l) => l.status === "SOLD").length,
                  color: "bg-blue-500",
                },
                {
                  label: "Expired",
                  count: listings.filter((l) => l.status === "EXPIRED").length,
                  color: "bg-gray-400",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("h-2 w-2 rounded-full flex-shrink-0", item.color)} />
                    <span className="text-sm text-muted-foreground truncate">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/marketplace/create" className="block">
                <Button variant="outline" className="w-full justify-start gap-2 h-10">
                  <Plus className="h-4 w-4" /> New Listing
                </Button>
              </Link>
              <Link href="/messages" className="block">
                <Button variant="outline" className="w-full justify-start gap-2 h-10">
                  <MessageCircle className="h-4 w-4" />
                  Messages
                  {unreadCount > 0 && (
                    <Badge className="ml-auto h-5 min-w-[20px] text-[10px]">{unreadCount}</Badge>
                  )}
                </Button>
              </Link>
              <Link href="/my-listings" className="block">
                <Button variant="outline" className="w-full justify-start gap-2 h-10">
                  <Package className="h-4 w-4" /> All Listings
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full justify-start gap-2 h-10">
                  <Eye className="h-4 w-4" /> Browse Market
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Account status */}
          {currentUser.verificationStatus !== "VERIFIED" && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">
                      Account Not Verified
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-0.5 leading-relaxed">
                      Verify your account to get a badge and build buyer trust.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
