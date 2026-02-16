import { getAllUsers } from "@/lib/actions/admin";
import { ShieldOff, ShieldCheck, User as UserIcon } from "lucide-react";
import { UserBanButton } from "@/components/admin/user-ban-button";
import { VerifyEmailButton } from "@/components/admin/verify-email-button";
import { InviteUserButton } from "@/components/admin/invite-user-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          <h1 className="text-3xl font-display font-bold text-primary">User Management</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">{total.toLocaleString()} registered users</p>
        </div>
        <InviteUserButton />
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name or email…"
          className="flex-1 rounded-card border-2 border-primary/10 bg-white dark:bg-card px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent max-w-sm"
        />
        <button
          type="submit"
          className="rounded-button bg-primary text-primary-foreground px-5 py-2.5 text-sm font-display font-bold hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden bg-white dark:bg-card rounded-card border-2 border-primary/10 shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/5 border-b-2 border-primary/10">
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">ID Verification</th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">Joined</th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/5 text-primary font-display font-bold">
                        {user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground font-display">{user.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
                      {user.phone && <p className="text-xs text-muted-foreground/70 font-mono">{user.phone}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-button text-xs font-mono font-bold border
                    ${user.role === "ADMIN" ? "bg-red-100 text-red-700 border-red-200" :
                      user.role === "SELLER" ? "bg-blue-100 text-blue-700 border-blue-200" :
                      user.role === "MANAGER" ? "bg-purple-100 text-purple-700 border-purple-200" :
                      "bg-gray-100 text-gray-700 border-gray-200"}`}>
                    {user.role}
                  </span>
                </td>
                {/* Email verified */}
                <td className="px-4 py-4">
                  <VerifyEmailButton
                    userId={user.id}
                    isEmailVerified={user.isEmailVerified}
                    userName={user.name}
                  />
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-button text-xs font-mono font-bold border
                    ${user.verificationStatus === "VERIFIED" ? "bg-green-100 text-green-700 border-green-200" :
                      user.verificationStatus === "PENDING" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                      "bg-gray-100 text-gray-700 border-gray-200"}`}>
                    {user.verificationStatus === "VERIFIED" ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                    {user.verificationStatus}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-button text-xs font-mono font-bold border
                    ${user.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                    {user.isActive ? "Active" : "Banned"}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground font-mono">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
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
          <p className="text-muted-foreground font-mono">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`?page=${page - 1}${search ? `&search=${search}` : ""}`}
                className="rounded-button border-2 border-primary/10 bg-white dark:bg-card px-4 py-2 font-display font-medium hover:bg-muted transition-colors"
              >
                Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`?page=${page + 1}${search ? `&search=${search}` : ""}`}
                className="rounded-button bg-primary text-primary-foreground px-4 py-2 font-display font-medium hover:bg-primary/90 transition-colors"
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
