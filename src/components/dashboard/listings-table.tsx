"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Edit, Trash2, Package, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ListingSheet } from "@/components/marketplace/listing-sheet";

interface Listing {
  id: string;
  title: string;
  price: string;
  currency?: string | null;
  status: "ACTIVE" | "PENDING_REVIEW" | "EXPIRED" | "SOLD" | "DELETED";
  images?: string[] | null;
  viewCount?: number | null;
  createdAt: Date | null;
  category?: {
    name: string;
  } | null;
  description?: string | null;
  negotiable?: boolean | null;
  condition?: "NEW" | "LIKE_NEW" | "USED_GOOD" | "USED_FAIR" | "FOR_PARTS" | null;
  city?: string | null;
  region?: string | null;
  contactPhone?: string | null;
  categoryId?: string | null;
}

interface ListingsTableProps {
  listings: Listing[];
  language?: "en" | "am";
  onDelete?: (listingId: string) => Promise<void>;
  categories: { id: string; name: string }[];
}

const STATUS_CONFIG = {
  ACTIVE: {
    label: "Active",
    labelAm: "ንቁ",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  PENDING_REVIEW: {
    label: "Pending",
    labelAm: "በመጠባበቅ ላይ",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  EXPIRED: {
    label: "Expired",
    labelAm: "ጊዜው አልፏል",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  SOLD: {
    label: "Sold",
    labelAm: "ተሽጧል",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  DELETED: {
    label: "Deleted",
    labelAm: "ተሰርዟል",
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

export function ListingsTable({
  listings,
  language = "en",
  onDelete,
  categories,
}: ListingsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | undefined>(undefined);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setIsSheetOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setDeletingId(deleteTargetId);
      if (onDelete) {
        await onDelete(deleteTargetId);
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    } finally {
      setDeletingId(null);
      setDeleteTargetId(null);
    }
  };

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-card border-2 border-dashed border-primary/20 p-12 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-display font-bold text-primary mb-2">
          {language === "am" ? "ምንም ዝርዝሮች የሉም" : "No Listings Yet"}
        </h3>
        <p className="text-muted-foreground font-mono text-sm mb-6">
          {language === "am"
            ? "የእርስዎን የመጀመሪያ ዝርዝር ያትሙ"
            : "Create your first listing to get started"}
        </p>
        <Link href="/dashboard/marketplace/create">
          <Button variant="accent" size="lg" className="font-display font-bold">
            {language === "am" ? "ዝርዝር ፍጠር" : "Create Listing"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-card border-2 border-primary/10 overflow-hidden shadow-card">
        <table className="w-full">
          <thead className="bg-primary/5 border-b-2 border-primary/10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">
                {language === "am" ? "ዝርዝር" : "Listing"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">
                {language === "am" ? "ዋጋ" : "Price"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">
                {language === "am" ? "ሁኔታ" : "Status"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">
                {language === "am" ? "እይታዎች" : "Views"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-mono font-bold text-primary uppercase tracking-wider">
                {language === "am" ? "ቀን" : "Date"}
              </th>
              <th className="px-4 py-3 text-center text-xs font-mono font-bold text-primary uppercase tracking-wider">
                {language === "am" ? "ድርጊቶች" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {listings.map((listing) => {
              const statusConfig =
                STATUS_CONFIG[listing.status] || STATUS_CONFIG.ACTIVE;

              return (
                <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 bg-muted rounded-card overflow-hidden flex-shrink-0 border border-border">
                        {listing.images && listing.images.length > 0 ? (
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      {/* Title & Category */}
                      <div className="min-w-0">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="font-medium text-foreground hover:text-accent transition-colors line-clamp-1 font-display"
                        >
                          {listing.title}
                        </Link>
                        {listing.category && (
                          <div className="text-xs text-muted-foreground font-mono mt-1">
                            {listing.category.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-primary font-display">
                      {listing.currency || "ETB"}{" "}
                      {parseFloat(listing.price).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-button text-xs font-mono font-bold border",
                        statusConfig.color
                      )}
                    >
                      {language === "am"
                        ? statusConfig.labelAm
                        : statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-muted-foreground font-mono text-sm">
                      <Eye className="h-4 w-4" />
                      {listing.viewCount || 0}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-muted-foreground font-mono">
                      {listing.createdAt
                        ? new Date(listing.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/listings/${listing.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(listing)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTargetId(listing.id)}
                        disabled={deletingId === listing.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {listings.map((listing) => {
          const statusConfig =
            STATUS_CONFIG[listing.status] || STATUS_CONFIG.ACTIVE;

          return (
            <div
              key={listing.id}
              className="bg-white rounded-card border-2 border-primary/10 p-4 shadow-card"
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 bg-muted rounded-card overflow-hidden flex-shrink-0 border border-border">
                  {listing.images && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2 font-display mb-1"
                  >
                    {listing.title}
                  </Link>
                  <div className="text-lg font-bold text-primary font-display mb-1">
                    {listing.currency || "ETB"}{" "}
                    {parseFloat(listing.price).toLocaleString()}
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-button text-xs font-mono font-bold border",
                      statusConfig.color
                    )}
                  >
                    {language === "am"
                      ? statusConfig.labelAm
                      : statusConfig.label}
                  </span>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/listings/${listing.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        {language === "am" ? "እይ" : "View"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(listing)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {language === "am" ? "አርትዕ" : "Edit"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteTargetId(listing.id)}
                      disabled={deletingId === listing.id}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {language === "am" ? "ሰርዝ" : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono border-t border-border pt-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {listing.viewCount || 0}
                </div>
                <div>
                  {listing.createdAt
                    ? new Date(listing.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
                {listing.category && <div>{listing.category.name}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <ListingSheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) setEditingListing(undefined);
        }}
        listing={editingListing}
        categories={categories}
        language={language}
      />

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "am" ? "ዝርዝር ሰርዝ" : "Delete Listing"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "am"
                ? "እርግጠኛ ነዎት ይህን ዝርዝር መሰረዝ ይፈልጋሉ? ይህ ተግባር ሊቀለበስ አይችልም።"
                : "Are you sure you want to delete this listing? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>
              {language === "am" ? "ሰርዝ" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={!!deletingId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId ? "..." : language === "am" ? "አዎ፣ ሰርዝ" : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
