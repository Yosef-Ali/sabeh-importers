"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to reject listing");
      setIsProcessing(false);
    }
  }

  return (
    <Card className="p-6 border-gray-200">
      <div className="flex gap-6">
        {/* Image */}
        <div className="relative h-32 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#faf8f5]">
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-lg text-[#1a2d4a] line-clamp-1">
                {listing.title}
              </h3>
              <Badge
                variant={listing.status === "PENDING_REVIEW" ? "warning" : "outline"}
                className="flex-shrink-0"
              >
                {listing.status}
              </Badge>
            </div>
            <p className="text-gray-700 text-sm line-clamp-2">{listing.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="font-bold text-[#1a2d4a]">
              {Number(listing.price).toLocaleString()} ETB
            </span>
            <span>•</span>
            <span>{listing.category?.name}</span>
            <span>•</span>
            <span>By {listing.seller?.name}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Link href={`/listings/${listing.id}`} target="_blank">
              <Button variant="outline" className="border-gray-300">
                <ExternalLink className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
