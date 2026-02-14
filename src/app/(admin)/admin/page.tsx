import { getAdminStats, getPromotionStats } from "@/lib/actions/admin";
import { Card } from "@/components/ui/card";
import { Package, Users, AlertCircle, CheckCircle2, BadgeCheck, Star } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Sabeh Market",
  description: "Admin dashboard for Sabeh Market",
};

export default async function AdminDashboardPage() {
  const [stats, promoStats] = await Promise.all([getAdminStats(), getPromotionStats()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1a2d4a]">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor platform activity and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide font-bold">Total Users</p>
              <p className="text-3xl font-bold text-[#1a2d4a] tabular-nums mt-1">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide font-bold">Active Listings</p>
              <p className="text-3xl font-bold text-[#1a2d4a] tabular-nums mt-1">
                {stats.activeListings.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
              <Package className="h-7 w-7 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide font-bold">Pending Review</p>
              <p className="text-3xl font-bold text-[#1a2d4a] tabular-nums mt-1">
                {stats.pendingListings.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide font-bold">Pending Reports</p>
              <p className="text-3xl font-bold text-[#1a2d4a] tabular-nums mt-1">
                {stats.pendingReports.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <h2 className="text-xl font-bold text-[#1a2d4a] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <a
            href="/admin/listings"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#FCDD09] hover:bg-[#FCDD09]/5 transition-colors"
          >
            <Package className="h-8 w-8 text-[#FCDD09] mb-2" />
            <p className="font-semibold text-[#1a2d4a] text-sm">Review Listings</p>
            <p className="text-xs text-gray-600 mt-0.5">{stats.pendingListings} pending</p>
          </a>

          <a
            href="/admin/users"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#FCDD09] hover:bg-[#FCDD09]/5 transition-colors"
          >
            <Users className="h-8 w-8 text-[#FCDD09] mb-2" />
            <p className="font-semibold text-[#1a2d4a] text-sm">Manage Users</p>
            <p className="text-xs text-gray-600 mt-0.5">{stats.totalUsers} total</p>
          </a>

          <a
            href="/admin/verifications"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#FCDD09] hover:bg-[#FCDD09]/5 transition-colors"
          >
            <BadgeCheck className="h-8 w-8 text-[#FCDD09] mb-2" />
            <p className="font-semibold text-[#1a2d4a] text-sm">Verifications</p>
            <p className="text-xs text-gray-600 mt-0.5">Review documents</p>
          </a>

          <a
            href="/admin/promotions"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#FCDD09] hover:bg-[#FCDD09]/5 transition-colors"
          >
            <Star className="h-8 w-8 text-[#FCDD09] mb-2" />
            <p className="font-semibold text-[#1a2d4a] text-sm">Promotions</p>
            <p className="text-xs text-gray-600 mt-0.5">{promoStats.promoted} active</p>
          </a>

          <a
            href="/admin/reports"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#FCDD09] hover:bg-[#FCDD09]/5 transition-colors"
          >
            <AlertCircle className="h-8 w-8 text-[#FCDD09] mb-2" />
            <p className="font-semibold text-[#1a2d4a] text-sm">Reports</p>
            <p className="text-xs text-gray-600 mt-0.5">{stats.pendingReports} pending</p>
          </a>
        </div>
      </div>
    </div>
  );
}
