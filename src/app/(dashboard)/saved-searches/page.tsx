import { getUserSavedSearches } from "@/lib/actions/saved-searches";
import { SavedSearchCard } from "@/components/marketplace/saved-search-card";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Saved Searches | Sabeh Market",
  description: "Manage your saved searches and price alerts",
};

export default async function SavedSearchesPage() {
  // In a real app, get userId from session
  const userId = "1";
  const savedSearches = await getUserSavedSearches(userId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a2d4a] flex items-center gap-3">
            <Bell className="h-8 w-8 text-[#FCDD09]" />
            Saved Searches
          </h1>
          <p className="text-muted-foreground mt-2">
            Get notified when new listings match your searches
          </p>
        </div>
        <Link href="/search">
          <Button className="bg-[#FCDD09] hover:bg-[#e5c908] text-[#1a2d4a] font-bold">
            <Search className="h-4 w-4 mr-2" />
            New Search
          </Button>
        </Link>
      </div>

      {/* Saved Searches */}
      {savedSearches.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#faf8f5] border border-[#FCDD09]/20">
            <Bell className="h-10 w-10 text-[#FCDD09]/60" />
          </div>
          <h3 className="text-xl font-bold text-[#1a2d4a] mb-2">No saved searches yet</h3>
          <p className="text-gray-600 max-w-sm mb-6">
            Save your searches to get notified when new listings match your criteria.
          </p>
          <Link href="/search">
            <Button className="bg-[#FCDD09] hover:bg-[#e5c908] text-[#1a2d4a] font-bold">
              <Search className="h-4 w-4 mr-2" />
              Browse Listings
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedSearches.map((search) => (
            <SavedSearchCard key={search.id} search={search} />
          ))}
        </div>
      )}
    </div>
  );
}
