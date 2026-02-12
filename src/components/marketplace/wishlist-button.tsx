"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  listingId: string;
  userId: string;
  initialIsInWishlist: boolean;
  variant?: "icon" | "button";
  className?: string;
}

export function WishlistButton({
  listingId,
  userId,
  initialIsInWishlist,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      if (isInWishlist) {
        await removeFromWishlist(userId, listingId);
        setIsInWishlist(false);
        toast.success("Removed from favorites");
      } else {
        await addToWishlist(userId, listingId);
        setIsInWishlist(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  }

  if (variant === "button") {
    return (
      <Button
        variant={isInWishlist ? "default" : "outline"}
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          isInWishlist
            ? "bg-[#FCDD09] hover:bg-[#e5c908] text-[#1a2d4a] border-[#FCDD09]"
            : "border-gray-300 text-gray-700 hover:bg-[#FCDD09]/10 hover:border-[#FCDD09]",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 mr-2",
            isInWishlist && "fill-current"
          )}
        />
        {isInWishlist ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-all",
        isInWishlist
          ? "bg-[#FCDD09] text-[#1a2d4a] shadow-md hover:bg-[#e5c908]"
          : "bg-white/90 text-gray-700 shadow-sm hover:bg-white hover:shadow-md",
        className
      )}
      aria-label={isInWishlist ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-transform",
          isInWishlist && "fill-current scale-110"
        )}
      />
    </button>
  );
}
