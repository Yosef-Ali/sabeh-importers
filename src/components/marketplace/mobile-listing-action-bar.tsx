"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Tag } from "lucide-react";
import { toast } from "sonner";

/**
 * Mobile-only sticky action bar for the listing detail page.
 * Contact Seller (primary) + Make Offer (outline). Sits above the
 * MobileBottomTabs (bottom: 64px). Hidden ≥ md breakpoint — desktop
 * uses the inline Listing Actions panel instead.
 *
 * Pages mounting this need `pb-32` on their main scroll content so
 * the bar doesn't underlap the last items.
 *
 * Self-sufficient: handlers route to /messages with the listing context,
 * matching the desktop SellerActions flow. Parents can still override via
 * `onContact` / `onOffer` if they need bespoke behavior.
 */
export function MobileListingActionBar({
  listingId,
  isOwnListing = false,
  onContact,
  onOffer,
}: {
  listingId?: string;
  isOwnListing?: boolean;
  onContact?: () => void;
  onOffer?: () => void;
}) {
  const router = useRouter();

  function handleContact() {
    if (onContact) return onContact();
    if (isOwnListing) {
      toast("That's your listing", {
        description: "Buyer messages live in your dashboard.",
      });
      return;
    }
    if (!listingId) {
      toast.error("Contact unavailable for this listing");
      return;
    }
    router.push(`/messages?listing=${listingId}`);
  }

  function handleOffer() {
    if (onOffer) return onOffer();
    if (isOwnListing) {
      toast("That's your listing", {
        description: "You can update the price from your dashboard.",
      });
      return;
    }
    if (!listingId) {
      toast.error("Offer unavailable for this listing");
      return;
    }
    router.push(`/messages?listing=${listingId}&intent=offer`);
  }

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-16 z-30 bg-background border-t border-border px-4 py-3 flex gap-3"
      role="toolbar"
      aria-label="Listing actions"
    >
      <button
        onClick={handleOffer}
        aria-label="Make an offer on this listing"
        className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-none border border-foreground bg-transparent text-foreground font-display font-bold uppercase tracking-wider text-xs hover:bg-foreground/5 transition-colors"
      >
        <Tag className="h-4 w-4" />
        Make Offer
      </button>
      <button
        onClick={handleContact}
        aria-label="Contact seller"
        className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-none bg-[#FFD700] text-[#0A192F] shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-display font-bold uppercase tracking-wider text-xs transition-all"
      >
        <MessageSquare className="h-4 w-4" />
        Contact
      </button>
    </div>
  );
}
