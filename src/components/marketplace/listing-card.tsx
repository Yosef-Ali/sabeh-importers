"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { Heart, MapPin, Clock, Shield } from "lucide-react";
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
  NEW: { label: "NEW_DELIVERY", className: "bg-accent text-primary border-0 font-mono" },
  LIKE_NEW: { label: "CERT_MINT", className: "bg-white/10 text-white border border-white/20 font-mono" },
  USED_GOOD: { label: "OP_GOOD", className: "bg-slate-800 text-white border-0 font-mono" },
  USED_FAIR: { label: "OP_FAIR", className: "bg-slate-700 text-white border-0 font-mono" },
  FOR_PARTS: { label: "SALVAGE", className: "bg-red-900/50 text-white border border-red-500/30 font-mono" },
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
  const [imgError, setImgError] = useState(false);
  const conditionStyle = CONDITION_STYLES[condition] || CONDITION_STYLES.USED_GOOD;

  return (
    <Card className={cn(
      "group overflow-hidden rounded-none border border-border bg-card shadow-hard transition-all duration-300 hover:-translate-y-1 hover:shadow-hard-navy hover:border-foreground/30",
      className
    )}>
      <Link href={`/listings/${id}`} className="block h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A192F]">
          {image && !imgError ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <PlaceholderImage title={title} category={_category} />
          )}

          {/* Badge Layer */}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between">
            <Badge className={cn("text-[8px] font-bold tracking-widest px-2 py-1 rounded-none uppercase", conditionStyle.className)}>
              {conditionStyle.label}
            </Badge>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLiked(!liked);
                if (!liked) {
                  toast.success("Log: Favorite Entry Created", { description: title });
                } else {
                  toast("Log: Favorite Entry Removed");
                }
              }}
              className="h-8 w-8 rounded-none bg-primary/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-all hover:bg-accent hover:text-primary"
            >
              <Heart className={cn("h-4 w-4 transition-all", liked && "fill-current")} />
            </button>
          </div>

          {(isFeatured || isPromoted) && (
            <div className="absolute left-3 bottom-0 bg-accent text-primary px-3 py-1 font-mono text-[8px] font-bold tracking-[0.2em]">
              {isFeatured ? "PRIORITY_MANIFEST" : "COMMERCIAL_SLOT"}
            </div>
          )}
        </div>

        {/* Content Area */}
        <CardContent className="p-5 border-t border-border">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xl font-bold text-foreground font-display tracking-tighter">
              {formatCurrency(price, (currency as any) || "ETB")}
            </span>
            {negotiable && (
              <span className="text-[9px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-none uppercase font-mono tracking-widest border border-border">
                OBO
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold leading-tight uppercase tracking-tight text-foreground group-hover:text-accent transition-colors mb-4 h-10 font-display line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono border-t border-border pt-4 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{location || "ADDIS_ABABA"}</span>
            </span>
            {createdAt && (
              <span className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <Clock className="h-3 w-3" />
                {timeAgo(createdAt)}
              </span>
            )}
          </div>

          {sellerName && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border border-border">
                <span className="text-[10px] font-bold text-foreground">{sellerName.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground truncate">{sellerName}</span>
              {sellerVerified && <Shield className="h-3 w-3 text-accent" />}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
