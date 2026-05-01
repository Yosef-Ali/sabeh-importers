"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ExternalLink } from "lucide-react";
import { approveListing, rejectListing } from "@/lib/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ListingModerationCardProps {
  listing: any;
}

export function ListingModerationCard({ listing }: ListingModerationCardProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleApprove() {
    if (!confirm("Approve this listing?")) return;
    setIsProcessing(true);
    try {
      await approveListing(listing.id);
      toast.success("Listing approved");
      router.refresh();
    } catch {
      toast.error("Failed to approve listing");
      setIsProcessing(false);
    }
  }

  async function handleReject() {
    if (!confirm("Reject this listing? The seller will be notified.")) return;
    setIsProcessing(true);
    try {
      await rejectListing(listing.id);
      toast.success("Listing rejected");
      router.refresh();
    } catch {
      toast.error("Failed to reject listing");
      setIsProcessing(false);
    }
  }

  return (
    // Card: rounded-none shadow-hard (was rounded-none shadow-card)
    <div className="bg-white dark:bg-card rounded-none border border-border p-6 shadow-hard">
      <div className="flex gap-6">

        {/* Image: rounded-none (was rounded-none) */}
        <div className="relative h-32 w-32 flex-shrink-0 rounded-none overflow-hidden bg-muted border border-border">
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-display font-bold text-lg uppercase tracking-tight text-primary line-clamp-1">
                {listing.title}
              </h3>
              {/* Badge inherits rounded-none from updated badge.tsx */}
              <Badge
                variant={listing.status === "PENDING_REVIEW" ? "warning" : "outline"}
                className="flex-shrink-0"
              >
                {listing.status}
              </Badge>
            </div>
            <p className="font-body text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            <span className="font-display font-bold text-sm text-primary">
              {Number(listing.price).toLocaleString()} ETB
            </span>
            <span className="text-border">·</span>
            <span>{listing.category?.name}</span>
            <span className="text-border">·</span>
            <span>By {listing.seller?.name}</span>
            <span className="text-border">·</span>
            <span>{formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {/* Approve — rounded-none, hard shadow, hover translate */}
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-none bg-green-600 text-white px-5 py-2 font-display text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#14532d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Approve
            </button>

            {/* Reject — rounded-none, border-destructive */}
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-none bg-transparent text-destructive border border-destructive px-5 py-2 font-display text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Reject
            </button>

            {/* View — rounded-none outline */}
            <Link href={`/listings/${listing.id}`} target="_blank">
              <button className="flex items-center gap-2 rounded-none bg-transparent text-foreground border border-border px-5 py-2 font-display text-xs font-bold uppercase tracking-wider hover:border-foreground transition-colors">
                <ExternalLink className="h-4 w-4" />
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
