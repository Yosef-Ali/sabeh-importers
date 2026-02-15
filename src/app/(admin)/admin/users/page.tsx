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
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">{total.toLocaleString()} registered users</p>
        </div>
        <InviteUserButton />
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name or email…"
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent max-w-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-5 py-3 text-left font-bold text-foreground text-xs uppercase tracking-wide">User</th>
              <th className="px-5 py-3 text-left font-bold text-foreground text-xs uppercase tracking-wide">Role</th>
              <th className="px-5 py-3 text-left font-bold text-foreground text-xs uppercase tracking-wide">Email</th>
              <th className="px-5 py-3 text-left font-bold text-foreground text-xs uppercase tracking-wide">ID Verification</th>
              <th className="px-5 py-3 text-left font-bold text-foreground text-xs uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left font-bold text-foreground text-xs uppercase tracking-wide">Joined</th>
              <th className="px-5 py-3 text-left font-bold text-foreground text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, i) => (
              <tr
                key={user.id}
                className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/50" : ""}`}
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.phone && <p className="text-xs text-muted-foreground/70">{user.phone}</p>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide
                    ${user.role === "ADMIN" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" :
                      user.role === "SELLER" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" :
                      user.role === "MANAGER" ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400" :
                      "bg-muted text-muted-foreground"}`}>
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
                    ${user.verificationStatus === "VERIFIED" ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" :
                      user.verificationStatus === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400" :
                      "bg-muted text-muted-foreground"}`}>
                    {user.verificationStatus === "VERIFIED" ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                    {user.verificationStatus}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold
                    ${user.isActive ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"}`}>
                    {user.isActive ? "Active" : "Banned"}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
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
          <p className="text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`?page=${page - 1}${search ? `&search=${search}` : ""}`}
                className="rounded-lg border border-border bg-card px-4 py-2 font-medium hover:bg-muted transition-colors"
              >
                Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`?page=${page + 1}${search ? `&search=${search}` : ""}`}
                className="rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90 transition-colors"
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
