import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserListingsWithStats } from "@/lib/actions/marketplace";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { ListingsTable } from "@/components/dashboard/listings-table";
import { deleteListing } from "@/lib/actions/marketplace";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "My Listings | Sabeh Importers",
  description: "Manage your marketplace listings",
};

export default async function MyListingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/api/auth/clear-session");

  const userId = currentUser.id;

  // Fetch user listings with statistics
  const { listings, stats } = await getUserListingsWithStats(userId);

  // Server action for deleting listings
  async function handleDelete(listingId: string) {
    "use server";
    await deleteListing(listingId);
    revalidatePath("/dashboard/my-listings");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary tracking-tight">
            My Listings
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Manage your marketplace advertisements
          </p>
        </div>
        <Link href="/dashboard/marketplace/create">
          <Button
            variant="accent"
            size="lg"
            className="font-display font-bold shadow-hard-navy"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Listing
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <DashboardStats stats={stats} language="en" />

      {/* Listings Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-primary">
            All Listings
          </h2>
        </div>
        <ListingsTable
          listings={listings as any}
          language="en"
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
