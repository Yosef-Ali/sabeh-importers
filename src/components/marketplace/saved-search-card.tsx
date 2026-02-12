"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash2, ExternalLink, Bell, BellOff } from "lucide-react";
import { deleteSavedSearch, toggleSearchAlert } from "@/lib/actions/saved-searches";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface SavedSearchCardProps {
  search: any;
}

export function SavedSearchCard({ search }: SavedSearchCardProps) {
  const router = useRouter();
  const [alertEnabled, setAlertEnabled] = useState(search.alertEnabled);
  const [isDeleting, setIsDeleting] = useState(false);

  // Build search URL from filters
  const searchUrl = new URLSearchParams();
  const filters = search.filters || {};

  if (search.query) searchUrl.set("query", search.query);
  if (search.categoryId) searchUrl.set("categoryId", search.categoryId);
  if (filters.minPrice) searchUrl.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) searchUrl.set("maxPrice", filters.maxPrice.toString());
  if (filters.condition) searchUrl.set("condition", filters.condition);
  if (filters.sort) searchUrl.set("sort", filters.sort);

  async function handleToggleAlert() {
    const newValue = !alertEnabled;
    setAlertEnabled(newValue);

    try {
      await toggleSearchAlert(search.id, newValue);
      toast.success(newValue ? "Alerts enabled" : "Alerts disabled");
      router.refresh();
    } catch (error) {
      setAlertEnabled(!newValue);
      toast.error("Failed to update alert");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this saved search?")) return;

    setIsDeleting(true);
    try {
      await deleteSavedSearch(search.id);
      toast.success("Saved search deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete search");
      setIsDeleting(false);
    }
  }

  return (
    <Card className="p-5 border-gray-200 hover:border-[#FCDD09]/50 transition-colors">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#1a2d4a] truncate">{search.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Created {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-shrink-0 h-8 w-8 text-gray-500 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {search.query && (
            <Badge variant="outline" className="text-xs border-[#FCDD09]/30">
              Search: "{search.query}"
            </Badge>
          )}
          {filters.minPrice && (
            <Badge variant="outline" className="text-xs border-[#FCDD09]/30">
              Min: {filters.minPrice} ETB
            </Badge>
          )}
          {filters.maxPrice && (
            <Badge variant="outline" className="text-xs border-[#FCDD09]/30">
              Max: {filters.maxPrice} ETB
            </Badge>
          )}
          {filters.condition && (
            <Badge variant="outline" className="text-xs border-[#FCDD09]/30">
              {filters.condition}
            </Badge>
          )}
        </div>

        {/* Alert Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {alertEnabled ? (
              <Bell className="h-4 w-4 text-[#FCDD09]" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-700">Price Alerts</span>
          </div>
          <Switch checked={alertEnabled} onCheckedChange={handleToggleAlert} />
        </div>

        {/* View Results Button */}
        <Link href={`/search?${searchUrl.toString()}`}>
          <Button
            variant="outline"
            className="w-full border-[#FCDD09]/30 text-[#1a2d4a] hover:bg-[#FCDD09]/10 hover:border-[#FCDD09]"
          >
            View Results
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
