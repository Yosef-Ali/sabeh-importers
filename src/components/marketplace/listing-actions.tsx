"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, AlertTriangle, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";

/* ──── Top action buttons (heart, share, report) ──── */
export function TopActions({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const [isFavorited, setIsFavorited] = useState(false);

  function handleFavorite() {
    setIsFavorited((prev) => !prev);
    if (!isFavorited) {
      toast.success("Added to favorites", { description: listingTitle });
    } else {
      toast("Removed from favorites");
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/listings/${listingId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listingTitle,
          text: `Check out "${listingTitle}" on Sabeh Market`,
          url,
        });
        return;
      } catch {
        // Fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  function handleReport() {
    toast("Report submitted", {
      description: "Our team will review this listing.",
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleFavorite}
        className={`rounded-full transition-all ${
          isFavorited
            ? "text-red-500 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
            : "text-muted-foreground hover:text-red-500 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
        }`}
      >
        <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleShare}
        className="rounded-full text-muted-foreground"
      >
        <Share2 className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReport}
        className="rounded-full text-muted-foreground hover:text-amber-500"
      >
        <AlertTriangle className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ──── Seller contact actions (phone, chat, offer) ──── */
export function SellerActions({
  sellerPhone,
}: {
  sellerPhone?: string | null;
}) {
  const [showPhone, setShowPhone] = useState(false);

  function handleShowPhone() {
    setShowPhone(true);
    if (sellerPhone) {
      toast.success("Phone number revealed", { description: sellerPhone });
    }
  }

  return (
    <div className="grid gap-3">
      <Button
        onClick={handleShowPhone}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 text-base font-semibold"
      >
        <Phone className="h-5 w-5" />
        {showPhone && sellerPhone ? sellerPhone : "Show Phone Number"}
      </Button>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full gap-2 font-semibold"
          onClick={() => toast("Chat feature coming soon")}
        >
          <MessageCircle className="h-5 w-5" /> Chat
        </Button>
        <Button
          variant="secondary"
          className="w-full font-semibold"
          onClick={() => toast("Offer feature coming soon")}
        >
          Make an Offer
        </Button>
      </div>
    </div>
  );
}
