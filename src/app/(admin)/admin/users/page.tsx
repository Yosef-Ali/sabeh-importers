import { getAllUsers } from "@/lib/actions/admin";
import { ShieldOff, ShieldCheck } from "lucide-react";
import { UserBanButton } from "@/components/admin/user-ban-button";
import { VerifyEmailButton } from "@/components/admin/verify-email-button";
import { InviteUserButton } from "@/components/admin/invite-user-button";

export const metadata = {
  title: "User Management | Admin",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const search = searchParams.search;

  const { data: usersData, total, totalPages } = await getAllUsers(page, 30, search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a2d4a]">User Management</h1>
          <p className="text-gray-600 mt-1">{total.toLocaleString()} registered users</p>
        </div>
        <InviteUserButton />
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name or email…"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCDD09] max-w-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#1a2d4a] text-white px-5 py-2.5 text-sm font-bold hover:bg-[#2d4a6f] transition-colors"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#faf8f5]">
              <th className="px-5 py-3 text-left font-bold text-[#1a2d4a] text-xs uppercase tracking-wide">User</th>
              <th className="px-5 py-3 text-left font-bold text-[#1a2d4a] text-xs uppercase tracking-wide">Role</th>
              <th className="px-5 py-3 text-left font-bold text-[#1a2d4a] text-xs uppercase tracking-wide">Email</th>
              <th className="px-5 py-3 text-left font-bold text-[#1a2d4a] text-xs uppercase tracking-wide">ID Verification</th>
              <th className="px-5 py-3 text-left font-bold text-[#1a2d4a] text-xs uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left font-bold text-[#1a2d4a] text-xs uppercase tracking-wide">Joined</th>
              <th className="px-5 py-3 text-left font-bold text-[#1a2d4a] text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, i) => (
              <tr
                key={user.id}
                className={`border-b border-gray-50 last:border-0 ${i % 2 === 1 ? "bg-[#faf8f5]/50" : ""}`}
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-[#1a2d4a]">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide
                    ${user.role === "ADMIN" ? "bg-red-100 text-red-700" :
                      user.role === "SELLER" ? "bg-blue-100 text-blue-700" :
                      user.role === "MANAGER" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                </td>
                {/* Email verified */}
                <td className="px-5 py-4">
                  <VerifyEmailButton
                    userId={user.id}
                    isEmailVerified={user.isEmailVerified}
                    userName={user.name}
                  />
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold
                    ${user.verificationStatus === "VERIFIED" ? "bg-green-100 text-green-700" :
                      user.verificationStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-500"}`}>
                    {user.verificationStatus === "VERIFIED" ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                    {user.verificationStatus}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold
                    ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {user.isActive ? "Active" : "Banned"}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <UserBanButton
                    userId={user.id}
                    isActive={user.isActive}
                    userName={user.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`?page=${page - 1}${search ? `&search=${search}` : ""}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium hover:bg-[#faf8f5] transition-colors"
              >
                Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`?page=${page + 1}${search ? `&search=${search}` : ""}`}
                className="rounded-lg bg-[#1a2d4a] text-white px-4 py-2 font-medium hover:bg-[#2d4a6f] transition-colors"
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
