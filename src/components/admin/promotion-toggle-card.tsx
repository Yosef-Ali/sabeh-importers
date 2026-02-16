"use client";

import { useState } from "react";
import { setListingPromotion } from "@/lib/actions/admin";
import { Star, TrendingUp, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PromotionToggleCardProps {
  listing: any;
}

export function PromotionToggleCard({ listing }: PromotionToggleCardProps) {
  const [promoted, setPromoted] = useState(listing.isPromoted ?? false);
  const [featured, setFeatured] = useState(listing.isFeatured ?? false);
  const [loading, setLoading] = useState(false);

  async function save(nextPromoted: boolean, nextFeatured: boolean) {
    setLoading(true);
    await setListingPromotion(listing.id, {
      isPromoted: nextPromoted,
      isFeatured: nextFeatured,
    });
    setLoading(false);
  }

  async function togglePromoted() {
    const next = !promoted;
    setPromoted(next);
    await save(next, featured);
  }

  async function toggleFeatured() {
    const next = !featured;
    setFeatured(next);
    await save(promoted, next);
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/60 transition-colors">
      {/* Listing info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/listings/${listing.id}`}
            target="_blank"
            className="font-semibold text-foreground hover:text-accent transition-colors truncate flex items-center gap-1.5"
          >
            {listing.title}
            <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {listing.category?.name} · {listing.seller?.name}
          {listing.promotedUntil && (
            <span className="ml-2 text-amber-600 dark:text-amber-400">
              Expires {new Date(listing.promotedUntil).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>

      {/* Promoted toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePromoted}
          disabled={loading}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50
            ${promoted
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {promoted ? "Promoted" : "Promote"}
        </button>

        {/* Featured toggle */}
        <button
          onClick={toggleFeatured}
          disabled={loading}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50
            ${featured
              ? "bg-accent/20 text-foreground hover:bg-accent/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
        >
          <Star className="h-3.5 w-3.5" />
          {featured ? "Featured" : "Feature"}
        </button>
      </div>
    </div>
  );
}
