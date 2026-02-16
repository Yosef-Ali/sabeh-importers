import { getAdminStats, getPromotionStats } from "@/lib/actions/admin";
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
        <h1 className="text-3xl font-display font-bold text-primary">Dashboard Overview</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">Monitor platform activity and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-6 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-button flex items-center justify-center shadow-hard">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-primary">
                {stats.totalUsers.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-wide">Total Users</div>
        </div>

        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-6 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-button flex items-center justify-center shadow-hard">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-primary">
                {stats.activeListings.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-wide">Active Listings</div>
        </div>

        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-6 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent rounded-button flex items-center justify-center shadow-hard">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-primary">
                {stats.pendingListings.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-wide">Pending Review</div>
        </div>

        <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-6 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-button flex items-center justify-center shadow-hard">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-primary">
                {stats.pendingReports.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-wide">Pending Reports</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-card rounded-card border-2 border-primary/10 p-8 shadow-card">
        <h2 className="text-xl font-display font-bold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <a
            href="/admin/listings"
            className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/20 p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Package className="h-8 w-8 text-accent mb-2" />
            <p className="font-display font-semibold text-primary text-sm">Review Listings</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{stats.pendingListings} pending</p>
          </a>

          <a
            href="/admin/users"
            className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/20 p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Users className="h-8 w-8 text-accent mb-2" />
            <p className="font-display font-semibold text-primary text-sm">Manage Users</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{stats.totalUsers} total</p>
          </a>

          <a
            href="/admin/verifications"
            className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/20 p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <BadgeCheck className="h-8 w-8 text-accent mb-2" />
            <p className="font-display font-semibold text-primary text-sm">Verifications</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">Review documents</p>
          </a>

          <a
            href="/admin/promotions"
            className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/20 p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Star className="h-8 w-8 text-accent mb-2" />
            <p className="font-display font-semibold text-primary text-sm">Promotions</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{promoStats.promoted} active</p>
          </a>

          <a
            href="/admin/reports"
            className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-primary/20 p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <AlertCircle className="h-8 w-8 text-accent mb-2" />
            <p className="font-display font-semibold text-primary text-sm">Reports</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{stats.pendingReports} pending</p>
          </a>
        </div>
      </div>
    </div>
  );
}
