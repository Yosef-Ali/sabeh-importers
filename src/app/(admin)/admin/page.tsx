import { getAdminStats, getPromotionStats } from "@/lib/actions/admin";
import { Card } from "@/components/ui/card";
import { Package, Users, AlertCircle, CheckCircle2, BadgeCheck, Star } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin Dashboard | Sabeh Market",
  description: "Admin dashboard for Sabeh Market",
};

export default async function AdminDashboardPage() {
  const [stats, promoStats] = await Promise.all([getAdminStats(), getPromotionStats()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor platform activity and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
              <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-bold">Total Users</p>
              <p className="text-3xl font-bold text-foreground tabular-nums mt-1">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-bold">Active Listings</p>
              <p className="text-3xl font-bold text-foreground tabular-nums mt-1">
                {stats.activeListings.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950">
              <Package className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-bold">Pending Review</p>
              <p className="text-3xl font-bold text-foreground tabular-nums mt-1">
                {stats.pendingListings.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
              <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-bold">Pending Reports</p>
              <p className="text-3xl font-bold text-foreground tabular-nums mt-1">
                {stats.pendingReports.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <a
            href="/admin/listings"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Package className="h-8 w-8 text-accent mb-2" />
            <p className="font-semibold text-foreground text-sm">Review Listings</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stats.pendingListings} pending</p>
          </a>

          <a
            href="/admin/users"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Users className="h-8 w-8 text-accent mb-2" />
            <p className="font-semibold text-foreground text-sm">Manage Users</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stats.totalUsers} total</p>
          </a>

          <a
            href="/admin/verifications"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <BadgeCheck className="h-8 w-8 text-accent mb-2" />
            <p className="font-semibold text-foreground text-sm">Verifications</p>
            <p className="text-xs text-muted-foreground mt-0.5">Review documents</p>
          </a>

          <a
            href="/admin/promotions"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Star className="h-8 w-8 text-accent mb-2" />
            <p className="font-semibold text-foreground text-sm">Promotions</p>
            <p className="text-xs text-muted-foreground mt-0.5">{promoStats.promoted} active</p>
          </a>

          <a
            href="/admin/reports"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <AlertCircle className="h-8 w-8 text-accent mb-2" />
            <p className="font-semibold text-foreground text-sm">Reports</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stats.pendingReports} pending</p>
          </a>
        </div>
      </div>
    </div>
  );
}
