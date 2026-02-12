"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { Heart, MapPin, Clock, Star, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { PlaceholderImage } from "./placeholder-image";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string | null;
  location: string | null;
  condition: string;
  category: string;
  negotiable?: boolean;
  isFeatured?: boolean;
  isPromoted?: boolean;
  sellerName?: string;
  sellerVerified?: boolean;
  createdAt?: string;
  className?: string;
}

const CONDITION_STYLES: Record<string, { label: string; className: string }> = {
  NEW: { label: "NEW", className: "bg-emerald-500/90 text-white border-0" },
  LIKE_NEW: { label: "LIKE NEW", className: "bg-sky-500/90 text-white border-0" },
  USED_GOOD: { label: "GOOD", className: "bg-amber-500/90 text-white border-0" },
  USED_FAIR: { label: "FAIR", className: "bg-orange-500/90 text-white border-0" },
  FOR_PARTS: { label: "PARTS", className: "bg-slate-500/90 text-white border-0" },
};

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export function ListingCard({
  id, title, price, currency, image, location, condition, category: _category,
  negotiable = true, isFeatured = false, isPromoted = false,
  sellerName, sellerVerified = false, createdAt, className
}: ListingCardProps) {
  const [liked, setLiked] = useState(false);
  const conditionStyle = CONDITION_STYLES[condition] || CONDITION_STYLES.USED_GOOD;

  return (
    <Card className={cn(
      "group overflow-hidden border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20",
      className
    )}>
      <Link href={`/listings/${id}`} className="block h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <PlaceholderImage title={title} category={_category} />
          )}

          {/* Gradients & Overlays */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          
          {/* Badge Layer */}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between">
            <Badge className={cn("text-[10px] font-bold tracking-wider px-2 py-0.5", conditionStyle.className)}>
              {conditionStyle.label}
            </Badge>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLiked(!liked);
                if (!liked) {
                  toast.success("Added to favorites", { description: title });
                } else {
                  toast("Removed from favorites");
                }
              }}
              className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white hover:text-red-500"
            >
              <Heart className={cn("h-4 w-4 transition-all", liked && "fill-current")} />
            </button>
          </div>

          {(isFeatured || isPromoted) && (
            <div className="absolute left-3 bottom-3">
              <Badge className="bg-primary text-primary-foreground border-0 text-[10px] font-bold tracking-widest px-2 py-0.5 shadow-lg">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {isFeatured ? "FEATURED" : "PROMOTED"}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Area */}
        <CardContent className="p-4">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-xl font-bold text-foreground font-montserrat tabular-nums tracking-tight">
              {formatCurrency(price, (currency as any) || "ETB")}
            </span>
            {negotiable && (
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
                Negotiable
              </span>
            )}
          </div>

          <h3 className="text-sm font-medium leading-relaxed line-clamp-2 text-foreground/80 group-hover:text-primary transition-colors mb-3 h-10">
            {title}
          </h3>

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
              <span className="truncate">{location || "Addis Ababa"}</span>
            </span>
            {createdAt && (
              <span className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo(createdAt)}
              </span>
            )}
          </div>

          {sellerName && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-[10px] font-bold text-primary">{sellerName.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs font-medium text-foreground/60 truncate">{sellerName}</span>
              {sellerVerified && <Shield className="h-3 w-3 text-primary" />}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
