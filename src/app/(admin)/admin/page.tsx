import { getAdminStats } from "@/lib/actions/admin";
import { Card } from "@/components/ui/card";
import { Package, Users, AlertCircle, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Sabeh Market",
  description: "Admin dashboard for Sabeh Market",
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

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
              <CheckCircle className="h-7 w-7 text-green-600" />
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href="/admin/listings"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#FCDD09] hover:bg-[#FCDD09]/5 transition-colors"
          >
            <Package className="h-10 w-10 text-[#FCDD09] mb-3" />
            <p className="font-semibold text-[#1a2d4a]">Review Listings</p>
            <p className="text-sm text-gray-600 mt-1">{stats.pendingListings} pending</p>
          </a>

          <a
            href="/admin/users"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#FCDD09] hover:bg-[#FCDD09]/5 transition-colors"
          >
            <Users className="h-10 w-10 text-[#FCDD09] mb-3" />
            <p className="font-semibold text-[#1a2d4a]">Manage Users</p>
            <p className="text-sm text-gray-600 mt-1">{stats.totalUsers} total</p>
          </a>

          <a
            href="/admin/reports"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-[#FCDD09] hover:bg-[#FCDD09]/5 transition-colors"
          >
            <AlertCircle className="h-10 w-10 text-[#FCDD09] mb-3" />
            <p className="font-semibold text-[#1a2d4a]">Review Reports</p>
            <p className="text-sm text-gray-600 mt-1">{stats.pendingReports} pending</p>
          </a>
        </div>
      </div>
    </div>
  );
}
