"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { PlaceholderImage } from "./placeholder-image";

interface MarketplaceListingCardProps {
  listing: any;
  variant?: "premium" | "standard";
  className?: string;
}

export function MarketplaceListingCard({
  listing,
  variant = "standard",
  className
}: MarketplaceListingCardProps) {
  const isPremium = variant === "premium";

  const formattedPrice = formatCurrency(listing.price, listing.currency || "USD");
  const location = listing.city || listing.location || "Unknown Location";
  // Demo data for time if not present
  const timeDisplay = listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : "Just now";

  if (isPremium) {
    return (
      <div className={cn(
        "bg-card relative group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1",
        "border border-accent/30 hover:border-accent shadow-lg hover:shadow-accent/20 rounded-lg",
        className
      )}>
        {/* Pro Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-accent text-navy px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-full shadow-md">
            <ShieldCheck className="h-3 w-3" />
            Verified Partner
          </span>
        </div>

        <Link href={`/listings/${listing.id}`} className="block h-full flex flex-col">
          {/* Image Area */}
          <div className="aspect-[4/3] bg-navy/5 relative overflow-hidden">
            {listing.images && listing.images.length > 0 ? (
              <>
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
              </>
            ) : (
              <PlaceholderImage title={listing.title} />
            )}
            
            {/* Price Overlay for Premium */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
               <span className="text-white font-display font-bold text-xl tracking-tight drop-shadow-md">
                 {formattedPrice}
               </span>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1 gap-2 bg-gradient-to-b from-card to-muted/20">
            <h3 className="font-display font-bold text-lg leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors">
              {listing.title}
            </h3>

            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {listing.condition || "Excellent"}
              </span>
              <span>{location}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Standard Card
  return (
    <div className={cn(
      "bg-card group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
      "border border-border/60 hover:border-accent/50 rounded-lg",
      className
    )}>
      <Link href={`/listings/${listing.id}`} className="flex flex-col h-full">
        {/* Image Area */}
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
             <PlaceholderImage title={listing.title} />
          )}
          
          {/* Condition Badge */}
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white/90 px-2 py-0.5 text-[10px] font-mono rounded-sm border border-white/10">
            {listing.condition || "Used"}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow gap-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-display font-bold text-base leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </div>
          
          <div className="mt-1">
             <p className="font-display font-bold text-lg text-foreground tracking-tight group-hover:text-accent transition-colors">
               {formattedPrice}
             </p>
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-muted-foreground font-mono border-t border-border/40">
            <span className="truncate max-w-[60%]">{location}</span>
            <span>{timeDisplay}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
