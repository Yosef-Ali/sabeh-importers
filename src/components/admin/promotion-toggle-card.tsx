"use client";

import { useState } from "react";
import { setListingPromotion } from "@/lib/actions/admin";
import { Star, TrendingUp, ExternalLink, Edit } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PromotionToggleCardProps {
  listing: any;
}

export function PromotionToggleCard({ listing }: PromotionToggleCardProps) {
  const [promoted, setPromoted] = useState(listing.isPromoted ?? false);
  const [featured, setFeatured] = useState(listing.isFeatured ?? false);
  const [promotedUntil, setPromotedUntil] = useState(
    listing.promotedUntil ? new Date(listing.promotedUntil).toISOString().split("T")[0] : ""
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function save(nextPromoted: boolean, nextFeatured: boolean, nextUntil: string | null) {
    setLoading(true);
    await setListingPromotion(listing.id, {
      isPromoted: nextPromoted,
      isFeatured: nextFeatured,
      promotedUntil: nextUntil ? new Date(nextUntil) : null,
    });
    setLoading(false);
    setOpen(false);
  }

  // Quick toggles (kept for convenience, but now just toggle boolean state without expiry)
  async function togglePromoted() {
    const next = !promoted;
    setPromoted(next);
    await setListingPromotion(listing.id, {
        isPromoted: next,
        isFeatured: featured,
        promotedUntil: next ? (promotedUntil ? new Date(promotedUntil) : null) : null
    });
  }

  async function toggleFeatured() {
    const next = !featured;
    setFeatured(next);
    await setListingPromotion(listing.id, {
        isPromoted: promoted,
        isFeatured: next,
        promotedUntil: promotedUntil ? new Date(promotedUntil) : null
    });
  }

  const handleEditSave = async () => {
      setPromoted(promoted);
      setFeatured(featured);
      await save(promoted, featured, promotedUntil || null);
  };

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group">
      {/* Listing image */}
      <div className="h-12 w-12 rounded-md bg-muted overflow-hidden flex-shrink-0 border border-border">
        {listing.images && listing.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-muted-foreground text-[10px] font-mono">No Image</span>
          </div>
        )}
      </div>

      {/* Listing info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/listings/${listing.id}`}
            target="_blank"
            className="font-display font-semibold text-primary hover:text-accent transition-colors truncate flex items-center gap-1.5"
          >
            {listing.title}
            <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {listing.category?.name} · {listing.seller?.name}
          {listing.promotedUntil && (
            <span className="ml-2 text-amber-600 font-bold">
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
          className={`flex items-center gap-1.5 rounded-button px-3 py-1.5 text-xs font-mono font-bold border transition-colors disabled:opacity-50
            ${promoted
              ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
              : "bg-primary/5 text-muted-foreground border-primary/10 hover:bg-primary/10"
            }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {promoted ? "Promoted" : "Promote"}
        </button>

        {/* Featured toggle */}
        <button
          onClick={toggleFeatured}
          disabled={loading}
          className={`flex items-center gap-1.5 rounded-button px-3 py-1.5 text-xs font-mono font-bold border transition-colors disabled:opacity-50
            ${featured
              ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
              : "bg-primary/5 text-muted-foreground border-primary/10 hover:bg-primary/10"
            }`}
        >
          <Star className="h-3.5 w-3.5" />
          {featured ? "Featured" : "Feature"}
        </button>

        {/* Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Promotion</DialogTitle>
                    <DialogDescription>
                        Set promotion status and expiry date for this listing.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="promoted-switch" className="flex flex-col gap-1">
                            <span>Promoted Status</span>
                            <span className="font-normal text-xs text-muted-foreground">Boosts visibility in search results</span>
                        </Label>
                        <Switch id="promoted-switch" checked={promoted} onCheckedChange={setPromoted} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <Label htmlFor="featured-switch" className="flex flex-col gap-1">
                            <span>Featured Status</span>
                            <span className="font-normal text-xs text-muted-foreground">Appears on homepage and key areas</span>
                        </Label>
                        <Switch id="featured-switch" checked={featured} onCheckedChange={setFeatured} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Promoted Until</Label>
                        <Input
                            id="date"
                            type="date"
                            value={promotedUntil}
                            onChange={(e) => setPromotedUntil(e.target.value)}
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Listing will stop being promoted/featured after this date.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleEditSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
