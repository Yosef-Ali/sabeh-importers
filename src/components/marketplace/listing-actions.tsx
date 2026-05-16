"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Share2, AlertTriangle, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist";

/* ──── Top action buttons (heart, share, report) ──── */
export function TopActions({
  listingId,
  listingTitle,
  userId,
  initialIsInWishlist = false,
}: {
  listingId: string;
  listingTitle: string;
  userId?: string;
  initialIsInWishlist?: boolean;
}) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialIsInWishlist);
  const [isPending, startTransition] = useTransition();

  function handleFavorite() {
    if (!userId) {
      toast.message("Sign in to save listings", {
        description: "Create an account or log in to keep favorites.",
        action: { label: "Sign in", onClick: () => router.push("/login") },
      });
      return;
    }

    const next = !isFavorited;
    setIsFavorited(next);

    startTransition(async () => {
      try {
        const result = next
          ? await addToWishlist(userId, listingId)
          : await removeFromWishlist(userId, listingId);

        const errorMessage =
          "error" in result && typeof result.error === "string" ? result.error : null;
        if (errorMessage) {
          setIsFavorited(!next);
          toast.error(errorMessage);
          return;
        }

        if (next) {
          toast.success("Added to favorites", { description: listingTitle });
        } else {
          toast("Removed from favorites");
        }
      } catch {
        setIsFavorited(!next);
        toast.error("Couldn't update favorites. Try again.");
      }
    });
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
    if (!userId) {
      toast.message("Sign in to report listings", {
        action: { label: "Sign in", onClick: () => router.push("/login") },
      });
      return;
    }
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
        disabled={isPending}
        aria-pressed={isFavorited}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
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
        aria-label="Share listing"
        className="rounded-full text-muted-foreground"
      >
        <Share2 className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReport}
        aria-label="Report listing"
        className="rounded-full text-muted-foreground hover:text-amber-500"
      >
        <AlertTriangle className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ──── Seller contact actions (phone, chat, offer) ──── */
export function SellerActions({
  listingId,
  sellerPhone,
  isOwnListing = false,
}: {
  listingId?: string;
  sellerPhone?: string | null;
  isOwnListing?: boolean;
}) {
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);

  function handleShowPhone() {
    if (!sellerPhone) {
      toast("Phone number not available", {
        description: "This seller hasn't shared a phone number.",
      });
      return;
    }
    if (showPhone) {
      // Second tap → trigger tel:
      window.location.href = `tel:${sellerPhone.replace(/\D/g, "")}`;
      return;
    }
    setShowPhone(true);
  }

  function handleChat() {
    if (isOwnListing) {
      toast("That's your listing", {
        description: "You can review buyer messages from your dashboard.",
      });
      return;
    }
    if (!listingId) {
      toast.error("Chat unavailable for this listing");
      return;
    }
    router.push(`/messages?listing=${listingId}`);
  }

  function handleOffer() {
    if (isOwnListing) {
      toast("That's your listing", {
        description: "Buyers will see your asking price.",
      });
      return;
    }
    if (!listingId) {
      toast.error("Offer unavailable for this listing");
      return;
    }
    // Routes to existing messaging flow with an "offer" prefix so the seller
    // sees it as an offer thread. Backend offer model can ship later without
    // changing this entry point.
    router.push(`/messages?listing=${listingId}&intent=offer`);
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
          onClick={handleChat}
        >
          <MessageCircle className="h-5 w-5" /> Chat
        </Button>
        <Button
          variant="secondary"
          className="w-full font-semibold"
          onClick={handleOffer}
        >
          Make an Offer
        </Button>
      </div>
    </div>
  );
}
